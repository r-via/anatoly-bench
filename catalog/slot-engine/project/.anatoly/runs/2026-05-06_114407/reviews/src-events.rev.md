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

- **Utility [USED]**: Type alias used internally in SpinEventEmitter class: annotates handler parameter in on() and off() methods (L6, L12) and the listeners map type (L4).
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct and sufficient for the pub-sub use case.
- **Overengineering [LEAN]**: Single-line type alias for handler signature. Appropriate named abstraction preventing repetition across on/off/emit signatures.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is non-obvious; a brief note on expected arity/types would help consumers.

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts). Serves as a standard event identifier string.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Named constant export matches documented ADR-004 convention.
- **Overengineering [LEAN]**: Named string constant per ADR-004 to prevent typo-prone string literals at call sites. One-liner with clear justification.
- **Tests [NONE]**: No test file exists. Constant used by src/engine.ts as an event name; not verified in any test that it matches expected consumers.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining what event this constant represents, when it is emitted, or what arguments handlers receive.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned — only mutated via Map methods — so the field should be readonly. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter (class), SPIN_DONE (constant), and all three public methods (on, off, emit) lack JSDoc. ADR-004 documents the emitter's lifecycle contract but it lives in .anatoly/docs, not in the exported API surface. [L2-L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() invokes handlers with no try-catch. A throwing handler (e.g., an analytics callback) halts the remaining handler chain. Per ADR-004, free-spin chaining is a registered SPIN_DONE listener — if it appears after a faulty handler it silently never runs, breaking spin-chain integrity in a gambling context. [L18-L23] |

### Suggestions

- Mark listeners readonly to prevent accidental field reassignment.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Isolate handler errors in emit() so a throwing handler does not abort the remaining chain (critical for free-spin chaining reliability per ADR-004).
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
      console.error(`[SpinEventEmitter] Handler for '${event}' threw:`, err);
    }
  }
  ```
- Add JSDoc to exported class and constant so IDE consumers get inline documentation without reading ADR-004.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * Environment-agnostic: works in browsers, Deno, and edge runtimes.
   * See ADR-004 for lifetime management expectations.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
