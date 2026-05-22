import { ENERGY_MAX, ENERGY_REGEN_PER_TICK } from '../config';

export interface Resources {
  stone: number;
  bread: number;
  beer: number;
  gold: number;
  cedar: number;
  hide: number;
  papyrus: number;
  ancientTech: number;
  curses: number;
  energy: number;
  energyMax: number;
}

export type SpendableResource = 'stone' | 'bread' | 'beer' | 'gold' | 'cedar' | 'hide' | 'papyrus' | 'ancientTech' | 'curses' | 'energy';

export class ResourceStore {
  stone = 50;
  bread = 100;
  beer = 100;
  gold = 5;
  cedar = 0;
  hide = 0;
  papyrus = 0;
  ancientTech = 0;
  curses = 0;
  energy = ENERGY_MAX;
  energyMax = ENERGY_MAX;
  energyRegenMultiplier = 1;

  pyramidStones = 0;
  currentLayer = 0;
  totalLayers = 30;

  get totalFood(): number {
    return this.bread + this.beer;
  }

  tick(): void {
    this.energy = Math.min(this.energyMax, this.energy + ENERGY_REGEN_PER_TICK * this.energyRegenMultiplier);
  }

  canAfford(cost: number, resource: SpendableResource): boolean {
    return this[resource] >= cost;
  }

  spend(amount: number, resource: SpendableResource): boolean {
    if (this[resource] < amount) return false;
    this[resource] -= amount;
    return true;
  }

  getSnapshot(): Resources {
    return {
      stone: this.stone,
      bread: this.bread,
      beer: this.beer,
      gold: this.gold,
      cedar: this.cedar,
      hide: this.hide,
      papyrus: this.papyrus,
      ancientTech: this.ancientTech,
      curses: this.curses,
      energy: this.energy,
      energyMax: this.energyMax,
    };
  }
}
