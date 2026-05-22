import { World } from '../core/ECS';
import { EventBus } from '../core/EventBus';
import { ResourceStore } from '../data/ResourceStore';
import { PLAGUES, ActivePlague, Plague } from '../data/PlagueModel';
import { GODS, ActiveBlessing, getRandomGod, God } from '../data/GodsModel';
import { Worker, Position } from '../components';

export class PlagueSystem {
  private events: EventBus;
  private resources: ResourceStore;
  activePlagues: ActivePlague[] = [];
  activeBlessings: ActiveBlessing[] = [];
  plagueImmune = false;
  plagueResistance = 0;
  private plagueTimer = 0;
  private godTimer = 0;
  private plagueInterval = 4000;
  private godInterval = 3000;
  private plagueIndex = 0;

  constructor(events: EventBus, resources: ResourceStore) {
    this.events = events;
    this.resources = resources;
  }

  getWorkerSpeedMod(): number {
    let mod = 0;
    for (const ap of this.activePlagues) {
      for (const eff of ap.plague.effects) {
        if (eff.type === 'worker_speed') mod += eff.value;
      }
    }
    for (const ab of this.activeBlessings) {
      for (const eff of ab.god.blessing.effects) {
        if (eff.type === 'worker_speed') mod += eff.value;
      }
    }
    return mod;
  }

  getDefenseMod(): number {
    let mod = 0;
    for (const ab of this.activeBlessings) {
      for (const eff of ab.god.blessing.effects) {
        if (eff.type === 'defense_power') mod += eff.value;
      }
    }
    return mod;
  }

  getEnergyRegenMod(): number {
    let mod = 0;
    for (const ap of this.activePlagues) {
      for (const eff of ap.plague.effects) {
        if (eff.type === 'energy_drain') mod -= eff.value;
      }
    }
    for (const ab of this.activeBlessings) {
      for (const eff of ab.god.blessing.effects) {
        if (eff.type === 'energy_regen') mod += eff.value;
      }
    }
    return mod;
  }

  getDarknessLevel(): number {
    for (const ap of this.activePlagues) {
      for (const eff of ap.plague.effects) {
        if (eff.type === 'vision_reduce') return eff.value;
      }
    }
    return 0;
  }

  update(world: World, dayCount: number): void {
    this.plagueTimer++;
    this.godTimer++;

    // Check plague immunity from blessings
    this.plagueImmune = this.activeBlessings.some(ab =>
      ab.god.blessing.effects.some(e => e.type === 'plague_immunity')
    );

    // Trigger plagues
    if (this.plagueTimer >= this.plagueInterval && !this.plagueImmune) {
      this.plagueTimer = 0;
      this.plagueInterval = 3000 + Math.floor(Math.random() * 2000);
      if (Math.random() >= this.plagueResistance) {
        this.triggerPlague(world, dayCount);
      }
    }

    // God intervention
    if (this.godTimer >= this.godInterval) {
      this.godTimer = 0;
      this.godInterval = 2500 + Math.floor(Math.random() * 2000);
      this.triggerGodEvent(dayCount);
    }

    // Update active plagues
    for (let i = this.activePlagues.length - 1; i >= 0; i--) {
      const ap = this.activePlagues[i];
      ap.remainingTicks--;

      this.applyPlagueEffects(world, ap);

      if (ap.remainingTicks <= 0) {
        this.events.emit('plague:ended', { plagueId: ap.plague.id, name: ap.plague.name });
        this.activePlagues.splice(i, 1);
      }
    }

    // Update active blessings
    for (let i = this.activeBlessings.length - 1; i >= 0; i--) {
      const ab = this.activeBlessings[i];
      ab.remainingTicks--;

      this.applyBlessingEffects();

      if (ab.remainingTicks <= 0) {
        this.events.emit('blessing:ended', { godId: ab.god.id, name: ab.god.name });
        this.activeBlessings.splice(i, 1);
      }
    }
  }

