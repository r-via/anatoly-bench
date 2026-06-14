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

- **Utility [USED]**: Non-exported type used locally as the type for handler parameters in on(), off(), and emit() methods.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for variadic event handler signature.
- **Overengineering [LEAN]**: Simple type alias; improves readability with no added complexity.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias is simple but its role as the universal handler signature for SpinEventEmitter warrants a brief description.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Event registration, removal, and emission logic is correct. Handlers snapshot via Map.get is live but safe since iteration uses for-of over the retrieved array before any mutation can occur.
- **Overengineering [OVER]**: Reimplements Node.js built-in `EventEmitter` (available as `import { EventEmitter } from 'events'` with no extra deps). Has only 1 runtime importer, so the custom class provides no generalization benefit. Replacing with `class SpinEventEmitter extends EventEmitter {}` eliminates ~20 lines and removes a bespoke listener-management implementation.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts; on/off/emit methods and multi-handler dispatch, handler removal, and unknown-event paths are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack JSDoc. Missing: class purpose, parameter descriptions for event/handler, and emit's variadic args behavior.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant, no correctness issue.
- **Overengineering [LEAN]**: Exporting event-name constants avoids magic strings — minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts; its integration with SpinEventEmitter event dispatch is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining when this event is emitted or who emits it.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` should be `private readonly` — it is never reassigned, only mutated via Map methods. `SPIN_DONE` should use `as const` so its type narrows to the literal `"spin:done"` rather than `string`. [L4, L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` and its three public methods (`on`, `off`, `emit`) are exported without JSDoc. `SPIN_DONE` also lacks a doc comment describing the event contract. [L3, L5, L11, L16, L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers in a bare `for…of` loop with no try-catch. A throwing handler aborts all subsequent handlers silently. In a casino game context (spin:done signals downstream payout/jackpot logic), this creates a silent partial-delivery risk. Wrap each handler call in try-catch or document the throw-propagation contract. [L17-L22] |

### Suggestions

- Mark `listeners` as readonly and narrow SPIN_DONE to its literal type
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  ...
  export const SPIN_DONE = "spin:done";
  // After
  private readonly listeners: Map<string, EventHandler[]> = new Map();
  ...
  export const SPIN_DONE = "spin:done" as const;
  ```
- Guard emit loop so a throwing handler does not silently drop subsequent handlers
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
- Add JSDoc to public exports
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight synchronous event emitter for spin lifecycle events.
   * Handler errors do not propagate to callers — they are caught and logged.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
