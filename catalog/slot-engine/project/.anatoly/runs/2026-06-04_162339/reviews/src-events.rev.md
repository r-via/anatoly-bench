# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type used locally as the array element type in `listeners` Map and as parameter type in `on` and `off` methods.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void event handler.
- **Overengineering [LEAN]**: Minimal type alias; avoids repetition of the variadic signature.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is not self-explanatory enough to skip documentation.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handlers are properly stored, filtered on removal, and iterated on emit.
- **Overengineering [OVER]**: Hand-rolls on/off/emit over a Map when Node's built-in EventEmitter (require('events')) provides identical semantics with no installation cost. Only 1 runtime importer, so this abstraction is pre-emptively generalised for a single consumer. Drop the class; use `new EventEmitter()` from Node core or the EventTarget API.
- **Tests [NONE]**: No test file exists. Methods on/off/emit are untested — missing coverage for handler registration, deregistration, multi-listener dispatch, unknown event emit, and args forwarding.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Public API with non-trivial semantics (listener map lifecycle, deduplication behavior) lacks all documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly defined and exported.
- **Overengineering [LEAN]**: Named constant eliminates a magic string; appropriate level of abstraction.
- **Tests [NONE]**: No test file exists. Constant string value used by src/engine.ts is never verified in tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining when this event is emitted or what payload (if any) it carries.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SPIN_DONE` is exported without `as const`, so its type is widened to `string` instead of the literal `"spin:done"`. Callers lose the literal type in switch/conditional branches. [L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class), its three public methods (`on`, `off`, `emit`), and `SPIN_DONE` all lack JSDoc. At minimum the class and constant warrant a one-liner. [L2-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit()` iterates handlers with no try-catch. A single throwing handler silently aborts all subsequent handlers in the same event cycle. In a casino engine context, a broken UI listener could suppress downstream payout or jackpot notifications. [L18-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are untyped `string`. For a slot-machine engine, a typed union or enum of event names prevents typo-silenced subscriptions (e.g. `"spin:dne"` registers with no error). Prefer `type SpinEvent = typeof SPIN_DONE \| ...` and constrain `on`/`off`/`emit` to accept only `SpinEvent`. [L4-L22] |

### Suggestions

- Add `as const` to SPIN_DONE to preserve the literal type.
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate handler errors in `emit` so one failing handler does not abort the rest.
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
- Narrow event-name types to prevent silent typo-registration.
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void
  // After
  type SpinEvent = typeof SPIN_DONE; // extend as events grow
  on(event: SpinEvent, handler: EventHandler): void
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
