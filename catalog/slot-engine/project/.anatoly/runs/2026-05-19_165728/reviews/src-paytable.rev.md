# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files per pre-computed analysis
- **Duplication [UNIQUE]**: Constant data value. No similar symbols found.
- **Correction [OK]**: Value 0.95 correctly documents the design-target RTP; confirmed by reference docs as a non-runtime annotation.
- **Overengineering [LEAN]**: Single named constant documenting design-target RTP. Reference docs confirm it is intentionally not used in runtime calculations — purely documentary.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name implies RTP but gives no indication it is a design-target constant unused at runtime, not an operative game parameter.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported internal constant referenced in getPayMultiplier function (line 15)
- **Duplication [UNIQUE]**: Lookup table constant. No similar data structures found.
- **Correction [OK]**: All six rows match the authoritative paytable exactly (reference: .anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md).
- **Overengineering [LEAN]**: Flat Record mapping symbol names to fixed 3-tuple multipliers. Minimal and appropriate for a static 6-symbol pay table.
- **Tests [NONE]**: No test file exists. PAY_TABLE is internal but drives all payout logic tested indirectly through getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant; table structure is self-descriptive. No JSDoc explaining tuple layout (×3, ×4, ×5 multipliers) or that entries apply to lineBet. Tolerable given internal scope, but tuple semantics are non-obvious.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Correctly maps count 3/4/5 to row indices 0/1/2; returns 0 for absent symbols and out-of-range counts, matching documented contract.
- **Overengineering [LEAN]**: Straight lookup with three conditional returns for counts 3/4/5. No abstraction beyond what the task requires.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing tests for all symbols, all count branches (3/4/5), unknown symbol returning 0, and count < 3 edge case.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc. Missing: param descriptions for symbol and count, return value semantics, behavior for out-of-range counts (below 3 or above 5 returns 0), and WILD/SCATTER handling.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files per pre-computed analysis
- **Duplication [DUPLICATE]**: Semantic match with checkLine: identical logic for detecting consecutive matching symbols, counting runs, and filtering WILD/SCATTER. Only differences are variable names and return object property keys.
- **Correction [OK]**: Leading-symbol resolution, WILD substitution, SCATTER early-exit, and all-WILD guard are all correct; run-length counting breaks correctly on first non-matching, non-WILD symbol.
- **Overengineering [LEAN]**: Single-pass left-to-right run counter with WILD substitution. Straightforward imperative logic matching the documented payline-win algorithm.
- **Tests [NONE]**: No test file exists. Missing tests for WILD-only line, SCATTER first symbol, mixed WILD + symbol match, count < 3 returning null, consecutive match breaking on mismatch, and all-WILD edge case.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc. Non-trivial behavior (left-anchored run, WILD substitution for lead symbol, early-exit on non-match, SCATTER/all-WILD returns null) is entirely undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 90% identical logic — both find leading symbol, skip WILDs, count consecutive matches, return symbol+count or null if < 3

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is typed as `Record<string, ...>` rather than `Record<Symbol, ...>`. The wider key type allows inserting arbitrary string keys without a compile error, losing exhaustiveness and type precision. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is mutable at both the object and tuple level; `as const` would freeze tuple values and narrow literal types. The `symbols` parameter in `lineWins` is not marked `readonly`, though it is never mutated. [L5, L23] |
| 6 | Interface vs Type | WARN | MEDIUM | `lineWins` returns an anonymous inline type `{ symbol: Symbol; count: number }` instead of the project's `LineWin` interface (defined in types/architecture docs). Inline types here create a structural orphan inconsistent with project conventions. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc comments. At minimum, `getPayMultiplier` and `lineWins` warrant param/return documentation. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is a prime candidate for the `satisfies` operator: it would validate structure against `Record<Symbol, readonly [number, number, number]>` while preserving narrow literal types for individual entries. [L5] |

### Suggestions

- Use `satisfies` + `as const` to lock down PAY_TABLE with narrow types and full immutability
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    // ...
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Mark `symbols` param as readonly to signal no mutation and accept readonly arrays from callers
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: readonly Symbol[]): ...`
- Add JSDoc to public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the payout multiplier for `symbol` appearing `count` consecutive times.
   * Returns 0 for counts outside [3,5] or for WILD/SCATTER.
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
