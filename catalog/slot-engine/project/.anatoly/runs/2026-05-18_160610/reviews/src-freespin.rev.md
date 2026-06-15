# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 86% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all reels and rows, counting every SCATTER symbol across the full grid.
- **Overengineering [LEAN]**: Nested loop counting SCATTER symbols across a 2D array — minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, reels with no SCATTER, single SCATTER, multiple SCATTERs across columns, non-SCATTER symbols mixed in.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., that SCATTERs are counted across the entire grid regardless of position).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 without consuming the triggering spin, yielding 21 free spins instead of the intended 20.
- **Overengineering [LEAN]**: Three-branch state machine (trigger, retrigger, decrement/deactivate) matches documented rules exactly, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, decrement logic, boundary at remaining=1 (deactivation), inactive state with scatters<3.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state machine logic (trigger, retrigger, decrement, deactivation) with side-effect mutations on state — behavior is not obvious from the signature alone. Trigger threshold, initial award count, and retrigger semantics all require documentation. (deliberated: reclassified: correction: NEEDS_FIX → OK — The retrigger branch (freespin.ts:18) does `state.remaining += 10`, which the automated review claims is an off-by-one (21 spins instead of 20). However, the project's internal documentation explicitly states 'Retrigger: +10 additional spins' — matching the code exactly. The claim that the triggering spin must be 'consumed' is a domain assumption not supported by any project spec. Additionally, this branch is unreachable at runtime: engine.ts:141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` on every call, so only the initial trigger branch (line 14) can ever fire. No observable defect.)

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly uses ReadonlyArray<ReadonlyArray<Symbol>>. handleFreeSpins mutates the FreeSpinState parameter in place rather than returning a new state object. Functional update pattern (return Readonly<FreeSpinState>) would be safer and composable. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. This file is not a test file, so JSDoc is required on public API surface. [L3-L24] |

### Suggestions

- Add JSDoc to both exported functions to document parameters, return values, and side effects.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across all reels and rows.
   * @param reels - Full grid snapshot (cols × rows).
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Prefer a functional update pattern for handleFreeSpins to avoid in-place mutation — more composable and easier to test in isolation.
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

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `state.remaining += 10` in the retrigger branch with `state.remaining += 9` (or `state.remaining--; state.remaining += 10`) so the triggering free spin is consumed while exactly 10 new spins are appended, yielding the documented 20 total spins (10 initial + 10 retrigger). [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
