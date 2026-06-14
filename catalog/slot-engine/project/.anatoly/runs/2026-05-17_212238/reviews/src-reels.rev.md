# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | ACCEPTABLE | USED | UNIQUE | GOOD | 80% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 92% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 70% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 70% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used in pickFromWeighted call at L39 and returned by getReelSymbols
- **Duplication [UNIQUE]**: Constant symbol list. No similar constants found.
- **Correction [OK]**: Array order matches ReelWeightConfig field order used in weightsToArray; all eight symbols present.
- **Overengineering [LEAN]**: Simple string array of the 8 symbol identifiers. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private module constant; the canonical set of valid symbols has semantic significance (order matters for weight alignment) but is unexplained.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS and weightsToArray parameter
- **Duplication [UNIQUE]**: Type definition for weight configuration. No similar types found.
- **Correction [OK]**: Interface correctly enumerates all eight symbol keys in the same order as SYMBOLS.
- **Overengineering [ACCEPTABLE]**: Named-field interface adds human readability when editing weights (vs a raw number[]). A Record<Symbol, number> would be more type-safe and eliminate the ordering dependency in weightsToArray, but the interface is explicitly documented in the API reference schema, making it an intentional design choice.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive: interface name conveys 'reel weight configuration', fields are symbol names mapped to number weights. No complex hidden semantics require extra JSDoc.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization
- **Duplication [UNIQUE]**: Constant weight config object. No similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight=30 (P=0.25) makes DIAMOND's per-payline EV ≈2.295× lineBet; ×10 paylines → RTP > 229% from DIAMOND alone, violating the arbitrated RTP=95% target.
- **Overengineering [LEAN]**: Straightforward config object. Named fields make per-symbol weight editing clear.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Numeric values (25, 25, 15, 10, 5, 30, 5, 5) lack any rationale; total weight (120) and relative frequencies are not stated. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. reels.ts:12-15 weights sum to 120 (CHERRY:25+LEMON:25+BELL:15+BAR:10+SEVEN:5+DIAMOND:30+WILD:5+SCATTER:5), matching internal documentation verbatim. The finding provides no evidence of what correct values should be. RTP is a function of the full system (weights x paytable x paylines x HOUSE_EDGE), not weights in isolation. These are intentional design constants.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times to populate REEL_WEIGHTS array
- **Duplication [UNIQUE]**: Converts weight config to array. No similar functions found.
- **Correction [OK]**: Extracts all eight config fields in the same order as SYMBOLS; no indexing mismatch.
- **Overengineering [ACCEPTABLE]**: Exists solely to bridge ReelWeightConfig's named fields to the number[] format needed internally. Introduces a fragile ordering dependency with SYMBOLS (field extraction order must match array order). Switching ReelWeightConfig to Record<Symbol, number> and using SYMBOLS.map(s => cfg[s]) would eliminate this function and the coupling. Mild design artifact, not severe overengineering.
- **Tests [NONE]**: No test file exists. Edge cases like zero weights or mismatched config fields are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private non-exported helper, <10 lines, clear name. Tolerable absence of JSDoc; however the ordering contract (must match SYMBOLS order) is an implicit constraint worth noting.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel and getReelWeights functions
- **Duplication [UNIQUE]**: Array of reel weight arrays. No similar constants found.
- **Correction [OK]**: Five identical weight arrays initialized via weightsToArray; structure matches five-reel game layout.
- **Overengineering [ACCEPTABLE]**: Expanding the same weights 5 times (once per reel) rather than Array(5).fill(...) is verbose, but the structure explicitly supports per-reel weight differentiation, which is a common slot machine requirement. Justified by domain.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The design decision that all five reels share identical weights (rather than per-reel configs) is undocumented and non-obvious.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called from spinReel to select weighted symbols
- **Duplication [DUPLICATE]**: Implements weighted random selection. Identical algorithm to weightedPick in src/rng.ts (similarity 0.819). Both compute cumulative weights and return item when random value falls below cumulative sum.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; slot-machine domain (CHERRY/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER, paylines, lineBet, jackpot, RTP target) requires a CSPRNG. Industry convention for certified gaming prohibits Math.random().
- **Overengineering [LEAN]**: Standard cumulative-weight sampling, correctly implemented and general enough to be reused. Nothing extraneous.
- **Tests [NONE]**: No test file. Critical weighted-random logic with edge cases (zero total weight, single item, r==total boundary) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Implements cumulative-weight sampling; parameters, return value, and the assumption that items.length === wts.length are all undocumented.

