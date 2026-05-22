export const TILE_W = 32;
export const TILE_H = 16;
export const TICK_MS = 50;
export const TICKS_PER_SEC = 20;

export const WORLD_W = 40;
export const WORLD_H = 40;

export const PYRAMID_LAYERS = 146;
export const PYRAMID_BASE_X = 25;
export const PYRAMID_BASE_Y = 20;

export const CAMERA_SCROLL_SPEED = 8;
export const CAMERA_EDGE_THRESHOLD = 40;

export const DAY_DURATION_TICKS = 400;
export const NIGHT_DURATION_TICKS = 150;

export const ZONE_BUFFER_MAX = 50;
export const BRIDGE_MAX_WORKERS = 3;

export const SUPERVISOR_AURA_RADIUS = 120;
export const SUPERVISOR_SPEED_BUFF = 1.5;

export const BREAD_PER_WORKER_TICK = 0.03;
export const BEER_PER_WORKER_TICK = 0.02;
export const OVERTIME_FOOD_MULTIPLIER = 2.0;
export const STARVATION_SPEED_PENALTY = 0.5;

export const WORKER_SPEED = 3.0;
export const WORKER_MINE_TICKS = 30;
export const WORKER_CARRY_CAPACITY = 1;

export const ROBBER_SPEED = 1.0;
export const ROBBER_SPAWN_COUNT = 3;

export const WHEAT_FARM_TICKS = 40;
export const BREAD_PER_HARVEST = 5;
export const BREWERY_TICKS = 50;
export const BEER_PER_BREW = 4;

export const ENERGY_MAX = 100;
export const ENERGY_REGEN_PER_TICK = 0.4;
export const WORKER_SPAWN_COST = 20;
export const SOLDIER_SPAWN_COST = 35;
export const SUPERVISOR_SPAWN_COST = 50;

export const STONES_PER_LAYER = (layer: number): number => {
  const remaining = PYRAMID_LAYERS - layer;
  const base = Math.ceil(remaining * 0.8);
  return Math.max(3, base);
};

export const MERCHANT_SPAWN_CHANCE = 0.003;
export const MERCHANT_STAY_TICKS = 600;
export const MERCHANT_COOLDOWN_TICKS = 400;

export const TRAP_DURABILITY = 5;
export const TRAP_STONE_COST = 1;
export const TRAP_DAMAGE = 30;

export const COLORS = {
  sand: 0xd4a853,
  sandDark: 0xb8913a,
  sandLight: 0xe8c87a,
  nile: 0x2b6cb0,
  nileLight: 0x4299e1,
  pyramid: 0xc9a84c,
  pyramidShadow: 0xa07d2e,
  pyramidHighlight: 0xe8d47a,
  gold: 0xffd700,
  goldAura: 0xffd700,
  night: 0x0a1628,
  skin: 0xc68642,
  linen: 0xf5f0e6,
  robber: 0x2d1b0e,
  blood: 0x8b0000,
  stone: 0x808080,
  stoneDark: 0x606060,
  ui: {
    bg: 0x2a1f0e,
    border: 0xc9a84c,
    text: '#f4e4c1',
    textDark: '#a89060',
    danger: '#e53e3e',
    success: '#38a169',
  },
};
