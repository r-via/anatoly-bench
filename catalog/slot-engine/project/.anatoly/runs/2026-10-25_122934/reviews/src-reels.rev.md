# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 80% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 82% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in spinReel and returned by getReelSymbols, both consumed externally.
- **Duplication [UNIQUE]**: Constant list of slot symbol names. No similar candidate found.
- **Correction [OK]**: Symbol order matches weightsToArray order (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER).
- **Overengineering [LEAN]**: Simple symbol list constant.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type of DEFAULT_WEIGHTS and weightsToArray parameter.
- **Duplication [UNIQUE]**: Interface for per-symbol reel weights. No similar candidate found.
- **Correction [OK]**: Type declaration is correct.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray to build each REEL_WEIGHTS entry.
- **Duplication [UNIQUE]**: Default weight config constant. No similar candidate found.
- **Correction [OK]**: The values are internally consistent. No RTP or weight contract is provided, so the DIAMOND weight of 30 cannot be shown to be wrong.
- **Overengineering [ACCEPTABLE]**: Named default weights are reasonable; the object form is only needed because of the extra config indirection.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times to initialize REEL_WEIGHTS.
- **Duplication [UNIQUE]**: Converts ReelWeightConfig to ordered array. No similar functions found.
- **Correction [OK]**: Field order matches SYMBOLS index order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Read by spinReel and getReelWeights, both consumed externally.
- **Duplication [UNIQUE]**: Per-reel weight table built from defaults. No similar candidate found.
- **Correction [OK]**: Builds five independent weight arrays, one per reel.
- **Overengineering [ACCEPTABLE]**: Per-reel weights allow future tuning, but all five reels are identical today. It could be built with Array.from. The shape is justified by the reelIndex API.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel for each row.
- **Duplication [DUPLICATE]**: Line-for-line identical logic to the generic weightedPick: total weights, random roll, cumulative scan, fallback to last item. Only differences are variable names and the Symbol type vs generic T.
- **Correction [OK]**: Cumulative-weight selection is correct. The strict `r < acc` comparison is right because Math.random() is in [0,1). The final return is only a fallback.
- **Overengineering [LEAN]**: Standard weighted random selection with a fallback. It is minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — Identical weighted random selection algorithm; pickFromWeighted is a Symbol-specialized copy of generic weightedPick<T>

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: Builds a 3-row column by weighted picks for a reel. No similar functions found.
- **Correction [OK]**: Returns a 3-row column of weighted picks. The only caller is src/factories.ts, and no out-of-range reel index is shown.
- **Overengineering [LEAN]**: Straightforward loop building a 3-row column.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS.
- **Correction [OK]**: Returns the SYMBOLS array. Nothing in the provided context shows a consumer mutating it.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial getter returning weights for a reel index.
- **Correction [OK]**: Returns the weights for the given reel. No in-tree call with an out-of-range index is shown.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 5.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually lists 8 keys that duplicate the Symbol union; should be Record<Symbol, number>. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS and REEL_WEIGHTS are mutable. getReelSymbols and getReelWeights return the internal mutable arrays, so callers can corrupt shared state. [L3-L5, L12-L15, L23-L29, L49-L55] |
| 8 | ESLint compliance | WARN | HIGH | The imported type `Symbol` shadows the global `Symbol` (no-shadow / no-redeclare / @typescript-eslint/no-shadow). The `for` loops with index access could use for-of, and weights[i] is unchecked under noUncheckedIndexedAccess. [L1, L33-L40] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols and getReelWeights have no JSDoc. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights do not validate reelIndex. An out-of-range index gives undefined weights, and pickFromWeighted then throws a TypeError on `wts.reduce`. The code throws no non-Error values. [L43-L47, L53-L55] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain is inferred from reels, paylines, jackpot and wild/scatter vocabulary. Math.random() is not certifiable for regulated gaming RNG. A project rng.ts exists and the engine resolves rng from a DI container, but this file bypasses it. [L35] |
| 14 | Performance | WARN | MEDIUM | The weight total is recomputed with reduce on every pick (3 per spin per reel), though the weights are static. Precompute the cumulative weights once. [L32-L41] |
| 15 | Testability | FAIL | MEDIUM | Math.random() is hardcoded and the reel weights are module-level state, so spins cannot be made deterministic. The RNG should be injected. [L35, L43-L47] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The constants could use `satisfies` and `as const`, for example `SYMBOLS = [...] as const satisfies readonly Symbol[]`. [L3-L5, L12-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | weightsToArray hand-maps fields in a fixed order that must match SYMBOLS, which risks silent misalignment. Five identical per-reel entries are repeated by hand instead of Array.from. The magic number 3 (rows) is hardcoded. [L17-L29, L45] |

### Suggestions

- Replace the hand-written config type with Record<Symbol, number> and derive the weights from SYMBOLS so the order cannot drift.
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; LEMON: number; ... }
  function weightsToArray(cfg: ReelWeightConfig): number[] { return [cfg.CHERRY, ...]; }
  // After
  type ReelWeightConfig = Readonly<Record<Symbol, number>>;
  const weightsToArray = (cfg: ReelWeightConfig): readonly number[] => SYMBOLS.map((s) => cfg[s]);
  ```
- Inject the RNG and avoid exposing mutable internals.
  ```typescript
  // Before
  const r = Math.random() * total;
  ...
  export function getReelSymbols(): Symbol[] { return SYMBOLS; }
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol { const r = rng() * total; ... }
  export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
  ```
- Validate reelIndex and build the reel weights with Array.from.
  ```typescript
  // Before
  const weights = REEL_WEIGHTS[reelIndex];
  // After
  const weights = REEL_WEIGHTS[reelIndex];
  if (!weights) throw new RangeError(`Invalid reel index: ${reelIndex}`);
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
