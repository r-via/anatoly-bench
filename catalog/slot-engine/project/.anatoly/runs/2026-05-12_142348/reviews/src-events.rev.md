# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type alias used locally in SpinEventEmitter for method signatures and field declarations
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriate for the use case.
- **Overengineering [LEAN]**: Minimal type alias; no generics or indirection beyond what the emitter requires.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature and intended usage context (spin lifecycle callbacks) are not explained.

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Named constant correctly typed as string literal, no correctness issues.
- **Overengineering [LEAN]**: Named constant preventing string-literal typos at call sites. Single line, zero overhead.
- **Tests [NONE]**: No test file exists. String constant used as event key in engine.ts; no tests verify correct usage as an event identifier.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The constant's role as the canonical event name for spin completion, and the payload shape emitted with it, are not documented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` is never reassigned; should be `private readonly listeners`. `SPIN_DONE` is a primitive const — TypeScript infers `"spin:done"` literal type, so `as const` is not required. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` and its public methods (`on`, `off`, `emit`) have no JSDoc. `SPIN_DONE` constant lacks a doc comment explaining the payload shape (`SpinResult`). [L3-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers in a bare `for...of` with no error isolation. A throwing handler aborts the loop silently, leaving subsequent handlers unexecuted. Wrap each call in try-catch or re-throw after draining the list. [L19-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | The emitter is fully untyped: event names are `string` and args are `unknown[]`. A generic typed event map would catch mismatched payload types at compile time — especially valuable since `SPIN_DONE` carries a `SpinResult` payload used across engine, logging, and free-spin chaining. [L1-L26] |

### Suggestions

- Mark `listeners` as readonly — the reference is never replaced, only mutated.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in `emit` so one bad handler cannot silently drop remaining ones.
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
      // re-throw after draining, or forward to an error handler
      console.error(`[SpinEventEmitter] handler error on "${event}"`, err);
    }
  }
  ```
- Add a generic typed event map to catch payload mismatches at compile time.
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
    on(event: string, handler: EventHandler): void { ... }
    emit(event: string, ...args: unknown[]): void { ... }
  }
  // After
  type EventMap = Record<string, unknown[]>;
  type Handler<A extends unknown[]> = (...args: A) => void;
  
  export class SpinEventEmitter<TMap extends EventMap> {
    private readonly listeners = new Map<keyof TMap, Handler<TMap[keyof TMap]>[]>();
  
    on<K extends keyof TMap>(event: K, handler: Handler<TMap[K]>): void { ... }
    off<K extends keyof TMap>(event: K, handler: Handler<TMap[K]>): void { ... }
    emit<K extends keyof TMap>(event: K, ...args: TMap[K]): void { ... }
  }
  
  // Usage:
  // new SpinEventEmitter<{ 'spin:done': [SpinResult] }>()
  ```
- Add JSDoc to exported symbols documenting the SPIN_DONE payload shape.
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  // After
  /** Fired by `engine.ts` after every spin. Listener receives a single `SpinResult` argument. */
  export const SPIN_DONE = "spin:done";
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
