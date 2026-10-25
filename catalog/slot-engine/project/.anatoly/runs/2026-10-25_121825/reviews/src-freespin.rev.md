# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 85% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels; no correctness issues.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type — no abstraction, no generics, minimal and direct.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Re-trigger branch adds 10 free spins without consuming the current free spin, over-awarding by 1 spin.
- **Overengineering [LEAN]**: Three-branch if/else-if state transition for free spin activation, retrigger, and decrement. Direct mutation, no indirection — exactly as complex as the logic requires. (deliberated: confirmed — CONFIRMED. Two issues: (1) src/engine.ts L141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` every spin call. Since `state.active` always starts `false`, the re-trigger branch at freespin.ts L17 (`else if (state.active && scatters >= 3)`) and decrement branch at L19 (`else if (state.active)`) are dead code in practice — state is never persisted between spins. (2) Grep for `totalWon` shows it's defined in types.ts L21 and initialized at engine.ts L141 but never updated by `handleFreeSpins` — the field is always 0. The function's statefulness contract is broken by its caller.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. They are consumed by engine.ts and form part of the public API surface. [L3-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from reels/scatter/paylines/jackpot vocabulary throughout the project. In regulated gaming, game parameters (scatter trigger threshold: 3, free-spin award: 10, retrigger award: 10) must be externally configurable and auditable — hardcoding them in business logic makes certification harder. These should be injected via a game-config object. [L14-L20] |

### Suggestions

- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across all reels.
   * @param reels - The full reel grid after a spin.
   * @returns Total number of scatter symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Inject game-configuration constants rather than hardcoding regulated-gaming parameters
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  interface FreeSpinConfig {
    readonly scatterTrigger: number;   // e.g. 3
    readonly initialAward: number;     // e.g. 10
    readonly retriggerAward: number;   // e.g. 10
  }
  
  export function handleFreeSpins(
    state: FreeSpinState,
    scatters: number,
    config: FreeSpinConfig,
  ): void {
    if (!state.active && scatters >= config.scatterTrigger) {
      state.active = true;
      state.remaining = config.initialAward;
    } else if (state.active && scatters >= config.scatterTrigger) {
      state.remaining += config.retriggerAward;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the re-trigger branch (`state.active && scatters >= 3`), change `state.remaining += 10` to `state.remaining += 9` (or equivalently decrement first then add 10) so the current free spin is consumed before awarding the new 10, matching standard slot-machine payout convention. [L18]
