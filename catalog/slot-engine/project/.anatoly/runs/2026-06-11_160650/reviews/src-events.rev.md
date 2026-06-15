# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Used as the type for handler parameters in on(), off(), and the listeners Map within SpinEventEmitter.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Valid variadic void function type alias; no correctness issues.
- **Overengineering [LEAN]**: Simple type alias; minimal and appropriate for the handler signature.
- **Tests [GOOD]**: Type alias with no runtime behavior — no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The variadic `unknown[]` signature is non-obvious; a brief note on expected usage (e.g. event payload forwarding) would clarify intent.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside the spin() function.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Standard pub/sub implementation is correct. `off` replaces the array via filter (non-mutating), so an `off` call inside an `emit` loop does not corrupt the iterator. `on` mutates the existing array in-place and redundantly re-sets it, but this is harmless and does not cause incorrect behavior. No correctness defects.
- **Overengineering [OVER]**: Reimplements Node.js's built-in `EventEmitter` (always available, no install needed). `on`/`off`/`emit` map 1-to-1 to the native API. Single importer (`engine.ts::spin`) reinforces the over-abstraction signal. Replace with `import { EventEmitter } from 'events'` or the browser-native `EventTarget`.
- **Tests [NONE]**: No test file exists. Methods on, off, and emit are untested — including edge cases like removing a non-existent handler, emitting with no listeners, multiple handlers for the same event, and handler deregistration mid-emit.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). All three methods are part of the public API consumed by `spin()` in src/engine.ts and lack parameter/return/behavior docs.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by src/engine.ts and used inside the spin() function as an event name.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple string constant; no correctness issues.
- **Overengineering [LEAN]**: Exporting a named event-name constant prevents typos at call sites; minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is consumed by the critical spin() function in engine.ts but its integration with SpinEventEmitter.emit is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. As a string constant used as an event name in `spin()`, a doc explaining when this event fires and what args are passed would be useful.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SPIN_DONE is declared without `as const`, so TypeScript infers type string instead of the literal "spin:done". Consumers lose the narrowed literal type for event-string comparisons. Additionally, `on` pushes into the retrieved array before re-setting it — use a spread to avoid aliasing the stored reference. [L1, L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter (class and its on/off/emit methods) and SPIN_DONE are exported with no JSDoc. At minimum the class and the constant should have a one-liner. [L2, L25] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit iterates handlers with no per-handler try-catch. A thrown exception from any handler aborts the loop silently, preventing remaining handlers from executing. In a regulated gaming context where spin-completion side-effects (payout ledger, audit log, jackpot state) may all be wired as separate listeners on SPIN_DONE, this creates a silent partial-update hazard. [L18-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from reel/spin/jackpot/scatter/paytable/freespin vocabulary across project structure. emit's lack of per-handler error isolation means a crash in one SPIN_DONE listener (e.g., payout logger) silently skips downstream listeners (e.g., jackpot state updater), which violates the integrity expectations of regulated gaming software. Each handler should be wrapped individually so one failure doesn't corrupt the rest of the dispatch chain. [L18-L24] |

### Suggestions

- Narrow SPIN_DONE to a literal type and prevent aliasing in `on`
  ```typescript
  // Before
  export const SPIN_DONE = "spin:done";
  
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }
  // After
  export const SPIN_DONE = "spin:done" as const;
  
  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) ?? [];
    this.listeners.set(event, [...handlers, handler]);
  }
  ```
- Isolate handler errors in emit so one failing handler does not abort the rest of the dispatch loop
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
      // emit on a dedicated error event so callers can observe without crashing the loop
      if (event !== "error") this.emit("error", err);
    }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
