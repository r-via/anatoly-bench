# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type used locally in SpinEventEmitter: parameter type in on/off methods and Map storage type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function-type alias; no correctness issues.
- **Overengineering [LEAN]**: Single-line type alias for variadic handler signature. Appropriate abstraction used consistently across the class.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The type alias is simple enough that its signature is self-descriptive, but it is a public exported-adjacent type used as the handler contract — a brief description would be appropriate.

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant imported at runtime by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic; no correctness issues.
- **Overengineering [LEAN]**: Named constant for event string prevents typos at call sites. ADR-004 explicitly cites this as intentional. Trivially simple.
- **Tests [NONE]**: No test file found. Constant is used as an event key in src/engine.ts but its usage pattern is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining what event this constant represents, when it is emitted, or what arguments are passed to its handlers.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `private listeners` lacks `readonly` — the Map reference is reassignable even though it never should be. `SPIN_DONE` lacks `as const`, so its type is widened to `string` instead of the literal `"spin:done"`. [L4, L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` and its public methods (`on`, `off`, `emit`) have no JSDoc. `SPIN_DONE` has no JSDoc. Not a test file — documentation is expected. [L3, L6, L12, L18, L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` invokes handlers without try-catch: a single throwing handler aborts the iteration, so subsequent handlers are silently skipped and the error propagates unexpectedly to the `emit` call site. [L21-L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SPIN_DONE` is inferred as `string` instead of the literal `"spin:done"`. `as const` narrows the type and enables consumers to use it in exhaustive event-string checks. [L27] |

### Suggestions

- Add `readonly` to `listeners` to prevent accidental Map reference reassignment.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Narrow `SPIN_DONE` to a literal type with `as const` so consumers get type-safe event strings instead of `string`.
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Wrap each handler call in `emit` with try-catch so one throwing handler doesn't abort remaining handlers.
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
      // isolate per-handler failures; swap for project logger if available
      console.error(`[SpinEventEmitter] handler threw for "${event}":`, err);
    }
  }
  ```
- Add minimal JSDoc to the two public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  export const SPIN_DONE = "spin:done" as const;
  // After
  /** Lightweight pub-sub emitter for spin lifecycle events. See ADR-004. */
  export class SpinEventEmitter {
  /** Event name emitted by `engine.ts` after every completed spin. */
  export const SPIN_DONE = "spin:done" as const;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In emit, snapshot the handler list before iterating: replace `this.listeners.get(event)` with a spread copy so that on/off calls made from within a handler do not affect the current iteration cycle and cannot produce infinite loops. [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
