# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 85% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type alias used locally in SpinEventEmitter class as parameter type and in Map generic
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic event handler.
- **Overengineering [LEAN]**: Simple type alias for a variadic function. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is non-obvious; a brief description of expected usage would help callers.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; filter-based removal handles duplicates safely; snapshot-less iteration is safe since handlers array is replaced on off(), not mutated in place.
- **Overengineering [OVER]**: Full pub/sub bus (Map<string, handler[]>, on/off/emit) for a single-event, single-use object: docs confirm each spin() creates a new emitter, emits SPIN_DONE once, then discards it. The off() method is dead weight under this lifecycle. Only 1 runtime importer. Node.js built-in EventEmitter (zero deps, extend or delegate) covers this entirely, or a simple callback parameter to spin() would suffice given the discard-after-emit pattern.
- **Tests [NONE]**: No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods and edge cases (duplicate handlers, unknown events, multiple args, handler removal) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack JSDoc. Parameters and return types are undocumented; lifecycle semantics (one-per-spin vs shared) are unexplained.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Value 'spin:done' matches documented constant exactly.
- **Overengineering [LEAN]**: String constant for the sole event name. Appropriate.
- **Tests [NONE]**: No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or integration usage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc describing when this event fires or what arguments are passed to handlers.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `listeners` field reference never changes — should be `private readonly listeners`. The `SPIN_DONE` const correctly infers as a literal type `"spin:done"` via `const`, so no issue there. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor its public methods (`on`, `off`, `emit`) nor `SPIN_DONE` carry JSDoc. The internal docs describe this class as the engine's public event bus — documentation is warranted. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | In `emit()`, if a handler throws, the exception propagates synchronously and all subsequent handlers in the loop are silently skipped. In a slot engine where multiple listeners may record payout telemetry or update state, a single failing handler can silently suppress downstream processing. Wrapping each invocation in try-catch and continuing the loop is the safer default. [L19-L23] |

### Suggestions

- Mark `listeners` as `readonly` — the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler failures in `emit()` so one throwing handler does not abort remaining listeners.
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
      // log or re-emit as 'error' event; do not abort remaining handlers
      console.error(`SpinEventEmitter: handler for "${event}" threw`, err);
    }
  }
  ```
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight synchronous event bus used by the spin engine.
   * A new instance is created per `spin()` call and discarded after `SPIN_DONE` is emitted.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
