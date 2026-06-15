# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 78% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type used internally for handler parameter types and listeners Map value type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void callback.
- **Overengineering [LEAN]**: Minimal type alias for a variadic handler. No abstraction beyond what's needed.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The type alias is simple but its variadic unknown[] signature and intended usage context (event handler callbacks) merit a brief description.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; off correctly filters by reference identity; emit iterates a snapshot-free live array (safe since handlers are not removed during iteration in current usage).
- **Overengineering [ACCEPTABLE]**: Custom pub/sub with on/off/emit is slightly heavier than needed: the reference docs state each spin() creates a fresh emitter, emits once, then discards it, making off() and multi-listener arrays dead weight in practice. A simple callback parameter to spin() would be more direct. That said, the docs explicitly endorse this API surface, the implementation is only 20 lines, and browser portability justifies avoiding Node's built-in EventEmitter. Complexity is bounded and the pattern is human-validated by the reference docs.
- **Tests [NONE]**: No test file exists. Critical behaviors untested: on() accumulating multiple handlers, off() removing only the target handler, emit() invoking all handlers with args, emit() on unknown event, off() on unknown event, and duplicate handler registration. Used by src/engine.ts, making this a meaningful coverage gap.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial behavior (listener deduplication via filter, silent no-op on missing event in off/emit) deserves at minimum class-level and method-level docs.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Value matches documented constant 'spin:done' exactly.
- **Overengineering [LEAN]**: Plain string constant for the single built-in event name. Appropriate.
- **Tests [NONE]**: No test file exists. Constant string used as an event key in src/engine.ts; its integration with SpinEventEmitter.emit/on is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. As a public event-name constant consumed by external callers, it should document when it is emitted and what payload to expect.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned; `readonly` should be applied to make that invariant explicit and compiler-enforced. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `SpinEventEmitter` and `SPIN_DONE` are both exported with no JSDoc. The public methods `on`, `off`, and `emit` also lack documentation. [L3-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers with no per-handler try-catch. A throwing handler aborts all subsequent handlers silently. No async/promise issues, but synchronous error isolation is a reliability gap for a shared event bus. [L18-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | The emitter uses untyped `string` event keys and `unknown[]` args, forfeiting compile-time payload type safety. A generic `SpinEventEmitter<TEvents extends Record<string, unknown[]>>` would catch mismatched payloads at call sites. [L1-L4] |

### Suggestions

- Mark `listeners` readonly to enforce the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Add JSDoc to the exported class and constant.
  ```typescript
  // Before
  export class SpinEventEmitter {
  export const SPIN_DONE = "spin:done";
  // After
  /** Lightweight synchronous event bus used by the spin engine. */
  export class SpinEventEmitter {
  
  /** Event name emitted after each spin, carrying the completed `SpinResult`. */
  export const SPIN_DONE = "spin:done";
  ```
- Isolate handler errors in `emit` so one throwing handler does not abort subsequent listeners.
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
- Type the emitter generically to enforce event/payload contracts at call sites.
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private listeners: Map<string, EventHandler[]> = new Map();
  
    on(event: string, handler: EventHandler): void {
    off(event: string, handler: EventHandler): void {
    emit(event: string, ...args: unknown[]): void {
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TEvents extends EventMap = Record<string, unknown[]>> {
    private readonly listeners = new Map<keyof TEvents, EventHandler<unknown[]>[]>();
  
    on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
