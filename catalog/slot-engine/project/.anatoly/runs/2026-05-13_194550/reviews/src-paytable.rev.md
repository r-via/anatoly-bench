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

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers.
- **Duplication [UNIQUE]**: Simple numeric constant. No similar symbols found in RAG.
- **Correction [OK]**: Constant matches the documented 95% RTP target exactly.
- **Overengineering [LEAN]**: Single numeric constant. No abstraction needed.
- **Tests [NONE]**: No test file exists. Constant used as RTP configuration value — no behavioral tests present.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose of the value (e.g., what 'ANCIENT' refers to, what game mode uses it, why 0.95) is not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced locally in getPayMultiplier on line 15.
- **Duplication [UNIQUE]**: Unique paytable lookup object. No similar structures found in RAG.
- **Correction [OK]**: Paytable structure is internally consistent; RTP verification requires reel-strip weights not present in this file.
- **Overengineering [LEAN]**: Fixed tuple type `[number, number, number]` precisely models 3-match / 4-match / 5-match tiers. Plain object literal is the right structure for a static lookup table.
- **Tests [NONE]**: No test file exists. Private constant backing getPayMultiplier; its correctness is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The tuple structure [number, number, number] maps to match counts 3/4/5, but this is not documented. Not exported but semantically non-trivial.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Index mapping count∈{3,4,5} → row[0..2] is correct; missing-symbol and out-of-range counts safely return 0.
- **Overengineering [LEAN]**: Straightforward index lookup with explicit branch per count. `row[count - 3]` would be shorter but the explicit form adds no abstraction weight.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — a critical payout calculation path with zero test coverage. Missing: valid symbol/count combos, unknown symbol returning 0, count < 3 returning 0, count === 3/4/5 boundary cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing description of parameters (symbol identity constraints, valid count range), return semantics (multiplier applied to what base?), and the 0 sentinel for unknown symbols or out-of-range counts.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers.
- **Duplication [DUPLICATE]**: RAG score 0.831 with identical core logic. Both functions perform the same algorithm: find consecutive matching symbols in a payline, handle WILD specially, require count ≥3.
- **Correction [OK]**: Left-to-right consecutive evaluation with WILD substitution is correct; all-WILD lines return null by design (WILDs contribute via wildMultiplier in SpinResult, not standalone payline wins).
- **Overengineering [LEAN]**: Single responsibility: resolve WILD-substituted leading symbol, count consecutive matches, gate on minimum 3. No unnecessary generalization.
- **Tests [NONE]**: No test file exists. Complex WILD substitution and left-to-right counting logic is entirely untested. Missing: all-WILD input, SCATTER short-circuit, WILD prefix resolution, partial matches < 3, exact count boundaries, mixed WILD/symbol sequences.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious WILD substitution logic (first non-WILD anchors the winning symbol), early-break left-to-right counting, SCATTER/all-WILD null return, and minimum count threshold of 3 are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — Identical algorithm with cosmetic differences only. Variable names differ (first→lead, count→run) and return object uses different property names (symbol→sym, count→run). Both compute the same semantic result.

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is typed as Record<string, ...> instead of Partial<Record<Symbol, readonly [number, number, number]>>. Using the concrete Symbol union as the key type would catch typos and invalid lookups at compile time. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE lacks as const or Readonly wrapper — tuple values are mutable. symbols parameter in lineWins should be readonly Symbol[]. ANCIENT_RTP is a const primitive (fine). [L5-L12, L23] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins return type uses an inline anonymous object { symbol: Symbol; count: number } instead of a named type alias (e.g. LineWin). Inline objects on public exports reduce reusability and discoverability. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. ANCIENT_RTP especially needs a doc comment explaining the 'ANCIENT' qualifier — whether it is active, historical, or deprecated. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from the satisfies operator to retain literal types while still validating against the Record shape. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine/gambling domain inferred from reel vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, RTP, lineWins, SCATTER). Using Record<string, ...> for PAY_TABLE instead of Partial<Record<Symbol, ...>> means passing an invalid symbol string compiles silently — in a regulated domain, stronger typing on payout lookups is expected. [L5] |

### Suggestions

- Use Symbol union key and readonly tuples for PAY_TABLE, and apply satisfies for narrowed inference
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
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
  } satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Name the lineWins return type as a reusable LineWin alias and add readonly to the parameter
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  export type LineWin = { readonly symbol: Symbol; readonly count: number };
  export function lineWins(symbols: readonly Symbol[]): LineWin | null {
  ```
- Add JSDoc to all public exports, especially clarifying ANCIENT_RTP
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Baseline theoretical RTP (Return-to-Player) for the classic paytable — 95%. */
  export const ANCIENT_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
