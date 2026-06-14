# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files. No runtime or type-only consumers.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Constant correctly set to documented 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant for the 95% RTP target. No complexity.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations — no coverage at all.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name hints at RTP but 'ANCIENT' qualifier, the value 0.95, and its intended usage context are unexplained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced in getPayMultiplier (L15) via PAY_TABLE[symbol].
- **Duplication [UNIQUE]**: No similar data structures found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND 5-of-a-kind multiplier (1000×) combined with documented DIAMOND reel weight (30/120) implies ~211% RTP from this combination alone, consuming the entire arbitrated 95% RTP budget before any other symbol contributes.
- **Overengineering [LEAN]**: Flat record mapping symbol names to fixed three-element tuples. Minimal, appropriate data structure for a static paytable.
- **Tests [NONE]**: No test file exists. Module-private but drives all payout logic — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no JSDoc. Tuple structure [number,number,number] representing 3/4/5-of-a-kind multipliers is not documented. Lenient given it is non-exported.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Correctly maps (symbol, count) pairs to multipliers per the documented table; returns 0 for WILD/SCATTER and for counts outside [3,5].
- **Overengineering [LEAN]**: Single table lookup with three sequential if-guards. Could use `row[count - 3]` but the explicit guards are readable and the function is trivially simple.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: valid symbol+count combos, unknown symbol returns 0, count < 3 returns 0, count boundary (3/4/5).
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc. Missing: description of purpose, @param docs for symbol and count, @returns explanation, and note that WILD/SCATTER return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. No runtime or type-only consumers.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine in src/engine.ts. Both: resolve the leading non-WILD symbol with the same find-fallback pattern, guard on WILD/SCATTER, count a consecutive matching run with the same break-on-mismatch loop, and return null below 3. Only differences are local variable names (first/count vs lead/run) and return field names (symbol/count vs sym/run). The functions are fully interchangeable in behavior.
- **Correction [OK]**: Correctly counts consecutive matching runs from position 0 with WILD substitution; properly handles leading WILDs, all-WILD inputs, and SCATTER at any position.
- **Overengineering [LEAN]**: Straight left-to-right run detection with WILD substitution. Single loop, early break — minimal and appropriate for payline evaluation.
- **Tests [NONE]**: No test file exists. Complex logic (WILD substitution, SCATTER guard, consecutive-count break) with multiple edge cases — all untested. Missing: all-WILD line, leading WILDs resolving to a symbol, SCATTER short-circuit, count < 3 returns null, mixed symbols breaking the streak.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc. Missing: description of left-to-right consecutive matching, WILD substitution behavior, why SCATTER and all-WILD lines return null, @param and @returns docs.

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical logic — same WILD-skip lead detection, same counting loop, same >= 3 threshold; differs only in variable and return-field names

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is declared `const` but the type allows mutation of both the outer record and inner tuples. Should use `Readonly<Record<...>>` with `readonly` tuple elements or `as const`. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. A library module shipping as `slot-engine` should document its public API. [L3, L13, L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is a prime candidate for `satisfies` — it would enforce the Record shape while preserving literal tuple types for exhaustiveness. Currently typed loosely as `Record<string, [number, number, number]>`, losing the literal key constraint. [L4-L11] |

### Suggestions

- Make PAY_TABLE fully immutable with readonly tuple elements and use `satisfies` to preserve literal types while enforcing shape
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Readonly<Record<string, readonly [number, number, number]>>;
  ```
- Add JSDoc to the three public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Theoretical Return-to-Player for this paytable (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a (symbol, run-length) pair.
   * Returns 0 for WILD, SCATTER, or runs shorter than 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a 5-symbol payline slice and returns the winning symbol and
   * contiguous run length, or null when no win qualifies (< 3 of a kind).
   */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** Reduce DIAMOND[2] (5-of-a-kind multiplier) from 1000× to a value consistent with 95% RTP, or lower DIAMOND reel weight in reels.ts. Current combination yields E[DIAMOND 5-of-a-kind across 10 paylines] ≈ 211% of bet, exhausting the entire RTP budget before any other symbol or bonus contributes. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
