import { Dynasty, succeedPharaoh, getDynastyEffect } from '../data/DynastyModel';
import { EventBus } from '../core/EventBus';

export class DynastySystem {
  private dynasty: Dynasty;
  private events: EventBus;

  constructor(dynasty: Dynasty, events: EventBus) {
    this.dynasty = dynasty;
    this.events = events;

    this.events.on('layer:complete', (_data: { layerIndex: number }) => {
      this.dynasty.currentPharaoh.layersBuilt++;
      this.dynasty.currentPharaoh.reputation += 10;
    });
  }

  get pharaohName(): string {
    return this.dynasty.currentPharaoh.name;
  }

  getEffect(type: Parameters<typeof getDynastyEffect>[1]): number {
    return getDynastyEffect(this.dynasty, type);
  }

  update(dayCount: number): void {
    this.dynasty.successionTimer++;

    if (this.dynasty.successionTimer >= this.dynasty.successionInterval) {
      const newPharaoh = succeedPharaoh(this.dynasty, dayCount);
      this.events.emit('dynasty:succession', {
        pharaoh: newPharaoh,
        dynastyNumber: this.dynasty.dynastyNumber,
      });
    }

    this.dynasty.currentPharaoh.reputation += 0.01;
  }
}
