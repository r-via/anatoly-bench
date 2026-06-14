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
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single named constant for a fixed RTP value. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used by engine/legacy callers but never verified in tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is opaque — it could mean a game variant, a paytable version, or a configuration mode. Purpose and context are not self-evident from the name alone.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced locally by getPayMultiplier at L15.
- **Duplication [UNIQUE]**: No similar pay-table structure found in RAG results.
- **Correction [OK]**: All six symbol rows match the authoritative reference paytable exactly (CHERRY 2/5/25, LEMON 2/5/25, BELL 5/20/100, BAR 10/40/200, SEVEN 25/100/500, DIAMOND 50/250/1000).
- **Overengineering [LEAN]**: Flat record mapping symbol names to fixed tuples. No abstraction beyond what the data requires.
- **Tests [NONE]**: No test file exists. Pay table values are business-critical multiplier data with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The tuple type `[number, number, number]` maps to 3-of-a-kind / 4-of-a-kind / 5-of-a-kind multipliers — not inferable from the declaration alone. Non-exported but tuple semantics require explanation.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Correctly maps count∈{3,4,5} to row indices 0/1/2; returns 0 for missing symbols (WILD, SCATTER) and for count outside the winning range.
- **Overengineering [LEAN]**: Simple index lookup with explicit count checks. Straightforward and minimal for its purpose.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic covering count boundaries (3/4/5), unknown symbols returning 0, and count < 3 returning 0 are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API. Missing: parameter descriptions, return value semantics, and the key behavior that WILD/SCATTER return 0 (no paytable entry).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine: same WILD-substitution for the lead symbol, same SCATTER/WILD null guard, same run-counting loop with early break, same >= 3 threshold. Differences are purely cosmetic — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Both functions are fully interchangeable.
- **Correction [OK]**: Leading-WILD skip (find first non-WILD), SCATTER/all-WILD guard, and contiguous-from-position-0 counting are all implemented correctly; count threshold ≥ 3 matches the documented win condition.
- **Overengineering [LEAN]**: Single-pass contiguous run detection with WILD substitution. Logic directly matches the documented payline win contract.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-return, consecutive-match counting, and count < 3 null return are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API with non-trivial logic: WILD-as-substitute for leading symbol resolution, consecutive-run counting, minimum threshold of 3, and null return for WILD/SCATTER leads — none of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — ~98% identical logic — same WILD lead-resolution, same SCATTER guard, same counting loop and threshold; only property and variable names differ

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE type allows mutation — values are mutable tuples and the record itself is mutable. The symbols parameter in lineWins accepts a mutable array but is only read. [L4-L11] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline object type on a public export. A named type alias (e.g. LineMatch) would make the API surface explicit and reusable. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc comments. [L3,L13,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is a fixed module-level constant that would benefit from the satisfies operator to retain literal types while validating structure. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | ANCIENT_RTP is an unexplained prefix — the constant represents the engine's target RTP (95%) with no 'ancient' domain meaning visible in docs or code. PAY_TABLE uses Record<string, ...> instead of Record<PaySymbol, ...>, silently accepting any string key at compile time. [L3,L4] |

### Suggestions

- Mark PAY_TABLE and its tuple values as readonly to prevent accidental mutation.
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = { ... };`
  - After: `const PAY_TABLE: Readonly<Record<string, readonly [number, number, number]>> = { ... };`
- Use satisfies for PAY_TABLE to preserve literal types while enforcing structure.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { CHERRY: [2, 5, 25], ... };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    ...
  } satisfies Record<string, readonly [number, number, number]>;
  ```
- Export a named type for lineWins return value instead of an inline anonymous type.
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null
  // After
  export type LineMatch = { readonly symbol: Symbol; readonly count: number };
  export function lineWins(symbols: readonly Symbol[]): LineMatch | null
  ```
- Rename ANCIENT_RTP to a self-describing constant name and add JSDoc.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Target theoretical Return-to-Player ratio for the slot engine (95%). */
  export const TARGET_RTP = 0.95;
  ```
- Add JSDoc to getPayMultiplier.
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base payout multiplier for a given pay symbol and run length.
   * Returns 0 for WILD, SCATTER, or run lengths outside [3, 5].
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
