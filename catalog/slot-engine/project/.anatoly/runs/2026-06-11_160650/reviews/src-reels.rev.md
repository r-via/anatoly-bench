# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted call inside spinReel (L47) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Array of 8 symbols matches ReelWeightConfig and weightsToArray order — internally consistent.
- **Overengineering [LEAN]**: Simple tuple of symbol names. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. SYMBOLS array is used by pickFromWeighted and getReelSymbols; no tests verify its contents or ordering.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported internal constant; name is self-descriptive but no comment explains the ordering significance or that this array drives all reel symbol selection.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17).
- **Duplication [UNIQUE]**: No similar interface found in the codebase.
- **Correction [OK]**: Interface correctly mirrors all 8 symbols; used consistently with DEFAULT_WEIGHTS and weightsToArray.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Non-exported interface whose fields are exactly the symbol names mapped to numeric weights — purpose is unambiguous from names alone. Qualifies as self-documenting per type/interface special-case rule.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times to initialize REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (p=0.25 per cell) produces an implied RTP far above 100%, violating the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Named weight object — the named fields are the readable artifact worth keeping.
- **Tests [NONE]**: No test file. Weight values directly affect game payout rates; no tests verify correctness or sum.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported constant; the numeric values carry semantic meaning (relative frequency per reel cell) that is not explained anywhere inline.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar function found. Specific to ReelWeightConfig struct unpacking.
- **Correction [OK]**: Maps ReelWeightConfig fields in the same order as SYMBOLS — no logic errors.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file. Maps ReelWeightConfig to ordered array; no tests verify field ordering matches SYMBOLS array order.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper under 10 lines with a clear name. Tolerated per private-helper rule, but the fixed positional ordering it enforces is a silent contract.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Consumed by spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Correctly initializes 5 reels from DEFAULT_WEIGHTS; the weight-value defect is in DEFAULT_WEIGHTS.
- **Overengineering [LEAN]**: Five identical rows are slightly repetitive (Array(5).fill(...) would be shorter) but this is trivial data initialization, not an abstraction problem.
- **Tests [NONE]**: No test file. No tests verify 5 reels exist or that each has 8 weights aligned to SYMBOLS.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share identical weights and that the outer array index maps to reel index 0–4 is not documented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L47) to select each symbol.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both reduce weights to total, roll Math.random()*total, iterate with cumulative accumulator, and fall back to last item. The only difference is this function is typed specifically for Symbol[] rather than being generic. It is fully replaceable by weightedPick<Symbol>.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a regulated casino/slot-machine context; Math.random() is not a certifiable RNG for regulated gaming (industry rule 11). Domain is unambiguous from reel/payline/jackpot/free-spin vocabulary and file context. Weighted-selection logic itself is correct: r ∈ [0, total), cumulative accumulation terminates correctly, fallback is safe.
- **Overengineering [LEAN]**: Textbook weighted random selection. Linear scan is correct and appropriate for 8 symbols.
- **Tests [NONE]**: No test file. Core probability engine; no tests for uniform weights, zero-weight exclusion, single-item input, or boundary where r == acc.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported, but the algorithm (cumulative-weight selection with fallback to last item) is non-trivial enough to warrant at minimum a one-liner. No param or return docs. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. src/reels.ts:30-41 implements cumulative-weight random selection correctly: computes total via reduce (L31), draws uniform random (L32), accumulates per-index (L34-37), falls back to last item (L40). The algorithm is identical to weightedPick in src/rng.ts — that's a real duplication concern, but duplication is not a correctness defect. The function produces correct weighted-random output. pickFromWeighted is actively used at src/reels.ts:47 in spinReel, which is the actual runtime reel-generation path via factories.ts:12.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted random selection algorithm; only difference is Symbol-specific typing vs generic T

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found. Unique logic for spinning a single reel column using a reel-index-keyed weight table.
- **Correction [OK]**: Logic is correct; REEL_WEIGHTS has exactly 5 entries matching valid indices 0–4. Bounds guard absent but no in-tree call passes out-of-range index (precision guard 1).
- **Overengineering [LEAN]**: Minimal: looks up weights, samples 3 symbols, returns column.
- **Tests [NONE]**: No test file. Imported by src/factories.ts for critical spin path; no tests verify 3-row output, valid symbol membership, or out-of-bounds reelIndex behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return shape (always 3 symbols), and the fact that each row is sampled independently.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported and consumed by spin() in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the module-level SYMBOLS array; no mutation by any visible consumer (precision guard 1 applies).
- **Overengineering [LEAN]**: Trivial accessor, consumed by engine.ts.
- **Tests [NONE]**: No test file. Consumed by spin() in src/engine.ts; no tests verify returned array length, symbol membership, or immutability.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No explanation of return value ordering or that the array is the canonical symbol set driving all reel logic.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported and consumed by spin() in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns a direct reference to the weight array for the requested reel; no in-tree consumer mutates it, and no out-of-range index is evidenced in callers.
- **Overengineering [LEAN]**: Trivial accessor, consumed by engine.ts.
- **Tests [NONE]**: No test file. Consumed by spin() in src/engine.ts; no tests verify correct weights per reelIndex or out-of-bounds behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), what the returned numbers represent (relative weights, not probabilities), and that the array is parallel to getReelSymbols().

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol fields. Since `Symbol` is a union imported from `./types.js`, `Record<Symbol, number>` would enforce completeness and shrink the interface to one line. [L8-L11] |
| 5 | Immutability | WARN | MEDIUM | Three module-level constants (`SYMBOLS`, `DEFAULT_WEIGHTS`, `REEL_WEIGHTS`) lack `readonly` / `as const` / `Readonly<>` annotations. `getReelSymbols` and `getReelWeights` return direct mutable references to internal state, allowing callers to silently corrupt module data. [L3-L27] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` are all exported with no JSDoc. At minimum, `spinReel` needs a `@param reelIndex` note about valid range (0–4) and `@returns`. [L42-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by reel/symbol/WILD/SCATTER/SEVEN vocabulary and paytable references. `Math.random()` (L33) is a non-cryptographic PRNG that is not certifiable for regulated gaming RNG under GLI-11 / BMM / iTech Labs standards. The project already contains `src/rng.ts` — a dedicated RNG module — which is ignored here. All symbol draws must route through the certified RNG abstraction, not `Math.random()` directly. [L33] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly. No RNG injection point makes deterministic unit testing impossible without module-level mocking. Accepting an `rng: () => number` parameter (defaulting to `Math.random`) would enable pure test control. [L29-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS satisfies ReelWeightConfig` would catch excess properties and typos at compile time. `SYMBOLS` and `REEL_WEIGHTS` could use `as const` for deeper literal inference. [L3-L27] |
| 17 | Context-adapted rules | WARN | MEDIUM | `spinReel` does not validate `reelIndex` bounds (valid: 0–4); an out-of-range index silently returns `undefined` weights, making `pickFromWeighted` compute `NaN` and fall through to the last symbol — a silent, undetectable bias in a regulated game. Add a guard: `if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)`. Additionally, `Math.random()` should be replaced with `src/rng.ts` (flagged critically in rule 13 but reinforced here as a casino-domain architectural convention). [L42-L49] |

### Suggestions

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to auto-enforce completeness when the Symbol union changes.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants and interface fields readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Route all RNG calls through `src/rng.ts` to satisfy regulated gaming RNG requirements and enable testability via injection.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from "./rng.js";
  
  function pickFromWeighted(items: Symbol[], wts: readonly number[], rng: () => number = nextFloat): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add reelIndex bounds guard in `spinReel` to avoid silent NaN bias.
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
- Use `satisfies` for `DEFAULT_WEIGHTS` to get exhaustiveness checking at declaration site.
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, ...
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a cryptographically-secure or independently-certified PRNG (e.g. a seeded CSPRNG from a regulated gaming library). Math.random() is non-deterministic-seed pseudorandom and fails certifiability requirements for regulated slot RNG. [L34]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight in DEFAULT_WEIGHTS from 30 to approximately 5–10 (matching documented ~4.2% probability or similar) to bring implied RTP in line with the arbitrated 95% target. At weight=30 (25% per cell), DIAMOND alone contributes ~230% of line bet in expected return, making the total RTP >> 100%. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
