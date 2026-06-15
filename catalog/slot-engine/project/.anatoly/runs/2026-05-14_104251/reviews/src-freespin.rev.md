# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all reels and cells, counts SCATTER symbols; no correctness issues.
- **Overengineering [LEAN]**: Minimal nested loop counting a single symbol type. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Used by engine.ts for scatter counting — missing tests for empty reels, single scatter, exactly 3, and mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes a scatter, why counting matters).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 free spins without consuming the current free spin, awarding one extra spin per retrigger vs. every other free-spin path.
- **Overengineering [LEAN]**: Three-branch conditional directly encodes the free-spin state machine. Straightforward mutation, no unnecessary indirection.
- **Tests [NONE]**: No test file exists. Four distinct branches (activation, re-trigger, decrement, deactivation) are all untested. Used by engine.ts in a critical game-logic path.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State mutation side-effects, threshold logic (>=3 scatters), spin award amount (10), and decrement/deactivation behavior are all undocumented. (deliberated: confirmed — Partially confirmed but the defect is in the caller, not the function. handleFreeSpins at freespin.ts:13-25 is a correct state machine — the retrigger branch (L17: `state.active && scatters >= 3` → `remaining += 10`) and decrement branch (L19-23) are logically sound. However, engine.ts:141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` every spin call. This makes the retrigger (L17) and decrement (L19) branches permanently unreachable from the only caller. The `totalWon` field (types.ts:21) is never written anywhere. The function itself is correct; the integration bug is in engine.ts not persisting state. Slightly lowered confidence because the fix location differs from the finding's target symbol.)

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. `handleFreeSpins` in particular has a non-obvious mutation side-effect on `state` that warrants a `@param` note. [L3-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino domain: the free-spin award count `10` is hardcoded twice in `handleFreeSpins` (initial grant L14 and retrigger L16). In regulated gambling engines, award quantities are paytable parameters subject to RTP audits and must be configurable constants, not inline literals. [L14-L16] |

### Suggestions

- Extract the magic free-spin count into a named constant so it is traceable to the paytable/configuration layer required for RTP compliance.
  ```typescript
  // Before
  state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const FREE_SPINS_AWARD = 10; // must match paytable config
  
  // ...
      state.remaining = FREE_SPINS_AWARD;
    } else if (state.active && scatters >= 3) {
      state.remaining += FREE_SPINS_AWARD;
  ```
- Add JSDoc to both public exports. `handleFreeSpins` especially needs a `@param` note documenting the in-place mutation contract.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Updates free-spin state in place based on scatter count.
   * Mutates `state.active` and `state.remaining` directly.
   * @param state - Mutable free-spin state to update.
   * @param scatters - Number of scatter symbols on the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (state.active && scatters >= 3), decrement remaining before adding the bonus: `state.remaining += 9` (equivalently: `state.remaining--; state.remaining += 10;`) so the current free spin is consumed consistently with the normal free-spin path. Retrigger should yield net +9 spins, not +10. [L17]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
