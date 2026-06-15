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
- **Correction [OK]**: Correctly counts all SCATTER symbols across every cell of the grid, matching the documented contract.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. No coverage for scatter counting across reels, empty reels, zero scatters, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter semantics (grid dimensions, symbol type), and return value meaning.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions are implemented correctly: activate+set-10, retrigger+add-10, decrement+deactivate-at-zero. The `<= 0` guard is safe because remaining can only reach 0 (not a negative value) under normal 1-per-call decrement flow, and deactivation is atomic with the decrement.
- **Overengineering [LEAN]**: Flat if/else chain directly encoding the three documented state transitions. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. All branches untested: initial activation (scatters>=3), retrigger while active, decrement, and deactivation on remaining<=0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of the three state-transition branches, mutation side-effect on `state`, and parameter semantics for `scatters` threshold.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions `detectScatters` and `handleFreeSpins` lack JSDoc. Given the non-obvious mutation semantics of `handleFreeSpins` (in-place state transition), at minimum a `@param` and `@remarks` block would prevent misuse by callers. [L3-L24] |

### Suggestions

- Add JSDoc to both public exports to document the mutation semantics of `handleFreeSpins` and the grid traversal contract of `detectScatters`
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Applies one free-spin state transition in-place.
   * Activates (remaining=10) on first trigger (≥3 scatters while inactive),
   * adds 10 on retrigger (≥3 scatters while active),
   * or decrements and deactivates when remaining reaches 0.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
