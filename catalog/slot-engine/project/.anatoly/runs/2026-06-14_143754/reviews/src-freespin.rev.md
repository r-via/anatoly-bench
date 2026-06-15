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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid via nested iteration; matches the documented behavior.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Minimal and appropriate for its purpose.
- **Tests [NONE]**: No test file exists. Critical path: called by spin() in engine.ts on every spin. Missing tests for zero scatters, exactly 3 scatters, mixed reels, and empty reels.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics, and return value meaning.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-transition branches (trigger, retrigger, decrement/deactivate) match the arbitrated reference doc table exactly. The `<= 0` guard is defensive and harmless.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), re-trigger (scatters>=3, active), decrement with remaining>1, and deactivation on remaining<=0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious state machine logic (activate, retrigger, decrement/deactivate) with side-effect mutation of state warrants documentation of all three transition branches, parameters, and the void return.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | The local import `Symbol` from `./types.js` shadows the TypeScript built-in `Symbol` interface in type space. `no-shadow` or `@typescript-eslint/no-shadow` would flag this. Since it is `import type`, there is no runtime risk, but IDE autocompletion and type-checking tools may surface confusion. [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. The state-transition table for `handleFreeSpins` exists in docs but not adjacent to the function, which hurts discoverability. [L3-L22] |

### Suggestions

- Add JSDoc to both public exports so consumers get inline documentation without consulting external docs.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (all columns, all rows).
   * @param reels - 5×3 grid as a readonly 2-D array.
   * @returns Total scatter count for this spin.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Rename the imported `Symbol` type to avoid shadowing the built-in `Symbol` interface.
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, Symbol as GameSymbol } from "./types.js";`

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
