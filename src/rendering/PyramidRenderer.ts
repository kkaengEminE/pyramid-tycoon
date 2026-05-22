import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { TILE_W, TILE_H, PYRAMID_LAYERS, PYRAMID_BASE_X, PYRAMID_BASE_Y, COLORS } from '../config';
import { worldToScreen } from '../math/isometric';
import { PyramidModel, MazeCell, ROOM_CONFIGS } from '../data/PyramidModel';

export class PyramidRenderer {
  container: Container;
  private layerContainers: Container[] = [];
  private interiorContainer: Container;
  private interiorGraphics: Graphics;
  private hoveredLayer = -1;
  private pyramidGraphics: Graphics;
  private model: PyramidModel;

  constructor(model: PyramidModel) {
    this.model = model;
    this.container = new Container();
    this.pyramidGraphics = new Graphics();
    this.interiorContainer = new Container();
    this.interiorGraphics = new Graphics();
    this.interiorContainer.addChild(this.interiorGraphics);
    this.interiorContainer.visible = false;

    this.container.addChild(this.pyramidGraphics);
    this.container.addChild(this.interiorContainer);

    this.drawPyramid();
  }

  private drawPyramid(): void {
    const g = this.pyramidGraphics;
    g.clear();

    const baseSize = 14;
    const cx = PYRAMID_BASE_X;
    const cy = PYRAMID_BASE_Y;

    // Ghost outline showing full pyramid silhouette
    this.drawGhostOutline(g, cx, cy, baseSize);

    const drawUpTo = Math.min(this.model.currentLayer + 1, PYRAMID_LAYERS);
    for (let layer = 0; layer < drawUpTo; layer++) {
      const layerData = this.model.layers[layer];
      if (!layerData) continue;

      const shrink = layer * 0.42;
      const halfW = (baseSize - shrink) / 2;
      const z = layer * 0.8;

      if (halfW <= 0.2) break;

      const progress = layerData.complete ? 1 : layerData.stonesPlaced / layerData.stonesRequired;

      // Top face
      const t1 = worldToScreen(cx - halfW, cy - halfW, z + 0.8);
      const t2 = worldToScreen(cx + halfW, cy - halfW, z + 0.8);
      const t3 = worldToScreen(cx + halfW, cy + halfW, z + 0.8);
      const t4 = worldToScreen(cx - halfW, cy + halfW, z + 0.8);

      g.moveTo(t1.sx, t1.sy);
      g.lineTo(t2.sx, t2.sy);
      g.lineTo(t3.sx, t3.sy);
      g.lineTo(t4.sx, t4.sy);
      g.closePath();
      g.fill(COLORS.pyramidHighlight);

      // Right face
      const b3 = worldToScreen(cx + halfW, cy + halfW, z);
      const b2 = worldToScreen(cx + halfW, cy - halfW, z);

      g.moveTo(t2.sx, t2.sy);
      g.lineTo(b2.sx, b2.sy);
      g.lineTo(b3.sx, b3.sy);
      g.lineTo(t3.sx, t3.sy);
      g.closePath();
      g.fill(COLORS.pyramid);

      // Left face
      const b4 = worldToScreen(cx - halfW, cy + halfW, z);

      g.moveTo(t3.sx, t3.sy);
      g.lineTo(b3.sx, b3.sy);
      g.lineTo(b4.sx, b4.sy);
      g.lineTo(t4.sx, t4.sy);
      g.closePath();
      g.fill(COLORS.pyramidShadow);

      // Grid lines for texture
      if (halfW > 2) {
        const steps = Math.max(2, Math.floor(halfW));
        for (let i = 1; i < steps; i++) {
          const frac = i / steps;
          const rx = t2.sx + (b2.sx - t2.sx) * frac;
          const ry = t2.sy + (b2.sy - t2.sy) * frac;
          const rx2 = t3.sx + (b3.sx - t3.sx) * frac;
          const ry2 = t3.sy + (b3.sy - t3.sy) * frac;
          g.moveTo(rx, ry);
          g.lineTo(rx2, ry2);
          g.stroke({ color: COLORS.pyramidShadow, width: 0.5, alpha: 0.3 });
        }
      }

      // Incomplete layer progress indicator
      if (!layerData.complete && progress > 0 && progress < 1) {
        const pw = halfW * 2 * progress;
        const pt1 = worldToScreen(cx - halfW, cy - halfW, z + 0.8);
        const pt2 = worldToScreen(cx - halfW + pw, cy - halfW, z + 0.8);
        const pt3 = worldToScreen(cx - halfW + pw, cy + halfW, z + 0.8);
        const pt4 = worldToScreen(cx - halfW, cy + halfW, z + 0.8);

        g.moveTo(pt1.sx, pt1.sy);
        g.lineTo(pt2.sx, pt2.sy);
        g.lineTo(pt3.sx, pt3.sy);
        g.lineTo(pt4.sx, pt4.sy);
        g.closePath();
        g.fill({ color: 0xffaa00, alpha: 0.4 });
      }
    }

    // Capstone glow if nearly complete
    if (this.model.currentLayer >= PYRAMID_LAYERS - 1) {
      const topZ = (PYRAMID_LAYERS - 1) * 0.8;
      const top = worldToScreen(cx, cy, topZ + 1);
      g.circle(top.sx, top.sy, 8);
      g.fill({ color: COLORS.gold, alpha: 0.6 });
    }
  }

