# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers. Never referenced outside this file.
- **Duplication [UNIQUE]**: Simple numeric constant with no similar definitions found
- **Correction [OK]**: Simple numeric constant; RTP correctness depends on reel weights not present in this file.
- **Overengineering [LEAN]**: Single named constant for RTP value — minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name is partially self-descriptive but the significance of 0.95, the game context it applies to, or why it is named 'ANCIENT' is not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced locally in getPayMultiplier (line 15). Required for function operation.
- **Duplication [UNIQUE]**: Unique lookup table mapping symbols to payout values; no similar structures found
- **Correction [OK]**: Tuple layout [3-match, 4-match, 5-match] is consistent with getPayMultiplier's index access pattern.
- **Overengineering [LEAN]**: Flat record mapping symbol names to 3-count payout tuples. No unnecessary abstraction; direct data structure for a fixed paytable.
- **Tests [NONE]**: No test file exists. Private constant but its correctness is critical — wrong multiplier values would silently corrupt all payout logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple layout [3-match, 4-match, 5-match] multipliers is not documented; readers must infer the index semantics from getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts, src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Index mapping count→row[count-3] is correct; counts outside [3,5] safely return 0.
- **Overengineering [LEAN]**: Straightforward index lookup with sequential count checks. Could use `row[count - 3]` as a micro-simplification, but current form is equally readable and not overengineered.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — a critical payout path. No coverage of valid counts (3/4/5), unknown symbols returning 0, or count values outside the 3–5 range.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing documentation for parameters (symbol, count), return value (multiplier magnitude/units), valid count range, and the 0 fallback for unknown symbols or non-winning counts.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers. Never imported anywhere.
- **Duplication [DUPLICATE]**: Functionally identical to checkLine with identical wildcard handling, loop logic, and return conditions; only naming differs (symbol/sym, count/run)
- **Correction [OK]**: WILD-substitution logic correctly identifies the anchor symbol and counts consecutive matching or WILD positions from the start; all-WILD and SCATTER-lead cases return null as expected.
- **Overengineering [LEAN]**: Single-pass left-to-right count with WILD substitution and SCATTER guard. Logic is non-trivial but matches standard slot-machine line evaluation semantics — no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Complex WILD substitution logic and early-break counting have no tests. Edge cases — all-WILD input, WILD-leading lines, SCATTER short-circuit, runs of fewer than 3 — are entirely uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. WILD substitution logic, SCATTER exclusion, left-to-right contiguous matching rule, minimum count of 3, and null return semantics are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical — both find consecutive matching symbols with wildcard handling; semantic contract and logic are interchangeable

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE key is typed as `string` instead of the imported `Symbol` union, losing exhaustiveness and allowing arbitrary string lookups. Use `Record<Symbol, ...>` for full type safety. [L4] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable — each `[number, number, number]` element can be overwritten at runtime. Prefer `readonly [number, number, number]` or `as const`. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `lineWins` in particular has non-obvious WILD-resolution semantics that warrant documentation. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` would validate PAY_TABLE against `Record<Symbol, readonly [number, number, number]>` while preserving tuple literal types for narrowing, but is unused. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from project files (reels, jackpot, wild, freespin, rng). `ANCIENT_RTP` is exported but its name signals it is a legacy/superseded value — exporting it without deprecation annotation or replacement guidance risks silent misuse by callers picking up the wrong RTP figure in a compliance-sensitive context. [L3] |

### Suggestions

- Key PAY_TABLE with the Symbol union type and freeze tuple values for full type safety and immutability.
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = { ... };`
  - After: `const PAY_TABLE: Record<Symbol, readonly [number, number, number]> = { ... } as const;`
- Alternatively, use `satisfies` to validate shape while preserving tuple literal types.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { CHERRY: [2, 5, 25], ... };
  // After
  const PAY_TABLE = {
    CHERRY: [2, 5, 25],
    // ...
  } satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Add JSDoc with `@deprecated` to the legacy export and document `lineWins` WILD-resolution semantics.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function lineWins(...) {...}
  // After
  /** @deprecated Use the certified RTP value from game config instead. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the leading-run win for a payline.
   * Treats WILD as a substitute for the first non-WILD symbol.
   * Returns null for WILD-only lines or SCATTER leads.
   */
  export function lineWins(...) {...}
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
