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

- **Utility [USED]**: Type alias used locally in method signatures (on, off) within SpinEventEmitter
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and appropriate for variadic event handlers.
- **Overengineering [LEAN]**: Simple type alias that avoids repeating the verbose function signature across `on`, `off`, and `emit` signatures. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The type alias is reasonably self-descriptive but the variadic unknown[] signature hides important constraints (e.g., what args are expected per event). A brief JSDoc noting its role as a generic event callback would add value.

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1+ runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Exported string constant is correct.
- **Overengineering [LEAN]**: Named constant preventing string-literal typos in consumer code. Exactly the right level of abstraction for an event name.
- **Tests [NONE]**: No test file exists. Constant imported by src/engine.ts as an event key; no tests verify its value or usage contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose (event name emitted after every spin completes), expected payload type (SpinResult), and the typo-prevention rationale for exporting it as a constant are all absent.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned after construction — should be private readonly listeners. The Map reference is mutated via set/get but the field itself is stable. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter (class), on(), off(), emit(), and SPIN_DONE are all exported with no JSDoc. The ADR documents intent but inline docs are missing. [L3-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers with no try-catch. A throwing handler aborts the loop; subsequent handlers are silently skipped. In a casino spin lifecycle (SPIN_DONE consumers include logging, analytics, free-spin chaining per ADR-004), a buggy analytics handler can block free-spin chaining. Wrap each handler call in try-catch or copy the handlers array before iteration. [L18-L23] |

### Suggestions

- Mark listeners as readonly — the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard each handler invocation in emit() so a throwing handler does not silently drop downstream listeners (critical in a casino spin lifecycle where analytics, logging, and free-spin chaining all share the same SPIN_DONE event).
  ```typescript
  // Before
  for (const handler of handlers) {
    handler(...args);
  }
  // After
  for (const handler of [...handlers]) {
    try {
      handler(...args);
    } catch (err) {
      // isolate per-handler failures; re-emit or log as appropriate
      console.error(`[SpinEventEmitter] handler for "${event}" threw:`, err);
    }
  }
  ```
- Add JSDoc to exported class and methods.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * Environment-agnostic (browser, Node.js, Deno, edge runtimes).
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
