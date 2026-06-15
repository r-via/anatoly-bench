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
- **Correction [OK]**: Correctly iterates all reels and symbols, accumulates SCATTER count, matches documented spec.
- **Overengineering [LEAN]**: Flat double loop over a 2D array counting a specific symbol. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file found. Critical game logic used by engine.ts has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose, parameter shape, and return value are not described.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three branches match the documented condition/effect table exactly. Deactivation guard `<= 0` is safe. Previously overturned retrigger finding not re-raised.
- **Overengineering [LEAN]**: Three mutually exclusive branches mapping directly to the documented state table. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. State mutation logic with multiple branches (activation, retrigger, decrement, deactivation) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The three-branch state machine logic (trigger, re-trigger, decrement/deactivate) and mutation side-effects are non-obvious and warrant documentation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. Given the gambling domain and public API surface, documenting parameters and side-effects is especially important. [L3-L24] |

### Suggestions

- Add JSDoc to both public exports to document parameters, return values, and side effects — especially important for a regulated gambling domain.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid (all 15 cells).
   * @param reels - 5-column, 3-row reel grid
   * @returns Total SCATTER count (0–15)
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Document handleFreeSpins mutation contract so callers understand state is modified in place.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place based on scatter count.
   * - scatters ≥ 3, not active → activates free spins, sets remaining = 10
   * - scatters ≥ 3, active → re-triggers, adds 10 to remaining
   * - scatters < 3, active → decrements remaining; deactivates at 0
   * @param state - Mutable free spin state for the current session
   * @param scatters - Result of detectScatters for the current spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
