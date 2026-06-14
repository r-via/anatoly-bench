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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid, matching the documented 5×3 grid-wide count requirement.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D array. Minimal and appropriate for its purpose.
- **Tests [NONE]**: No test file found. Used by engine.ts — needs tests for empty reels, no scatters, partial scatter counts, and full grid scatters.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter docs for `reels`, and return value explanation.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state transitions match the arbitrated contract: trigger (remaining=10), retrigger (remaining+=10), and decrement-with-deactivation (remaining--; deactivate when <=0).
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state machine table. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state machine with three distinct branches (activate, retrigger, decrement/deactivate) — the mutation semantics and threshold logic (≥3 scatters) are not described anywhere in the source.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc comments. Given that `handleFreeSpins` has non-obvious mutation semantics (void return, state side-effect), a doc block would meaningfully aid consumers. [L4-L23] |

### Suggestions

- Add JSDoc to both public exports to document mutation semantics and parameters
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Advances free-spin state based on scatter count for the current spin.
   * Mutates `state` in place. Activates on ≥3 scatters, retriggering adds 10;
   * otherwise decrements `remaining` and deactivates when it reaches 0.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Add JSDoc to `detectScatters` clarifying grid-wide (not payline-confined) counting
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (all positions, not paylines).
   * @returns total SCATTER count for use in free-spin and payout logic.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
