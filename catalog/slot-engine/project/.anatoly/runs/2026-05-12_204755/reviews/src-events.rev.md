# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 82% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type used locally as parameter type in on(), off() methods and handler iteration
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and consistent with emit/on/off signatures.
- **Overengineering [LEAN]**: Simple type alias improving readability of the Map signature below it.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is clear but the variadic unknown[] signature warrants a brief description of intended usage.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: lazy init in on, filter-based removal in off, safe early-return when no handlers registered.
- **Overengineering [OVER]**: Reimplements Node.js built-in `EventEmitter` (node:events) with identical semantics (on/off/emit, multi-listener per event). Has only 1 runtime importer, so there is no breadth of use justifying the custom class. Replacing with `import { EventEmitter } from 'node:events'` eliminates ~20 lines and gains battle-tested edge-case handling (max-listener warnings, error events, once, removeAllListeners).
- **Tests [NONE]**: No test file exists. Critical behaviors untested: on/off/emit lifecycle, multiple listeners per event, off removing only the target handler, emit with no registered listeners, emit forwarding variadic args, and handler isolation across events. Used by src/engine.ts, making this a real coverage gap.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). All three methods lack parameter and behavior documentation.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant export, no correctness issues.
- **Overengineering [LEAN]**: Named string constant for an event key — prevents typos at call sites.
- **Tests [NONE]**: No test file exists. Constant string used as an event key in src/engine.ts; untested as part of any emit/on integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment explaining when this event is emitted or what payload consumers should expect.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is reassignable; should be `private readonly listeners`. `SPIN_DONE` is already a narrowed literal via `const`, so `as const` is not needed there. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class + all three methods) and `SPIN_DONE` are exported without JSDoc comments. [L2-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers synchronously with no try-catch. A throwing handler aborts the loop, silently skipping all subsequent handlers. In a game engine context (reel/jackpot events), this can cause silent state desync. [L18-L23] |

### Suggestions

- Mark `listeners` as `readonly` to prevent accidental reassignment of the map reference.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Wrap each handler call in try-catch inside `emit` to prevent one failing handler from silently aborting the rest.
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
- Add JSDoc to exported symbols.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Minimal pub/sub emitter for spin-lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
