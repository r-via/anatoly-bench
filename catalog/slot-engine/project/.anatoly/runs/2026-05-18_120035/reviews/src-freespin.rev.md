# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 78% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across the entire grid as documented.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Missing tests for: zero scatters, single scatter, exactly 3 scatters, scatters across multiple reels, non-scatter symbols mixed in.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. that it counts all SCATTER symbols across the entire grid regardless of position).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 spins but fails to consume the current free spin, awarding one extra spin per retrigger.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding trigger/retrigger/decrement logic. Complexity matches the documented state transitions exactly.
- **Tests [NONE]**: No test file exists. Missing tests for all four branches: initial activation (scatters>=3, inactive), retrigger (scatters>=3, active), decrement (active, no scatter), deactivation at remaining<=0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state-machine logic (trigger, retrigger, decrement, deactivation) with side effects on the state argument — all require documentation. Missing param descriptions, trigger threshold, award amounts, and mutation semantics. (deliberated: confirmed — Confirmed two issues: (1) Retrigger branch at freespin.ts:18 (`state.remaining += 10`) does not decrement the current spin, giving the player an off-by-one extra spin on retrigger. (2) More critically, engine.ts:141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` on every spin call, making the retrigger branch (line 17: `state.active && scatters >= 3`) and the decrement branch (line 19-23) permanently unreachable — state is never persisted. The non-decrement on retrigger is a valid concern but its behavioral impact is masked by the fresh-state pattern. Lowered confidence slightly because the off-by-one could be intentional design (retrigger spin is 'free').)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates `state.active` and `state.remaining` in place. The parameter should be `Readonly<FreeSpinState>` and the function should return a new state object. [L13-L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `detectScatters` and `handleFreeSpins` are exported public API with no JSDoc. Non-obvious parameters (scatter threshold semantics, state mutation contract) warrant documentation. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is a pure function (ideal). `handleFreeSpins` mutates its argument, forcing tests to construct pre-state, call the function, then inspect post-call side effects rather than asserting a return value. A pure state-transition signature would improve testability. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from FreeSpinState/SCATTER/detectScatters/handleFreeSpins vocabulary. Regulated gaming requires auditable state transitions; in-place mutation makes before/after state logging and replay difficult. Immutable state transitions (returning Readonly<FreeSpinState>) are the industry-standard pattern for certifiable game logic. [L13-L24] |

### Suggestions

- Add JSDoc to both exported functions
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid (not payline-restricted).
   * @param reels - 2-D array of symbols (columns × rows)
   * @returns Total SCATTER count; ≥ 3 triggers a free-spin award
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Return new state instead of mutating — supports audit trails and pure-function testing
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
    } else if (state.active) {
      state.remaining--;
      if (state.remaining <= 0) {
        state.active = false;
      }
    }
  }
  // After
  export function handleFreeSpins(
    state: Readonly<FreeSpinState>,
    scatters: number
  ): Readonly<FreeSpinState> {
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    }
    if (state.active && scatters >= 3) {
      return { ...state, remaining: state.remaining + 10 };
    }
    if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (active && scatters >= 3), decrement `remaining` by 1 in addition to adding 10, so the current free spin is consumed: `state.remaining += 9` (or equivalently `state.remaining += 10; state.remaining--`). This matches the behaviour of branch 3 where every active free spin consumes one from `remaining`. [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
