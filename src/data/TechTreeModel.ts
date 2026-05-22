export interface TechNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  tier: number;
  cost: { ancientTech: number; gold: number };
  requires: string[];
  effects: TechEffect[];
  category: 'construction' | 'military' | 'economy' | 'mystical';
  unlocked: boolean;
  researched: boolean;
}

export interface TechEffect {
  type: 'worker_speed' | 'stone_production' | 'food_production' | 'gold_income'
      | 'defense_power' | 'energy_max' | 'trap_power' | 'mummy_power'
      | 'plague_resistance' | 'merchant_discount' | 'build_speed'
      | 'unlock_unit' | 'unlock_trap';
  value: number;
  label?: string;
}

export const TECH_TREE: TechNode[] = [
  // Tier 1 - Construction
  {
    id: 'stone_tools',
    name: '개량 석재 도구',
    icon: '⛏️',
    description: '석재 채취 속도 +25%',
    tier: 1,
    cost: { ancientTech: 1, gold: 5 },
    requires: [],
    effects: [{ type: 'stone_production', value: 0.25 }],
    category: 'construction',
    unlocked: true,
    researched: false,
  },
  {
    id: 'ramp_engineering',
    name: '경사로 공학',
    icon: '📐',
    description: '건설 속도 +20%',
    tier: 1,
    cost: { ancientTech: 1, gold: 8 },
    requires: [],
    effects: [{ type: 'build_speed', value: 0.2 }],
    category: 'construction',
    unlocked: true,
    researched: false,
  },
  // Tier 1 - Economy
  {
    id: 'irrigation',
    name: '관개 수로',
    icon: '🌊',
    description: '식량 생산 +30%',
    tier: 1,
    cost: { ancientTech: 1, gold: 5 },
    requires: [],
    effects: [{ type: 'food_production', value: 0.3 }],
    category: 'economy',
    unlocked: true,
    researched: false,
  },
  {
    id: 'trade_routes',
    name: '교역로 개선',
    icon: '🐪',
    description: '상인 할인 15%, 골드 수입 +15%',
    tier: 1,
    cost: { ancientTech: 1, gold: 10 },
    requires: [],
    effects: [
      { type: 'merchant_discount', value: 0.15 },
      { type: 'gold_income', value: 0.15 },
    ],
    category: 'economy',
    unlocked: true,
    researched: false,
  },
  // Tier 1 - Military
  {
    id: 'bronze_weapons',
    name: '청동 무기',
    icon: '⚔️',
    description: '방어력 +25%',
    tier: 1,
    cost: { ancientTech: 1, gold: 8 },
    requires: [],
    effects: [{ type: 'defense_power', value: 0.25 }],
    category: 'military',
    unlocked: true,
    researched: false,
  },
  // Tier 2 - Construction
  {
    id: 'granite_masonry',
    name: '화강암 석공술',
    icon: '🪨',
    description: '석재 생산 +40%, 일꾼 속도 +10%',
    tier: 2,
    cost: { ancientTech: 2, gold: 15 },
    requires: ['stone_tools'],
    effects: [
      { type: 'stone_production', value: 0.4 },
      { type: 'worker_speed', value: 0.1 },
    ],
    category: 'construction',
    unlocked: false,
    researched: false,
  },
  {
    id: 'lever_pulley',
    name: '지렛대와 도르래',
    icon: '⚙️',
    description: '건설 속도 +35%, 에너지 최대 +20',
    tier: 2,
    cost: { ancientTech: 2, gold: 20 },
    requires: ['ramp_engineering'],
    effects: [
      { type: 'build_speed', value: 0.35 },
      { type: 'energy_max', value: 20 },
    ],
    category: 'construction',
    unlocked: false,
    researched: false,
  },
  // Tier 2 - Economy
  {
    id: 'granary',
    name: '곡물 창고',
    icon: '🏛️',
    description: '식량 생산 +50%',
    tier: 2,
    cost: { ancientTech: 2, gold: 12 },
    requires: ['irrigation'],
    effects: [{ type: 'food_production', value: 0.5 }],
    category: 'economy',
    unlocked: false,
    researched: false,
  },
  // Tier 2 - Military
  {
    id: 'chariot_tech',
    name: '전차 기술',
    icon: '🏇',
    description: '방어력 +40%, 미라 전투력 +20%',
    tier: 2,
    cost: { ancientTech: 2, gold: 18 },
    requires: ['bronze_weapons'],
    effects: [
      { type: 'defense_power', value: 0.4 },
      { type: 'mummy_power', value: 0.2 },
    ],
    category: 'military',
    unlocked: false,
    researched: false,
  },
  {
    id: 'advanced_traps',
    name: '고급 함정 기술',
    icon: '🪤',
    description: '함정 위력 +60%',
    tier: 2,
    cost: { ancientTech: 2, gold: 15 },
    requires: ['bronze_weapons'],
    effects: [{ type: 'trap_power', value: 0.6 }],
    category: 'military',
    unlocked: false,
    researched: false,
  },
  // Tier 2 - Mystical
  {
    id: 'hieroglyphs',
    name: '신성문자 해독',
    icon: '𓂀',
    description: '재앙 저항 +25%',
    tier: 2,
    cost: { ancientTech: 2, gold: 20 },
    requires: [],
    effects: [{ type: 'plague_resistance', value: 0.25 }],
    category: 'mystical',
    unlocked: true,
    researched: false,
  },
  // Tier 3 - Lost Technology (이집트 전구 등)
  {
    id: 'dendera_light',
    name: '덴데라 전구',
    icon: '💡',
    description: '잃어버린 기술: 전기 함정, 함정 위력 +100%, 에너지 최대 +50',
    tier: 3,
    cost: { ancientTech: 5, gold: 50 },
    requires: ['advanced_traps', 'hieroglyphs'],
    effects: [
      { type: 'trap_power', value: 1.0 },
      { type: 'energy_max', value: 50 },
    ],
    category: 'mystical',
    unlocked: false,
    researched: false,
  },
  {
    id: 'book_of_dead',
    name: '사자의 서',
    icon: '📖',
    description: '잃어버린 기술: 미라 전투력 2배, 재앙 저항 +50%',
    tier: 3,
    cost: { ancientTech: 5, gold: 60 },
    requires: ['hieroglyphs', 'chariot_tech'],
    effects: [
      { type: 'mummy_power', value: 1.0 },
      { type: 'plague_resistance', value: 0.5 },
    ],
    category: 'mystical',
    unlocked: false,
    researched: false,
  },
  {
    id: 'pyramid_power',
    name: '피라미드 파워',
    icon: '🔺',
    description: '잃어버린 기술: 전체 생산 +30%, 에너지 재생 +50%',
    tier: 3,
    cost: { ancientTech: 5, gold: 80 },
    requires: ['lever_pulley', 'granary'],
    effects: [
      { type: 'stone_production', value: 0.3 },
      { type: 'food_production', value: 0.3 },
      { type: 'gold_income', value: 0.3 },
    ],
    category: 'construction',
    unlocked: false,
    researched: false,
  },
];

export function canResearch(tech: TechNode, nodes: TechNode[], ancientTech: number, gold: number): boolean {
  if (tech.researched) return false;
  if (!tech.unlocked) return false;
  if (ancientTech < tech.cost.ancientTech) return false;
  if (gold < tech.cost.gold) return false;
  return tech.requires.every(reqId => {
    const req = nodes.find(n => n.id === reqId);
    return req?.researched ?? false;
  });
}

export function researchTech(nodes: TechNode[], techId: string): boolean {
  const tech = nodes.find(n => n.id === techId);
  if (!tech || tech.researched) return false;
  tech.researched = true;

  for (const node of nodes) {
    if (!node.unlocked && node.requires.every(reqId => {
      const req = nodes.find(n => n.id === reqId);
      return req?.researched ?? false;
    })) {
      node.unlocked = true;
    }
  }
  return true;
}

export function getTechEffect(nodes: TechNode[], effectType: TechEffect['type']): number {
  let total = 0;
  for (const node of nodes) {
    if (!node.researched) continue;
    for (const eff of node.effects) {
      if (eff.type === effectType) total += eff.value;
    }
  }
  return total;
}

export function createTechTree(): TechNode[] {
  return TECH_TREE.map(t => ({ ...t }));
}
