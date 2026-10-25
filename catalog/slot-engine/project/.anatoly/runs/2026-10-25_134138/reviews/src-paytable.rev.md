# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 85% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 88% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Single exported numeric constant; no similar symbol found.
- **Correction [OK]**: Constant of 0.95. No documented contract or in-file formula to check it against.
- **Overengineering [LEAN]**: Plain numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data literal; no similar symbol found.
- **Correction [OK]**: Multipliers increase with symbol rank and with match count 3, 4, 5. No documented target contradicts them.
- **Overengineering [LEAN]**: Simple lookup table of symbol to [3, 4, 5]-of-a-kind multipliers. A data-driven table suits the purpose.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG; looks up multiplier by symbol and count.
- **Correction [OK]**: Maps counts 3, 4 and 5 to row indexes 0, 1 and 2. Returns 0 for unknown symbols such as WILD and SCATTER, and for other counts.
- **Overengineering [LEAN]**: Direct table lookup with count-to-index mapping. Minimal and clear.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is identical to checkLine: same WILD-leading resolution, same WILD/SCATTER rejection, same run counting with WILD substitution, same >=3 threshold. Only local names (first/count vs lead/run) and return field names (symbol/count vs sym/run) differ.
- **Correction [OK]**: Resolves a leading WILD to the first non-WILD symbol and returns null if that is WILD or SCATTER. Counts the consecutive run of matching symbols or WILD and requires at least 3. This matches the behavior described for the legacy consumer. Having no importers is a Utility-axis matter.
- **Overengineering [LEAN]**: Single-pass consecutive-match counter with wild handling. It does only what the payline rules need.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~100% identical logic — both find leading symbol with WILD substitution and count consecutive matches, returning null below 3

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is Record<string, ...> keyed by plain string, so `Symbol` is not checked against table keys and the `!row` guard is needed. Use Partial<Record<Symbol, ...>> or a Record over the payable subset. [L3-L10] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE and its tuples are mutable. `symbols: Symbol[]` parameter is not readonly. Not mutated in place, so WARN. [L3-L10, L21] |
| 8 | ESLint compliance | WARN | HIGH | Importing `Symbol` type shadows the global `Symbol` (no-shadow / no-redeclare on builtin globals). The type is defined in types.ts, so this is a minor concern here. No unused vars or other obvious violations. [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Three exports lack JSDoc. The contract is not obvious from the signatures: `count` is the consecutive-match count (3-5 valid), and `ANCIENT_RTP` has no units or meaning. `lineWins` has wild/scatter semantics and returns null for no win. Mostly self-describing, so WARN. [L3, L12, L20] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies Record<PayableSymbol, readonly [number, number, number]>` with `as const` to keep literal types and check keys. [L3-L10] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. The `count` branches (3/4/5) are hard-coded and could index the row by `count - 3`. Separately, `lineWins` has no cap on `count` beyond the table length, so lines longer than 5 return a count with no pay. That is a correctness concern, not flagged further here. [L12-L18] |

### Suggestions

- Key the pay table by payable symbols, make it readonly, and check it with satisfies
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
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to the exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Target return-to-player ratio (0..1) for the ancient pay table. */
  export const ANCIENT_RTP = 0.95;
  ```
- Take readonly input
  - Before: `export function lineWins(symbols: Symbol[])`
  - After: `export function lineWins(symbols: readonly Symbol[])`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
