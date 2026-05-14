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

- **Utility [USED]**: Type used locally in SpinEventEmitter method signatures (on, off) and Map value type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic event handler.
- **Overengineering [LEAN]**: Minimal type alias used directly within the class. No generics or unnecessary indirection.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is clear but the variadic unknown[] signature warrants a brief description of intended usage.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handlers are stored, filtered, and invoked properly. No mutation hazard during iteration since handlers is a snapshot from the Map.
- **Overengineering [OVER]**: Reimplements Node.js built-in EventEmitter (available via `import { EventEmitter } from 'events'` with no install). The three methods (on/off/emit) exactly duplicate its core API. With only 1 runtime importer, the class yields no reuse benefit over a direct built-in.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts — on/off/emit methods, handler deduplication, multi-listener dispatch, and removal of non-existent handlers are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Public API with non-trivial behavior (listener deduplication on off, silent no-op when event has no handlers) needs documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly exported.
- **Overengineering [LEAN]**: Single string constant export. Appropriate for avoiding stringly-typed event names at call sites.
- **Tests [NONE]**: No test file exists. Constant is consumed by src/engine.ts but no test verifies correct event string value or its integration with SpinEventEmitter.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. An exported event name constant should document when it is emitted and what args, if any, accompany it.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class and SPIN_DONE constant are exported with no JSDoc. Public methods on/off/emit also undocumented. [L4-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | EventHandler returns void; TypeScript structurally allows async functions to satisfy a void-return type, so async handlers passed to on() silently drop their Promises. Additionally, emit() has no per-handler try-catch — a synchronous throw from any handler halts all subsequent handlers in the loop. [L1,L19-L23] |

### Suggestions

- Add JSDoc to the exported class and constant.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Lightweight typed event emitter for spin lifecycle events. */
  export class SpinEventEmitter {
  ```
- Guard emit against synchronous throws and silently-dropped async rejections.
  ```typescript
  // Before
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  for (const handler of handlers) {
    try {
      const ret = handler(...args);
      if (ret instanceof Promise) ret.catch(err => console.error('[SpinEventEmitter]', err));
    } catch (err) {
      console.error('[SpinEventEmitter]', err);
    }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
