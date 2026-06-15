# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 78% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported constant used internally in spinReel function at line 39 as the items parameter passed to pickFromWeighted for weighted random selection.
- **Duplication [UNIQUE]**: Simple array constant. No similar functions found.
- **Correction [OK]**: Eight-symbol array matches ReelWeightConfig key order and weightsToArray projection order.
- **Overengineering [LEAN]**: Plain array listing the 8 game symbols. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. SYMBOLS drives all reel spin outcomes; zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The array's role as the master symbol registry for all reels is not explained.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported constant referenced in REEL_WEIGHTS initialization via 5 calls to weightsToArray (lines 23–27).
- **Duplication [UNIQUE]**: Configuration constant. No similar functions found.
- **Correction [OK]**: Sum = 25+25+15+10+5+30+5+5 = 120; every weight matches the documented table in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: Single authoritative weight constant matching the documented distribution table (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md).
- **Tests [NONE]**: No test file exists. Weight values directly affect RTP; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation that these weights are shared by all five reels and that values are relative (not percentages).

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported constant accessed in spinReel (line 44) and getReelWeights (line 57) to retrieve weight arrays for random symbol selection.
- **Duplication [UNIQUE]**: Array constant of pre-computed weights. No duplicates.
- **Correction [OK]**: Five reels, all sharing DEFAULT_WEIGHTS — matches documented configuration.
- **Overengineering [OVER]**: number[][] storing one weight array per reel implies per-reel customization, but docs confirm all five reels are identical (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md: 'All five reels share the same weight distribution'). A single shared weights array passed directly to pickFromWeighted would eliminate both this structure and weightsToArray.
- **Tests [NONE]**: No test file exists. All five reels use identical weights; this assumption is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 5-reel structure and the fact that all reels share identical weights are non-obvious design decisions that warrant a comment.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported function called in spinReel at line 39 to perform weighted random selection of reel symbols.
- **Duplication [DUPLICATE]**: Identical weighted selection algorithm. RAG score 0.865. Logic matches: calculate total, generate random, accumulate and compare, return item.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated slot-machine gaming.
- **Overengineering [LEAN]**: Textbook weighted-random selection: accumulate, compare, return. Generic signature (Symbol[], number[]) is justified as it's reused across 5 reels × 3 rows.
- **Tests [NONE]**: No test file exists. Core probability logic with boundary conditions (r==0, r==total, weight=0) and fallback path entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing @param descriptions, @returns, and an explanation of the weighted-random algorithm (linear scan with cumulative sum). Non-trivial logic. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. src/reels.ts:30-41 implements weighted random selection correctly: computes total weight (line 31), generates random in [0, total) (line 32), accumulates and returns on threshold (lines 34-38), with valid fallback (line 40). The NEEDS_FIX conflates duplication with weightedPick (src/rng.ts:5-16) as a correction issue — duplication is real but belongs on the duplication axis, not correction. No algorithmic or logical bug exists in the function itself.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both implement weighted random selection via cumulative sum

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function with 1 runtime importer: src/factories.ts.
- **Duplication [UNIQUE]**: Generates 3-symbol reel. RAG score 0.719 below threshold and semantically unrelated to getReelWeights.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range index yields undefined weights, crashing pickFromWeighted at wts.reduce.
- **Overengineering [LEAN]**: Straightforward: look up reel weights, sample 3 symbols, return column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; produces 3-symbol column per reel but output length, valid symbols, and invalid reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing @param reelIndex (valid range 0–4), @returns (3-element column array), and behavior on out-of-range index. (deliberated: confirmed — Confirmed. src/reels.ts:44 accesses `REEL_WEIGHTS[reelIndex]` with no bounds check. REEL_WEIGHTS has 5 entries (lines 22-28). Any reelIndex outside [0,4] yields undefined, causing TypeError in pickFromWeighted at line 31 (`wts.reduce`). Current usage in src/factories.ts:11-12 always passes indices 0-4 (driven by reelCount=5 at engine.ts:128), so crash is unreachable in practice. Kept NEEDS_FIX since the exported public API accepts arbitrary numbers with no guard, but slightly lowered confidence due to limited current blast radius.)

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function with 1 runtime importer: src/engine.ts.
- **Duplication [UNIQUE]**: Trivial 1-line function. No duplicates.
- **Correction [OK]**: Returns the module-level array reference; no callers visible in this file mutating it.
- **Overengineering [LEAN]**: Minimal read-only accessor exposing the symbol list to consumers.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; returns SYMBOLS reference without defensive copy — mutation risk untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Should document that it returns the shared SYMBOLS reference and that mutation would affect all reel logic.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function with 1 runtime importer: src/engine.ts.
- **Duplication [UNIQUE]**: Trivial 1-line function. No duplicates.
- **Correction [NEEDS_FIX]**: No bounds check; out-of-range reelIndex returns undefined, violating the declared number[] return type silently.
- **Overengineering [LEAN]**: Minimal read-only accessor; useful for testing or display of odds.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; returns mutable array reference and silently returns undefined for out-of-range reelIndex — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing @param reelIndex (valid range), @returns (8-element weight array), and mutation-risk warning on returned reference.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually mirrors every member of the imported `Symbol` union. `Record<Symbol, number>` would enforce exhaustiveness and eliminate duplication. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are module-level constants mutated by nothing, but lack `readonly` / `as const` annotations. Any external caller who obtains a reference via `getReelSymbols()` or `getReelWeights()` receives a live mutable array. [L3-L27] |
| 8 | ESLint compliance | WARN | HIGH | `spinReel` accesses `REEL_WEIGHTS[reelIndex]` with no bounds guard. When `reelIndex >= 5` the result is `undefined`, which propagates as a typed `number[]` into `pickFromWeighted` and causes a silent `NaN` cascade. `noUncheckedIndexedAccess` would surface this statically; without it an ESLint `@typescript-eslint/no-unnecessary-condition` or explicit guard is needed. [L45-L51] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` are all exported with no JSDoc — parameter semantics (e.g. valid range of `reelIndex`), return shape, and side-effect contract are undocumented. [L45-L58] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), `spinReel`, `src/jackpot.ts`, `src/paytable.ts`, and `src/freespin.ts` in the project structure, confirmed by `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md` which documents symbol weights as game-configuration invariants. `Math.random()` is a non-cryptographic, non-certifiable PRNG and is illegal for regulated gaming RNG. The project already contains `src/rng.ts` — a dedicated RNG module — which is conspicuously not imported here. All weighted picks must go through the certified RNG module. [L36] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point, making deterministic unit tests impossible without monkey-patching. `spinReel` couples symbol selection to the global PRNG and to the module-scoped `REEL_WEIGHTS`/`SYMBOLS` constants, preventing independent configuration in tests. [L33-L43] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` could use `satisfies ReelWeightConfig` to preserve literal types while still validating shape. `SYMBOLS` is a good candidate for `as const` to narrow elements to their string-literal types rather than `Symbol[]`. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` and `getReelSymbols` return live internal arrays. Callers can mutate `REEL_WEIGHTS[i]` or `SYMBOLS` in-place, silently altering odds for all subsequent spins. In a gambling engine, unaudited odds mutation is a regulatory violation. Accessors should return copies or `readonly` views. [L53-L58] |

### Suggestions

- Replace Math.random() with the project's certified RNG module
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { nextFloat } from './rng.js';
  const r = nextFloat() * total;
  ```
- Use Record<Symbol, number> to derive ReelWeightConfig from the Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as readonly and freeze return values
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  export function getReelSymbols(): Symbol[] { return SYMBOLS; }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
  ```
- Add bounds guard to spinReel
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
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with the project's certified RNG from src/rng.ts to comply with regulated gaming RNG requirements. [L35]
- **[correction · medium · small]** Add a bounds guard in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError before accessing REEL_WEIGHTS[reelIndex]. [L44]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add a bounds guard in getReelWeights: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError to prevent a silent undefined return. [L57]
- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
