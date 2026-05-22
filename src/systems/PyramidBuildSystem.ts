import { EventBus } from '../core/EventBus';
import { PyramidModel } from '../data/PyramidModel';
import { PYRAMID_LAYERS } from '../config';

export class PyramidBuildSystem {
  private model: PyramidModel;
  private events: EventBus;

  constructor(model: PyramidModel, events: EventBus) {
    this.model = model;
    this.events = events;

    events.on('stone:placed_on_pyramid', (data: { amount: number }) => {
      for (let i = 0; i < data.amount; i++) {
        const layerComplete = this.model.addStone();
        if (layerComplete) {
          this.events.emit('layer:complete', {
            layerIndex: this.model.currentLayer - 1,
            totalLayers: PYRAMID_LAYERS,
          });
          if (this.model.currentLayer >= PYRAMID_LAYERS) {
            this.events.emit('game:ending', { finalLayer: PYRAMID_LAYERS });
          }
        }
      }
    });
  }

  getProgress(): number {
    return this.model.getProgress();
  }

  getCurrentLayer(): number {
    return this.model.currentLayer;
  }
}
