export type MerchantItemType = 'bread' | 'beer' | 'trap' | 'mercenary' | 'decoration' | 'relic' | 'cedar' | 'hide' | 'papyrus' | 'ancientTech';

export interface MerchantItem {
  id: string;
  type: MerchantItemType;
  label: string;
  icon: string;
  goldCost: number;
  quantity: number;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
  stock: number;
}

export interface MerchantState {
  present: boolean;
  stayTimer: number;
  cooldownTimer: number;
  inventory: MerchantItem[];
  worldX: number;
  worldY: number;
}

const BREAD_OFFER: MerchantItem = {
  id: 'bread_bundle',
  type: 'bread',
  label: '밀 꾸러미',
  icon: '🍞',
  goldCost: 3,
  quantity: 20,
  description: '빵 20개',
  rarity: 'common',
  stock: 3,
};

const BEER_OFFER: MerchantItem = {
  id: 'beer_bundle',
  type: 'beer',
  label: '맥주 통',
  icon: '🍺',
  goldCost: 4,
  quantity: 15,
  description: '맥주 15개',
  rarity: 'common',
  stock: 3,
};

const MATERIAL_ITEMS: MerchantItem[] = [
  {
    id: 'cedar_wood',
    type: 'cedar',
    label: '삼나무 목재',
    icon: '🪵',
    goldCost: 6,
    quantity: 5,
    description: '레바논산 삼나무 5묶음',
    rarity: 'uncommon',
    stock: 2,
  },
  {
    id: 'croc_hide',
    type: 'hide',
    label: '악어 가죽',
    icon: '🐊',
    goldCost: 8,
    quantity: 3,
    description: '나일 악어 가죽 3장',
    rarity: 'uncommon',
    stock: 2,
  },
  {
    id: 'papyrus_rope',
    type: 'papyrus',
    label: '파피루스 밧줄',
    icon: '🪢',
    goldCost: 4,
    quantity: 5,
    description: '파피루스 밧줄 5다발',
    rarity: 'common',
    stock: 3,
  },
  {
    id: 'ancient_tech',
    type: 'ancientTech',
    label: '고대 기술 조각',
    icon: '🔮',
    goldCost: 20,
    quantity: 1,
    description: '잃어버린 기술 연구에 필요',
    rarity: 'rare',
    stock: 1,
  },
];

const SPECIAL_ITEMS: MerchantItem[] = [
  {
    id: 'spike_trap',
    type: 'trap',
    label: '가시 함정',
    icon: '🔺',
    goldCost: 5,
    quantity: 1,
    description: '강력한 가시 함정 설치',
    rarity: 'uncommon',
    stock: 2,
  },
  {
    id: 'curse_trap',
    type: 'trap',
    label: '저주 함정',
    icon: '💀',
    goldCost: 8,
    quantity: 1,
    description: '도굴꾼에게 대미지 50',
    rarity: 'rare',
    stock: 1,
  },
  {
    id: 'mercenary',
    type: 'mercenary',
    label: '용병',
    icon: '⚔️',
    goldCost: 10,
    quantity: 1,
    description: '강력한 용병 1명 고용',
    rarity: 'uncommon',
    stock: 1,
  },
  {
    id: 'golden_ankh',
    type: 'decoration',
    label: '황금 앙크',
    icon: '☥',
    goldCost: 15,
    quantity: 1,
    description: '피라미드 내부 장식용',
    rarity: 'rare',
    stock: 1,
  },
  {
    id: 'eye_of_ra',
    type: 'relic',
    label: '라의 눈',
    icon: '👁️',
    goldCost: 25,
    quantity: 1,
    description: '전체 일꾼 속도 10% 증가 (영구)',
    rarity: 'rare',
    stock: 1,
  },
];

export function generateMerchantInventory(): MerchantItem[] {
  const items: MerchantItem[] = [
    { ...BREAD_OFFER },
    { ...BEER_OFFER },
  ];

  const matShuffled = MATERIAL_ITEMS.slice().sort(() => Math.random() - 0.5);
  const matCount = Math.random() < 0.4 ? 2 : 1;
  for (let i = 0; i < Math.min(matCount, matShuffled.length); i++) {
    items.push({ ...matShuffled[i] });
  }

  const shuffled = SPECIAL_ITEMS.slice().sort(() => Math.random() - 0.5);
  const specialCount = Math.random() < 0.3 ? 2 : 1;
  for (let i = 0; i < Math.min(specialCount, shuffled.length); i++) {
    items.push({ ...shuffled[i] });
  }

  return items;
}

export function createMerchantState(): MerchantState {
  return {
    present: false,
    stayTimer: 0,
    cooldownTimer: 0,
    inventory: [],
    worldX: 1,
    worldY: 20,
  };
}
