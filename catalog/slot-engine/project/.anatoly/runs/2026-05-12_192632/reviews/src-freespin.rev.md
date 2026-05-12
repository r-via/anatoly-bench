# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid with no off-by-one or type issues.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D array. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, no scatters, single scatter, multiple scatters across columns, and scatters within a single column.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. counts all SCATTER symbols across entire grid).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: When free spins trigger (scatters >= 3 and !state.active), remaining is set to 10 but the spin that triggered free spins is not consumed — the decrement branch is skipped entirely, so the triggering spin is effectively a free spin on top of the 10 awarded. The else-if chain also prevents the count from being decremented on the same spin where a retrigger occurs (scatters >= 3 while active), which is the intended retrigger behaviour and matches docs, so that branch is correct. The primary issue is the non-active trigger path: the triggering spin itself should count as one consumed spin (remaining should be set to 9, not 10), OR the caller contract must guarantee it never calls handleFreeSpins on the triggering spin's consumption tick — but no such contract is documented, making this a latent off-by-one.
- **Overengineering [LEAN]**: Three mutually exclusive state transitions encoded as plain conditionals. Matches the documented logic exactly with no superfluous abstraction.
- **Tests [NONE]**: No test file exists. Missing coverage for: initial activation (scatters>=3), retrigger during active state, decrement logic, boundary condition (remaining reaches 0), and inactive state with scatters<3.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State-mutation side effects, trigger threshold (scatters >= 3), initial award (10), retrigger logic, and decrement-to-deactivation behavior are all undocumented. (deliberated: confirmed — The off-by-one claim (remaining=10 should be 9) is a design assumption, not a bug. In standard slot implementations, the triggering spin is NOT one of the free spins — awarding 10 means 10 additional spins after the trigger. The real issue (not the one claimed) is that engine.ts:141 creates a fresh FreeSpinState every spin, so the retrigger (line 17) and decrement (line 19-23) branches are unreachable dead code in practice. The specific off-by-one claim is debatable, so confidence lowered.)

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly uses ReadonlyArray<ReadonlyArray<Symbol>>. However, handleFreeSpins mutates the state parameter in place (state.active, state.remaining) rather than returning a new FreeSpinState. The mutation is undeclared in the signature and invisible to callers. [L13-L25] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions — detectScatters and handleFreeSpins — are public API with non-trivial behavior (scatter counting, state mutation side-effects) but carry no JSDoc. [L3-L25] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain (slot engine). The spin award count (10) and trigger threshold (3) are hardcoded magic numbers across two branches. Per the internal docs, changing these requires manual editing of numeric literals. Named constants (FREE_SPIN_AWARD = 10, SCATTER_TRIGGER = 3) would prevent divergence and improve configurability. [L14-L22] |

### Suggestions

- Add JSDoc to both exported functions, documenting parameters and side-effects
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols visible across the full reel grid.
   * @param reels - The current 5×3 reel window (column-major).
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Extract magic numbers as named module-level constants
  ```typescript
  // Before
  state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPIN_AWARD = 10;
  
  // ...
  state.remaining = FREE_SPIN_AWARD;
    } else if (state.active && scatters >= SCATTER_TRIGGER) {
      state.remaining += FREE_SPIN_AWARD;
  ```
- Return a new FreeSpinState instead of mutating the argument, making the transformation explicit and the function referentially safer
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
    if (!state.active && scatters >= SCATTER_TRIGGER) {
      return { ...state, active: true, remaining: FREE_SPIN_AWARD };
    } else if (state.active && scatters >= SCATTER_TRIGGER) {
      return { ...state, remaining: state.remaining + FREE_SPIN_AWARD };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Clarify or enforce the caller contract: handleFreeSpins must NOT be called on the same spin that triggered free spins as if it were a free spin consumption. If it is called each spin unconditionally, set state.remaining = 9 on initial trigger (line 17) so the triggering spin counts as the first of the 10. [L17]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
