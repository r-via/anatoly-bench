# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 78% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Local type used in SpinEventEmitter method signatures and Map generic parameter
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void handler.
- **Overengineering [LEAN]**: Simple type alias for a variadic void callback. Appropriate for the Map's value type.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is not self-explanatory enough to skip documentation — callers cannot tell what constraints or conventions apply.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; off correctly filters by reference identity; emit iterates a snapshot-free list but mutation during emission is the caller's concern given the documented single-use-per-spin pattern.
- **Overengineering [ACCEPTABLE]**: NIH: Node's built-in EventEmitter covers on/off/emit without 20 lines of custom code. However, reference docs explicitly call this a 'lightweight event bus' and show it as an intentional, documented extension point — the custom implementation is framework-agnostic and narrower in surface area than EventEmitter. Suggestion: `EventEmitter` from 'node:events' (zero install cost) would eliminate the custom implementation entirely.
- **Tests [NONE]**: No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multi-listener behavior, handler deregistration, and unknown-arg forwarding are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its methods (`on`, `off`, `emit`). Public API surface — parameter semantics, return values, and event lifecycle are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Value matches documented constant "spin:done" exactly.
- **Overengineering [LEAN]**: String constant preventing magic-string duplication across callers. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. String constant used as an event key in src/engine.ts; not exercised in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The string value `"spin:done"` is visible but the payload type emitted with this event and when it fires are not documented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` field reference is never reassigned; it should be `private readonly listeners`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `SpinEventEmitter` (class and its three public methods) and `SPIN_DONE` export have no JSDoc. [L3-L24] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` iterates handlers without try-catch. A throwing handler aborts the loop, silencing all subsequent handlers. For a slot-engine emitter where analytics/logging hooks may coexist with game-logic hooks, this is a real operational risk. [L19-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | The emitter is untyped: `event: string` and `args: unknown[]` give no compile-time guarantee that the handler signature matches the event. The reference docs already note that consumers must cast (`result as SpinResult`). A generic `TypedEventEmitter<Events extends Record<string, unknown[]>>` pattern would eliminate those casts. [L1-L24] |

### Suggestions

- Mark `listeners` as `readonly` — the field reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard `emit` against throwing handlers so one bad hook cannot silence the rest.
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
      console.error(`SpinEventEmitter: handler for "${event}" threw`, err);
    }
  }
  ```
- Use a generic typed emitter to eliminate consumer-side casts (`result as SpinResult`).
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
  
  export class SpinEventEmitter<T extends Record<string, unknown[]> = EventMap> {
    private readonly listeners = new Map<keyof T, Array<(...args: unknown[]) => void>>();
  
    on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void { ... }
    emit<K extends keyof T>(event: K, ...args: T[K]): void { ... }
  }
  ```
- Add JSDoc to the exported class and constant.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight synchronous event bus used to broadcast spin lifecycle events.
   * Each `spin()` call creates and discards one instance after emitting `SPIN_DONE`.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
