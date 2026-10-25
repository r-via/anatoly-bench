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
- **Correction [OK]**: Plain function type alias, no correctness issue.
- **Overengineering [LEAN]**: Single-line type alias for handler signature; minimal.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on, off and emit are correct. off replaces the array with a filtered copy, so removing a handler during emit does not disturb the iteration in progress.
- **Overengineering [ACCEPTABLE]**: Hand-rolled emitter with a single consumer (spin) and a single event (SPIN_DONE); `off` is likely unused. Implementation is small and straightforward (~20 lines), but Node's built-in `EventEmitter` from `node:events` would cover this natively. Mild NIH, but justified by zero-dependency, browser-compatible simplicity.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant, no issue.
- **Overengineering [LEAN]**: Simple string constant for the event name; avoids magic strings.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | Event-to-handler store could use a typed event map (Record) instead of free-form string keys; handler args are untyped `unknown[]`, forcing consumers to cast. [L1-L4] |
| 5 | Immutability | WARN | MEDIUM | `listeners` is not `readonly`. `on` mutates the stored array in place. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `SpinEventEmitter`, its public methods and `SPIN_DONE` have no JSDoc. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers synchronously without try/catch. A throwing handler aborts the remaining handlers and propagates into `spin`, after the result is computed. `off` during emit is safe because `filter` creates a new array. No non-Error throws. [L19-L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | `on` returns void, so there is no unsubscribe handle. There is no `once`. `SPIN_DONE` is not declared `as const`, and the event name is not tied to its payload type. Consumers must pass the exact string to `emit` and `on`. [L6-L27] |

### Suggestions

- Type the event map so handlers get typed payloads
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  emit(event: string, ...args: unknown[]): void
  // After
  interface SpinEvents { 'spin:done': [result: SpinResult] }
  class SpinEventEmitter {
    emit<K extends keyof SpinEvents>(event: K, ...args: SpinEvents[K]): void
  }
  ```
- Mark the listeners field readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Isolate handler failures in emit so one throwing handler does not stop the rest
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
      console.error(`Handler for "${event}" failed`, err);
    }
  }
  ```
