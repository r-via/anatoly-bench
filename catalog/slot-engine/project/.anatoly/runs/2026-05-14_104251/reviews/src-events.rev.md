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

- **Utility [USED]**: Type alias used in SpinEventEmitter class: listeners map value type and method parameter types.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a generic variadic event handler.
- **Overengineering [LEAN]**: Minimal type alias; improves readability of the Map signature.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name and signature are fairly clear, but no description of intended usage or constraints on the variadic args.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with runtime importer in src/engine.ts. Provides event emitter functionality with on/off/emit methods.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handlers array is always initialized before push, filter correctly removes by reference identity, emit iterates a snapshot retrieved at call time.
- **Overengineering [OVER]**: Reimplements Node.js built-in EventEmitter (always available, no install needed) with an identical on/off/emit API. Has exactly 1 runtime importer — a direct callback or Promise from the engine would remove the abstraction entirely. The pub/sub indirection is not justified by a game loop that has a single, synchronous spin result.
- **Tests [NONE]**: No test file exists. Core event emitter used by engine.ts — on/off/emit methods, handler deduplication, multi-listener dispatch, and removal logic are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter descriptions, return info, and behavioral notes (e.g. silent no-op on off() with unknown handler).

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with runtime importer in src/engine.ts. Identifies the spin completion event.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly exported.
- **Overengineering [LEAN]**: Single string constant; avoids magic strings at call sites.
- **Tests [NONE]**: No test file exists. Constant used in engine.ts but no tests verify it is emitted under the correct conditions.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose and when this event is emitted are not described.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE lacks as const, so TypeScript infers type string instead of the literal "spin:done". Callers lose type-level event name checking and narrowing. [L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class, its three public methods (on, off, emit), and SPIN_DONE all lack JSDoc. EventHandler is not exported, so callers cannot annotate handler variables without resorting to inference tricks. [L2-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() calls each handler with no try-catch. A throwing handler propagates up and aborts all subsequent handlers mid-loop. In a casino engine context (jackpot, freespin, payout events) this can corrupt game state mid-spin; each handler invocation should be wrapped in try-catch with error logging. [L18-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain inferred from jackpot.ts, reels.ts, freespin.ts, paytable.ts, rng.ts. on() performs no deduplication — registering the same handler twice causes it to fire twice. In jackpot or payout event handlers, duplicate emissions can corrupt RTP accounting or trigger double-pay logic. [L6-L10] |

### Suggestions

- Add as const to SPIN_DONE for a literal type instead of widened string
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Export EventHandler so callers can properly annotate handler references
  - Before: `type EventHandler = (...args: unknown[]) => void;`
  - After: `export type EventHandler = (...args: unknown[]) => void;`
- Wrap each handler call in try-catch to prevent a single failing handler from aborting mid-spin event delivery
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
      console.error(`[SpinEventEmitter] handler error on '${event}':`, err);
    }
  }
  ```
- Guard on() against duplicate registration to prevent double-firing in jackpot/payout event flows
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }
  // After
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    if (!handlers.includes(handler)) {
      handlers.push(handler);
      this.listeners.set(event, handlers);
    }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
