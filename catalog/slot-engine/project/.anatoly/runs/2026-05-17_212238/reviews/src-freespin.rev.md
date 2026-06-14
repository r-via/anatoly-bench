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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid regardless of position, matching documented trigger logic.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. Minimal and correct for the task.
- **Tests [NONE]**: No test file exists. Used by engine.ts with no coverage for empty reels, mixed symbols, or all-scatter grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 to remaining without consuming the current free spin, granting one extra free spin per retrigger.
- **Overengineering [LEAN]**: Three-branch state machine maps directly to the documented trigger/retrigger/decrement logic. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being core free-spin business logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Trigger threshold (≥3), initial award (10 spins), retrigger logic, and decrement-to-deactivation behavior are all undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. engine.ts:141 creates a fresh FreeSpinState { active: false, remaining: 0, totalWon: 0 } on every spin call. Since active always starts false, the retrigger branch (freespin.ts:17-18) and decrement branch (freespin.ts:19-23) are unreachable in current usage. Additionally, not consuming the current spin during retrigger is standard slot game behavior. No behavioral defect.)

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc comments. Callers get no inline documentation on parameters or side-effect semantics. [L3-L22] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` mutates the caller's `state` object in-place rather than returning a new `FreeSpinState`. This requires callers to construct mutable state objects in tests and makes snapshot-style assertions impossible. A pure signature `(state: FreeSpinState, scatters: number): FreeSpinState` would improve testability and align with functional state-machine patterns. [L12-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling/casino domain inferred from vocabulary (SCATTER, FreeSpinState, free spins, slot reels). Regulated gaming code is expected to validate all inputs defensively. `handleFreeSpins` accepts `scatters: number` with no guard against negative values or NaN, and `state.remaining` could underflow to a large negative if called with an already-inactive state due to the decrement branch executing when `state.active` is truthy but no scatters. Add runtime guards for regulated auditability. [L12-L23] |

### Suggestions

- Add JSDoc to both exported functions
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols across all reels and rows.
   * @param reels - Full 5×3 grid of symbols.
   * @returns Total SCATTER count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Make handleFreeSpins a pure function for testability and auditability
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
- Add defensive guards for regulated gaming auditability
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!Number.isInteger(scatters) || scatters < 0) throw new RangeError(`scatters must be a non-negative integer, got ${scatters}`);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (state.active && scatters >= 3), consume the current free spin before adding the retrigger award: replace `state.remaining += 10` with `state.remaining += 9` (i.e., –1 for the current spin + 10 for the award), matching the documented '+10 additional spins' semantic. [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
