export interface Decoration {
  id: string;
  label: string;
  icon: string;
  description: string;
  effect: DecorationEffect;
  cost: { cedar: number; hide: number; papyrus: number; gold: number };
  rarity: 'common' | 'uncommon' | 'rare';
  roomTypes: string[];
}

export interface DecorationEffect {
  type: 'gold_production' | 'trap_power' | 'worker_speed' | 'storage_bonus' | 'blessing_power' | 'treasure_value';
  value: number;
}

export const DECORATIONS: Decoration[] = [
  {
    id: 'golden_sarcophagus',
    label: '황금 석관',
    icon: '⚰️',
    description: '매장실 가치 +50%',
    effect: { type: 'treasure_value', value: 0.5 },
    cost: { cedar: 2, hide: 1, papyrus: 0, gold: 10 },
    rarity: 'rare',
    roomTypes: ['burial'],
  },
  {
    id: 'canopic_jars',
    label: '카노푸스 단지',
    icon: '🏺',
    description: '매장실 미라 생산 속도 +20%',
    effect: { type: 'worker_speed', value: 0.2 },
    cost: { cedar: 0, hide: 1, papyrus: 1, gold: 3 },
    rarity: 'common',
    roomTypes: ['burial'],
  },
  {
    id: 'gold_chest',
    label: '보물 상자',
    icon: '📦',
    description: '보물실 골드 생산 +2/분',
    effect: { type: 'gold_production', value: 2 },
    cost: { cedar: 3, hide: 0, papyrus: 0, gold: 5 },
    rarity: 'uncommon',
    roomTypes: ['treasure'],
  },
  {
    id: 'gem_display',
    label: '보석 진열대',
    icon: '💎',
    description: '보물실 가치 +100%',
    effect: { type: 'treasure_value', value: 1.0 },
    cost: { cedar: 2, hide: 2, papyrus: 1, gold: 15 },
    rarity: 'rare',
    roomTypes: ['treasure'],
  },
  {
    id: 'spike_mechanism',
    label: '가시 장치',
    icon: '🔺',
    description: '함정실 피해 +30',
    effect: { type: 'trap_power', value: 30 },
    cost: { cedar: 0, hide: 2, papyrus: 2, gold: 0 },
    rarity: 'common',
    roomTypes: ['trap'],
  },
  {
    id: 'poison_fumes',
    label: '독안개 장치',
    icon: '💨',
    description: '함정실 피해 +50',
    effect: { type: 'trap_power', value: 50 },
    cost: { cedar: 1, hide: 1, papyrus: 3, gold: 5 },
    rarity: 'uncommon',
    roomTypes: ['trap'],
  },
  {
    id: 'stone_shelves',
    label: '석재 선반',
    icon: '🪨',
    description: '창고 용량 +20',
    effect: { type: 'storage_bonus', value: 20 },
    cost: { cedar: 2, hide: 0, papyrus: 0, gold: 0 },
    rarity: 'common',
    roomTypes: ['storage'],
  },
  {
    id: 'ankh_altar',
    label: '앙크 제단',
    icon: '☥',
    description: '신전 축복 효과 +25%',
    effect: { type: 'blessing_power', value: 0.25 },
    cost: { cedar: 3, hide: 1, papyrus: 2, gold: 8 },
    rarity: 'uncommon',
    roomTypes: ['shrine'],
  },
  {
    id: 'hieroglyph_mural',
    label: '상형문자 벽화',
    icon: '🖼️',
    description: '모든 방에 설치 가능, 보물 가치 +10%',
    effect: { type: 'treasure_value', value: 0.1 },
    cost: { cedar: 0, hide: 0, papyrus: 3, gold: 2 },
    rarity: 'common',
    roomTypes: ['burial', 'treasure', 'trap', 'storage', 'shrine'],
  },
  {
    id: 'eye_of_horus',
    label: '호루스의 눈',
    icon: '👁️',
    description: '전체 일꾼 속도 +5% (영구)',
    effect: { type: 'worker_speed', value: 0.05 },
    cost: { cedar: 3, hide: 3, papyrus: 3, gold: 20 },
    rarity: 'rare',
    roomTypes: ['shrine'],
  },
];

export function getDecorationsForRoom(roomType: string): Decoration[] {
  return DECORATIONS.filter(d => d.roomTypes.includes(roomType));
}
