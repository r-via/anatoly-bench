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

- **Utility [DEAD]**: Exported constant with 0 runtime importers. Never used by any file.
- **Duplication [UNIQUE]**: Simple numeric constant, no similar values found
- **Correction [OK]**: Value 0.95 matches documented RTP target of 95%.
- **Overengineering [LEAN]**: Single numeric constant, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name hints at RTP but does not explain what 'ANCIENT' refers to, which game mode uses this value, or how it is applied.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced in getPayMultiplier (line 15). Provides core pay data.
- **Duplication [UNIQUE]**: Configuration lookup table, no similar structures in RAG results
- **Correction [OK]**: All six symbol rows match the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multiplier table exactly.
- **Overengineering [LEAN]**: Flat Record mapping symbols to fixed-length tuples — minimal, appropriate data structure for a static paytable.
- **Tests [NONE]**: No test file exists. Private table backing getPayMultiplier; untested indirectly as well.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] and the unit (multiplier applied to lineBet) are not explained.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2] aligns with the [3oak, 4oak, 5oak] tuple layout; unknown symbols and counts outside 3–5 return 0.
- **Overengineering [LEAN]**: Straight lookup with an if/else on count. Could use `row[count - 3]` but the explicit branches add no structural weight and are equally readable.
- **Tests [NONE]**: No test file. Imported by src/engine.ts and src/legacy.ts — a critical pay calculation path — with zero coverage. Missing: valid symbol/count combos (3/4/5), unknown symbol returning 0, count <3 returning 0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing @param descriptions, @returns explanation, and no note that WILD/SCATTER (or unknown symbols) return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers. Never imported by any file.
- **Duplication [DUPLICATE]**: Semantically identical to checkLine—both handle WILD replacement, early exit on WILD/SCATTER, loop with identical break condition, and 3+ match threshold. Differences are cosmetic: variable names (first/count vs lead/run) and property names (symbol/count vs sym/run)
- **Correction [OK]**: WILD-leading resolution via Array.find correctly identifies the leftmost non-WILD symbol; counting loop correctly counts consecutive left-to-right positions that are either the resolved symbol or WILD; WILD-only (all-WILD falls back to 'WILD' → null) and SCATTER edge cases handled correctly.
- **Overengineering [LEAN]**: Handles WILD-leading edge case and consecutive-match counting in a single focused loop. Complexity is proportional to the domain rules (WILD substitution, left-to-right matching, SCATTER exclusion).
- **Tests [NONE]**: No test file. Key edge cases untested: all-WILD line, SCATTER as first symbol, WILD prefix resolving to first non-WILD, count <3 returning null, mixed mid-line break, all same symbol.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The WILD substitution logic, left-to-right consecutive matching rule, minimum count of 3, and null-return cases for WILD/SCATTER anchors are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 93% identical logic and control flow with only variable/property name differences

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is typed as a mutable `Record`; its tuple values are writable at runtime. `as const` or `Readonly<Record<string, readonly [number, number, number]>>` would prevent accidental mutation. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `ANCIENT_RTP` especially needs documentation — the 'ANCIENT' qualifier is opaque without a comment explaining which game variant or RTP class it represents. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is a prime candidate for `satisfies`. Using `as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>` would give narrow literal types for tuple values while enforcing key correctness — better than the current loose `Record<string, ...>` annotation. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | `PAY_TABLE` uses `string` as its key type instead of the imported `Symbol` union. Typos or invalid symbol names (e.g. `PAY_TABLE['SEVN']`) silently return `undefined` instead of being caught at compile time. Narrowing the key to `Symbol` (or a `PaySymbol` sub-union excluding `WILD`/`SCATTER`) closes this gap. [L5] |

### Suggestions

- Narrow PAY_TABLE key type and add deep immutability using `as const satisfies`
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    // ...
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
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Base Return-to-Player ratio for the Ancient variant (95%). Applied to line-bet totals during payout calculation. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the win multiplier for a given symbol and consecutive match count.
   * Returns `0` for unrecognised symbols or counts outside [3, 5].
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
