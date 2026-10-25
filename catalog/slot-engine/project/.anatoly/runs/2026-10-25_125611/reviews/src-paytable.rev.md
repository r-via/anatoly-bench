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
- **Duplication [UNIQUE]**: Single exported numeric constant; no similar symbol found.
- **Correction [OK]**: Constant of 0.95. The reference docs state no RTP target to check it against.
- **Overengineering [LEAN]**: Single exported numeric constant.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Pay table data literal; no similar symbol found.
- **Correction [OK]**: Multipliers rise with symbol rank and match count. No contract is visible that they contradict.
- **Overengineering [LEAN]**: Plain lookup table; data-driven and minimal.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG; looks up the pay table by symbol and count.
- **Correction [OK]**: Maps counts 3, 4 and 5 to row indices 0, 1 and 2. Unknown symbols such as WILD and SCATTER, and other counts, return 0.
- **Overengineering [LEAN]**: Simple table lookup with count mapping; the explicit branches are clear and minimal.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Same logic as checkLine: picks the lead symbol (first non-WILD if the line starts with WILD), returns null for WILD or SCATTER leads, counts the run of lead or WILD, and returns a result if the run is at least 3. Only the names differ (symbol/count vs sym/run), so the two are interchangeable.
- **Correction [OK]**: Takes the first non-WILD symbol as the lead and returns null for an all-WILD or SCATTER lead. It counts consecutive matches or WILDs from the left and requires at least 3. The logic is consistent, and an empty array returns null. The function has no importers, which is a Utility-axis matter.
- **Overengineering [LEAN]**: Straightforward leading-symbol resolution and consecutive count loop; wild handling is required by the spec and the logic is minimal.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~100% identical logic; only the result field names differ (symbol/count vs sym/run)

## Best Practices — 6.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is Record<string, ...>, so lookups with arbitrary string keys type-check and the `!row` guard is needed. Record<Symbol, ...> or Partial<Record<Symbol, ...>> would key it to the Symbol union. [L5-L12] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a mutable record of mutable tuples. The `symbols` parameter and the return type are not readonly. [L5-L12] |
| 8 | ESLint compliance | WARN | HIGH | `import type { Symbol }` shadows the global `Symbol` (no-shadow / no-redeclare for builtin globals). Mixing `??` inside a ternary without parentheses hurts readability. Both are minor. [L1, L20] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | ANCIENT_RTP, getPayMultiplier and lineWins have no JSDoc. The semantics of count (3/4/5), WILD substitution and SCATTER exclusion are undocumented. [L3, L14, L22] |
| 13 | Security | WARN | CRITICAL | Slot-machine/gambling domain inferred from paytable, reels, jackpot and RTP vocabulary. This file has no RNG or Math.random. Payout multipliers are small integers, so no float-on-money problem. The constant ANCIENT_RTP = 0.95 is a hardcoded regulatory figure that is not tied to the PAY_TABLE values, so it cannot be checked against them. Low-risk, so only a WARN. [L3] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies Record<PayableSymbol, readonly [number, number, number]>` with `as const` to keep literal types and check exhaustiveness. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic numbers 3/4/5 in getPayMultiplier are hard-coded in an if-chain over a positional tuple. Deriving the index as `count - 3` would remove the branching and tie the indexing to a named MIN_MATCH constant. Also, lineWins accepts an empty array: symbols[0] is undefined and the typing does not reflect that, so a non-empty tuple or length guard is advisable. |

### Suggestions

- Key the pay table by the payable symbol union and make it immutable with satisfies
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    ...
  };
  // After
  const PAY_TABLE = {
    CHERRY: [2, 5, 25],
    ...
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Returns the pay multiplier for `count` (3-5) consecutive matches of `symbol`; 0 if unpaid. */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Use readonly input and parenthesize the mixed ternary/nullish expression
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]) {
    const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];
  // After
  export function lineWins(symbols: readonly Symbol[]) {
    const first = symbols[0] === "WILD" ? (symbols.find(s => s !== "WILD") ?? "WILD") : symbols[0];
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
