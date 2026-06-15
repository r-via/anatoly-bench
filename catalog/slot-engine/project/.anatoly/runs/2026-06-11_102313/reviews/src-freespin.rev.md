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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid, matching the documented 5×3 full-grid scan.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D array. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts with no coverage for empty reels, single scatter, exactly 3 scatters, or multiple scatters across multiple reels.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description, @param for reels, and @returns explaining the scatter count semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-transition branches match the arbitrated contract exactly: activate+set-10, retrigger+add-10, decrement-and-deactivate-at-zero.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state transition table. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts with no coverage for activation (scatters>=3), re-trigger while active, countdown to zero/deactivation, or no-op when inactive with <3 scatters.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of state transitions, @param for state and scatters, and the retrigger/deactivation behavior is non-obvious without docs.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported symbols `detectScatters` and `handleFreeSpins` lack JSDoc. Public API surface should document parameters, return value, and side effects (especially mutation of `FreeSpinState`). [L4-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated casino/slot-machine domain inferred from scatter/free-spin/jackpot vocabulary across project. `handleFreeSpins` mutates `FreeSpinState` in place with no audit event emitted. For certified gaming software, state transitions (especially free spin grant/retrigger/expiry) typically require an immutable audit log entry alongside the mutation. This file owns the transitions and is the correct location to surface this gap. [L12-L22] |

### Suggestions

- Add JSDoc to both public exports, documenting the mutation side-effect on `handleFreeSpins`.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid.
   * @param reels - Full 5×3 reel window.
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- For regulated-gaming compliance, emit an audit event on each state transition rather than silently mutating.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    }
  // After
  export function handleFreeSpins(
    state: FreeSpinState,
    scatters: number,
    onTransition?: (event: FreeSpinEvent) => void,
  ): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
      onTransition?.({ type: "ACTIVATED", remaining: 10 });
    }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
