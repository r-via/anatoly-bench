# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type used locally in SpinEventEmitter class for listener parameter annotations and Map type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriate for the use case.
- **Overengineering [LEAN]**: Minimal type alias for a variadic void function. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is reasonably clear but the variadic unknown[] signature warrants a brief explanation of intended usage.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation is correct: on/off/emit all handle missing-listener cases safely, filter creates a new array (no mutation during iteration), and emit iterates a snapshot of handlers.
- **Overengineering [OVER]**: Hand-rolls Node.js's built-in `EventEmitter` (on/off/emit over a Map<string, Handler[]>) without gaining anything over `import { EventEmitter } from 'events'`. Has 1 importer, emits exactly one event (SPIN_DONE), and per docs the instance is created and discarded per spin — making `off` effectively dead in the primary flow. The full multi-event, multi-listener infrastructure is disproportionate to a single fire-and-forget notification. Extending `EventEmitter` directly would remove ~20 lines and the NIH risk.
- **Tests [NONE]**: No test file exists. Critical paths untested: on/off/emit interactions, multiple listeners, handler removal idempotency, emit with no listeners, argument forwarding, and duplicate handler registration. Used by src/engine.ts making this a meaningful gap.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial lifecycle semantics (per-spin instantiation) has zero inline documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Matches documented constant value "spin:done".
- **Overengineering [LEAN]**: Simple string constant preventing magic-string duplication. No overhead.
- **Tests [NONE]**: No test file exists. Constant string used as an event key in src/engine.ts; no tests verify its value or usage contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Should document when this event is emitted and what payload is passed to handlers.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Two issues: (1) listeners field reference is never reassigned — should be private readonly. (2) SPIN_DONE lacks as const, so its inferred type is string instead of the literal "spin:done", losing narrowing for event-name comparisons. [L4, L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter (public class) and SPIN_DONE (public constant) have no JSDoc. Method signatures (on, off, emit) are undocumented. Non-test file. [L3, L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit iterates handlers with no try-catch. A throwing handler aborts the loop — subsequent handlers are silently skipped. In the slot engine context, SPIN_DONE may have multiple observers (analytics, UI, freespin state); partial delivery is a silent correctness hazard. Wrapping each handler call in a try-catch (or using a per-handler guard) would isolate failures. [L20-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot/casino domain inferred from engine vocabulary (reels, jackpot, freespin, SPIN_DONE). EventHandler is untyped — emit(SPIN_DONE, spinResult) and emit(SPIN_DONE, 42) are both valid. A generic EventHandler<T> or a typed overload map (Map<string, ((payload: T) => void)[]>) would let TypeScript enforce that SPIN_DONE always carries a SpinResult, which matters for payout-correctness guarantees in regulated gaming code. [L1, L19-L24] |

### Suggestions

- Add readonly to listeners and as const to SPIN_DONE for proper literal narrowing
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  ...
  export const SPIN_DONE = "spin:done";
  // After
  private readonly listeners: Map<string, EventHandler[]> = new Map();
  ...
  export const SPIN_DONE = "spin:done" as const;
  ```
- Isolate handler errors in emit so one throwing handler does not skip subsequent ones
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
      console.error(`[SpinEventEmitter] handler for "${event}" threw:`, err);
    }
  }
  ```
- Make EventHandler generic so emit is typed per event name
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
  // After
  type EventHandler<T = unknown> = (payload: T) => void;
  
  export class SpinEventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly listeners: Map<string, EventHandler<any>[]> = new Map();
  
    on<T>(event: string, handler: EventHandler<T>): void { ... }
    emit<T>(event: string, payload: T): void { ... }
  ```
- Add JSDoc to exported class and constant
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight synchronous event bus used by the slot engine.
   * Emits {@link SPIN_DONE} after every spin with the completed {@link SpinResult}.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
