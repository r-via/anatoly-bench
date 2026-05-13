# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 70% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels with no off-by-one or type issues.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and single-reel inputs.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose and return value are inferrable from the name, but the parameter shape and return semantics (count of SCATTER symbols across all reels) are not documented.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Re-trigger branch (L17–18) adds 10 to remaining without decrementing for the current spin, awarding one extra free spin versus the normal active branch which always decrements.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes activate, retrigger, and decrement logic. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Missing coverage for: initial activation (scatters >= 3), re-trigger during active state, decrement logic, boundary condition (remaining reaches 0), and no-op when inactive with < 3 scatters.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The function has non-trivial branching logic (activation threshold of 3 scatters, retrigger behavior, decrement-and-deactivate) that is not self-evident from the signature alone and warrants documentation.

## Best Practices — 8.75/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates `state.active` and `state.remaining` in-place. A pure function returning a new `FreeSpinState` would be safer and easier to reason about. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions `detectScatters` and `handleFreeSpins` are missing JSDoc comments. These are public API surface for the engine module. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` is impure — it mutates its first argument. Tests must pre-construct a mutable state object and assert post-mutation, rather than asserting a return value. `detectScatters` is a clean pure function. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from scatter/free-spin/reel vocabulary and project structure. Magic numbers `3` (scatter trigger threshold), `10` (initial free spins), `10` (retrigger award) are embedded directly in function logic. In regulated gaming these values govern RTP and must be auditable; they should be extracted to named constants or a config object so a regulator/auditor can locate and verify them without reading implementation logic. [L14-L20] |

### Suggestions

- Add JSDoc to both exported functions
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols across all reels.
   * @param reels - The visible reel window after a spin.
   * @returns Total scatter count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Extract regulated-gaming magic numbers to named constants for auditability
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_TRIGGER_COUNT = 3;
  const FREE_SPINS_INITIAL = 10;
  const FREE_SPINS_RETRIGGER = 10;
  
  // …
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.active = true;
      state.remaining = FREE_SPINS_INITIAL;
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.remaining += FREE_SPINS_RETRIGGER;
  ```
- Make handleFreeSpins a pure function to improve testability and immutability
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    // mutates state in-place
  }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      return { ...state, active: true, remaining: FREE_SPINS_INITIAL };
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      return { ...state, remaining: state.remaining + FREE_SPINS_RETRIGGER };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the re-trigger branch, decrement remaining for the current spin before adding the re-trigger award: `state.remaining = state.remaining - 1 + 10` (or equivalently `+= 9`). Every active free spin must consume one count from remaining; the re-trigger spin is no exception. [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
