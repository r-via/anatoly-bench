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

- **Utility [USED]**: Non-exported type used locally in on(), off() method signatures and emit() iteration
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriate for its use as a variadic event handler.
- **Overengineering [LEAN]**: Minimal local type alias for event handler callbacks. Not shared across files, so inline declaration matches the project's Types-in-types.ts convention for shared types vs inline for module-local ones.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is reasonably self-descriptive but the variadic unknown[] signature warrants a brief explanation of expected usage.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Event emitter implementation is correct: on/off/emit all handle missing-key cases properly, filter-by-reference in off is correct, and iteration over handlers snapshot is safe since filter returns a new array.
- **Overengineering [OVER]**: Hand-rolls on/off/emit against a Map<string, EventHandler[]> — a verbatim reimplementation of Node.js's built-in EventEmitter or browser-compatible `eventemitter3` (npm, >5M/week). NIH: no installed dep provides this, but the native platform already does. Compound signal: pre-computed usage shows only 1 runtime importer, so the abstraction serves a single client and is unlikely to justify a bespoke class over `import { EventEmitter } from 'node:events'` or a lightweight npm alternative.
- **Tests [NONE]**: No test file exists. Core event emitter used by src/engine.ts — on/off/emit logic, duplicate handler behavior, off with unknown event, emit with no listeners, and multi-arg propagation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Public API with non-trivial semantics (lazy listener array init, silent no-op on missing event in off/emit) has zero documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Constant name and value match the conventions documented in Code-Conventions.md.
- **Overengineering [LEAN]**: Named constant for the event string matches the documented SCREAMING_SNAKE_CASE convention for event name constants and eliminates magic strings at zero overhead.
- **Tests [NONE]**: No test file exists. Constant string used by src/engine.ts as an event name — no tests verify its value or usage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Event name constant with no explanation of when it is emitted or what args handlers should expect.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned — only its contents mutate via Map methods. Should be marked readonly to prevent accidental reassignment. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter and its three public methods (on, off, emit) have no JSDoc. SPIN_DONE constant is undocumented. [L3-L23] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit iterates handlers synchronously with no try-catch. A throwing handler aborts the loop — subsequent handlers never execute. For a slot engine emitting spin:done, this could silently drop downstream listeners (e.g., jackpot tracking after a stats handler throws). [L18-L22] |

### Suggestions

- Mark listeners readonly to prevent accidental field reassignment
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard emit loop so a throwing handler does not block remaining handlers
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
      // prevent one bad handler from silencing downstream listeners
      console.error(`[SpinEventEmitter] handler error on "${event}":`, err);
    }
  }
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Minimal synchronous event emitter for spin lifecycle events.
   * Use SPIN_DONE and other named constants as event keys.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
