export type EntityId = number;

export interface ComponentMap {
  [key: string]: unknown;
}

export class World {
  private nextId = 1;
  private entities = new Map<EntityId, Map<string, unknown>>();
  private byComponent = new Map<string, Set<EntityId>>();

  create(): EntityId {
    const id = this.nextId++;
    this.entities.set(id, new Map());
    return id;
  }

  destroy(id: EntityId): void {
    const comps = this.entities.get(id);
    if (!comps) return;
    for (const key of comps.keys()) {
      this.byComponent.get(key)?.delete(id);
    }
    this.entities.delete(id);
  }

  add<T>(id: EntityId, name: string, component: T): void {
    const comps = this.entities.get(id);
    if (!comps) return;
    comps.set(name, component);
    if (!this.byComponent.has(name)) {
      this.byComponent.set(name, new Set());
    }
    this.byComponent.get(name)!.add(id);
  }

  get<T>(id: EntityId, name: string): T | undefined {
    return this.entities.get(id)?.get(name) as T | undefined;
  }

  has(id: EntityId, name: string): boolean {
    return this.entities.get(id)?.has(name) ?? false;
  }

  remove(id: EntityId, name: string): void {
    this.entities.get(id)?.delete(name);
    this.byComponent.get(name)?.delete(id);
  }

  query(...componentNames: string[]): EntityId[] {
    if (componentNames.length === 0) return [];
    const sets = componentNames.map(n => this.byComponent.get(n));
    if (sets.some(s => !s)) return [];

    let smallest = sets[0]!;
    for (const s of sets) {
      if (s!.size < smallest.size) smallest = s!;
    }

    const result: EntityId[] = [];
    for (const id of smallest) {
      if (componentNames.every(n => this.entities.get(id)?.has(n))) {
        result.push(id);
      }
    }
    return result;
  }

  exists(id: EntityId): boolean {
    return this.entities.has(id);
  }

  allIds(): EntityId[] {
    return Array.from(this.entities.keys());
  }
}

export abstract class System {
  abstract update(world: World, dt: number): void;
}
