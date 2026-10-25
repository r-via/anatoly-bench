# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 95% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all cells across all reels and counts SCATTER symbols.
- **Overengineering [LEAN]**: Nested loop counting a single symbol type. No abstraction overhead; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch (state.active && scatters >= 3) adds 10 free spins but does not consume the current free spin, violating the slot-machine industry convention that every spin played — including a retrigger spin — must decrement the remaining count.
- **Overengineering [LEAN]**: Three-branch state machine for activate/retrigger/decrement. Flat conditionals match the complexity of the rules exactly. (deliberated: confirmed — Confirmed. The function logic (freespin.ts:13-25) is correct in isolation, but engine.ts:141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` on every `spin()` call. Since `active` is always `false` at entry, the retrigger branch (line 17 `state.active && scatters >= 3`) and the decrement branch (line 19 `else if (state.active)`) are unreachable. Free spins can trigger (line 14) but can never retrigger or count down. The `totalWon` field is never updated anywhere.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Two missing exports is WARN per threshold. [L3-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino domain: magic numbers `3` (scatter threshold) and `10` (free spins per trigger) are game configuration that should be named constants for auditability and tuning. Inline literals in regulated slot logic create maintenance risk. [L14-L18] |

### Suggestions

- Extract game configuration constants for auditability in regulated casino code
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
    }
  // After
  const SCATTER_TRIGGER_COUNT = 3;
  const FREE_SPINS_PER_TRIGGER = 10;
  
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.active = true;
      state.remaining = FREE_SPINS_PER_TRIGGER;
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.remaining += FREE_SPINS_PER_TRIGGER;
    }
  ```
- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols across all reels.
   * @param reels - 2-D array of reel columns after a spin.
   * @returns Total scatter symbol count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (state.active && scatters >= 3), consume the current free spin in addition to adding the award: change `state.remaining += 10` to `state.remaining += 9` (or add `state.remaining--` after the increment). This matches the slot-machine convention that every played round is counted regardless of retrigger. [L18]
