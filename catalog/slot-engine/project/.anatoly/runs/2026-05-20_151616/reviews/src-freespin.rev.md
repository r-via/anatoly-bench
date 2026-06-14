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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid by iterating every cell of the 2D reels array.
- **Overengineering [LEAN]**: Flat double loop over a 2D array, single counter, single responsibility. Minimal and appropriate.
- **Tests [NONE]**: No test file found. Critical game logic used by engine.ts with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of scatter counting logic (full grid vs paylines), parameter shape, and return semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-machine branches match the arbitrated reference table exactly: activate+set-10, retrigger+add-10, decrement-and-deactivate-at-zero. No unreachable or missing branch.
- **Overengineering [LEAN]**: Three mutually exclusive state transitions expressed as a straightforward if/else chain. No unnecessary abstraction for this finite-state logic.
- **Tests [NONE]**: No test file found. State machine with 4 branches (activation, retrigger, decrement, deactivation) — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious state machine with three branches (activate, retrigger, decrement/deactivate) and in-place mutation — all undocumented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `detectScatters` nor `handleFreeSpins` has a JSDoc comment. Both are public exports forming part of the slot-engine API surface. [L3-L23] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` mutates its `state` argument in place rather than returning a new state object. This prevents pure snapshot-based testing and makes multi-step transition tests harder to read. `detectScatters` is a pure function. [L13-L23] |

### Suggestions

- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid.
   * @param reels - Full 5×3 grid as a readonly 2-D array.
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Consider returning a new state object from `handleFreeSpins` for easier pure-function testing
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } ...
  // After
  export function handleFreeSpins(state: FreeSpinState, scatters: number): FreeSpinState {
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    } ...
    return state;
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
