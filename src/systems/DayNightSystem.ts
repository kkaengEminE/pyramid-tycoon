import { DAY_DURATION_TICKS, NIGHT_DURATION_TICKS } from '../config';
import { EventBus } from '../core/EventBus';

export type TimeOfDay = 'day' | 'night';

export class DayNightSystem {
  timeOfDay: TimeOfDay = 'day';
  ticksInPhase = 0;
  dayCount = 1;
  private events: EventBus;
  transitionAlpha = 0;

  constructor(events: EventBus) {
    this.events = events;
  }

  get phaseDuration(): number {
    return this.timeOfDay === 'day' ? DAY_DURATION_TICKS : NIGHT_DURATION_TICKS;
  }

  get phaseProgress(): number {
    return this.ticksInPhase / this.phaseDuration;
  }

  get nightAlpha(): number {
    if (this.timeOfDay === 'day') {
      const dawnEnd = 0.1;
      const duskStart = 0.85;
      if (this.phaseProgress < dawnEnd) {
        return (1 - this.phaseProgress / dawnEnd) * 0.7;
      }
      if (this.phaseProgress > duskStart) {
        return ((this.phaseProgress - duskStart) / (1 - duskStart)) * 0.7;
      }
      return 0;
    } else {
      const fadeIn = 0.1;
      const fadeOut = 0.9;
      if (this.phaseProgress < fadeIn) {
        return (this.phaseProgress / fadeIn) * 0.7;
      }
      if (this.phaseProgress > fadeOut) {
        return (1 - (this.phaseProgress - fadeOut) / (1 - fadeOut)) * 0.7;
      }
      return 0.7;
    }
  }

  isNight(): boolean {
    return this.timeOfDay === 'night';
  }

  update(): void {
    this.ticksInPhase++;

    if (this.ticksInPhase >= this.phaseDuration) {
      this.ticksInPhase = 0;
      if (this.timeOfDay === 'day') {
        this.timeOfDay = 'night';
        this.events.emit('night:started', { dayCount: this.dayCount });
      } else {
        this.timeOfDay = 'day';
        this.dayCount++;
        this.events.emit('day:started', { dayCount: this.dayCount });
      }
    }
  }
}
