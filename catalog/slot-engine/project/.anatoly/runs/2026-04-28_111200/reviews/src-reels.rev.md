# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 78% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 80% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 88% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Array of symbols used locally in spinReel (line 46) to pick weighted random symbols
- **Duplication [UNIQUE]**: Constant array of symbol strings. No similar constants found.
- **Correction [OK]**: Array of 8 symbols matches interface and documentation exactly.
- **Overengineering [LEAN]**: Plain array of the 8 symbols; minimal and appropriate as a single source of truth for reel composition.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used 5 times to initialize REEL_WEIGHTS array elements (lines 24-28)
- **Duplication [UNIQUE]**: Configuration constant with default reel weights. No similar constants found.
- **Correction [OK]**: Weights sum to 120 (25+25+15+10+5+30+5+5=120) matching documented total in .anatoly/docs/01-Getting-Started/03-Configuration.md and .anatoly/docs/04-API-Reference/02-Configuration-Schema.md; all per-symbol values match the tables exactly.
- **Overengineering [LEAN]**: Static constant; values match the documented weight table exactly (total 120 per reels.ts docs). The constant itself is minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used in spinReel (line 44) to get weights and in getReelWeights (line 57) to retrieve reel weights
- **Duplication [UNIQUE]**: 2D array of pre-computed reel weight arrays. No similar constants found.
- **Correction [OK]**: Exactly 5 entries, one per reel, all populated via weightsToArray(DEFAULT_WEIGHTS), consistent with documentation stating all five reels share identical weights.
- **Overengineering [LEAN]**: Five explicit calls to weightsToArray(DEFAULT_WEIGHTS) is slightly verbose versus Array(5).fill(...), but the docs confirm all five reels are intentionally identical, and the repetition is clear and readable. No meaningful abstraction is missing.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Helper function called in spinReel (line 46) to perform weighted random selection of symbols
- **Duplication [DUPLICATE]**: Weighted random selection using cumulative weight accumulation. Identical logic to weightedPick in src/rng.ts with RAG similarity score 0.852.
- **Correction [OK]**: Cumulative-weight selection algorithm is correct; fallback to last item handles floating-point edge where r==total. Previously overturned finding not re-flagged.
- **Overengineering [LEAN]**: Standard O(n) weighted random selection algorithm, generic only to the degree needed (items + weights). Well-known pattern implemented correctly and minimally.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical — both compute total weight via reduce, generate random roll, accumulate weights in loop, and return item at threshold or fallback to last item

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function, runtime-imported by src/factories.ts per pre-computed analysis
- **Duplication [UNIQUE]**: Spins a reel by selecting three symbols via weighted distribution. No similar functions found.
- **Correction [OK]**: Generates a 3-symbol column from the correct reel's weight table; previously overturned out-of-bounds and hardcoded-row-count findings not re-flagged.
- **Overengineering [LEAN]**: Straightforward: looks up the reel's weight array and draws 3 symbols. Single responsibility, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function, runtime-imported by src/engine.ts per pre-computed analysis
- **Duplication [UNIQUE]**: Trivial getter function returning SYMBOLS constant. No similar functions found.
- **Correction [OK]**: Trivially correct getter returning the SYMBOLS constant.
- **Overengineering [LEAN]**: Minimal accessor exposing the SYMBOLS constant to consumers without leaking the mutable array reference concept. Appropriate.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function, runtime-imported by src/engine.ts per pre-computed analysis
- **Duplication [UNIQUE]**: Trivial getter function returning REEL_WEIGHTS entry by index. No similar functions found.
- **Correction [OK]**: Trivially correct getter returning REEL_WEIGHTS[reelIndex]; previously overturned finding not re-flagged.
- **Overengineering [LEAN]**: Thin accessor for REEL_WEIGHTS by index. Minimal and appropriate for exposing configuration to callers.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig repeats all 8 Symbol literal keys manually as `number` fields. Since `Symbol` is already imported as a union type, `Record<Symbol, number>` would be structurally equivalent, eliminate duplication, and automatically stay in sync if the Symbol union changes. [L11-L14] |
| 5 | Immutability | WARN | MEDIUM | Module-level constants SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable at runtime. SYMBOLS should be `readonly Symbol[]` or use `as const`. DEFAULT_WEIGHTS should be `Readonly<ReelWeightConfig>`. REEL_WEIGHTS should be `ReadonlyArray<readonly number[]>`. getReelWeights() also returns a direct reference to the internal mutable array, allowing external mutation of REEL_WEIGHTS entries. [L3-L30] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions — spinReel, getReelSymbols, getReelWeights — lack JSDoc comments. Consumers cannot understand parameter semantics (e.g., valid range for reelIndex is 0–4) or return value contracts without reading the implementation. [L44-L58] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gambling domain conclusively inferred from symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, WILD, SCATTER, DIAMOND), reel/weight/spin nomenclature, and corroborating project files (jackpot.ts, freespin.ts, rng.ts per .anatoly/docs/04-API-Reference/02-Configuration-Schema.md). Math.random() is a non-seeded, non-auditable PRNG that is not certifiable for regulated gaming RNG requirements (e.g., GLI, BMM, eCOGRA standards). Critically, the project already provides a dedicated src/rng.ts module (visible in the documented project structure) that almost certainly wraps a certifiable or at least auditable RNG — yet pickFromWeighted bypasses it entirely and calls Math.random() directly. This is both a compliance and auditability failure. [L34-L35] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted and spinReel are non-deterministic because they call Math.random() directly with no RNG injection point. Deterministic unit tests require either mocking globalThis.Math.random (brittle) or refactoring to accept an rng parameter. This also violates the spirit of the existing src/rng.ts abstraction. [L32-L50] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The `satisfies` operator (TS 4.9+, idiomatic in 5.x/2026) would improve DEFAULT_WEIGHTS: `const DEFAULT_WEIGHTS = { ... } satisfies ReelWeightConfig` gives both type-checking and narrower literal inference without widening. Similarly SYMBOLS could use `as const satisfies Symbol[]`. [L16-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two domain-specific concerns beyond rule 13: (1) getReelWeights() returns the raw internal mutable number[] from REEL_WEIGHTS, allowing callers to silently mutate reel configurations in a live game session — should return a copy or a readonly reference. (2) spinReel() has no bounds-guard on reelIndex; accessing REEL_WEIGHTS[reelIndex] for an out-of-range index silently returns undefined and propagates NaN into weight arithmetic, corrupting symbol selection without any error. [L44-L58] |

### Suggestions

- Replace Math.random() with the project's own rng.ts module to meet regulated-gaming RNG requirements and enable deterministic testing.
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
- Use Record<Symbol, number> instead of a manually-enumerated interface to keep ReelWeightConfig in sync with the Symbol union automatically.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as readonly/as const to prevent accidental mutation of shared reel configuration state.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [ ... ];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies readonly Symbol[];
  
  const DEFAULT_WEIGHTS = { ... } satisfies Readonly<ReelWeightConfig>;
  
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Add bounds validation in spinReel and getReelWeights to surface out-of-range reelIndex early instead of propagating undefined silently.
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
- Return a defensive copy from getReelWeights to prevent external callers from mutating the shared internal reel configuration.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range`);
    }
    return [...REEL_WEIGHTS[reelIndex]];
  }
  ```
- Add JSDoc to all three public exports to document valid input ranges and return semantics.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel and returns the three visible symbols for that column.
   * @param reelIndex - Zero-based reel index in the range [0, 4].
   * @returns An array of exactly 3 symbols from top to bottom.
   * @throws {RangeError} If reelIndex is outside [0, 4].
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
