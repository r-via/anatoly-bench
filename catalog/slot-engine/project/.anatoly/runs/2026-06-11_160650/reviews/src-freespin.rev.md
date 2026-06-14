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
- **Correction [OK]**: Correctly iterates the full 5×3 grid and counts every SCATTER symbol; matches the documented contract.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical path in spin engine with no coverage for zero scatters, exactly 3 scatters, or multi-reel scatter distribution.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of grid-wide scatter counting behavior, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions are implemented correctly: activation at remaining=10, retrigger +10, decrement-and-deactivate at 0.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state machine. Minimal and appropriate for the logic.
- **Tests [NONE]**: No test file exists. Four distinct branches (initial activation, retrigger, decrement, deactivation at 0) all untested despite being core free-spin lifecycle logic called by the main spin function.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) and mutation-in-place contract are non-obvious and require documentation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Given their non-obvious side-effect profile (especially `handleFreeSpins` mutating state in place), at minimum a one-liner `@param`/`@returns` block would aid consumers. [L3-L23] |

### Suggestions

- Add JSDoc to both public exports to document the mutation side-effect on `handleFreeSpins` and the grid-wide counting behavior of `detectScatters`.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (all columns and rows).
   * @param reels - Full 5×3 reel window.
   * @returns Total number of SCATTER symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Document `handleFreeSpins` mutation contract so callers know state is mutated in place.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to scatter-triggered free-spin transitions.
   * Activates (≥3 scatters, inactive), retrigers (+10 remaining, ≥3 scatters while active),
   * or decrements and deactivates (active, <3 scatters).
   * @param state - Persistent free-spin state; modified in place.
   * @param scatters - Scatter count from the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
