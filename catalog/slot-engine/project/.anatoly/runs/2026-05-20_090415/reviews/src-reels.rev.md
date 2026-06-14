# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 80% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 88% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls at line 48 and throughout spinReel logic
- **Duplication [UNIQUE]**: Constant symbol array definition; no similar constants found
- **Correction [OK]**: 8-element array matches the 8 keys in ReelWeightConfig and weightsToArray ordering exactly.
- **Overengineering [LEAN]**: Simple static array of 8 symbols. No abstraction needed beyond this.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name is clear but no comment explaining the canonical symbol ordering or its role as the master symbol list.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray in REEL_WEIGHTS initialization 5 times (lines 24-28)
- **Duplication [UNIQUE]**: Constant weight configuration object; no similar constants found
- **Correction [OK]**: Excluded per project instructions (known false positive).
- **Overengineering [LEAN]**: Straightforward static constant given the interface it satisfies. Complexity lives in `ReelWeightConfig`, not here.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Numeric values are opaque without context — nothing explains that weights are relative (total=120) or that all five reels share this distribution.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel (line 44) and getReelWeights (line 57) to retrieve weight arrays
- **Duplication [UNIQUE]**: Constant array of weight arrays; no similar constants found
- **Correction [OK]**: Five independent arrays constructed via weightsToArray; indices 0–4 match the documented reel count.
- **Overengineering [ACCEPTABLE]**: Five explicit identical calls is verbose; `Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS))` would be DRYer. However, the 2D structure preserves the option to assign distinct weights per reel without refactoring, which is a real design-time concern for a slot engine.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Nothing documents that this is a 5-reel × 8-symbol weight matrix or that all reels are identical by default.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop to randomly select symbols based on weights
- **Duplication [DUPLICATE]**: RAG score 0.823; implements identical weighted random selection algorithm with same control flow and return behavior
- **Correction [NEEDS_FIX]**: Uses Math.random() — not certifiable for regulated gaming RNG. Inferred slot-machine domain from symbol vocabulary (CHERRY/SEVEN/DIAMOND/WILD/SCATTER), paytable, and arbitrated RTP=95% target. Industry convention requires a certifiable CSPRNG; Math.random() is a non-deterministic, implementation-defined PRNG that is not auditable by gaming certification labs.
- **Overengineering [LEAN]**: Canonical O(n) weighted random selection. Correct, minimal, no unnecessary abstraction.
- **Tests [NONE]**: No test file. Critical probabilistic logic (weighted random selection, boundary at r==total, fallback last item) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal but algorithmically non-trivial (weighted random selection); missing param descriptions and invariant that wts.length must equal items.length. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. reels.ts:30-41 implements weighted random selection correctly — sum weights, draw uniform random, accumulate until threshold. The algorithm is identical to weightedPick in rng.ts:5-16, but duplication is a refactoring concern, not a correctness bug. pickFromWeighted is the function actually called at runtime (via spinReel at reels.ts:47 → factories.ts:12 → engine.ts:128). No behavioral defect exists. The NEEDS_FIX was based on duplication detection (RAG score 0.823), which belongs on the duplication axis, not correction.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both compute total weight, generate random roll, accumulate weights, and return item at threshold; differs only in variable naming (acc/cumulative, r/roll) and generics (specific Symbol[] vs. generic T[])

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported; runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3 random symbols for a reel; no similar functions found per RAG
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] returns undefined for any index outside 0–4, causing pickFromWeighted to crash with TypeError on wts.reduce() at L32.
- **Overengineering [LEAN]**: Straightforward 3-row column generation delegating to `pickFromWeighted`.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; produces 3-symbol columns driving game state. No coverage of invalid reelIndex or output length guarantees.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the return is always a 3-element column, and that selection is independent per row.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS; no similar functions found
- **Correction [OK]**: Returns SYMBOLS reference; no correctness defect in context of this file.
- **Overengineering [LEAN]**: Minimal accessor for the symbol list.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; trivial accessor but untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of what is returned or its significance as the canonical ordered symbol list.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning weight array by index; no similar functions found
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4, silently returning undefined while TypeScript types the return as number[]; callers relying on the type will crash at the use-site.
- **Overengineering [LEAN]**: Minimal indexed accessor documented as the public API for weight inspection.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; undefined behavior for out-of-range reelIndex is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the returned array is ordered to match getReelSymbols(), and that it is a direct reference (not a copy).

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbol fields. Record<Symbol, number> would express the same constraint and auto-stay in sync if the Symbol union changes. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS (L3), DEFAULT_WEIGHTS (L12), and REEL_WEIGHTS (L22) are all mutable. getReelWeights() returns a live number[] reference to internal state; callers can silently corrupt all reel weights in place. getReelSymbols() similarly exposes the mutable SYMBOLS array. [L3-L28, L52-L58] |
| 8 | ESLint compliance | WARN | HIGH | spinReel performs no bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for any index outside 0–4, causing pickFromWeighted to receive undefined as wts and crash at runtime (wts.reduce is not a function). [L43-L44] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights lack JSDoc. spinReel critically needs @param documentation for the valid reelIndex range (0–4). [L43, L52, L56] |
| 13 | Security | FAIL | CRITICAL | Math.random() drives all symbol selection in pickFromWeighted (L32). Casino/slot-machine domain is unambiguous: symbol names (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), jackpot.ts, freespin.ts, and paytable.ts all confirm regulated gaming context. Math.random() is a non-cryptographic PRNG that is not certifiable for regulated gaming RNG. The project already has src/rng.ts — pickFromWeighted must accept an injected RNG function and use that module instead of the global PRNG. [L32] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly; non-deterministic and untestable without monkey-patching globals. Injecting a rng: () => number parameter would make it a pure function testable with seeded values. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and DEFAULT_WEIGHTS should use as const satisfies for literal-type narrowing and compile-time validation against the Symbol union without widening. [L3-L5, L12-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights exposes a mutable number[] reference to REEL_WEIGHTS internal state. The reference docs (.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md) state weights are read-only at runtime with no setter, but a caller can call getReelWeights(0)[0] = 999 to silently corrupt all future spins. [L56-L58] |

### Suggestions

- Replace Math.random() with an injectable RNG from src/rng.ts to satisfy regulated gaming requirements
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  type RngFn = () => number;
  
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: RngFn): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Apply readonly / as const satisfies to module-level constants and fix return types
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies readonly Symbol[];
  const DEFAULT_WEIGHTS = { ... } as const satisfies Readonly<ReelWeightConfig>;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Use Record<Symbol, number> for ReelWeightConfig
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Add bounds guard to spinReel to prevent undefined weights crashing at runtime
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
- Add JSDoc to all public exports documenting valid parameter ranges
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spin a single reel column.
   * @param reelIndex - Reel index in [0, 4]
   * @returns 3 symbols sampled from the weighted distribution for that reel
   * @throws RangeError if reelIndex is out of bounds
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a certifiable CSPRNG (e.g., crypto.getRandomValues) suitable for regulated gaming RNG audits. [L32]
- **[correction · medium · small]** Guard spinReel against out-of-range reelIndex (valid range 0–4); throw a RangeError or clamp/assert before accessing REEL_WEIGHTS[reelIndex]. [L44]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Guard getReelWeights against out-of-range reelIndex (valid range 0–4); throw or return a defined fallback rather than undefined. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
