# Review: `src/events.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Plain function type alias. No correctness issue.
- **Overengineering [LEAN]**: Simple function type alias; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `on`, `off` and `emit` behave correctly. `off` replaces the array with a filtered copy, so unsubscribing during `emit` doesn't disturb the iteration in progress. Handler exceptions propagate to the emitter's caller, which is a design choice and not a defect.
- **Overengineering [ACCEPTABLE]**: Hand-rolled pub/sub with a single consumer (spin) and a single event (SPIN_DONE). Implementation is minimal (on/off/emit), but a class with a listener registry is more than one-event use needs. Node's built-in `events.EventEmitter` provides this natively. Not heavy enough to be OVER.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant event name. No issue.
- **Overengineering [LEAN]**: Plain string constant for the event name; avoids magic strings.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned but lacks `readonly`. `on` mutates the stored handler array in place via push; handler arrays could be `readonly EventHandler[]`. [L4-L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter`, its methods, and `SPIN_DONE` lack JSDoc. Names are largely self-describing, but emit's synchronous, in-order dispatch and error propagation are undocumented. [L3-L27] |
| 10 | Modern 2026 practices | WARN | MEDIUM | Hand-rolled emitter with `Map<string, EventHandler[]>` where `EventTarget` or typed event maps could be used. `on` does not return an unsubscribe function. [L3-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers with no try/catch. One throwing handler aborts the remaining handlers and propagates to the emitter (`spin`). No non-Error throws in this file. Kept at WARN because the throwing handler is internal misuse, not a defect on a line. [L19-L25] |
| 14 | Performance | WARN | MEDIUM | `off` reallocates the array on every call and leaves an empty array in the map. `on` can register the same handler twice. Negligible at this scale. [L13-L16] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The event name is an untyped `string`. A generic event map or a `SPIN_DONE` declared `as const` would give typed payloads and event names. [L1-L27] |
| 17 | Context-adapted rules | WARN | MEDIUM | Emitter dispatches over the live handler array. A handler calling `off` during `emit` is safe, since `off` replaces the array. A handler calling `on` during `emit` mutates the array being iterated, so the new handler runs in the same dispatch. Iterate a copy to avoid this. [L19-L25] |

### Suggestions

- Mark the listener map readonly and wrap handler calls so one failure does not block the others
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  ...
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  private readonly listeners = new Map<string, readonly EventHandler[]>();
  ...
  for (const handler of [...handlers]) {
    try { handler(...args); } catch (err) { console.error(err); }
  }
  ```
- Return an unsubscribe function from `on` and add JSDoc
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void {
  // After
  /** Registers `handler` for `event`. Returns a function that removes it. */
  on(event: string, handler: EventHandler): () => void {
  ```
- Declare the event name constant with `as const`
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
