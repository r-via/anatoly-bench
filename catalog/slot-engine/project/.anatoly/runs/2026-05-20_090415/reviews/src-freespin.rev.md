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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid via nested iteration, matching the documented 5×3 grid-wide scatter detection.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal and appropriate for its purpose.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but zero test coverage for scatter counting logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal behavior, and the return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three branches match the arbitrated spec table exactly: initial trigger sets remaining=10, retrigger adds 10, active with <3 scatters decrements and deactivates at ≤0.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding the documented transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The state-transition logic (activate on ≥3 scatters, retrigger adds 10, decrement and deactivate) is non-trivial and entirely undocumented. Missing @param descriptions and mutation side-effect notice.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. As public API surface, parameter semantics and the intentional mutation contract of `handleFreeSpins` should be documented. [L3, L13] |

### Suggestions

- Add JSDoc to both public exports to document parameters and the intentional mutation contract.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Advances free-spin state based on scatter count for the current spin.
   * Mutates `state` in place; returns void.
   * @param state - Persistent free-spin state shared across spins.
   * @param scatters - Number of SCATTER symbols counted in the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
