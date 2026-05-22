import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { TILE_W, TILE_H, WORLD_W, WORLD_H, COLORS } from '../config';
import { worldToScreen } from '../math/isometric';
import { ZONE_CONFIGS } from '../data/ZoneModel';

export class WorldRenderer {
  container: Container;
  private groundGraphics: Graphics;
  private zoneOverlays: Graphics;
  private nileGraphics: Graphics;
  private labelContainer: Container;
  private nileTime = 0;

  constructor() {
    this.container = new Container();
    this.groundGraphics = new Graphics();
    this.zoneOverlays = new Graphics();
    this.nileGraphics = new Graphics();
    this.labelContainer = new Container();

    this.container.addChild(this.groundGraphics);
    this.container.addChild(this.nileGraphics);
    this.container.addChild(this.zoneOverlays);
    this.container.addChild(this.labelContainer);

    this.drawGround();
    this.drawZoneOverlays();
    this.drawZoneLabels();
  }

  private drawGround(): void {
    const g = this.groundGraphics;
    g.clear();

    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 0; x < WORLD_W; x++) {
        const { sx, sy } = worldToScreen(x, y);
        const isNile = x >= 12 && x <= 15;
        const isWheatFarm = x >= 4 && x <= 11 && y >= 26 && y <= 32;
        const isBrewery = x >= 16 && x <= 22 && y >= 26 && y <= 32;

        let color: number;
        if (isNile) {
          color = COLORS.nile;
        } else if (isWheatFarm) {
          color = this.getWheatColor(x, y);
        } else if (isBrewery) {
          color = this.getBreweryColor(x, y);
        } else {
          color = this.getSandColor(x, y);
        }

        g.moveTo(sx, sy - TILE_H / 2);
        g.lineTo(sx + TILE_W / 2, sy);
        g.lineTo(sx, sy + TILE_H / 2);
        g.lineTo(sx - TILE_W / 2, sy);
        g.closePath();
        g.fill(color);
      }
    }
  }

  private getSandColor(x: number, y: number): number {
    const noise = Math.sin(x * 0.7 + y * 0.5) * 0.5 + 0.5;
    if (noise > 0.7) return COLORS.sandLight;
    if (noise < 0.3) return COLORS.sandDark;
    return COLORS.sand;
  }

  private getWheatColor(x: number, y: number): number {
    const noise = Math.sin(x * 1.2 + y * 0.8) * 0.5 + 0.5;
    if (noise > 0.6) return 0x8fbc5e;
    if (noise < 0.3) return 0x5a8a2a;
    return 0x6fa03a;
  }

  private getBreweryColor(x: number, y: number): number {
    const noise = Math.sin(x * 0.9 + y * 1.1) * 0.5 + 0.5;
    if (noise > 0.6) return 0x8b6914;
    if (noise < 0.3) return 0x5c4410;
    return 0x6b5512;
  }

  private drawZoneOverlays(): void {
    const g = this.zoneOverlays;
    g.clear();

    const zoneColors = [0xcc6633, 0x3366cc, 0xcccc33, 0x33cc66, 0x44aa22, 0xcc8833];

    for (let i = 0; i < ZONE_CONFIGS.length; i++) {
      const zone = ZONE_CONFIGS[i];
      const tl = worldToScreen(zone.workAreaMinX, zone.workAreaMinY);
      const tr = worldToScreen(zone.workAreaMaxX, zone.workAreaMinY);
      const br = worldToScreen(zone.workAreaMaxX, zone.workAreaMaxY);
      const bl = worldToScreen(zone.workAreaMinX, zone.workAreaMaxY);

      g.moveTo(tl.sx, tl.sy);
      g.lineTo(tr.sx, tr.sy);
      g.lineTo(br.sx, br.sy);
      g.lineTo(bl.sx, bl.sy);
      g.closePath();
      g.stroke({ color: zoneColors[i], width: 2, alpha: 0.4 });
    }
  }

  private drawZoneLabels(): void {
    const labelStyle = new TextStyle({
      fontFamily: 'serif',
      fontSize: 12,
      fill: '#f4e4c1',
      stroke: { color: '#1a1208', width: 3 },
      fontWeight: 'bold',
    });

    const zoneIcons = ['⛏️', '🌉', '🏗️', '📐', '🌾', '🍺'];

    for (let i = 0; i < ZONE_CONFIGS.length; i++) {
      const zone = ZONE_CONFIGS[i];
      const cx = (zone.workAreaMinX + zone.workAreaMaxX) / 2;
      const cy = zone.workAreaMinY + 0.5;
      const { sx, sy } = worldToScreen(cx, cy);

      const label = new Text({ text: `${zoneIcons[i]} ${zone.label}`, style: labelStyle });
      label.anchor.set(0.5, 0.5);
      label.x = sx;
      label.y = sy - 8;
      this.labelContainer.addChild(label);
    }
  }

  updateNile(dt: number): void {
    this.nileTime += dt * 0.001;
    const g = this.nileGraphics;
    g.clear();

    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 12; x <= 15; x++) {
        const { sx, sy } = worldToScreen(x, y);
        const wave = Math.sin(this.nileTime * 2 + y * 0.5 + x * 0.3) * 0.15;
        const alpha = 0.3 + wave;

        g.moveTo(sx, sy - TILE_H / 2);
        g.lineTo(sx + TILE_W / 2, sy);
        g.lineTo(sx, sy + TILE_H / 2);
        g.lineTo(sx - TILE_W / 2, sy);
        g.closePath();
        g.fill({ color: COLORS.nileLight, alpha });
      }
    }
  }

  highlightZone(zoneIndex: number): void {
    // Handled by effects renderer
  }
}
