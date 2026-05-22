export interface Position {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  prevZ: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Renderable {
  type: 'worker' | 'soldier' | 'supervisor' | 'robber' | 'stone' | 'trap' | 'merchant' | 'mummy';
  visible: boolean;
  scaleX: number;
  alpha: number;
  tint?: number;
}

export type ZoneType = 'quarry' | 'bridge' | 'base' | 'ramp' | 'wheatFarm' | 'brewery';

export type WorkerState = 'idle' | 'walking_to_work' | 'mining' | 'carrying' | 'dropping' | 'returning' | 'retreating';

export interface Worker {
  zone: ZoneType | null;
  state: WorkerState;
  stateTimer: number;
  targetX: number;
  targetY: number;
  carrying: number;
  speedMultiplier: number;
  buffed: boolean;
}

export interface Supervisor {
  auraRadius: number;
  speedBuff: number;
}

export interface Soldier {
  damage: number;
  attackCooldown: number;
  attackTimer: number;
}

export interface TombRobber {
  state: 'entering' | 'wandering' | 'looting' | 'fleeing';
  health: number;
  maxHealth: number;
  mazeX: number;
  mazeY: number;
  moveTimer: number;
  loot: number;
  visitedRooms: Set<string>;
}

export interface Trap {
  trapType: 'rockfall' | 'spikes' | 'curse';
  durability: number;
  maxDurability: number;
  damage: number;
  stoneCost: number;
  mazeX: number;
  mazeY: number;
  cooldown: number;
}

export type MummyType = 'guardian' | 'priest' | 'warrior' | 'pharaoh' | 'cursed';

export interface Mummy {
  mummyType: MummyType;
  power: number;
  health: number;
  maxHealth: number;
  state: 'idle' | 'patrolling' | 'attacking' | 'blessing';
  targetEntityId: number | null;
  moveTimer: number;
  lifespan: number;
}

export interface Draggable {
  isDragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  originX: number;
  originY: number;
}

export interface StoneResource {
  amount: number;
  maxStack: number;
}

export function createPosition(x: number, y: number, z: number = 0): Position {
  return { x, y, z, prevX: x, prevY: y, prevZ: z };
}

export function createWorker(): Worker {
  return {
    zone: null,
    state: 'idle',
    stateTimer: 0,
    targetX: 0,
    targetY: 0,
    carrying: 0,
    speedMultiplier: 1,
    buffed: false,
  };
}

export function createSupervisor(): Supervisor {
  return { auraRadius: 120, speedBuff: 1.5 };
}

export function createSoldier(): Soldier {
  return { damage: 10, attackCooldown: 20, attackTimer: 0 };
}

export function createRenderable(type: Renderable['type']): Renderable {
  return { type, visible: true, scaleX: 1, alpha: 1 };
}

export function createDraggable(): Draggable {
  return { isDragging: false, dragOffsetX: 0, dragOffsetY: 0, originX: 0, originY: 0 };
}

export function createTombRobber(): TombRobber {
  return {
    state: 'entering',
    health: 100,
    maxHealth: 100,
    mazeX: 0,
    mazeY: 0,
    moveTimer: 0,
    loot: 0,
    visitedRooms: new Set(),
  };
}

const MUMMY_CONFIGS: Record<MummyType, { power: number; health: number; lifespan: number }> = {
  guardian: { power: 15, health: 150, lifespan: 3000 },
  priest: { power: 5, health: 80, lifespan: 2500 },
  warrior: { power: 25, health: 200, lifespan: 2000 },
  pharaoh: { power: 30, health: 300, lifespan: 4000 },
  cursed: { power: 40, health: 100, lifespan: 1500 },
};

export function createMummy(mummyType: MummyType): Mummy {
  const cfg = MUMMY_CONFIGS[mummyType];
  return {
    mummyType,
    power: cfg.power,
    health: cfg.health,
    maxHealth: cfg.health,
    state: 'idle',
    targetEntityId: null,
    moveTimer: 0,
    lifespan: cfg.lifespan,
  };
}

export function createTrap(
  trapType: Trap['trapType'],
  mazeX: number,
  mazeY: number,
): Trap {
  const configs = {
    rockfall: { durability: 5, damage: 30, stoneCost: 1 },
    spikes: { durability: 8, damage: 20, stoneCost: 1 },
    curse: { durability: 3, damage: 50, stoneCost: 2 },
  };
  const c = configs[trapType];
  return {
    trapType,
    durability: c.durability,
    maxDurability: c.durability,
    damage: c.damage,
    stoneCost: c.stoneCost,
    mazeX,
    mazeY,
    cooldown: 0,
  };
}
