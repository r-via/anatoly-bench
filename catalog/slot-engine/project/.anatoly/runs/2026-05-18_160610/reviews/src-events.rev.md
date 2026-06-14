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

- **Utility [USED]**: Used as type annotation in SpinEventEmitter methods and Map value type
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Type alias is correct for a variadic void callback.
- **Overengineering [LEAN]**: Minimal type alias for a variadic callback. No unnecessary generics or indirection.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name and signature are reasonably self-descriptive, but the variadic unknown[] parameter contract is not explained.

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Exported class runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit logic is correct; off correctly filters by reference identity; emit iterates a snapshot-free list but that is acceptable for this synchronous single-threaded use case.
- **Overengineering [ACCEPTABLE]**: Hand-rolled event bus reimplements Node.js EventEmitter basics. Browser portability makes NIH acceptable. The class is genuinely minimal (22 lines, 3 methods). Two mild over-generalizations: (1) Map keyed by arbitrary string supports N events, but only SPIN_DONE ever exists; (2) off() is vestigial — docs state each spin() creates and discards a fresh emitter, so listeners never need removal in the primary usage path. Neither justifies OVER on its own given the injected-shared-emitter extension path the docs describe.
- **Tests [NONE]**: No test file exists. Core event emitter used by engine.ts has zero coverage: on/off/emit methods, multi-listener dispatch, handler deduplication, and unknown-event handling are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or any of its public methods (on, off, emit). Lifecycle, thread-safety assumptions, and event name conventions are undocumented.

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Exported constant runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Value matches documented constant "spin:done" exactly.
- **Overengineering [LEAN]**: Named constant eliminates magic string. Single line, no abstraction overhead.
- **Tests [NONE]**: No test file exists. Constant imported by engine.ts as a key event signal; its correct usage in emit/on calls is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The string value 'spin:done' and what payload is emitted with this event are not documented inline.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `listeners` field reference is never reassigned — should be `private readonly listeners`. `SPIN_DONE` is `const` but typed as `string` instead of the literal `"spin:done"` — add `as const`. [L4, L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `SpinEventEmitter` nor `SPIN_DONE` has JSDoc. Both are public exports consumers depend on. [L3, L26] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `emit` calls each handler bare inside a `for...of` loop. A synchronous throw in any handler halts all subsequent handlers for that event. Wrap handler invocations in try-catch to isolate failures. [L19-L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SPIN_DONE` is inferred as `string` instead of the literal `"spin:done"`. `as const` (or `satisfies`) would give callers precise literal-type checking at zero runtime cost. [L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event keys are bare `string`; a union type (e.g. `type EventName = "spin:done"`) would let TypeScript enforce valid event names at call sites. Combined with the unguarded handler loop (rule 12), consumer handlers crashing silently would be hard to diagnose in a slot-engine production run. [L1, L6, L12, L18] |

### Suggestions

- Mark `listeners` as `readonly` — its reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Use `as const` on `SPIN_DONE` to narrow its type to `"spin:done"` instead of `string`, enabling literal-type enforcement at call sites.
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `export const SPIN_DONE = "spin:done" as const;`
- Isolate handler errors in `emit` so one failing handler does not block the rest.
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
      console.error(`SpinEventEmitter: handler error on "${event}"`, err);
    }
  }
  ```
- Introduce a typed event-name union so the compiler rejects unknown event strings.
  ```typescript
  // Before
  on(event: string, handler: EventHandler): void
  // After
  type EmitterEvent = typeof SPIN_DONE;
  on(event: EmitterEvent, handler: EventHandler): void
  ```
- Add JSDoc to both public exports.
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /** Lightweight synchronous event bus used by the slot engine to broadcast spin lifecycle events. */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
