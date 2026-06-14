# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | ACCEPTABLE | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 92% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted call at line 48 within spinReel function
- **Duplication [UNIQUE]**: Simple array constant; no similar functions found.
- **Correction [OK]**: Eight symbols in correct order matching weightsToArray and ReelWeightConfig fields.
- **Overengineering [LEAN]**: Plain array of 8 literals; appropriate for a fixed symbol set.
- **Tests [NONE]**: No test file exists. SYMBOLS defines the full symbol set used by spinReel and getReelSymbols — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported internal constant with no comment explaining its role as the master ordered symbol registry (order is significant — it must align with weight arrays).

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS (line 12) and weightsToArray parameter (line 17)
- **Duplication [UNIQUE]**: Type definition specific to reel weight configuration; no similar types found.
- **Correction [OK]**: Interface fields match SYMBOLS array order and documentation schema.
- **Overengineering [ACCEPTABLE]**: Explicit named interface instead of Record<Symbol, number>. Adds readability and self-documents the required fields, but forces the weightsToArray adapter to maintain ordering. Documented verbatim in the reference schema, so the design is intentional.
- **Tests [GOOD]**: Interface with no runtime behavior; correct by definition.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: name signals purpose (reel weight configuration) and all fields are symbol names mapped to numeric weights. No complex semantics require additional prose.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray in REEL_WEIGHTS initialization (lines 24-28)
- **Duplication [UNIQUE]**: Configuration constant; no similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight (30/120 = 25%/cell) combined with its 1000× 5-match payout produces ~97.7% RTP from one combination alone, leaving no budget for any other win and implying total RTP >> 100%, violating the documented 95% target [README.md; .anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md].
- **Overengineering [LEAN]**: Simple typed literal — all 8 values in one place, matches reference doc table exactly.
- **Tests [NONE]**: No test file. Weight values directly affect game odds; sum correctness and per-symbol values are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Magic numeric values (e.g. DIAMOND: 30, SEVEN: 5) carry no explanation of their relative-frequency intent or how they sum to 120. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at reels.ts:12-15 sum to 120, which is valid because pickFromWeighted (reels.ts:31) normalizes via `wts.reduce((s, w) => s + w, 0)`. No requirement for weights to sum to 100. Values represent reasonable slot machine symbol frequencies (high-frequency commons like DIAMOND:30, CHERRY:25; low-frequency premiums like SEVEN:5, WILD:5, SCATTER:5). Constant is consumed correctly at reels.ts:23-27 by weightsToArray(). No defect exists.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times in REEL_WEIGHTS array initialization (lines 24-28)
- **Duplication [UNIQUE]**: Simple helper converting config object to array; no similar functions found.
- **Correction [OK]**: Property extraction order exactly matches SYMBOLS array order; no mapping errors.
- **Overengineering [ACCEPTABLE]**: Thin adapter required by the ReelWeightConfig-to-array conversion. Exists only because weights are stored as a named-field struct rather than an ordered array; not independently over-engineered, just a consequence of that design choice.
- **Tests [NONE]**: No test file. Ordering of returned array must match SYMBOLS order exactly — a transposition would silently corrupt all odds. No tests verify this invariant.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper, 4 lines. However, the output order is implicitly coupled to the SYMBOLS array order — a non-obvious constraint with no comment.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel function at line 45
- **Duplication [UNIQUE]**: 2D weight array initialization; no similar constants found.
- **Correction [OK]**: Five entries, one per reel, matching documented configuration.
- **Overengineering [ACCEPTABLE]**: Five identical arrays anticipate per-reel weight variation. The exported getReelWeights(reelIndex) API implies per-reel configuration is a planned use case, so the expansion is not purely speculative.
- **Tests [NONE]**: No test file. No verification that all 5 reels are initialized, each has 8 entries, or that weights are non-negative.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share identical weight tables is a meaningful game-design decision with no comment.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called within spinReel function at line 48
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm with variable naming differences only.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a regulated casino/slot-machine domain; Math.random() is not a certifiable CSPRNG and fails regulatory RNG requirements for gaming (inferred domain: slot machine with reels/paylines/jackpot/free-spins vocabulary). Industry convention requires a cryptographically secure, auditable RNG.
- **Overengineering [LEAN]**: Textbook cumulative-weight draw; O(n) single pass, no unnecessary abstraction.
- **Tests [NONE]**: No test file. Core probability logic is completely untested: boundary conditions (r === 0, r just below total), fallback return on floating-point overshoot, uniform distribution across zero-weight items, and single-item degenerate case all lack coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper implementing cumulative-weight sampling. The algorithm has edge-case behaviour (fallback to last item when floating-point rounding causes r >= total) that is worth documenting. No JSDoc present. (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at reels.ts:30-41 is algorithmically identical to weightedPick at rng.ts:5-16 (verified: same cumulative-weight approach, only variable names differ). Duplication is real, but the function itself is correct — it produces proper weighted random selections. This is a refactoring opportunity, not a correctness defect. Note: engine.ts:120 resolves weightedPick via DI but never uses it; actual path is factories.ts:12 → spinReel (reels.ts:43) → pickFromWeighted (reels.ts:47). Replacing pickFromWeighted with an import of weightedPick would be a safe refactor since the algorithm is identical, but it's a code quality improvement, not a bug fix.)

> **Duplicate of** `src/rng.ts:weightedPick` — 99% identical — both implement weighted selection via accumulation and threshold comparison

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported and runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Domain-specific reel spinning for 3-row selection; no similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] yields undefined for any reelIndex outside [0, 4], causing pickFromWeighted to throw a TypeError on wts.reduce() at runtime.
- **Overengineering [LEAN]**: Straightforward loop over 3 rows, delegates sampling to pickFromWeighted.
- **Tests [NONE]**: No test file. Imported by src/factories.ts — a production code path. No tests for out-of-bounds reelIndex, column length of exactly 3, or symbol membership in SYMBOLS.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. Missing: description of reelIndex range (0–4), return shape (3-element column), and that each symbol is independently sampled.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter; no similar functions found.
- **Correction [OK]**: Returns the shared SYMBOLS array; no logic errors.
- **Overengineering [LEAN]**: Minimal accessor exposing the symbols array.
- **Tests [NONE]**: No test file. Imported by src/engine.ts. Returns mutable array reference; no tests verify contents or immutability.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. No description of the returned array's significance (master ordered symbol list) or whether it is a live reference or a copy.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter; no similar functions found.
- **Correction [OK]**: Returns REEL_WEIGHTS[reelIndex] without mutation; bounds risk is the same as spinReel but flagged there.
- **Overengineering [LEAN]**: Minimal accessor for per-reel weight lookup.
- **Tests [NONE]**: No test file. Imported by src/engine.ts. No tests for valid reelIndex range, returned array length, or correct weight values.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), meaning of returned values (weights summing to 120), and that the array is a direct reference to the internal mutable state.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates every Symbol key. Record<Symbol, number> is more concise and stays consistent automatically if the Symbol union changes. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS carry no readonly annotations. getReelWeights() returns a live mutable reference to the internal weights array, allowing callers to silently corrupt reel configuration. [L3-L28] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. At minimum, spinReel should document the valid reelIndex range [0, 4] and return shape. [L44-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel performs no bounds check on reelIndex. When reelIndex >= 5, REEL_WEIGHTS[reelIndex] is undefined and pickFromWeighted throws TypeError on wts.reduce — an unguarded runtime error for an invalid but plausible caller input. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Math.random() drives all reel picks. Domain: regulated casino/slot machine (symbols CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER; project files jackpot.ts, freespin.ts, paytable.ts). Math.random() is not a certifiable PRNG for regulated gaming — outcomes can be statistically predicted and are not auditable. src/rng.ts exists in the project and should supply the RNG instead. [L33-L42] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly with no injection point, making deterministic unit tests impossible without monkey-patching globals. Accepting an rng: () => number parameter (defaulting to Math.random) would decouple the randomness source. [L31-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS is typed with an explicit annotation; satisfies ReelWeightConfig would preserve literal number types while still enforcing the config shape. [L13-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights() returns a mutable reference to the live internal weights sub-array. In a gaming context, external mutation of reel weights post-construction violates game integrity; return type should be readonly number[] and the array should be returned as-is (readonly view) or copied. [L56-L58] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay in sync with Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Inject RNG from src/rng.ts instead of calling Math.random() directly — required for certified gaming compliance
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Guard spinReel against out-of-bounds reelIndex
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Add readonly annotations to module-level constants and return readonly views from getReelWeights
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const REEL_WEIGHTS: number[][] = [...];
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Use satisfies for DEFAULT_WEIGHTS to retain literal types while enforcing shape
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
  } satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a cryptographically secure RNG (e.g. crypto.getRandomValues in Node/browser) to satisfy regulated gaming RNG requirements. [L33]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight so the 5-DIAMOND expected payout across 10 paylines does not alone exceed the 95% RTP target. With payout=1000×lineBet and 10 paylines, the weight must satisfy 10×(w/120)^5×100 < 0.95 with margin left for all other wins; a weight in the range 2–5 (≈1.7%–4.2%/cell) is consistent with a high-value rare symbol at this paytable multiplier. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add a bounds guard at the top of spinReel (and optionally getReelWeights): if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length throw a RangeError rather than crashing inside pickFromWeighted with an opaque TypeError. [L44]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
