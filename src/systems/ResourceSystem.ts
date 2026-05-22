import { World } from '../core/ECS';
import { Worker } from '../components';
import { ResourceStore } from '../data/ResourceStore';
import { BREAD_PER_WORKER_TICK, BEER_PER_WORKER_TICK, OVERTIME_FOOD_MULTIPLIER, STARVATION_SPEED_PENALTY } from '../config';
import { ZoneState } from '../data/ZoneModel';
import { PyramidModel } from '../data/PyramidModel';
import { EventBus } from '../core/EventBus';
import { DynastySystem } from './DynastySystem';

export class ResourceSystem {
  private resources: ResourceStore;
  private events: EventBus;
  private pyramidModel: PyramidModel | null = null;
  private dynastySystem: DynastySystem | null = null;
  private goldTickCounter = 0;
  isStarving = false;

  constructor(resources: ResourceStore, events: EventBus) {
    this.resources = resources;
    this.events = events;
  }

  setPyramidModel(model: PyramidModel): void {
    this.pyramidModel = model;
  }

  setDynastySystem(ds: DynastySystem): void {
    this.dynastySystem = ds;
  }

  update(world: World, zoneStates: ZoneState[]): void {
    this.resources.tick();

    const workers = world.query('worker', 'position');
    let totalBreadCost = 0;
    let totalBeerCost = 0;

    for (const id of workers) {
      const w = world.get<Worker>(id, 'worker')!;
      if (w.state === 'idle' && !w.zone) continue;

      let multiplier = 1;
      if (w.zone) {
        const zoneState = zoneStates.find(z => z.type === w.zone);
        if (zoneState?.overtime) {
          multiplier = OVERTIME_FOOD_MULTIPLIER;
        }
      }
      totalBreadCost += BREAD_PER_WORKER_TICK * multiplier;
      totalBeerCost += BEER_PER_WORKER_TICK * multiplier;
    }

    const foodMod = 1 + (this.dynastySystem?.getEffect('food_consumption') ?? 0);
    totalBreadCost *= Math.max(0.1, foodMod);
    totalBeerCost *= Math.max(0.1, foodMod);

    this.resources.bread = Math.max(0, this.resources.bread - totalBreadCost);
    this.resources.beer = Math.max(0, this.resources.beer - totalBeerCost);

    const wasStarving = this.isStarving;
    this.isStarving = this.resources.bread <= 0 && this.resources.beer <= 0;

    if (this.isStarving && !wasStarving) {
      this.events.emit('resource:food_depleted', {});
    }

    const decorSpeedBonus = this.pyramidModel?.getTotalEffect('worker_speed') ?? 0;
    const dynastySpeedBonus = this.dynastySystem?.getEffect('worker_speed') ?? 0;
    const workerSpeedBonus = decorSpeedBonus + dynastySpeedBonus;

    for (const id of workers) {
      const w = world.get<Worker>(id, 'worker')!;
      if (this.isStarving) {
        w.speedMultiplier = STARVATION_SPEED_PENALTY;
      } else {
        if (!w.buffed) w.speedMultiplier = 1 + workerSpeedBonus;
      }
    }

    this.resources.energyRegenMultiplier = 1 + (this.dynastySystem?.getEffect('energy_regen') ?? 0);

    if (this.pyramidModel) {
      this.goldTickCounter++;
      if (this.goldTickCounter >= 100) {
        this.goldTickCounter = 0;
        const treasureRooms = this.pyramidModel.getAllRoomsByType('treasure').length;
        const goldProd = this.pyramidModel.getTotalEffect('gold_production');
        const dynastyGoldMod = 1 + (this.dynastySystem?.getEffect('gold_income') ?? 0);
        if (treasureRooms > 0) {
          const goldGain = Math.floor((treasureRooms + goldProd) * dynastyGoldMod);
          this.resources.gold += goldGain;
        }
      }
    }
  }
}
