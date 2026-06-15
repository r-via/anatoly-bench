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

- **Utility [USED]**: Non-exported type used locally as the Map value type and parameter type in on(), off(), and emit() methods.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; no logic to evaluate.
- **Overengineering [LEAN]**: Minimal type alias; improves readability of the Map type without adding abstraction weight.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias for variadic event handler callbacks; purpose and usage contract are not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed in the spin() function.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit implementations are correct. off creates a new filtered array so emit's iteration reference is stable across concurrent removals. No concrete call path from engine.ts shows a handler mutating listeners during emit, so live-array growth during for-of is hypothetical.
- **Overengineering [OVER]**: Reimplements Node.js built-in `EventEmitter` (available via `import { EventEmitter } from 'events'` — zero install cost) with identical semantics: `on`, `off`, `emit`, per-event listener lists. Has exactly 1 runtime consumer, so the abstraction is not amortized. Replace with `extends EventEmitter` or a bare `new EventEmitter()` instance.
- **Tests [NONE]**: No test file exists. Critical class used by spin() in engine.ts — on/off/emit methods, listener deduplication via filter, and multi-handler dispatch are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavioral contracts (e.g. silent no-op when no listeners) are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed in the spin() function.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic; no correctness issues.
- **Overengineering [LEAN]**: Named constant eliminates magic strings at call sites; no abstraction overhead.
- **Tests [NONE]**: No test file exists. Constant consumed by spin() in engine.ts but no test verifies it is emitted at spin completion.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Event name constant with no explanation of when it is emitted or what payload consumers should expect.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE infers type string rather than the literal "spin:done". Missing as const widens the type unnecessarily. [L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class and SPIN_DONE constant both lack JSDoc. Engine consumers have no inline documentation on intended usage or event contracts. [L2, L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers in a bare for-of with no try-catch. A throwing handler silently aborts all subsequent listeners. In a casino engine where spin:done listeners likely post payout/jackpot state, a single bad handler can swallow all downstream financial events at runtime. [L18-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | EventHandler uses unknown[] args, so event payloads are fully untyped at every call site. A typed event map generic would provide compile-time guarantees that spin:done is emitted with the correct SpinResult payload — important in a casino engine where payload mismatches silently corrupt payout calculations. [L1, L5] |

### Suggestions

- Add as const to SPIN_DONE to preserve the literal type
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate handler faults in emit() so one throwing listener does not silence subsequent ones
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
- Add a typed event map generic so emit() and on() enforce payload shapes per event
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private listeners: Map<string, EventHandler[]> = new Map();
    on(event: string, handler: EventHandler): void { ... }
    emit(event: string, ...args: unknown[]): void { ... }
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TMap extends EventMap = Record<string, unknown[]>> {
    private listeners: Map<string, EventHandler<unknown[]>[]> = new Map();
    on<K extends keyof TMap & string>(event: K, handler: EventHandler<TMap[K]>): void { ... }
    emit<K extends keyof TMap & string>(event: K, ...args: TMap[K]): void { ... }
  }
  
  // Usage: new SpinEventEmitter<{ "spin:done": [SpinResult] }>()
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
