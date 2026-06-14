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

- **Utility [USED]**: Type alias used in SpinEventEmitter for handler parameters and listeners map type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and intentionally broad for a generic event emitter.
- **Overengineering [LEAN]**: Minimal type alias that names a variadic callback signature. Appropriate reuse across on/off/emit.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias is simple enough that purpose is inferable, but no description of the variadic unknown signature intent.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handlers array is created on demand, filter preserves reference equality for removal, emit iterates a snapshot from the map.
- **Overengineering [OVER]**: Hand-rolled reimplementation of Node.js built-in EventEmitter (on/off/emit over a Map<string, handler[]>). Node's EventEmitter is available natively with identical semantics plus error handling, once/prependListener, and eventNames. With only 1 runtime importer and the internal docs confirming the emitter is created fresh per spin (making engine-side listeners unreachable), the custom class adds maintenance surface for no gain. Drop SpinEventEmitter and extend or instantiate Node's EventEmitter directly.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts with on/off/emit methods — none are tested. Missing: multiple listeners, off() deregistration, emit with no listeners, emit argument propagation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter/return/behavior documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Constant matches the string literal used in internal docs and is exported correctly.
- **Overengineering [LEAN]**: Single named string constant to avoid a magic string — correct minimal pattern.
- **Tests [NONE]**: No test file exists. Constant imported by src/engine.ts but never exercised in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The string value 'spin:done' is visible but the intended semantics (when it fires, what args are passed) are not documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` field reference is never reassigned; should be `private readonly listeners`. [L3] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor `SPIN_DONE` have JSDoc comments. Public API used externally per the internal docs. [L2-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers without try-catch; a throwing handler halts the loop and skips all subsequent handlers. In a casino domain, this can silently drop jackpot/payout recording callbacks. [L17-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain. `unknown[]` args force callers to use `result as SpinResult` (confirmed in internal docs example). A typed event map would eliminate the unsafe assertion at call sites and protect payout data integrity. [L1] |

### Suggestions

- Mark `listeners` field `readonly` since the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in `emit` to prevent one failing handler from silently dropping subsequent handlers.
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
      console.error(`[SpinEventEmitter] handler error on event "${event}":`, err);
    }
  }
  ```
- Use a typed event map to eliminate `as SpinResult` assertions at call sites.
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TMap extends EventMap = Record<string, unknown[]>> {
    private readonly listeners = new Map<keyof TMap & string, EventHandler<unknown[]>[]>();
  
    on<K extends keyof TMap & string>(event: K, handler: (...args: TMap[K]) => void): void { ... }
  ```
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Minimal event emitter for slot-engine spin lifecycle events.
   * Create one instance per spin and attach listeners before calling `spin()`.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
