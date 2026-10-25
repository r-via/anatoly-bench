# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 78% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts SCATTER symbols across all reel columns correctly.
- **Overengineering [LEAN]**: Plain nested loop counting SCATTER symbols; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: A retrigger during free spins adds 10 but never consumes the current round, so the counter is off by one.
- **Overengineering [LEAN]**: Simple three-branch state transition for start, retrigger and decrement; no unnecessary abstraction. (deliberated: confirmed — Confirmed, with lower confidence. In src/freespin.ts:19-20 a normal active call uses up one spin (`remaining--`). The retrigger branch at :17-18 adds 10 without using up the current spin, so each retrigger effectively awards 11 spins. Confidence is lowered because the only caller, src/engine.ts:141-142, always passes a fresh `{active:false}` state, so the retrigger branch cannot be reached from the current engine.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates its `state` parameter in place, which is not `Readonly`. The magic number 10 is repeated twice instead of being a named `as const` constant. The reels parameter is correctly `ReadonlyArray`. [L12-L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exports, `detectScatters` and `handleFreeSpins`, lack JSDoc (2 exports, so WARN). The free-spin trigger threshold, award and retrigger semantics are undocumented. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is pure. `handleFreeSpins` mutates its input and returns void, so tests must inspect side effects. A pure function returning the new state would be easier to test and reason about. There are no hidden I/O dependencies, so a seam exists. [L12-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | The hardcoded trigger threshold (3) and award (10) are magic numbers. They should be named constants or part of config. A retrigger while active does not decrement `remaining` for the spin just played, which is a correctness question for another axis. [L13-L16] |

### Suggestions

- Extract magic numbers into named constants and add JSDoc
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    }
  // After
  const SCATTER_TRIGGER = 3 as const;
  const FREE_SPINS_AWARD = 10 as const;
  
  /** Updates free-spin state for one spin given the scatter count. */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= SCATTER_TRIGGER) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
    }
  }
  ```
- Return a new state instead of mutating the input
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`

## Actions

### Quick Wins

- **[correction · medium · small]** In the active-state branch, decrement `state.remaining` for the current free round on every path. If scatters >= 3, add 10 after the decrement. Then set `state.active = false` when `remaining <= 0`. [L18]
