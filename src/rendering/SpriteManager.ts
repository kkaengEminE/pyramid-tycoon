import { Assets, Texture, Sprite, Graphics, Container } from 'pixi.js';
import {
  drawEgyptianWorker, drawEgyptianSupervisor, drawEgyptianSoldier,
  drawTombRobber, drawMerchantCamel, drawMummy,
} from './UnitRenderer';
import { MummyType } from '../components';

export type UnitType = 'worker' | 'soldier' | 'supervisor' | 'robber' | 'merchant' | 'mummy';

const SPRITE_PATHS: Record<UnitType, string> = {
  worker: '/sprites/worker.png',
  soldier: '/sprites/soldier.png',
  supervisor: '/sprites/supervisor.png',
  robber: '/sprites/robber.png',
  merchant: '/sprites/merchant.png',
  mummy: '/sprites/mummy.png',
};

const textureCache = new Map<string, Texture | null>();
let loadAttempted = false;

export async function preloadSprites(): Promise<void> {
  if (loadAttempted) return;
  loadAttempted = true;

  for (const [type, path] of Object.entries(SPRITE_PATHS)) {
    try {
      const texture = await Assets.load(path);
      textureCache.set(type, texture);
    } catch {
      textureCache.set(type, null);
    }
  }
}

function getTexture(type: UnitType): Texture | null {
  return textureCache.get(type) ?? null;
}

let currentMummyType: MummyType = 'guardian';

function drawFallbackGraphics(type: UnitType, carrying = false): Graphics {
  const g = new Graphics();
  switch (type) {
    case 'worker': drawEgyptianWorker(g, carrying); break;
    case 'soldier': drawEgyptianSoldier(g); break;
    case 'supervisor': drawEgyptianSupervisor(g); break;
    case 'robber': drawTombRobber(g); break;
    case 'merchant': drawMerchantCamel(g); break;
    case 'mummy': drawMummy(g, currentMummyType); break;
  }
  return g;
}

export function setMummyType(mt: MummyType): void {
  currentMummyType = mt;
}

export function createUnit(type: UnitType, carrying = false): Container {
  const texture = getTexture(type);

  if (texture) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 1);
    return sprite;
  }

  return drawFallbackGraphics(type, carrying);
}

export function updateWorkerCarrying(container: Container, carrying: boolean): void {
  if (container instanceof Graphics) {
    drawEgyptianWorker(container, carrying);
  }
}
