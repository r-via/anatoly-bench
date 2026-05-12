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

- **Utility [USED]**: Non-exported type used locally as parameter and field type in SpinEventEmitter methods
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic event handler.
- **Overengineering [LEAN]**: Simple type alias for a variadic callback. Appropriate abstraction for an event system.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is not self-evident; a brief note on intended usage would help.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; off filters by reference identity, which is the standard contract for event emitters.
- **Overengineering [OVER]**: Hand-rolled event emitter with 1 importer. Node's built-in `EventEmitter` or the browser-compatible `eventemitter3` (npm, >10M/week) would handle this natively with no bespoke code. NIH pattern for a well-solved primitive.
- **Tests [NONE]**: No test file exists. Class has non-trivial behavior: multi-listener registration, handler deduplication on off(), emit with args, and silent no-op paths — none are tested. Used by src/engine.ts, making coverage gaps impactful.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). None of on/off/emit document their parameters, return values, or edge-case behavior (e.g. emit is a no-op when no listeners are registered).

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly defined and exported.
- **Overengineering [LEAN]**: Named constant for an event string. Prevents typos at call sites; minimal and appropriate.
- **Tests [NONE]**: No test file exists. String constant used as an event key in src/engine.ts; its correctness depends on integration tests that are also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining when this event is emitted or what payload callers should expect.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is private but not `readonly`. The field is only ever reassigned via `set` on the Map itself, not the reference — `readonly` is safe and signals intent. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class), `on`, `off`, `emit`, and `SPIN_DONE` are all exported with no JSDoc. At minimum the class and constant warrant a doc comment. [L2-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers in a bare `for...of` with no try-catch. A throwing handler aborts remaining handlers silently. In a slot-machine context where `spin:done` drives payout and jackpot logic, this can leave game state inconsistent. [L18-L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SPIN_DONE` is typed as `string` rather than the literal `"spin:done"`. Adding `as const` narrows the type and enables exhaustive event-name checks at call sites. [L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are bare `string`, providing no compile-time guard against typos (e.g. `emitter.on('spi:done', …)`). A generic string-keyed emitter is unsafe in a domain where event mismatches silently drop payout/jackpot callbacks. A typed overload pattern (e.g. `on(event: typeof SPIN_DONE, handler: (result: SpinResult) => void)`) would close this gap. |

### Suggestions

- Mark `listeners` readonly to communicate immutability of the reference
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Narrow SPIN_DONE to a literal type with `as const`
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Wrap handler calls in try-catch so a single throwing handler does not abort the rest
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
      console.error(`[SpinEventEmitter] handler error on "${event}":`, err);
    }
  }
  ```
- Add typed overloads for known events to catch name typos at compile time
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void
  // After
  on(event: typeof SPIN_DONE, handler: (result: SpinResult) => void): void;
  on(event: string, handler: EventHandler): void;
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
