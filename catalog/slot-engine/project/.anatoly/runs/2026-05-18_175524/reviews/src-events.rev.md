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

- **Utility [USED]**: Local type used in SpinEventEmitter class signatures and generic types (on, off methods, handlers array)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and sufficient for event handler signature.
- **Overengineering [LEAN]**: Minimal type alias for a variadic handler; appropriate abstraction.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is clear but the variadic `unknown[]` signature warrants a brief description of intended usage.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; off correctly filters by reference identity; emit iterates a snapshot-free live array (safe since handlers are not added/removed mid-iteration in this design).
- **Overengineering [OVER]**: Hand-rolled event bus reimplementing Node.js's built-in `EventEmitter` (on/off/emit + Map-based listener registry). Only 1 importer, only 1 event constant in use (SPIN_DONE), and the emitter is constructed and immediately discarded per spin() call — the off() method is effectively dead code in this lifecycle. A direct callback parameter or Node's `EventEmitter` (zero-install, built-in) would be proportionate.
- **Tests [NONE]**: No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods, including edge cases like removing non-existent handlers, emitting with no listeners, and multi-listener ordering, are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its methods (`on`, `off`, `emit`). Public API with three exported methods — all lack parameter and behavior descriptions.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Value "spin:done" matches documented constant exactly.
- **Overengineering [LEAN]**: Named constant prevents magic-string typos. Appropriate for any event-name reference.
- **Tests [NONE]**: No test file exists. Constant used as event key in src/engine.ts; its integration with SpinEventEmitter.emit is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. As a public event-name constant, it should document what triggers it and what arguments are passed to handlers.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned; the reference should be readonly. SPIN_DONE infers as literal 'spin:done' correctly via top-level const. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter and SPIN_DONE are exported with no JSDoc. on(), off(), and emit() are public methods also undocumented. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers with no per-handler try-catch. A synchronous throw from any handler aborts remaining handlers silently from the caller's perspective. In a slot engine where multiple observers may register on SPIN_DONE, this risks partial notification. [L18-L23] |

### Suggestions

- Mark listeners as readonly since the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard each handler invocation in emit() so one throwing handler does not prevent subsequent handlers from running.
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
- Add JSDoc to exported symbols.
  ```typescript
  // Before
  export class SpinEventEmitter {
  export const SPIN_DONE = "spin:done";
  // After
  /**
   * Lightweight synchronous event bus used by the spin engine.
   * Supports multiple handlers per named event via on/off/emit.
   */
  export class SpinEventEmitter {
  
  /** Fired after every completed spin with the resulting SpinResult. */
  export const SPIN_DONE = "spin:done";
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
