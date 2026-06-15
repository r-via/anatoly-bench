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
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 correctly represents the documented 95% RTP target.
- **Overengineering [LEAN]**: Single named constant for the RTP value. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Exported constant used in RTP calculations has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported constant with no comment explaining what RTP value it represents, which game mode it applies to, or how it is consumed by the engine.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported symbol used locally in getPayMultiplier at line 16
- **Duplication [UNIQUE]**: Configuration table with no duplicates found in RAG results.
- **Correction [OK]**: All six symbol tuples match the documented [3-match, 4-match, 5-match] multipliers exactly.
- **Overengineering [LEAN]**: Flat lookup table mapping symbols to fixed payout tuples. Exactly the right structure for tabular pay data.
- **Tests [NONE]**: No test file exists. Internal lookup table is implicitly exercised only through getPayMultiplier, which is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private constant, so lower severity, but the tuple index semantics ([3-match, 4-match, 5-match] multipliers on lineBet) are not obvious from the declaration alone and go unexplained.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Index mapping is correct: row[0]=3-match, row[1]=4-match, row[2]=5-match; WILD/SCATTER correctly return 0 via missing-row guard.
- **Overengineering [LEAN]**: Direct index lookup with three if-branches for counts 3/4/5. No abstraction beyond what the task requires.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical payout logic covering all 6 symbols, counts 3/4/5, unknown symbol fallback (returns 0), and count<3 fallback are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported function. Neither parameter is described (`count` requires knowing it means matched-symbol run length 3–5), the return unit (multiplier applied to lineBet) is absent, and the 0 fallback for unknown symbols or counts outside 3–5 is unspecified.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine: same WILD/SCATTER handling, consecutive symbol counting loop, >=3 threshold check. Only variable names differ (first→lead, count→run, object properties symbol→sym, count→run).
- **Correction [OK]**: Lead-symbol detection (first non-WILD via find, fallback to WILD sentinel → null) and left-to-right consecutive counting correctly implement the documented algorithm; SCATTER and all-WILD cases return null as required.
- **Overengineering [LEAN]**: Straightforward left-to-right scan matching the documented algorithm: resolve lead symbol, count consecutive matches, return win record or null. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. WILD substitution logic, leading WILD resolution, SCATTER early-return, consecutive-match break, and count<3 null return are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported function with non-trivial behavior: WILD-skipping lead-symbol detection, left-to-right consecutive-match logic, SCATTER exclusion, and null return semantics are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical implementation — both extract leading non-WILD symbol, count consecutive matches or wildcards, return when run >=3

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a fully mutable Record and its tuple values can be mutated at runtime. Neither as const nor Readonly modifiers are applied. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | ANCIENT_RTP, getPayMultiplier, and lineWins are all exported without JSDoc. In a regulated-gaming domain the semantics of ANCIENT_RTP and the contract of lineWins (e.g. that it does not track wildCount) are non-obvious and warrant documentation. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is typed with an explicit Record annotation, erasing the literal tuple types. The satisfies operator would validate structure while retaining narrower inference (e.g. row[0] as 2 rather than number), enabling exhaustiveness checks in consumers. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. The project defines a LineWin interface (per .anatoly/state/internal-docs/02-Architecture/03-Data-Flow.md). lineWins returns an anonymous inline structural subtype { symbol: Symbol; count: number } rather than a named PartialLineWin or LineMatch type, reducing API discoverability and making the relationship to LineWin opaque to consumers. [L23] |

### Suggestions

- Apply satisfies + as const to PAY_TABLE to enforce immutability and retain literal tuple types while keeping the Record validation
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Narrow the PAY_TABLE key type from string to the payable symbol subset to surface missing entries at compile time
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... };
  // After
  type PayableSymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;
  const PAY_TABLE = { ... } as const satisfies Record<PayableSymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all three public exports and name the lineWins return type
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** RTP target for the Ancient-theme variant (95%). Used by the engine's payout formula. */
  export const ANCIENT_RTP = 0.95;
  
  /** Returns the pay multiplier for `symbol` matched `count` times. Returns 0 for < 3 matches or unknown symbols. */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export type LineMatch = { readonly symbol: Symbol; readonly count: number };
  
  /**
   * Identifies the leading symbol and consecutive match count for a payline.
   * Does not compute wildCount — that is handled by the engine.
   * Returns null when no 3+ match exists or the lead symbol is WILD/SCATTER.
   */
  export function lineWins(symbols: Symbol[]): LineMatch | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
