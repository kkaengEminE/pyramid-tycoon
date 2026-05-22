import { World, EntityId } from '../core/ECS';
import { Position, Worker, WorkerState } from '../components';
import { WORKER_SPEED, WORKER_MINE_TICKS, WHEAT_FARM_TICKS, BREAD_PER_HARVEST, BREWERY_TICKS, BEER_PER_BREW } from '../config';
import { getZoneConfig, ZoneState } from '../data/ZoneModel';
import { ZoneType } from '../components';
import { distance } from '../math/isometric';
import { EventBus } from '../core/EventBus';
import { ResourceStore } from '../data/ResourceStore';

export class WorkerSystem {
  private events: EventBus;
  private resources: ResourceStore;
  stoneProductionBonus = 0;
  foodProductionBonus = 0;
  buildSpeedBonus = 0;

  constructor(events: EventBus, resources: ResourceStore) {
    this.events = events;
    this.resources = resources;
  }

  update(world: World, zoneStates: ZoneState[], isNight: boolean): void {
    const workers = world.query('worker', 'position');

    for (const zs of zoneStates) {
      zs.workerCount = 0;
    }

    for (const id of workers) {
      const w = world.get<Worker>(id, 'worker')!;
      const pos = world.get<Position>(id, 'position')!;

      if (w.zone) {
        const zs = zoneStates.find(z => z.type === w.zone);
        if (zs) zs.workerCount++;
      }

      if (world.has(id, 'draggable')) {
        const drag = world.get<{ isDragging: boolean }>(id, 'draggable')!;
        if (drag.isDragging) continue;
      }

      if (isNight && w.zone) {
        const zs = zoneStates.find(z => z.type === w.zone);
        if (!zs?.overtime) {
          if (w.state !== 'retreating') {
            if (w.carrying > 0 && w.zone !== 'wheatFarm' && w.zone !== 'brewery') {
              this.events.emit('stone:dropped', { x: pos.x, y: pos.y, amount: w.carrying });
            }
            w.carrying = 0;
            w.state = 'retreating';
            w.targetX = 2;
            w.targetY = 19 + Math.random() * 3;
          }
        }
      }

      this.updateState(id, w, pos, zoneStates);
    }
  }

  private updateState(id: EntityId, w: Worker, pos: Position, zoneStates: ZoneState[]): void {
    const speed = WORKER_SPEED * w.speedMultiplier;

    switch (w.state) {
      case 'idle': {
        if (!w.zone) break;
        const config = getZoneConfig(w.zone);
        w.targetX = config.pickupX + Math.random() * 2 - 1;
        w.targetY = config.pickupY + Math.random() * 2 - 1;
        w.state = 'walking_to_work';
        break;
      }

      case 'walking_to_work': {
        if (this.moveToward(pos, w.targetX, w.targetY, speed)) {
          w.state = 'mining';
          w.stateTimer = this.getWorkTicks(w.zone);
        }
        break;
      }

      case 'mining': {
        w.stateTimer--;
        if (w.stateTimer <= 0) {
          if (w.zone === 'wheatFarm') {
            this.resources.bread += BREAD_PER_HARVEST * (1 + this.foodProductionBonus);
            w.state = 'idle';
            w.stateTimer = 10;
            break;
          }
          if (w.zone === 'brewery') {
            this.resources.beer += BEER_PER_BREW * (1 + this.foodProductionBonus);
            w.state = 'idle';
            w.stateTimer = 10;
            break;
          }

          if (w.zone === 'quarry') {
            w.carrying = 1;
            const bonus = 1 + this.stoneProductionBonus;
            this.resources.stone += bonus;
          } else {
            const zoneIndex = ['quarry', 'bridge', 'base', 'ramp'].indexOf(w.zone!);
            const prevZone = zoneStates[zoneIndex];
            if (prevZone && prevZone.buffer > 0) {
              prevZone.buffer--;
              w.carrying = 1;
            } else {
              w.state = 'idle';
              w.stateTimer = 20;
              break;
            }
          }

          const config = getZoneConfig(w.zone!);
          w.targetX = config.dropoffX + Math.random() * 2 - 1;
          w.targetY = config.dropoffY + Math.random() * 2 - 1;
          w.state = 'carrying';
        }
        break;
      }

      case 'carrying': {
        if (this.moveToward(pos, w.targetX, w.targetY, speed * 0.7)) {
          w.state = 'dropping';
          w.stateTimer = 5;
        }
        break;
      }

      case 'dropping': {
        w.stateTimer--;
        if (w.stateTimer <= 0) {
          if (w.zone) {
            const zoneIndex = ['quarry', 'bridge', 'base', 'ramp'].indexOf(w.zone);
            if (w.zone === 'ramp') {
              this.events.emit('stone:placed_on_pyramid', { amount: w.carrying });
            } else {
              const nextZone = zoneStates[zoneIndex + 1];
              if (nextZone) {
                if (nextZone.buffer < 50) {
                  nextZone.buffer += w.carrying;
                } else {
                  w.state = 'idle';
                  w.stateTimer = 30;
                  w.carrying = 0;
                  break;
                }
              }
            }
          }
          w.carrying = 0;
          w.state = 'returning';
          if (w.zone) {
            const config = getZoneConfig(w.zone);
            w.targetX = config.pickupX + Math.random() * 2 - 1;
            w.targetY = config.pickupY + Math.random() * 2 - 1;
          }
        }
        break;
      }

      case 'returning': {
        if (this.moveToward(pos, w.targetX, w.targetY, speed)) {
          w.state = 'mining';
          w.stateTimer = this.getWorkTicks(w.zone);
        }
        break;
      }

      case 'retreating': {
        if (this.moveToward(pos, w.targetX, w.targetY, speed)) {
          w.state = 'idle';
        }
        break;
      }
    }
  }

  private getWorkTicks(zone: ZoneType | null): number {
    const speedMod = Math.max(0.2, 1 - this.buildSpeedBonus);
    if (zone === 'wheatFarm') return Math.floor(WHEAT_FARM_TICKS * speedMod);
    if (zone === 'brewery') return Math.floor(BREWERY_TICKS * speedMod);
    if (zone === 'quarry') return Math.floor(WORKER_MINE_TICKS * speedMod);
    return Math.floor(15 * speedMod);
  }

  private moveToward(pos: Position, tx: number, ty: number, speed: number): boolean {
    const dx = tx - pos.x;
    const dy = ty - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.3) {
      pos.x = tx;
      pos.y = ty;
      return true;
    }

    const step = Math.min(speed * 0.05, dist);
    pos.prevX = pos.x;
    pos.prevY = pos.y;
    pos.x += (dx / dist) * step;
    pos.y += (dy / dist) * step;
    return false;
  }

  assignToZone(world: World, entityId: EntityId, zone: ZoneType): void {
    const w = world.get<Worker>(entityId, 'worker');
    if (!w) return;
    w.zone = zone;
    w.state = 'idle';
    w.carrying = 0;
  }
}
