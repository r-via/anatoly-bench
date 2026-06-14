# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 80% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 92% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced locally by pickFromWeighted (via spinReel) and returned directly by getReelSymbols, both of which have runtime importers.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Symbol list is complete and consistent with the weight config interface and documentation.
- **Overengineering [LEAN]**: Simple static array of 8 symbol names. No abstraction overhead.
- **Tests [NONE]**: No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exports are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported internal constant with no comment explaining its role as the master symbol registry for all reels.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as the type annotation for DEFAULT_WEIGHTS (L12) and the cfg parameter of weightsToArray (L17), enforcing structural shape at compile time.
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface correctly models one weight per symbol; all eight slots match the SYMBOLS array.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Pure interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: name signals purpose (reel weight configuration), all fields are symbol names mapping to numeric weights. No complex semantics require additional JSDoc.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when initializing REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight of 30 (25% per cell) combined with its paytable (50×/250×/1000×) produces an RTP far above the arbitrated 95% target.
- **Overengineering [LEAN]**: Named-key constant for readability. Appropriate for a fixed 8-symbol config.
- **Tests [NONE]**: No test file exists. Constant feeds REEL_WEIGHTS and ultimately spinReel, but none are tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name implies defaults but no comment explains the weight scale, total sum (120), or probability implications for each symbol. (deliberated: confirmed — Confirmed at src/reels.ts:14: DIAMOND weight is 30 (25% of total 120). At src/paytable.ts:11: DIAMOND pays [50, 250, 1000] — the highest multipliers in the game. SEVEN pays [25, 100, 500] (half of DIAMOND) but has weight 5 (one-sixth the frequency). DIAMOND being 6x more frequent than SEVEN while paying 2x more is mathematically inverted. No compensating mechanism exists — DefaultStrategy.adjustPayout at src/strategy.ts:8-10 is a no-op returning the result unchanged. The weight 30 for DIAMOND is almost certainly a typo for 3, which would place it appropriately between SEVEN (5) and BAR (10). This bug would cause the game's actual RTP to massively exceed the target 95% (ANCIENT_RTP at paytable.ts:3).)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in the REEL_WEIGHTS initializer to convert DEFAULT_WEIGHTS into plain number arrays.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Property extraction order matches SYMBOLS array order exactly; no correctness issue.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Private helper with ordering-sensitive logic (symbol-to-weight mapping) that is never directly or transitively tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, <10 lines, clear name. Tolerated per internal-helper leniency rule, but no JSDoc.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and returned by getReelWeights (L57), both of which have runtime importers.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: All five reels correctly populated via weightsToArray(DEFAULT_WEIGHTS); index range 0–4 matches spinReel's valid input range.
- **Overengineering [ACCEPTABLE]**: Five identical weight arrays preempt per-reel customization that docs explicitly say doesn't exist (no setter). However, the structure is required by the getReelWeights(reelIndex) public API shape, so the redundancy is partially justified.
- **Tests [NONE]**: No test file exists. Transitive callers spinReel/getReelWeights are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported constant. No comment explains that all 5 reels share identical weight arrays or the indexing scheme.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel (L47) on every spin to perform weighted random symbol selection.
- **Duplication [DUPLICATE]**: Identical weighted random selection logic: both compute total weight, roll Math.random() * total, accumulate weights in a loop, return items[i] on hit, fall back to last item. Only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol. Functionally interchangeable.
- **Correction [OK]**: Excluded per project instructions (known false positive — algorithm verified correct in prior deliberation).
- **Overengineering [LEAN]**: Standard weighted random selection over 8 items. Linear scan is appropriate at this scale; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical probabilistic logic (weighted random selection, boundary at total weight) has zero coverage — no seeded-random or distribution tests exist.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper implementing weighted random selection. No JSDoc, but non-exported and name hints at behavior. Tolerated per internal-helper leniency; algorithm details (linear scan, fallback to last item) are undocumented.

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — same weighted random selection algorithm with only variable name and type parameter differences

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly iterates three rows, calls pickFromWeighted with the reel's weight array, and returns a three-symbol column.
- **Overengineering [LEAN]**: Minimal: fetches weight array, samples 3 symbols, returns column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts but no tests cover it; edge cases like out-of-range reelIndex are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that the return is always a 3-element column, and behavior on out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside the spin function.
- **Duplication [UNIQUE]**: Trivial accessor; marked UNIQUE per RAG instructions.
- **Correction [OK]**: Returns the module-level SYMBOLS array; matches documented symbol list and ordering.
- **Overengineering [LEAN]**: Single-line accessor.
- **Tests [NONE]**: No test file exists. Consumed by engine.ts spin() but neither is tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Name is clear but no comment describes the fixed order, length, or that the array is shared (not a defensive copy).

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside the spin function.
- **Duplication [UNIQUE]**: Trivial accessor; marked UNIQUE per RAG instructions.
- **Correction [OK]**: Returns the correct weight array for the given reel index; consistent with documentation.
- **Overengineering [LEAN]**: Single-line accessor. Straightforward.
- **Tests [NONE]**: No test file exists. Consumed by engine.ts spin() but neither is tested; undefined behavior for out-of-range reelIndex unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), weight array length/ordering, and behavior on out-of-range index.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Three module-level constants lack readonly annotations: `SYMBOLS` (`Symbol[]` → `readonly Symbol[]`), `ReelWeightConfig` properties (all mutable), and `REEL_WEIGHTS` (`number[][]` → `ReadonlyArray<readonly number[]>`). Additionally, `getReelWeights` returns a live mutable reference to internal state, allowing callers to silently mutate reel weights. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. At minimum `spinReel` (which takes an index and returns a 3-symbol column) and `getReelWeights` (returns live mutable array) need param/return docs. [L44-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot/WILD/SCATTER/SEVEN vocabulary throughout the codebase and reference docs. `Math.random()` drives the core symbol-selection RNG in `pickFromWeighted` (L33). `Math.random()` is a non-cryptographic, unseeded PRNG that is NOT certifiable for regulated gaming. Most jurisdictions (GLI, BMM, eCOGRA) require a certified hardware or cryptographic RNG. Critically, the project already contains `src/rng.ts` — a dedicated RNG module — which is NOT imported here, indicating `reels.ts` bypasses the intended RNG abstraction entirely. [L33] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` hardcodes `Math.random()` with no injectable RNG parameter. This makes deterministic unit testing of spin outcomes impossible without monkey-patching globals. The project's `src/rng.ts` should be injected as a dependency or passed as a parameter. [L30-L41] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two gaming-context issues: (1) `getReelWeights` returns `REEL_WEIGHTS[reelIndex]` — a live mutable array — contradicting the documented read-only contract; callers can silently alter reel weights. (2) `spinReel` performs no bounds check on `reelIndex` (valid range 0–4); an out-of-range index yields `undefined` weights and a runtime crash inside `pickFromWeighted`. [L44-L57] |

### Suggestions

- Replace Math.random() with the project's rng.ts module and make RNG injectable for testability
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add readonly annotations to all module-level constants and the interface
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  
  const SYMBOLS: Symbol[] = [ ... ];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  interface ReelWeightConfig {
    readonly CHERRY: number; readonly LEMON: number; readonly BELL: number; readonly BAR: number;
    readonly SEVEN: number; readonly DIAMOND: number; readonly WILD: number; readonly SCATTER: number;
  }
  
  const SYMBOLS: readonly Symbol[] = [ ... ];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Return a copy (or readonly type) from getReelWeights to prevent external mutation of internal state
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add bounds guard to spinReel to prevent undefined-dereference crash
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

## Actions

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to a value ≤ 20 (e.g. 3–5, matching SEVEN/WILD/SCATTER tier) so that the implied RTP from DIAMOND matches alone stays within the 95% target budget. Alternatively, revisit the DIAMOND paytable multipliers in src/paytable.ts in coordination with this weight change. Either adjustment must be validated end-to-end against the engine's full RTP calculation. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
