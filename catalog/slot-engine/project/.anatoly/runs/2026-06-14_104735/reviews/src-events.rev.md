# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple variadic-void function type alias; no correctness issues.
- **Overengineering [LEAN]**: Simple type alias that names a variadic callback signature. Appropriate for reuse across on/off/emit signatures.
- **Tests [NONE]**: No test file exists. Type alias with no runtime behavior, but transitive coverage via SpinEventEmitter is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias for a variadic unknown-args void function — the constraint on argument types is non-obvious and warrants a brief doc.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Standard pub/sub implementation. `off` creates a new filtered array so concurrent iteration in `emit` is safe against removals. `on` mutates the existing array in-place, meaning a handler that re-registers for the same event during `emit` would be called in the same cycle, but no concrete in-tree call path from engine.ts exhibits this pattern — flagging it would be speculative caller misuse (precision guard 1).
- **Overengineering [OVER]**: Reimplements Node.js built-in EventEmitter (stdlib, zero install cost) with identical semantics: on, off, emit with multi-handler support. NIH violation — `import { EventEmitter } from 'events'` covers all three methods verbatim. Additionally has only 1 runtime consumer, so the abstraction adds overhead with no generalization benefit.
- **Tests [NONE]**: No test file found. on/off/emit methods and edge cases (duplicate handlers, unknown events, multi-arg emit, handler removal correctness) are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). All three methods accept non-trivial parameters with no description of semantics, side effects, or error behavior.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant; no correctness issues.
- **Overengineering [LEAN]**: Named constant for an event string eliminates magic strings at call sites. Minimal and appropriate.
- **Tests [NONE]**: No test file found. Constant is consumed by src/engine.ts but no tests verify it is emitted at the correct point in the spin lifecycle.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. As a public event-name constant consumed by engine.ts, it should document when the event fires and what args are emitted with it.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SPIN_DONE` is inferred as `string` instead of the literal `"spin:done"`. Add `as const` so consumers get the narrow type for exhaustiveness checks. [L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class + all three public methods) and `SPIN_DONE` lack JSDoc. Both are consumed externally by `engine.ts`. [L2-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers in a bare `for...of` loop with no try-catch. A throwing handler aborts the loop, so subsequent `spin:done` listeners are silently skipped. In the casino-spin critical path this can cause jackpot or payout handlers to never fire. [L18-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | `EventHandler` is not exported. Consumers in `engine.ts` cannot type their callbacks against the public contract without duplicating the signature or using `Parameters<SpinEventEmitter['on']>[1]`. Exporting it closes the API surface. [L1] |

### Suggestions

- Narrow `SPIN_DONE` to its literal type so consumers can use it in exhaustive checks.
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Export `EventHandler` so callers can type their callbacks without internal workarounds.
  - Before: `type EventHandler = (...args: unknown[]) => void;`
  - After: `export type EventHandler = (...args: unknown[]) => void;`
- Isolate handler errors in `emit` so one throwing handler cannot silently drop later listeners. Critical for the spin-completion path in a regulated gaming context.
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
      console.error(`[SpinEventEmitter] handler error on "${event}":`, err);
    }
  }
  ```
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Lightweight synchronous event emitter for slot-engine lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
