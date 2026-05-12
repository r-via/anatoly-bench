# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 78% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across the 2-D reel grid.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. No abstractions, generics, or patterns — minimal and correct for the task.
- **Tests [NONE]**: No test file exists. Called by engine.ts but no tests cover scatter counting logic, including edge cases like empty reels, no scatters, or mixed reel contents.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 spins but never consumes the spin that caused the retrigger, awarding one extra free spin compared to standard slot-machine convention.
- **Overengineering [LEAN]**: Three-branch state machine for free-spin lifecycle (activate, retrigger, decrement). Each branch maps directly to a game rule; no unnecessary indirection or generalization.
- **Tests [NONE]**: No test file exists. State machine has 4 distinct branches (activate, retrigger, decrement, deactivate) — all untested despite being core game logic used by engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State mutation side-effects, activation threshold (>=3 scatters), spin award (10), and decrement/deactivation logic are undocumented. (deliberated: confirmed — Confirmed two issues. (1) `totalWon` is declared in FreeSpinState (src/types.ts:21) and initialized to 0 (src/engine.ts:141) but never updated by handleFreeSpins — the field is unused, indicating incomplete implementation. (2) The retrigger branch at src/freespin.ts:17-18 (`state.remaining += 10`) has no cap on accumulated free spins. Furthermore, this branch is unreachable in current usage: src/engine.ts:141 creates a fresh FreeSpinState with `active: false` on every spin call, so the condition `state.active && scatters >= 3` at freespin.ts:17 can never be true. The function logic is self-consistent but the integration is broken — free spin state needs persistence across spins for retriggering to work. Raised confidence slightly from 72 to 78 based on the additional unreachable-retrigger evidence.)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `detectScatters` correctly accepts `ReadonlyArray<ReadonlyArray<Symbol>>`, but `handleFreeSpins` mutates the `state` parameter in-place. The parameter should either be typed as mutable by design with an explicit doc contract, or the function should return a new state object. [L14-L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. In a regulated gaming engine these are part of the public API and should document parameters, return values, and side effects (especially the mutation in `handleFreeSpins`). [L3,L14] |
| 15 | Testability | WARN | MEDIUM | `handleFreeSpins` mutates its argument, requiring callers to construct mutable state objects before each test assertion. A pure signature `(state: FreeSpinState, scatters: number): FreeSpinState` would eliminate setup boilerplate and enable property-based testing without side-effect concerns. [L14-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated-gaming domain (slot engine). `handleFreeSpins` combines awarding, re-triggering, and decrement logic in a single mutable procedure with no returned audit record. Regulated engines typically require pure, logged state transitions so every spin result is reproducible and auditable. Mixed-concern mutation also complicates replay and RNG certification validation. [L14-L24] |

### Suggestions

- Add JSDoc to both exported functions to document parameters, return values, and the mutation side-effect.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Advances free-spin state based on scatter count.
   * Mutates `state` in-place: awards 10 spins on trigger, re-triggers on ≥3 scatters,
   * or decrements remaining count and deactivates when exhausted.
   * @param state - Mutable free-spin state object.
   * @param scatters - Number of SCATTER symbols visible on the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Return a new state object instead of mutating the parameter to improve testability and support audit-trail requirements common in regulated gaming engines.
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
      return { active: true, remaining: state.remaining + 10 };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return remaining <= 0 ? { active: false, remaining: 0 } : { active: true, remaining };
    }
    return { ...state };
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (state.active && scatters >= 3), add `state.remaining--` after `state.remaining += 10` so the spin that caused the retrigger is consumed, consistent with how non-retrigger active spins are handled. [L17]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
