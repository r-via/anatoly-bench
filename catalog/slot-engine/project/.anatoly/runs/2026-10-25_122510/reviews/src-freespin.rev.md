# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | - | 85% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts SCATTER symbols across all reels.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols; minimal.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: A retrigger during an active free-spin round adds 10 but does not consume the spin just played, unlike the active non-retrigger branch, which decrements.
- **Overengineering [LEAN]**: Straightforward three-branch state transition with no unnecessary abstraction. (deliberated: reclassified: correction: NEEDS_FIX → OK — Grep shows one caller: src/engine.ts:141-142. It builds a fresh state `{ active: false, remaining: 0, totalWon: 0 }` on every spin, so the active-state branches in src/freespin.ts:17-24 (retrigger and decrement) never run in this codebase. The only path that runs (L14-16: inactive and scatters >= 3 → 10 spins) is correct. Whether a retrigger should also use up the current spin is a design choice; nothing in the repo specifies it, and no observable output is affected.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | handleFreeSpins mutates its state parameter in place; the reels parameter is correctly readonly. Returning a new state would be safer. [L13-L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither exported function has JSDoc. The magic numbers 3 and 10 are undocumented. [L3-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | The scatter threshold (3) and award size (10) are hardcoded magic numbers. Extract them to named constants. |

### Suggestions

- Extract magic numbers into named constants and document the exports
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  }
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  /** Updates free-spin state from the scatter count of the latest spin. */
  if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.active = true;
    state.remaining = FREE_SPINS_AWARD;
  }
  ```

## Actions

### Hygiene

- **[correction · low · trivial]** In the retrigger branch (active && scatters >= 3), decrement remaining for the free spin just played, e.g. remaining += 10 - 1. Confirm the intended retrigger semantics first, since no spec is shown. [L17]
