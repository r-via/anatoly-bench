# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type used locally as parameter type in on() and off() methods
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriately broad for a generic event emitter.
- **Overengineering [LEAN]**: Simple type alias that names the handler signature used throughout the file. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal (non-exported) type alias; self-descriptive name and signature reduce severity, but no description of expected handler contract (e.g. void return, variadic args semantics).

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: on appends and re-sets (handles missing key), off filters by reference identity, emit iterates a snapshot-safe copy-by-reference (safe since filter returns new array and no mid-iteration mutation occurs).
- **Overengineering [OVER]**: NIH reimplementation of Node.js's built-in EventEmitter (or browser EventTarget). on/off/emit over a Map<string, fn[]> is exactly what both provide natively. Has 1 importer and is instantiated fresh per spin, so no lifecycle complexity justifies a custom class. Replace with `import { EventEmitter } from 'node:events'` or, for browser targets, EventTarget.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multiple listeners, handler deduplication on off(), and emit-with-no-listeners path are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public class with no JSDoc on the class or any of its three methods (on, off, emit). Missing: class-level purpose, event name conventions, listener ordering guarantees, and per-method parameter/return docs.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Constant string matches documented event name 'spin:done'.
- **Overengineering [LEAN]**: Simple string constant to avoid a magic string. Appropriate.
- **Tests [NONE]**: No test file exists. Constant imported by src/engine.ts but never verified in tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported constant with no JSDoc. The string value 'spin:done' hints at purpose but does not document when the event fires, what arguments are passed to listeners, or which emitter emits it.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned; the field reference should be `readonly`. `Map.set/get` still work on a `readonly` Map field. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class), `SPIN_DONE` (constant), and the three public methods `on`/`off`/`emit` are all exported without JSDoc. [L2-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers in a bare `for...of` with no try-catch. A throwing handler silently aborts all subsequent listeners. Wrap each invocation to isolate faults. [L18-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event keys are untyped `string`. A typed event map (generic parameter `TEvents extends Record<string, unknown[]>`) would catch typos like `"spin:dne"` at compile time and is idiomatic for typed event emitters. [L1-L23] |

### Suggestions

- Mark `listeners` as `readonly` — the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in `emit` so one throwing listener does not abort the rest.
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
      // surface or log; continue to next handler
      console.error(`SpinEventEmitter: handler error on "${event}"`, err);
    }
  }
  ```
- Add a generic event-map parameter to make event names and payloads type-safe at call sites.
  ```typescript
  // Before
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
    on(event: string, handler: EventHandler): void { ... }
    emit(event: string, ...args: unknown[]): void { ... }
  // After
  type EventMap = Record<string, unknown[]>;
  
  export class SpinEventEmitter<TEvents extends EventMap = EventMap> {
    private readonly listeners = new Map<keyof TEvents & string, Array<(...args: unknown[]) => void>>();
    on<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void): void { ... }
    emit<K extends keyof TEvents & string>(event: K, ...args: TEvents[K]): void { ... }
  ```
- Add JSDoc to exported symbols.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Minimal typed event bus. Emit `SPIN_DONE` with a `SpinResult` after each spin. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
