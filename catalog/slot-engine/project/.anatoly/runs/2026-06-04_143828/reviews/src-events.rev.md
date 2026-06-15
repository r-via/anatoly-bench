# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type used locally as the type annotation for handler parameters in on(), off(), and the listeners Map.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct.
- **Overengineering [LEAN]**: Minimal type alias; appropriate named abstraction for handler signatures used throughout the class.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic unknown[] signature is not self-evident — a brief description of intended usage would help.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: on() mutates the shared handlers array in-place; a handler that calls on() for the same event during emit() appends to the array currently being iterated, causing the new handler to fire in the same cycle — and causing an infinite loop if a handler re-registers itself.
- **Overengineering [OVER]**: Hand-rolls on/off/emit over a Map — exactly what Node.js built-in EventEmitter provides. NIH against a zero-install built-in. With only 1 runtime importer this abstraction was never needed; consumers could use `EventEmitter` from 'node:events' directly, or a lightweight typed wrapper around it. No multi-channel routing, async, or wildcard logic justifies a custom implementation.
- **Tests [NONE]**: No test file exists. on/off/emit methods are untested — missing coverage for multi-handler dispatch, handler removal, duplicate removal, emit with no listeners, and args forwarding.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Parameters and return types are unannotated in docs; purpose of the emitter relative to existing Node.js EventEmitter is unexplained.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correct.
- **Overengineering [LEAN]**: Single named constant to avoid magic strings. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts as an event key; not validated in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The event name constant lacks any description of when it is emitted or what payload (if any) listeners should expect.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` Map field lacks `readonly` modifier, allowing reassignment. The field reference itself should be pinned even though Map contents are mutable by design. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` class and its three public methods (`on`, `off`, `emit`) are exported without JSDoc. `SPIN_DONE` constant also undocumented. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The `emit` loop has no try-catch around handler invocations. A throwing handler aborts all subsequent handlers silently — in a casino spin lifecycle (e.g. `spin:done` triggering jackpot + free-spin + UI updates simultaneously), one bad handler can silently suppress downstream effects. [L17-L21] |

### Suggestions

- Add `readonly` to `listeners` to prevent field reassignment
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in `emit` so a throwing handler does not suppress later handlers
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
      // preserve isolation; optionally re-emit an 'error' event
      console.error(`SpinEventEmitter: handler error on '${event}'`, err);
    }
  }
  ```
- Add JSDoc to exported class and constant
  ```typescript
  // Before
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void {
  // After
  /** Lightweight synchronous event bus for spin lifecycle events. */
  export class SpinEventEmitter {
    /**
     * Register a handler for the given event name.
     * @param event - Event identifier (e.g. SPIN_DONE)
     * @param handler - Callback invoked with emitted arguments
     */
    on(event: string, handler: EventHandler): void {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In emit(), change `for (const handler of handlers)` to `for (const handler of handlers.slice())` so mutations caused by on() calls inside a handler do not affect the current iteration, preventing unexpected mid-cycle invocations and potential infinite loops. [L21]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
