# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correctly defined; variadic unknown[] args match the emit signature.
- **Overengineering [LEAN]**: Minimal type alias for a variadic callback. No abstraction excess.
- **Tests [NONE]**: No test file exists. Transitive coverage depends on SpinEventEmitter tests, which also have none.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is non-obvious enough to warrant a brief description of the intended contract.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Standard event-emitter implementation with no correctness defects. `on` mutates the existing array in-place (safe; `set` is redundant but harmless). `off` uses filter to produce a new array, so concurrent emission iterates the old snapshot — a common, intentional pattern. No exception propagation issue rises above design choice in this context.
- **Overengineering [OVER]**: Hand-rolls `on`/`off`/`emit` — a full reimplementation of Node.js built-in `EventEmitter` (or browser `EventTarget`). Has exactly 1 consumer (`engine.ts::spin`), so the abstraction adds no generality. NIH: Node's `EventEmitter` is zero-cost to use and covers this interface completely. A single emitter instance in `engine.ts` with no indirection would suffice.
- **Tests [NONE]**: No test file found. on/off/emit methods and multi-handler scenarios, handler removal, missing-event guards are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack any JSDoc. A public API consumed by engine.ts deserves at minimum a class-level description and @param/@returns annotations on each method.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic; no correctness issues.
- **Overengineering [LEAN]**: Simple named string constant to avoid magic strings across consumers. Appropriate.
- **Tests [NONE]**: No test file found. Constant value and its use as the event key in engine.ts are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment describing when this event fires or what arguments are passed to listeners. Consumers relying on this event string need documentation of its semantics.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE is inferred as string rather than the literal "spin:done". Missing as const widens the type unnecessarily and prevents exhaustive checks on event names at call sites. [L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter and its public methods (on, off, emit) and SPIN_DONE constant have no JSDoc. Public surface area is exported and consumed by engine.ts. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers in a bare for-of loop. If any handler throws synchronously, the exception propagates uncaught and all subsequent handlers are silently skipped. In a slot-machine engine where SPIN_DONE drives downstream state, dropped handlers can corrupt game flow. [L20-L24] |

### Suggestions

- Narrow SPIN_DONE to its literal type so consumers can use it in exhaustive discriminated-union checks.
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Guard emit() so a throwing handler cannot abort remaining handlers — critical in a game engine where every subscriber must fire.
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
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Minimal typed event emitter for slot-machine lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
