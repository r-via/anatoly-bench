# Review: `src/jackpot.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Logic is correct: iterates all reels and positions, tallies DIAMOND occurrences, and compares against threshold 4. No off-by-one, no null-risk on empty arrays, type is consistent with ReadonlyArray<ReadonlyArray<Symbol>>.
- **Overengineering [LEAN]**: Flat double-loop count with a single threshold check. No unnecessary abstractions or generics. Exactly as simple as the task requires.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, multiple columns), or boundary tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot condition (>=4 DIAMOND symbols across all reels), parameter shape, and return semantics.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is an exported function with no JSDoc. In a regulated casino domain, the jackpot trigger condition should be documented for auditability. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine/casino domain inferred from jackpot/reels/diamond/Symbol vocabulary and README (SpinResult, RTP 95%, scatterCount, wildMultiplier). Magic string `"DIAMOND"` and threshold `4` are hardcoded without named constants. In regulated gambling, jackpot trigger conditions must be auditable and traceable — inline literals undermine that. Extract to named exports (e.g. `JACKPOT_SYMBOL`, `JACKPOT_THRESHOLD`). [L4-L10] |

### Suggestions

- Add JSDoc to the exported jackpot function for auditability in a regulated gambling context
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when 4 or more DIAMOND symbols appear across all reels.
   * Triggers the progressive jackpot payout per the 95% RTP model.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Replace magic string and magic number with named constants for regulated-game auditability
  ```typescript
  // Before
  if (sym === "DIAMOND") diamondCount++;
  }
  }
  return diamondCount >= 4;
  // After
  const JACKPOT_SYMBOL = "DIAMOND" as const satisfies Symbol;
  const JACKPOT_THRESHOLD = 4;
  // ...
  if (sym === JACKPOT_SYMBOL) diamondCount++;
  }
  }
  return diamondCount >= JACKPOT_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
