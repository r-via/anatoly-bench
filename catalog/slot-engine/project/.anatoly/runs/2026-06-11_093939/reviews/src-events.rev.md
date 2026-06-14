# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type used locally as the array element type in `listeners` Map and as the parameter type in `on` and `off` methods.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for its use as a variadic void handler.
- **Overengineering [LEAN]**: Simple type alias for a variadic callback. Appropriate abstraction for reuse across the emitter's API surface.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias purpose and the variadic unknown signature contract are not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer: src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; no mutation hazard during iteration (snapshot via get before loop).
- **Overengineering [OVER]**: Reimplements Node.js's built-in `EventEmitter` (on/off/emit) with no added behavior. Node's `EventEmitter` is always available — no install needed. Compounded by having only 1 runtime importer, making the custom class unjustified. Replace with `import { EventEmitter } from 'node:events'` and extend or compose it directly.
- **Tests [NONE]**: No test file exists. Methods on, off, and emit are untested — including edge cases like emitting with no listeners, removing a non-existent handler, multiple handlers for the same event, and argument forwarding.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage patterns, and method parameters/return values are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer: src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple string constant, no correctness issues.
- **Overengineering [LEAN]**: Named constant for an event string. Standard practice to avoid typos at call sites.
- **Tests [NONE]**: No test file exists. Constant is imported by src/engine.ts but has no dedicated or integration-level tests confirming correct usage as an event name.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. When and why this event is emitted, and what args accompany it, are not documented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `listeners` field reference never changes; should be `private readonly listeners`. The `on` method also mutates a retrieved array in-place with `push` rather than replacing it, mixing mutation styles with the immutable `filter` pattern used in `off`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `SpinEventEmitter` class and `SPIN_DONE` constant both lack JSDoc. Public methods `on`, `off`, and `emit` are undocumented. [L3-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers without try-catch; a throwing handler halts the loop and silently drops all subsequent handlers. In a slot-machine engine where multiple subsystems (jackpot, freespin, UI) may subscribe to `spin:done`, this creates a fragile execution order dependency. [L18-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: event names are bare strings and handler signatures are `unknown[]`, offering no compile-time safety over which payloads are emitted per event. A typed event map (e.g., `interface SlotEventMap { [SPIN_DONE]: [SpinResult] }`) would catch mismatched emit/subscribe pairs at compile time — important for correctness in a regulated gaming context. [L1-L3] |

### Suggestions

- Make `listeners` field `readonly` and use consistent immutable array updates in `on`
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }
  // After
  private readonly listeners: Map<string, EventHandler[]> = new Map();
  
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    this.listeners.set(event, [...handlers, handler]);
  }
  ```
- Wrap handler calls in try-catch so one throwing handler cannot silently drop remaining handlers
  ```typescript
  // Before
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  for (const handler of handlers) {
    try {
      handler(...args);
    } catch (err) {
      console.error(`SpinEventEmitter: handler for "${event}" threw`, err);
    }
  }
  ```
- Add a typed event map for compile-time safety between emitters and subscribers
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void { ... }
  // After
  type EventMap = Record<string, unknown[]>;
  type TypedHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TMap extends EventMap> {
    on<K extends keyof TMap & string>(event: K, handler: TypedHandler<TMap[K]>): void { ... }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
