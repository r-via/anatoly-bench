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

- **Utility [USED]**: Type used in EventHandler[] collections and method signatures for on/off/emit handlers
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; no correctness issues.
- **Overengineering [LEAN]**: Simple type alias for a variadic callback. Minimal and appropriate — improves readability at zero cost.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Exported string constant; no correctness issues.
- **Overengineering [LEAN]**: Single exported string constant. ADR-004 explicitly documents its purpose: prevent string-literal typos in consumer code. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Two issues: (1) `private listeners` should be `private readonly listeners` — the Map reference is never reassigned. (2) `SPIN_DONE = "spin:done"` widens to `string`; adding `as const` narrows it to the literal type `"spin:done"`, which prevents mismatched string comparisons at call-sites. [L4, L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither the `SpinEventEmitter` class nor its public methods (`on`, `off`, `emit`) carry JSDoc. `SPIN_DONE` is also undocumented. ADR-004 in `.anatoly/docs/02-Architecture/04-Design-Decisions.md` describes the lifecycle contract — that intent should be surfaced as JSDoc for API consumers. [L3, L7, L13, L19, L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The `emit` loop has no try-catch around handler invocations. If any single handler throws (e.g. a logging subscriber), all subsequent handlers are silently skipped. Per ADR-004, handlers include logging, analytics, AND free-spin chaining — a throw from logging would prevent the free-spin chain from firing, a real business-logic hazard in this casino domain. Consider wrapping each `handler(...args)` call in a try-catch. [L19-L25] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SPIN_DONE` is a good candidate for `as const` (narrowing to literal type). More impactfully, a typed event-map approach using `satisfies` or a const type parameter on `SpinEventEmitter` would eliminate the `unknown` cast burden on consumers while remaining TS 5.5+ idiomatic. [L27] |
| 17 | Context-adapted rules | WARN | MEDIUM | As a utility event bus, the current `(...args: unknown[]) => void` signature forces every consumer to unsafely cast the event payload (e.g., `result as SpinResult`). For a pub-sub emitter in a casino engine, a typed event map (generic over an event→payload record) would preserve type safety end-to-end and is the idiomatic pattern for TypeScript utility libraries. |

### Suggestions

- Narrow `SPIN_DONE` to its literal type and mark `listeners` as readonly
  ```typescript
  // Before
  private listeners: Map<string, EventHandler[]> = new Map();
  ...
  export const SPIN_DONE = "spin:done";
  // After
  private readonly listeners: Map<string, EventHandler[]> = new Map();
  ...
  export const SPIN_DONE = "spin:done" as const;
  ```
- Guard `emit` so a throwing handler cannot abort delivery to subsequent handlers
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
      console.error(`[SpinEventEmitter] handler for "${event}" threw:`, err);
    }
  }
  ```
- Introduce a typed event map to eliminate `unknown` casts at call-sites
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  export class SpinEventEmitter { ... }
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TMap extends EventMap = Record<string, unknown[]>> {
    private readonly listeners = new Map<keyof TMap, Array<EventHandler<TMap[keyof TMap]>>>();
    on<K extends keyof TMap>(event: K, handler: EventHandler<TMap[K]>): void { ... }
    emit<K extends keyof TMap>(event: K, ...args: TMap[K]): void { ... }
  }
  ```
- Add JSDoc to exported symbols to document the lifecycle contract
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * @see {@link SPIN_DONE} for the canonical event name emitted after each spin.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
