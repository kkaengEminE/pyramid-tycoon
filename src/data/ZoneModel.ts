import { ZoneType } from '../components';
import { ZONE_BUFFER_MAX } from '../config';

export interface ZoneConfig {
  type: ZoneType;
  label: string;
  pickupX: number;
  pickupY: number;
  dropoffX: number;
  dropoffY: number;
  workAreaMinX: number;
  workAreaMaxX: number;
  workAreaMinY: number;
  workAreaMaxY: number;
}

export interface ZoneState {
  type: ZoneType;
  buffer: number;
  overtime: boolean;
  workerCount: number;
}

export const ZONE_CONFIGS: ZoneConfig[] = [
  {
    type: 'quarry',
    label: '채석장',
    pickupX: 5, pickupY: 20,
    dropoffX: 8, dropoffY: 20,
    workAreaMinX: 2, workAreaMaxX: 10,
    workAreaMinY: 16, workAreaMaxY: 24,
  },
  {
    type: 'bridge',
    label: '나일강 다리',
    pickupX: 11, pickupY: 20,
    dropoffX: 15, dropoffY: 20,
    workAreaMinX: 10, workAreaMaxX: 17,
    workAreaMinY: 16, workAreaMaxY: 24,
  },
  {
    type: 'base',
    label: '피라미드 기단',
    pickupX: 18, pickupY: 20,
    dropoffX: 22, dropoffY: 20,
    workAreaMinX: 17, workAreaMaxX: 26,
    workAreaMinY: 16, workAreaMaxY: 24,
  },
  {
    type: 'ramp',
    label: '경사로',
    pickupX: 24, pickupY: 19,
    dropoffX: 26, dropoffY: 19,
    workAreaMinX: 23, workAreaMaxX: 32,
    workAreaMinY: 14, workAreaMaxY: 24,
  },
  {
    type: 'wheatFarm',
    label: '밀밭',
    pickupX: 7, pickupY: 28,
    dropoffX: 7, dropoffY: 28,
    workAreaMinX: 4, workAreaMaxX: 11,
    workAreaMinY: 26, workAreaMaxY: 32,
  },
  {
    type: 'brewery',
    label: '양조장',
    pickupX: 18, pickupY: 28,
    dropoffX: 18, dropoffY: 28,
    workAreaMinX: 16, workAreaMaxX: 22,
    workAreaMinY: 26, workAreaMaxY: 32,
  },
];

export function createZoneStates(): ZoneState[] {
  return ZONE_CONFIGS.map(c => ({
    type: c.type,
    buffer: 0,
    overtime: false,
    workerCount: 0,
  }));
}

export function getZoneConfig(type: ZoneType): ZoneConfig {
  return ZONE_CONFIGS.find(z => z.type === type)!;
}

export function getZoneAtPosition(wx: number, wy: number): ZoneType | null {
  let match: ZoneType | null = null;
  for (const z of ZONE_CONFIGS) {
    if (wx >= z.workAreaMinX && wx <= z.workAreaMaxX &&
        wy >= z.workAreaMinY && wy <= z.workAreaMaxY) {
      match = z.type;
    }
  }
  return match;
}

export function getZoneIndex(type: ZoneType): number {
  return ZONE_CONFIGS.findIndex(z => z.type === type);
}

export function isBufferFull(buffer: number): boolean {
  return buffer >= ZONE_BUFFER_MAX;
}
