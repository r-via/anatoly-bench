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

- **Utility [DEAD]**: Exported but imported by 0 files. No local usage either.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant export. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is opaque — it is unclear what game variant or configuration this RTP applies to, or how it is consumed.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced in getPayMultiplier (L15) via PAY_TABLE[symbol].
- **Duplication [UNIQUE]**: No similar data structure found in RAG results.
- **Correction [OK]**: All six entries match the reference paytable exactly (3-of-a-kind, 4-of-a-kind, 5-of-a-kind columns).
- **Overengineering [LEAN]**: Flat module-level lookup table mapping 6 symbols to fixed 3-tuple multipliers. No abstraction beyond what the data requires.
- **Tests [NONE]**: No test file exists; PAY_TABLE values are indirectly exercised only through getPayMultiplier, which itself has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The tuple structure [number, number, number] does not indicate that the three values correspond to 3-, 4-, and 5-of-a-kind multipliers; that semantics must be inferred from getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Index mapping (count 3→row[0], 4→row[1], 5→row[2]) is correct; missing symbol returns 0 as documented for WILD/SCATTER.
- **Overengineering [LEAN]**: Simple tuple index lookup with early-return guards. The three explicit if-branches for count 3/4/5 are readable and appropriate for a fixed 3-column table.
- **Tests [NONE]**: No test file found. Function is imported by engine.ts and legacy.ts — critical business logic (count branching for 3/4/5, unknown symbol returning 0) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Missing: what 'count' represents, the valid range of count values (3–5), the return-0 contract for unknown symbols and out-of-range counts, and that WILD/SCATTER are not in the table.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. No local usage in file.
- **Duplication [DUPLICATE]**: Logic is virtually identical to checkLine in src/engine.ts: both resolve the lead symbol identically (WILD-at-index-0 substitution), both null-out on WILD/SCATTER lead, both count a left-anchored consecutive run including WILDs, both gate return on run >= 3. Differences are only cosmetic — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Same semantic contract: detect a paying run on a payline.
- **Correction [OK]**: Leading-WILD skip via find(s≠WILD) correctly resolves the pay symbol; the contiguous-count loop from position 0 handles WILD substitutes and breaks on mismatches correctly across all edge cases (all-WILD → null, SCATTER at head → null, interspersed WILDs counted).
- **Overengineering [LEAN]**: Straightforward WILD-skip plus contiguous-run count. No unnecessary abstraction for the task.
- **Tests [NONE]**: No test file found. WILD substitution logic, SCATTER early-return, consecutive-match break, and count<3 null return are all untested edge cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Non-trivial behavior (WILD as prefix substitute, SCATTER/all-WILD early-return null, left-to-right consecutive count, minimum run of 3) is entirely undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical logic — same WILD resolution, same loop, same threshold; only variable/property names differ

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is a module-level constant but is fully mutable — entries can be overwritten or spliced at runtime. `symbols` parameter in `lineWins` is not mutated but typed as mutable `Symbol[]`. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports — `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` — lack JSDoc. `ANCIENT_RTP` is especially ambiguous: the name `ANCIENT` is unexplained and callers cannot infer when to use it versus a potential default RTP. [L3,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` would benefit from `as const satisfies Record<...>` to derive readonly tuple literals and retain literal key types, enabling exhaustiveness checks on symbol lookup. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from symbol vocabulary and RTP constant. `PAY_TABLE` is keyed by plain `string` rather than a constrained pay-symbol union (excluding WILD/SCATTER). `getPayMultiplier` accepts any arbitrary string without a compile-time error, masking typos as silent zero-payout returns — a payout-correctness risk in a regulated gaming context. [L5,L14] |

### Suggestions

- Make PAY_TABLE fully immutable with `as const satisfies` to get readonly tuples and prevent runtime mutation.
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
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Narrow the key type to a pay-symbol union so invalid symbol strings are caught at compile time.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... };
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;
  const PAY_TABLE: Readonly<Record<PaySymbol, readonly [number, number, number]>> = { ... };
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Accept ReadonlyArray in lineWins since the parameter is never mutated.
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: ReadonlyArray<Symbol>): ...`
- Add JSDoc to all public exports, especially ANCIENT_RTP whose name is opaque without context.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /**
   * Return-to-Player ratio for the legacy (ancient) paytable variant.
   * Used by the engine when initialised in `ANCIENT` mode.
   * Matches the default 95% RTP target defined in the product spec.
   */
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
