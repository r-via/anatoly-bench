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

- **Utility [USED]**: Non-exported type used locally as the type for handler parameters in `on`, `off`, and the `listeners` map.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and matches usage throughout the emitter.
- **Overengineering [LEAN]**: Minimal type alias for an event callback signature. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias is simple but its role as the handler signature for SpinEventEmitter is not documented.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Standard event-emitter implementation; on/off/emit are internally consistent. off replaces the stored array reference, so emit's local snapshot is not affected by concurrent off calls during iteration (safe). on mutates the existing array, so a handler added for the same event inside an emit call will be visited in that cycle — no stated contract prohibits this.
- **Overengineering [OVER]**: Hand-rolls on/off/emit over a Map when Node.js ships `EventEmitter` as a built-in (`import { EventEmitter } from 'events'`). The implementation adds nothing over the standard API (no wildcard, no once, no error channel). Combined with only 1 runtime importer, this is NIH complexity with no payoff — replace with `extends EventEmitter` or a direct instance.
- **Tests [NONE]**: No test file exists. Core class used by src/engine.ts with on/off/emit methods — none are tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). None of the parameters, return values, or behavioral constraints (e.g. duplicate handler behavior, emit-while-iterating safety) are described.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple string constant, no correctness issues.
- **Overengineering [LEAN]**: Single exported string constant for a well-known event name. Appropriate.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts as an event key; not validated in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining when this event is emitted or what args it carries.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners field is never reassigned; should be declared readonly to communicate that invariant. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class and its public methods (on, off, emit), plus the SPIN_DONE constant, all lack JSDoc comments. [L3-L25] |

### Suggestions

- Declare listeners as readonly to prevent accidental field reassignment.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Add JSDoc to public class and its methods.
  ```typescript
  // Before
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void {
  // After
  /** Typed event emitter for spin lifecycle events. */
  export class SpinEventEmitter {
    /** Register a handler for the given event. */
    on(event: string, handler: EventHandler): void {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
