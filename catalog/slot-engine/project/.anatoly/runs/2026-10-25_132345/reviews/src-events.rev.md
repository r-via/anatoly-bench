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
- **Correction [OK]**: Type alias only; no runtime behavior to get wrong.
- **Overengineering [LEAN]**: Simple type alias for a handler signature.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `on` registers handlers, `off` removes them with a non-mutating filter, and `emit` iterates the array. No concrete defect is visible. The only edge cases are hypothetical: a handler that registers another handler during emit, and a throwing handler that stops later handlers. Neither is triggered by the visible consumer, `spin` in src/engine.ts.
- **Overengineering [ACCEPTABLE]**: Minimal hand-rolled emitter (on/off/emit), no extras. Single importer and single event (SPIN_DONE) make a class heavier than a plain callback. Node's built-in `events` EventEmitter could replace it. Implementation is small and not abstracted further.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: A string constant. It is consistent and used by `spin` in src/engine.ts.
- **Overengineering [LEAN]**: Plain string constant for event name; avoids magic strings.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned but lacks `readonly`. Handler arrays are mutated via push. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Exported `SpinEventEmitter` (class), its public methods `on`/`off`/`emit`, and `SPIN_DONE` have no JSDoc. Three exports/public members undocumented. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers without try/catch: one throwing handler aborts remaining handlers and propagates to the caller (`spin`). Iterating the live array is safe since `off` replaces the array, but isolation is missing. [L21-L25] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | Event names are untyped `string` and `SPIN_DONE` is not `as const`; a typed event map with generics would give typed handler args. `SPIN_DONE` is inferred as the literal type via `const`, so this is minor. [L3-L27] |

### Suggestions

- Mark the listener map readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Add JSDoc to exports
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Event name emitted when a spin completes. */
  export const SPIN_DONE = "spin:done";
  ```
- Type the event map for typed handler arguments
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  emit(event: string, ...args: unknown[]): void
  // After
  interface SpinEvents { [SPIN_DONE]: [result: SpinResult] }
  emit<K extends keyof SpinEvents>(event: K, ...args: SpinEvents[K]): void
  ```
- Isolate handler failures in emit
  ```typescript
  // Before
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  for (const handler of [...handlers]) {
    try { handler(...args); } catch (err) { console.error(err); }
  }
  ```
