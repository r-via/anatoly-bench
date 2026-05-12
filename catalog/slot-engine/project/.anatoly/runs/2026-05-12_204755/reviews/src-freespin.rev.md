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
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels.
- **Overengineering [LEAN]**: Simple nested loop counting scatter symbols. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Used by engine.ts with no coverage for empty reels, all-scatter grids, mixed symbols, or zero-scatter cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Two independent logic defects: retrigger branch skips decrement, and remaining can go negative before deactivation.
- **Overengineering [LEAN]**: Straightforward state machine with three branches for free spin activation, re-trigger, and decrement. Minimal and appropriate for the logic.
- **Tests [NONE]**: No test file exists. Used by engine.ts with no coverage for any of the four branches: initial activation (scatters>=3), re-trigger while active, normal decrement, or deactivation at remaining<=0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State mutation side effects, threshold logic (>=3 scatters), and retrigger behavior (+10 spins) are non-obvious and undocumented. (deliberated: confirmed — Confirmed retrigger inconsistency at freespin.ts:17-18: when active && scatters >= 3, remaining += 10 without decrementing for the current spin, while the normal active branch (L19-20) does decrement. This asymmetry awards 11 effective spins on retrigger vs the intended 10. The negative-remaining claim (defect 2) is not reachable in normal flow: starting from remaining=10 and decrementing, it reaches 0 and deactivates cleanly at L21-22. Confidence lowered from 90→78 because engine.ts:141 creates a fresh FreeSpinState with active=false on every spin() call, making the retrigger branch unreachable in current usage — the defect is real in the function's contract but dormant.)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates `FreeSpinState` in place (`state.active = true`, `state.remaining--`). The `detectScatters` input is correctly `ReadonlyArray`, but `FreeSpinState` is not protected. A functional return of a new state object would be preferable. [L14-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Parameters and side-effects are not self-documenting to consumers. [L3-L14] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` mutates its argument rather than returning a new state, forcing callers to pre-construct mutable state objects for snapshot-style tests. `detectScatters` is a pure function and fully testable. [L14-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic numbers `3` (scatter trigger threshold) and `10` (free spins awarded) are inlined in game logic. Slot-machine domain paytable parameters must be configurable per jurisdiction and game variant — hardcoded values make RTP tuning and regulatory compliance harder. [L15-L23] |

### Suggestions

- Add JSDoc to both exported functions
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across all visible reel positions.
   * @param reels - 2D array of symbol columns
   * @returns Total SCATTER count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Replace in-place mutation with a returned new state object for immutability and testability
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    }
  }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    }
    // ...
    return state;
  }
  ```
- Extract magic numbers into named constants or a config parameter for paytable configurability
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPINS_AWARDED = 10;
  
  if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.active = true;
    state.remaining = FREE_SPINS_AWARDED;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (active && scatters >= 3), also decrement remaining by 1 before adding 10, so the spin that caused the retrigger is consumed: state.remaining = state.remaining - 1 + 10. [L17]

### Hygiene

- **[correction · low · trivial]** Restructure the decrement block to check and deactivate before decrementing, or use `<= 1` as the threshold, to prevent remaining from going transiently negative and to handle the edge case where remaining is already 0 on entry. [L19]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
