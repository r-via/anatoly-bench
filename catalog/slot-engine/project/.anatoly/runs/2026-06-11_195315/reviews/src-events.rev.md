# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple type alias; no correctness issues.
- **Overengineering [LEAN]**: Minimal type alias for event handler signature. Appropriate for typed event dispatch.
- **Tests [NONE]**: No test file exists. Transitive coverage via SpinEventEmitter is also absent since no tests cover SpinEventEmitter either.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias for a variadic callback is non-obvious enough to warrant a brief description.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are internally consistent. off uses filter (new array), so off-during-emit is safe; on pushes to the existing array, which could cause a newly-added handler to fire in the same emit cycle, but no concrete call site in the consumer graph is shown to trigger this — precision guard 1 applies.
- **Overengineering [OVER]**: Hand-rolled on/off/emit emitter with 1 consumer reimplements Node.js built-in EventEmitter (or browser-compatible `eventemitter3`, 30M+/week) with no added behavior. NIH: the standard built-in covers this entirely with less code and no maintenance burden.
- **Tests [NONE]**: No test file found. Methods on/off/emit and edge cases (duplicate handlers, removing non-existent handlers, emitting with no listeners, multiple args) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack JSDoc. Public API consumed by engine.ts — contracts for event registration, removal, and dispatch are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic; no correctness issues.
- **Overengineering [LEAN]**: Named constant to avoid magic strings at call sites. Appropriate.
- **Tests [NONE]**: No test file found. Constant is consumed by src/engine.ts but no tests verify correct usage as an event name.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining when this event is emitted or what args consumers receive.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor `SPIN_DONE` carries JSDoc. Public methods `on`, `off`, and `emit` also lack documentation. [L2-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The `emit` loop has no try-catch around `handler(...args)`. A throwing handler aborts the loop, silently preventing all subsequent listeners from firing. Should wrap each invocation and at minimum log or re-throw after full loop completion. [L19-L23] |

### Suggestions

- Add JSDoc to public class and constant
  ```typescript
  // Before
  export class SpinEventEmitter {
    ...
  }
  export const SPIN_DONE = "spin:done";
  // After
  /** Lightweight synchronous event emitter for spin lifecycle events. */
  export class SpinEventEmitter {
    /** Subscribe to an event. */
    on(event: string, handler: EventHandler): void { ... }
    /** Unsubscribe a previously registered handler. */
    off(event: string, handler: EventHandler): void { ... }
    /** Dispatch an event to all registered handlers. */
    emit(event: string, ...args: unknown[]): void { ... }
  }
  /** Fired after a spin resolves and all winnings are computed. */
  export const SPIN_DONE = "spin:done";
  ```
- Guard emit loop so a throwing handler doesn't silence subsequent listeners
  ```typescript
  // Before
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  const errors: unknown[] = [];
  for (const handler of handlers) {
    try {
      handler(...args);
    } catch (err) {
      errors.push(err);
    }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, "emit errors");
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
