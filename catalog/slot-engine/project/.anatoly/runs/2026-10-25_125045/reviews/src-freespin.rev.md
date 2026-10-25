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
- **Correction [OK]**: Straightforward double-loop count; no off-by-one, no mutation of inputs.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. Minimal and appropriate for the task.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: State machine is internally consistent: trigger (case 1) sets remaining=10 without decrement; retrigger (case 2) adds 10 without decrement (current spin is treated as "free", a valid slot-design choice); normal free-spin consumption (case 3) decrements and deactivates at ≤0. No reachable path leaves active=true with remaining≤0, and remaining cannot underflow into case 3 because the ≤0 guard deactivates before the next call.
- **Overengineering [LEAN]**: Three mutually exclusive branches covering activate, retrigger, and decrement cases. No unnecessary abstraction; each branch maps directly to a game rule.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Public API surface should document parameters, return values, and side effects (especially since `handleFreeSpins` mutates its argument). [L3-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (confirmed by scatter/free-spin vocabulary and README). Magic numbers `3` (scatter threshold), `10` (initial free spins), and `10` (retrigger increment) are embedded inline with no named constants. In regulated gaming code these values are configurable game-math parameters and must be externalized for RTP auditing and certification. [L14-L22] |

### Suggestions

- Add JSDoc to both public exports documenting parameters, return, and mutation side-effect
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols across all reels.
   * @param reels - 2-D array of reel stop symbols (columns × rows)
   * @returns Total scatter count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Extract magic numbers to named constants for game-math auditability
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_TRIGGER_MIN = 3;
  const FREE_SPINS_AWARD = 10;
  
  if (!state.active && scatters >= SCATTER_TRIGGER_MIN) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
    } else if (state.active && scatters >= SCATTER_TRIGGER_MIN) {
      state.remaining += FREE_SPINS_AWARD;
  ```
