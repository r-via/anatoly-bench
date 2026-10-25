# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | - | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Plain function type alias; no correctness issue.
- **Overengineering [LEAN]**: Simple type alias for a handler signature; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are correct. off replaces the array with a filtered copy, so removing a handler during emit does not disturb the in-flight iteration. No visible caller triggers a failure path.
- **Overengineering [OVER]**: Hand-rolled pub/sub with a single importer (spin) and a single event (SPIN_DONE). A plain callback or Node's built-in `EventEmitter` would suffice. The on/off/emit surface is a generalization the single consumer doesn't need. The implementation itself is small and correct.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant event name. It is used consistently by its consumer in src/engine.ts.
- **Overengineering [LEAN]**: A single string constant for the event name; appropriate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned but not `readonly`. `EventHandler[]` could be `readonly EventHandler[]`. `SPIN_DONE` could use `as const`. [L4-L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `SpinEventEmitter` (and its public methods `on`/`off`/`emit`) and `SPIN_DONE` have no JSDoc. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers synchronously with no try/catch. One throwing handler aborts the remaining handlers and propagates to the emitter. In `spin`, this means a faulty listener breaks an already computed spin result. No non-Error throws here. [L19-L25] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are untyped `string` and payloads are `unknown[]`. A generic event map would give type-safe `on`/`emit`. `off` also leaves an empty array in the map after the last handler is removed. `emit` iterates the live array, but `off` and `on` replace or mutate it, so a handler that calls `on` for the same event during emit can run in the same dispatch. [L3-L25] |

### Suggestions

- Make the listener map readonly and type events through a generic event map.
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  on(event: string, handler: EventHandler): void {
  // After
  private readonly listeners = new Map<keyof Events, EventHandler[]>();
  on<K extends keyof Events>(event: K, handler: (...args: Events[K]) => void): void {
  ```
- Isolate handler failures in emit so one listener cannot abort the others.
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
      console.error(`Handler for ${event} failed`, err);
    }
  }
  ```
- Add JSDoc to public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Minimal synchronous event emitter for spin lifecycle events. */
  export class SpinEventEmitter {
  ```
- Mark the event name constant as const and document it.
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Emitted when a spin completes. */
  export const SPIN_DONE = "spin:done" as const;
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