> **Duplicate of** `src/rng.ts:weightedPick` — 100% matching logic—both accumulate weights and select via random number. pickFromWeighted specialized to Symbol type; weightedPick is generic T.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Spins single reel generating 3 symbols. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for index outside 0–4, causing TypeError in pickFromWeighted when wts.reduce is called on undefined.
- **Overengineering [LEAN]**: Draws 3 symbols for one reel column using the precomputed weight table. Straightforward loop with no unnecessary abstraction.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; happy path, invalid reelIndex, and column-length invariants are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. reelIndex valid range, return shape (3-element column), and sampling strategy are undocumented.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter for symbol list.
- **Correction [OK]**: Returns SYMBOLS array directly; no logic involved.
- **Overengineering [LEAN]**: Simple accessor exposing the SYMBOLS array. One line of logic.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; return value identity and immutability are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of what the returned array represents or that it is the ordered set used for weight alignment.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter for reel weights array.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] returns undefined (typed as number[]) for index outside 0–4, silently propagating undefined to callers.
- **Overengineering [LEAN]**: Simple accessor returning the weight array for a given reel index. One line of logic.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; out-of-range reelIndex and return value correctness are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. reelIndex valid range and the meaning/order of the returned number array are undocumented.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates eight keys that mirror the Symbol union; Record<Symbol, number> would stay in sync automatically and eliminate duplication [L8-L11] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS (Symbol[]), DEFAULT_WEIGHTS (ReelWeightConfig), and REEL_WEIGHTS (number[][]) are module-level constants with no readonly annotations; callers can mutate them in place. Should be readonly Symbol[], Readonly<ReelWeightConfig>, and ReadonlyArray<ReadonlyArray<number>>. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc [L44-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform unchecked index access on REEL_WEIGHTS[reelIndex]; an out-of-range value returns undefined at runtime while the declared return types are Symbol[] and number[]. No bounds guard exists. [L45-L46] |
| 13 | Security | FAIL | CRITICAL | Math.random() drives symbol selection in a regulated-gaming context (slot machine: CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER, weighted reels, jackpot per arbitrated README). Math.random() is V8's xorshift128+ PRNG — non-cryptographic, non-auditable, and not certifiable for any regulated jurisdiction. The project ships src/rng.ts — a dedicated RNG module — which this file ignores entirely. [L36] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted and spinReel call Math.random() directly with no injection point; deterministic unit tests require patching the global. src/rng.ts exists in the project and appears to be the intended abstraction, but is unused here. [L33-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS would benefit from the satisfies operator to validate against ReelWeightConfig while preserving literal types for downstream inference [L13-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns a live mutable number[] reference to the internal REEL_WEIGHTS[reelIndex] array; external callers can corrupt reel weights without any indication. Return type should be ReadonlyArray<number>. [L55-L57] |

### Suggestions

- Replace Math.random() with src/rng.ts to satisfy regulated-gaming RNG requirements
  - Before: `const r = Math.random() * total;`
  - After: `const r = rng.next() * total; // rng injected via parameter: pickFromWeighted(items, wts, rng: RNG)`
- Add bounds guard in spinReel and getReelWeights to prevent silent undefined access
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Mark module-level constants as readonly to prevent accidental mutation
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]
  ```
- Use Record<Symbol, number> instead of a manually enumerated interface for ReelWeightConfig
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Use satisfies to validate DEFAULT_WEIGHTS at compile time while preserving literal types
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, ...
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, ...} satisfies ReelWeightConfig;
  ```
- Return ReadonlyArray<number> from getReelWeights to prevent external mutation of internal state
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

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a CSPRNG-backed sampler (e.g. crypto.getRandomValues()) to satisfy regulated gaming RNG certification requirements. [L32]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to approximately 5–6 (P≈0.04–0.05) so DIAMOND's per-payline EV no longer exceeds the entire 95% RTP budget alone. Current weight implies RTP > 229% from DIAMOND alone. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add a RangeError guard in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw rather than passing undefined to pickFromWeighted. [L44]
- **[correction · low · trivial]** Add the same bounds guard in getReelWeights to prevent returning undefined typed as number[]. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
