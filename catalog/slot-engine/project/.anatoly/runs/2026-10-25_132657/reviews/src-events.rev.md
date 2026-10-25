# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | - | 85% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; no correctness issues.
- **Overengineering [LEAN]**: Simple type alias, no abstraction overhead.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `on` mutates the array in-place, so a handler registered during `emit` via `on` will fire in the same emission cycle (for...of tracks live array length). No concrete in-tree consumer demonstrates this re-entrant path, so it stays a precision-guard concern under rule 1, not a NEEDS_FIX. All three methods are otherwise correct: `off` creates a new filtered array (safe against concurrent iteration), `emit` iterates the original reference safely even when `off` is called inside a handler.
- **Overengineering [OVER]**: NIH: reimplements Node.js built-in `EventEmitter` (on/off/emit) for a single consumer (`engine.ts::spin`). Node's `require('events').EventEmitter` or, for browser targets, the widely-adopted `eventemitter3` (>10M weekly downloads) would eliminate this hand-rolled class entirely.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant with no logic; no correctness issues.
- **Overengineering [LEAN]**: Simple named string constant, avoids magic strings — appropriate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `private listeners` reference never changes — should be `readonly`. `SPIN_DONE` lacks `as const`, widening its type to `string` instead of the literal `"spin:done"`. [L3,L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Two public exports (`SpinEventEmitter`, `SPIN_DONE`) have no JSDoc. Below the 3-export FAIL threshold. [L2,L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers with no try-catch. A throwing handler aborts iteration, silently skipping all subsequent listeners. In a gaming context, a buggy spin-done listener could break the game loop. [L18-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | For a typed gaming event bus, a generic event-map parameter (`SpinEventEmitter<TMap extends Record<string,unknown[]>>`) would enforce that emit and on calls agree on argument shapes. The current string-keyed approach loses type safety at every call site. [L2] |

### Suggestions

- Mark `listeners` readonly and narrow `SPIN_DONE` to its literal type
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
- Isolate handler errors in `emit` so one bad listener cannot abort remaining ones
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
      console.error(`[SpinEventEmitter] handler error on "${event}":`, err);
    }
  }
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export class SpinEventEmitter {
  export const SPIN_DONE = "spin:done" as const;
  // After
  /** Event emitter for slot-engine spin lifecycle events. */
  export class SpinEventEmitter {
  /** Emitted when a spin completes. */
  export const SPIN_DONE = "spin:done" as const;
  ```
- Consider a typed event map for type-safe emit/on pairs
  ```typescript
  // Before
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void
  // After
  type SpinEventMap = {
    [SPIN_DONE]: [result: SpinResult];
  };
  export class SpinEventEmitter<TMap extends Record<string, unknown[]> = SpinEventMap> {
    on<K extends keyof TMap>(event: K, handler: (...args: TMap[K]) => void): void
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
