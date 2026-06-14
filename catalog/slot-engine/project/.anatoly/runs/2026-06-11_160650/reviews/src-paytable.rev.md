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

- **Utility [DEAD]**: Exported but imported by 0 files. No consumer references it anywhere in the codebase.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target. Unused per the static import graph, but that is a Utility-axis concern.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name suggests a return-to-player ratio, but there is no explanation of what 'ANCIENT' refers to, how this value is used, or what game mode it applies to.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced directly in getPayMultiplier (L15) to look up per-symbol payout rows.
- **Duplication [UNIQUE]**: No similar lookup tables found in RAG results.
- **Correction [OK]**: All six symbol rows match the reference documentation paytable exactly.
- **Overengineering [LEAN]**: Fixed lookup table as a plain Record with tuple values — minimal and appropriate for a static 6-symbol paytable.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The structure (symbol → [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multipliers) is inferrable from context but not documented. No note on units, WILD/SCATTER absence, or relationship to lineBet.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts (spin) and src/legacy.ts (computeLegacyPayout); both call it to compute symbol win multipliers.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly maps (symbol, count) to PAY_TABLE row index; returns 0 for unknown symbols and for counts outside {3,4,5}, matching the documented contract.
- **Overengineering [LEAN]**: Straightforward index lookup with explicit count guards. Could use `row[count - 3]` but the if-chain is readable and not over-abstracted.
- **Tests [NONE]**: No test file exists. Function is consumed by critical spin logic in engine.ts and legacy.ts — missing tests for all count values (3/4/5), unknown symbols returning 0, and boundary counts (0, 1, 2).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing: description of what 'multiplier' means (base multiplier applied to lineBet), valid count range (3–5), return value of 0 for unknown symbols or count < 3, and WILD/SCATTER behavior.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. Consumer analysis lists no callers; logic duplicated inside computeLegacyPayout in src/legacy.ts.
- **Duplication [DUPLICATE]**: Algorithm is identical to checkLine in src/engine.ts: same WILD-skipping lead detection, same SCATTER/WILD guard, same counting loop, same >=3 threshold, same return shape. Only differences are variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Functions are fully interchangeable with trivial renaming.
- **Correction [OK]**: Leading-WILD resolution, consecutive-run counting, SCATTER/all-WILD early exits, and the ≥3 threshold all match the documented payline-win semantics.
- **Overengineering [LEAN]**: Compact run-count logic with leading-WILD resolution. No unnecessary abstraction for the task.
- **Tests [NONE]**: No test file exists. Key untested paths: WILD-only reels, SCATTER as first symbol, leading WILD resolving to non-WILD symbol, mixed streaks breaking early, count < 3 returning null.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious logic: WILD substitution for leading symbol, left-to-right consecutive run requirement, minimum count of 3, null return for WILD/SCATTER leads or runs < 3. None of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical logic — both extract the leading consecutive run of matching symbols with WILD substitution from a Symbol[] payline and return the anchor symbol plus run length, or null if run < 3

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is a module-level constant that should be immutable but its tuple values are mutable at runtime. Prefer `as const` or `Readonly<Record<…>>` with `readonly` tuples to prevent accidental mutation. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. At minimum `getPayMultiplier` and `lineWins` are public API surface and should document parameters and return semantics. [L3,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is a good candidate for the `satisfies` operator (TS 4.9+, idiomatic in 5.x). Using `satisfies Record<Symbol, readonly [number, number, number]>` would enforce exhaustive symbol coverage and infer literal tuple types simultaneously, catching a missing symbol entry at compile time. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues: (1) `PAY_TABLE` key type is `string` instead of the narrower `Symbol` union — a mis-keyed symbol (e.g. a typo) silently falls through to `return 0`. Use `Record<Symbol, …>` (or `Partial<Record<Symbol, …>>` if the table is intentionally sparse). (2) `ANCIENT_RTP` and `lineWins` have no recorded consumers in the codebase; both are exported dead code. `ANCIENT_RTP` in particular is oddly named for a live constant — either document it or remove it. [L3,L5,L23] |

### Suggestions

- Narrow PAY_TABLE key type from string to Symbol and freeze tuple values
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { … };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<Exclude<Symbol, "WILD" | "SCATTER">, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base pay multiplier for a given symbol and consecutive run length.
   * Returns 0 for counts < 3, for WILD, and for SCATTER.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Remove or document the unused ANCIENT_RTP export — if it documents the target RTP use a JSDoc const
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Theoretical Return-to-Player target for this paytable configuration (95%). */
  export const TARGET_RTP = 0.95 as const;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
