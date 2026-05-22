export interface PharaohTrait {
  id: string;
  label: string;
  icon: string;
  description: string;
  effects: TraitEffect[];
}

export interface TraitEffect {
  type: 'worker_speed' | 'food_consumption' | 'stone_production' | 'gold_income'
      | 'defense_power' | 'energy_regen' | 'build_speed' | 'merchant_discount';
  value: number;
}

export interface Pharaoh {
  id: string;
  name: string;
  dynastyNumber: number;
  traits: PharaohTrait[];
  reignStart: number;
  reignEnd: number | null;
  layersBuilt: number;
  reputation: number;
}

export interface Dynasty {
  currentPharaoh: Pharaoh;
  pastPharaohs: Pharaoh[];
  dynastyNumber: number;
  totalReputation: number;
  successionTimer: number;
  successionInterval: number;
}

export const TRAIT_POOL: PharaohTrait[] = [
  {
    id: 'builder',
    label: '건축왕',
    icon: '🏗️',
    description: '석재 생산 +30%',
    effects: [{ type: 'stone_production', value: 0.3 }],
  },
  {
    id: 'generous',
    label: '관대한 자',
    icon: '🍞',
    description: '식량 소비 -20%',
    effects: [{ type: 'food_consumption', value: -0.2 }],
  },
  {
    id: 'tyrant',
    label: '폭군',
    icon: '⚡',
    description: '일꾼 속도 +25%, 식량 소비 +15%',
    effects: [
      { type: 'worker_speed', value: 0.25 },
      { type: 'food_consumption', value: 0.15 },
    ],
  },
  {
    id: 'merchant_king',
    label: '상인왕',
    icon: '💰',
    description: '상인 할인 25%, 골드 수입 +20%',
    effects: [
      { type: 'merchant_discount', value: 0.25 },
      { type: 'gold_income', value: 0.2 },
    ],
  },
  {
    id: 'warrior',
    label: '전사왕',
    icon: '⚔️',
    description: '방어력 +40%',
    effects: [{ type: 'defense_power', value: 0.4 }],
  },
  {
    id: 'divine',
    label: '신성한 자',
    icon: '☀️',
    description: '에너지 재생 +30%',
    effects: [{ type: 'energy_regen', value: 0.3 }],
  },
  {
    id: 'architect',
    label: '위대한 건축가',
    icon: '📐',
    description: '건설 속도 +20%',
    effects: [{ type: 'build_speed', value: 0.2 }],
  },
  {
    id: 'miser',
    label: '구두쇠',
    icon: '🪙',
    description: '골드 수입 +40%, 일꾼 속도 -10%',
    effects: [
      { type: 'gold_income', value: 0.4 },
      { type: 'worker_speed', value: -0.1 },
    ],
  },
  {
    id: 'blessed',
    label: '축복받은 자',
    icon: '🙏',
    description: '전체 효과 +10%',
    effects: [
      { type: 'worker_speed', value: 0.1 },
      { type: 'stone_production', value: 0.1 },
      { type: 'gold_income', value: 0.1 },
    ],
  },
  {
    id: 'cursed',
    label: '저주받은 자',
    icon: '💀',
    description: '방어력 -20%, 건설 속도 +35%',
    effects: [
      { type: 'defense_power', value: -0.2 },
      { type: 'build_speed', value: 0.35 },
    ],
  },
];

const PHARAOH_NAMES = [
  '쿠푸', '카프레', '멘카우레', '스네페루', '제세르',
  '아메넴헤트', '세소스트리스', '투트모세', '하트셉수트', '아멘호테프',
  '아크나톤', '람세스', '세티', '메르넵타', '프삼틱',
  '네코', '아프리에스', '아마시스', '네크타네보', '호렘헵',
];

const SUCCESSION_BASE_TICKS = 6000;

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function generatePharaoh(dynastyNumber: number, dayCount: number): Pharaoh {
  const traitCount = Math.min(3, 1 + Math.floor(dynastyNumber / 3));
  const traits = pickRandom(TRAIT_POOL, traitCount);
  const name = PHARAOH_NAMES[Math.floor(Math.random() * PHARAOH_NAMES.length)];
  const suffix = dynastyNumber > 1 ? ` ${toRoman(dynastyNumber)}세` : '';

  return {
    id: `pharaoh_${dynastyNumber}_${Date.now()}`,
    name: `${name}${suffix}`,
    dynastyNumber,
    traits,
    reignStart: dayCount,
    reignEnd: null,
    layersBuilt: 0,
    reputation: 0,
  };
}

function toRoman(num: number): string {
  const vals = [10, 9, 5, 4, 1];
  const syms = ['X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result;
}

export function createDynasty(dayCount: number): Dynasty {
  const pharaoh = generatePharaoh(1, dayCount);
  return {
    currentPharaoh: pharaoh,
    pastPharaohs: [],
    dynastyNumber: 1,
    totalReputation: 0,
    successionTimer: 0,
    successionInterval: SUCCESSION_BASE_TICKS,
  };
}

export function succeedPharaoh(dynasty: Dynasty, dayCount: number): Pharaoh {
  const old = dynasty.currentPharaoh;
  old.reignEnd = dayCount;
  dynasty.pastPharaohs.push(old);
  dynasty.totalReputation += old.reputation;
  dynasty.dynastyNumber++;
  dynasty.successionTimer = 0;
  dynasty.successionInterval = SUCCESSION_BASE_TICKS + dynasty.dynastyNumber * 500;

  const newPharaoh = generatePharaoh(dynasty.dynastyNumber, dayCount);
  dynasty.currentPharaoh = newPharaoh;
  return newPharaoh;
}

export function getDynastyEffect(dynasty: Dynasty, effectType: TraitEffect['type']): number {
  let total = 0;
  for (const trait of dynasty.currentPharaoh.traits) {
    for (const eff of trait.effects) {
      if (eff.type === effectType) total += eff.value;
    }
  }
  const reputationBonus = dynasty.totalReputation * 0.001;
  if (effectType === 'worker_speed' || effectType === 'stone_production') {
    total += reputationBonus;
  }
  return total;
}
