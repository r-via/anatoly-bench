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
- **Correction [OK]**: Type alias is correct and consistently used by SpinEventEmitter.
- **Overengineering [LEAN]**: Simple type alias for a variadic callback. No abstraction overhead.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are logically correct. on mutates the stored array in-place via push; off replaces the map entry with a filtered copy. A handler added during emit via on would be visited in the same for-of cycle (array grows while iterating), but no concrete in-tree consumer exhibits this pattern, so it remains a speculative concern per precision guard #1.
- **Overengineering [OVER]**: Hand-rolled reimplementation of Node.js built-in `EventEmitter` (`require('events')`), which natively provides `on`, `off` (removeListener), and `emit` with the same semantics. Single consumer (src/engine.ts::spin) per usage analysis, so there is no generality benefit that would justify avoiding the built-in. NIH: the native EventEmitter covers this entirely without any install.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple string constant, no correctness issues.
- **Overengineering [LEAN]**: Named constant avoids magic strings at call sites. Appropriate pattern.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SPIN_DONE` is inferred as `string` rather than the literal type `"spin:done"`. Adding `as const` narrows it to the literal, enabling exhaustiveness checks at consumers. [L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` (including its `on`/`off`/`emit` methods) nor `SPIN_DONE` carry JSDoc. Both are consumed by `engine.ts` and form part of the public API surface. [L2-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit()` iterates handlers without a try-catch. A throwing handler silently aborts the remaining handler chain, which could silently drop spin-completion side effects in a gambling engine where event ordering matters. [L18-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are bare `string` and payloads are `unknown[]`, discarding compile-time type safety. A typed event map (`interface SpinEvents { [SPIN_DONE]: [SpinResult] }`) would surface mismatched emit/subscribe signatures at compile time — important for a regulated gaming engine. [L1-L24] |

### Suggestions

- Narrow SPIN_DONE to its literal type with `as const`
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Guard the handler loop so one throwing handler does not silently abort later handlers
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
- Introduce a typed event map to surface payload mismatches at compile time
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private listeners: Map<string, EventHandler[]> = new Map();
  
    on(event: string, handler: EventHandler): void {
  // After
  export interface SpinEventMap {
    readonly [SPIN_DONE]: [result: import('./types').SpinResult];
  }
  
  type EventKey = keyof SpinEventMap;
  type EventHandler<K extends EventKey> = (...args: SpinEventMap[K]) => void;
  
  export class SpinEventEmitter {
    private listeners: Map<EventKey, EventHandler<EventKey>[]> = new Map();
  
    on<K extends EventKey>(event: K, handler: EventHandler<K>): void {
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Minimal typed event emitter for slot-engine spin lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
