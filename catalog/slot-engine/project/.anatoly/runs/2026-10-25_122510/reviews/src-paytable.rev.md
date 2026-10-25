# Review: `src/paytable.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 88% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 88% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Simple RTP constant; no similar symbol found.
- **Correction [OK]**: Constant with no in-file logic to verify. The code shows no reel weights, so the 0.95 RTP claim can't be derived.
- **Overengineering [LEAN]**: Single exported numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data constant; no similar symbol found.
- **Correction [OK]**: Pay multipliers rise monotonically with symbol rank and match count. No contract states different values.
- **Overengineering [LEAN]**: Plain data table for payouts; simplest representation.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found; consumed by engine and legacy modules.
- **Correction [OK]**: Maps counts 3, 4 and 5 to row indexes 0, 1 and 2. Unknown symbols and other counts return 0.
- **Overengineering [LEAN]**: Simple lookup by match count with a safe default of 0.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic identical to checkLine: same WILD-lead resolution, same WILD/SCATTER rejection, same run counting, same threshold of 3. Only variable names and return field names differ (symbol/count vs sym/run).
- **Correction [OK]**: Resolves a leading WILD to the first non-wild symbol. Returns null for a WILD-only or SCATTER line. Counts consecutive matches from the left, with WILD matching, and requires at least 3. This matches the behavior described for computeLegacyPayout.
- **Overengineering [LEAN]**: Straightforward leading-wild resolution and consecutive-match count. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~100% identical logic; differs only in local names and returned field names

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is Record<string, ...>; keys should be constrained to the pay symbols (e.g. Partial<Record<Symbol, ...>>). Symbol is used as an index and compared to "WILD", so the typing is loose. [L3-L10] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is mutable with mutable tuple values. The `symbols` param is not readonly. [L3-L10] |
| 8 | ESLint compliance | WARN | HIGH | Imported `Symbol` shadows the global Symbol (no-shadow / no-redeclare on builtin globals). The mixed `??` / ternary expression on L18 is hard to read. Fixed-width alignment spaces may trip formatters. [L1, L18] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | ANCIENT_RTP, getPayMultiplier and lineWins have no JSDoc. The count semantics (3/4/5 of a kind) and the null return are undocumented. [L3, L12, L21] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies` with `as const` to keep the literal keys and tuple types. [L3-L10] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot/gaming domain: multipliers are plain numbers with no integer or money guard, and the count-to-index mapping is hard-coded as magic numbers. The payouts themselves are computed by consumers, so there is no float-money violation here. The lineWins logic duplicates computeLegacyPayout in legacy.ts, which also resolves a leading WILD and counts matches. [L12-L19] |

### Suggestions

- Type the pay table with satisfies and readonly tuples keyed by Symbol.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
  // After
  const PAY_TABLE = {
    CHERRY: [2, 5, 25],
    // ...
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Make the input readonly and rename the imported type to avoid shadowing the global Symbol.
  - Before: `export function lineWins(symbols: Symbol[])`
  - After: `export function lineWins(symbols: readonly SlotSymbol[])`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
