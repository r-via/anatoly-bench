type EventHandler = (...args: unknown[]) => void;

export class SpinEventEmitter {
  private listeners: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    this.listeners.set(event, handlers.filter(h => h !== handler));
  }

  emit(event: string, ...args: unknown[]): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(...args);
    }
  }
}

export const SPIN_DONE = "spin:done";
