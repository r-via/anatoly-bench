# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 88% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | WEAK | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by spinReel (pickFromWeighted call) and returned by getReelSymbols, both of which are externally imported.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Eight symbols defined in the correct order matching weightsToArray output.
- **Overengineering [LEAN]**: Simple flat array of literal strings. Appropriate as the canonical symbol list.
- **Tests [NONE]**: No test file exists. Transitive coverage would require spinReel/getReelSymbols to be tested, but they are not.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant with no comment explaining its role as the master symbol registry.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as the type annotation for DEFAULT_WEIGHTS (L12) and the cfg parameter of weightsToArray (L17), both used locally.
- **Duplication [UNIQUE]**: No similar interface found in the codebase.
- **Correction [OK]**: Interface correctly types all eight reel symbols.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: All fields are symbol names mapped to numbers; purpose is self-evident from name and field structure.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times during REEL_WEIGHTS initialization (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 → P=0.25/cell. Left-to-right payline contribution: 3-match = 0.25³×0.75×50 = 0.586; 4-match = 0.25⁴×0.75×250 = 0.732; 5-match = 0.25⁵×1000 = 0.977 → total ≈ 2.295 (229.5% RTP) from DIAMOND alone, before all other symbols, WILDs, and free spins. Backward: weight ~5 → P≈0.042 → DIAMOND contribution ≈0.43%, leaving headroom for other symbols to sum toward 95%. Sanity: forward(weight 5) ≈ 0.43% ✓ formula consistent. Arbitrated intent (README.md): RTP = 95%. DIAMOND at weight 30 violates this target by more than an order of magnitude.
- **Overengineering [ACCEPTABLE]**: Named fields improve readability over a bare number[], but the benefit is undermined by the ReelWeightConfig → weightsToArray indirection it necessitates. If the interface were dropped, a well-commented number[] would be simpler overall.
- **Tests [NONE]**: No test file exists to verify weight values or their effect on symbol distribution.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No comment explaining the weight values, their sum (120), or that all five reels share these defaults. (deliberated: confirmed — Confirmed with increased confidence. reels.ts:14 sets DIAMOND weight to 30 (highest of all symbols at 25% probability = 30/120). paytable.ts:11 shows DIAMOND pays [50, 250, 1000] — the highest-paying symbol in the game. Meanwhile SEVEN pays [25, 100, 500] with weight 5 (4.2%). The most valuable symbol is 6x more likely than the second-most valuable but pays 2x more. This inverts the standard risk/reward relationship and would produce an RTP far exceeding 100%, making the game unprofitable for the house. Cross-referencing all five reels use identical DEFAULT_WEIGHTS (reels.ts:23-27), amplifying the issue across every spin.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in REEL_WEIGHTS array initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar function found per RAG results.
- **Correction [OK]**: Maps ReelWeightConfig fields to array in the same order as SYMBOLS.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Ordering of weights relative to SYMBOLS array is critical and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, <10 lines, clear name. Tolerated per internal-helper leniency rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57), both consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Five reels initialized from DEFAULT_WEIGHTS; root defect is in DEFAULT_WEIGHTS.DIAMOND, not here.
- **Overengineering [ACCEPTABLE]**: Five-element structure anticipates per-reel weight divergence and matches the getReelWeights(reelIndex) API contract. All five reels currently share identical weights, but the 2D layout is a reasonable extension point given the documented API surface.
- **Tests [NONE]**: No test file exists. Transitive coverage would require spinReel/getReelWeights to be tested, but they are not.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all five entries share identical default weights — a comment would clarify intent and extensibility.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel (L47), which is runtime-imported by src/factories.ts.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: same reduce-based total, same Math.random() roll, same cumulative loop with early return, same fallback to last element. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and type (Symbol vs generic T). pickFromWeighted should be replaced by a call to the more generic weightedPick.
- **Correction [NEEDS_FIX]**: Math.random() on line 32 is a non-certifiable PRNG. Domain inferred from slot-machine vocabulary (reels, CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER, paylines, jackpot). Regulated gaming RNG must use a CSRNG — Math.random() (V8 Xorshift128+) is not accepted by gaming regulators (GLI, BMM, etc.).
- **Overengineering [LEAN]**: Standard O(n) weighted-random-selection algorithm. Single responsibility, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Key edge cases untested: single-item array, all-zero weights, boundary rounding (r == acc), and statistical distribution correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper implementing weighted random selection. Tolerated per internal-helper leniency rule, though algorithm is non-trivial. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. reels.ts:30-41 is algorithmically identical to rng.ts:5-16 (same cumulative-weight loop, same fallback). However, duplication is not a correctness bug — both functions produce correct weighted-random results. pickFromWeighted is private to reels.ts, called at line 47 in spinReel, and works correctly. The duplication belongs on the duplication axis (which the automated review also flagged separately), not the correction axis. No behavioral defect exists in this function.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~99% identical logic — same weighted random selection algorithm; weightedPick is the generic version using T instead of Symbol

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found per RAG results.
- **Correction [OK]**: Picks 3 symbols per reel correctly; RNG and weight defects are owned by pickFromWeighted and DEFAULT_WEIGHTS.
- **Overengineering [LEAN]**: Straightforward: look up weights, push three picks into a column. No excess abstraction.
- **Tests [NONE]**: No test file exists. Used by src/factories.ts. Edge cases like out-of-range reelIndex (REEL_WEIGHTS[reelIndex] would be undefined) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (one Symbol per row), and behavior on out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported and consumed by spin() in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns SYMBOLS reference; no correctness defect.
- **Overengineering [LEAN]**: Minimal accessor exposing the canonical symbol list.
- **Tests [NONE]**: No test file exists. Consumed by spin() in src/engine.ts for core slot logic; symbol list integrity is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Name is descriptive but no comment on ordering or that the array is the canonical symbol registry used by weight arrays.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported and consumed by spin() in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns REEL_WEIGHTS[reelIndex] correctly.
- **Overengineering [LEAN]**: Minimal indexed accessor; straightforward delegation to REEL_WEIGHTS.
- **Tests [NONE]**: No test file exists. Consumed by spin() in src/engine.ts; out-of-range reelIndex returns undefined silently, untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), correspondence between returned array indices and symbol order, and that weights are read-only at runtime.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 Symbol keys. Record<Symbol, number> is the canonical utility type here and prevents the interface drifting out of sync with the Symbol union in types.ts. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are mutable const bindings with no readonly annotation or as const. getReelSymbols() and getReelWeights() return direct references to internal arrays, allowing callers to mutate module-level state at runtime — contradicting the documented read-only contract. [L3-L28] |
| 8 | ESLint compliance | WARN | HIGH | With noUncheckedIndexedAccess, wts[i] and items[i] inside pickFromWeighted resolve to number\|undefined and Symbol\|undefined respectively but are used as their non-nullable types without narrowing. Additionally, REEL_WEIGHTS[reelIndex] at L44 is typed number[]\|undefined under that flag yet is passed directly to pickFromWeighted expecting number[]. Both would be caught by @typescript-eslint rules under a strict lint config. [L30-L47] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported functions (spinReel, getReelSymbols, getReelWeights) lack JSDoc. At minimum spinReel should document the valid reelIndex range (0–4) and the 3-row column return shape. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel (L44) and getReelWeights (L57) index REEL_WEIGHTS with an unchecked reelIndex. An out-of-range value returns undefined, which propagates as weights into pickFromWeighted and causes a silent wrong-result or runtime TypeError. Both public exports should guard: if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...). [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) and reel/spin/payline terminology. Math.random() at L32 is a non-cryptographic PRNG that is not certifiable for regulated gambling RNG (GLI-11, BMM, eCOGRA standards prohibit it). The project ships src/rng.ts, indicating a dedicated RNG module exists; pickFromWeighted must accept an injectable rng: () => number parameter sourced from that module. [L32] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly. Deterministic unit tests must monkey-patch Math.random or rely on statistical sampling. Accepting rng: () => number as a parameter would make the function purely testable without any global mutation. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS and REEL_WEIGHTS could use satisfies to validate shape at compile time while retaining literal inference. SYMBOLS could be declared as const to give a readonly tuple type rather than Symbol[]. [L3-L28] |
| 17 | Context-adapted rules | WARN | MEDIUM | In a regulated slot-machine context, pickFromWeighted has a silent fallback: if all weights are 0, total=0, r=0, every acc+=0 check fails, and items[items.length-1] (SCATTER) is returned unconditionally, biasing the last symbol. Any silent RNG fallback is an audit red flag. The function should assert total > 0 or throw rather than silently bias output. [L30-L41] |

