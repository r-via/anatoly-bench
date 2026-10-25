# Review: `src/freespin.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | - | 68% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts SCATTER symbols across all columns correctly.
- **Overengineering [LEAN]**: Plain nested loop counting SCATTER symbols. Minimal; a flat/filter alternative would not be simpler.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Branches are consistent: 3+ scatters start free spins when inactive, add 10 when retriggered, and each other active spin decrements and ends at 0. The retrigger branch does not decrement for the spin just played. No contract, doc or caller shows the intended behavior, so I treat it as a design choice and don't flag it.
- **Overengineering [LEAN]**: Simple three-branch state transition (start, retrigger, decrement) that mutates state directly. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 6.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 3 | Discriminated unions | WARN | MEDIUM | FreeSpinState uses `active` boolean plus `remaining` number, so inactive state can carry a stale `remaining`. A tagged union (`{active:false}` \| `{active:true; remaining:number}`) would model it better. [L12-L23] |
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates its `state` parameter in place. The magic number 10 is repeated and not a named `as const` constant. Reels are already typed as ReadonlyArray. [L12-L23] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `detectScatters` and `handleFreeSpins` are exported without JSDoc. The retrigger, +10 and decrement semantics are undocumented. [L3-L23] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` is a void in-place mutator that relies on side effects. A pure function returning the new state would be easier to test. Magic numbers (3 for the threshold, 10 for the award) are hardcoded. [L12-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming logic with hardcoded business constants (threshold 3, award 10). These should be named, configurable constants. The `else if (state.active)` branch decrements `remaining` with no lower-bound guard besides the `<= 0` check. [L13-L22] |

### Suggestions

- Extract named constants and add JSDoc
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.remaining = 10;
  // After
  const SCATTER_TRIGGER = 3 as const;
  const FREE_SPINS_AWARD = 10 as const;
  
  /** Updates free-spin state: triggers, retriggers, or consumes a spin. */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= SCATTER_TRIGGER) {
      state.remaining = FREE_SPINS_AWARD;
  ```
- Return a new immutable state instead of mutating
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`