  private drawGhostOutline(g: Graphics, cx: number, cy: number, baseSize: number): void {
    const halfW = baseSize / 2;
    const topZ = (PYRAMID_LAYERS - 1) * 0.8;

    // Base outline
    const b1 = worldToScreen(cx - halfW, cy - halfW, 0);
    const b2 = worldToScreen(cx + halfW, cy - halfW, 0);
    const b3 = worldToScreen(cx + halfW, cy + halfW, 0);
    const b4 = worldToScreen(cx - halfW, cy + halfW, 0);

    // Foundation platform
    g.moveTo(b1.sx, b1.sy);
    g.lineTo(b2.sx, b2.sy);
    g.lineTo(b3.sx, b3.sy);
    g.lineTo(b4.sx, b4.sy);
    g.closePath();
    g.fill({ color: COLORS.pyramidShadow, alpha: 0.3 });
    g.moveTo(b1.sx, b1.sy);
    g.lineTo(b2.sx, b2.sy);
    g.lineTo(b3.sx, b3.sy);
    g.lineTo(b4.sx, b4.sy);
    g.closePath();
    g.stroke({ color: COLORS.pyramid, width: 1.5, alpha: 0.5 });

    // Ghost triangular silhouette edges
    const apex = worldToScreen(cx, cy, topZ + 1);

    // Front-left edge
    g.moveTo(b4.sx, b4.sy);
    g.lineTo(apex.sx, apex.sy);
    g.stroke({ color: COLORS.pyramid, width: 1, alpha: 0.2 });

    // Front-right edge
    g.moveTo(b3.sx, b3.sy);
    g.lineTo(apex.sx, apex.sy);
    g.stroke({ color: COLORS.pyramid, width: 1, alpha: 0.2 });

    // Back-left edge
    g.moveTo(b1.sx, b1.sy);
    g.lineTo(apex.sx, apex.sy);
    g.stroke({ color: COLORS.pyramid, width: 1, alpha: 0.15 });

    // Back-right edge
    g.moveTo(b2.sx, b2.sy);
    g.lineTo(apex.sx, apex.sy);
    g.stroke({ color: COLORS.pyramid, width: 1, alpha: 0.15 });

    // "Build here" marker
    const center = worldToScreen(cx, cy, 0.5);
    g.circle(center.sx, center.sy, 5);
    g.stroke({ color: COLORS.gold, width: 2, alpha: 0.6 });
  }

