import { Graphics, Container, Text } from 'pixi.js';
import { COLORS } from '../config';

export function drawEgyptianWorker(g: Graphics, carrying: boolean = false): void {
  g.clear();

  // Body (front-facing torso) - linen tunic
  g.rect(-5, -14, 10, 10);
  g.fill(COLORS.linen);

  // Legs (side view, walking pose)
  g.moveTo(-3, -4);
  g.lineTo(-6, 4);
  g.lineTo(-4, 4);
  g.lineTo(-1, -4);
  g.fill(COLORS.skin);

  g.moveTo(1, -4);
  g.lineTo(4, 4);
  g.lineTo(6, 4);
  g.lineTo(3, -4);
  g.fill(COLORS.skin);

  // Head (side view)
  g.circle(0, -19, 5);
  g.fill(COLORS.skin);

  // Hair (Egyptian bob)
  g.rect(-5, -24, 8, 7);
  g.fill(0x1a1a1a);

  // Eye
  g.circle(2, -20, 1);
  g.fill(0x000000);

  // Arms
  g.moveTo(5, -14);
  g.lineTo(10, -8);
  g.lineTo(8, -7);
  g.lineTo(4, -12);
  g.stroke({ color: COLORS.skin, width: 2 });

  if (carrying) {
    // Stone block on shoulder
    g.rect(-8, -28, 12, 6);
    g.fill(COLORS.stone);
    g.rect(-8, -28, 12, 6);
    g.stroke({ color: COLORS.stoneDark, width: 1 });
  }
}

export function drawEgyptianSupervisor(g: Graphics): void {
  g.clear();

  // Body (richer tunic)
  g.rect(-6, -16, 12, 12);
  g.fill(0xf0e68c);

  // Gold collar/necklace
  g.rect(-7, -16, 14, 3);
  g.fill(COLORS.gold);

  // Legs
  g.moveTo(-3, -4);
  g.lineTo(-5, 5);
  g.lineTo(-3, 5);
  g.lineTo(-1, -4);
  g.fill(COLORS.skin);

  g.moveTo(1, -4);
  g.lineTo(3, 5);
  g.lineTo(5, 5);
  g.lineTo(3, -4);
  g.fill(COLORS.skin);

  // Head
  g.circle(0, -21, 6);
  g.fill(COLORS.skin);

  // Nemes headdress (striped)
  g.moveTo(-8, -26);
  g.lineTo(6, -26);
  g.lineTo(8, -18);
  g.lineTo(-10, -18);
  g.closePath();
  g.fill(COLORS.gold);
  g.moveTo(-8, -26);
  g.lineTo(6, -26);
  g.lineTo(8, -18);
  g.lineTo(-10, -18);
  g.closePath();
  g.stroke({ color: 0xb8860b, width: 1 });

  // Eye (Egyptian style - elongated)
  g.moveTo(1, -22);
  g.lineTo(5, -22);
  g.lineTo(6, -21);
  g.lineTo(1, -21);
  g.fill(0x000000);

  // Staff of authority
  g.moveTo(8, -16);
  g.lineTo(10, 6);
  g.stroke({ color: 0x8b4513, width: 2 });

  // Staff crook top
  g.circle(8, -18, 2);
  g.fill(COLORS.gold);
}

export function drawEgyptianSoldier(g: Graphics): void {
  g.clear();

  // Body (armor)
  g.rect(-5, -14, 10, 10);
  g.fill(0xcd853f);

  // Legs
  g.moveTo(-3, -4);
  g.lineTo(-5, 4);
  g.lineTo(-3, 4);
  g.lineTo(-1, -4);
  g.fill(COLORS.skin);

  g.moveTo(1, -4);
  g.lineTo(3, 4);
  g.lineTo(5, 4);
  g.lineTo(3, -4);
  g.fill(COLORS.skin);

  // Head
  g.circle(0, -19, 5);
  g.fill(COLORS.skin);

  // Helmet
  g.rect(-6, -25, 10, 6);
  g.fill(0xb8860b);

  // Eye
  g.circle(2, -20, 1);
  g.fill(0x000000);

  // Shield (side view)
  g.ellipse(-9, -10, 4, 8);
  g.fill(0x8b4513);
  g.ellipse(-9, -10, 4, 8);
  g.stroke({ color: COLORS.gold, width: 1 });

  // Spear
  g.moveTo(7, -26);
  g.lineTo(7, 6);
  g.stroke({ color: 0x8b4513, width: 2 });

  // Spear tip
  g.moveTo(5, -28);
  g.lineTo(7, -32);
  g.lineTo(9, -28);
  g.fill(0xc0c0c0);
}

export function drawTombRobber(g: Graphics): void {
  g.clear();

  // Dark cloak
  g.rect(-5, -14, 10, 12);
  g.fill(COLORS.robber);

  // Legs
  g.moveTo(-2, -2);
  g.lineTo(-4, 4);
  g.lineTo(-2, 4);
  g.lineTo(0, -2);
  g.fill(0x3d2b1f);

  g.moveTo(0, -2);
  g.lineTo(2, 4);
  g.lineTo(4, 4);
  g.lineTo(2, -2);
  g.fill(0x3d2b1f);

  // Head (hooded)
  g.circle(0, -19, 5);
  g.fill(0x5c4033);

  // Hood
  g.moveTo(-6, -24);
  g.lineTo(4, -24);
  g.lineTo(6, -16);
  g.lineTo(-8, -16);
  g.closePath();
  g.fill(COLORS.robber);

  // Glowing eyes
  g.circle(1, -20, 1.5);
  g.fill(0xff4444);
  g.circle(4, -20, 1.5);
  g.fill(0xff4444);

  // Torch
  g.moveTo(-8, -20);
  g.lineTo(-8, -6);
  g.stroke({ color: 0x8b4513, width: 2 });

  // Flame
  g.circle(-8, -23, 3);
  g.fill(0xff8c00);
  g.circle(-8, -22, 2);
  g.fill(0xffd700);
}

