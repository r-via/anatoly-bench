# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime and 0 type-only importers.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Constant value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant — nothing simpler.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name implies RTP but 'ANCIENT' prefix and how/where this constant is applied (game variant, base config, override) are unexplained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced locally at L15 inside getPayMultiplier.
- **Duplication [UNIQUE]**: No similar lookup tables found in RAG results.
- **Correction [OK]**: Multipliers match the reference-doc paytable exactly (CHERRY through DIAMOND, all three run-length tiers). RTP balance depends on reel weights defined in reels.ts; flagging that interaction here would violate precision guard 3 (paytable is not the canonical home of the reel-weight constant).
- **Overengineering [LEAN]**: Flat record of fixed tuples. Correct data structure for a static lookup table; no abstraction needed.
- **Tests [NONE]**: No test file exists. Private constant but drives all payout logic; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal constant; name is clear, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and not annotated. Lenient given private scope.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: row[0/1/2] correctly maps count 3/4/5 to the documented 3-of/4-of/5-of-a-kind multiplier; returns 0 for unknown symbols (WILD, SCATTER) and counts outside 3–5.
- **Overengineering [LEAN]**: Three explicit if-checks for counts 3/4/5 are clear and minimal. `row[count-3]` would be marginally shorter but this is not overengineering.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for valid symbols, unknown symbols, or all count branches (3/4/5/<3).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: @param descriptions for symbol and count, @returns explanation, note that WILD/SCATTER and counts outside 3–5 return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine: both resolve the leading non-WILD symbol, guard against WILD/SCATTER leads, count a consecutive matching run (treating WILD as wildcard), and return null when run < 3. Differences are purely cosmetic — field names (symbol/count vs sym/run) and local variable names (first/count vs lead/run). Both functions are fully interchangeable.
- **Correction [OK]**: Leading-WILD resolution, SCATTER/all-WILD early-return, contiguous-run count, and ≥3 threshold are all correct. Edge cases (all-WILD → null, SCATTER as first non-WILD → null, SCATTER mid-run breaks count) behave as documented.
- **Overengineering [LEAN]**: Single linear scan resolving leading WILDs then counting a contiguous run. Handles the two edge cases (leading WILD, SCATTER skip) inline without helper indirection.
- **Tests [NONE]**: No test file exists. Complex logic covering WILD substitution, SCATTER exclusion, consecutive-match counting, and count>=3 threshold — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: description of left-to-right consecutive run logic, WILD substitution behavior, why WILD/SCATTER as anchor returns null, and @returns semantics for the nullable object.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical logic — same WILD-resolution, same guard clauses, same counting loop, same ≥3 threshold; only return-object property names differ

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is mutable at runtime; neither `as const` nor `Readonly` is applied. For a fixed paytable the tuple entries can be mutated silently. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `lineWins` in particular has a non-obvious WILD-skip heuristic worth documenting. [L3, L14, L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | `PAY_TABLE` key is typed as `string` instead of the narrower pay-symbol union (`Exclude<Symbol, 'WILD' \| 'SCATTER'>`). With a `string` key, `getPayMultiplier('WILD', 3)` reaches the row lookup before the caller's guard, and any misspelled symbol silently returns 0 rather than a compile-time error. [L5] |

### Suggestions

- Narrow PAY_TABLE key to the actual pay-symbol union and freeze the table
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... };
  // After
  type PaySymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    ...
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base multiplier for `symbol` at run length `count` (3–5).
   * Returns 0 for WILD, SCATTER, or any run shorter than 3.
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
