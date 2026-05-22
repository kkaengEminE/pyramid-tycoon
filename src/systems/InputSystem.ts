import { World, EntityId } from '../core/ECS';
import { EventBus } from '../core/EventBus';
import { CameraSystem } from './CameraSystem';
import { Position, Draggable } from '../components';
import { worldToScreen } from '../math/isometric';
import { getZoneAtPosition } from '../data/ZoneModel';

export class InputSystem {
  private mouseX = 0;
  private mouseY = 0;
  private mouseDown = false;
  private dragEntity: EntityId | null = null;
  private canvas: HTMLElement;
  private camera: CameraSystem;
  private world: World;
  private events: EventBus;
  hoveredPyramidLayer = -1;

  constructor(canvas: HTMLElement, camera: CameraSystem, world: World, events: EventBus) {
    this.canvas = canvas;
    this.camera = camera;
    this.world = world;
    this.events = events;

    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.camera.setMousePosition(this.mouseX, this.mouseY);

    if (this.dragEntity !== null) {
      const { wx, wy } = this.camera.screenToWorld(this.mouseX, this.mouseY);
      const pos = this.world.get<Position>(this.dragEntity, 'position');
      if (pos) {
        pos.x = wx;
        pos.y = wy;
      }
    }
  };

  private onMouseDown = (e: MouseEvent): void => {
    this.mouseDown = true;
    const { wx, wy } = this.camera.screenToWorld(e.clientX, e.clientY);

    const draggables = this.world.query('position', 'draggable');
    let closest: EntityId | null = null;
    let closestDist = 2.5;

    for (const id of draggables) {
      const pos = this.world.get<Position>(id, 'position')!;
      const dx = pos.x - wx;
      const dy = pos.y - wy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closest = id;
      }
    }

    if (closest !== null) {
      this.dragEntity = closest;
      const drag = this.world.get<Draggable>(closest, 'draggable')!;
      const pos = this.world.get<Position>(closest, 'position')!;
      drag.isDragging = true;
      drag.originX = pos.x;
      drag.originY = pos.y;
      this.events.emit('unit:drag_start', { entityId: closest });
    }
  };

  private onMouseUp = (_e: MouseEvent): void => {
    this.mouseDown = false;

    if (this.dragEntity !== null) {
      const pos = this.world.get<Position>(this.dragEntity, 'position');
      const drag = this.world.get<Draggable>(this.dragEntity, 'draggable');
      if (pos && drag) {
        drag.isDragging = false;
        const zone = getZoneAtPosition(pos.x, pos.y);
        if (zone) {
          this.events.emit('unit:dropped_in_zone', {
            entityId: this.dragEntity,
            zone,
            x: pos.x,
            y: pos.y,
          });
        } else {
          pos.x = drag.originX;
          pos.y = drag.originY;
        }
      }
      this.dragEntity = null;
    }
  };

  private onMouseLeave = (): void => {
    this.camera.setMousePosition(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
  };

  getMouseScreen(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  getMouseWorld(): { wx: number; wy: number } {
    return this.camera.screenToWorld(this.mouseX, this.mouseY);
  }

  isDragging(): boolean {
    return this.dragEntity !== null;
  }

  destroy(): void {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
