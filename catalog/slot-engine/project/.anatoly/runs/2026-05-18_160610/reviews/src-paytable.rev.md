# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with no runtime or type-only importers
- **Duplication [UNIQUE]**: Numeric constant for RTP value, no duplicates found.
- **Correction [OK]**: Value 0.95 matches documented 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant; minimal by definition.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is opaque — unclear whether this applies to a specific game variant or is the universal RTP. Value and purpose undescribed.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Used locally in getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Symbol payout lookup table, no duplicates found.
- **Correction [OK]**: All six symbol rows match the documented [3-match, 4-match, 5-match] multipliers exactly.
- **Overengineering [LEAN]**: Flat Record keyed by symbol name with fixed-length tuples — exactly the right data structure for a static six-row pay table.
- **Tests [NONE]**: No test file exists. Private constant backing getPayMultiplier; correctness of payout values (e.g. DIAMOND 3-of-a-kind=50) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Tuple semantics ([3-match, 4-match, 5-match] multipliers applied to lineBet) are not stated anywhere in the source. Private symbol but non-trivial structure warrants at least a brief comment.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Imported by src/engine.ts and src/legacy.ts at runtime
- **Duplication [UNIQUE]**: Looks up payout multiplier from table based on symbol and count, no duplicates found.
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2]; returns 0 for unknown symbols and out-of-range counts.
- **Overengineering [LEAN]**: Three explicit count checks could be `row[count - 3]`, but both forms are trivial; no abstraction overhead.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path. Happy path (count 3/4/5 per symbol), unknown symbol returning 0, and count<3 returning 0 are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Missing: what 'count' represents, what the returned number is relative to (raw credits? multiplier?), and that counts below 3 or above 5 return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with no runtime or type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine — extracts first non-WILD symbol, counts consecutive matches with first or WILD, breaks on mismatch, returns null if count < 3. Only variable/property names differ (first vs lead, count vs run, symbol vs sym).
- **Correction [OK]**: Lead-symbol detection (first non-WILD via find, fallback null for all-WILD and SCATTER-lead), consecutive-run counting, and the ≥3 threshold all match documented left-to-right scan semantics.
- **Overengineering [LEAN]**: Straightforward left-to-right scan matching the documented algorithm: resolve lead symbol, count consecutive matches, return win if ≥ 3.
- **Tests [NONE]**: No test file exists. Complex logic with multiple branches (all-WILD line, leading WILDs, SCATTER short-circuit, count<3 returning null) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Non-trivial logic (WILD substitution for lead symbol, left-to-right scan stopping at first mismatch, SCATTER exclusion) is entirely undescribed. Return value semantics also undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — Semantically equivalent — both implement identical payline matching logic with identical control flow. Interchangeable implementations.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is typed as a mutable `Record` with mutable tuple values. Neither the outer object nor the inner tuples are readonly. The `symbols` parameter in `lineWins` could be `readonly Symbol[]`. [L5-L12] |
| 6 | Interface vs Type | WARN | MEDIUM | Project uses named interfaces (`SpinResult`, `LineWin`) per docs. The return type of `lineWins` is an anonymous object literal `{ symbol: Symbol; count: number }` instead of a named interface. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. At minimum `getPayMultiplier` and `lineWins` should document parameters and return semantics. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` could use `satisfies Record<string, [number, number, number]>` to validate shape while preserving literal tuple types for better inference and immutability. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain: `PAY_TABLE` key is typed as `string` rather than the `Symbol` union literal. This allows lookups with invalid symbol names at compile time without error — a correctness risk in a regulated payout context where every payout path must be verifiable. [L5] |

### Suggestions

- Constrain PAY_TABLE key to Symbol literals and make the structure readonly using `satisfies`
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
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
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Make `lineWins` return a named interface matching project conventions and accept readonly input
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null
  // After
  export interface PaylineMatch { symbol: Symbol; count: number }
  export function lineWins(symbols: readonly Symbol[]): PaylineMatch | null
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Theoretical return-to-player for this pay table (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the payout multiplier for a given symbol and match count.
   * Returns 0 for counts below 3 or unknown symbols.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
