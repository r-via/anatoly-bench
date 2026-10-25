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
- **Duplication [UNIQUE]**: Simple exported numeric constant; no similar symbol found in RAG.
- **Correction [OK]**: Plain constant. The RTP derivation is not checkable from this file, and no contract contradicts 0.95.
- **Overengineering [LEAN]**: Single numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data constant; no similar symbol found in RAG.
- **Correction [OK]**: Multipliers rise monotonically with symbol rarity and match count. No documented contract contradicts them.
- **Overengineering [LEAN]**: Plain data lookup table; simplest representation for pay multipliers.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG.
- **Correction [OK]**: Maps counts 3, 4 and 5 to the matching row index. It returns 0 for an unknown symbol or any other count.
- **Overengineering [LEAN]**: Simple table lookup with count branching. Could index by count-3, but explicit branches are clear and minimal.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic matches checkLine line for line: WILD-leading lead resolution, early null for WILD/SCATTER, left-to-right run count treating WILD as match, return when run >= 3. Only the names (first/count vs lead/run, symbol vs sym) differ. The two are interchangeable.
- **Correction [OK]**: A leading WILD takes the first non-WILD symbol. Lines led by SCATTER or by an all-WILD line return null. Consecutive matches are counted from the left, with WILD matching, and a win needs 3 or more. This matches the logic described for the legacy consumer, and no importers exist, so unused-code concerns belong to the Utility axis.
- **Overengineering [LEAN]**: Straightforward left-to-right wild-aware match counting; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~100% identical logic, differing only in local variable and return field names (symbol/count vs sym/run)

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is typed Record<string, ...>. Keying it by the payable symbol subset would make the lookup type-checked and remove the `!row` fallback. [L5-L12] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a shared mutable constant with mutable tuple rows. The `symbols` parameter is a mutable array although it is only read. Nothing is mutated in place. [L5-L12, L22] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exports lack JSDoc. The ANCIENT_RTP unit is implicit (fraction vs percent). The `count` range for getPayMultiplier (3-5) is not documented. The WILD/SCATTER handling in lineWins is not documented. The names are largely self-describing, so this is WARN. [L3, L14, L22] |

### Suggestions

- Key the paytable by payable symbols, make it readonly, and use `satisfies`
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  };
  // After
  type PayableSymbol = Exclude<Symbol, "WILD" | "SCATTER">;
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    ...
  } as const satisfies Record<PayableSymbol, readonly [number, number, number]>;
  ```
- Accept a readonly array and add JSDoc to the exports
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Returns the winning symbol and consecutive left-to-right count (>= 3, WILD substitutes), or null. */
  export function lineWins(symbols: readonly Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
