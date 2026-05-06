# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type alias used locally throughout the file in SpinEventEmitter method signatures and the listeners Map type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriately broad for a generic event system.
- **Overengineering [LEAN]**: Minimal type alias for the handler signature. No generics or indirection beyond what's needed.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature and intended event-handler role are not self-evident from the type alias name alone.

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant exported correctly; matches documented usage in ADR-004.
- **Overengineering [LEAN]**: Named constant prevents string-literal typos in consumers; ADR-004 calls this out explicitly as intentional. Trivially appropriate.
- **Tests [NONE]**: No test file exists. String constant used as event key in engine.ts; its usage as a trigger for done-state logic is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining what event this constant names, when it is emitted, or what arguments handlers receive.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned after construction; marking it `readonly` would prevent accidental field replacement. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor its public methods (`on`, `off`, `emit`) nor `SPIN_DONE` carry JSDoc. ADR-004 documents intent but inline JSDoc is missing at the call site. [L3-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Handler invocations in `emit()` are unguarded. A throwing handler aborts the loop, silencing all subsequent handlers. In the gambling domain (ADR-004), this can silently break free-spin chaining if an earlier observer (e.g. analytics) throws. [L20-L23] |

### Suggestions

- Mark `listeners` as `readonly` to prevent accidental field reassignment.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Wrap handler calls in try-catch so one throwing observer cannot abort downstream handlers (e.g. free-spin chaining).
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
      console.error(`SpinEventEmitter: handler error on "${event}":`, err);
    }
  }
  ```
- Add JSDoc to exported class and constant so IDE consumers get inline documentation.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * Attach observers with {@link on}; emit with {@link emit}.
   * @see SPIN_DONE for the canonical spin-completion event name.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
