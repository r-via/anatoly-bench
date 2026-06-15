# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type used locally as the type annotation for handler parameters in on(), off(), and the listeners Map.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and consistent with its usage in SpinEventEmitter.
- **Overengineering [LEAN]**: Simple type alias for a callback signature. Appropriate named type for use within the class.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias purpose and usage contract are not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer: src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; no mutation hazard during iteration since handlers snapshot is read-only within the loop.
- **Overengineering [OVER]**: Hand-rolls on/off/emit over a Map — exactly what Node.js built-in `EventEmitter` provides. NIH with a native API, and has only 1 importer, so no generalization payoff. `extends EventEmitter` from 'node:events' would replace all 23 lines with zero implementation.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts with on/off/emit methods — none are tested. Missing coverage for: multiple handlers, handler removal, emit with args, emit with no registered handlers, duplicate handler registration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Purpose, event model, and method parameters/return values are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer: src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant, no correctness issues.
- **Overengineering [LEAN]**: Named constant avoids a magic string. Minimal and correct.
- **Tests [NONE]**: No test file exists. String constant imported by src/engine.ts; no tests verify it is used correctly as an event name.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining when this event is emitted or what payload (if any) it carries.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `listeners` field reference is never reassigned; it should be `private readonly listeners`. The Map contents are mutated via `.set()` / `.filter()`, which `readonly` permits. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported symbols (`SpinEventEmitter` and `SPIN_DONE`) lack JSDoc. Public API consumers have no inline documentation for `on`/`off`/`emit` semantics or the constant's purpose. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | In `emit`, a synchronous handler throw aborts the loop — subsequent handlers never run. In a spin/gaming context, `spin:done` likely has multiple critical listeners (UI, state, audit). A thrown handler silently starves later ones. Wrapping each call in try-catch (or a per-handler guard) is the defensive pattern for production event buses. [L18-L22] |

### Suggestions

- Mark `listeners` as `readonly` — the Map reference is never replaced.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard each handler invocation in `emit` so a throwing handler cannot starve subsequent ones.
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
- Add JSDoc to exported symbols.
  ```typescript
  // Before
  export class SpinEventEmitter {
  export const SPIN_DONE = "spin:done";
  // After
  /** Minimal synchronous event bus for spin lifecycle events. */
  export class SpinEventEmitter {
  
  /** Emitted when a spin round completes and payouts are resolved. */
  export const SPIN_DONE = "spin:done";
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