### Suggestions

- Replace the manual ReelWeightConfig interface with Record<Symbol, number>
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Inject an RNG function to replace Math.random(), enabling certified RNG and deterministic tests
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      acc += wts[i];
      if (r < acc) return items[i];
    }
    return items[items.length - 1];
  }
  
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    if (total <= 0) throw new RangeError('Weight total must be positive');
    const r = rng() * total;
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      acc += wts[i]!;
      if (r < acc) return items[i]!;
    }
    return items[items.length - 1]!;
  }
  
  export function spinReel(reelIndex: number, rng: () => number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex]!;
  ```
- Mark module-level arrays readonly and return readonly arrays from getters to enforce the documented read-only contract
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [ ... ];
  const REEL_WEIGHTS: number[][] = [ ... ];
  
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = [ ... ] as const;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  
  export function getReelSymbols(): readonly Symbol[] {
    return SYMBOLS;
  }
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}`);
    }
    return REEL_WEIGHTS[reelIndex]!;
  }
  ```
- Use satisfies for compile-time shape validation while retaining literal types
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

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to a value consistent with the 95% RTP target. At weight 30, DIAMOND alone contributes ~230% RTP per payline. A full actuarial model is needed for the exact value, but order-of-magnitude correction requires bringing DIAMOND weight into single digits (e.g., ~5). [L14]
- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues (normalized to [0,1) Float64) to meet regulated gaming certification requirements (GLI-11, BMM, etc.). [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
