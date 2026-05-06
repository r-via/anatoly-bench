# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers. No files import this symbol.
- **Duplication [UNIQUE]**: Single constant value for RTP. No similar functions found in RAG results.
- **Correction [OK]**: Value 0.95 matches the 95% RTP target documented in .anatoly/docs/02-Architecture/02-Core-Concepts.md.
- **Overengineering [LEAN]**: Single numeric constant export. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The name hints at RTP but 'ANCIENT' is opaque without context explaining which game mode or configuration this applies to.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant used locally in getPayMultiplier function at line 15.
- **Duplication [UNIQUE]**: Domain-specific lookup table for slot paytable. No similar structures found.
- **Correction [OK]**: All six symbol rows exactly match the multiplier table in .anatoly/docs/02-Architecture/02-Core-Concepts.md.
- **Overengineering [LEAN]**: Flat Record mapping symbol names to fixed-length tuples. Directly mirrors the documented paytable with no unnecessary indirection.
- **Tests [NONE]**: No test file exists. Module-private table, but correctness of payout values is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported and the tuple structure is readable, but the index semantics (3-of-a-kind → index 0, 4 → 1, 5 → 2) are implicit and undocumented.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: Simple lookup function returning multiplier for symbol/count pair. RAG match (computeLegacyPayout, score 0.707) is a higher-level payout calculation function that uses getPayMultiplier internally—different semantic contracts and abstraction levels.
- **Correction [OK]**: Index mapping (count 3→row[0], 4→row[1], 5→row[2]) is correct; returns 0 for missing symbols or out-of-range counts.
- **Overengineering [LEAN]**: Straightforward index lookup using three explicit conditionals. Could use `row[count - 3]` instead, but the explicit checks are readable and the function is minimal.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical business logic for payout calculation with no coverage for valid symbols, unknown symbols (returns 0), and all count branches (3/4/5 and <3).
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of what 'count' valid values are (3–5), what 0 return means, and that WILD/SCATTER symbols are not handled.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers. No files import this symbol.
- **Duplication [DUPLICATE]**: Identical logic to checkLine: same WILD/SCATTER handling, same consecutive-symbol-matching algorithm, same >= 3 threshold. Differs only in return object field names (symbol/count vs sym/run). Semantic behavior is interchangeable.
- **Correction [OK]**: WILD-substitution logic, consecutive-run counting, and SCATTER/all-WILD null returns are all correct for standard left-to-right payline evaluation.
- **Overengineering [LEAN]**: Single-pass left-to-right scan with WILD substitution logic. Logic is exactly what the domain requires for payline evaluation; no unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Complex logic covering WILD substitution, SCATTER early-exit, consecutive-match counting, and count threshold (>=3) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with non-trivial logic and no JSDoc. Missing: description of WILD substitution semantics, left-to-right consecutive counting rule, why WILD/SCATTER anchors return null, and the minimum count threshold of 3.

> **Duplicate of** `src/engine.ts:checkLine` — 99% identical—both extract first non-WILD symbol, count consecutive matches including WILDs, return null if < 3 matches, else return symbol and count

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE uses `Record<string, [number, number, number]>` with an unbounded string key. Since not all Symbol values have paytable entries (WILD, SCATTER do not), `Partial<Record<Symbol, readonly [number, number, number]>>` would constrain keys to the valid symbol union and surface typos at compile time. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable arrays. Neither `as const` nor `readonly` tuples are used, allowing runtime mutation of payout tables — critical for a certified gambling paytable. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | ANCIENT_RTP, getPayMultiplier, and lineWins are all exported with no JSDoc. In a regulated gambling context, documenting RTP constants and payout logic is critical for audit trails. [L3, L14, L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is a strong candidate for the `satisfies` operator: it would validate entries against the known symbol set while preserving literal tuple types for index access, catching missing or misspelled symbol names at compile time. [L5-L12] |

### Suggestions

- Use `satisfies` to constrain PAY_TABLE keys to valid non-WILD/SCATTER symbols and make tuple values readonly, catching typos at compile time and preventing mutation.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  };
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
- Add JSDoc to all public exports for compliance auditability in a regulated gambling context.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Certified return-to-player ratio for the ancient-theme variant (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a given symbol and match count.
   * @param symbol - The matched reel symbol (never WILD or SCATTER).
   * @param count - Number of consecutive matches (3, 4, or 5).
   * @returns Base multiplier, or 0 if no qualifying match.
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
