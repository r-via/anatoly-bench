# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | - | 78% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias only; no runtime behavior.
- **Overengineering [LEAN]**: Simple type alias for a callback signature.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on, off and emit are correct. off replaces the array with a filtered copy, so removing a handler during emit does not disturb the iteration in progress. A missing event returns early.
- **Overengineering [OVER]**: Hand-rolled pub/sub emitter with a single importer (spin) and a single event (SPIN_DONE). Nothing ever calls `off`, and `on` is only needed if a listener exists. The class is small and standard, but it is an abstraction built for one client. Node's built-in `events.EventEmitter` already provides this, and a direct callback would be simpler.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant. engine.ts imports it and uses it to emit the event.
- **Overengineering [LEAN]**: Plain string constant for the event name. Minimal.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned but is not `readonly`. Handler arrays are mutable and `on` mutates them in place. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter`, its public methods and `SPIN_DONE` have no JSDoc. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` has no isolation between handlers. A throwing handler aborts the remaining handlers and propagates into the caller (`spin`). `emit` iterates the live array, so a handler that calls `on` during emit is invoked in the same pass. Iterating a snapshot, e.g. `[...handlers]`, avoids this. [L21-L26] |

### Suggestions

- Mark the listeners map readonly and iterate a snapshot in emit so a throwing or self-registering handler does not break dispatch
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  ...
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  private readonly listeners = new Map<string, EventHandler[]>();
  ...
  for (const handler of [...handlers]) {
    try {
      handler(...args);
    } catch (err) {
      console.error(`Handler for "${event}" failed`, err);
    }
  }
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Event name emitted by the engine when a spin completes. */
  export const SPIN_DONE = "spin:done";
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
