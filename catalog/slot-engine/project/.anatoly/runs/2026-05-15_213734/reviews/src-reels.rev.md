# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | ACCEPTABLE | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 80% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Passed to pickFromWeighted in spinReel (L47)
- **Duplication [UNIQUE]**: Constant array of symbol types. No similar definitions found.
- **Correction [OK]**: 8-element array order matches ReelWeightConfig fields and weightsToArray output order.
- **Overengineering [LEAN]**: Simple array of 8 symbol constants. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Array contents and ordering are never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol registry for weighted sampling) is not self-evident from the name alone.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L18)
- **Duplication [UNIQUE]**: Type alias for symbol weight configuration. No similar type definitions found.
- **Correction [OK]**: Interface correctly models all 8 symbol weight fields.
- **Overengineering [ACCEPTABLE]**: Typed config interface with named fields per symbol. Slightly more structure than a plain number[] but buys compile-time safety and is documented as the canonical shape in the configuration schema.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: field names map 1-to-1 to symbol names with numeric weights. No complex semantics require additional prose.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray in REEL_WEIGHTS initialization (L24-28)
- **Duplication [UNIQUE]**: Default weight configuration constant. No similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (25%/cell) combined with 1000× 5-match payout contributes ~97.7% expected return per spin from that one win type alone, before any other symbol wins; total RTP >> 100%, violating arbitrated RTP = 95% [README.md].
- **Overengineering [LEAN]**: Flat object with one numeric field per symbol. Direct and minimal.
- **Tests [NONE]**: No test file. Weight values are never asserted and sum (120) is never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation of what the numeric values represent (relative probability weights, total=120) and that all five reels share this table. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at src/reels.ts:12-15 sum to 120 (CHERRY:25+LEMON:25+BELL:15+BAR:10+SEVEN:5+DIAMOND:30+WILD:5+SCATTER:5). These match internal documentation verbatim: 'Total weight: 120. pickFromWeighted draws a uniform random in [0, 120)'. The NEEDS_FIX claim provides no evidence of what the correct values should be. RTP depends on the entire system (weights + paytable + paylines + HOUSE_EDGE), not weights alone. These are intentional design constants.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel to get weights for reel (L44)
- **Duplication [UNIQUE]**: Array of weight configurations for five reels. No similar constants found.
- **Correction [OK]**: Five reels initialized from DEFAULT_WEIGHTS; RTP defect attributed to DEFAULT_WEIGHTS.
- **Overengineering [OVER]**: Five identical rows produced by calling weightsToArray(DEFAULT_WEIGHTS) five times. All reels share the same weights (confirmed by reference docs), so storing a 2-D array of duplicates adds indirection. A single shared weights array passed into spinReel would suffice.
- **Tests [NONE]**: No test file. Number of reels (5) and per-reel weight arrays are never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 5-reel structure and its relationship to SYMBOLS index positions are not documented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop to select random symbols (L47)
- **Duplication [DUPLICATE]**: Implements weighted random selection. Semantically identical to weightedPick in src/rng.ts — both sum weights, generate random value, iterate to find item where cumulative exceeds random, and return fallback. Only differences: variable naming, generic vs specific type, and export status.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated gambling; slot-machine domain confirmed by reel/payline/jackpot vocabulary and arbitrated RTP target.
- **Overengineering [LEAN]**: Standard cumulative-weight sampling loop. Correct and minimal for its purpose.
- **Tests [NONE]**: No test file. Weighted distribution logic, boundary condition (r exactly at boundary), and fallback return are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Cumulative-weight sampling algorithm, parameter semantics (items and wts must be same length), and fallback behavior (returns last item on floating-point edge case) are undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — src/reels.ts:30-41 implements correct cumulative-weight random selection: sums weights, generates uniform random in [0,total), accumulates and returns matching item, with last-item fallback. Algorithm is sound. The finding conflates duplication (real — identical to weightedPick in rng.ts) with correctness. Duplication is a code quality concern belonging on the duplication axis, not a correctness defect. The function produces correct results every time it's called (src/reels.ts:47).)

