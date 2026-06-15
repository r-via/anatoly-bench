# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 93% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 87% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported; passed to pickFromWeighted in spinReel (L48)
- **Duplication [UNIQUE]**: Constant array of symbol strings. No similar constants found in RAG results.
- **Correction [OK]**: 8-element array matches ReelWeightConfig field order and weightsToArray mapping exactly.
- **Overengineering [LEAN]**: Simple ordered constant array; single source of truth for symbol set.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name is clear but no comment explaining it is the canonical ordered symbol list shared by all reels.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported; passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L24–L28)
- **Duplication [UNIQUE]**: Constant object defining default symbol weights. No similar constants found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (25% per cell) makes 5-DIAMOND alone contribute ~97.7% expected return across 10 paylines, exceeding the arbitrated 95% RTP target before any other symbol is counted.
- **Overengineering [LEAN]**: Straightforward value declaration; complexity lies in its type, not the constant itself.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Numeric weight values carry implicit RTP/probability semantics that are non-obvious without a comment (e.g. total=120, DIAMOND is heaviest at 30). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. DEFAULT_WEIGHTS at src/reels.ts:12-15 has 8 valid numeric weights summing to 120, correctly consumed by weightsToArray (line 17-19) which extracts values in SYMBOLS order. DIAMOND=30 being the most probable symbol with the highest payout is a game-balance concern, not a code defect. ANCIENT_RTP=0.95 (paytable.ts:3) is an unreferenced constant — no runtime code enforces it. computePayout at engine.ts:105 multiplies by (1+HOUSE_EDGE)=1.05 which increases payouts, showing the entire payout chain has multiple design-level inconsistencies, not an isolated weight bug. No crash, no data loss.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported; used in spinReel (L44) and getReelWeights (L57)
- **Duplication [UNIQUE]**: 2D array of weights for 5 reels initialized from DEFAULT_WEIGHTS. No similar constants found in RAG results.
- **Correction [OK]**: 5 reels each initialized from weightsToArray(DEFAULT_WEIGHTS); structure is correct.
- **Overengineering [ACCEPTABLE]**: Five explicit calls are verbose when all reels share identical weights, but the per-index structure keeps the door open for per-reel tuning without a refactor.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all five reels share identical weights; a brief comment would clarify the design intent.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported; called in spinReel loop (L48) for weighted symbol selection
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm to weightedPick in rng.ts (RAG score 0.823). Both: compute total weight via reduce, generate random value, iterate with accumulator, return when threshold exceeded, fallback to last item.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a certified slot-machine engine; not suitable for regulated gaming RNG.
- **Overengineering [LEAN]**: Textbook weighted random selection — linear scan, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. This is the most critical untested symbol — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, single-item lists, zero-weight items) is untested. Called by spinReel which feeds src/factories.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-trivial algorithm (cumulative weighted random selection) with no JSDoc. Not exported, but complexity warrants at minimum a one-line description. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Algorithm at src/reels.ts:30-41 is a correct cumulative-weight random selection: sums weights via reduce (line 31), generates uniform random in [0, total) (line 32), accumulates and returns on threshold (lines 34-38), fallback to last item (line 40). Called at line 47 with SYMBOLS (8 items) and REEL_WEIGHTS[reelIndex] (8 weights) — always matching lengths. Duplication with rng.ts:weightedPick is real (RAG score 0.823) but belongs on the duplication axis, not correction. Math.random() non-certifiability is a compliance concern, not an algorithmic correctness defect.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical implementation — same weighted random selection algorithm with identical control flow. Only differences: variable naming (total/totalWeight, r/roll, acc/cumulative) and generic <T> vs Symbol-specific typing.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported; runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Spins a reel by calling pickFromWeighted 3 times for a column. No similar functions found in RAG results.
- **Correction [OK]**: Three independent weighted picks per reel column are logically correct; no bounds check on reelIndex but no documented requirement for one.
- **Overengineering [LEAN]**: Minimal: looks up weights by index, fills a 3-row column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts — a critical caller path with no coverage for valid reelIndex, out-of-bounds reelIndex, or output shape (3 symbols per column).
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of reelIndex range (0–4), explanation that return value is a 3-element column, and any note on independence of picks.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Simple getter returning SYMBOLS constant. Trivial function.
- **Correction [OK]**: Returns SYMBOLS array; no documented read-only invariant for the symbol list.
- **Overengineering [LEAN]**: Thin read-only accessor; appropriate for encapsulation.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of return value order or that it mirrors the weight-array index mapping.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Simple getter returning indexed REEL_WEIGHTS array. Trivial function.
- **Correction [NEEDS_FIX]**: Returns direct mutable reference to internal REEL_WEIGHTS[reelIndex]; callers can alter live weight state, violating the documented read-only invariant.
- **Overengineering [LEAN]**: Thin read-only accessor matching documented API contract.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts. Out-of-bounds reelIndex returns undefined with no guard — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), description of returned array length/order, and that weights are read-only.

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually lists all 8 Symbol keys. Record<Symbol, number> would keep it automatically in sync if the Symbol union changes. [L8-L11] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all const-bound but fully mutable at runtime. getReelWeights returns the raw internal array reference, allowing callers to silently mutate reel probabilities. Missing readonly on all three module-level constants. [L3, L15, L23, L55] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (spinReel, getReelSymbols, getReelWeights) lack JSDoc. spinReel especially needs documentation for its reelIndex range (0–4) and the fact it returns 3 symbols per column. [L44, L51, L55] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel performs no bounds check: REEL_WEIGHTS[reelIndex] is undefined for reelIndex outside 0–4, and the undefined is silently passed to pickFromWeighted, causing a crash at the wts[i] access. reelIndex is typed as number with no constraint. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol/jackpot/free-spin/paytable vocabulary throughout the codebase (CHERRY, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER, 95% RTP target). Math.random() is a non-cryptographic PRNG and is not certifiable for regulated gaming RNG requirements. The project already contains src/rng.ts — a dedicated RNG abstraction — which this file bypasses entirely, calling Math.random() directly inside the hot-path pickFromWeighted function. [L33] |
| 14 | Performance | WARN | MEDIUM | pickFromWeighted recomputes the weight sum via reduce on every call. With 3 rows × 5 reels = 15 invocations per spin, pre-computing totals alongside REEL_WEIGHTS at module load would eliminate 15 O(n) passes. [L31] |
| 15 | Testability | FAIL | MEDIUM | Math.random() is hardcoded inside pickFromWeighted with no injection point. spinReel outcomes cannot be tested deterministically. src/rng.ts exists in the project tree and is not imported, suggesting an injectable RNG abstraction is already available but unused. [L30-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS could use as const satisfies readonly Symbol[] for stronger literal-type inference. DEFAULT_WEIGHTS could use satisfies ReelWeightConfig to retain numeric literal types while still enforcing shape. [L3, L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns number[] — a mutable reference into REEL_WEIGHTS. Any caller can do getReelWeights(0)[0] = 0 and silently corrupt reel probabilities for all subsequent spins. Should return ReadonlyArray<number> to match the documented read-only contract. [L55-L57] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay in sync with the Symbol union automatically.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Freeze module-level constants with readonly/as const to prevent runtime mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
  const REEL_WEIGHTS: number[][] = [...];
  // After
  const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { CHERRY: 25, ... } as const;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  ```
- Return ReadonlyArray<number> from getReelWeights to enforce the documented read-only contract.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Inject an RNG function to enable deterministic testing and wire in the project's src/rng.ts certified implementation.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
    ...
  }
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
    const r = rng() * total;
    ...
  }
  export function spinReel(reelIndex: number, rng: () => number): Symbol[] {
  ```
- Add a bounds guard to spinReel to fail fast on invalid reelIndex instead of propagating undefined.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a certifiable gaming PRNG (e.g., Web Crypto getRandomValues or a certified RNG library) — Math.random() is not admissible for regulated slot RNG. [L33]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to ≤ 8 (and rebalance other weights) so the 5-DIAMOND combo does not alone consume the entire 95% RTP budget across 10 paylines. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Return a shallow copy of the weight array in getReelWeights (return [...REEL_WEIGHTS[reelIndex]]) to enforce the documented read-only runtime invariant. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