  setHoveredLayer(screenX: number, screenY: number, cameraX: number, cameraY: number): number {
    const localX = screenX - cameraX;
    const localY = screenY - cameraY;

    const cx = PYRAMID_BASE_X;
    const cy = PYRAMID_BASE_Y;
    const baseSize = 14;

    let hitLayer = -1;

    for (let layer = Math.min(this.model.currentLayer, PYRAMID_LAYERS - 1); layer >= 0; layer--) {
      const shrink = layer * 0.42;
      const halfW = (baseSize - shrink) / 2;
      if (halfW <= 0.2) continue;

      const z = layer * 0.8;
      const topCenter = worldToScreen(cx, cy, z + 0.8);
      const botCenter = worldToScreen(cx, cy, z);

      const topLeft = worldToScreen(cx - halfW, cy - halfW, z);
      const botRight = worldToScreen(cx + halfW, cy + halfW, z + 0.8);

      const minX = Math.min(topLeft.sx, botRight.sx) - TILE_W;
      const maxX = Math.max(topLeft.sx, botRight.sx) + TILE_W;
      const minY = Math.min(topLeft.sy, botRight.sy) - TILE_H * 2;
      const maxY = Math.max(topLeft.sy, botRight.sy) + TILE_H * 2;

      if (localX >= minX && localX <= maxX && localY >= minY && localY <= maxY) {
        hitLayer = layer;
        break;
      }
    }

    if (hitLayer !== this.hoveredLayer) {
      this.hoveredLayer = hitLayer;
      this.updateSlice();
    }

    return hitLayer;
  }

  clearHover(): void {
    if (this.hoveredLayer !== -1) {
      this.hoveredLayer = -1;
      this.updateSlice();
    }
  }

  private updateSlice(): void {
    if (this.hoveredLayer >= 0) {
      this.interiorContainer.visible = true;
      this.drawInterior(this.hoveredLayer);
      this.drawPyramidWithSlice();
    } else {
      this.interiorContainer.visible = false;
      this.drawPyramid();
    }
  }

  private drawPyramidWithSlice(): void {
    const g = this.pyramidGraphics;
    g.clear();

    const baseSize = 14;
    const cx = PYRAMID_BASE_X;
    const cy = PYRAMID_BASE_Y;

    this.drawGhostOutline(g, cx, cy, baseSize);

    const drawUpTo = Math.min(this.model.currentLayer + 1, PYRAMID_LAYERS);
    for (let layer = 0; layer < drawUpTo; layer++) {
      const layerData = this.model.layers[layer];
      if (!layerData) continue;

      const shrink = layer * 0.42;
      const halfW = (baseSize - shrink) / 2;
      const z = layer * 0.8;
      if (halfW <= 0.2) break;

      const alpha = layer > this.hoveredLayer ? 0.15 : 1.0;
      const isSliced = layer === this.hoveredLayer;

      // Top face
      const t1 = worldToScreen(cx - halfW, cy - halfW, z + 0.8);
      const t2 = worldToScreen(cx + halfW, cy - halfW, z + 0.8);
      const t3 = worldToScreen(cx + halfW, cy + halfW, z + 0.8);
      const t4 = worldToScreen(cx - halfW, cy + halfW, z + 0.8);

      if (!isSliced) {
        g.moveTo(t1.sx, t1.sy);
        g.lineTo(t2.sx, t2.sy);
        g.lineTo(t3.sx, t3.sy);
        g.lineTo(t4.sx, t4.sy);
        g.closePath();
        g.fill({ color: COLORS.pyramidHighlight, alpha });
      }

      // Right face
      const b3 = worldToScreen(cx + halfW, cy + halfW, z);
      const b2 = worldToScreen(cx + halfW, cy - halfW, z);

      g.moveTo(t2.sx, t2.sy);
      g.lineTo(b2.sx, b2.sy);
      g.lineTo(b3.sx, b3.sy);
      g.lineTo(t3.sx, t3.sy);
      g.closePath();
      g.fill({ color: COLORS.pyramid, alpha });

      // Left face
      const b4 = worldToScreen(cx - halfW, cy + halfW, z);

      g.moveTo(t3.sx, t3.sy);
      g.lineTo(b3.sx, b3.sy);
      g.lineTo(b4.sx, b4.sy);
      g.lineTo(t4.sx, t4.sy);
      g.closePath();
      g.fill({ color: COLORS.pyramidShadow, alpha });

      // Sliced layer highlight
      if (isSliced) {
        // Cross-section outline glow
        g.moveTo(t1.sx, t1.sy);
        g.lineTo(t2.sx, t2.sy);
        g.lineTo(t3.sx, t3.sy);
        g.lineTo(t4.sx, t4.sy);
        g.closePath();
        g.stroke({ color: COLORS.gold, width: 2, alpha: 0.8 });
      }
    }
  }

