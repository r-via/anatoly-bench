# Review: `src/events.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Plain function type alias; no correctness issue.
- **Overengineering [LEAN]**: Simple function type alias; minimal.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on, off and emit behave correctly. off() builds a new array, so removing a handler during emit is safe. No concrete in-tree path produces a wrong result.
- **Overengineering [ACCEPTABLE]**: Minimal hand-rolled emitter (on/off/emit), ~20 lines, no unnecessary generics. Single importer, but the class is small. Node's built-in `events.EventEmitter` could replace it, a minor NIH point.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant; no correctness issue.
- **Overengineering [LEAN]**: Plain string constant for the event name; avoids magic strings.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned but is not `readonly`. `SPIN_DONE` is a const string, so it is already a literal type. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Exports `SpinEventEmitter` and `SPIN_DONE` have no JSDoc, and neither do the public methods `on`, `off` and `emit`. The count of undocumented public API items is 3 or more. [L3-L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers synchronously with no isolation. One throwing handler stops the remaining handlers and propagates into `spin`. `emit` also iterates the live array; a handler calling `off` is safe only because `off` replaces the array. [L21-L26] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | Event names and handler args are untyped (`string`, `unknown[]`). A generic event map would give type-safe events. [L1-L21] |

### Suggestions

- Make the listeners map readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Add JSDoc to the public API
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Event name emitted when a spin completes. */
  export const SPIN_DONE = "spin:done";
  ```
- Use a typed event map
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  // After
  type EventMap = { 'spin:done': [result: SpinResult] };
  class SpinEventEmitter {
    on<K extends keyof EventMap>(event: K, handler: (...args: EventMap[K]) => void): void { /* ... */ }
  }
  ```
