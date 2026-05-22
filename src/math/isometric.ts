import { TILE_W, TILE_H } from '../config';

export function worldToScreen(wx: number, wy: number, wz: number = 0): { sx: number; sy: number } {
  return {
    sx: (wx - wy) * (TILE_W / 2),
    sy: (wx + wy) * (TILE_H / 2) - wz * TILE_H,
  };
}

export function screenToWorld(sx: number, sy: number, wz: number = 0): { wx: number; wy: number } {
  const adjustedSy = sy + wz * TILE_H;
  return {
    wx: (sx / (TILE_W / 2) + adjustedSy / (TILE_H / 2)) / 2,
    wy: (adjustedSy / (TILE_H / 2) - sx / (TILE_W / 2)) / 2,
  };
}

export function isoDepth(wx: number, wy: number, wz: number = 0): number {
  return (wx + wy) * 100 + wz * 10;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