export function drawMerchantCamel(g: Graphics): void {
  g.clear();

  // Camel body
  g.ellipse(0, -12, 14, 7);
  g.fill(0xc4a55a);

  // Hump
  g.ellipse(-2, -20, 5, 5);
  g.fill(0xb89545);

  // Neck
  g.moveTo(10, -14);
  g.lineTo(14, -30);
  g.lineTo(16, -30);
  g.lineTo(12, -12);
  g.fill(0xc4a55a);

  // Head
  g.ellipse(16, -33, 5, 3);
  g.fill(0xc4a55a);

  // Eye
  g.circle(18, -34, 1);
  g.fill(0x000000);

  // Legs
  for (const lx of [-8, -3, 4, 9]) {
    g.moveTo(lx, -6);
    g.lineTo(lx - 1, 6);
    g.lineTo(lx + 1, 6);
    g.lineTo(lx + 2, -6);
    g.fill(0xb89545);
  }

  // Saddle blanket
  g.rect(-9, -20, 14, 6);
  g.fill(0xcc3333);
  g.rect(-9, -20, 14, 6);
  g.stroke({ color: COLORS.gold, width: 1 });

  // Goods on back
  g.rect(-10, -26, 6, 5);
  g.fill(0x8b6914);
  g.rect(-10, -26, 6, 5);
  g.stroke({ color: 0x5c4410, width: 1 });

  g.rect(0, -25, 5, 4);
  g.fill(0x6b5512);
  g.rect(0, -25, 5, 4);
  g.stroke({ color: 0x4a3a0e, width: 1 });

  // Merchant rider (small)
  g.rect(-3, -32, 6, 6);
  g.fill(COLORS.linen);
  g.circle(0, -36, 3);
  g.fill(COLORS.skin);
  // Turban
  g.rect(-3, -40, 6, 3);
  g.fill(0xf0f0f0);
}

const MUMMY_COLORS: Record<string, { body: number; wrap: number; glow: number }> = {
  guardian: { body: 0x8b7355, wrap: 0xd4c5a0, glow: 0x4a90d9 },
  priest: { body: 0x6b5b3a, wrap: 0xf5f0e6, glow: 0xffd700 },
  warrior: { body: 0x5c4a32, wrap: 0xc4a55a, glow: 0xff4444 },
  pharaoh: { body: 0x4a3a28, wrap: 0xffd700, glow: 0x9b59b6 },
  cursed: { body: 0x2d1b0e, wrap: 0x556b2f, glow: 0x00ff88 },
};

export function drawMummy(g: Graphics, mummyType: string = 'guardian'): void {
  g.clear();
  const colors = MUMMY_COLORS[mummyType] ?? MUMMY_COLORS.guardian;

  // Body (wrapped)
  g.rect(-5, -14, 10, 12);
  g.fill(colors.wrap);
  // Wrap lines
  for (let y = -12; y < -2; y += 3) {
    g.moveTo(-5, y);
    g.lineTo(5, y);
    g.stroke({ color: colors.body, width: 1 });
  }

  // Legs (stiff mummy walk)
  g.rect(-4, -2, 3, 8);
  g.fill(colors.wrap);
  g.rect(1, -2, 3, 8);
  g.fill(colors.wrap);

  // Head
  g.circle(0, -19, 5);
  g.fill(colors.wrap);

  // Glowing eyes
  g.circle(-2, -20, 1.5);
  g.fill(colors.glow);
  g.circle(2, -20, 1.5);
  g.fill(colors.glow);

  // Arms (outstretched)
  g.rect(5, -13, 8, 2);
  g.fill(colors.wrap);
  g.rect(-13, -11, 8, 2);
  g.fill(colors.wrap);

  if (mummyType === 'pharaoh') {
    // Crown
    g.moveTo(-4, -25);
    g.lineTo(0, -30);
    g.lineTo(4, -25);
    g.fill(0xffd700);
  } else if (mummyType === 'priest') {
    // Ankh symbol
    g.circle(8, -16, 2);
    g.stroke({ color: 0xffd700, width: 1.5 });
    g.moveTo(8, -14);
    g.lineTo(8, -8);
    g.stroke({ color: 0xffd700, width: 1.5 });
  } else if (mummyType === 'warrior') {
    // Khopesh sword
    g.moveTo(12, -14);
    g.lineTo(16, -20);
    g.lineTo(14, -22);
    g.stroke({ color: 0xc0c0c0, width: 2 });
  } else if (mummyType === 'cursed') {
    // Green aura particles
    g.circle(-6, -24, 2);
    g.fill({ color: colors.glow, alpha: 0.5 });
    g.circle(6, -22, 1.5);
    g.fill({ color: colors.glow, alpha: 0.5 });
  }
}

export function createUnitSprite(type: 'worker' | 'soldier' | 'supervisor' | 'robber' | 'merchant' | 'mummy', carrying: boolean = false): Graphics {
  const g = new Graphics();
  switch (type) {
    case 'worker': drawEgyptianWorker(g, carrying); break;
    case 'soldier': drawEgyptianSoldier(g); break;
    case 'supervisor': drawEgyptianSupervisor(g); break;
    case 'robber': drawTombRobber(g); break;
    case 'merchant': drawMerchantCamel(g); break;
    case 'mummy': drawMummy(g); break;
  }
  return g;
}
