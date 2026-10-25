# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 70% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts SCATTER symbols across all columns correctly.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger during an active free-spin round adds 10 spins but never consumes the current round's spin.
- **Overengineering [LEAN]**: Small three-branch state machine mutating FreeSpinState. No unnecessary abstraction. (deliberated: confirmed — Kept: there is not enough evidence to call it a false positive (that needs ≥85). src/freespin.ts:17-18: on a retrigger during an active session, `state.remaining += 10` runs with no decrement. Every other active spin decrements (L19-20), so the retriggering free spin is never consumed, which is an off-by-one in the player's favour. Confidence is lower because this branch cannot be reached today. spin builds a new `{ active: false, remaining: 0, totalWon: 0 }` state on every call (src/engine.ts:141), so only the first-trigger branch (L14-16) ever runs. It is still a defect in an exported function.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | FAIL | MEDIUM | handleFreeSpins mutates the `state` parameter in place (active, remaining). The param is not typed as a value to return, and the in-place mutation is a hidden side effect. Returning a new immutable state is safer. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | handleFreeSpins has hidden contract: it mutates state, awards 10 spins on a trigger of 3+ scatters, retriggers by adding 10, and decrements on non-trigger spins. None of this is readable from the name or signature, and the magic numbers 3 and 10 are undocumented. detectScatters is self-describing. [L13-L24] |
| 15 | Testability | WARN | MEDIUM | Both functions are pure or self-contained, so they are easy to test. The hard-coded thresholds 3 and 10 cannot be injected, so a different scatter threshold or award size needs a code change. A configurable constant would help. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine domain. Magic numbers (3 scatters, 10 free spins) are inlined and should be named constants. State handling has no guard against `remaining` going negative after the final decrement; the `<= 0` check covers it. [L14-L22] |

### Suggestions

- Name the magic numbers and document handleFreeSpins
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
  }
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  /** Mutates `state`: starts, retriggers, or consumes a free spin based on scatter count. */
  if (!state.active && scatters >= SCATTER_TRIGGER) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
  }
  ```
- Return a new state instead of mutating the parameter
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch, consume the current round as well as adding the award. Decrement `state.remaining` for the round just played, then add 10 (net +9), and deactivate when `remaining <= 0`. Alternatively, restructure so the decrement runs for every round while active and the +10 is applied afterward. [L17]
