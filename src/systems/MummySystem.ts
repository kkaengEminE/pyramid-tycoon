import { World } from '../core/ECS';
import { EventBus } from '../core/EventBus';
import { PyramidModel } from '../data/PyramidModel';
import {
  Mummy, MummyType, Position, TombRobber,
  createMummy, createPosition, createRenderable,
} from '../components';

export class MummySystem {
  private events: EventBus;
  private pyramidModel: PyramidModel;
  private spawnCooldown = 0;
  mummyPowerBonus = 0;

  constructor(events: EventBus, pyramidModel: PyramidModel) {
    this.events = events;
    this.pyramidModel = pyramidModel;
  }

  update(world: World, isNight: boolean): void {
    if (this.spawnCooldown > 0) this.spawnCooldown--;

    if (isNight && this.spawnCooldown <= 0) {
      this.trySpawnMummy(world);
    }

    for (const id of world.query('mummy', 'position')) {
      const m = world.get<Mummy>(id, 'mummy')!;
      const pos = world.get<Position>(id, 'position')!;

      m.lifespan--;
      if (m.lifespan <= 0) {
        world.destroy(id);
        continue;
      }

      pos.prevX = pos.x;
      pos.prevY = pos.y;

      switch (m.state) {
        case 'idle':
          this.handleIdle(world, id, m, pos, isNight);
          break;
        case 'patrolling':
          this.handlePatrol(world, id, m, pos);
          break;
        case 'attacking':
          this.handleAttack(world, id, m, pos);
          break;
        case 'blessing':
          this.handleBlessing(world, id, m);
          break;
      }
    }
  }

  private trySpawnMummy(world: World): void {
    const burialRooms = this.pyramidModel.getAllRoomsByType('burial');
    if (burialRooms.length === 0) return;

    const existingMummies = world.query('mummy').length;
    if (existingMummies >= burialRooms.length * 2) return;

    this.spawnCooldown = 200;
    const room = burialRooms[Math.floor(Math.random() * burialRooms.length)];
    const mummyType = this.pickMummyType(room.layer);

    const id = world.create();
    const spawnX = 25 + Math.random() * 4;
    const spawnY = 18 + Math.random() * 4;

    world.add(id, 'position', createPosition(spawnX, spawnY));
    world.add(id, 'renderable', createRenderable('mummy'));
    world.add(id, 'mummy', createMummy(mummyType));

    this.events.emit('mummy:spawned', { mummyType, entityId: id });
  }

  private pickMummyType(layer: number): MummyType {
    const roll = Math.random();
    if (layer >= 15 && roll < 0.1) return 'pharaoh';
    if (layer >= 10 && roll < 0.2) return 'cursed';
    if (roll < 0.35) return 'warrior';
    if (roll < 0.55) return 'priest';
    return 'guardian';
  }

  private handleIdle(_world: World, _id: number, m: Mummy, _pos: Position, isNight: boolean): void {
    if (isNight) {
      m.state = 'patrolling';
    } else {
      if (m.mummyType === 'priest') m.state = 'blessing';
    }
  }

  private handlePatrol(world: World, _id: number, m: Mummy, pos: Position): void {
    m.moveTimer++;
    if (m.moveTimer >= 10) {
      m.moveTimer = 0;
      pos.x += (Math.random() - 0.5) * 1.5;
      pos.y += (Math.random() - 0.5) * 1.5;
      pos.x = Math.max(22, Math.min(30, pos.x));
      pos.y = Math.max(16, Math.min(24, pos.y));
    }

    const nearestRobber = this.findNearestRobber(world, pos);
    if (nearestRobber !== null) {
      m.targetEntityId = nearestRobber;
      m.state = 'attacking';
    }
  }

  private handleAttack(world: World, _id: number, m: Mummy, pos: Position): void {
    if (m.targetEntityId === null || !world.exists(m.targetEntityId)) {
      m.targetEntityId = null;
      m.state = 'patrolling';
      return;
    }

    const targetPos = world.get<Position>(m.targetEntityId, 'position');
    if (!targetPos) {
      m.targetEntityId = null;
      m.state = 'patrolling';
      return;
    }

    const dx = targetPos.x - pos.x;
    const dy = targetPos.y - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1.5) {
      const robber = world.get<TombRobber>(m.targetEntityId, 'tombRobber');
      if (robber) {
        robber.health -= m.power * (1 + this.mummyPowerBonus);
        if (robber.health <= 0) {
          this.events.emit('mummy:killed_robber', { mummyType: m.mummyType });
          world.destroy(m.targetEntityId);
          m.targetEntityId = null;
          m.state = 'patrolling';
        }
      }
    } else {
      const speed = 0.15;
      pos.x += (dx / dist) * speed;
      pos.y += (dy / dist) * speed;
    }
  }

  private handleBlessing(world: World, _id: number, m: Mummy): void {
    m.moveTimer++;
    if (m.moveTimer >= 60) {
      m.moveTimer = 0;
      for (const wid of world.query('worker', 'position')) {
        const w = world.get<import('../components').Worker>(wid, 'worker')!;
        if (!w.buffed) {
          w.speedMultiplier = Math.min(w.speedMultiplier + 0.05, 2.0);
        }
      }
      m.state = 'idle';
    }
  }

  private findNearestRobber(world: World, pos: Position): number | null {
    let nearest: number | null = null;
    let bestDist = Infinity;

    for (const rid of world.query('tombRobber', 'position')) {
      const rpos = world.get<Position>(rid, 'position')!;
      const dx = rpos.x - pos.x;
      const dy = rpos.y - pos.y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        nearest = rid;
      }
    }
    return bestDist < 100 ? nearest : null;
  }
}
