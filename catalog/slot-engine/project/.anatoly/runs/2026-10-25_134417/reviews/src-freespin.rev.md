# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. Minimal and correct for the task.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 free spins without consuming the current free spin, violating the slot-machine industry rule that every played round must decrement the counter — including the round that re-triggers the bonus.
- **Overengineering [LEAN]**: Three-branch state machine directly encodes the free-spin trigger/retrigger/decrement rules. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | handleFreeSpins has non-trivial business rules (scatter threshold of 3, base award of 10, retrigger of +10, decrement-to-zero deactivation) that cannot be read from name and signature alone. detectScatters is self-describing but a brief doc would clarify what 'detect' means (returns count, not boolean). [L13-L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic numbers 3 (scatter threshold), 10 (base free spins), and 10 (retrigger award) are game configuration values hardcoded inline. In a regulated slot engine these should be named constants or injected config so they are visible, auditable, and changeable without touching logic. [L14-L18] |

### Suggestions

- Extract game-rule magic numbers as named constants for auditability and configurability
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_THRESHOLD = 3;
  const FREE_SPIN_AWARD = 10;
  
  if (!state.active && scatters >= SCATTER_THRESHOLD) {
      state.active = true;
      state.remaining = FREE_SPIN_AWARD;
    } else if (state.active && scatters >= SCATTER_THRESHOLD) {
      state.remaining += FREE_SPIN_AWARD;
  ```
- Add JSDoc to handleFreeSpins documenting the trigger threshold and award amounts
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Transitions free-spin state based on detected scatter count.
   * - 3+ scatters while inactive: activates free spins and sets remaining to 10.
   * - 3+ scatters while active: retrigger adds 10 to remaining.
   * - Active with < 3 scatters: decrements remaining; deactivates at 0.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (state.active && scatters >= 3), decrement remaining for the current round in addition to adding the retrigger award: `state.remaining += 10; state.remaining--;` (net +9). This ensures the current free spin is consumed as required by the slot-machine convention that every played round decrements the counter. [L18]
