# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all cells in the grid and counts SCATTER symbols, consistent with the documented grid-wide (not payline) counting rule.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, no scatters, single scatter, multiple scatters across columns, scatters in same column.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what counts as a scatter, the grid traversal logic, and the return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch (L16) adds 10 spins but never decrements `remaining` for the current free spin, awarding one extra spin beyond the documented +10.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state machine (trigger, retrigger, decrement). Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, countdown decrement, deactivation at 0, inactive state with <3 scatters.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious state machine logic (trigger threshold, initial award of 10, retrigger +10, decrement-to-deactivate) requires documentation. Parameters and side-effect mutation of state are undescribed. (deliberated: reclassified: correction: NEEDS_FIX → OK — Finding claims 'Retrigger branch (L16) adds 10 spins' but L16 is the initial trigger (`state.remaining = 10`), not the retrigger. The retrigger is L18 (`state.remaining += 10`). Both awarding 10 spins matches project docs: 'Award: 10 free spins per trigger / Retrigger: additional 10 free spins.' Additionally, engine.ts:141 creates a fresh FreeSpinState on every spin call, so the retrigger (L17-18) and decrement (L19-23) branches are unreachable in current usage — no behavioral defect exists.)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | handleFreeSpins mutates its FreeSpinState argument directly (state.active, state.remaining). Returning a new FreeSpinState would be safer and align with the immutable-input pattern already used in detectScatters. [L13-L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither detectScatters nor handleFreeSpins have JSDoc. Both are public exports with non-trivial semantics (scatter threshold, retrigger logic, decrement-on-each-spin) that consumers should not have to infer from implementation. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function and trivially testable. handleFreeSpins relies on external mutable state, requiring test setups to pre-configure FreeSpinState objects and assert post-call side effects. A signature returning a new FreeSpinState would yield pure, snapshot-testable behavior. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot/casino domain inferred from reels/SCATTER/FreeSpinState vocabulary. handleFreeSpins places no upper cap on free-spin accumulation via repeated retriggering (e.g., 1000 rapid retriggering events). Regulated gaming typically requires a declared maximum to constrain theoretical liability and satisfy compliance audits. The current model allows unbounded state.remaining growth. [L16-L18] |

### Suggestions

- Return a new FreeSpinState instead of mutating the argument. Improves testability, removes implicit aliasing risk, and aligns with the immutable-input convention used in detectScatters.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } ...
  }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    } else if (state.active && scatters >= 3) {
      return { ...state, remaining: state.remaining + 10 };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```
- Add JSDoc to both public exports, documenting the scatter threshold, retrigger behaviour, and decrement semantics.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across all reels and rows.
   * @param reels - Full grid snapshot (columns × rows).
   * @returns Total SCATTER symbol count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Cap free-spin accumulation for compliance in the regulated gaming domain.
  ```typescript
  // Before
  state.remaining += 10;
  // After
  const MAX_FREE_SPINS = 100; // declare at module scope
  state.remaining = Math.min(state.remaining + 10, MAX_FREE_SPINS);
  ```

## Actions

### Hygiene

- **[correction · low · trivial]** In the retrigger branch, decrement remaining by 1 after adding 10 (i.e. `state.remaining += 9`) so the current free spin is consumed and exactly 10 new spins are granted, matching the documented retrigger award. [L17]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
