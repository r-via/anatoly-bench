# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 88% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Single exported numeric constant; no similar symbol found.
- **Correction [OK]**: Constant of 0.95. The visible code has no reel weights, so the RTP target can't be checked against it.
- **Overengineering [LEAN]**: Single numeric constant; trivial.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data mapping; no similar symbol found.
- **Correction [OK]**: Pay values rise monotonically with symbol rarity and with match count. The table has no contract to check it against.
- **Overengineering [LEAN]**: Plain data table keyed by symbol; appropriate declarative representation.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found. Lookup of multiplier by symbol and count.
- **Correction [OK]**: Maps counts 3, 4 and 5 to the right row index. Returns 0 for unknown symbols and other counts.
- **Overengineering [LEAN]**: Simple lookup with count-to-index mapping. Explicit branches are clear; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic identical to checkLine: same wild-leading lead resolution, same WILD/SCATTER bail-out, same run counting, same >=3 threshold. Only variable names (first/count vs lead/run) and returned property names (symbol/count vs sym/run) differ.
- **Correction [OK]**: Leading WILDs take the first non-WILD symbol. Lines led by SCATTER or made only of WILDs return null. The loop counts consecutive matches (WILD matches any) and requires at least 3. Having no importers is a Utility-axis matter, not a correctness issue.
- **Overengineering [LEAN]**: Straightforward wild-aware left-to-right match counting; minimal logic for the requirement.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~99% identical logic — both find the leading non-wild symbol and count its consecutive run (wilds included), returning null below 3

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 3 | Discriminated unions | WARN | MEDIUM | PAY_TABLE is keyed by string, so `PAY_TABLE[symbol]` is an untyped lookup. `Symbol` is presumably a string-literal union, so a typed record would remove the runtime `!row` guard and make it exhaustive. [L5-L12] |
| 4 | Utility types | WARN | MEDIUM | `Record<string, ...>` is too loose. Use `Partial<Record<Symbol, ...>>` (WILD and SCATTER have no pay row) or a Record over a payable-symbol subset. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is mutable and holds mutable tuples. The `symbols` parameter is a mutable array. Use `as const`/`readonly` tuples and `readonly Symbol[]`. [L5-L12, L24] |
| 8 | ESLint compliance | WARN | HIGH | `import type { Symbol }` shadows the global `Symbol` (no-shadow / no-redeclare on builtin globals). The mixed `??` and ternary on L25 hurts readability and may trigger no-nested-ternary or no-mixed-operators style rules. [L1, L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | ANCIENT_RTP, getPayMultiplier and lineWins have no JSDoc. The semantics of wild substitution, the 3/4/5 count mapping and the RTP constant are undocumented. [L3, L14, L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies Partial<Record<Symbol, readonly [number, number, number]>>` to keep literal types while checking keys. [L5-L12] |

### Suggestions

- Type the pay table by symbol and make it immutable with `satisfies`.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
  };
  // After
  const PAY_TABLE = {
    CHERRY: [2, 5, 25],
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Accept a readonly array and add JSDoc to the exports.
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Evaluates one payline left to right, with WILD substituting; returns null if fewer than 3 match. */
  export function lineWins(symbols: readonly Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
