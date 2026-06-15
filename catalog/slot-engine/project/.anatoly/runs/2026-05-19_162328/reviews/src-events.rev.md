# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 75% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type used locally in SpinEventEmitter for handler parameter annotations (lines 6, 12) and listeners map generic (line 4)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void handler.
- **Overengineering [LEAN]**: Minimal type alias for the handler signature. No unnecessary generics or abstractions.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name is somewhat descriptive but the variadic `unknown[]` signature carries non-obvious constraints that merit at least a brief explanation.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: map lookup, filter-on-remove, and spread-args dispatch are all sound.
- **Overengineering [ACCEPTABLE]**: Only 1 importer and 1 event constant in the codebase (`SPIN_DONE`), so a simple callback would suffice. However, ADR-9 (internal docs) documents an explicit decision to stay dependency-free and environment-agnostic (browser/Node/Deno), ruling out Node's EventEmitter. The implementation is minimal — 3 methods, no generics, no inheritance — so complexity is low even if the abstraction level is higher than strictly necessary.
- **Tests [NONE]**: No test file exists. Class has non-trivial behavior: on/off/emit interactions, multiple listeners, duplicate handler removal, emit with no listeners — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack JSDoc. Key behavioral constraints — no `once`, no error event, new instance per `spin()` call — are completely undocumented in inline comments or JSDoc.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Constant string value is consistent with ADR-9 and usage as an event key.
- **Overengineering [LEAN]**: Named string constant to avoid magic strings. Standard practice.
- **Tests [NONE]**: No test file exists. Constant used as an event name in engine.ts but never verified in tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The constant's purpose (when it is emitted, who listens, what payload it carries) is not documented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE infers type string instead of literal "spin:done"; missing as const widens the type and loses the narrow literal at call sites. [L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter and SPIN_DONE are exported with no JSDoc. on/off/emit public methods also undocumented. [L3, L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() has no try-catch around handler invocations: a throwing handler silently cancels all subsequent handlers. ADR-9 acknowledges this as a known trade-off, but in a spin lifecycle context (jackpot, free spins, UI) dropped handlers cause silent state corruption. [L19-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are untyped strings — callers can call on/off/emit with any string including typos and mismatched arities, with zero compile-time safety. A typed event map generic would enforce handler signatures at every call site. [L4-L24] |

### Suggestions

- Narrow SPIN_DONE to its literal type so comparisons against it are type-safe
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Guard against throwing handlers in emit so remaining handlers still execute
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
- Add a typed event map to enforce handler signatures at call sites
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
    private listeners: Map<string, EventHandler[]> = new Map();
  
    on(event: string, handler: EventHandler): void { … }
    off(event: string, handler: EventHandler): void { … }
    emit(event: string, ...args: unknown[]): void { … }
  }
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<T extends unknown[]> = (...args: T) => void;
  
  export class SpinEventEmitter<TMap extends EventMap = EventMap> {
    private listeners: Map<keyof TMap & string, EventHandler<unknown[]>[]> = new Map();
  
    on<K extends keyof TMap & string>(event: K, handler: EventHandler<TMap[K]>): void { … }
    off<K extends keyof TMap & string>(event: K, handler: EventHandler<TMap[K]>): void { … }
    emit<K extends keyof TMap & string>(event: K, ...args: TMap[K]): void { … }
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
