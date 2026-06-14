# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but never imported. 0 runtime importers, 0 type-only importers.
- **Duplication [UNIQUE]**: Constant RTP value. No similar constants found in RAG results.
- **Correction [OK]**: Constant correctly encodes the documented 95% RTP target; the failure to achieve that target is a PAY_TABLE defect, not a defect here.
- **Overengineering [LEAN]**: Simple numeric constant, appropriately scoped.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name implies RTP but 'ANCIENT' qualifier is unexplained — does it refer to a game theme, a legacy config, or a regulatory profile? Purpose and usage context are absent.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported internal constant. Referenced in getPayMultiplier (line 15).
- **Duplication [UNIQUE]**: Lookup table mapping symbols to payout arrays. No similar structures found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND multipliers [50, 250, 1000] with documented DIAMOND reel weight 30/120 produce an implied RTP far above the arbitrated 95% target. Forward derivation (no-wild runs only, RTP = E[multiplier per payline]): 3-of-a-kind: (30/120)^3 × (85/120) × 50 = 0.01107 × 50 = 0.554; 4-of-a-kind: (30/120)^4 × (85/120) × 250 = 0.00277 × 250 = 0.692; 5-of-a-kind: (30/120)^5 × 1000 = 0.000977 × 1000 = 0.977; DIAMOND no-wild subtotal = 2.223. Wild-boosted DIAMOND 5-of-a-kind adds ≈3.26 (1-wild) + ≈3.25 (2-wild) + more, pushing total DIAMOND contribution alone above 9×. Adding CHERRY, LEMON, BELL, BAR, SEVEN yields total RTP >> 200%. Backward derivation: for DIAMOND to consume a reasonable share of the 0.95 budget, reel weight must be ≈2–3, not 30. Sanity check: forward(w=2) ≈ (2/120)^3 × (113/120) × 50 + … ≈ 0.007 (plausible single-symbol share of 0.95) ✓; forward(w=30) = 2.223 ≫ 0.95 ✓ — formula self-consistent, finding is sound.
- **Overengineering [LEAN]**: Flat lookup table mapping symbols to a fixed 3-tuple. Minimal and correct for a static paytable.
- **Tests [NONE]**: No test file exists. Internal constant, but its values are exercised indirectly through getPayMultiplier — which is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Tuple index semantics (index 0 = 3-of-a-kind, 1 = 4-of-a-kind, 2 = 5-of-a-kind) are implicit and undocumented. Private constant, so severity is lower, but the column mapping is non-obvious.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function. Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: Retrieves payout multiplier from PAY_TABLE. RAG reports no similar functions found.
- **Correction [OK]**: Correctly maps (symbol, count) pairs to paytable multipliers; returns 0 for absent symbols (WILD, SCATTER) and for counts outside {3,4,5}.
- **Overengineering [LEAN]**: Straight index lookup with three conditionals. No abstraction needed beyond this.
- **Tests [NONE]**: No tests found. Used by engine.ts and legacy.ts in critical payout paths. Untested edge cases include unknown symbol (returns 0), count < 3 (returns 0), count === 3/4/5 for each symbol, and count > 5 (returns 0).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: what `count` represents (run length), valid range (3–5), that WILD/SCATTER return 0, and what the return value unit is (base multiplier applied to line bet).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but never imported. 0 runtime importers, 0 type-only importers.
- **Duplication [DUPLICATE]**: Identical logic to checkLine: finds leading non-WILD symbol, counts consecutive matches including WILDs, returns null if fewer than 3. Differs only in variable/property names (first/lead, count/run, symbol/sym).
- **Correction [OK]**: Correctly resolves pay symbol by skipping leading WILDs, counts the contiguous run of matching-or-WILD symbols from position 0, and returns null for all-WILD and SCATTER-first lines.
- **Overengineering [LEAN]**: Single-pass contiguous-run counter with WILD substitution. Appropriately minimal for the payline evaluation contract.
- **Tests [NONE]**: No tests found. Complex logic with multiple untested branches: all-WILD input, SCATTER in first position, WILD substitution for first symbol, mixed symbol lines breaking the count loop, count < 3 returning null.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Non-trivial logic undocumented: WILD-as-substitute for leading position, consecutive-from-index-0 counting rule, SCATTER exclusion, minimum run of 3, and the shape/meaning of the returned object.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical—same algorithm for finding lead symbol and counting consecutive matches. Only naming differs.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE key is typed as string rather than a symbol-specific literal union (e.g. Exclude<Symbol, 'WILD' \| 'SCATTER'>), losing exhaustiveness. Return type of lineWins uses an anonymous inline object that could be a named type alias. [L5-L12, L23] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a mutable object despite const declaration — entries can be overwritten at runtime (PAY_TABLE['DIAMOND'] = [1,1,1]). Use as const or Readonly<Record<...>> with readonly tuple entries. [L5-L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (ANCIENT_RTP, getPayMultiplier, lineWins) have no JSDoc. Parameter semantics, return values, and edge cases (count outside [3,5], WILD/SCATTER inputs) are undocumented. [L3, L14, L23] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from symbol vocabulary (CHERRY/SEVEN/DIAMOND/WILD/SCATTER/PAY_TABLE/RTP). PAY_TABLE is not frozen — payout multipliers can be mutated at runtime, violating paytable integrity requirements under regulated gaming certification standards (GLI-11). Attack surface is module-internal only (PAY_TABLE is not exported), reducing exploitability, but the structural gap remains a compliance risk. [L5-L12] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | satisfies operator would let PAY_TABLE preserve literal types while enforcing shape constraints, catching key typos at compile time. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two naming issues: (1) ANCIENT_RTP — no 'ancient' game variant exists in reference docs; name is unexplained and likely stale. (2) Exporting a function named lineWins from paytable.ts collides with the SpinResult.lineWins field name, creating API confusion for consumers; reference docs assign payline-checking to engine.ts (checkLine). [L3, L23] |

### Suggestions

- Freeze PAY_TABLE with as const + satisfies to prevent runtime mutation and narrow the key type
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    // ...
  };
  // After
  type PaySymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;
  
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Certified theoretical return-to-player ratio (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Maps a (pay symbol, run length) pair to a base multiplier.
   * Returns 0 for WILD, SCATTER, or count outside [3, 5].
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Rename lineWins to checkPayline to avoid collision with SpinResult.lineWins and match architecture docs (engine.ts owns line checking)
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function checkPayline(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** DIAMOND row [50, 250, 1000] combined with DIAMOND reel weight 30/120 produces implied RTP > 200%, violating the arbitrated 95% target. Reduce DIAMOND multipliers and/or DIAMOND reel weight until the combined E[multiplier per payline] across all symbols equals 0.95. At w=30, the 3+4+5-of-a-kind DIAMOND no-wild contribution alone (2.223) already exceeds the full RTP budget. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
