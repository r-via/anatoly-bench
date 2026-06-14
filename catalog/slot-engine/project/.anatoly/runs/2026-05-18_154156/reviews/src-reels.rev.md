# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | ACCEPTABLE | USED | UNIQUE | GOOD | 78% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 90% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted() at L39. Internal constant used by local functions.
- **Duplication [UNIQUE]**: Constant array of symbol names. No similar definitions found.
- **Correction [OK]**: All 8 symbols declared in the same order used by weightsToArray; no correctness issue.
- **Overengineering [LEAN]**: Simple constant array of all 8 symbol literals. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Array contents and ordering are untested, yet symbol order implicitly couples to REEL_WEIGHTS index alignment.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, but purpose and ordering (which must match ReelWeightConfig field order for weightsToArray to be correct) is not explained.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17). Used internally.
- **Duplication [UNIQUE]**: Type interface defining weight configuration. No duplicates found.
- **Correction [OK]**: Interface correctly models all 8 symbol weight fields.
- **Overengineering [ACCEPTABLE]**: Named-field interface duplicates the symbol names already enumerated in SYMBOLS, creating a sync hazard. `Record<Symbol, number>` would be DRYer and TypeScript would enforce exhaustiveness automatically. However, this exact interface is explicitly documented in the reference schema, so the design is intentional.
- **Tests [GOOD]**: Pure interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface mapping each symbol name to a numeric weight. Field semantics are unambiguous from names alone.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Referenced in REEL_WEIGHTS initialization (L24–L28). Provides default weight configuration.
- **Duplication [UNIQUE]**: Default weight configuration object. No similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight=30/120=25% produces ~229% RTP from DIAMOND base pays alone, far exceeding the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Straightforward constant assignment. Values match the documented weight table exactly.
- **Tests [NONE]**: No test file. Weight values (e.g. DIAMOND=30 highest, SEVEN/WILD/SCATTER=5) are untested and silently affect RTP/odds.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Raw numeric values give no hint of the total weight (120), relative probabilities, or that all five reels share this same config. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified src/reels.ts:12-15. Weights sum to 120 and produce documented probabilities (DIAMOND ≈25%, SEVEN/WILD/SCATTER ≈4.2%). weightsToArray (L17-20) creates new number[] arrays from the config values, so REEL_WEIGHTS (L22-28) holds independent copies — mutating DEFAULT_WEIGHTS post-init has no effect. The mutable typing is a best_practices/immutability concern, not a correctness defect. No behavioral bug exists.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times in REEL_WEIGHTS initialization (L24–L28). Converts config to array format.
- **Duplication [UNIQUE]**: Utility converting config object to array. No similar functions found.
- **Correction [OK]**: Returns weights in SYMBOLS array order; no correctness issue.
- **Overengineering [ACCEPTABLE]**: Exists solely because ReelWeightConfig uses named fields instead of a Symbol-keyed map. With `Record<Symbol, number>` this would inline to `SYMBOLS.map(s => cfg[s])`. Harmless but only necessary due to the interface shape choice.
- **Tests [NONE]**: No test file. Order of array elements must match SYMBOLS order exactly; this coupling is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal 4-line helper with a clear name; tolerable without JSDoc per private-helper leniency, but the positional coupling to SYMBOLS ordering is an implicit constraint worth noting.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced in spinReel() (L44) and getReelWeights() (L57). Core state for reel mechanics.
- **Duplication [UNIQUE]**: Array of weight arrays initialized with weightsToArray. No duplicates found.
- **Correction [OK]**: Five reels correctly initialized from DEFAULT_WEIGHTS via weightsToArray.
- **Overengineering [LEAN]**: Per-reel weight table array supports future per-reel weight customization (spinReel already accepts reelIndex). All five entries are currently identical but the structure is justified by the design.
- **Tests [NONE]**: No test file. Five identical reel weight arrays are assumed; homogeneity and length (5 reels × 8 symbols) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not obvious that all five reels are identical copies of DEFAULT_WEIGHTS or that the outer array index maps to a reel column.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel() at L39. Implements weighted random selection logic.
- **Duplication [DUPLICATE]**: Weighted random selection with identical logic to weightedPick in src/rng.ts; score 0.819.
- **Correction [NEEDS_FIX]**: Uses Math.random() which is not a certifiable RNG; inferred regulated-slot-machine domain from reels/payline/jackpot/RTP vocabulary throughout the project.
- **Overengineering [LEAN]**: Standard O(n) cumulative-weight sampling over 8 symbols. Clean, correct, no unnecessary generalization.
- **Tests [NONE]**: No test file. Critical gambling logic: distribution correctness, boundary at r===acc, and fallback return are all untested. Math.random seeding is not mocked anywhere.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Implements cumulative-weight sampling — a non-trivial algorithm where the wts array must be positionally aligned with items. Neither constraint nor algorithm is documented. (deliberated: confirmed — Confirmed duplicate. src/reels.ts:30-41 is algorithmically identical to src/rng.ts:5-16 (cumulative-weight sampling with Math.random()). Only differences: generic <T> vs Symbol specialization and variable names. The architectural intent (documented in ADR in .anatoly/cache/rag) is that weightedPick in rng.ts is the injectable RNG registered in EngineContainer (engine.ts:30). But spinReel (reels.ts:43-50) calls pickFromWeighted directly (L47), bypassing the container entirely. This means the container-based RNG swap mechanism is dead — reel spins always use the hardcoded local copy. Raising confidence because the duplication causes a real behavioral defect: the injectable RNG architecture is broken.)

