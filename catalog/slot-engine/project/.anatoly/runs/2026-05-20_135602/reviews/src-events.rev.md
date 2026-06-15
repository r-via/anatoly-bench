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

- **Utility [USED]**: Non-exported type used locally in SpinEventEmitter method signatures and Map declaration
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriate for variadic event handlers.
- **Overengineering [LEAN]**: Minimal type alias for a function signature; appropriate shared type.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The type alias is simple enough that its signature is self-explanatory, but no description of its intended use or constraints.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Event emitter implementation is correct: on/off/emit all handle missing-key cases, filter correctly removes by reference identity, and iteration over handlers is safe (snapshot not needed since no mutation occurs during iteration in the current implementation).
- **Overengineering [OVER]**: Hand-rolls a pub/sub system (on/off/emit) that Node.js `EventEmitter` provides as a built-in. One importer. Per internal docs, the engine creates a fresh emitter each spin, so no external subscriber can attach to the engine's own instance — callers must wrap `spin()` and build their own emitter anyway, defeating the abstraction. A direct callback param on `spin()` or simply using the return value would be sufficient; the generic event system is premature generalization for a single, synchronous event.
- **Tests [NONE]**: No test file exists. Core event bus used by engine.ts — on/off/emit and edge cases (unknown event, duplicate handlers, handler removal) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). A public API class with three exported methods has no description of purpose, parameters, or behavior.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Constant matches the internal documentation contract and is correctly exported.
- **Overengineering [LEAN]**: Single string constant for an event name — minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used by engine.ts but never verified in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The constant's value is visible but there is no documentation of when it is emitted, what args are passed, or how consumers should use it.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` field is private but not `readonly`. The Map reference never changes — `private readonly listeners` would communicate and enforce that intent. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported class `SpinEventEmitter`, its three public methods (`on`, `off`, `emit`), and constant `SPIN_DONE` have no JSDoc. Callers can only infer semantics from the internal guide. [L3-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The `emit` loop is unguarded: if any handler throws synchronously, remaining handlers are silently skipped. For a slot engine where multiple listeners track jackpot hits and audit trails, partial emission on error is a reliability hazard. [L19-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are untyped `string` — any arbitrary string is accepted. A generic `SpinEventEmitter<TEvents extends Record<string, unknown[]>>` would give compile-time safety between event names and their payload shapes, which matters in a regulated gaming domain where mismatched payloads (e.g. missing `jackpotHit`) could silently produce wrong audit data. [L3-L25] |

### Suggestions

- Mark `listeners` as `readonly` — the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard handler invocations so one throwing handler doesn't silently drop remaining listeners.
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
- Add generic type parameters for compile-time event/payload safety.
  ```typescript
  // Before
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
  // After
  type EventMap = Record<string, unknown[]>;
  
  export class SpinEventEmitter<TEvents extends EventMap = EventMap> {
    private readonly listeners: Map<keyof TEvents & string, Array<(...args: unknown[]) => void>> = new Map();
  ```
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight synchronous event emitter used by the spin engine.
   * Emit `SPIN_DONE` after every `spin()` call to propagate `SpinResult` to subscribers.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
