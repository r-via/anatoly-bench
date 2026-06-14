# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 88% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 68% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted() call at line 38
- **Duplication [UNIQUE]**: No similar symbols found in semantic search
- **Correction [OK]**: Eight symbols correctly defined; array order matches ReelWeightConfig and weightsToArray ordering.
- **Overengineering [LEAN]**: Flat array of 8 fixed symbol names. No abstraction needed.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; leniency applies, but no comment explains its role as the canonical ordered symbol list used for reel indexing.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Referenced 5 times in REEL_WEIGHTS initialization (lines 24–28)
- **Duplication [UNIQUE]**: Configuration constant, no duplicates found
- **Correction [OK]**: Excluded per project instructions (previously overturned false positive).
- **Overengineering [LEAN]**: Simple literal config object. The naming is clear and the values match the documented distribution.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Raw numeric values give no indication of total weight (120), probability implications, or that all five reels share this distribution.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: Constant array initialization, no duplicates found
- **Correction [OK]**: Five reels, each initialized from DEFAULT_WEIGHTS via weightsToArray. Structure is correct.
- **Overengineering [LEAN]**: Five identical rows is verbose but transparent. The repetition is intentional and leaves room for per-reel customisation without structural change.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No comment explains the 5-reel structure, that all reels share identical weights, or how this array is indexed by reel position.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel at line 39 to select random symbol
- **Duplication [DUPLICATE]**: Implements identical weighted random selection algorithm as weightedPick from rng.ts
- **Correction [OK]**: Excluded per project instructions (previously overturned false positive).
- **Overengineering [LEAN]**: Standard O(n) weighted-pick — correct and minimal for 8 symbols.
- **Tests [NONE]**: No test file exists. This is the most critical untested function — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, zero-weight symbols) and a fallback return that masks silent failures.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper. Name is descriptive enough; leniency applies. A note on the fallback return (last item) would help but is not required.

> **Duplicate of** `src/rng.ts:weightedPick` — Identical logic: reduce weights to total, generate random value, iterate with cumulative counter, return item where roll < cumulative, or default fallback. Only differences are variable names and concrete vs generic types

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] returns undefined for any index outside 0–4, causing a TypeError in pickFromWeighted when reduce is called on undefined. The exported function signature accepts any number.
- **Overengineering [LEAN]**: Straightforward: look up weights, draw 3 symbols, return column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; untested out-of-range reelIndex would silently produce undefined weights.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of purpose, explanation of reelIndex (valid range 0–4), and clarification that the returned Symbol[] represents 3 rows for that column.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function
- **Correction [OK]**: Simply returns the module-level SYMBOLS array; correct.
- **Overengineering [LEAN]**: Trivial accessor; no abstraction overhead.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No explanation of why callers would need the canonical symbol list or that order matches weight array indices.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function
- **Correction [NEEDS_FIX]**: Returns REEL_WEIGHTS[reelIndex] unguarded; the declared return type is number[] but the runtime value is undefined for any reelIndex outside 0–4, silently propagating the wrong type to callers.
- **Overengineering [LEAN]**: Trivial accessor; no abstraction overhead.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of reelIndex parameter (valid range, what out-of-bounds returns), and what the returned number[] represents (ordered weights parallel to getReelSymbols()).

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are mutable module-level constants. `SYMBOLS` should be `as const`, `DEFAULT_WEIGHTS` should be `Readonly<ReelWeightConfig>`, and `REEL_WEIGHTS` should be `readonly (readonly number[])[]`. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` are all exported without JSDoc. Parameter semantics (`reelIndex` range 0–4) are undocumented. [L45-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated gambling domain inferred from reel/symbol/SCATTER/WILD/SEVEN vocabulary and project docs. `Math.random()` is a non-seeded, non-auditable PRNG that is not certifiable for regulated gaming RNG. It must be replaced with a cryptographically secure, auditable RNG. Additionally, `pickFromWeighted` duplicates functionality that the reference docs attribute exclusively to `weightedPick` in `src/rng.ts`, bypassing the single auditable RNG entry point. Source: `.anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md`. [L33-L43] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point. `spinReel` is non-deterministic and cannot be unit-tested without patching the global. Accepting an `rng: () => number` parameter would make both functions pure and trivially testable. [L32-L43] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SYMBOLS` should use `as const` for literal-type inference. `DEFAULT_WEIGHTS` could use `satisfies ReelWeightConfig` to retain literal types while enforcing the shape. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` returns a direct reference to the internal `REEL_WEIGHTS[i]` array. Callers can mutate active reel weights at runtime — a serious integrity concern for audited gambling software. Should return a frozen copy: `return Object.freeze([...REEL_WEIGHTS[reelIndex]])`. [L54-L56] |

### Suggestions

- Inject RNG dependency to centralize auditable randomness and enable deterministic testing
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use `as const` and `Readonly` to prevent accidental mutation of module-level constants
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies Symbol[];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: readonly (readonly number[])[] = [ ... ];
  ```
- Return a frozen copy from `getReelWeights` to prevent external weight mutation
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    return Object.freeze([...REEL_WEIGHTS[reelIndex]]);
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds guard in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError instead of allowing undefined to propagate into pickFromWeighted. [L44]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add the same bounds guard in getReelWeights and narrow the return type or throw on invalid index so callers cannot silently receive undefined. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