> **Duplicate of** `src/rng.ts:weightedPick` — Identical algorithm: accumulate weights and select by random threshold. Differences are generic type T vs Symbol and variable naming only.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported and runtime-imported by src/factories.ts. Public API for reel spinning.
- **Duplication [UNIQUE]**: Generates three random symbols from a reel. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for values outside [0, 4], causing pickFromWeighted to crash on wts.reduce.
- **Overengineering [LEAN]**: Simple loop drawing 3 symbols per reel column using the weighted sampler. No excess abstraction.
- **Tests [NONE]**: No test file. Imported by src/factories.ts making it a critical code path. Return length (3 rows), valid symbol membership, and out-of-bounds reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols per call, and that each symbol is drawn independently.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts. Public getter for available symbols.
- **Duplication [UNIQUE]**: Trivial accessor returning SYMBOLS array. No similar functions found.
- **Correction [OK]**: Simple accessor with no correctness issues.
- **Overengineering [LEAN]**: Thin accessor exposing the SYMBOLS array. Appropriate for encapsulation.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; returned array identity and contents are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Name is clear but return value is a mutable reference to the internal SYMBOLS array — a potentially important side-effect not documented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts. Public getter for weight configuration.
- **Duplication [UNIQUE]**: Trivial accessor returning reel weights. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; returns undefined for out-of-range input despite declared return type of number[].
- **Overengineering [LEAN]**: Thin accessor exposing per-reel weights by index. No unnecessary complexity.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Valid reelIndex range (0–4), the meaning of each element in the returned array, and whether it is a live reference are all undocumented. (deliberated: confirmed — Confirmed. src/reels.ts:56-58 performs no bounds check. REEL_WEIGHTS has 5 elements (L22-28). Passing reelIndex ≥ 5 or < 0 returns undefined typed as number[], causing downstream TypeError. Additionally, it returns a mutable reference to the internal weight array — callers can silently corrupt probability tables. In engine.ts, getReelWeights is imported (L3), registered in container (L32), and resolved (L122), but reelsModule.getReelWeights is never actually called during spin(). Blast radius is limited to hypothetical external consumers, but the type-safety defect is real.)

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbols. Record<Symbol, number> would enforce exhaustiveness against the Symbol union and eliminate the redundant interface. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS (L3), DEFAULT_WEIGHTS (L12), and REEL_WEIGHTS (L22) are all typed as mutable. getReelSymbols() and getReelWeights() return live mutable references — callers can silently overwrite reel probability tables. [L3-L5,L12-L15,L22-L28,L52-L58] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are exported with no JSDoc. At minimum spinReel should document the valid reelIndex range (0–4) and the 3-element return shape. [L43,L52,L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel performs no bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for out-of-range input, causing wts.reduce to throw a cryptic TypeError with no contextual message. [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by symbol vocabulary (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), paylines, free-spins, and jackpot documented in .anatoly/state/internal-docs/. Math.random() is a non-cryptographic PRNG not certifiable for regulated gambling RNG. src/rng.ts exists in the project and should be the RNG source, but pickFromWeighted ignores it and calls Math.random() directly. [L32] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly with no injection point, making deterministic unit tests impossible without global monkey-patching. src/rng.ts indicates the project has an injectable RNG abstraction that should be passed as a parameter. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig for exact literal-type inference while still checking conformance. SYMBOLS could use as const to narrow to a readonly tuple of string literals. [L3-L5,L12-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns a direct mutable reference to REEL_WEIGHTS[reelIndex]. External callers can mutate per-reel probability tables at runtime with no validation gate. Return type should be readonly number[]. [L56-L58] |

### Suggestions

- Replace Math.random() with the project RNG from src/rng.ts and inject it as a parameter for testability and regulatory compliance.
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
- Add a bounds guard to spinReel to produce a clear error on bad reelIndex.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Mark all module-level constants readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]
  ```
- Return readonly number[] from getReelWeights to prevent callers from mutating reel probability tables.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Use Record<Symbol, number> to enforce exhaustiveness over the Symbol union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Use satisfies for DEFAULT_WEIGHTS to get literal-type inference while keeping conformance checking.
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

- **[correction · medium · small]** Replace Math.random() with a certified/auditable RNG source suitable for regulated gaming (e.g., CSPRNG from crypto.getRandomValues). [L32]
- **[correction · medium · small]** Add a bounds guard in spinReel: throw RangeError (or clamp) if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length to prevent undefined-wts crash. [L44]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to a value that, combined with all other symbol payouts, keeps total RTP at or below 95%. At weight=30 DIAMOND alone contributes ~229% RTP; a weight in the low single digits is likely required. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add bounds check in getReelWeights or widen the return type to number[] | undefined to match actual JavaScript runtime behavior. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
