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

- **Utility [USED]**: Non-exported type used as the value type in the listeners Map and as parameter type in on/off/emit methods within this file.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; no correctness issues.
- **Overengineering [LEAN]**: Minimal type alias; no unnecessary generics or abstraction layers.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias purpose and variadic signature intent are not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are logically correct. off replaces the array reference so in-flight emit iterations are unaffected. on mutates the existing array, so a handler registered during emit will fire in that same cycle — consistent with standard synchronous emitter semantics.
- **Overengineering [OVER]**: Reimplements Node.js built-in EventEmitter (on/off/emit) verbatim — NIH with a native substitute available via `import { EventEmitter } from 'events'`. Compounded by a single runtime importer, making the custom class an unjustified abstraction. Drop the custom class and extend or instantiate Node's EventEmitter directly.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multi-listener dispatch, handler deregistration, and unknown-event handling are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavioral constraints (e.g. duplicate handler registration, no-op on missing event) are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant; no correctness issues.
- **Overengineering [LEAN]**: Simple string constant for an event name; no unnecessary indirection.
- **Tests [NONE]**: No test file exists. Constant is consumed by src/engine.ts but no tests verify its value or correct usage as an event name.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The event name string value is self-evident but the semantics of when this event is emitted are not documented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SPIN_DONE` is typed as `string` rather than the literal `"spin:done"`. Add `as const` so callers get the narrowed literal type and accidental reassignment-by-value is caught. [L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported symbols (`SpinEventEmitter` class and `SPIN_DONE` constant) lack JSDoc. The three public methods (`on`, `off`, `emit`) also have no doc comments. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers in a bare `for...of` with no try-catch. A throwing handler aborts all subsequent handlers silently. In a regulated slot-machine context (jackpot, free-spin events) missed handlers could corrupt session state. Wrapping each invocation in try-catch and logging/re-throwing would make failure isolated. [L18-L23] |

### Suggestions

- Narrow `SPIN_DONE` to its literal type with `as const`
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Add JSDoc to public exports
  ```typescript
  // Before
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void {
  // After
  /**
   * Lightweight synchronous event emitter for spin lifecycle events.
   */
  export class SpinEventEmitter {
    /**
     * Registers `handler` for `event`. Multiple handlers per event are supported.
     */
    on(event: string, handler: EventHandler): void {
  ```
- Isolate throwing handlers in `emit` so downstream handlers still run
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

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
