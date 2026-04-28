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

- **Utility [USED]**: Type alias used locally in SpinEventEmitter for parameter and Map value type annotations
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple type alias with no logic; no correctness issues.
- **Overengineering [LEAN]**: Minimal type alias for a variadic event handler callback. Centralising this type prevents scattered inline repetition and adds no structural overhead.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant export; no logic, no correctness issues.
- **Overengineering [LEAN]**: One-line named constant that eliminates magic string literals in consumer code. ADR-004 explicitly calls this out as intentional. No abstraction overhead whatsoever.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `listeners` field is never reassigned after construction; it should be declared `readonly`. The Map reference itself is stable — only its contents change, so `readonly` is both accurate and self-documenting. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` (the class) nor its public methods (`on`, `off`, `emit`) have JSDoc comments. `SPIN_DONE` also lacks a brief description. Consumers must infer semantics from the ADR rather than inline docs. [L3-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The `emit` loop invokes handlers bare, with no try-catch isolation. If any handler throws synchronously, subsequent registered handlers are silently skipped. Per ADR-004, SPIN_DONE consumers include logging, analytics, and free-spin chaining — all of which are safety-critical in a regulated gaming context. A single bad handler can silently break the entire observation chain. [L19-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | The event map is structurally untyped: `on(event: string, handler: (...args: unknown[]) => void)`. Consumers of `SPIN_DONE` must unsafely cast `args[0]` to `SpinResult` without any compiler guarantee. A typed event-map pattern (`EventMap extends Record<string, unknown[]>`) would propagate the correct payload type to each listener at compile time, eliminating the runtime assumption. [L1-L7] |

### Suggestions

- Mark `listeners` as `readonly` — the Map reference is never reassigned, only mutated in place.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors inside `emit` so one throwing listener cannot silently drop all subsequent ones (critical for analytics/free-spin chaining per ADR-004).
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
      console.error(`[SpinEventEmitter] Handler for "${event}" threw:`, err);
    }
  }
  ```
- Introduce a typed event-map so consumers receive the correct payload type without casting `unknown`.
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private readonly listeners: Map<string, EventHandler[]> = new Map();
  
    on(event: string, handler: EventHandler): void { ... }
    emit(event: string, ...args: unknown[]): void { ... }
  }
  // After
  type EventMap = {
    [SPIN_DONE]: [result: SpinResult];
  };
  
  export class SpinEventEmitter<TMap extends Record<string, unknown[]> = EventMap> {
    private readonly listeners = new Map<keyof TMap, Array<(...args: unknown[]) => void>>();
  
    on<K extends keyof TMap>(event: K, handler: (...args: TMap[K]) => void): void { ... }
    emit<K extends keyof TMap>(event: K, ...args: TMap[K]): void { ... }
  }
  ```
- Add JSDoc to public exports so API consumers do not need to consult the ADR.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * Attach observers with `on(SPIN_DONE, handler)` before calling `spin()`.
   * @see ADR-004
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