  private drawInterior(layer: number): void {
    const ig = this.interiorGraphics;
    ig.clear();

    while (this.interiorContainer.children.length > 1) {
      this.interiorContainer.removeChildAt(1);
    }

    const cx = PYRAMID_BASE_X;
    const cy = PYRAMID_BASE_Y;
    const z = layer * 0.8 + 0.1;
    const shrink = layer * 0.42;
    const halfW = (14 - shrink) / 2;

    const cellSize = (halfW * 2) / this.model.mazeWidth;

    for (let my = 0; my < this.model.mazeHeight; my++) {
      for (let mx = 0; mx < this.model.mazeWidth; mx++) {
        const cell = this.model.maze[my]?.[mx];
        if (!cell) continue;

        const wx = cx - halfW + mx * cellSize + cellSize / 2;
        const wy = cy - halfW + my * cellSize + cellSize / 2;
        const { sx, sy } = worldToScreen(wx, wy, z);

        const s = cellSize * TILE_W / 8;

        if (!cell.walkable) {
          ig.rect(sx - s / 2, sy - s / 4, s, s / 2);
          ig.fill(0x8b7355);
          ig.rect(sx - s / 2, sy - s / 4, s, s / 2);
          ig.stroke({ color: 0x6b5335, width: 0.5 });
        } else {
          ig.rect(sx - s / 2, sy - s / 4, s, s / 2);
          ig.fill({ color: 0xd4a853, alpha: 0.7 });
          ig.rect(sx - s / 2, sy - s / 4, s, s / 2);
          ig.stroke({ color: 0xa07d2e, width: 0.3 });
        }

        if (cell.hasTreasure) {
          ig.circle(sx, sy, s / 4);
          ig.fill(COLORS.gold);
          ig.circle(sx, sy, s / 4);
          ig.stroke({ color: 0xb8860b, width: 1 });
        }

        if (cell.hasTrap) {
          ig.moveTo(sx - s / 4, sy + s / 8);
          ig.lineTo(sx, sy - s / 8);
          ig.lineTo(sx + s / 4, sy + s / 8);
          ig.closePath();
          ig.fill(0xe53e3e);
        }

        if (cell.isEntrance) {
          ig.rect(sx - s / 4, sy - s / 8, s / 2, s / 4);
          ig.fill({ color: 0x2d1b0e, alpha: 0.8 });
        }
      }
    }

    const rooms = this.model.getRooms(layer);
    if (rooms.length > 0) {
      const gridSize = Math.max(2, 6 - Math.floor(layer / 5));
      const roomCellW = (halfW * 2) / gridSize;

      for (const room of rooms) {
        const rwx = cx - halfW + room.gridX * roomCellW + roomCellW / 2;
        const rwy = cy - halfW + room.gridY * roomCellW + roomCellW / 2;
        const { sx: rsx, sy: rsy } = worldToScreen(rwx, rwy, z + 0.05);
        const rs = roomCellW * TILE_W / 5;

        const config = ROOM_CONFIGS[room.type];
        ig.rect(rsx - rs / 2, rsy - rs / 3, rs, rs * 2 / 3);
        ig.fill({ color: config.color, alpha: 0.6 });
        ig.rect(rsx - rs / 2, rsy - rs / 3, rs, rs * 2 / 3);
        ig.stroke({ color: config.color, width: 1.5, alpha: 0.9 });

        if (room.type !== 'empty') {
          const labelStyle = new TextStyle({
            fontSize: 10,
            fill: '#f4e4c1',
          });
          const label = new Text({ text: config.icon, style: labelStyle });
          label.anchor.set(0.5, 0.5);
          label.x = rsx;
          label.y = rsy;
          this.interiorContainer.addChild(label);
        }
      }
    }

    const wallCenter = worldToScreen(cx, cy - halfW, z);
    ig.rect(wallCenter.sx - 20, wallCenter.sy - 5, 40, 10);
    ig.fill({ color: 0x8b7355, alpha: 0.5 });
    ig.circle(wallCenter.sx, wallCenter.sy, 3);
    ig.fill(COLORS.gold);
    ig.moveTo(wallCenter.sx + 3, wallCenter.sy);
    ig.lineTo(wallCenter.sx + 8, wallCenter.sy + 2);
    ig.stroke({ color: COLORS.gold, width: 1 });
  }

  redraw(): void {
    if (this.hoveredLayer >= 0) {
      this.drawPyramidWithSlice();
    } else {
      this.drawPyramid();
    }
  }
}
