# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type used locally as the type annotation for handler parameters in on(), off(), and the listeners Map.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct; variadic unknown[] signature is appropriate for a generic event handler.
- **Overengineering [LEAN]**: Minimal type alias; improves readability without adding abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias purpose and variadic signature semantics are not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts (1 importer).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handlers array is lazily initialized, filter-based removal is correct, and emit iterates a snapshot-like reference safely for non-mutating cases.
- **Overengineering [OVER]**: Hand-rolls on/off/emit over a Map — exactly what Node.js built-in EventEmitter provides. Single importer (1 runtime, 0 type-only) means this abstraction was built for one consumer. Drop the custom class and use `import { EventEmitter } from 'events'` (Node.js built-in, zero cost).
- **Tests [NONE]**: No test file exists. Critical class used by engine.ts with on/off/emit methods — none are tested. Missing coverage for: handler registration, removal, multi-listener dispatch, unknown event no-op, and argument forwarding.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage pattern, and method parameters are entirely undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts (1 importer).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant is correctly defined and exported.
- **Overengineering [LEAN]**: Named constant prevents magic strings; no added complexity.
- **Tests [NONE]**: No test file exists. String constant used by engine.ts; no tests verify it is emitted or handled correctly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Event name constant with no description of when it is emitted or what payload to expect.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SPIN_DONE = "spin:done"` infers type `string` instead of the literal `"spin:done"`. `as const` should be applied so consumers get the narrowed literal type. [L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor its public methods (`on`, `off`, `emit`) nor `SPIN_DONE` carry JSDoc. Public API surface is undocumented. [L2-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit()` iterates handlers without per-handler error isolation. A throwing handler aborts the remaining chain silently. In a casino/slot engine that relies on cascading events (spin:done → payout → jackpot), this creates a reliability hazard. [L18-L23] |

### Suggestions

- Narrow SPIN_DONE to its literal type with `as const`
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate handler errors in emit() so one throwing handler does not abort the chain
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
      // prevent one bad handler from silencing the rest
      console.error(`SpinEventEmitter: handler for "${event}" threw`, err);
    }
  }
  ```
- Add JSDoc to the public class and constant
  ```typescript
  // Before
  export class SpinEventEmitter {
    ...
  }
  export const SPIN_DONE = "spin:done" as const;
  // After
  /** Lightweight synchronous event bus for spin lifecycle events. */
  export class SpinEventEmitter {
    /** Register a listener for the given event key. */
    on(event: string, handler: EventHandler): void { ... }
    /** Deregister a previously registered listener. */
    off(event: string, handler: EventHandler): void { ... }
    /** Dispatch an event, invoking all registered listeners in order. */
    emit(event: string, ...args: unknown[]): void { ... }
  }
  /** Event key emitted when a spin cycle completes. */
  export const SPIN_DONE = "spin:done" as const;
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
