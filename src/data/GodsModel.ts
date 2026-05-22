export interface God {
  id: string;
  name: string;
  icon: string;
  domain: string;
  blessing: Blessing;
  wrath: Wrath;
}

export interface Blessing {
  description: string;
  duration: number;
  effects: BlessingEffect[];
}

export interface Wrath {
  description: string;
  plagueId: string | null;
  effects: BlessingEffect[];
}

export interface BlessingEffect {
  type: 'worker_speed' | 'food_production' | 'stone_production' | 'gold_income'
      | 'defense_power' | 'energy_regen' | 'plague_immunity' | 'resource_gift';
  value: number;
}

export interface ActiveBlessing {
  god: God;
  remainingTicks: number;
}

export const GODS: God[] = [
  {
    id: 'ra',
    name: '라',
    icon: '☀️',
    domain: '태양',
    blessing: {
      description: '라의 축복: 에너지 재생 +50%, 일꾼 속도 +20%',
      duration: 500,
      effects: [
        { type: 'energy_regen', value: 0.5 },
        { type: 'worker_speed', value: 0.2 },
      ],
    },
    wrath: {
      description: '라의 분노: 어둠의 재앙',
      plagueId: 'darkness',
      effects: [],
    },
  },
  {
    id: 'osiris',
    name: '오시리스',
    icon: '⚰️',
    domain: '사후세계',
    blessing: {
      description: '오시리스의 축복: 미라 전투력 +50%, 방어력 +30%',
      duration: 400,
      effects: [{ type: 'defense_power', value: 0.5 }],
    },
    wrath: {
      description: '오시리스의 분노: 저주받은 미라 출현',
      plagueId: null,
      effects: [{ type: 'defense_power', value: -0.3 }],
    },
  },
  {
    id: 'isis',
    name: '이시스',
    icon: '🪶',
    domain: '마법',
    blessing: {
      description: '이시스의 축복: 재앙 면역 + 자원 선물',
      duration: 300,
      effects: [
        { type: 'plague_immunity', value: 1 },
        { type: 'resource_gift', value: 30 },
      ],
    },
    wrath: {
      description: '이시스의 분노: 골드 저주',
      plagueId: null,
      effects: [{ type: 'gold_income', value: -0.5 }],
    },
  },
  {
    id: 'anubis',
    name: '아누비스',
    icon: '🐺',
    domain: '심판',
    blessing: {
      description: '아누비스의 축복: 도굴꾼 자동 처벌, 함정 강화',
      duration: 400,
      effects: [{ type: 'defense_power', value: 0.8 }],
    },
    wrath: {
      description: '아누비스의 분노: 도굴꾼 강화',
      plagueId: null,
      effects: [{ type: 'defense_power', value: -0.5 }],
    },
  },
  {
    id: 'hathor',
    name: '하토르',
    icon: '🐄',
    domain: '풍요',
    blessing: {
      description: '하토르의 축복: 식량 생산 2배, 골드 +20%',
      duration: 400,
      effects: [
        { type: 'food_production', value: 1.0 },
        { type: 'gold_income', value: 0.2 },
      ],
    },
    wrath: {
      description: '하토르의 분노: 가축 역병',
      plagueId: 'livestock',
      effects: [],
    },
  },
  {
    id: 'thoth',
    name: '토트',
    icon: '📜',
    domain: '지혜',
    blessing: {
      description: '토트의 축복: 석재 생산 +40%, 건설 효율 증가',
      duration: 350,
      effects: [{ type: 'stone_production', value: 0.4 }],
    },
    wrath: {
      description: '토트의 분노: 기술 퇴보',
      plagueId: null,
      effects: [{ type: 'stone_production', value: -0.3 }],
    },
  },
];

export function getRandomGod(): God {
  return GODS[Math.floor(Math.random() * GODS.length)];
}
