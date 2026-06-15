# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 88% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 88% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 78% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 80% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 80% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used locally: passed to pickFromWeighted on line 34 and returned from getReelSymbols on line 42
- **Duplication [UNIQUE]**: Constant symbol array. No similar constants found.
- **Correction [OK]**: Symbol list matches documentation and aligns with weightsToArray field order.
- **Overengineering [LEAN]**: Simple constant array of 8 symbol strings.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal non-exported constant; name and values are self-descriptive, so low severity.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used locally: passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L24–L28)
- **Duplication [UNIQUE]**: Constant weight configuration object. No similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (highest of all symbols, P=25%) combined with its 1000× 5-of-a-kind payout yields RTP >> 100%, violating the arbitrated target of 95%. The highest-paying symbol should be among the rarest, not the most common.
- **Overengineering [LEAN]**: Straightforward named constant mapping symbols to weights. Readable and appropriately simple.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name and literal values are clear, but the total-weight sum (120) and per-symbol probabilities are undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. reels.ts:12-15 defines weights summing to 120. weightsToArray (reels.ts:17-20) correctly maps them to an ordered array matching SYMBOLS (reels.ts:3-5). The weighted selection algorithm at reels.ts:30-41 handles them correctly. DIAMOND having weight 30 (highest) while also being the highest-paying symbol is a game-balance concern, not a code defect. No specification exists dictating correct weight values. The code is logically correct — it does exactly what it says.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used locally: accessed in spinReel (L32) and returned from getReelWeights (L57)
- **Duplication [UNIQUE]**: Constant 5-reel weight arrays. No similar constants found.
- **Correction [OK]**: Five identical weight arrays matching documentation. Inherits the DIAMOND weight defect from DEFAULT_WEIGHTS but the source of that issue is DEFAULT_WEIGHTS.
- **Overengineering [LEAN]**: Five reels each using the same weight array. Repeating weightsToArray five times is verbose but the structure is clear and trivially maintainable.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; the decision that all 5 reels share identical weights is an implicit design choice with no explanation.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called locally in spinReel loop (L34) for weighted symbol selection
- **Duplication [DUPLICATE]**: Implements weighted random selection. RAG score 0.823 with matching logic verified in source.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG. Inferred slot-machine domain from reel/paytable/jackpot/scatter vocabulary and paytable structure. Industry convention requires a certified PRNG (e.g., FIPS 140-2 compliant) for production slot engines.
- **Overengineering [LEAN]**: Standard weighted-random selection algorithm. Minimal and correct for its purpose.
- **Tests [NONE]**: No test file exists. Critical probabilistic logic with boundary condition at loop exit (fallback return) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper implementing weighted-random selection. Algorithm is non-trivial (cumulative-weight scan) but name and parameter names convey intent adequately. No @param/@returns. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at reels.ts:30-41 is algorithmically correct — cumulative-weight sampling with fallback return. It duplicates rng.ts:5-16 (weightedPick) with only cosmetic differences (variable names: total/totalWeight, r/roll, acc/cumulative), confirmed by code comparison. However, duplication is a duplication-axis concern, not a correction-axis concern. The function produces correct weighted random selections and is properly called at reels.ts:47. No logical error exists in the implementation.)

> **Duplicate of** `src/rng.ts:weightedPick` — Identical algorithm: reduce weights to total, generate random value, accumulate until match, return item or fallback. Only cosmetic differences: variable names (total vs totalWeight, r vs roll, acc vs cumulative) and generic vs specific typing.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported and runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3 random symbols for a reel. No similar functions found.
- **Correction [OK]**: Logic is correct for valid reelIndex (0–4). No bounds check — reelIndex outside [0,4] would yield undefined weights and crash in pickFromWeighted — but the API contract implies callers provide valid indices.
- **Overengineering [LEAN]**: Simple loop producing 3 symbols per reel. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts, making it a critical production path with zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols (one per row), and that sampling is independent per cell.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS array. No duplicates found.
- **Correction [OK]**: Returns the live SYMBOLS array reference, allowing callers to mutate shared state. No evidence of callers doing so; functional correctness holds if callers respect the read-only contract.
- **Overengineering [LEAN]**: Trivial accessor; appropriate as a stable public API entry point.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Name is self-descriptive and body trivial, but return value semantics (ordered master symbol list) are undocumented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning weight array for reel. No duplicates found.
- **Correction [OK]**: Returns the live weight sub-array reference. Mutation by a caller would silently corrupt reel probabilities. No bounds check on reelIndex. Both are defensive-programming concerns without evidence of misuse by actual callers.
- **Overengineering [LEAN]**: Trivial accessor exposing per-reel weights. Appropriate for the public API.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), relationship between returned array indices and SYMBOLS order, and read-only nature of the weights.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig duplicates all Symbol members manually. Record<Symbol, number> would be more concise and automatically stay in sync if Symbol union changes. [L8-L12] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelSymbols() and getReelWeights() return direct references to internal mutable arrays, allowing callers to silently corrupt reel state. [L3-L30] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights have no JSDoc. At minimum, spinReel should document the valid reelIndex range (0–4) and the returned structure. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel accesses REEL_WEIGHTS[reelIndex] with no bounds check. An out-of-range index (outside 0–4) yields undefined weights, causing a crash inside pickFromWeighted. The valid range is undocumented and unenforced. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol/CHERRY/LEMON/SEVEN/WILD/SCATTER/spinReel/pickFromWeighted vocabulary. Math.random() is a non-cryptographic PRNG not certifiable for regulated gaming RNG. The project has a dedicated src/rng.ts module that is ignored here — all random draws in spinReel must route through the certified RNG abstraction. [L33-L41] |
| 14 | Performance | WARN | MEDIUM | pickFromWeighted recalculates total via reduce on every call. Since REEL_WEIGHTS is static, weight totals should be precomputed once at module load. [L33-L35] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hard-wired inside pickFromWeighted with no RNG injection point. Unit tests cannot produce deterministic results without global mocking. src/rng.ts exists — passing an RNG function parameter would fix both this and rule 13. [L33-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and DEFAULT_WEIGHTS could use as const satisfies for narrower literal types and compile-time exhaustiveness. No usage of satisfies anywhere in the file. [L3-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelSymbols() returns the shared SYMBOLS reference directly; getReelWeights() returns the live inner array from REEL_WEIGHTS. Both allow external mutation of module-level state, contradicting the documented 'read-only at runtime' invariant. Return slices or typed readonly views. [L52-L57] |

### Suggestions

- Route all random draws through the project's dedicated RNG module and accept it as a parameter for testability
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from './rng.js';
  
  function pickFromWeighted(items: Symbol[], wts: number[], rng = nextFloat): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use Record<Symbol, number> and make all module-level data immutable
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
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... } as const;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [ ... ];
  ```
- Precompute weight totals and return readonly slices from public accessors
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const REEL_TOTALS: ReadonlyArray<number> = REEL_WEIGHTS.map(w => w.reduce((a, b) => a + b, 0));
  
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(`reelIndex ${reelIndex} out of range`);
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add JSDoc to all three public exports documenting valid reelIndex range
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel column.
   * @param reelIndex - Integer in [0, 4] selecting the reel.
   * @returns Array of 3 symbols for rows top→bottom.
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a certifiable RNG source (injected interface or cryptographically secure PRNG) to comply with regulated gaming requirements. [L33]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to a low single-digit value (e.g., 3–5) to bring RTP near the target 95%. Currently DIAMOND alone contributes ~230% RTP because it is both the most probable (25%) and highest-paying symbol (1000× at 5-of-a-kind). [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
