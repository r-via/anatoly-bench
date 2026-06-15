# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 75% |
| spinReel | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 88% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used locally: called in pickFromWeighted at line 47 (spinReel) and returned at line 53 (getReelSymbols)
- **Duplication [UNIQUE]**: Constant array of symbol strings. No similar constants found.
- **Correction [OK]**: Eight symbols declared in the same order used by weightsToArray; no issues.
- **Overengineering [LEAN]**: Simple array constant listing all 8 slot symbols.
- **Tests [NONE]**: No test file exists. SYMBOLS array defines the universe of valid slot symbols; no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from the name alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Referenced in REEL_WEIGHTS initialization at lines 23–27
- **Duplication [UNIQUE]**: Configuration constant for default reel weights. No duplicates found.
- **Correction [OK]**: Sum = 25+25+15+10+5+30+5+5 = 120; matches documented total.
- **Overengineering [LEAN]**: Straightforward named-key weight map; easy to read and maintain.
- **Tests [NONE]**: No test file. Weight values directly affect payout probabilities — critical to verify they sum correctly and reflect design intent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation that these are relative integer weights, how probability is derived, or that all five reels share this config.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used locally in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: Precomputed weight arrays for 5 reels. No duplicates found.
- **Correction [OK]**: Five reels, each a correctly-derived weight array.
- **Overengineering [ACCEPTABLE]**: Five-element array, one entry per reel, allows per-reel weight divergence in future. All reels currently share `DEFAULT_WEIGHTS`, but the shape is appropriate for a slot machine that may need differentiated reels.
- **Tests [NONE]**: No test file. Verifying that all 5 reels are populated and each weight array has the correct length is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The decision to give all five reels identical weights is a meaningful design choice with no explanation.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel at line 47 to select weighted symbols
- **Duplication [DUPLICATE]**: Weighted random selection with identical logic to weightedPick from src/rng.ts. Both compute cumulative weights and return item at threshold.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG.
- **Overengineering [LEAN]**: Minimal weighted-random selection; linear scan is correct and sufficient for 8 items.
- **Tests [NONE]**: No test file. Core probability sampling logic — boundary conditions (r exactly at boundary, zero weights, single item) and fallback return are completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Weighted-random selection algorithm with a fallback to the last element on floating-point edge cases — neither the algorithm nor the edge-case behavior is explained. (deliberated: confirmed — Confirmed duplicate. src/reels.ts:30-41 is functionally identical to src/rng.ts:5-16. Both implement: (1) sum weights via reduce, (2) Math.random() * total, (3) cumulative accumulation loop, (4) fallback to last item. Only differences: variable names and pickFromWeighted is typed Symbol[] while weightedPick is generic <T>. pickFromWeighted should be replaced with weightedPick. However, this is a duplication/maintainability issue, not a correctness bug — both produce correct weighted random results. The finding is on the correction axis which is a slight mismatch; the defect is real but mis-categorized. Raising confidence to 75 since the duplication is unambiguous, but the correction axis overstates the severity.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical implementation — cumulative weight accumulation, random threshold comparison, fallback to last item

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported and runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Spins a reel 3 times using pickFromWeighted. No similar functions found.
- **Correction [ERROR]**: No bounds check on reelIndex; out-of-range index yields undefined weights, crashing pickFromWeighted at wts.reduce().
- **Overengineering [LEAN]**: Builds a 3-row column by delegating to `pickFromWeighted`; straightforward and appropriately sized.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; should verify returns exactly 3 symbols, all within SYMBOLS, and handles out-of-range reelIndex gracefully.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns 3 symbols (one per row), and that results are independent per row. (deliberated: confirmed — Confirmed ERROR with slight confidence reduction. At src/reels.ts:44, `REEL_WEIGHTS[reelIndex]` has no bounds check. REEL_WEIGHTS has exactly 5 entries (lines 22-28). For reelIndex >= 5 or < 0, weights becomes undefined, and pickFromWeighted at line 31 crashes on `wts.reduce()`. The function is exported (line 43) and accepts unconstrained `number`. However, the sole runtime caller is StandardReelBuilderFactory (src/factories.ts:12) which iterates 0..4, so the crash never triggers in current code paths. Lowering confidence slightly to 88 because the bug requires an out-of-range caller that doesn't currently exist, though the missing guard on an exported function is still a legitimate defect.)

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Simple accessor returning SYMBOLS array. No duplicates found.
- **Correction [OK]**: Returns the internal array reference; callers that mutate it corrupt shared state, but no evidence that mutations occur in scope.
- **Overengineering [LEAN]**: Simple accessor; exposes the symbol list without coupling callers to the module-level constant.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; trivial accessor but its return value is relied upon by engine logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Public export with no description of what the returned array represents or its ordering.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Simple accessor returning weight array for reel. No duplicates found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; returns undefined for invalid indices, violating the number[] return type contract at runtime.
- **Overengineering [LEAN]**: Simple indexed accessor for per-reel weights; appropriate for inspection/testing.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: valid reelIndex range, that returned array maps positionally to getReelSymbols(), and that weights are relative integers.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually mirrors every member of the Symbol union. Record<Symbol, number> expresses the same shape in one line and automatically catches future symbol additions. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutably typed. Nothing prevents callers from pushing into SYMBOLS or overwriting weight slots at runtime. [L3-L28] |
| 8 | ESLint compliance | WARN | HIGH | REEL_WEIGHTS[reelIndex] at L44 and L57 yields undefined for any out-of-range index. With noUncheckedIndexedAccess enabled, TypeScript would flag these as potential undefined. spinReel passes the result directly to pickFromWeighted, which would crash on .reduce when weights is undefined. [L44, L57] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are exported with no JSDoc. At minimum, spinReel should document the valid reelIndex range (0–4) and the shape of the returned column. [L43-L58] |
| 13 | Security | FAIL | CRITICAL | Math.random() drives all RNG for a regulated slot-machine game (confirmed by CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbols, reel/spin/paytable/jackpot vocabulary in the project structure). Math.random() is not cryptographically secure and is not certifiable for regulated gaming. The project contains src/rng.ts — a designated RNG abstraction — which pickFromWeighted bypasses entirely. [L32] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly with no way to inject a seeded RNG, making deterministic unit tests impossible without monkey-patching globals. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS is annotated as ReelWeightConfig, discarding literal types. The satisfies operator would validate the shape at compile time while preserving literal types and catching future symbol omissions. [L12-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: spinReel accepts an unconstrained number for reelIndex but only indices 0–4 are valid. Callers passing an out-of-range value receive undefined weights silently. Narrowing to 0\|1\|2\|3\|4 or adding a runtime guard would prevent this. [L43-L50] |

### Suggestions

- Replace Math.random() with the project's dedicated RNG module to satisfy gaming-compliance requirements.
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { randomFloat } from "./rng.js";
  // inside pickFromWeighted:
  const r = randomFloat() * total;
  ```
- Use Record<Symbol, number> to keep weight config in sync with the Symbol union automatically.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...];
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  ```
- Use satisfies on DEFAULT_WEIGHTS to validate shape at compile time while retaining literal types.
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
- Narrow reelIndex to the valid union type to catch out-of-range calls at compile time.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `export function spinReel(reelIndex: 0 | 1 | 2 | 3 | 4): Symbol[] {`

## Actions

### Quick Wins

- **[correction · medium · small]** Add the same bounds guard to getReelWeights to prevent silently returning undefined and violating the declared return type. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a cryptographically auditable RNG (e.g., crypto.getRandomValues) to meet regulated gaming certification requirements (GLI-11, BMM). [L32]
- **[correction · high · large]** Add a bounds guard at the top of spinReel: if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(`Invalid reel index: ${reelIndex}`). [L44]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
