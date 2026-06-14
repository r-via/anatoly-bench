# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 92% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers. Never imported anywhere.
- **Duplication [UNIQUE]**: Constant value with no duplicates found
- **Correction [OK]**: Correctly declares the arbitrated 95% RTP target constant.
- **Overengineering [LEAN]**: Simple numeric constant export.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is semantically ambiguous — nothing indicates this is a game-variant-specific RTP vs. a global default, or why the value is 0.95.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal const used by getPayMultiplier at line 15 (PAY_TABLE[symbol]). Essential to function logic.
- **Duplication [UNIQUE]**: Configuration object mapping symbols to payout multipliers; no duplicates found
- **Correction [NEEDS_FIX]**: DIAMOND multipliers (50/250/1000) combined with documented reel weight 30/120=0.25 produce ≈229% RTP from DIAMOND alone, violating the arbitrated 95% target. Forward: per payline (lineBet=bet/10) — 5-of-a-kind: 0.25^5×1000/10≈0.0977; 4-of-a-kind: 0.25^4×0.75×250/10≈0.0732; 3-of-a-kind: 0.25^3×0.75×50/10≈0.0586; sum≈0.229/payline × 10 paylines = 2.29× bet. Backward: for DIAMOND to fit within ~30% of the 0.95 budget, mult3 must be ≤7× (not 50×). Sanity: forward(mult3=6)≈0.27× bet ✓ formula consistent. Current mult3=50 is ~7× above that ceiling; cherry/lemon (each ≈0.208 probability) add further surplus.
- **Overengineering [LEAN]**: Flat record mapping 6 symbols to fixed 3-tuple arrays — minimal and appropriate for a static paytable.
- **Tests [NONE]**: No test file exists. PAY_TABLE is internal but drives all payout calculations — untested indirectly.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant; leniency applied. Still, the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and a one-line comment would clarify the positional semantics. No JSDoc present. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. PAY_TABLE at src/paytable.ts:5-12 is structurally correct: Record<string, [number, number, number]> with 6 symbol entries, each a valid 3-element tuple. Used correctly at line 15 via PAY_TABLE[symbol]. getPayMultiplier correctly indexes row[0]/row[1]/row[2] for counts 3/4/5 at lines 17-19. No crash path, no data loss. The values themselves are game-design configuration — no enforced constraint validates them against a target RTP. Changing them would be a behavioral change with no evidence of a bug.)

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function imported by 2 runtime files: src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: Semantic search found no similar functions
- **Correction [OK]**: Correctly maps (symbol, count∈{3,4,5}) to paytable row; returns 0 for absent symbols (WILD, SCATTER) and counts outside {3,4,5}.
- **Overengineering [LEAN]**: Straightforward index lookup into a flat record; three conditionals for count 3/4/5 are the simplest correct encoding.
- **Tests [NONE]**: No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for any symbol, count boundary (2, 3, 4, 5, 6), or unknown symbol returning 0.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing @param descriptions for symbol and count, no @returns, and no note that WILD/SCATTER return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers. Never imported anywhere.
- **Duplication [DUPLICATE]**: Identical logic to checkLine; both identify winning sequences by finding consecutive matching symbols (including WILD) with >= 3 count threshold. Only differences are variable names (first→lead, count→run) and return object keys (symbol→sym).
- **Correction [OK]**: Correctly resolves pay symbol by skipping leading WILDs, counts the contiguous WILD-or-match run from position 0, and returns null for WILD/SCATTER anchors and sub-3 runs.
- **Overengineering [LEAN]**: Single-pass contiguous-run scan with WILD substitution. Linear loop, no abstraction layers, does exactly one thing.
- **Tests [NONE]**: No test file. WILD substitution logic, SCATTER early-exit, leading-WILD resolution, and count >= 3 threshold are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with non-trivial logic: WILD-as-substitute resolution, SCATTER early-exit, left-to-right consecutive counting, minimum run of 3. No JSDoc — @param, @returns, and behavioral edge cases are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 100% identical logic — both check symbol sequences for >= 3 consecutive matches, handle WILD/SCATTER early returns, and count runs identically

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is typed as `Record<string, [number, number, number]>`, leaving both the outer object and tuple arrays mutable. The table is documented as fixed at module load time — it should be `as const` or use `Readonly<Record<string, readonly [number, number, number]>>`. [L5] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. Public API surface of a gambling engine paytable warrants parameter/return docs. [L3,L14,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `satisfies` to get both strict key checking and literal inference without losing the `Record` constraint. Current annotation widens tuple literals to `number[]`-equivalent and allows arbitrary string keys silently. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. `ANCIENT_RTP` is exported as a public API symbol with no `@deprecated` JSDoc tag. The `ANCIENT_` prefix strongly implies supersession; consumers have no indication they should not rely on it. Should carry `/** @deprecated */` or be replaced. [L3] |

### Suggestions

- Make PAY_TABLE immutable and use `satisfies` for precise key checking
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
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
- Add @deprecated to ANCIENT_RTP and JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /**
   * @deprecated Use the RTP constant from engine config instead.
   * Theoretical return-to-player: 95%.
   */
  export const ANCIENT_RTP = 0.95;
  ```
- Add JSDoc to getPayMultiplier
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base payout multiplier for a (symbol, run-length) pair.
   * Returns 0 for WILD, SCATTER, or run lengths outside [3, 5].
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** DIAMOND multipliers [50, 250, 1000] with reel weight 30/120=0.25 yield ≈229% RTP from DIAMOND runs alone. Either lower these multipliers (e.g. to ~[6, 30, 120]) or reduce DIAMOND's reel weight in reels.ts (e.g. from 30 to ~3-5) until the full-table theoretical RTP converges on the arbitrated 95% target. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
