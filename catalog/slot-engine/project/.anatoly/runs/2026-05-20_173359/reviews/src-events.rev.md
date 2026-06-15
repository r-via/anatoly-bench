# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 87% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type alias used internally within SpinEventEmitter class as parameter type for on/off methods and handler storage
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct; variadic unknown[] parameters are appropriate for a generic event handler.
- **Overengineering [LEAN]**: Simple type alias scoped to this file; removes repetition across the Map and method signatures.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is clear but the variadic unknown[] signature warrants a brief description of intended usage.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct. off correctly filters by reference identity. emit iterates a snapshot-free list, but mutation during iteration is a caller concern, not a bug in this implementation.
- **Overengineering [OVER]**: Reimplements Node.js built-in EventEmitter (on/off/emit over a Map) — Node's `events` module is always available, no install needed. Single importer compounds the issue: the internal docs confirm the engine creates a fresh emitter per spin, so external callers wrap spin() and build their own emitter anyway (making the class even more marginal). Replace with `import { EventEmitter } from 'node:events'` or, for isomorphic use, `eventemitter3` (~15M weekly downloads).
- **Tests [NONE]**: No test file exists. Core class used by src/engine.ts with on/off/emit methods — none tested. Missing coverage for: multiple handlers, handler removal, emit with no listeners, and args forwarding.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). A public exported class with a non-trivial API requires at minimum class-level and method-level docs.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant matches documented event name 'spin:done'.
- **Overengineering [LEAN]**: Exporting an event-name constant prevents stringly-typed callers; one-liner with clear purpose.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts as an event name key; no tests verify its value or integration usage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The constant's purpose — event name emitted after each spin with a SpinResult payload — is not inferable from the name alone and warrants a comment.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` Map instance is never reassigned; should be `private readonly listeners`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class), its three public methods (`on`, `off`, `emit`), and `SPIN_DONE` are all exported with no JSDoc. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers synchronously with no try-catch. A throwing handler aborts the loop, silently skipping all subsequent listeners. Standard event-emitter contracts isolate handler errors. [L18-L24] |

### Suggestions

- Mark the `listeners` Map as `readonly` since the reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in `emit` so one throwing handler does not prevent subsequent handlers from running.
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
    ...
  }
  export const SPIN_DONE = "spin:done";
  // After
  /** Lightweight pub/sub emitter for spin lifecycle events. */
  export class SpinEventEmitter {
    /** Register a handler for `event`. */
    on(event: string, handler: EventHandler): void { ... }
    /** Remove a previously registered handler. */
    off(event: string, handler: EventHandler): void { ... }
    /** Invoke all handlers registered for `event`, passing `args`. */
    emit(event: string, ...args: unknown[]): void { ... }
  }
  /** Emitted with the final {@link SpinResult} after every `spin()` call. */
  export const SPIN_DONE = "spin:done";
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
