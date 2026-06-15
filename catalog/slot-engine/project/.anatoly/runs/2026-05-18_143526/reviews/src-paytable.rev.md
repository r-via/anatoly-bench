# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with no runtime or type-only importers
- **Duplication [UNIQUE]**: Constant value, no similar symbols in RAG results
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target.
- **Overengineering [LEAN]**: Single named constant for the RTP value. Appropriate.
- **Tests [NONE]**: No test file exists. Constant used as RTP configuration value with no tests verifying its correctness or usage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name suggests a return-to-player constant but the context ('ANCIENT' qualifier, value of 0.95, which game mode it applies to) is not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported symbol used locally in getPayMultiplier (line 15)
- **Duplication [UNIQUE]**: Data structure with payoff mappings, no similar structures in RAG results
- **Correction [OK]**: All six symbol tuples [3-match, 4-match, 5-match] match the authoritative pay table in documentation exactly.
- **Overengineering [LEAN]**: Flat record mapping symbols to fixed tuples. Minimal and direct for a static pay table.
- **Tests [NONE]**: No test file exists. Internal constant driving all payout logic; no tests validate the payout values for any symbol.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple semantics [3-match, 4-match, 5-match] and the unit (multiplier applied to lineBet) are non-obvious and undocumented.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Correctly maps row[0]/[1]/[2] to counts 3/4/5; returns 0 for an absent symbol or out-of-range count.
- **Overengineering [LEAN]**: Straightforward index lookup into the pay table tuple. Three explicit if-branches beat array indexing with off-by-one risk.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical payout path. Missing tests for all count branches (3/4/5), unknown symbol returning 0, and count < 3 returning 0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what the multiplier is applied to, what valid values of `count` are, and what 0 return means (no win vs. unknown symbol).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with no runtime or type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine in src/engine.ts: both extract leading symbol (skipping WILDs), validate against WILD/SCATTER, count consecutive matches, return null if count < 3. Differences: variable names (first/lead, count/run) and property keys (symbol/sym) only.
- **Correction [OK]**: Correctly implements documented left-to-right consecutive scan: first non-WILD becomes lead, WILDs substitute throughout the run, SCATTER and all-WILD inputs return null; edge cases (empty array, leading WILDs, count < 3) all resolve to null safely.
- **Overengineering [LEAN]**: Left-to-right scan with WILD substitution and early exit. Matches documented algorithm exactly with no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Complex matching logic with WILD substitution, SCATTER/all-WILD early-return, and count threshold — none of these branches are tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Left-to-right scan logic, WILD substitution behavior, SCATTER exclusion, minimum count threshold (≥3), and return semantics are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 92% identical — same control flow, parameter validation, loop logic, and return semantics with only variable naming differences

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE uses Record<string, ...> instead of Partial<Record<Symbol, ...>>, allowing any string key at the type level. Record is used, but the weaker key type forces a runtime guard that the type system could handle statically. [L5] |
| 5 | Immutability | FAIL | MEDIUM | PAY_TABLE is const-bound but its tuple contents are mutable at runtime. In a regulated gambling engine, pay table mutation is a compliance risk. Neither as const nor Readonly is applied to the record or its tuples. [L5-L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports — ANCIENT_RTP, getPayMultiplier, lineWins — lack JSDoc. For a gambling engine library, documenting the RTP constant and pay-evaluation API is expected by consumers. [L3,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from the satisfies operator (TS 4.9+, well-established by 2026) to validate keys against the Symbol union while preserving tuple literal types, replacing the looser Record<string, ...> annotation. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | ANCIENT_RTP implies a legacy/deprecated value and creates ambiguity about whether a current RTP constant exists elsewhere. The function name lineWins also shadows the lineWins field on SpinResult (ReadonlyArray<LineWin>), which can confuse consumers navigating the API. [L3,L23] |

### Suggestions

- Replace loose Record<string,> annotation with satisfies for key-safety and tuple immutability
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25] as const,
    LEMON:   [2,   5,   25] as const,
    BELL:    [5,   20,  100] as const,
    BAR:     [10,  40,  200] as const,
    SEVEN:   [25,  100, 500] as const,
    DIAMOND: [50,  250, 1000] as const,
  } satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Rename ANCIENT_RTP to remove ambiguity about it being legacy
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Theoretical return-to-player ratio for this pay table (95%). */
  export const TARGET_RTP = 0.95;
  ```
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /**
   * Returns the pay multiplier for `symbol` matched `count` consecutive times.
   * Returns 0 for runs shorter than 3 or symbols absent from the pay table.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a single payline left-to-right and returns the leading symbol
   * and consecutive match count, or null if no qualifying run (≥ 3) is found.
   */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
