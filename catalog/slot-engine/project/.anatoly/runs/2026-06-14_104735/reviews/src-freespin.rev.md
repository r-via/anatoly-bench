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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid, matching the documented 5×3 whole-grid scan.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical path: called by spin() in engine.ts to trigger free spin awards. No coverage of zero scatters, partial counts, or full-grid scatter scenarios.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Public exported function with a non-trivial parameter type (2D readonly array) and a meaningful return value (scatter count) that warrants at least a brief description.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state transitions match the arbitrated intent table exactly: initial activation sets remaining=10, retrigger adds 10 without consuming a spin, and normal active spin decrements then deactivates at ≤0.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches untested: initial activation (scatters>=3 while inactive), retrigger (scatters>=3 while active), decrement, and deactivation (remaining<=0). All are critical game-logic paths called by spin().
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Public exported function with complex state-machine logic (activate, retrigger, decrement/deactivate) that is non-obvious from the signature alone. Missing description of all three transition branches, the mutation side-effect, and the void return.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | `import type { Symbol }` shadows the built-in TypeScript global `Symbol` in this file's type scope. While harmless at runtime (type-only import), TypeScript-aware ESLint configs with `@typescript-eslint/no-shadow` will flag this. The fix belongs in types.ts (rename to e.g. `SlotSymbol`) but the import here propagates the risk. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Their contracts — including the scatter-count threshold, state mutation semantics, and retrigger behaviour — are non-trivial and would benefit from inline documentation for API consumers. [L3-L22] |

### Suggestions

- Add JSDoc to both public exports documenting parameters, return value, and mutation semantics
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (all positions, not paylines).
   * @param reels - 5×3 grid of symbols
   * @returns Total SCATTER count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to handleFreeSpins documenting mutation contract and retrigger behaviour
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place to advance the free-spin lifecycle.
   * - Not active + ≥3 scatters → activates, sets remaining = 10
   * - Active + ≥3 scatters → retrigger, adds 10 to remaining
   * - Active + <3 scatters → decrements remaining; deactivates at 0
   * @param state - Persistent free-spin state (mutated in place)
   * @param scatters - Scatter count from the current spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Rename `Symbol` in types.ts to avoid shadowing the built-in TypeScript global
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, SlotSymbol as Symbol } from "./types.js";`

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
