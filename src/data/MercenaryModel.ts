export interface MercenaryType {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: { gold: number };
  stats: {
    damage: number;
    health: number;
    speed: number;
  };
  duration: number;
  specialty: 'guard' | 'hunter' | 'elite';
}

export const MERCENARY_TYPES: MercenaryType[] = [
  {
    id: 'nubian_archer',
    name: '누비아 궁수',
    icon: '🏹',
    description: '원거리 공격, 도굴꾼 탐지 범위 넓음',
    cost: { gold: 15 },
    stats: { damage: 20, health: 80, speed: 1.5 },
    duration: 1500,
    specialty: 'hunter',
  },
  {
    id: 'libyan_warrior',
    name: '리비아 전사',
    icon: '⚔️',
    description: '근접 전투 특화, 높은 체력',
    cost: { gold: 20 },
    stats: { damage: 30, health: 150, speed: 1.0 },
    duration: 1200,
    specialty: 'guard',
  },
  {
    id: 'sea_peoples',
    name: '바다 민족 전사',
    icon: '🚢',
    description: '강력한 공격력, 짧은 체류',
    cost: { gold: 30 },
    stats: { damage: 50, health: 120, speed: 1.3 },
    duration: 800,
    specialty: 'elite',
  },
  {
    id: 'hittite_chariot',
    name: '히타이트 전차병',
    icon: '🏇',
    description: '최강 전투력, 매우 비쌈',
    cost: { gold: 50 },
    stats: { damage: 70, health: 200, speed: 2.0 },
    duration: 1000,
    specialty: 'elite',
  },
  {
    id: 'medjay_scout',
    name: '메자이 정찰병',
    icon: '👁️',
    description: '탐지 능력 극대화, 빠른 이동',
    cost: { gold: 12 },
    stats: { damage: 15, health: 60, speed: 2.5 },
    duration: 2000,
    specialty: 'hunter',
  },
];

export interface MercenaryMarketState {
  available: MercenaryType[];
  refreshTimer: number;
  refreshInterval: number;
}

export function createMercenaryMarket(): MercenaryMarketState {
  return {
    available: generateMercenarySelection(),
    refreshTimer: 0,
    refreshInterval: 2000,
  };
}

function generateMercenarySelection(): MercenaryType[] {
  const shuffled = MERCENARY_TYPES.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export function refreshMarket(state: MercenaryMarketState): void {
  state.available = generateMercenarySelection();
  state.refreshTimer = 0;
}