  private triggerPlague(world: World, _dayCount: number): void {
    const available = PLAGUES.filter(p =>
      !this.activePlagues.some(ap => ap.plague.id === p.id)
    );
    if (available.length === 0) return;

    const maxSeverity = this.plagueIndex < 3 ? 'minor' :
                         this.plagueIndex < 7 ? 'major' : 'catastrophic';
    const eligible = available.filter(p => {
      if (maxSeverity === 'minor') return p.severity === 'minor';
      if (maxSeverity === 'major') return p.severity !== 'catastrophic';
      return true;
    });

    if (eligible.length === 0) return;

    const plague = eligible[Math.floor(Math.random() * eligible.length)];
    this.activePlagues.push({ plague, remainingTicks: plague.duration });
    this.plagueIndex++;

    this.events.emit('plague:started', {
      plagueId: plague.id,
      name: plague.name,
      icon: plague.icon,
      severity: plague.severity,
      description: plague.description,
    });

    if (plague.id === 'firstborn') {
      this.applyFirstborn(world);
    }
  }

  private applyFirstborn(world: World): void {
    const workers = world.query('worker', 'position');
    if (workers.length > 0) {
      const victimId = workers[Math.floor(Math.random() * workers.length)];
      world.destroy(victimId);
    }
  }

  private applyPlagueEffects(world: World, ap: ActivePlague): void {
    for (const eff of ap.plague.effects) {
      switch (eff.type) {
        case 'food_decay':
          if (ap.remainingTicks % 10 === 0) {
            this.resources.bread = Math.max(0, this.resources.bread - eff.value * 0.5);
            this.resources.beer = Math.max(0, this.resources.beer - eff.value * 0.3);
          }
          break;
        case 'stone_loss':
          if (ap.remainingTicks % 20 === 0) {
            this.resources.stone = Math.max(0, this.resources.stone - eff.value);
          }
          break;
        case 'gold_loss':
          if (ap.remainingTicks % 30 === 0) {
            this.resources.gold = Math.max(0, this.resources.gold - eff.value);
          }
          break;
        case 'unit_damage':
          if (ap.remainingTicks % 50 === 0) {
            for (const id of world.query('worker', 'position')) {
              const w = world.get<Worker>(id, 'worker')!;
              w.speedMultiplier = Math.max(0.2, w.speedMultiplier - 0.05);
            }
          }
          break;
      }
    }
  }

  private applyBlessingEffects(): void {
    for (const ab of this.activeBlessings) {
      for (const eff of ab.god.blessing.effects) {
        if (eff.type === 'resource_gift' && ab.remainingTicks === ab.god.blessing.duration - 1) {
          this.resources.stone += eff.value;
          this.resources.bread += eff.value;
          this.resources.gold += Math.floor(eff.value / 5);
        }
      }
    }
  }

  private triggerGodEvent(_dayCount: number): void {
    const god = getRandomGod();
    const shrineBonus = 0;

    const favorRoll = Math.random() + shrineBonus * 0.1;

    if (favorRoll > 0.4) {
      if (!this.activeBlessings.some(ab => ab.god.id === god.id)) {
        this.activeBlessings.push({ god, remainingTicks: god.blessing.duration });
        this.events.emit('god:blessing', {
          godId: god.id,
          name: god.name,
          icon: god.icon,
          description: god.blessing.description,
        });
      }
    } else {
      if (god.wrath.plagueId && !this.plagueImmune) {
        const plague = PLAGUES.find(p => p.id === god.wrath.plagueId);
        if (plague && !this.activePlagues.some(ap => ap.plague.id === plague.id)) {
          this.activePlagues.push({ plague, remainingTicks: plague.duration });
          this.events.emit('god:wrath', {
            godId: god.id,
            name: god.name,
            icon: god.icon,
            description: god.wrath.description,
          });
        }
      }
    }
  }
}
