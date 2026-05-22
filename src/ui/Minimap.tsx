import { useRef, useEffect } from 'preact/hooks';
import { WORLD_W, WORLD_H, COLORS } from '../config';
import { ZONE_CONFIGS } from '../data/ZoneModel';

interface MinimapProps {
  cameraX: number;
  cameraY: number;
  screenW: number;
  screenH: number;
  unitPositions: { x: number; y: number; type: string }[];
}

const MAP_W = 160;
const MAP_H = 100;
const SCALE_X = MAP_W / WORLD_W;
const SCALE_Y = MAP_H / WORLD_H;

const ZONE_COLORS = ['#cc6633', '#3366cc', '#cccc33', '#33cc66', '#44aa22', '#cc8833'];

export function Minimap({ cameraX, cameraY, screenW, screenH, unitPositions }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, MAP_W, MAP_H);

    ctx.fillStyle = '#b8913a';
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    ctx.fillStyle = '#2b6cb0';
    const nileX1 = 12 * SCALE_X;
    const nileW = 4 * SCALE_X;
    ctx.fillRect(nileX1, 0, nileW, MAP_H);

    for (let i = 0; i < ZONE_CONFIGS.length; i++) {
      const z = ZONE_CONFIGS[i];
      ctx.strokeStyle = ZONE_COLORS[i];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.strokeRect(
        z.workAreaMinX * SCALE_X,
        z.workAreaMinY * SCALE_Y,
        (z.workAreaMaxX - z.workAreaMinX) * SCALE_X,
        (z.workAreaMaxY - z.workAreaMinY) * SCALE_Y,
      );
      ctx.globalAlpha = 1;
    }

    const pyramidX = 25 * SCALE_X;
    const pyramidY = 18 * SCALE_Y;
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath();
    ctx.moveTo(pyramidX, pyramidY - 6);
    ctx.lineTo(pyramidX + 10, pyramidY + 6);
    ctx.lineTo(pyramidX - 10, pyramidY + 6);
    ctx.closePath();
    ctx.fill();

    for (const u of unitPositions) {
      if (u.type === 'robber') {
        ctx.fillStyle = '#e53e3e';
      } else if (u.type === 'supervisor') {
        ctx.fillStyle = '#ffd700';
      } else {
        ctx.fillStyle = '#f4e4c1';
      }
      ctx.fillRect(u.x * SCALE_X - 1, u.y * SCALE_Y - 1, 2, 2);
    }

    const tileW = 32;
    const tileH = 16;
    const isoToMinimapX = (sx: number, sy: number) => {
      const wx = (sx / (tileW / 2) + sy / (tileH / 2)) / 2;
      const wy = (sy / (tileH / 2) - sx / (tileW / 2)) / 2;
      return { mx: wx * SCALE_X, my: wy * SCALE_Y };
    };

    const topLeft = isoToMinimapX(-cameraX, -cameraY);
    const botRight = isoToMinimapX(-cameraX + screenW, -cameraY + screenH);

    ctx.strokeStyle = '#f4e4c1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(topLeft.mx, topLeft.my, botRight.mx - topLeft.mx, botRight.my - topLeft.my);
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: '120px',
      right: '10px',
      border: '2px solid #c9a84c',
      borderRadius: '4px',
      background: 'rgba(42,31,14,0.85)',
      padding: '3px',
      pointerEvents: 'none',
    }}>
      <canvas ref={canvasRef} width={MAP_W} height={MAP_H} style={{ display: 'block' }} />
    </div>
  );
}
