# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 88% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Single exported numeric constant; no similar symbol found.
- **Correction [OK]**: Constant 0.95 has no consumers. No formula or doc in the given context contradicts it, and the pay table's RTP can't be derived without reel weights.
- **Overengineering [LEAN]**: Single exported numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data literal; no similar table found in RAG results.
- **Correction [OK]**: Multipliers increase with match count (3, 4, 5) and with symbol rank. No documented contract conflicts with them.
- **Overengineering [LEAN]**: Plain data table of multipliers per symbol; simplest representation.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found. Maps symbol and count to multiplier from PAY_TABLE.
- **Correction [OK]**: Maps counts 3, 4 and 5 to row[0], row[1] and row[2]. It returns 0 for unknown symbols and other counts.
- **Overengineering [LEAN]**: Simple table lookup with count mapping. Could index row[count-3], but explicit branches are clear and minimal.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic matches checkLine line for line: WILD-lead resolution, WILD/SCATTER rejection, consecutive run counting with WILD substitution, threshold of 3. Only the names differ (symbol/count vs sym/run). The two are interchangeable.
- **Correction [OK]**: A leading WILD resolves to the first non-WILD symbol. WILD or SCATTER lines return null. The prefix count treats WILD as a match and requires at least 3. The function has no importers, which is a Utility-axis matter rather than a correctness bug.
- **Overengineering [LEAN]**: Straightforward wild-aware consecutive match counting; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~100% identical logic; differs only in variable and field names (symbol/count vs sym/run)

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | FAIL | MEDIUM | PAY_TABLE is a mutable Record of mutable tuples; function parameters `symbols: Symbol[]` are mutable; return type is not readonly. README's SpinResult uses ReadonlyArray, so the convention is readonly. [L5-L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | ANCIENT_RTP, getPayMultiplier and lineWins are all exported without JSDoc. The meaning of ANCIENT_RTP and the WILD/SCATTER semantics in lineWins are non-obvious. [L3-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies Record<PayableSymbol, readonly [number, number, number]>` with `as const` to type-check keys and drop the `if (!row)` fallback. Keys are plain strings, so a typo or a missing symbol goes uncaught. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | `Record<string, ...>` indexed by a `Symbol` loses key safety. Magic numbers 3/4/5 in getPayMultiplier are hardcoded instead of indexing by count-3. The ANCIENT_RTP value (0.95) is hardcoded and disconnected from the PAY_TABLE values. [L5-L22] |

### Suggestions

- Make PAY_TABLE immutable and keyed by payable symbols, validated with satisfies
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2, 5, 25],
    ...
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2, 5, 25],
    LEMON:   [2, 5, 25],
    BELL:    [5, 20, 100],
    BAR:     [10, 40, 200],
    SEVEN:   [25, 100, 500],
    DIAMOND: [50, 250, 1000],
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Replace the count branches with an index lookup
  ```typescript
  // Before
  if (count === 3) return row[0];
  if (count === 4) return row[1];
  if (count === 5) return row[2];
  return 0;
  // After
  return row[count - 3] ?? 0;
  ```
- Add JSDoc to public exports and use readonly parameters
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Resolves a payline's winning symbol and run length (WILD substitutes; SCATTER never pays). */
  export function lineWins(symbols: readonly Symbol[]): { readonly symbol: Symbol; readonly count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
