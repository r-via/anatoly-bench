# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Simple exported numeric constant; no similar symbol found.
- **Correction [OK]**: Constant of 0.95. No documented contract or formula in the provided context contradicts it.
- **Overengineering [LEAN]**: Single exported numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data literal; no similar symbol found.
- **Correction [OK]**: The table is internally consistent, with payouts increasing by count and by symbol tier. No stated contract contradicts the values.
- **Overengineering [LEAN]**: Plain data lookup table; simplest representation of pay multipliers.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Maps count 3, 4 and 5 to the correct row indices. It returns 0 for an unknown symbol or any other count.
- **Overengineering [LEAN]**: Simple table lookup with count-to-index mapping. The if-chain could be `row[count-3]`, but it's clear and minimal.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Line-for-line identical logic to checkLine: resolves lead symbol through leading WILDs, rejects WILD/SCATTER, counts consecutive matches or wilds, requires >=3. Only the local names (first/count vs lead/run) and result keys (symbol/count vs sym/run) differ.
- **Correction [OK]**: Resolves a leading WILD to the first non-WILD symbol. It returns null for an all-WILD or SCATTER lead. It counts consecutive matches, with WILD substituting, and requires at least 3. An empty input safely returns null. The function has no callers, which is a Utility concern, not a correction defect.
- **Overengineering [LEAN]**: Straightforward single-pass wild-aware prefix match; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — Identical algorithm (wild-substituted leading run of >=3); differs only in variable names and result field names (symbol/count vs sym/run)

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 3 | Discriminated unions | WARN | MEDIUM | PAY_TABLE is keyed by plain string, so `PAY_TABLE[symbol]` is untyped lookup; the `!row` guard is needed only because the key type is not tied to Symbol. Return type of lineWins is a plain object with no tagged result. [L5-L13] |
| 4 | Utility types | WARN | MEDIUM | `Record<string, ...>` is too wide. Use `Partial<Record<Symbol, PayRow>>` or a `Record` over a payable-symbol subset (excluding WILD/SCATTER). [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuples are mutable; the table should be `as const`/readonly. `symbols` param is `Symbol[]` instead of `readonly Symbol[]`. [L5-L12, L22] |
| 8 | ESLint compliance | WARN | HIGH | `Symbol` import shadows the global `Symbol` (no-shadow / no-redeclare for builtin globals). Mixed `??` inside a ternary without parentheses hurts readability (no-mixed-operators / no-nested-ternary style). [L1, L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | ANCIENT_RTP, getPayMultiplier and lineWins have no JSDoc. The meaning of ANCIENT_RTP and the units of multipliers (x line bet) are undocumented. [L3, L15, L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies Record<PayableSymbol, readonly [number, number, number]>` with `as const` would give key checking while preserving literal types. |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from the paytable, reels and jackpot vocabulary. Magic numbers 3/4/5 in getPayMultiplier duplicate the row indexing, so a `row[count - 3]` lookup would be cleaner and safer. lineWins also leaves a leading-WILD line unresolved when every symbol is WILD, and WILD pays nothing despite wild-only runs. |

### Suggestions

- Type and freeze the pay table with satisfies, and index by count.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2, 5, 25],
  };
  ...
  if (count === 3) return row[0];
  if (count === 4) return row[1];
  if (count === 5) return row[2];
  return 0;
  // After
  const PAY_TABLE = {
    CHERRY: [2, 5, 25],
    // ...
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ...
  const idx = count - 3;
  return idx >= 0 && idx < 3 ? row[idx] : 0;
  ```
- Add JSDoc and a named result type for the public API.
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  export interface LineWin { readonly symbol: Symbol; readonly count: number }
  
  /** Returns the winning symbol and run length for a payline, or null if fewer than 3 match. */
  export function lineWins(symbols: readonly Symbol[]): LineWin | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
