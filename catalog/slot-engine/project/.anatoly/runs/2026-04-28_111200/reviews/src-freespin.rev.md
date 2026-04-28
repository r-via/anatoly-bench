# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 92% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates the full 2D grid and counts every SCATTER symbol, matching the documented 5×3 grid-wide counting rule.
- **Overengineering [LEAN]**: Simple nested loop counting a single symbol value across a 2D array. Matches the documented requirement exactly (full-grid SCATTER count). No unnecessary abstractions or generics.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: When free spins are triggered for the first time (scatters >= 3, !state.active), the function sets state.remaining = 10 but does NOT decrement remaining for the current spin — the triggering spin itself is consumed without decrement, which is correct. However, when free spins are active and scatters < 3, the function decrements remaining to account for the current spin being consumed, which is also correct per the countdown model. One real defect: the initial trigger branch resets remaining to exactly 10 regardless of any pre-existing remaining value, but since !state.active implies the session is fresh this is not a bug. The sole defect is that on a retrigger (state.active && scatters >= 3) the function adds 10 but does NOT decrement remaining for the current spin being consumed, whereas the normal active branch (scatters < 3) does decrement — this asymmetry means a retrigger spin is not counted as a consumed free spin, granting one extra spin relative to the documented model.
- **Overengineering [LEAN]**: Three-branch conditional directly encodes the documented state machine: trigger, retrigger, and decrement. Logic matches the spec in `.anatoly/docs/02-Architecture/02-Core-Concepts.md` and `.anatoly/docs/03-Guides/02-Advanced-Configuration.md` verbatim. No excess abstraction. (deliberated: confirmed — Confirmed NEEDS_FIX. The function at src/freespin.ts:13-25 has correct internal logic for a stateful free-spin manager, but its sole call site at src/engine.ts:141 creates a fresh FreeSpinState `{ active: false, remaining: 0, totalWon: 0 }` every spin. This means: (a) only the trigger branch at freespin.ts:14 (`!state.active && scatters >= 3`) can ever fire; (b) the retrigger branch at line 17 (`state.active && scatters >= 3`) is unreachable; (c) the countdown branch at line 19 (`state.active`) is unreachable. The `totalWon` field (types.ts:21) is never updated anywhere in the codebase. The free-spin feature is non-functional beyond initial award detection.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions `detectScatters` and `handleFreeSpins` are part of the public API surface and lack any JSDoc. This is especially notable in a regulated-gambling context where the business semantics of scatter counting and free-spin state transitions benefit from in-source documentation. Neither `@param`, `@returns`, nor a description block is present. [L3-L22] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is a pure function — excellent testability. However, `handleFreeSpins` is void-returning and mutates the `state` argument in place. This requires tests to inspect the mutated object rather than assert on a return value, and prevents easy composition or snapshotting. Returning a new `FreeSpinState` (or `Readonly<FreeSpinState>`) would improve purity and make assertions more straightforward. [L12-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling/slot-engine domain inferred from scatter/free-spin/reel vocabulary and confirmed by `.anatoly/docs/`. The numeric literals `3` (trigger threshold) and `10` (spins awarded/retriggered) directly govern the game's RTP and bonus frequency. In regulated gaming environments, game-math parameters must be auditable and easily traceable; magic numbers embedded in logic are an audit risk. Named constants (e.g., `SCATTER_TRIGGER_COUNT = 3`, `FREE_SPINS_AWARD = 10`) would make these values explicitly reviewable. The docs note they are intentionally hardcoded (`02-Advanced-Configuration.md`), but named constants would satisfy the same design intent with better auditability. [L14-L20] |

### Suggestions

- Add JSDoc to both public exports to document parameters, return values, and gambling-domain semantics
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
    let count = 0;
    ...
  // After
  /**
   * Counts every SCATTER symbol visible across the full 5×3 grid.
   * @param reels - Column-major 2-D array of all visible symbols.
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
    let count = 0;
    ...
  ```
- Extract magic numbers into named constants for regulated-gaming auditability
  ```typescript
  // Before
  state.remaining = 10;
      } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_TRIGGER_COUNT = 3;
  const FREE_SPINS_AWARD = 10;
  
  // then in handleFreeSpins:
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.remaining = FREE_SPINS_AWARD;
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.remaining += FREE_SPINS_AWARD;
  ```
- Return a new FreeSpinState from handleFreeSpins instead of mutating in place to improve purity and testability
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } ...
  }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      return { ...state, active: true, remaining: FREE_SPINS_AWARD };
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      return { ...state, remaining: state.remaining + FREE_SPINS_AWARD };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (state.active && scatters >= 3), decrement remaining by 1 after adding 10 to account for the current spin being consumed, consistent with the normal active branch. Change `state.remaining += 10` to `state.remaining += 10 - 1` (or `state.remaining += 9`) so the retrigger spin itself is counted. [L19]
