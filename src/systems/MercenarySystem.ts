import { World } from '../core/ECS';
import { EventBus } from '../core/EventBus';
import { ResourceStore } from '../data/ResourceStore';
import { MercenaryMarketState, MercenaryType, refreshMarket } from '../data/MercenaryModel';
import { Position, TombRobber, createPosition, createRenderable } from '../components';

export interface Mercenary {
  mercType: MercenaryType;
  health: number;
  damage: number;
  speed: number;
  lifespan: number;
  targetId: number | null;
  moveTimer: number;
}

export class MercenarySystem {
  private events: EventBus;
  private resources: ResourceStore;
  market: MercenaryMarketState;

  constructor(events: EventBus, resources: ResourceStore, market: MercenaryMarketState) {
    this.events = events;
    this.resources = resources;
    this.market = market;
  }

  hire(world: World, mercType: MercenaryType): boolean {
    if (this.resources.gold < mercType.cost.gold) return false;
    this.resources.gold -= mercType.cost.gold;

    const id = world.create();
    const spawnX = 24 + Math.random() * 4;
    const spawnY = 18 + Math.random() * 4;

    world.add(id, 'position', createPosition(spawnX, spawnY));
    world.add(id, 'renderable', createRenderable('soldier'));
    world.add<Mercenary>(id, 'mercenary', {
      mercType,
      health: mercType.stats.health,
      damage: mercType.stats.damage,
      speed: mercType.stats.speed,
      lifespan: mercType.duration,
      targetId: null,
      moveTimer: 0,
    });

    this.events.emit('mercenary:hired', { name: mercType.name, icon: mercType.icon });
    return true;
  }

  update(world: World): void {
    this.market.refreshTimer++;
    if (this.market.refreshTimer >= this.market.refreshInterval) {
      refreshMarket(this.market);
    }

    for (const id of world.query('mercenary', 'position')) {
      const m = world.get<Mercenary>(id, 'mercenary')!;
      const pos = world.get<Position>(id, 'position')!;

      m.lifespan--;
      if (m.lifespan <= 0 || m.health <= 0) {
        world.destroy(id);
        continue;
      }

      pos.prevX = pos.x;
      pos.prevY = pos.y;

      if (m.targetId !== null && (!world.exists(m.targetId) || !world.get(m.targetId, 'tombRobber'))) {
        m.targetId = null;
      }

      if (m.targetId === null) {
        let bestDist = Infinity;
        for (const rid of world.query('tombRobber', 'position')) {
          const rpos = world.get<Position>(rid, 'position')!;
          const dx = rpos.x - pos.x;
          const dy = rpos.y - pos.y;
          const dist = dx * dx + dy * dy;
          const detectRange = m.mercType.specialty === 'hunter' ? 200 : 100;
          if (dist < detectRange && dist < bestDist) {
            bestDist = dist;
            m.targetId = rid;
          }
        }
      }

      if (m.targetId !== null) {
        const targetPos = world.get<Position>(m.targetId, 'position');
        if (targetPos) {
          const dx = targetPos.x - pos.x;
          const dy = targetPos.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 1.5) {
            const robber = world.get<TombRobber>(m.targetId, 'tombRobber');
            if (robber) {
              robber.health -= m.damage;
              if (robber.health <= 0) {
                this.events.emit('mercenary:killed_robber', { name: m.mercType.name });
                world.destroy(m.targetId);
                m.targetId = null;
              }
            }
          } else {
            pos.x += (dx / dist) * m.speed * 0.1;
            pos.y += (dy / dist) * m.speed * 0.1;
          }
        }
      } else {
        m.moveTimer++;
        if (m.moveTimer >= 15) {
          m.moveTimer = 0;
          pos.x += (Math.random() - 0.5) * 1.0;
          pos.y += (Math.random() - 0.5) * 1.0;
          pos.x = Math.max(22, Math.min(30, pos.x));
          pos.y = Math.max(16, Math.min(24, pos.y));
        }
      }
    }
  }
}
