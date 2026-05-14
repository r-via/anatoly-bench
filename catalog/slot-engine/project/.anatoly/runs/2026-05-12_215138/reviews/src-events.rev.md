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

- **Utility [USED]**: Non-exported type used locally in SpinEventEmitter method signatures (on, off).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void handler.
- **Overengineering [LEAN]**: Minimal type alias that avoids repeating the function signature across the file.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature and intended event-handler contract are not described.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with runtime import by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; off correctly filters by reference identity; emit iterates a snapshot-free list but mutation during emit is an edge case not evidenced here.
- **Overengineering [OVER]**: Hand-rolled pub/sub reimplements Node.js's built-in `EventEmitter` (always available in Node environments) or the browser's native `EventTarget`. The class has only 1 runtime importer, so no multi-consumer justification exists. Replacing with `import { EventEmitter } from 'events'` (Node) or `EventTarget` (browser) removes ~20 lines with zero loss of functionality.
- **Tests [NONE]**: No test file exists. Critical methods on()/off()/emit() are untested — no coverage of multi-listener dispatch, handler deregistration, unknown-event emit, or argument forwarding.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavior (e.g. silent no-op when no listeners exist) are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported string constant with runtime import by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly exported.
- **Overengineering [LEAN]**: Simple named constant that eliminates the magic string at call sites.
- **Tests [NONE]**: No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or that it is used as the correct event key.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The event's semantics — when it is emitted and what payload it carries — are not described.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned; should be `private readonly listeners`. The Map itself is mutated, but the reference is stable. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither `SpinEventEmitter` (class + all three public methods) nor `SPIN_DONE` have any JSDoc. All are exported public API. [L3-L23] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` invokes handlers in a bare `for` loop with no try-catch. A throwing handler halts all subsequent handlers silently from the caller's perspective. In a gambling/casino domain (inferred from reels, jackpot, paytable, freespin filenames), dropped game-state events under error conditions carry elevated risk. [L18-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | String-keyed event system loses type safety: callers can emit/listen on any string with any payload shape. A generic event-map approach (e.g. `SpinEventEmitter<T extends Record<string, unknown[]>>`) would let the compiler enforce correct payload types per event name — valuable in a domain where mismatched payloads (e.g. wrong jackpot data on `spin:done`) can cause silent bugs. [L1-L23] |

### Suggestions

- Mark `listeners` as `readonly` — its reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard `emit` so a throwing handler does not abort remaining handlers.
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
- Add JSDoc to all public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void {
  // After
  /**
   * Lightweight synchronous event emitter for spin-lifecycle events.
   */
  export class SpinEventEmitter {
    /**
     * Registers `handler` for the given `event`. Multiple handlers per event are supported.
     */
    on(event: string, handler: EventHandler): void {
  ```
- Use a generic event map to enforce payload types per event name.
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
  // After
  type EventMap = Record<string, unknown[]>;
  type Handler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<T extends EventMap> {
    private readonly listeners: Map<keyof T & string, Handler<T[keyof T & string]>[]> = new Map();
  
    on<K extends keyof T & string>(event: K, handler: Handler<T[K]>): void { /* … */ }
    off<K extends keyof T & string>(event: K, handler: Handler<T[K]>): void { /* … */ }
    emit<K extends keyof T & string>(event: K, ...args: T[K]): void { /* … */ }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
