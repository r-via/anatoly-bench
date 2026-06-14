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

- **Utility [USED]**: Local type used as parameter type in SpinEventEmitter methods (on, off) and callback filtering.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic event handler.
- **Overengineering [LEAN]**: Minimal type alias for a variadic callback. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name suggests a callback type but no description of expected signature semantics or usage context.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; no mutation hazard during iteration since handlers snapshot is read directly (no mid-loop removal race for the current iteration).
- **Overengineering [OVER]**: Full custom EventEmitter (on/off/emit over a Map) reimplements Node.js built-in `EventEmitter` or `eventemitter3` (npm, ~60M/week). Has only 1 runtime importer. The hand-rolled implementation adds ~20 lines of tested-elsewhere logic with no novel behavior over the standard API.
- **Tests [NONE]**: No test file found. Core event emitter used by src/engine.ts — on(), off(), emit(), and multi-listener scenarios are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Exported public API with no documentation on lifecycle, threading guarantees, or intended usage pattern.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Constant matches the documented event string.
- **Overengineering [LEAN]**: Simple string constant export to avoid magic strings. Appropriate.
- **Tests [NONE]**: No test file found. Constant used by src/engine.ts; no tests verify its value or usage contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. String value 'spin:done' is visible but there is no description of when this event is emitted or what arguments accompany it.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | private listeners is never reassigned; marking it readonly would signal that intent and prevent accidental reassignment. SPIN_DONE literal type is auto-inferred correctly as "spin:done" — no as const needed. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither SpinEventEmitter (including its public methods on/off/emit) nor SPIN_DONE carry JSDoc. Both are public API surface used by external callers per the internal docs. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers without a try-catch. A throwing handler halts the loop and subsequent handlers never run. In a slot-engine domain where multiple subsystems (e.g., jackpot tracker, free-spin counter) may listen to SPIN_DONE, a single bad handler silently drops all downstream notifications. Wrapping each call in try-catch or using a pattern like allSettled-style iteration would be safer. [L17-L22] |

### Suggestions

- Add readonly to the listeners field to signal the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard each handler call in emit() so one throwing handler cannot silently drop subsequent notifications — critical in multi-listener gaming scenarios.
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
      console.error(`[SpinEventEmitter] handler for "${event}" threw:`, err);
    }
  }
  ```
- Add JSDoc to exported symbols.
  ```typescript
  // Before
  export class SpinEventEmitter {
    ...
  }
  export const SPIN_DONE = "spin:done";
  // After
  /**
   * Lightweight synchronous event emitter for spin lifecycle events.
   * Create one instance per spin and emit SPIN_DONE with the final SpinResult.
   */
  export class SpinEventEmitter {
    ...
  }
  
  /** Event name emitted by the engine after every completed spin. */
  export const SPIN_DONE = "spin:done";
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
