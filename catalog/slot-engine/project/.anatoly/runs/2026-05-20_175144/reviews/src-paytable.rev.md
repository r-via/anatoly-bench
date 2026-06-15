# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 91% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant imported by 0 files. No runtime usage detected.
- **Duplication [UNIQUE]**: No duplicates found
- **Correction [OK]**: Value 0.95 matches the arbitrated RTP target of 95%.
- **Overengineering [LEAN]**: Single numeric constant, minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is unexplained — it is unclear whether this is a game-mode-specific RTP, a legacy value, or the single RTP for the engine.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal constant used in getPayMultiplier on line 16 to look up payouts.
- **Duplication [UNIQUE]**: No duplicates found
- **Correction [OK]**: All six symbol rows match the documented paytable exactly (3/4/5-of-a-kind multipliers).
- **Overengineering [LEAN]**: Flat record mapping symbol names to fixed 3-tuple arrays. No abstraction overhead; direct data declaration.
- **Tests [NONE]**: No test file exists. PAY_TABLE is internal but drives all payout logic — untested indirectly through getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant with no JSDoc. The tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is inferrable from data but not stated; indices are undocumented. Lower confidence because it is unexported.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG
- **Correction [OK]**: Correctly maps count 3→row[0], 4→row[1], 5→row[2]; returns 0 for unknown symbols (WILD, SCATTER) and out-of-range counts (1, 2). Max reel count is 5 so no valid count is missed.
- **Overengineering [LEAN]**: Simple index lookup with three explicit conditionals. Array indexing by offset would be marginally shorter but this is readable and not overengineered.
- **Tests [NONE]**: No test file found. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for valid symbols at counts 3/4/5, unknown symbols (returns 0), or boundary counts like 2 or 6.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what 'count' represents (run length), valid range for count, behavior for WILD/SCATTER (returns 0), and what the returned number means (base multiplier, not currency).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function imported by 0 files. No runtime usage detected.
- **Duplication [DUPLICATE]**: Identical logic to checkLine: same control flow for validating consecutive symbol matches, same return structure
- **Correction [OK]**: WILD-substitution logic is correct: when position 0 is WILD, `find` locates the first non-WILD in array order to determine the pay symbol; the counting loop then accepts WILD or matching symbols contiguously from position 0. All-WILD lines correctly return null (first resolves to 'WILD'). SCATTER at any position correctly breaks the run or causes null return. Empty-array input safely yields null (count=0).
- **Overengineering [LEAN]**: Straightforward left-to-right run-length scan with WILD substitution. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Logic handles WILD substitution, SCATTER early-exit, consecutive-match counting, and count<3 null return — none of these paths are covered.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: explanation of WILD substitution logic at position 0, why SCATTER returns null, the left-to-right contiguous-run constraint, and what the returned object fields represent.

> **Duplicate of** `src/engine.ts:checkLine` — Identical algorithm: skips WILDs, counts consecutive matches, returns match info or null if <3 matches

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `Record<string, [number, number, number]>` uses a utility type but widens the key to `string` instead of the domain `Symbol` type. This allows `PAY_TABLE["ANYTHING"]` without a compile-time error, weakening payout-critical lookup safety. [L5] |
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` array values are mutable at runtime. The explicit type annotation blocks `as const` inference; use `satisfies` + `as const` to lock both keys and tuple elements. [L5-L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `ANCIENT_RTP` in particular needs documentation — the `ANCIENT` prefix is unexplained and could mislead maintainers about whether the value is still authoritative. [L3,L14,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` operator (TS 4.9+, widely used in 2026 codebases) is the idiomatic way to type `PAY_TABLE` while keeping literal inference: `const PAY_TABLE = { ... } as const satisfies Record<PaySymbol, readonly [number, number, number]>`. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling-domain utility: `Record<string, ...>` key allows any string to silently return `0` from `getPayMultiplier` at runtime instead of a compile-time error when an invalid symbol is passed. The `lineWins` return type `{ symbol: Symbol; count: number }` is anonymous — a named export type (e.g. `LineMatch`) would align with the project's `SpinResult`/`LineWin` convention and enable reuse. [L5,L23] |

### Suggestions

- Narrow PAY_TABLE key type and lock values with `satisfies` + `as const` for full immutability and type safety
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    // ...
  };
  // After
  type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;
  
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports, especially the opaque `ANCIENT_RTP` constant
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /**
   * Theoretical Return-to-Player for the base game (95%).
   * Used as the mathematical target for reel weight calibration.
   */
  export const ANCIENT_RTP = 0.95;
  ```
- Export a named return type from `lineWins` to align with project conventions and enable reuse
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  export interface LineMatch { readonly symbol: Symbol; readonly count: number; }
  
  export function lineWins(symbols: Symbol[]): LineMatch | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
