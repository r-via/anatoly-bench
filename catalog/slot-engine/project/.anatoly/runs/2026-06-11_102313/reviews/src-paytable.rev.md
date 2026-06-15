# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files. No runtime or type-only consumers.
- **Duplication [UNIQUE]**: Single exported numeric constant. No similar symbol found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists. Constant used as RTP baseline with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is opaque — it is unclear what game mode or configuration this RTP applies to, or why 0.95 is the chosen value.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced in getPayMultiplier (L15) via PAY_TABLE[symbol].
- **Duplication [UNIQUE]**: Module-local pay table data record. No similar structure found in RAG results.
- **Correction [OK]**: All multiplier entries match the reference documentation exactly.
- **Overengineering [LEAN]**: Fixed lookup table; tuple-per-symbol is minimal and direct for a static paytable.
- **Tests [NONE]**: No test file exists. Internal table drives all payout logic; no tests verify correctness of multiplier values.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal constant, so lower severity. The tuple structure [number, number, number] is not labelled — readers must infer that the three positions correspond to 3-, 4-, and 5-of-a-kind multipliers.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Index mapping (count 3→row[0], 4→row[1], 5→row[2]) is correct; missing symbols and out-of-range counts return 0 as documented.
- **Overengineering [LEAN]**: Straight index lookup with explicit count guards. Could use `row[count - 3]` but the explicit ifs are not overengineering.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for count=3/4/5 branches, unknown symbol, or count<3.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what 'count' represents, valid range of 'count', that WILD/SCATTER return 0, and what the returned number is (a multiplier applied to line bet).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. No runtime or type-only consumers.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine in src/engine.ts: same WILD-skip lead resolution, same SCATTER guard, same counting loop with break, same `run >= 3` threshold. Only differences are variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Functions are fully interchangeable in behavior.
- **Correction [OK]**: Leading-WILD resolution, SCATTER/all-WILD early-return, and consecutive run count are all correct; empty input gracefully returns null.
- **Overengineering [LEAN]**: Single-pass contiguous-run scan with WILD substitution. Logic is minimal for the payline win contract.
- **Tests [NONE]**: No test file exists. Multiple untested branches: WILD-leading lines, SCATTER early-exit, mixed WILD+symbol sequences, count<3 returning null.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Non-obvious behavior includes: WILD-skip logic to resolve the effective leading symbol, left-to-right consecutive run semantics, SCATTER exclusion, and the minimum run length of 3. None of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical — same algorithm, same WILD/SCATTER handling, same loop; only variable and return-property names differ

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is typed as mutable `Record<string, [number, number, number]>`. Both the record and the tuple arrays are writable at runtime. Should be typed as `Readonly<Record<string, readonly [number, number, number]>>`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. Public API consumers have no inline documentation for parameter semantics or return contracts. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE misses `as const satisfies` — without it, the tuple types widen to `number[]` in certain inference contexts and the record is mutable. Using `as const satisfies Record<string, readonly [number, number, number]>` narrows literals, enforces shape, and enables better inferred type predicates downstream. [L5-L12] |

### Suggestions

- Make PAY_TABLE fully immutable using `as const satisfies` to prevent mutation and narrow tuple literal types.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
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
  } as const satisfies Readonly<Record<string, readonly [number, number, number]>>;
  ```
- Add JSDoc to all three public exports so consumers get inline documentation.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Theoretical Return-to-Player target for the classic reel set (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for `symbol` when `count` consecutive
   * matches appear on a payline. Returns 0 for WILD, SCATTER, or count < 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a single payline's symbol array for a left-to-right win.
   * Returns the pay symbol and run length, or null if no win (count < 3).
   * Leading WILDs are skipped to resolve the pay symbol; WILDs within the
   * run count toward the total.
   */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
