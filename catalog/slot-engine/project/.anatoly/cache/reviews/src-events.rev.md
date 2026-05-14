# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type alias used locally in Map<string, EventHandler[]> and method parameters of SpinEventEmitter
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and sufficiently general for the pub-sub use case.
- **Overengineering [LEAN]**: Minimal type alias; avoids repeating the signature at each `on`/`off` call site.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is not self-evident; a brief description of its role as the listener callback shape would help consumers.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handler registration, removal by reference equality, and ordered dispatch are all sound.
- **Overengineering [LEAN]**: ADR-004 explicitly justifies the custom implementation over Node.js `EventEmitter` for environment-agnosticism (browser, Deno, edge). Implementation is ~20 lines covering exactly on/off/emit with no unnecessary generics or inheritance. Single importer is noted but the design decision is documented.
- **Tests [NONE]**: No test file exists. Core event emitter used by src/engine.ts; on/off/emit methods and edge cases (duplicate handlers, removing non-existent handler, emitting with no listeners, multiple args) are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Class and all three public methods (on, off, emit) lack JSDoc. Parameters, return values, and the critical lifetime/scoping constraint (each instance is independent) are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant exported correctly; matches documented usage in ADR-004.
- **Overengineering [LEAN]**: Named constant prevents string-literal typos in consumer code; ADR-004 documents this intent explicitly.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts as an event key; its correct string value is never asserted in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The event name string and the shape of arguments passed when it is emitted (a SpinResult) are not documented for consumers.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners field missing readonly modifier. readonly prevents accidental field reassignment while Map contents remain mutable as required. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter (with 3 public methods) and SPIN_DONE export no JSDoc. ADR-004 documents intent but does not substitute for in-code documentation. [L3-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers with no try-catch. A throwing handler aborts the loop, silently skipping all subsequent registered handlers — a reliability hazard in multi-listener scenarios. [L18-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | on() returns void; the modern pub-sub convention returns an unsubscribe function. ADR-004 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) explicitly flags listener lifetime management as a known pain point — returning () => this.off(event, handler) resolves it without requiring callers to retain handler references. [L6-L10] |

### Suggestions

- Add readonly to listeners to prevent field reassignment
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Wrap each handler dispatch in try-catch so one throwing handler does not abort remaining handlers
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
      // emit an 'error' event or rethrow after full iteration
      console.error(`SpinEventEmitter: handler error on "${event}"`, err);
    }
  }
  ```
- Return an unsubscribe function from on() — directly addresses the listener lifetime concern in ADR-004
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }
  // After
  on(event: string, handler: EventHandler): () => void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
    return () => this.off(event, handler);
  }
  ```
- Add JSDoc to exported symbols
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * Emit SPIN_DONE after each spin completes. See ADR-004.
   */
  export class SpinEventEmitter {
  ```
- Implement Symbol.dispose to enable using-statement cleanup (TS 5.2+)
  ```typescript
  // Before
  // end of class body
  // After
  [Symbol.dispose](): void {
    this.listeners.clear();
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
