# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts SCATTER symbols across the full grid; matches documented behavior.
- **Overengineering [LEAN]**: Flat double loop over a 2D array counting a specific symbol. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Used by engine.ts with no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public function with no description, no @param for `reels`, no @returns explaining the count semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions (activate, retrigger, decrement/deactivate) are implemented correctly. The `<= 0` guard on deactivation is safely defensive and cannot produce wrong results given normal decrement-by-one paths.
- **Overengineering [LEAN]**: Three mutually exclusive state transitions implemented as a straightforward if/else chain. Matches the documented state table exactly with no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) entirely untested despite being called by engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public function with non-trivial state-machine logic (activation threshold, retrigger, decrement-to-deactivate). Neither parameter is described, mutation side-effect is undocumented, and the `scatters >= 3` threshold and `remaining = 10` magic numbers are unexplained.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `detectScatters` and `handleFreeSpins` are exported but have no JSDoc. Given the non-obvious side-effect contract of `handleFreeSpins` (mutates in place, triggers on `remaining <= 0`, not just `=== 0`), a doc comment is especially valuable here. [L3-L24] |

### Suggestions

- Add JSDoc to both public exports. `handleFreeSpins` especially benefits from documenting the mutation-in-place contract and the `remaining <= 0` deactivation boundary.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Advances the free-spin state machine for one spin result.
   * Mutates `state` in place. Activates on ≥3 SCATTERs, retriggering adds 10;
   * decrements `remaining` each spin below threshold and deactivates at 0.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Add JSDoc to `detectScatters` to document the full-grid (not payline-confined) counting behaviour.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (all columns, all rows).
   * Result is independent of configured paylines.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
