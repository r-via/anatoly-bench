# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 95% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by pickFromWeighted call in spinReel and returned by getReelSymbols, both of which are runtime-imported externally.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Eight symbols defined, order matches weightsToArray and is consistent with reference docs.
- **Overengineering [LEAN]**: Plain array of 8 symbol literals — minimal and appropriate.
- **Tests [NONE]**: No test file exists. Transitive coverage via spinReel/getReelSymbols, but those exports are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; not exported, but its role as the master symbol roster used by all reels is non-trivial and undocumented.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS constant and as parameter type in weightsToArray. Removing it breaks compilation.
- **Duplication [UNIQUE]**: No similar type definitions found in RAG results.
- **Correction [OK]**: Interface fields mirror SYMBOLS order and reference documentation. No defects.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required per rule 6.
- **DOCUMENTED [DOCUMENTED]**: All fields are symbol names mapped to numeric weights — semantics are self-evident from the interface name and field names. No JSDoc needed.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times to populate REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight=30 (p=0.25) produces per-payline expected return far exceeding the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Named constant with readable per-symbol values — appropriate regardless of the surrounding abstraction.
- **Tests [NONE]**: No test file exists; no transitive coverage from any tested caller.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose (shared default distribution for all five reels) and the significance of the weight values are not explained. (deliberated: confirmed — Confirmed at reels.ts:14: DIAMOND weight=30, highest of all symbols (total weights=120, so 25% probability per pick). Cross-referenced paytable.ts:11: DIAMOND pays [50, 250, 1000], also the highest-paying symbol. This inverts the standard rarity-payout relationship. Compare SEVEN: weight=5 (4.2%), pays [25, 100, 500]. DIAMOND is 6x more frequent yet pays 2x more. Further, jackpot.ts:10 triggers at ≥4 DIAMONDs across 15 positions (5 reels × 3 rows); binomial probability of 4+ hits at p=0.25 is ~22%, making jackpots fire roughly every 5 spins. DIAMOND weight should be ~2-3 to maintain viable RTP.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS from DEFAULT_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly maps ReelWeightConfig fields to array in same order as SYMBOLS.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists; private function with no tested callers.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private 3-line helper; lenient, but the fixed symbol-order dependency (must match SYMBOLS order) is a hidden constraint worth documenting.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed by spinReel and getReelWeights, both externally consumed.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Correctly constructs five identical weight arrays from DEFAULT_WEIGHTS. Defect is in the source constant; flagged there per rule 10.
- **Overengineering [ACCEPTABLE]**: Five explicit identical weightsToArray calls where Array(5).fill(...) would be cleaner, but readability is acceptable and the verbosity is minor.
- **Tests [NONE]**: No test file exists; transitive callers spinReel/getReelWeights are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share identical weights and that modifying this array would affect runtime behavior is undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel for every row of every reel spin.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both compute a total weight via reduce, draw Math.random() * total, iterate accumulating weights, and return items[i] on first threshold crossing with the same fallback. Differences are purely cosmetic (variable names: total/totalWeight, r/roll, acc/cumulative, wts/weights) and that pickFromWeighted is typed to Symbol[] while weightedPick is generic. These functions are fully interchangeable; spinReel could call weightedPick<Symbol> directly.
- **Correction [OK]**: Cumulative-weight random selection is correct. Previously cleared as false positive; no new evidence of defect.
- **Overengineering [LEAN]**: Correct, straightforward weighted-random-selection loop. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Core weighted-random logic (boundary at r==total, fallback return) has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper; lenient. Algorithm (weighted random selection, falls back to last item) and the requirement that items and wts have equal length are undocumented.

> **Duplicate of** `src/rng.ts:weightedPick` — 100% identical algorithm — same reduce sum, same random roll, same cumulative loop, same fallback return; only variable names and generic vs concrete type differ

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly iterates three rows and delegates to pickFromWeighted using the per-reel weight array.
- **Overengineering [LEAN]**: Simple loop producing a 3-row column — does exactly one thing.
- **Tests [NONE]**: No test file exists. Exported and called by src/factories.ts but no tests cover its behavior or edge cases (invalid reelIndex, distribution correctness).
- **UNDOCUMENTED [UNDOCUMENTED]**: Public export with no JSDoc. Valid reelIndex range (0–4), return shape (3-element column), and that each cell is sampled independently are all undocumented.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and called inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; marked UNIQUE per RAG instructions.
- **Correction [OK]**: Returns the SYMBOLS array reference. No correctness defect.
- **Overengineering [LEAN]**: Minimal accessor.
- **Tests [NONE]**: No test file exists. Consumed by src/engine.ts spin() but no tests verify the returned symbol list.
- **UNDOCUMENTED [UNDOCUMENTED]**: Public export with no JSDoc. Returning the shared SYMBOLS array (mutable reference) rather than a copy is an undocumented contract detail.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and called inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; marked UNIQUE per RAG instructions.
- **Correction [OK]**: Returns REEL_WEIGHTS[reelIndex] as documented. No correctness defect.
- **Overengineering [LEAN]**: Minimal accessor.
- **Tests [NONE]**: No test file exists. Consumed by src/engine.ts spin() but no tests cover valid/invalid reelIndex or returned weight arrays.
- **UNDOCUMENTED [UNDOCUMENTED]**: Public export with no JSDoc. Valid reelIndex range (0–4), that the returned array is the live reference (no defensive copy), and the weight-sum semantics are undocumented.

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol keys. If `Symbol` is already the union `'CHERRY' \| 'LEMON' \| ...`, then `Record<Symbol, number>` is equivalent and eliminates the risk of the interface drifting from the symbol set. [L8-L11] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are all mutable module-level constants. `getReelWeights` returns the raw `REEL_WEIGHTS[reelIndex]` reference — callers can push/splice the internal array, violating the reference-doc invariant that weights are read-only at runtime. All three should be `readonly`; `getReelWeights` should return `ReadonlyArray<number>`. [L3-L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. Param types and return semantics (e.g., reelIndex 0–4 contract) should be documented. [L43-L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex)` and `getReelWeights(reelIndex)` do not validate that `reelIndex` is in [0, 4]. An out-of-range index yields `undefined` from `REEL_WEIGHTS[reelIndex]`; `pickFromWeighted` then calls `undefined.reduce(...)`, throwing an uncaught `TypeError` at runtime. [L43-L55] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by reel/payline/symbol vocabulary and reference docs. `Math.random()` is a non-cryptographic, non-auditable PRNG that is not certifiable for regulated gaming RNG — any regulatory submission (eCOGRA, GLI, BMM) requires a verified PRNG. The project already ships `src/rng.ts`, the correct RNG module; `pickFromWeighted` must delegate to it instead of calling `Math.random()` directly. [L35] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point, making deterministic unit tests impossible without global mocking. Accepting an `rng: () => number` parameter would enable seeded testing. [L32-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SYMBOLS` should use `as const` to narrow the inferred type to a readonly tuple of literal strings. `DEFAULT_WEIGHTS satisfies ReelWeightConfig` would let TypeScript verify completeness at the declaration site rather than at assignment. [L3-L15] |

### Suggestions

- Replace Math.random() with the project's dedicated RNG module and inject it for testability
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from "./rng.js";
  
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = nextFloat): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add bounds validation in spinReel/getReelWeights to prevent undefined-access TypeError
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Use Record<Symbol, number> and readonly to tighten types and prevent mutation
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies ReelWeightConfig;
  
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Return ReadonlyArray<number> from getReelWeights to enforce the read-only contract documented in the reference docs
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

## Actions

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight in DEFAULT_WEIGHTS from 30 to approximately 3–6 so that DIAMOND's per-payline expected value contribution is consistent with the arbitrated 95% RTP target. At weight=30 (p=0.25), DIAMOND alone contributes ~2.3× lineBet per payline, which is more than twice the entire RTP budget. A weight in the range 3–6 (p≈0.025–0.05) keeps DIAMOND contribution below ~0.01×, leaving headroom for the full symbol set and wild/free-spin bonuses to sum to ≈0.95×. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
