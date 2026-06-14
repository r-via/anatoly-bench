# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | GOOD | 60% |
| SpinEventEmitter | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 80% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Type definition used in class properties (line 4) and method parameters (lines 6, 12)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void callback.
- **Overengineering [LEAN]**: Simple type alias scoped to this file; appropriate for typing handler arrays.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name and signature are clear, but the type alias has no doc explaining its role as the listener callback shape for SpinEventEmitter.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct: handlers are stored per event, filtered on removal, and iterated on emit. No mutation-during-iteration hazard since filter returns a new array before emit reads it.
- **Overengineering [ACCEPTABLE]**: Reference docs confirm this is intentional design ('lightweight event bus'). However, the per-spin create-emit-discard lifecycle documented in `.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md` renders `on`/`off` inaccessible without forking `engine.ts`, making the full pub/sub API largely theoretical. The class also reimplements Node.js's built-in `EventEmitter` (not an installed dep, so not a hard NIH violation). With only 1 runtime importer and a single emitted event (`SPIN_DONE`), a plain callback passed into `spin()` would be simpler — but the documented architectural choice keeps this out of OVER territory.
- **Tests [NONE]**: No test file exists. Critical methods on()/off()/emit() are untested — including edge cases like emitting with no listeners, removing a handler mid-loop, multiple handlers for the same event, and duplicate handler removal. Used by src/engine.ts in production paths.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial lifecycle semantics (per-spin instantiation, listener management) warrants at minimum class-level and method-level docs.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant with 1 runtime importer in src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Value "spin:done" matches the documented constant exactly.
- **Overengineering [LEAN]**: Named string constant preventing magic-string duplication. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is a string sentinel used by src/engine.ts; no tests verify it is emitted at the correct lifecycle point.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. As a public event-name constant, it should document what triggers this event and what arguments are passed to handlers.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned; should be readonly. SPIN_DONE lacks as const, so its type is widened to string instead of the literal "spin:done". [L4, L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter (class and all three public methods) and SPIN_DONE have no JSDoc. Both are public exports. [L3, L27] |
| 12 | Async/Promises/Error handling | WARN | HIGH | emit() iterates handlers with no try-catch. A throwing handler aborts the loop, silently skipping all subsequent handlers. Per internal docs, external code attaches handlers via sharedEmitter.on(), making the blast radius unpredictable. [L18-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | EventHandler typed as (...args: unknown[]) => void forces consumers to cast (result as SpinResult), as shown explicitly in .anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md. A generic-typed emitter would give type-safe subscriptions and eliminate the unsafe cast at call sites. [L1] |

### Suggestions

- Mark listeners readonly — the Map reference is never replaced, only mutated
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Narrow SPIN_DONE to the literal type via as const
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate handler errors in emit so one throwing handler does not skip the rest
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
      console.error(`[SpinEventEmitter] handler error on "${event}":`, err);
    }
  }
  ```
- Use a generic typed emitter to remove the need for as SpinResult casts at call sites
  ```typescript
  // Before
  type EventHandler = (...args: unknown[]) => void;
  export class SpinEventEmitter { ... }
  // After
  type EventMap = Record<string, unknown[]>;
  export class SpinEventEmitter<T extends EventMap = Record<string, unknown[]>> {
    private readonly listeners: Map<keyof T, Array<(...args: unknown[]) => void>> = new Map();
    on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void { ... }
    off<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void { ... }
    emit<K extends keyof T>(event: K, ...args: T[K]): void { ... }
  }
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Lightweight synchronous event bus used by the slot engine to signal spin lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
