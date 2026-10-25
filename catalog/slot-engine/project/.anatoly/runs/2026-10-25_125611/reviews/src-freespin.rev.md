# Review: `src/freespin.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | - | 72% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts SCATTER symbols across all columns correctly.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: The state transitions are consistent: trigger sets remaining to 10, retrigger adds 10, and a plain free spin decrements remaining and deactivates at 0 or below. The retrigger branch does not decrement for the free spin just played. No documented contract says whether it should, so this is not flagged.
- **Overengineering [LEAN]**: Straightforward three-branch state transition for free spins. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 3 | Discriminated unions | WARN | MEDIUM | `FreeSpinState` uses `active` plus `remaining` flags. A tagged union (`{status:'idle'} \| {status:'active', remaining:number}`) would rule out invalid states. [L9-L19] |
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates its `state` parameter in place. It should return a new readonly state. The reel input is already `ReadonlyArray`. [L9-L19] |
| 8 | ESLint compliance | WARN | HIGH | The `Symbol` type import shadows the global `Symbol` (`no-shadow` / `no-redeclare` builtin globals). The magic numbers 3 and 10 trip `no-magic-numbers`. [L1, L10-L16] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `detectScatters` and `handleFreeSpins` have no JSDoc. The free-spin trigger and retrigger rules are undocumented. [L3, L12] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is pure. `handleFreeSpins` returns void and mutates its input, so tests must inspect the mutated object. The hardcoded threshold (3) and award (10) cannot be configured. [L12-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | The magic numbers should be named constants such as `SCATTER_TRIGGER = 3` and `FREE_SPINS_AWARD = 10`. The `Symbol` type name also shadows the global. [L10-L16] |

### Suggestions

- Extract magic numbers into named constants and add JSDoc
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  /** Starts or retriggers free spins on 3+ scatters; otherwise consumes one spin. */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= SCATTER_TRIGGER) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
  ```
- Rename the `Symbol` type to avoid shadowing the global
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, ReelSymbol } from "./types.js";`
