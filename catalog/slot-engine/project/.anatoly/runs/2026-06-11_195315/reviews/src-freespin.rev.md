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
- **Correction [OK]**: Correctly counts all SCATTER symbols across every cell of the grid, matching the documented full-grid (not payline-confined) counting requirement.
- **Overengineering [LEAN]**: Flat double-loop counting SCATTER occurrences across a 2D grid. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Used in critical spin path; needs coverage for 0 scatters, exactly 3, mixed reel layouts, and nested symbol iteration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics (2D reel grid), and return value meaning.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-transition branches match the arbitrated contract exactly: initial activation sets remaining=10; retrigger adds 10 without decrement; active+no-retrigger decrements and deactivates at 0.
- **Overengineering [LEAN]**: Three-branch state machine exactly matching the documented transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are all untested. State mutation side-effects and boundary at remaining<=0 are unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The three-branch state machine logic (activation, retrigger, decrement/deactivation) is non-obvious and critical public API behavior that warrants documentation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | import type { Symbol } shadows the built-in TypeScript/JS Symbol global. As a type-only import there is no runtime collision, but ESLint no-shadow may flag it depending on project config. Consider renaming: import type { Symbol as SlotSymbol } from './types.js'. |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions detectScatters and handleFreeSpins lack JSDoc. This is a library module with external consumers (engine.ts) and documented in project specs — public-facing exports should have JSDoc. [L3-L23] |

### Suggestions

- Add JSDoc to both public exports to document parameters, return values, and side effects.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid.
   * @param reels - 5×3 reel grid (column-major)
   * @returns Total number of SCATTER symbols visible
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to handleFreeSpins documenting the state mutation contract.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates FreeSpinState in place based on scatter count.
   * Activates free spins on ≥3 scatters, adds 10 on retrigger,
   * or decrements remaining and deactivates when exhausted.
   * @param state - Persistent free spin state object (mutated in place)
   * @param scatters - Number of SCATTER symbols from the current spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Rename the Symbol import to avoid shadowing the built-in Symbol global.
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, Symbol as SlotSymbol } from "./types.js";`
- Extract the magic number 10 into a named constant to avoid duplication and improve readability.
  ```typescript
  // Before
  state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const FREE_SPINS_AWARD = 10 as const;
  // ...
  state.remaining = FREE_SPINS_AWARD;
    } else if (state.active && scatters >= 3) {
      state.remaining += FREE_SPINS_AWARD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
