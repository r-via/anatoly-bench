# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 65% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full reel grid.
- **Overengineering [LEAN]**: Simple nested loop count of SCATTER symbols. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Used by engine.ts for core scatter detection; no coverage of empty reels, single scatter, exactly 3 scatters, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose is inferrable from name, but return value semantics (total count across all reels/symbols) and parameter shape are undocumented.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Re-trigger branch adds 10 spins without consuming the current free spin, granting one extra spin per re-trigger.
- **Overengineering [LEAN]**: Three mutually exclusive branches covering activate, retrigger, and decrement logic. Flat conditionals are appropriate for this state machine; no abstraction needed.
- **Tests [NONE]**: No test file exists. All four branches (activate, retrigger, decrement, deactivate at 0) are untested. State mutation behavior and boundary at remaining<=0 are uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state machine logic: activation threshold (>=3 scatters), retrigger behavior (+10 spins), and decrement-to-deactivate path are all undocumented. (deliberated: confirmed — Off-by-one confirmed in isolation: freespin.ts:17-18 re-trigger branch adds 10 spins via `remaining += 10` but does not decrement for the current spin (decrement only in the else branch at L20). This grants one extra spin per re-trigger. However, in the only call site (engine.ts:141-142), FreeSpinState is created fresh with `active: false` on every spin() call, making the re-trigger branch (L17: `state.active && scatters >= 3`) unreachable. The bug exists in the function's contract but has zero runtime impact in current usage. Lowering confidence to 65.)

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly uses ReadonlyArray. handleFreeSpins takes FreeSpinState and mutates it in place (state.active, state.remaining). The parameter is not typed as Readonly<FreeSpinState>, and no return value documents the mutation contract. A pure-function pattern returning a new FreeSpinState would be safer and more testable. [L13-L24] |
| 8 | ESLint compliance | WARN | HIGH | Magic literals 3 (scatter threshold) and 10 (free spins awarded) appear inline. These would trip no-magic-numbers. state.remaining-- would trip no-plusplus. Both are common ESLint rules in casino codebases. [L14,L16,L21] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither detectScatters nor handleFreeSpins has JSDoc. Both are public API entry points that warrant at least a @param/@returns block. [L3,L13] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function — easy to test. handleFreeSpins mutates its argument, requiring callers to construct and inspect a mutable FreeSpinState object rather than asserting on a return value. A pure signature (state: Readonly<FreeSpinState>): FreeSpinState would eliminate this coupling. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine domain inferred from freespin/scatter/free-spins vocabulary and README RTP statement. Regulated gambling requires auditable, configuration-driven game parameters. Scatter threshold (3) and free-spin award count (10) are hardcoded literals rather than sourced from a certified, inspectable config object. This undermines auditability required for regulatory compliance. [L14,L16] |

### Suggestions

- Extract magic numbers into named, exported constants for ESLint compliance and regulatory auditability.
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    }
  // After
  const SCATTER_THRESHOLD = 3 as const;
  const FREE_SPINS_AWARDED = 10 as const;
  
  if (!state.active && scatters >= SCATTER_THRESHOLD) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARDED;
    }
  ```
- Convert handleFreeSpins to a pure function to improve testability and make mutation explicit to callers.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    ...
    state.active = true;
  }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= SCATTER_THRESHOLD) {
      return { ...state, active: true, remaining: FREE_SPINS_AWARDED };
    }
    // ...
  }
  ```
- Add JSDoc to both public exports.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols visible across all reels.
   * @param reels - 2D array of symbols (reel × row).
   * @returns Total scatter count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Replace state.remaining-- with explicit subtraction to avoid no-plusplus lint violations.
  - Before: `state.remaining--;`
  - After: `state.remaining -= 1;`

## Actions

### Quick Wins

- **[correction · medium · small]** In the re-trigger branch (active && scatters >= 3), decrement `state.remaining` before adding 10 so the current free spin is consumed: `state.remaining--; state.remaining += 10;` [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
