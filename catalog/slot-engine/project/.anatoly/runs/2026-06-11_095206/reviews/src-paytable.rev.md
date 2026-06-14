# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files. No local usage either.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target; unused-symbol status is a Utility axis matter.
- **Overengineering [LEAN]**: Single numeric constant. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is likely consumed by engine logic with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is non-obvious and the constant's role (target RTP for a specific game variant vs. a universal default) is not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced in getPayMultiplier (L15) via PAY_TABLE[symbol].
- **Duplication [UNIQUE]**: No similar data structures found in RAG results.
- **Correction [OK]**: All six rows exactly match the reference documentation paytable.
- **Overengineering [LEAN]**: Flat Record with fixed tuple values — the most direct representation for a static 6×3 paytable.
- **Tests [NONE]**: No test file exists. PAY_TABLE drives all payout calculations; zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal constant; tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is not annotated anywhere. Lenient given private scope, but the tuple semantics are not self-evident.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Row lookup, null guard, and index mapping (count 3→row[0], 4→row[1], 5→row[2]) are all correct; returns 0 for WILD/SCATTER (not in table) and for unsupported counts.
- **Overengineering [LEAN]**: Three explicit if-branches over count could be `row[count - 3]`, but the verbosity is negligible and clarity is fine. No structural overengineering.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path with no direct tests. Edge cases (unknown symbol, count < 3, count > 5, each valid count 3/4/5 per symbol) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: description of `count` valid range (3–5), that WILD/SCATTER return 0, and that the return is a dimensionless multiplier applied to lineBet.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. No local usage in file.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine in src/engine.ts: same WILD-resolution for the lead symbol, same SCATTER/WILD null guard, same counting loop with WILD substitution, same >= 3 threshold, and same return shape. Differences are cosmetic only — property names (symbol/count vs sym/run) and local variable names (first/count vs lead/run). The two functions are behaviorally interchangeable.
- **Correction [OK]**: Leading-WILD skip to find pay symbol, then contiguous WILD-or-match count from position 0 is correct; WILD-only and SCATTER first-symbol early-returns are handled properly.
- **Overengineering [LEAN]**: Single-pass loop with leading-WILD resolution. Straightforward implementation for the payline win-detection contract.
- **Tests [NONE]**: No test file exists. Complex WILD-substitution logic, SCATTER guard, partial-line break, and count threshold (>=3) are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Complex behavior — WILD substitution for leading symbol resolution, left-to-right consecutive run counting, SCATTER exclusion, null on no win — none of it documented.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical logic — WILD lead resolution, SCATTER guard, run-counting loop, and >= 3 threshold are all identical; only return-object property names and local variable names differ

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `PAY_TABLE` key is `string` instead of the imported `Symbol` union. `Partial<Record<Symbol, readonly [number, number, number]>>` (or `Record<Exclude<Symbol, 'WILD'\|'SCATTER'>, ...>`) would close the gap and eliminate the `if (!row)` runtime guard. [L4-L12] |
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` and its inner tuples carry no `readonly` modifiers. Any consumer holding a reference to a row could mutate the payout data at runtime. [L4-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. As the canonical paytable API, parameter semantics (e.g. valid range of `count`, the WILD/SCATTER exclusion) belong in the doc string. [L2,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` operator on `PAY_TABLE` would validate the literal against the record shape while preserving narrow tuple types for indexed access — currently the cast to `Record<string, [number, number, number]>` widens and loses tuple narrowing. [L4] |

### Suggestions

- Narrow PAY_TABLE key type and add readonly to prevent mutation
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = { ... }`
  - After: `const PAY_TABLE: Readonly<Partial<Record<Symbol, readonly [number, number, number]>>> = { ... } satisfies Partial<Record<Symbol, readonly [number, number, number]>>`
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Theoretical return-to-player for the classic reel configuration (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base pay multiplier for a (symbol, run-length) pair.
   * WILD and SCATTER are not in the table — both return 0.
   * @param symbol - A non-wild pay symbol.
   * @param count  - Consecutive matching symbols in the run (3, 4, or 5).
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

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
