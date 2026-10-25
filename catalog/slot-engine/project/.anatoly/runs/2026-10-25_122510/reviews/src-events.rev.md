# Review: `src/events.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; no defect.
- **Overengineering [LEAN]**: Simple type alias for a callback signature.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are consistent. emit iterates the live array, but on/off create new arrays (off uses filter), so handler removal during emit doesn't mutate the iterated list. A handler added mid-emit via push on the same array may run in that emit, which is benign. No concrete wrong behavior.
- **Overengineering [ACCEPTABLE]**: Hand-rolled minimal emitter with a single importer and a single event. A direct callback or Node's built-in `events.EventEmitter` would suffice. The implementation is small and not complex, so the cost is low.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant; no defect.
- **Overengineering [LEAN]**: Plain string constant for the event name.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is not readonly; EventHandler[] arrays are mutable. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter, its methods, and SPIN_DONE lack JSDoc. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit invokes handlers with no try/catch; one throwing handler aborts the remaining handlers and propagates to spin(). Also iterating the live array is safe only because off() replaces it. [L21-L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | Stringly-typed events with unknown[] args. A generic event map would give type-safe handlers. SPIN_DONE could use `as const`. [L1-L27] |

### Suggestions

- Add a typed event map so handlers and payloads are checked
  - Before: `on(event: string, handler: EventHandler): void`
  - After: `on<K extends keyof Events>(event: K, handler: (...args: Events[K]) => void): void`
- Make the listeners map readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Document exports
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Event name emitted when a spin completes. */
  export const SPIN_DONE = "spin:done" as const;
  ```
