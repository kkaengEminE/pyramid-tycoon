type Handler<T = unknown> = (data: T) => void;

export class EventBus {
  private handlers = new Map<string, Handler[]>();

  on<T>(event: string, handler: Handler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler as Handler);
    return () => this.off(event, handler as Handler);
  }

  off(event: string, handler: Handler): void {
    const list = this.handlers.get(event);
    if (!list) return;
    const idx = list.indexOf(handler);
    if (idx >= 0) list.splice(idx, 1);
  }

  emit<T>(event: string, data: T): void {
    const list = this.handlers.get(event);
    if (!list) return;
    for (const h of list) h(data);
  }

  clear(): void {
    this.handlers.clear();
  }
}
