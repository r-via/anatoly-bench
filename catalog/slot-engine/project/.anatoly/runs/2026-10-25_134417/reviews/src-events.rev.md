# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | - | 90% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and well-formed.
- **Overengineering [LEAN]**: Simple type alias, minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are correctly implemented. `on` mutates the existing array in-place while `off` replaces it via filter — this asymmetry means a handler added via `on` during an active `emit` loop would be visited in that same iteration, but no concrete in-tree caller performs this pattern, so it remains hypothetical.
- **Overengineering [OVER]**: Hand-rolls on/off/emit — an exact subset of Node.js's built-in EventEmitter (require('events').EventEmitter or extends EventEmitter). NIH with zero benefit: single consumer (src/engine.ts::spin), no custom behavior beyond what the built-in provides. Replace with `extends EventEmitter` from Node's stdlib.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple string constant, no correctness issues.
- **Overengineering [LEAN]**: Simple string constant for event naming, appropriate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE is typed as string rather than the literal 'spin:done'. Adding as const narrows it to the literal type, preventing accidental reassignment comparison bugs. [L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter and SPIN_DONE are exported with no JSDoc. The class name is self-describing but the emit error-propagation behavior and the event-name constant's expected consumers are not documented. [L3-L23] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit iterates handlers in a bare for-of with no try-catch. A throwing handler aborts the loop, silently skipping all subsequent handlers. Standard event-emitter practice is to isolate each handler call. [L19-L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SPIN_DONE could use as const to produce a const-typed literal. satisfies could enforce a string-event-name contract if an EventName type is introduced in types.ts. [L26] |

### Suggestions

- Narrow SPIN_DONE to a literal type with as const
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate handler errors in emit so a throwing handler does not abort subsequent ones
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
      // surface via a dedicated 'error' event or rethrow after all handlers run
      console.error('[SpinEventEmitter] handler error:', err);
    }
  }
  ```
- Add JSDoc to SpinEventEmitter and SPIN_DONE
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Minimal synchronous event emitter for slot-engine lifecycle events.
   * Handlers are invoked in registration order; a throwing handler aborts
   * remaining handlers unless errors are caught internally.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
