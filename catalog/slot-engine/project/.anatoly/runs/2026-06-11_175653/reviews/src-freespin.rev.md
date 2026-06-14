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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid, matching the documented contract.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Minimal and appropriate for its purpose.
- **Tests [NONE]**: No test file exists. Critical path: feeds scatter count into handleFreeSpins via spin(). Edge cases untested: empty reels, zero scatters, exactly 3 scatters, scatters in multiple columns.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of grid traversal logic, parameter shape (2D reel array), and return value (scatter count integer).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state transitions match the reference documentation exactly: activation with remaining=10, retrigger += 10, and decrement-then-deactivate-at-zero.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state machine. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), retrigger (scatters>=3, active), decrement (active, scatters<3, remaining>0), and deactivation (remaining reaches 0). All called by core spin() function.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious state machine with three distinct transitions (activate, retrigger, decrement/deactivate) and a mutation side-effect — all undocumented. Parameters and return void not described.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither `detectScatters` nor `handleFreeSpins` has a JSDoc comment. Both are public exports with non-trivial behavioral contracts (state mutation semantics, retrigger logic) that consumers must understand. [L3-L23] |

### Suggestions

- Add JSDoc to both public exports to document the mutation contract and retrigger semantics.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid (not confined to paylines).
   * @param reels - 5×3 reel grid to inspect.
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to `handleFreeSpins` documenting mutation-in-place behaviour and retrigger rule.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to scatter count:
   * - Not active + ≥3 scatters → activates, sets `remaining = 10`.
   * - Active + ≥3 scatters → adds 10 to `remaining` (retrigger).
   * - Active + <3 scatters → decrements `remaining`; deactivates at 0.
   * @param state - Persistent free-spin state object shared across spins.
   * @param scatters - Scatter count from the current spin (`SpinResult.scatterCount`).
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
