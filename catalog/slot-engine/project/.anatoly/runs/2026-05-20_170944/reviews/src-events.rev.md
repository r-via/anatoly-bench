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

- **Utility [USED]**: Type used locally in EventHandler[] on line 5 and as parameter type in on/off methods (lines 9, 13)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void callback.
- **Overengineering [LEAN]**: Simple type alias; improves readability with no added complexity.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is clear but the variadic `unknown[]` signature and intended use as an event callback warrant at least a brief description.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: on initialises missing arrays, off filters by reference identity, emit iterates a snapshot-free but mutation-safe loop (handlers added during emit will fire; handlers removed during emit may or may not fire depending on index — acceptable for this use-case). No crashes, no data loss.
- **Overengineering [OVER]**: Reimplements Node.js built-in `EventEmitter` (always available, no install needed): `on`, `off`, `emit` with a `Map<string, handler[]>` are exactly what `EventEmitter` provides. 1 importer and fresh-per-spin instantiation (per internal docs) further undercut the value of a bespoke class. Replace with `import { EventEmitter } from 'node:events'` or, for browser compat, `mitt` (npm, ~8M/week, <300B).
- **Tests [NONE]**: No test file exists. Methods on, off, and emit are untested — including edge cases like removing a non-registered handler, emitting with no listeners, multiple handlers for the same event, and handler argument forwarding. Used by src/engine.ts, making coverage gaps business-critical.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Public API surface with non-trivial semantics (listener deduplication behavior, variadic args) is entirely undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant correctly matches documented event name "spin:done".
- **Overengineering [LEAN]**: Exported string constant prevents typos at call sites; appropriate for any event-name binding.
- **Tests [NONE]**: No test file exists. Constant is referenced by src/engine.ts but no tests verify it is used correctly as an event name.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The constant's role as the event name emitted after each spin() call, and the shape of its payload, are not described anywhere inline.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `private listeners` reference is never reassigned; should be `private readonly listeners`. The `on` handler also mutates the array in place after retrieval instead of creating a new array, mixing mutation styles with the immutable approach used in `off`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor `SPIN_DONE` carries a JSDoc comment. The class's `on`/`off`/`emit` public methods are also undocumented. [L3,L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers without try-catch. A throwing handler silently aborts remaining handlers. For a slot-engine event bus this is a correctness risk — downstream audit/telemetry listeners may not fire after a bad UI handler. [L17-L21] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are plain `string`, so typos (e.g. `'spin:dne'`) are silently ignored at compile time. In a regulated gaming domain, a typed event-name union or a generic typed-emitter pattern would catch dispatch/subscribe mismatches at compile time. [L5,L25] |

### Suggestions

- Mark `listeners` readonly since the Map reference is never replaced
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard remaining handlers against a throwing listener
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
- Use a typed event map to make event names compile-time safe
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void
  // After
  type EventMap = { [K in typeof SPIN_DONE]: (result: SpinResult) => void };
  
  class SpinEventEmitter {
    on<K extends keyof EventMap>(event: K, handler: EventMap[K]): void
  ```
- Add JSDoc to exported symbols
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Minimal synchronous event emitter used by the slot engine.
   * Supports multiple listeners per event via `on`/`off`/`emit`.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
