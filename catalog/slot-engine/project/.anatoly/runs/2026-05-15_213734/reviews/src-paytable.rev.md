# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 runtime and 0 type-only sources
- **Duplication [UNIQUE]**: Excluded per project instructions
- **Correction [OK]**: Constant matches the documented 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant, no unnecessary indirection.
- **Tests [NONE]**: No test file exists. Constant is likely consumed by engine/RTP calculations that are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The constant's purpose (return-to-player ratio, its value meaning 95%), and how/where it is applied are not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced by getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Excluded per project instructions
- **Correction [OK]**: All six symbol rows match the documented [3-match, 4-match, 5-match] multipliers exactly.
- **Overengineering [LEAN]**: Plain data-only lookup table; tuple shape [3-match, 4-match, 5-match] is the minimal representation for the three pay tiers.
- **Tests [NONE]**: No test file exists. Private constant, but its correctness (payout values per symbol tier) is entirely untested via getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple layout ([3-match, 4-match, 5-match] multipliers applied to lineBet) and the absence of WILD/SCATTER entries are not documented inline.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Index mapping row[0]/row[1]/row[2] for count 3/4/5 is correct; absent symbols (WILD, SCATTER) return 0.
- **Overengineering [LEAN]**: Three-branch index into a tuple row. Could use `row[count - 3]` but the explicit guards are readable and not overengineered.
- **Tests [NONE]**: No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing coverage of valid counts (3/4/5), unknown symbols returning 0, and invalid counts (1, 2, 6+).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of the multiplier semantics, what `count` values are valid, what the multiplier is applied to (lineBet), and that out-of-range counts return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 runtime and 0 type-only sources
- **Duplication [DUPLICATE]**: 95% identical logic to checkLine: same symbol-matching algorithm, WILD/SCATTER handling, break-on-mismatch pattern, and count >= 3 threshold. Only differences are variable names (first→lead, count→run) and return object keys (symbol→sym, count→run).
- **Correction [OK]**: Lead-symbol detection, consecutive-run counting, and WILD/SCATTER exclusion all match the documented left-to-right payline algorithm.
- **Overengineering [LEAN]**: Implements the documented left-to-right lead-symbol scan with WILD substitution in a single linear pass. Complexity matches the specified payline evaluation algorithm exactly.
- **Tests [NONE]**: No test file. Complex logic with multiple edge cases untested: all-WILD lines, SCATTER-leading lines, mixed WILD+symbol runs, runs shorter than 3, and the find() fallback when symbols[0] is WILD.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The left-to-right scan algorithm, WILD substitution logic for the lead symbol, SCATTER exclusion, minimum count of 3, and null-on-no-win semantics are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 99% identical implementation — both extract leading symbol, validate against WILDs/SCATTERs, count contiguous matches, and return { symbol/sym, count/run } | null

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE uses Record<string, [number, number, number]> with an overly broad key type. Should use a narrower key derived from the Symbol union (excluding WILD/SCATTER) to prevent spurious lookups passing the type checker. The value type should also be readonly. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE lacks `as const`, leaving its tuple values mutable. lineWins parameter `symbols: Symbol[]` should be `readonly Symbol[]` since the function only reads from it. [L5, L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. The name ANCIENT_RTP is especially opaque without documentation explaining its relationship to the active RTP. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is a prime candidate for `as const satisfies ...` to get readonly literal tuple inference while retaining structural validation. The current annotation loses literal narrowing. [L5-L12] |

### Suggestions

- Use `as const satisfies` to narrow PAY_TABLE to readonly literal tuples with structural validation
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
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Mark lineWins input parameter as readonly to signal no mutation
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: readonly Symbol[]): { symbol: Symbol; count: number } | null {`
- Add JSDoc to all three public exports, especially ANCIENT_RTP whose name is opaque
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export function lineWins(symbols: Symbol[]): ...
  // After
  /** Legacy RTP constant (95%). Retained for consumer reference; the active engine uses HOUSE_EDGE in engine.ts. */
  export const ANCIENT_RTP = 0.95;
  
  /** Returns the pay multiplier for `symbol` at match length `count` (3–5). Returns 0 for unknown symbols or count < 3. */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /** Evaluates a single payline left-to-right and returns the lead symbol and run length, or null if no win (count < 3). */
  export function lineWins(symbols: readonly Symbol[]): ...
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
