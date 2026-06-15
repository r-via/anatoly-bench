# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type used locally in SpinEventEmitter for handler parameters and array element types.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function-type alias; no correctness issues.
- **Overengineering [LEAN]**: Simple type alias for a variadic callback. No unnecessary abstraction.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature and intended use as a generic event callback are not described.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: emit iterates the live handlers array without snapshotting; on() called from inside a handler pushes to the same array object, causing the newly added handler to fire in the current emit cycle.
- **Overengineering [OVER]**: Hand-rolled event emitter with a single importer. Node.js ships `EventEmitter` as a built-in (no install needed) that covers on/off/emit identically. If browser compatibility is required, `mitt` (~10M weekly downloads, 200 bytes) is a direct drop-in. Rolling a custom emitter for one consumer adds maintenance surface with no benefit.
- **Tests [NONE]**: No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods and edge cases (multiple handlers, removing non-existent handlers, emitting with no listeners, handler deregistration) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Parameters, return values, and behavior (e.g. silent no-op in `off` when event absent) are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant; no correctness issues.
- **Overengineering [LEAN]**: Simple string constant for an event name. Appropriate.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts as an event name — no tests verify it integrates correctly with SpinEventEmitter.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc describing when this event is emitted or what args handlers should expect.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` field should be `private readonly`; `SPIN_DONE` should carry `as const` to narrow its type from `string` to the literal `"spin:done"`. [L4, L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class and its three public methods `on`, `off`, `emit`) and the `SPIN_DONE` constant lack any JSDoc. Consumers have no inline documentation. [L3, L6, L12, L18, L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Two reliability concerns: (1) `emit` has no per-handler try-catch — a single throwing handler silently halts all subsequent handlers. (2) `on()` called from within a handler mutates the same array currently being iterated via `for...of`, so newly registered handlers can be delivered in the same emission cycle (reentrancy hazard). Neither is a full FAIL because both are standard EventEmitter trade-offs, but they are worth hardening. [L18-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are untyped `string`. In a typed casino spin engine, a discriminated union (e.g. `type SpinEvent = 'spin:done'`) on the `event` parameter of `on`/`off`/`emit` would catch typo-based misuse at compile time. [L6, L12, L18] |

### Suggestions

- Add `readonly` to `listeners` and `as const` to `SPIN_DONE`
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
- Snapshot handlers before iteration (prevents reentrancy) and wrap each call in try-catch (prevents one bad handler silencing the rest)
  ```typescript
  // Before
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  for (const handler of [...handlers]) {
    try {
      handler(...args);
    } catch (err) {
      console.error(`SpinEventEmitter: "${event}" handler threw`, err);
    }
  }
  ```
- Narrow event names to a typed union to prevent string-typo bugs at call sites
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void
  off(event: string, handler: EventHandler): void
  emit(event: string, ...args: unknown[]): void
  // After
  type SpinEvent = 'spin:done'; // extend as new events are added
  on(event: SpinEvent, handler: EventHandler): void
  off(event: SpinEvent, handler: EventHandler): void
  emit(event: SpinEvent, ...args: unknown[]): void
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In emit(), snapshot the handlers array before iterating: replace `for (const handler of handlers)` with `for (const handler of handlers.slice())` to prevent handlers added during the current emit cycle from being invoked in the same cycle. [L21]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
