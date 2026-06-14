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

- **Utility [USED]**: Non-exported type used locally as the type annotation for handler parameters in SpinEventEmitter's listeners map and method signatures.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for its usage as a variadic void handler.
- **Overengineering [LEAN]**: Simple type alias that improves readability; no abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The type alias is simple but its intended use (variadic unknown args, void return) warrants at least a brief description.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: lazy-init on get, filter-out on remove, iterate snapshot on emit.
- **Overengineering [OVER]**: Hand-rolls on/off/emit over a private Map, reimplementing Node.js built-in EventEmitter (no install needed in Node) or eventemitter3 (npm, >5M/week) in a browser context. Only 1 runtime importer amplifies the over-abstraction signal. Drop-in replacement: `class SpinEventEmitter extends EventEmitter {}` (Node) or swap for eventemitter3.
- **Tests [NONE]**: No test file exists. Methods on()/off()/emit() have zero coverage — including edge cases like duplicate handlers, off() on unknown events, emit() with no listeners, and multiple args propagation. Used by src/engine.ts making this a critical untested dependency.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage, and method parameters/return values are entirely undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly typed and exported.
- **Overengineering [LEAN]**: Single exported string constant; minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant string used by src/engine.ts but never tested as an event name in integration scenarios.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining when this event is emitted or what payload, if any, accompanies it.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE is inferred as string rather than the literal type "spin:done" — missing as const widens the type unnecessarily. [L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class and SPIN_DONE constant have no JSDoc. Public methods on(), off(), and emit() are also undocumented. [L2-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers with no try-catch. A throwing handler aborts the rest of the chain silently — in a gambling context, a jackpot handler crash would prevent downstream RTP/audit handlers from executing on the same spin:done event. [L19-L23] |

### Suggestions

- Narrow SPIN_DONE to its literal type
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Guard emit against throwing handlers to preserve the full handler chain — critical in regulated gaming where every downstream handler (audit, RTP accumulator) must run
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
      console.error(`SpinEventEmitter: handler threw on "${event}"`, err);
    }
  }
  ```
- Add JSDoc to exported class and constant
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight typed event emitter for spin lifecycle events.
   * Subscribe with on(), unsubscribe with off(), dispatch with emit().
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
