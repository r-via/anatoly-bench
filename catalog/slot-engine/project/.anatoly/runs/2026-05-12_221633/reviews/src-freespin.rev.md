# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 60% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across every reel position.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER occurrences. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, single scatter, exactly 3, mixed symbols, nested empty columns.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes a scatter count).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch (L17–18) adds 10 free spins without consuming the current free spin, while the normal active branch (L20) always decrements; a retrigger grants 10 extra spins instead of 9.
- **Overengineering [LEAN]**: Three-branch state machine directly encodes the free-spin activation, re-trigger, and countdown logic. Straightforward mutation with no unnecessary patterns.
- **Tests [NONE]**: No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger while active, decrement, expiry (remaining<=0), inactive state with <3 scatters.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State mutation side-effects, trigger threshold (>=3 scatters), spin award amount (10), and decrement-on-spin behavior are all undocumented. (deliberated: confirmed — Partially confirmed. src/freespin.ts L17-18: retrigger branch (`state.active && scatters >= 3`) adds 10 free spins via `state.remaining += 10` but does not decrement for the current spin, unlike the non-retrigger branch at L20 which does `state.remaining--`. This inconsistency gives the player an extra free spin on retrigger (effectively 11 instead of 10). However, severity is lower than claimed: in the sole call site (src/engine.ts:141-142), `freeSpinState` is initialized with `active: false` every spin, making the retrigger branch (which requires `state.active === true`) unreachable in the current integration. The bug exists in the function's logic but has no runtime impact given current usage. Lowered confidence to 60.)

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates its `state` argument in place. The parameter could be typed as `Readonly<FreeSpinState>` with the function returning a new state, or the mutation intent should at least be explicit in the type (e.g., a `Mutable<FreeSpinState>` alias). `detectScatters` correctly uses `ReadonlyArray<ReadonlyArray<Symbol>>`. [L14-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both `detectScatters` and `handleFreeSpins` are exported without any JSDoc. At minimum, `@param` and `@returns` annotations are needed. [L3-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: magic numbers `3` (scatter threshold) and `10` (free-spin award/retrigger count) are embedded directly in business logic with no named constants. In regulated gaming, every configurable game rule must be traceable to a named, auditable constant — inline literals make compliance review harder. [L15-L22] |

### Suggestions

- Extract magic game-rule constants to named, auditable values
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  }
  // After
  const SCATTER_THRESHOLD = 3;
  const FREE_SPIN_AWARD = 10;
  
  if (!state.active && scatters >= SCATTER_THRESHOLD) {
    state.active = true;
    state.remaining = FREE_SPIN_AWARD;
  } else if (state.active && scatters >= SCATTER_THRESHOLD) {
    state.remaining += FREE_SPIN_AWARD;
  }
  ```
- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across all reel columns.
   * @param reels - 2-D grid of symbols (columns × rows).
   * @returns Total number of SCATTER symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Consider an immutable state-transition signature instead of in-place mutation
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {`

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (`state.active && scatters >= 3`), decrement `state.remaining` by 1 after adding 10 (i.e., `state.remaining += 9` or `state.remaining += 10; state.remaining--;`) to correctly consume the current free spin, consistent with Branch 3 behaviour and the 95% RTP target. [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
