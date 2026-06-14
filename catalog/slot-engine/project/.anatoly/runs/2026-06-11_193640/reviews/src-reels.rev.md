# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by spinReel and getReelSymbols, both of which have external consumers.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Array of 8 slot symbols matches documented symbol set exactly.
- **Overengineering [LEAN]**: Simple constant array of the 8 fixed symbol names. Minimal and appropriate.
- **Tests [NONE]**: No test file. Transitive callers spinReel and getReelSymbols are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name is clear but no comment explains it is the master ordered list that drives reel index mapping used by pickFromWeighted and getReelSymbols.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS constant and weightsToArray parameter.
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface correctly mirrors the 8-symbol set; field order aligns with SYMBOLS array.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; type-only construct needs no tests.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: name communicates purpose, fields are all symbol names typed as number weights. No complex semantics beyond what the names convey.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when building REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Weights (25+25+15+10+5+30+5+5=120) match reference docs exactly.
- **Overengineering [LEAN]**: Straightforward named-field object. Its verbosity is the cost of ReelWeightConfig, not of itself.
- **Tests [NONE]**: No test file exists; constant exercised only through untested callers.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Raw numeric values lack context — no comment explains what the total sums to (120), how probabilities are derived, or that these weights are applied identically to all five reels.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in REEL_WEIGHTS initializer to convert DEFAULT_WEIGHTS to number arrays.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Extraction order matches SYMBOLS declaration order; no logic errors.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file. Private helper with no tested callers.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, <5 lines, name is descriptive. Lenient treatment applies; omitting is tolerable, but the fixed ordering assumption (CHERRY→LEMON→BELL→BAR→SEVEN→DIAMOND→WILD→SCATTER) is a non-obvious contract.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced by spinReel and getReelWeights, both consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels each initialized from DEFAULT_WEIGHTS via weightsToArray; correct structure.
- **Overengineering [ACCEPTABLE]**: Five identical calls to weightsToArray(DEFAULT_WEIGHTS) produce five equal arrays, enabling future per-reel differentiation. The docs confirm all reels share one weight set, so a single source array re-used (or Array(5).fill) would be leaner, but keeping 5 separate slots is a defensible forward-looking choice for a game engine where per-reel tuning is common.
- **Tests [NONE]**: No test file. Transitive callers spinReel and getReelWeights are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all five reels are intentionally identical copies of DEFAULT_WEIGHTS; a comment would clarify the design decision and make per-reel customization obvious.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel per row to perform weighted random symbol selection.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, draw Math.random()*total, accumulate per-index, and return the item whose cumulative threshold is first exceeded, falling back to the last item. The only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that pickFromWeighted constrains items to Symbol[] instead of using a generic T[]. These functions are fully interchangeable; pickFromWeighted should be replaced with weightedPick<Symbol>.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG in a slot-machine domain.
- **Overengineering [LEAN]**: Textbook O(n) weighted random selection. No unnecessary abstraction; correctly handles floating-point edge cases with the fallback return.
- **Tests [NONE]**: No test file. Core weighted-random logic — probability distribution, boundary (r==0, r==total), and fallback to last item are all uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with a clear name; however it has a subtle fallback (returns last item when floating-point rounding pushes r == total), which warrants at least an inline note. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. Compared reels.ts:30-41 (pickFromWeighted) with rng.ts:5-16 (weightedPick) line-by-line: the algorithms are logically identical (cumulative-weight uniform draw, fallback to last item). Both implementations are correct — no behavioral bug exists. The duplication is real (maintenance/DRY concern belonging on the duplication axis) but does not constitute a correctness defect. pickFromWeighted is called at reels.ts:47 inside spinReel and produces correct weighted selections.)

> **Duplicate of** `src/rng.ts:weightedPick` — 100% identical algorithm — same weighted-random selection loop, same fallback, differs only in variable names and type parameter (Symbol[] vs generic T[])

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Correctly iterates 3 rows per reel column; delegates weighted pick to pickFromWeighted.
- **Overengineering [LEAN]**: Straight loop generating 3 symbols from a weighted distribution. Does exactly one thing.
- **Tests [NONE]**: No test file. Used by src/factories.ts but no tests verify column length, symbol membership, or weight application.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), meaning of the returned 3-element array (one Symbol per visible row), and that each row is sampled independently.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the module-level SYMBOLS array; no logic errors.
- **Overengineering [LEAN]**: Minimal accessor; needed by engine.ts consumer.
- **Tests [NONE]**: No test file. Consumed by engine.ts spin() but that path is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. A one-liner getter, but callers need to know the returned array is ordered and that its indices align with getReelWeights output.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns REEL_WEIGHTS[reelIndex]; no logic errors.
- **Overengineering [LEAN]**: Minimal accessor matching the documented read-only API contract.
- **Tests [NONE]**: No test file. Consumed by engine.ts spin() but that path is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that indices align with getReelSymbols(), that the returned array is a direct reference (not a copy), and the weight total (120).

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are module-level constants with no readonly enforcement. getReelWeights() returns the raw internal array reference, allowing callers to silently mutate engine weight state. [L3-L57] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights have no JSDoc comments. [L41-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), paytable, free spins, jackpot, and RTP documentation. Math.random() is not certifiable for regulated gaming RNG — it is not cryptographically secure, cannot be audited for statistical fairness, and fails regulatory requirements in most jurisdictions. The project contains src/rng.ts, indicating a dedicated RNG module exists; pickFromWeighted must delegate to it instead of calling Math.random() directly. [L33] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded inside pickFromWeighted; spinReel cannot be tested deterministically without global mocking. An injectable RNG parameter (or using src/rng.ts with a seeded stub) would enable pure unit tests. [L30-L38] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and REEL_WEIGHTS could use `as const satisfies` for tighter literal inference. No satisfies operator used where it would strengthen type checking. [L3-L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | spinReel does not bounds-check reelIndex; REEL_WEIGHTS[reelIndex] yields undefined for out-of-range values, causing pickFromWeighted to receive undefined weights and silently return the last symbol. getReelWeights exposes the mutable internal array, violating the read-only contract documented in the API reference. [L41-L52] |

### Suggestions

- Enforce immutability on all module-level constants and return a readonly type from getReelWeights
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Replace Math.random() with the project's dedicated RNG module for certifiable, auditable randomness
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { nextFloat } from "./rng.js";
  const r = nextFloat() * total;
  ```
- Add bounds-check to spinReel and JSDoc to all exports
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  /**
   * Spins a single reel and returns 3 random symbols.
   * @param reelIndex - Reel column index, 0–4
   * @throws {RangeError} if reelIndex is out of bounds
   */
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a certified CSPRNG (e.g., crypto.getRandomValues or a seeded, auditable PRNG approved by the target jurisdiction's gaming lab). Math.random() is non-deterministic in seeding, implementation-defined in distribution, and excluded from GLI/BMM/iTech certifications for regulated slot RNG. [L32]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
