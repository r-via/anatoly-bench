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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid by iterating every reel and every symbol, matching the documented contract.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Minimal and appropriate for its purpose.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts for core game logic; missing coverage of empty reels, single scatter, exactly 3 scatters, and mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of grid traversal logic, parameter shape, and return value semantics (total scatter count across all reels).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state transitions (activate, retrigger, decrement/deactivate) match the reference-doc table exactly. Deactivation guard `<= 0` correctly handles the boundary at 0.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding the documented transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical state machine with 4 branches (initial activation, re-trigger, decrement, deactivation at 0) — all untested. Used by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state machine with three branches (activate, retrigger, decrement/deactivate) — none of the transitions, mutation side-effects, or parameter semantics are documented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. For a gaming library where callers rely on documented contracts (e.g. retrigger semantics, deactivation threshold), this matters. [L3-L22] |

### Suggestions

- Add JSDoc to both public exports to document the retrigger semantics and deactivation boundary — critical for a gaming library where callers depend on transition contracts.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid (not confined to paylines).
   * @param reels - 5×3 grid of symbols as nested ReadonlyArrays.
   * @returns Total SCATTER count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to `handleFreeSpins` documenting the three state transitions (activate, retrigger, decrement/deactivate) so callers don't need to read the source.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to scatter count:
   * - Not active + ≥3 scatters → activates, sets `remaining = 10`.
   * - Active + ≥3 scatters → retrigger, adds 10 to `remaining`.
   * - Active + <3 scatters → decrements `remaining`; deactivates at 0.
   * @param state - Persistent free-spin state object (mutated in place).
   * @param scatters - SCATTER count from the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
