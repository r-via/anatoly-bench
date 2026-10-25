# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 88% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 88% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Simple exported numeric constant; no similar symbol found.
- **Correction [OK]**: Constant is not computed from anything in this file. The docs state no RTP contract to check it against. It has no importers, which is a Utility-axis matter.
- **Overengineering [LEAN]**: Single exported numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data constant; no similar symbol found.
- **Correction [OK]**: Each row is a self-consistent [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] triple. No contract states other values, and no RTP can be derived from this file alone.
- **Overengineering [LEAN]**: Plain data table mapping symbols to multipliers for 3/4/5 matches.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Maps count 3, 4 and 5 to the matching row index. Symbols missing from the table (WILD, SCATTER) and other counts return 0 safely.
- **Overengineering [LEAN]**: Simple lookup with count branching. Direct and minimal.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Line-for-line identical logic to checkLine: resolves lead symbol skipping leading WILDs, returns null for WILD/SCATTER, counts consecutive matches or WILDs, returns result when >=3. Only the return field names differ (symbol/count vs sym/run).
- **Correction [OK]**: Resolves leading WILDs to the first non-WILD symbol, returns null for SCATTER or all-WILD lines, and counts the consecutive run of matching symbols or WILDs. It requires at least 3. It has no callers, so any disposition belongs to the Utility axis.
- **Overengineering [LEAN]**: Straightforward wild-aware left-to-right match counting. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~100% identical logic; differs only in result property names (symbol/count vs sym/run)

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is Record<string, ...> rather than Record<Symbol, ...>/Partial<Record<Symbol,...>>, losing key checking. The `if (!row)` guard is needed only because of the loose key type. [L3-L10] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a mutable record with mutable tuples; `lineWins` takes a mutable `Symbol[]` and returns a mutable object. Should use readonly tuples/ReadonlyArray, or `as const satisfies`. [L3-L10] |
| 8 | ESLint compliance | WARN | HIGH | Imported `Symbol` shadows the global `Symbol` (no-shadow/no-redeclare of builtin globals). Only flagged as WARN since it is a type-only import and the name is defined in types.ts. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | ANCIENT_RTP, getPayMultiplier and lineWins are all exported without JSDoc. [L3, L12, L20] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies Record<PayableSymbol, readonly [number, number, number]>` with `as const` to keep literal types and enforce key coverage. [L3-L10] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: `getPayMultiplier` uses a magic count-to-index mapping with repeated if-chains, and `lineWins` returns an untyped inline result shape instead of the shared LineWin type. When the first symbol is WILD and all symbols are WILD, it returns null, so an all-wild line pays nothing. This may be intended behavior, but it is not documented. [L12-L38] |

### Suggestions

- Type the pay table by symbol and make it immutable
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
  // After
  const PAY_TABLE = {
    CHERRY: [2, 5, 25],
    // ...
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Replace the if-chain with an index lookup and add JSDoc
  ```typescript
  // Before
  if (count === 3) return row[0];
  if (count === 4) return row[1];
  if (count === 5) return row[2];
  return 0;
  // After
  /** Returns the pay multiplier for `count` (3-5) matching `symbol`, or 0. */
  const idx = count - 3;
  return idx >= 0 && idx < row.length ? row[idx] : 0;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
