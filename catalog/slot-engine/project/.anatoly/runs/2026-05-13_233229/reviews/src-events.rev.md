# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type alias referenced in SpinEventEmitter.on, .off method signatures and locally in emit loop
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriate for a variadic event handler.
- **Overengineering [LEAN]**: Simple type alias for the handler signature; improves readability with no added abstraction cost.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias is simple enough to infer, but as part of a public module it warrants at least a one-line description.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation is correct: on/off/emit all handle the Map properly; filter-based removal in off is safe and correct; emit iterates a snapshot-equivalent (no mid-iteration mutation risk from the handler list itself).
- **Overengineering [OVER]**: Full reimplementation of a standard event emitter (on/off/emit) that Node's built-in `events.EventEmitter` or `eventemitter3` (npm, >30M/week, browser-safe) already provides. Only 1 importer per usage analysis, so no unique requirement drives the custom class. Either use Node's built-in for Node-only contexts or `eventemitter3` for universal environments.
- **Tests [NONE]**: No test file exists. All three methods (on, off, emit) are untested — including edge cases like removing a non-registered handler, emitting with no listeners, multiple handlers for the same event, and handler ordering.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Class purpose, method parameters, and behavioral contracts (e.g., no-op on missing event in off/emit) are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Exported string constant is correctly defined.
- **Overengineering [LEAN]**: Named constant for an event string prevents typos at call sites; standard and minimal.
- **Tests [NONE]**: No test file exists. Constant is used in src/engine.ts but no tests verify it is emitted at the correct lifecycle point.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The constant's purpose — what triggers this event and what listeners should expect — is not documented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class and SPIN_DONE constant are both exported with no JSDoc. In a gambling engine, contracts on event emission semantics are worth documenting. [L3-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers with no try-catch. A throwing handler aborts the loop and silently skips remaining handlers. In a slot-machine engine (jackpot, freespin), missed handler calls can corrupt game-state consistency. [L18-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are untyped plain strings. In a regulated gambling engine, a typed event map (e.g. EventMap extends Record<string, unknown[]>) would provide compile-time safety for event names and payload shapes, preventing silent mismatches in game-critical emission paths. [L5] |

### Suggestions

- Isolate handler errors in emit() so one throwing handler does not abort remaining handlers
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
      console.error(`[SpinEventEmitter] handler error on '${event}':`, err);
    }
  }
  ```
- Add a typed event map to make event names and payload shapes compile-time safe
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private listeners: Map<string, EventHandler[]> = new Map();
  
    on(event: string, handler: EventHandler): void {
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TMap extends EventMap> {
    private listeners: Map<string, EventHandler<unknown[]>[]> = new Map();
  
    on<K extends keyof TMap & string>(event: K, handler: EventHandler<TMap[K]>): void {
  ```
- Add JSDoc to SpinEventEmitter and SPIN_DONE
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight synchronous event bus for the slot-machine engine.
   * Handlers are called in registration order; errors are isolated per handler.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
