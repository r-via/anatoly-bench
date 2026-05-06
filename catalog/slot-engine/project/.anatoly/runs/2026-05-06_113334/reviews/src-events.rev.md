# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 90% |
| SpinEventEmitter | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Non-exported type alias referenced in SpinEventEmitter class on lines 5, 7, and 13
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple type alias; no correctness issues.
- **Overengineering [LEAN]**: Single-line type alias for a variadic callback. Provides a named type for reuse across on/off/emit signatures without adding any unnecessary generality.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed by convention.
- **DOCUMENTED [DOCUMENTED]**: Non-exported type alias with a self-descriptive name and a simple, unambiguous signature — no JSDoc needed per the self-descriptive type rule. Internal usage only further lowers the bar.

#### `SpinEventEmitter` (L3–L25)

Auto-promoted: exported class imported by 1 file — abstraction built for a single client

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer (src/engine.ts)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Named string constant; value matches ADR-004 usage example. No issues.
- **Overengineering [LEAN]**: A single exported string constant. ADR-004 explicitly motivates it as a typo-prevention measure for consumer code. No overengineering possible at this scope.
- **Tests [NONE]**: No test file found. While this is a simple string constant, its role as the canonical event name used by src/engine.ts means no test verifies it is correctly passed to emit/on calls in integration scenarios.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported constant with no JSDoc. The bare string value 'spin:done' and name give only a rough hint; there is no documentation explaining when this event is emitted, what payload accompanies it, or why consumers should prefer this constant over the raw string literal.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SPIN_DONE` is declared as a plain `const` string without `as const`, so TypeScript widens the inferred type to `string` rather than the literal `"spin:done"`. Consumers that switch/compare on event names lose compile-time exhaustiveness. Additionally, the `private listeners` Map reference could carry a `readonly` modifier to prevent accidental reassignment. [L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor its public methods (`on`, `off`, `emit`) nor the `SPIN_DONE` constant carry JSDoc comments. ADR-004 documents the intended use and lifecycle contract but that knowledge is not surfaced at the API level. Consumers relying on editor tooling see no inline documentation. [L2-L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The `emit` loop has no per-handler error isolation. A single synchronously-throwing handler silently aborts all remaining observers. In the gambling domain context (SPIN_DONE drives logging, analytics, and free-spin chaining per ADR-004), this means a misbehaving analytics listener can silently suppress free-spin chaining — a correctness and compliance risk. [L17-L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The emitter uses an untyped `string` event key and `unknown[]` args, missing the TypeScript 5.4 const type-parameter feature that would enable a fully type-safe generic event map (`class SpinEventEmitter<TEvents extends Record<string, unknown[]>>`). This would catch mismatched payloads on `emit` at compile time rather than at runtime. [L3-L4] |

### Suggestions

- Narrow SPIN_DONE to its literal type so consumers get compile-time discrimination instead of a wide `string`.
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate per-handler errors in `emit` so a throwing observer cannot abort the remaining chain (critical for SPIN_DONE analytics/free-spin chaining per ADR-004).
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
- Add JSDoc to the public API surface so editor tooling surfaces the lifecycle contract inline.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight pub-sub emitter for spin lifecycle events.
   * Emit `SPIN_DONE` after every spin to notify decoupled observers
   * (logging, analytics, free-spin chaining).
   * @see SPIN_DONE
   */
  export class SpinEventEmitter {
  ```
- Use a generic event map (TypeScript 5.4 const type params) for compile-time validation of event names and payload shapes.
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  
  export class SpinEventEmitter {
  // After
  type EventMap = Record<string, unknown[]>;
  type EventHandler<TArgs extends unknown[]> = (...args: TArgs) => void;
  
  export class SpinEventEmitter<TEvents extends EventMap = Record<string, unknown[]>> {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In SpinEventEmitter.emit, replace `for (const handler of handlers)` with a snapshotted iteration: `const snapshot = handlers.slice(); for (const handler of snapshot) { handler(...args); }`. This prevents handlers added via on() during emission from being invoked in the same cycle and eliminates the risk of infinite loops. [L19]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
