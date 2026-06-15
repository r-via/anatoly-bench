# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | - | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and consistent with its usage in SpinEventEmitter.
- **Overengineering [LEAN]**: Minimal type alias; captures variadic unknown args correctly for a generic event system.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are internally consistent. off uses filter (creates a new array), so in-flight emit loops retain their original array reference and are not affected by concurrent removals. No concrete in-tree call path triggers misbehavior.
- **Overengineering [OVER]**: NIH: reimplements Node.js built-in `EventEmitter` (on/off/emit, Map-backed listener lists) with identical semantics. Has exactly 1 consumer that emits exactly 1 event (`SPIN_DONE`). Extending `require('events').EventEmitter` or using `EventTarget` eliminates ~20 lines with no trade-offs.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic; no correctness issues.
- **Overengineering [LEAN]**: Named constant prevents magic strings; appropriate regardless of how many call sites exist.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `listeners` class field should be `private readonly listeners` — the Map reference is never reassigned, only its contents mutate. Missing `readonly` modifier. [L3] |
| 9 | JSDoc on public exports | WARN | MEDIUM | No JSDoc on `SpinEventEmitter` class, its three public methods (`on`, `off`, `emit`), or the `SPIN_DONE` constant. [L2-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | In `emit`, a throwing handler aborts the loop — subsequent handlers are never called. In a gambling engine, a failing jackpot or free-spin listener would silently drop events. Each handler invocation should be wrapped in try-catch to ensure all listeners execute. [L19-L23] |
| 15 | Testability | WARN | MEDIUM | `SpinEventEmitter` is a concrete class with no exported interface. The engine consumer (`src/engine.ts`) couples directly to the class, preventing easy mock substitution in unit tests. Exporting an `ISpinEventEmitter` interface would allow injection of test doubles. [L2-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Custom synchronous event emitter re-implements logic already solved by `eventemitter3` (typed, tested, handles re-entrant off-during-emit). For a regulated gambling engine where audit trails of event delivery matter, a proven library is preferable to a hand-rolled implementation. |

### Suggestions

- Add `readonly` to the `listeners` field — the Map reference never changes.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in `emit` so one failing listener does not block the rest.
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
- Export an interface to decouple the engine from the concrete class and enable test mocking.
  ```typescript
  // Before
  export class SpinEventEmitter { ... }
  // After
  export interface ISpinEventEmitter {
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
    emit(event: string, ...args: unknown[]): void;
  }
  export class SpinEventEmitter implements ISpinEventEmitter { ... }
  ```
- Add JSDoc to the two exported public symbols.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Typed synchronous event emitter used to signal slot-machine lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
