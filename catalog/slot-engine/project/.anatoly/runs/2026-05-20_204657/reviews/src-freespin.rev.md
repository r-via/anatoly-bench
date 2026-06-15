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
- **Correction [OK]**: Correctly iterates all cells of the 5×3 grid and counts SCATTER occurrences, matching the documented full-grid scatter-count behavior.
- **Overengineering [LEAN]**: Flat double loop over a 2D array, single counter, no abstractions. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts — no coverage of empty reels, single scatter, exactly 3 scatters, or multi-reel layouts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state transitions match the arbitrated contract exactly: activate+set-10, retrigger+add-10, decrement+deactivate-at-zero. The `<= 0` guard is correct since remaining steps by −1 and will hit 0 before going negative.
- **Overengineering [LEAN]**: Three mutually exclusive branches map directly to the documented state transition table. No unnecessary indirection.
- **Tests [NONE]**: No test file exists. Critical state machine with 3 branches (activation, retrigger, decrement/deactivation) and boundary condition at remaining<=0 — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State-mutation side effects, the three-branch transition logic (activation, retrigger, decrement/deactivation), and the meaning of the scatters threshold are undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. This is not a test file. [L3-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain: `handleFreeSpins` mutates state in-place and returns `void`, producing no audit event or diff record. In regulated gaming, state transitions should be traceable for RNG certification audits. Consider returning a transition record or emitting an event. |

### Suggestions

- Add JSDoc to both public exports to satisfy rule 9 and aid regulated-gaming audit trails.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire 5×3 grid.
   * @param reels - Full reel window (columns × rows).
   * @returns Total number of SCATTER symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Return a transition descriptor from `handleFreeSpins` to improve auditability in a regulated gambling context (rule 17).
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  export type FreeSpinTransition = { triggered: boolean; retriggered: boolean; decremented: boolean; deactivated: boolean };
  
  export function handleFreeSpins(state: FreeSpinState, scatters: number): FreeSpinTransition {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
