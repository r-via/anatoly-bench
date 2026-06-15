# Review: `src/freespin.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels, matching the documented 5×3 full-grid scan.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions are implemented correctly: activate+set-10, retrigger+10, and decrement-then-deactivate-at-zero. The `<= 0` guard is a safe superset of the documented 'deactivates when 0' invariant.
- **Overengineering [LEAN]**: Three mutually exclusive state transitions encoded as if/else if chain. Directly mirrors the documented state table with no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc comments. Given the gambling domain, documenting parameter semantics (e.g., grid shape assumption, scatters threshold) is particularly valuable. [L3-L22] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` returns `void` and mutates the passed `FreeSpinState` in place. A pure function returning a new `FreeSpinState` would be easier to test (no setup of mutable objects, no hidden side-effects) and safer in a gambling context where state integrity is critical. [L13-L23] |

### Suggestions

- Add JSDoc to both public exports documenting parameters and semantics.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (5 × 3).
   * @param reels Column-major 2-D array of symbols.
   * @returns Total SCATTER count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Make `handleFreeSpins` a pure function returning the next state instead of mutating in place — improves testability and auditability in a regulated gambling context.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
    } else if (state.active) {
      state.remaining--;
      if (state.remaining <= 0) {
        state.active = false;
      }
    }
  }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= 3) {
      return { active: true, remaining: 10 };
    } else if (state.active && scatters >= 3) {
      return { ...state, remaining: state.remaining + 10 };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { active: remaining > 0, remaining };
    }
    return state;
  }
  ```
