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

- **Utility [USED]**: Local type used in SpinEventEmitter method signatures (on, off, emit)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct; variadic unknown[] parameters and void return are appropriate for a generic event handler.
- **Overengineering [LEAN]**: Simple type alias for a callback signature. Appropriate for readability without abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias purpose and expected signature semantics are not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: on lazily initializes handler arrays, off filters by reference identity, emit iterates a snapshot of the current handlers array. No mutation-during-iteration bug since filter returns a new array (not mutating the live array mid-emit).
- **Overengineering [OVER]**: Reimplements Node.js built-in `EventEmitter` (NIH). The `on`/`off`/`emit` API is identical to `require('events').EventEmitter` or the native `EventTarget`. Has exactly 1 runtime importer. Internal docs also reveal the engine instantiates the emitter fresh per spin, making it structurally impossible for external code to attach listeners to the engine's own instance — undermining the entire abstraction's value proposition.
- **Tests [NONE]**: No test file exists. `on`, `off`, and `emit` are untested — including edge cases like emitting with no listeners, removing a non-registered handler, multiple handlers for the same event, and handler argument forwarding. Used by `src/engine.ts`, making coverage gaps impactful.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage, and method parameters/return values are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant matches the event name used in internal docs.
- **Overengineering [LEAN]**: Typed string constant to avoid magic strings. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is used as an event name in `src/engine.ts` but its integration with `SpinEventEmitter.emit`/`on` is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The event name string value is self-evident but the payload type and when this event fires are not documented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned but is not marked readonly, leaving the door open for accidental field reassignment. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class, its three public methods (on, off, emit), and the SPIN_DONE constant all lack JSDoc. [L2-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() has no try-catch around handler(...args). A throwing handler silently skips all subsequent handlers for that event — significant when multiple listeners subscribe to SPIN_DONE. [L19-L24] |

### Suggestions

- Mark listeners readonly to prevent accidental field reassignment.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Wrap handler invocations in emit() so one throwing handler cannot skip subsequent handlers.
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
- Add JSDoc to exported class and constant.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Synchronous event emitter for spin lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
