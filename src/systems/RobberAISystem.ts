import { World, EntityId } from '../core/ECS';
import { Position, TombRobber, createPosition, createRenderable, createTombRobber } from '../components';
import { PyramidModel } from '../data/PyramidModel';
import { EventBus } from '../core/EventBus';
import { ROBBER_SPEED, ROBBER_SPAWN_COUNT, PYRAMID_BASE_X, PYRAMID_BASE_Y } from '../config';

export class RobberAISystem {
  private model: PyramidModel;
  private events: EventBus;
  private spawnedThisNight = false;

  constructor(model: PyramidModel, events: EventBus) {
    this.model = model;
    this.events = events;

    events.on('night:started', () => {
      this.spawnedThisNight = false;
    });
  }

  update(world: World, isNight: boolean, tick: number): void {
    if (!isNight) {
      const robbers = world.query('tombRobber', 'position');
      for (const id of robbers) {
        world.destroy(id);
      }
      return;
    }

    if (!this.spawnedThisNight && this.model.currentLayer >= 3) {
      this.spawnRobbers(world);
      this.spawnedThisNight = true;
    }

    const robbers = world.query('tombRobber', 'position');
    for (const id of robbers) {
      const robber = world.get<TombRobber>(id, 'tombRobber')!;
      const pos = world.get<Position>(id, 'position')!;
      this.updateRobber(id, robber, pos, world);
    }
  }

  private spawnRobbers(world: World): void {
    const count = Math.min(ROBBER_SPAWN_COUNT, 1 + Math.floor(this.model.currentLayer / 5));
    for (let i = 0; i < count; i++) {
      const id = world.create();
      const entrance = this.model.maze[Math.floor(this.model.mazeHeight / 2)];
      const entryCell = entrance?.[this.model.mazeWidth - 1];

      world.add(id, 'position', createPosition(
        PYRAMID_BASE_X + 6 + Math.random() * 2,
        PYRAMID_BASE_Y + Math.random() * 3 - 1,
        0,
      ));
      world.add(id, 'renderable', createRenderable('robber'));

      const robber = createTombRobber();
      if (entryCell) {
        robber.mazeX = entryCell.x;
        robber.mazeY = entryCell.y;
      }
      world.add(id, 'tombRobber', robber);
    }
  }

  private updateRobber(id: EntityId, robber: TombRobber, pos: Position, world: World): void {
    robber.moveTimer--;

    switch (robber.state) {
      case 'entering': {
        const tx = PYRAMID_BASE_X + 2;
        const ty = PYRAMID_BASE_Y;
        const dx = tx - pos.x;
        const dy = ty - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
          robber.state = 'wandering';
          robber.moveTimer = 15;
        } else {
          pos.prevX = pos.x;
          pos.prevY = pos.y;
          pos.x += (dx / dist) * ROBBER_SPEED * 0.05;
          pos.y += (dy / dist) * ROBBER_SPEED * 0.05;
        }
        break;
      }

      case 'wandering': {
        if (robber.moveTimer <= 0) {
          const neighbors = this.model.getWalkableNeighbors(robber.mazeX, robber.mazeY);
          const unvisited = neighbors.filter(n => !robber.visitedRooms.has(`${n.x},${n.y}`));
          const choices = unvisited.length > 0 ? unvisited : neighbors;

          if (choices.length > 0) {
            const weights = choices.map(cell => {
              let w = 1;
              if (cell.hasTreasure) w = 5;
              if (cell.hasTrap) w = 0.3;
              return w;
            });
            const totalW = weights.reduce((a, b) => a + b, 0);
            let roll = Math.random() * totalW;
            let chosen = choices[0];
            for (let i = 0; i < choices.length; i++) {
              roll -= weights[i];
              if (roll <= 0) { chosen = choices[i]; break; }
            }

            robber.visitedRooms.add(`${robber.mazeX},${robber.mazeY}`);
            robber.mazeX = chosen.x;
            robber.mazeY = chosen.y;

            if (chosen.hasTrap) {
              this.events.emit('trap:triggered', {
                robberId: id,
                trapX: chosen.x,
                trapY: chosen.y,
              });
            }

            if (chosen.hasTreasure) {
              robber.state = 'looting';
              robber.moveTimer = 30;
              break;
            }
          }

          robber.moveTimer = 12 + Math.floor(Math.random() * 8);
          this.updateRobberScreenPos(robber, pos);
        }
        break;
      }

      case 'looting': {
        if (robber.moveTimer <= 0) {
          robber.loot++;
          robber.state = 'fleeing';
          this.events.emit('robber:stole_treasure', { robberId: id, loot: robber.loot });
        }
        break;
      }

      case 'fleeing': {
        const exitX = PYRAMID_BASE_X + 8;
        const exitY = PYRAMID_BASE_Y;
        const dx = exitX - pos.x;
        const dy = exitY - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
          world.destroy(id);
        } else {
          pos.prevX = pos.x;
          pos.prevY = pos.y;
          pos.x += (dx / dist) * ROBBER_SPEED * 0.08;
          pos.y += (dy / dist) * ROBBER_SPEED * 0.08;
        }
        break;
      }
    }
  }

  private updateRobberScreenPos(robber: TombRobber, pos: Position): void {
    const baseSize = 14;
    const shrink = Math.min(this.model.currentLayer, 10) * 0.42;
    const halfW = (baseSize - shrink) / 2;
    const cellSize = (halfW * 2) / this.model.mazeWidth;

    pos.prevX = pos.x;
    pos.prevY = pos.y;
    pos.x = PYRAMID_BASE_X - halfW + robber.mazeX * cellSize + cellSize / 2;
    pos.y = PYRAMID_BASE_Y - halfW + robber.mazeY * cellSize + cellSize / 2;
  }
}
