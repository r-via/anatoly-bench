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

- **Utility [USED]**: Type used locally in Map<string, EventHandler[]> declaration and method signatures (on, off)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple type alias for a variadic function accepting unknown args and returning void. No correctness issues.
- **Overengineering [LEAN]**: Minimal type alias for a callback signature; used by SpinEventEmitter internals.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported type alias; no JSDoc. Name and signature are clear enough, but the intended variance (sync-only, no return value enforced) is undocumented.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Correct simple event emitter. on/off/emit operate correctly: off creates a new filtered array (safe during emit iteration), on appends to the live array. Reference equality for handler removal is standard.
- **Overengineering [OVER]**: Full reimplementation of Node.js built-in `EventEmitter` (`import { EventEmitter } from 'events'`) with identical on/off/emit semantics and no added value. One importer; per the internal docs the emitter is created fresh per spin so listeners cannot be attached to the engine's instance anyway, further undermining the need for a custom class.
- **Tests [NONE]**: No test file exists. `on`, `off`, and `emit` are all untested — including edge cases like emitting with no listeners, removing a non-registered handler, multiple handlers per event, and handler invocation order. Used by src/engine.ts, making this a critical gap.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public class with no JSDoc on the class or any of its three methods (on, off, emit). Missing descriptions of event-name semantics, handler reference-equality contract for off(), and whether emit() is synchronous.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple string constant export. No correctness issues.
- **Overengineering [LEAN]**: Simple string constant preventing magic-string drift; no overengineering.
- **Tests [NONE]**: No test file exists. Constant is used as an event key in src/engine.ts but no tests verify its value or its use in emit/on flows.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported constant with no JSDoc. Does not document what event payload is passed when this event fires, or which emitter instance produces it.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners field reference is never reassigned; should be readonly. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter class and SPIN_DONE constant are exported with no JSDoc. on/off/emit methods are also undocumented. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() invokes handlers in a for-of loop with no try-catch. A throwing handler aborts all subsequent handlers silently. Standard event emitter contract is best-effort delivery. [L18-L22] |

### Suggestions

- Mark listeners as readonly to prevent accidental reassignment of the Map reference.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard handler invocations in emit() so one throwing handler does not suppress remaining handlers.
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
  // After
  /** Lightweight synchronous event emitter for spin lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
