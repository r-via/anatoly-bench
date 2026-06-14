# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 93% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but has 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Numeric constant. No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations; no coverage of its value or downstream effect.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The constant's purpose (target RTP for this paytable configuration), its range, and how it is consumed by the engine are not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced locally in getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Payout lookup table. No similar data structures found in RAG results.
- **Correction [OK]**: All six symbol rows match the authoritative pay table exactly (3-match, 4-match, 5-match indices).
- **Overengineering [LEAN]**: Flat lookup table mapping six symbols to fixed 3-tuples. No abstraction needed beyond what's here.
- **Tests [NONE]**: No test file exists. Module-private table; correctness of payout values is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple layout [3-match, 4-match, 5-match] and the unit (multiplier applied to lineBet) are non-obvious and undocumented.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Index mapping correct: row[0]=3-match, row[1]=4-match, row[2]=5-match; returns 0 for unknown symbols and counts outside 3–5.
- **Overengineering [LEAN]**: Straight index into PAY_TABLE with a count→tuple-position switch. Three if-branches for three valid counts is the minimal expression of this logic.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with zero test coverage across all count branches (3/4/5), unknown symbols, and boundary inputs.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing: description of what 'count' represents, valid values (3/4/5), return value semantics (multiplier applied to lineBet), and behavior when symbol or count is unrecognized (returns 0).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but has 0 runtime importers and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine (RAG score 0.823). Both extract leading symbol, validate against WILD/SCATTER, count consecutive matches including WILDs, return result if count >= 3. Functions are interchangeable.
- **Correction [OK]**: Lead-symbol detection and consecutive-run counting correctly implement the documented left-to-right algorithm: WILDs at head are counted, SCATTER/all-WILD cases return null, first mismatch breaks the run.
- **Overengineering [LEAN]**: Implements the documented left-to-right lead-symbol scan in one pass with no unnecessary abstraction. Early-return on WILD/SCATTER head case is idiomatic.
- **Tests [NONE]**: No test file exists. Complex WILD-substitution and consecutive-match logic — leading WILDs, all-WILD lines, SCATTER short-circuits, and count < 3 paths are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial logic: WILD substitution for lead-symbol detection, left-to-right consecutive matching, SCATTER exclusion, and minimum-3 threshold are all undocumented. Return type semantics (null vs. win record) also unexplained.

> **Duplicate of** `src/engine.ts:checkLine` — Functionally identical implementation with only variable naming differences (first/lead, count/run, symbol/sym)

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `PAY_TABLE: Record<string, [number, number, number]>` uses `string` as the key type when the imported `Symbol` type (a string-literal union) is directly available. `Record<Symbol, ...>` would prevent accidental lookups with arbitrary strings. [L5] |
| 5 | Immutability | WARN | MEDIUM | Two immutability gaps: (1) `PAY_TABLE` inner tuples are mutable — type should be `readonly [number, number, number]` or the object declared `as const`; (2) `symbols: Symbol[]` parameter in `lineWins` should be `readonly Symbol[]` since the function never mutates it. [L5, L23] |
| 6 | Interface vs Type | WARN | MEDIUM | `lineWins` returns an anonymous inline object type `{ symbol: Symbol; count: number }`. Extracting it to a named type alias (e.g. `type LineMatchResult`) or reusing an existing interface improves readability and shareability across the engine. [L23] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports — `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` — lack JSDoc. `ANCIENT_RTP` especially needs documentation: the name does not communicate that it is the engine's target RTP constant (0.95 = 95%). [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is a prime candidate for the `satisfies` operator: it would validate each entry against the tuple type while preserving the literal structure for accurate index inference. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling/casino domain inferred from symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, PAY_TABLE, RTP). In regulated gaming code, the financial pay table's key type being `string` rather than the constrained `Symbol` union weakens the type-level guarantee that every possible Symbol has a defined payout entry and that no out-of-domain string can silently return 0 from `getPayMultiplier`. [L5] |

### Suggestions

- Use `Symbol` as key type and `readonly` tuples for PAY_TABLE, optionally with `satisfies`
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
- Make `symbols` parameter readonly in `lineWins`
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: ReadonlyArray<Symbol>): ...`
- Extract anonymous return type to a named alias
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null
  // After
  type LineMatchResult = { readonly symbol: Symbol; readonly count: number };
  export function lineWins(symbols: ReadonlyArray<Symbol>): LineMatchResult | null
  ```
- Add JSDoc to all public exports; clarify ANCIENT_RTP name
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Theoretical Return-to-Player for this paytable: 95% (house edge 5%). */
  export const ANCIENT_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
