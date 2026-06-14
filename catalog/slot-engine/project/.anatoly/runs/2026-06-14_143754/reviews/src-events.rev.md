# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; correct and self-consistent.
- **Overengineering [LEAN]**: Minimal type alias; appropriate for typing listener callbacks.
- **Tests [NONE]**: No test file exists. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The type alias is simple but a brief doc noting it represents a variadic event callback would be appropriate for a public-ish utility type.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are internally consistent. off creates a new filtered array so in-flight emit iterates the original snapshot safely. on mutates the live array in place, meaning a listener added inside an emit callback fires in the same cycle — this is a known variant behavior (not a stated-contract bug) and no project docs prohibit it.
- **Overengineering [OVER]**: Reimplements Node.js built-in `EventEmitter` (NIH). Has exactly 1 consumer using exactly 1 event (`SPIN_DONE`); the full on/off/emit pub-sub pattern is disproportionate — a direct callback argument or a returned Promise would be sufficient at this scale.
- **Tests [NONE]**: No test file found. Critical behaviors untested: on/off/emit lifecycle, multiple handlers, handler removal, emit with no listeners, and args forwarding. Used by core engine.ts spin function.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). All three methods are exported public API and lack parameter/return/behavior documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic to evaluate.
- **Overengineering [LEAN]**: Plain string constant to avoid magic strings. Appropriate.
- **Tests [NONE]**: No test file found. Constant used as event key in engine.ts spin function but no tests verify it is emitted or consumed correctly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. As a named event constant consumed externally by the spin engine, it should describe when this event is emitted and what args are passed.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned — only its contents mutate. Should be `private readonly listeners`. [L3] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` class and `SPIN_DONE` constant are exported without JSDoc. The three public methods (`on`, `off`, `emit`) are also undocumented. [L2-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit()` calls handlers bare inside `for...of`. If any handler throws synchronously, the error propagates to the caller and all subsequent handlers in the loop are silently skipped. In the slot-machine engine (`src/engine.ts`) this can abort mid-spin event dispatch, leaving downstream listeners un-notified. [L18-L22] |

### Suggestions

- Mark `listeners` as `readonly` — the field reference is never reassigned, only the Map's contents mutate.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Wrap each handler invocation in `emit()` with try-catch so one failing handler does not abort the rest of the dispatch chain.
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
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Lightweight synchronous event emitter for slot-machine lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
