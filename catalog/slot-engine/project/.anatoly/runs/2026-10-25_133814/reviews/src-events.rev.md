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
- **Correction [OK]**: Type alias only. It has no runtime behavior.
- **Overengineering [LEAN]**: Simple type alias for a handler signature.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `on`, `off` and `emit` behave correctly. `off` builds a new array with `filter`, so removing a handler during `emit` is safe. A handler that throws would stop later handlers, but that is standard emitter behavior and no caller depends on anything else.
- **Overengineering [ACCEPTABLE]**: Minimal hand-rolled emitter (on/off/emit) with a single consumer in spin. A bare event bus for one event is more than needed, but the implementation is small and straightforward. Node's built-in `events.EventEmitter` could replace it.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant event name. It is used consistently with `emit` in `src/engine.ts`.
- **Overengineering [LEAN]**: Plain string constant for the event name.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | Event names and handler signatures are untyped (`string`, `unknown[]`). A generic event map would give type-safe `on`/`emit` and avoid unknown args at every consumer. [L1-L27] |
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned but is not `readonly`. `handlers.push` mutates an array held in the Map, while `off` replaces it immutably. The mutation is inconsistent and interacts badly with `emit`. [L4-L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter`, its methods, and `SPIN_DONE` have no JSDoc. Contracts are mostly inferable from names, but emit semantics are not documented: handler order, synchronous dispatch, and that a throwing handler aborts the remaining handlers. [L3-L27] |
| 10 | Modern 2026 practices | WARN | MEDIUM | A hand-rolled emitter with a Map of arrays is used where `EventTarget` or a typed emitter could serve. Using `private` instead of `#private` is also dated. [L3-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls handlers without isolation. One throwing handler stops the remaining handlers and propagates to the caller (`spin`), so a listener failure can abort a spin after its payout is computed. No async or rejection handling is involved, and no non-Error throw occurs here. Subscribers are also not isolated from `on`/`off` during dispatch, since `off` replaces the array and `on` pushes into the live array being iterated. [L21-L26] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | Without `satisfies` or `as const` on `SPIN_DONE`, its type widens to `"spin:done"` only because of `const`. Typing events with a generic map would make better use of modern TS. [L27] |

### Suggestions

- Type the event map so `on`/`emit` are checked against known events and payloads
  - Before: `on(event: string, handler: EventHandler): void`
  - After: `on<K extends keyof SpinEvents>(event: K, handler: (...args: SpinEvents[K]) => void): void`
- Make the listeners map readonly and avoid mutating the handler array during dispatch
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  ...
  for (const handler of handlers) {
  // After
  readonly #listeners = new Map<string, readonly EventHandler[]>();
  ...
  for (const handler of [...handlers]) {
  ```
- Add JSDoc to document dispatch semantics
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Event name emitted by `spin` once a spin has completed. */
  export const SPIN_DONE = "spin:done" as const;
  ```
