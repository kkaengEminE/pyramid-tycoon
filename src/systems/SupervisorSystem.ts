import { World } from '../core/ECS';
import { Position, Worker, Supervisor } from '../components';
import { distance } from '../math/isometric';

export class SupervisorSystem {
  update(world: World): void {
    const supervisors = world.query('supervisor', 'position');
    const workers = world.query('worker', 'position');

    for (const wId of workers) {
      const w = world.get<Worker>(wId, 'worker')!;
      w.buffed = false;
    }

    for (const sId of supervisors) {
      const sPos = world.get<Position>(sId, 'position')!;
      const sup = world.get<Supervisor>(sId, 'supervisor')!;

      for (const wId of workers) {
        const wPos = world.get<Position>(wId, 'position')!;
        const w = world.get<Worker>(wId, 'worker')!;

        const dist = distance(sPos.x, sPos.y, wPos.x, wPos.y);
        if (dist <= sup.auraRadius / 32) {
          w.buffed = true;
          w.speedMultiplier = Math.max(w.speedMultiplier, sup.speedBuff);
        }
      }
    }
  }
}
