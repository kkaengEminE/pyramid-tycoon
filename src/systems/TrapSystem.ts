import { World } from '../core/ECS';
import { Trap, TombRobber } from '../components';
import { EventBus } from '../core/EventBus';
import { ResourceStore } from '../data/ResourceStore';
import { PyramidModel } from '../data/PyramidModel';

export class TrapSystem {
  private events: EventBus;
  private resources: ResourceStore;
  private model: PyramidModel;

  constructor(events: EventBus, resources: ResourceStore, model: PyramidModel) {
    this.events = events;
    this.resources = resources;
    this.model = model;

    events.on<{ robberId: number; trapX: number; trapY: number }>('trap:triggered', (data) => {
      this.handleTrapTrigger(data.trapX, data.trapY, data.robberId);
    });
  }

  private handleTrapTrigger(trapX: number, trapY: number, robberId: number): void {
    const cell = this.model.getMazeCell(trapX, trapY);
    if (!cell?.hasTrap) return;

    if (!this.resources.canAfford(1, 'stone')) {
      this.events.emit('trap:no_resources', { trapX, trapY });
      return;
    }

    this.resources.spend(1, 'stone');
    this.events.emit('trap:activated', {
      trapX,
      trapY,
      robberId,
      damage: 30,
    });
  }

  update(world: World): void {
    const traps = world.query('trap', 'position');
    for (const id of traps) {
      const trap = world.get<Trap>(id, 'trap')!;
      if (trap.cooldown > 0) trap.cooldown--;
    }
  }

  placeTrap(x: number, y: number): boolean {
    const cell = this.model.getMazeCell(x, y);
    if (!cell || !cell.walkable || cell.hasTrap) return false;
    if (!this.resources.canAfford(3, 'stone')) return false;

    this.resources.spend(3, 'stone');
    cell.hasTrap = true;
    return true;
  }
}