> **Duplicate of** `src/rng.ts:weightedPick` — Identical logic: sum weights, generate random in range, accumulate and select item, return last as fallback. Score 0.819.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported, runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Spins a single reel (3 rows) by calling pickFromWeighted. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for reelIndex outside [0,4], causing TypeError in pickFromWeighted at wts.reduce().
- **Overengineering [LEAN]**: Draws 3 symbols per reel column using weighted sampling. Straightforward loop, no unnecessary abstraction.
- **Tests [NONE]**: No test file. Used by src/factories.ts; column length (3), valid symbol membership, and invalid reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), return shape (3-element column), and that symbols are drawn independently per row.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS array. No similar functions found.
- **Correction [OK]**: Returns SYMBOLS directly; no logic errors.
- **Overengineering [LEAN]**: Simple accessor exposing the symbols array. One line of logic.
- **Tests [NONE]**: No test file. Used by src/engine.ts; returned array identity and contents never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of what the returned array represents or its ordering significance.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning weights for given reel index. No similar functions found.
- **Correction [NEEDS_FIX]**: Returns undefined (typed number[]) for reelIndex outside [0,4]; no bounds check, silently propagates undefined to callers.
- **Overengineering [LEAN]**: Simple index accessor for reel weights. Minimal.
- **Tests [NONE]**: No test file. Used by src/engine.ts; out-of-range reelIndex returning undefined is never caught.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range, that the returned array indices correspond to SYMBOLS order, and whether the array is a copy or a live reference.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually mirrors the Symbol union. Record<Symbol, number> would stay in sync automatically if the Symbol union grows. [L8-L11] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelSymbols() and getReelWeights() return live mutable references, allowing callers to silently corrupt module state. [L3-L26] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are exported with no JSDoc. Parameter semantics (reelIndex range, return shape) are undocumented. [L43-L58] |
| 13 | Security | FAIL | CRITICAL | Math.random() is the sole RNG in a regulated slot-machine domain (95% RTP target, jackpot, pay table confirmed by .anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md). Math.random() is a non-seeded PRNG that fails certification requirements for regulated gaming. The project already provides src/rng.ts but it is not imported here. [L35] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hard-coded inside pickFromWeighted with no injection point. Tests must patch the global, making them brittle. An rng parameter with a default would allow deterministic unit tests. [L31-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS and REEL_WEIGHTS are prime candidates for the satisfies operator, which preserves literal numeric types while validating against the interface—currently the explicit annotation widens all values to number. [L13-L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | spinReel does not guard reelIndex bounds: REEL_WEIGHTS[reelIndex] is undefined for indices ≥ 5 or < 0, causing a runtime crash in pickFromWeighted. getReelWeights also leaks a mutable reference to internal state. [L43-L49] |

### Suggestions

- Derive ReelWeightConfig from the Symbol union via Record to stay in sync with future symbol additions
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark all module-level constants readonly and return copies/readonly views from accessors
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies readonly Symbol[];
  
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Replace Math.random() with the project RNG abstraction and inject it for deterministic testing
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from './rng.js';
  
  type RngFn = () => number;
  
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: RngFn = nextFloat,
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
      throw new RangeError(
        `reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`
      );
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a CSPRNG (e.g., crypto.getRandomValues()) to meet regulated gaming RNG requirements. [L32]
- **[correction · medium · small]** Add bounds check in spinReel: throw RangeError (or assert) when reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length before accessing the weights array. [L44]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight so its 5-match contribution (1000 × (w/120)^5 × 10 paylines) stays within a fraction of the 95% RTP budget; a weight in the range 3–13 is consistent with targeting 95% total RTP alongside other symbol payouts. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add the same bounds check in getReelWeights to prevent returning undefined where number[] is expected. [L57]
- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
