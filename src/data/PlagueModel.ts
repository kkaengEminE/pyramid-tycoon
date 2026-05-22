export interface Plague {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: number;
  severity: 'minor' | 'major' | 'catastrophic';
  effects: PlagueEffect[];
}

export interface PlagueEffect {
  type: 'worker_speed' | 'food_decay' | 'stone_loss' | 'gold_loss'
      | 'energy_drain' | 'robber_boost' | 'vision_reduce' | 'unit_damage';
  value: number;
}

export const PLAGUES: Plague[] = [
  {
    id: 'blood_water',
    name: '피의 강',
    icon: '🩸',
    description: '나일강이 피로 물들어 식량 소비 증가',
    duration: 300,
    severity: 'minor',
    effects: [{ type: 'food_decay', value: 2.0 }],
  },
  {
    id: 'frogs',
    name: '개구리 재앙',
    icon: '🐸',
    description: '일꾼 이동 속도 감소',
    duration: 250,
    severity: 'minor',
    effects: [{ type: 'worker_speed', value: -0.3 }],
  },
  {
    id: 'gnats',
    name: '이 재앙',
    icon: '🦟',
    description: '일꾼 속도 소폭 감소',
    duration: 200,
    severity: 'minor',
    effects: [{ type: 'worker_speed', value: -0.15 }],
  },
  {
    id: 'flies',
    name: '파리떼',
    icon: '🪰',
    description: '식량 부패 가속',
    duration: 300,
    severity: 'minor',
    effects: [{ type: 'food_decay', value: 1.5 }],
  },
  {
    id: 'livestock',
    name: '가축 역병',
    icon: '🐄',
    description: '식량 생산 중단, 식량 대량 소실',
    duration: 200,
    severity: 'major',
    effects: [{ type: 'food_decay', value: 3.0 }],
  },
  {
    id: 'boils',
    name: '종기',
    icon: '🤕',
    description: '일꾼 대폭 속도 감소',
    duration: 250,
    severity: 'major',
    effects: [
      { type: 'worker_speed', value: -0.4 },
      { type: 'unit_damage', value: 5 },
    ],
  },
  {
    id: 'hail',
    name: '우박',
    icon: '🌨️',
    description: '석재와 건물 피해',
    duration: 150,
    severity: 'major',
    effects: [
      { type: 'stone_loss', value: 2 },
      { type: 'unit_damage', value: 10 },
    ],
  },
  {
    id: 'locusts',
    name: '메뚜기떼',
    icon: '🦗',
    description: '모든 식량 빠르게 소모',
    duration: 200,
    severity: 'catastrophic',
    effects: [{ type: 'food_decay', value: 5.0 }],
  },
  {
    id: 'darkness',
    name: '어둠의 재앙',
    icon: '🌑',
    description: '시야 극도 감소, 에너지 회복 중단',
    duration: 300,
    severity: 'catastrophic',
    effects: [
      { type: 'vision_reduce', value: 0.8 },
      { type: 'energy_drain', value: 0.5 },
    ],
  },
  {
    id: 'firstborn',
    name: '장자의 죽음',
    icon: '💀',
    description: '가장 강력한 유닛 즉사, 모든 유닛 피해',
    duration: 100,
    severity: 'catastrophic',
    effects: [{ type: 'unit_damage', value: 50 }],
  },
];

export interface ActivePlague {
  plague: Plague;
  remainingTicks: number;
}
