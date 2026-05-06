# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime and 0 type-only importers
- **Duplication [UNIQUE]**: Constant export for RTP value, no semantic duplicates found
- **Correction [OK]**: Constant 0.95 matches no contradicted claim in the provided docs.
- **Overengineering [LEAN]**: Single named constant for RTP configuration. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name is cryptic — 'ANCIENT' qualifier is unexplained, and there is no description of what RTP governs, its units, or where it is applied.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Constant Record mapping symbols to pay multipliers, no semantic duplicates found
- **Correction [OK]**: All six symbol rows match the paytable in .anatoly/docs/02-Architecture/02-Core-Concepts.md exactly.
- **Overengineering [LEAN]**: Flat Record mapping symbol strings to a fixed 3-tuple. Matches the documented paytable exactly (`.anatoly/docs/02-Architecture/02-Core-Concepts.md`). No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Private constant is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal constant; tuple layout [3-match, 4-match, 5-match] is inferrable from data, but no comment confirms it. Lenient due to private scope, but the semantics (multiplier vs. flat payout) are not obvious.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found
- **Correction [OK]**: Index mapping is correct: row[0]=3-of-a-kind, row[1]=4-of-a-kind, row[2]=5-of-a-kind; returns 0 for unknown symbol or count outside {3,4,5}.
- **Overengineering [LEAN]**: Direct index lookup into the 3-tuple with explicit count guards. Minimal logic for the documented (symbol, count) → multiplier contract.
- **Tests [NONE]**: No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for any count branch (3/4/5), unknown symbol, or zero-return paths.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of what 'multiplier' means (applied to line bet?), valid range of `count`, return value of 0 for unrecognized symbols or counts below 3.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine in engine.ts: both determine leading symbol, count consecutive matches with WILD wildcard handling, return null if count < 3
- **Correction [OK]**: Leading-WILD resolution, consecutive-run counting, and SCATTER/all-WILD short-circuits are all correct. count includes WILDs, matching the documented LineWin.count semantics (matching positions from left: 3–5).
- **Overengineering [LEAN]**: Single-pass left-to-right count with WILD substitution and early break. Correctly excludes WILD/SCATTER as anchor symbols per the `LineWin` contract. Logic is proportionate to the spec requirements.
- **Tests [NONE]**: No test file exists. No coverage for WILD-prefix substitution, SCATTER early-return, count < 3 null return, mid-sequence break, or all-WILD edge case.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: purpose (evaluates a single payline left-to-right), WILD substitution logic, why SCATTER/all-WILD lines return null, minimum match threshold of 3, and early-break behavior.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical logic; differs only in property names (symbol/count vs sym/run) and local variable names (first/count vs lead/run)

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable at runtime. Declare as Record<string, readonly [number, number, number]> or use as const to prevent accidental mutation of the lookup table. [L5-L13] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline object type { symbol: Symbol; count: number } instead of a named type or Pick<LineWin, 'symbol' \| 'count'>. LineWin is documented in src/types.ts (.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md). Inconsistent with project interface convention. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. At minimum getPayMultiplier and lineWins should document parameters and return semantics. [L3,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from the satisfies operator to validate keys against the Symbol union while preserving tuple literal types: PAY_TABLE satisfies Record<Symbol, readonly [number, number, number]>. [L5-L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two slot-game-specific issues: (1) PAY_TABLE key is string instead of Symbol, allowing invalid symbol names to be indexed without a compile error. (2) lineWins (plural) returns a single result or null — misleading name in a domain where payline evaluation already implies multiple lines; should be lineWin (singular). Both reduce domain model fidelity. [L5,L23] |

### Suggestions

- Type PAY_TABLE key as Symbol and mark tuple values readonly for compile-time safety
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    ...
  } satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Replace anonymous inline return type with Pick<LineWin, 'symbol' | 'count'> for consistency with the documented LineWin interface
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWin(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {`
- Add JSDoc to public exports to document parameters and return semantics
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base pay multiplier for a symbol match.
   * @param symbol - The matched symbol (never WILD or SCATTER).
   * @param count - Number of consecutive matches (3–5).
   * @returns Multiplier to apply to line bet, or 0 if no qualifying match.
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
