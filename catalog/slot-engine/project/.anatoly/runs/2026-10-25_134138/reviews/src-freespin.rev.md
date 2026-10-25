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
- **Correction [OK]**: Counts SCATTER symbols across all reel columns correctly.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: The retrigger branch adds 10 spins but does not consume the current free spin.
- **Overengineering [LEAN]**: Straightforward three-branch state transition on a plain state object. No unnecessary abstraction. (deliberated: confirmed — Kept, with lower confidence. In src/freespin.ts:13-23, the non-retrigger active branch (L19-22) decrements `remaining` once per call. The retrigger branch (L17-18) adds 10 and does not decrement, so the free spin that triggers the retrigger is never consumed: an off-by-one compared with the other branch. However, the only caller is src/engine.ts:141-142, and it always passes a new `{active:false, remaining:0}` state. The retrigger branch therefore cannot be reached through spin() today, which limits the real impact. There is no spec in the audited tree to confirm the intended retrigger rule, and confidence is not high enough (below 85) to dismiss the finding.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 6.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 3 | Discriminated unions | WARN | MEDIUM | FreeSpinState uses `active` boolean plus `remaining` number, so inactive state can carry a meaningless `remaining`. A tagged union would make invalid states unrepresentable. [L12-L22] |
| 5 | Immutability | FAIL | MEDIUM | `handleFreeSpins` mutates its `state` parameter in place (`active`, `remaining`) and returns void. `detectScatters` correctly takes ReadonlyArray inputs. [L12-L22] |
| 8 | ESLint compliance | WARN | HIGH | The imported type `Symbol` shadows the global `Symbol`, which `no-shadow`/`no-redeclare` with builtinGlobals can flag. The shadowing comes from the type's definition in types.ts, but the import here brings it into scope. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `handleFreeSpins` has non-obvious contracts and no docs. It mutates state, awards a hardcoded 10 spins, retriggers at 3 or more scatters, and decrements only on non-trigger spins. `detectScatters` is self-describing but undocumented. [L3-L22] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is pure. `handleFreeSpins` is testable by passing a state object, but it mutates in place and the magic numbers 3 and 10 are hardcoded rather than injected or configurable. [L12-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming domain inferred from slot-engine vocabulary. Free-spin thresholds and award counts are magic numbers and should be named constants, ideally from the paytable or config. No RNG primitive is used here, so this is not a rule 13 issue. [L13-L20] |

### Suggestions

- Name the magic numbers and document the mutation contract
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
  }
  // After
  const SCATTERS_TO_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  /** Mutates `state` in place: triggers or retriggers free spins at >= 3 scatters, else consumes one active spin. */
  if (!state.active && scatters >= SCATTERS_TO_TRIGGER) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
  }
  ```
- Return a new state instead of mutating the parameter
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch, decrement for the current spin as well as adding the award. Use `state.remaining += 10; state.remaining--;`. Then run the same `remaining <= 0` deactivation check as the non-retrigger branch, or restructure so the decrement and end-check run for every active spin. [L18]
