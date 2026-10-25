# Review: `src/events.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| EventHandler | type | no | OK | LEAN | USED | UNIQUE | - | 90% |
| SpinEventEmitter | class | yes | OK | OVER | USED | UNIQUE | - | 88% |
| SPIN_DONE | constant | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `EventHandler` (L1–L1)

- **Utility [USED]**: Referenced in-file by SpinEventEmitter (which is imported by other files)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Simple function type alias; no correctness issues.
- **Overengineering [LEAN]**: Simple type alias for a callback signature. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `SpinEventEmitter` (L3–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: on/off/emit are all correct. off uses filter (new array) so emit iterates a stable snapshot when a handler removes itself. No concrete call site shows re-entrant on() during emit for the same event, so the mutation-during-iteration edge case is hypothetical caller misuse per precision guard 1.
- **Overengineering [OVER]**: Reimplements Node.js built-in EventEmitter (on/off/emit over a Map<string, handler[]>) with zero additional behavior. Has exactly 1 importer (src/engine.ts::spin). Node's native `require('events').EventEmitter` or `import { EventEmitter } from 'events'` provides this identically with no install cost. NIH on a stdlib symbol for a single consumer.
- **Tests [-]**: *(not evaluated)*

#### `SPIN_DONE` (L27–L27)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: String constant; no correctness issues.
- **Overengineering [LEAN]**: Exported string constant for an event name. Prevents magic strings at call sites — minimal and correct.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | listeners is never reassigned after initialization; private readonly listeners would prevent accidental reassignment. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinEventEmitter has no class-level JSDoc, and on/off/emit lack parameter and return documentation. SPIN_DONE has no JSDoc explaining its semantic contract. [L3-L25] |
| 17 | Context-adapted rules | WARN | MEDIUM | Event names are bare strings with no type constraint. A typed event map would catch mistyped event names at compile time — important for a regulated slot engine where missed or misspelled events (e.g. spin:done) silently drop payouts or free-spin notifications. [L3-L25] |

### Suggestions

- Add readonly to listeners to prevent accidental field reassignment
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Type-safe event map instead of bare string keys, eliminating silent misspelled-event bugs
  ```typescript
  // Before
  export class SpinEventEmitter {
    on(event: string, handler: EventHandler): void { ... }
    emit(event: string, ...args: unknown[]): void { ... }
  }
  // After
  type SpinEventMap = {
    [SPIN_DONE]: [result: SpinResult];
  };
  export class SpinEventEmitter<T extends Record<string, unknown[]> = SpinEventMap> {
    on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void { ... }
    emit<K extends keyof T>(event: K, ...args: T[K]): void { ... }
  }
  ```
- Add JSDoc to SpinEventEmitter class and its public methods
  ```typescript
  // Before
  export class SpinEventEmitter {
  // After
  /**
   * Lightweight event emitter for slot-engine lifecycle events.
   * Consumers attach handlers with {@link on} and detach with {@link off}.
   */
  export class SpinEventEmitter {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
