# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 88% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers across the codebase
- **Duplication [UNIQUE]**: Simple numeric constant. No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target.
- **Overengineering [LEAN]**: Single constant; matches documented 95% RTP target directly.
- **Tests [NONE]**: No test file exists. Constant exported and presumably used in RTP calculations — no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name hints at a return-to-player value but the significance of 'ANCIENT', the context in which it is applied, and the fact that it represents a ratio (not a percentage) are not documented.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced locally by getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Static lookup table for symbol payouts. No similar tables found in RAG results.
- **Correction [OK]**: All six symbol rows match the documented [3-match, 4-match, 5-match] multipliers exactly.
- **Overengineering [LEAN]**: Flat record of tuples is the minimal structure for a fixed 6-symbol, 3-column pay table. No abstraction needed.
- **Tests [NONE]**: No test file exists. Internal constant, but its values directly determine payout correctness — zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple structure [3-match, 4-match, 5-match] and the unit of each value (multiplier applied to lineBet) are not explained.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: Looks up pay multiplier from table by symbol and count. No similar functions found in RAG.
- **Correction [OK]**: Index mapping count 3→0, 4→1, 5→2 is correct; returns 0 for missing symbols and out-of-range counts.
- **Overengineering [LEAN]**: Explicit if-chain over three match counts is clear and minimal. Array indexing (row[count-3]) would be equivalent but not simpler in intent.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid counts (3/4/5), unknown symbols, or boundary counts (0, 1, 2, 6+).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of the parameter semantics (valid count values: 3–5), the return value unit (multiplier, not credits), and the 0-return behaviour for unknown symbols or out-of-range counts.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers across the codebase
- **Duplication [DUPLICATE]**: Logic identical to checkLine (RAG 0.823): both identify leading symbol handling WILD, count consecutive matches, require minimum 3. Differences are cosmetic: variable names (first/lead, count/run) and return object field names (symbol/count vs sym/run).
- **Correction [OK]**: Lead-symbol detection and left-to-right consecutive counting correctly implement the documented algorithm; SCATTER as first non-WILD correctly yields null; all-WILD yields null via the ?? fallback.
- **Overengineering [LEAN]**: Implements the documented left-to-right lead-symbol scan with WILD substitution in ~17 lines. Complexity is dictated by the algorithm requirements, not by unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Complex WILD-substitution and early-break logic with multiple branches (all-WILD, leading WILD, SCATTER, count < 3, mixed lines) — none covered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The left-to-right scan logic, WILD substitution behaviour, SCATTER exclusion, minimum-count threshold of 3, and null-return contract are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 98% identical algorithm. Both extract leading symbol (skipping WILD), count consecutive symbol matches, return null if fewer than 3. Only differences are variable/field naming conventions.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is mutable and its tuple elements are mutable. Should use `as const satisfies ...` or `Readonly<Record<...>>` with `readonly [number, number, number]` tuples. `symbols` parameter should be `readonly Symbol[]`. [L5-L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `ANCIENT_RTP`, `getPayMultiplier`, and `lineWins` all lack JSDoc. In a payout-critical gaming module, documenting units (lineBet multipliers, valid count range 3–5) and edge cases (WILD/SCATTER exclusion) is essential for safe downstream use. [L3,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` is not used on `PAY_TABLE`. Combining `as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>` would preserve literal tuple types, enforce the Record shape, and catch missing/extra keys at compile time. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain confirmed by symbol vocabulary (CHERRY, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) and RTP constant. `PAY_TABLE` is keyed by `string` rather than the `Symbol` union from types.ts. In a regulated payout path, this means adding a new symbol to the `Symbol` union silently produces no compile error for a missing pay table entry — a correctness risk in payout-critical code. Key should be `Partial<Record<Symbol, ...>>`. [L5] |

### Suggestions

- Use `as const satisfies` to make PAY_TABLE fully readonly with Symbol-constrained keys, preserving literal types and enforcing exhaustiveness via the Symbol union.
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
- Mark the `symbols` parameter as readonly to signal no mutation and allow callers to pass readonly arrays.
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: readonly Symbol[]): { symbol: Symbol; count: number } | null {`
- Add JSDoc to all three public exports documenting units, parameter constraints, and edge-case behavior.
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the pay multiplier for a symbol/count combination.
   * Multiply this value by `lineBet` (= `bet / 10`) to get credits.
   * Returns 0 for counts < 3, WILD, SCATTER, or unknown symbols.
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
