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
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels, matching the documented grid-wide (not payline-confined) counting behavior.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts with no test coverage for scatter counting across reels, empty input, or zero-scatter grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three branches exactly match the arbitrated state-transition table: activation at 10, retrigger +10, decrement-and-deactivate-at-zero.
- **Overengineering [LEAN]**: Three-branch state machine directly matching the documented transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. State machine with 3 branches (activate, retrigger, decrement/deactivate) is entirely untested despite being called by core engine logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Three distinct state-transition branches (activate, retrigger, decrement/deactivate) are non-obvious and warrant documented @param and @returns (void with mutation side-effect).

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions lack JSDoc. handleFreeSpins has non-obvious void-mutation semantics, retrigger behavior, and a deactivation edge case — all need documentation for public API consumers. [L3,L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated gaming domain inferred from reel/scatter/jackpot/freespin vocabulary across the project. handleFreeSpins has no upper-bound cap on state.remaining — retriggers accumulate unbounded free spins, which violates most jurisdictional certification requirements (e.g. UKGC, MGA, GLI-11). Void-mutation return also prevents immutable audit-trail snapshots, a common compliance need in regulated gaming. [L14-L22] |

### Suggestions

- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (all positions, not paylines only).
   * @param reels - 5×3 grid of symbols (columns × rows)
   * @returns Total scatter symbol count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to handleFreeSpins describing retrigger and deactivation semantics
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates FreeSpinState in place.
   * - Not active + ≥3 scatters → activates, sets remaining = 10
   * - Active + ≥3 scatters → adds 10 to remaining (retrigger)
   * - Active + <3 scatters → decrements remaining; deactivates when it reaches 0
   * @param state - Mutable free spin session state
   * @param scatters - Value from detectScatters for the current spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Cap retrigger accumulation for regulated-gaming compliance
  ```typescript
  // Before
  } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const MAX_FREE_SPINS_REMAINING = 100; // jurisdictional cap (GLI-11 / operator rule)
  
  } else if (state.active && scatters >= 3) {
      state.remaining = Math.min(state.remaining + 10, MAX_FREE_SPINS_REMAINING);
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
