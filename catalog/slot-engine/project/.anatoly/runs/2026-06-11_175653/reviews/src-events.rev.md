# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 87% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Correct generic event handler type alias.
- **Overengineering [LEAN]**: Minimal type alias; improves readability without adding abstraction weight.
- **Tests [NONE]**: No test file exists for this source file. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias is simple but its role as the listener callback signature for SpinEventEmitter is not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are logically correct. off creates a new array via filter so handlers removed during emit are not invoked in the same cycle; on mutates the existing array so a handler registering a new listener for the same event during emit would see it fire in the current cycle, but no in-tree call path demonstrating this exists, so precision guard 1 applies. No correctness defects.
- **Overengineering [OVER]**: Hand-rolled pub/sub with on/off/emit for a single consumer (engine.ts::spin) that emits exactly one event (SPIN_DONE). The spin function already returns SpinResult directly, making the emitter redundant signaling. Reimplements Node.js built-in EventEmitter (no install needed: `import { EventEmitter } from 'events'`). A simple callback parameter or plain return value eliminates the entire class.
- **Tests [NONE]**: No test file found. on/off/emit methods and multi-listener behavior, handler removal, and emit-with-args are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack JSDoc. No description of purpose, event name conventions, or method parameters/return values.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is well-formed and used correctly by consumers.
- **Overengineering [LEAN]**: Named string constant avoids magic strings; appropriate even for a single event.
- **Tests [NONE]**: No test file found. Constant is consumed by src/engine.ts but no tests verify its value or usage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported constant has no JSDoc. The event name string value is self-evident but when/why this event is emitted (after a completed spin in engine.ts) is undocumented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` field should be `readonly` to prevent reassignment. `SPIN_DONE` is missing `as const`, giving it the widened type `string` instead of the literal `"spin:done"`, which breaks precise consumer typing. [L2,L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` class and all three public methods (`on`, `off`, `emit`) lack JSDoc. `SPIN_DONE` is undocumented. Consumed by core `spin()` — documentation would aid integration. [L2,L5,L11,L17,L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit()` iterates handlers without error isolation. A synchronous throw in any handler terminates the loop and silently drops all subsequent handlers. In a slot machine context, this could swallow jackpot or free-spin event handlers. Wrap each call in try-catch or use a guard. [L18-L23] |

### Suggestions

- Add `readonly` to `listeners` and `as const` to `SPIN_DONE` for precise literal typing.
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  export const SPIN_DONE = "spin:done";
  // After
  private readonly listeners: Map<string, EventHandler[]> = new Map();
  export const SPIN_DONE = "spin:done" as const;
  ```
- Isolate handler errors in `emit()` so a throwing handler cannot drop subsequent handlers.
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
- Add JSDoc to exported class and public methods.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Minimal synchronous event emitter for spin lifecycle events.
   * @example
   * const emitter = new SpinEventEmitter();
   * emitter.on(SPIN_DONE, (result) => console.log(result));
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
