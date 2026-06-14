# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 88% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used in spinReel at L47 and returned by getReelSymbols at L53
- **Duplication [UNIQUE]**: Data constant array. No similar definitions found.
- **Correction [OK]**: Eight symbols match ReelWeightConfig keys and weightsToArray order.
- **Overengineering [LEAN]**: Simple constant array of 8 symbol names.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; name is clear, but no comment explaining its role as the canonical ordered symbol list used for reel indexing.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization at L23–L27
- **Duplication [UNIQUE]**: Data constant object. No similar definitions found.
- **Correction [NEEDS_FIX]**: DIAMOND weight=30 (25% per cell) makes DIAMOND's expected line-bet contribution alone ~230%, violating the arbitrated 95% RTP target.
- **Overengineering [ACCEPTABLE]**: Named config object is readable and matches documented weight table. Slight overhead from ReelWeightConfig indirection, but the named fields aid maintainability.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported. No comment explaining that weights sum to 120 or that all five reels share this distribution. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. The weights are structurally valid configuration values used correctly at reels.ts:23-27 via weightsToArray. The claim that DIAMOND=30 violates the 95% RTP target is mathematically sound (DIAMOND alone contributes ~230% expected payout), but this is a game-design balancing issue, not a code correctness defect. The weights don't cause crashes, data loss, or security breaches — they produce 'overly generous' payouts relative to a stated target. The ANCIENT_RTP=0.95 constant in paytable.ts:3 and the comment at engine.ts:99 are aspirational documentation, not enforced constraints. Additionally, computePayout at engine.ts:105 itself multiplies by (1+HOUSE_EDGE)=1.05 which INCREASES payout — showing the entire RTP calculation chain has multiple design inconsistencies, not an isolated weight defect. Changing DEFAULT_WEIGHTS is a behavioral change with no evidence of a bug.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used in spinReel at L44 and getReelWeights at L57
- **Duplication [UNIQUE]**: Data constant array initialization. No duplicates found.
- **Correction [OK]**: Five reels each initialised with DEFAULT_WEIGHTS via weightsToArray; structure is correct.
- **Overengineering [ACCEPTABLE]**: Five reels all sharing the same weight array could be expressed as a single array plus a repeat, but the explicit 2D layout is clear and matches the documented per-reel getter API.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported. No comment explaining the 5-reel structure or that all reels share identical weights.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel at L47 to select weighted random symbols
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Same logic flow and fallback behavior; variable names differ (acc/cumulative, r/roll, wts/weights) but semantics are fully interchangeable. Score 0.823 with matching behavior in source.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; inferred slot-machine domain from reel/payline/jackpot/SCATTER/WILD vocabulary throughout the project.
- **Overengineering [LEAN]**: Standard weighted random selection — minimal, correct, no unnecessary abstractions.
- **Tests [NONE]**: No test file exists. This function uses Math.random() and has boundary behavior (last-item fallback) that warrant dedicated tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private but non-trivial weighted-random algorithm. No JSDoc describing the selection logic, parameter contracts, or edge case (fallback to last item). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Verified reels.ts:30-41: the algorithm (sum weights, uniform random draw, cumulative accumulation, last-item fallback) is a correct implementation of weighted random selection. It produces valid results for all inputs seen in the codebase — SYMBOLS always has 8 elements (reels.ts:3-5), weights always has 8 values (reels.ts:12-15). The two sub-claims that triggered NEEDS_FIX are misclassified: (1) Math.random() non-certifiability is a security/compliance concern, not a correctness bug — the algorithm itself is mathematically correct regardless of RNG source. (2) Duplication with rng.ts:weightedPick belongs on the duplication axis, not correction. The function is the one actually called at runtime via spinReel (reels.ts:47 → factories.ts:12 → engine.ts:128).)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical algorithm — both implement weighted random selection with same reduce, random, and loop logic. pickFromWeighted specializes weightedPick<Symbol>.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported; runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found via semantic search.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range index yields undefined weights, crashing in pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward 3-row column fill using pickFromWeighted.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts — a critical path with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 independently sampled symbols, and what happens for an out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function. No duplicates found.
- **Correction [OK]**: Returns SYMBOLS reference; no documented read-only contract on the symbols array.
- **Overengineering [LEAN]**: Simple accessor returning the module-level constant.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. While simple, a note that the returned array is ordered and matches the weight-array index positions would be useful.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function. No duplicates found.
- **Correction [NEEDS_FIX]**: Returns the internal REEL_WEIGHTS[reelIndex] array by reference; callers can mutate reel weights, violating the documented read-only contract.
- **Overengineering [LEAN]**: Simple indexed accessor, matches documented API contract.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), return array ordering, and that the array is not a defensive copy.

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig redeclares every Symbol literal as a manual property. Record<Symbol, number> is more concise and automatically stays in sync with the Symbol union. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all declared as mutable. getReelSymbols() and getReelWeights() return live mutable references to internal module arrays, allowing callers to silently corrupt the reel distribution used by all subsequent spins. [L3-L28] |
| 8 | ESLint compliance | WARN | HIGH | wts[i] inside pickFromWeighted is accessed without a bounds guard (noUncheckedIndexedAccess would surface this). spinReel does not validate reelIndex before indexing REEL_WEIGHTS; an out-of-range index yields undefined weights and crashes silently inside pickFromWeighted. [L30-L50] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. spinReel's return shape (a 3-symbol column, not a flat list) is non-obvious and especially needs documentation. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel accepts an arbitrary number but never validates that reelIndex is in [0, 4]. REEL_WEIGHTS[reelIndex] returns undefined for out-of-range indices; the undefined is then silently passed to pickFromWeighted where wts.reduce will return NaN and the function misbehaves without throwing. [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER; co-located freespin.ts, jackpot.ts, paytable.ts). Math.random() is V8's Xorshift128+, a non-cryptographic PRNG that is not certifiable for regulated gaming under GLI-11, BMM, eCOGRA, or equivalent standards. Regulated jurisdictions require an RNG that passes NIST SP 800-22 and holds third-party certification. The project already ships src/rng.ts — reels.ts bypasses it entirely by calling Math.random() directly. [L32] |
| 15 | Testability | FAIL | MEDIUM | pickFromWeighted calls Math.random() with no injection point. Unit tests must monkey-patch Math.random or use jest.spyOn, making them fragile. An rng parameter (defaulting to Math.random) would enable deterministic testing and align with the existing src/rng.ts abstraction. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use `satisfies ReelWeightConfig` to retain literal types while validating shape. SYMBOLS could use `as const satisfies readonly Symbol[]` for a narrower readonly tuple. [L3-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns a mutable reference to internal REEL_WEIGHTS. The reference docs state weights are read-only at runtime, but any caller can do getReelWeights(0).push(99) and corrupt all subsequent spins on that reel. Should return ReadonlyArray<number> (or a copy) to enforce the stated invariant. [L56-L58] |

### Suggestions

- Replace the direct Math.random() call with an injectable RNG parameter to enable deterministic testing and swap in a certified RNG for regulated play.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Mark all module-level constants as deeply readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [ ... ];
  ```
- Return a readonly view from getReelWeights to enforce the documented read-only invariant.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Use Record<Symbol, number> for ReelWeightConfig to stay in sync with the Symbol union automatically.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Apply satisfies for DEFAULT_WEIGHTS to retain narrow literal types while still validating the shape at compile time.
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds check in spinReel before accessing REEL_WEIGHTS[reelIndex] to prevent TypeError on invalid indices. [L44]
- **[correction · medium · small]** Return a shallow copy (slice()) from getReelWeights to prevent external mutation of the internal weight table. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certifiable, auditable RNG suitable for regulated gaming. [L33]
- **[correction · high · large]** Reduce DIAMOND weight from 30 to approximately 9–12 (or rebalance the full weight table) so that the total expected line-bet return across all symbols stays near the arbitrated 95% RTP target. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
