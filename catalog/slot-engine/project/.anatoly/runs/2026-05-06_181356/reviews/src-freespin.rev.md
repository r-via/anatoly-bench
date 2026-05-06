# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all cells in the 5×3 grid and counts every SCATTER occurrence, matching the documented behavior.
- **Overengineering [LEAN]**: *(axis crashed — see transcript)*
- **Tests [NONE]**: No test file exists. Used by engine.ts, but no coverage of scatter counting across single/multi-reel layouts, empty reels, or zero-scatter cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. that it counts all SCATTER symbols across the full grid regardless of payline position).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Branch logic correctly covers all four state-scatter combinations: inactive+no-trigger (no-op), inactive+trigger (activate, set 10), active+retrigger (add 10), active+no-trigger (decrement, deactivate at 0). Matches documented invariants in .anatoly/docs/02-Architecture/02-Core-Concepts.md and .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: *(axis crashed — see transcript)*
- **Tests [NONE]**: No test file exists. Four distinct branches (initial trigger, retrigger, decrement, deactivation on zero) are all untested. Used by engine.ts, making this a critical gap.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of the three distinct state transitions (trigger, retrigger, decrement/deactivate), the threshold value, and mutation side-effects on the state parameter.

## Best Practices — 8.75/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly uses ReadonlyArray<ReadonlyArray<Symbol>>. handleFreeSpins mutates state in place (active, remaining) rather than returning a new FreeSpinState. Documented design per .anatoly/docs/03-Guides/02-Advanced-Configuration.md, but the functional alternative would be safer. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. These are core engine APIs consumed by callers per .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function — fully testable. handleFreeSpins mutates its state argument, requiring callers to set up mutable objects and assert side effects rather than inspect a return value. A pure (state: FreeSpinState) => FreeSpinState signature would improve testability. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Game-engine utility file. handleFreeSpins returns void and drives state via mutation, making it non-composable. A functional signature returning a new FreeSpinState aligns better with engine-level composability and predictability. The trigger threshold (3) and award count (10) are magic literals — documented as intentional per .anatoly/docs/03-Guides/02-Advanced-Configuration.md, but named constants would improve maintainability. [L13-L24] |

### Suggestions

- Add JSDoc to both public exports so API consumers and tooling get inline documentation.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols visible across all reels.
   * @param reels - 5×3 grid of symbols (column-major).
   * @returns Total SCATTER count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Replace magic literals with named constants to make threshold and award count self-documenting and centrally configurable.
  ```typescript
  // Before
  state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const FREE_SPIN_TRIGGER = 3;
  const FREE_SPIN_AWARD = 10;
  
  // inside handleFreeSpins:
  state.remaining = FREE_SPIN_AWARD;
    } else if (state.active && scatters >= FREE_SPIN_TRIGGER) {
      state.remaining += FREE_SPIN_AWARD;
  ```
- Return a new FreeSpinState instead of mutating the parameter for better testability and composability.
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
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    } else if (state.active && scatters >= 3) {
      return { ...state, remaining: state.remaining + 10 };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
