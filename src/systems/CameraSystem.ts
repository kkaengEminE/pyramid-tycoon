import { CAMERA_SCROLL_SPEED, CAMERA_EDGE_THRESHOLD, TILE_W, TILE_H, WORLD_W, WORLD_H } from '../config';
import { worldToScreen } from '../math/isometric';

export class CameraSystem {
  x = 0;
  y = 0;
  private screenW = 0;
  private screenH = 0;
  private mouseX = 0;
  private mouseY = 0;

  private keys = new Set<string>();
  private dragging = false;
  private dragPrevX = 0;
  private dragPrevY = 0;

  constructor(screenW: number, screenH: number) {
    this.screenW = screenW;
    this.screenH = screenH;
    this.mouseX = screenW / 2;
    this.mouseY = screenH / 2;
    const center = worldToScreen(15, 20);
    this.x = -center.sx + screenW / 2;
    this.y = -center.sy + screenH / 2;

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
    window.addEventListener('mousedown', (e) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        this.dragging = true;
        this.dragPrevX = e.clientX;
        this.dragPrevY = e.clientY;
        e.preventDefault();
      }
    });
    window.addEventListener('mousemove', (e) => {
      if (this.dragging) {
        this.x += e.clientX - this.dragPrevX;
        this.y += e.clientY - this.dragPrevY;
        this.dragPrevX = e.clientX;
        this.dragPrevY = e.clientY;
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 1 || e.button === 0) {
        this.dragging = false;
      }
    });
  }

  setMousePosition(mx: number, my: number): void {
    this.mouseX = mx;
    this.mouseY = my;
  }

  resize(w: number, h: number): void {
    this.screenW = w;
    this.screenH = h;
  }

  update(): void {
    const t = CAMERA_EDGE_THRESHOLD;
    const speed = CAMERA_SCROLL_SPEED;

    if (this.mouseX < t) this.x += speed;
    if (this.mouseX > this.screenW - t) this.x -= speed;
    if (this.mouseY < t) this.y += speed;
    if (this.mouseY > this.screenH - t) this.y -= speed;

    if (this.keys.has('w') || this.keys.has('arrowup')) this.y += speed;
    if (this.keys.has('s') || this.keys.has('arrowdown')) this.y -= speed;
    if (this.keys.has('a') || this.keys.has('arrowleft')) this.x += speed;
    if (this.keys.has('d') || this.keys.has('arrowright')) this.x -= speed;

    const minWorld = worldToScreen(0, 0);
    const maxWorld = worldToScreen(WORLD_W, WORLD_H);

    const minX = -(maxWorld.sx) - 200;
    const maxX = -(minWorld.sx) + this.screenW + 200;
    const minY = -(maxWorld.sy) - 200;
    const maxY = -(minWorld.sy) + this.screenH + 200;

    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;
    if (this.y < minY) this.y = minY;
    if (this.y > maxY) this.y = maxY;
  }

  screenToWorld(sx: number, sy: number): { wx: number; wy: number } {
    const localX = sx - this.x;
    const localY = sy - this.y;
    return {
      wx: (localX / (TILE_W / 2) + localY / (TILE_H / 2)) / 2,
      wy: (localY / (TILE_H / 2) - localX / (TILE_W / 2)) / 2,
    };
  }
}
