# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 85% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used by spinReel (via pickFromWeighted) and returned by getReelSymbols.
- **Duplication [UNIQUE]**: Reel symbol list constant; no similar candidate found.
- **Correction [OK]**: Symbol list is consistent with ReelWeightConfig and weightsToArray ordering.
- **Overengineering [LEAN]**: Simple constant list of symbols.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as the type of DEFAULT_WEIGHTS and the weightsToArray parameter.
- **Duplication [UNIQUE]**: Domain-specific interface for per-symbol weights; no similar type found.
- **Correction [OK]**: Type declaration only. Its keys cover all eight symbols.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: Default weight constants specific to this reel config; no similar candidate found.
- **Correction [OK]**: No documented RTP or weight contract is provided, so the unusual DIAMOND weight (30) cannot be called wrong.
- **Overengineering [ACCEPTABLE]**: Named weights are readable, but the config-object layer exists only to be flattened into an array.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called to build each REEL_WEIGHTS entry.
- **Duplication [UNIQUE]**: No similar functions found. Converts a config object to an ordered weight array.
- **Correction [OK]**: Array order matches SYMBOLS order (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER).
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Read by spinReel and getReelWeights.
- **Duplication [UNIQUE]**: Per-reel weight table built from defaults; no similar candidate found.
- **Correction [OK]**: Five reels, each with its own weights array. weightsToArray returns a new array per call, so the reels do not share state.
- **Overengineering [ACCEPTABLE]**: Per-reel weights allow tuning per reel, but all five entries are identical, so it is speculative flexibility. Could be Array.from({length:5}, ...). Consumers use getReelWeights per reel.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel for each row.
- **Duplication [DUPLICATE]**: Same algorithm as weightedPick: sum weights, roll Math.random() * total, accumulate until roll < cumulative, fall back to last item. Only differences are variable names and the Symbol-specific type versus a generic T. The Symbol version is interchangeable with weightedPick<Symbol>.
- **Correction [OK]**: Cumulative-weight selection with `r < acc` is correct. The final return only covers floating-point edge cases. Math.random is a best-practices matter, not a correctness bug.
- **Overengineering [LEAN]**: Standard weighted random pick; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — Near-identical logic (score 0.827). Both do cumulative-weight random selection with a last-item fallback. The only difference is the generic T versus Symbol.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found. Builds a 3-row column by weighted picks for a given reel index.
- **Correction [OK]**: Builds a 3-row column from the reel's weights. No in-tree caller is shown passing an out-of-range reelIndex.
- **Overengineering [LEAN]**: Straightforward loop generating three symbols for the reel.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial getter returning the module's SYMBOLS constant.
- **Correction [OK]**: Returns the symbol list. Exposing the internal array is only a hypothetical misuse risk.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial getter returning weights for a reel index.
- **Correction [OK]**: Returns the weights for the given reel. Exposing the internal array is only a hypothetical misuse risk.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig hand-lists every symbol key. Record<Symbol, number> stays in sync with the Symbol union. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS and REEL_WEIGHTS are mutable. getReelSymbols and getReelWeights return the internal arrays, so consumers can mutate module state. Use readonly/as const and return readonly types. [L3-L5, L12-L23, L47-L54] |
| 8 | ESLint compliance | WARN | HIGH | `import type { Symbol }` shadows the global Symbol (no-shadow / no-redeclare / no-shadow-restricted-names risk). Rename to e.g. SlotSymbol. The index-based loop could also be a for-of. [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols and getReelWeights have no JSDoc. [L38-L54] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights do not validate reelIndex. An out-of-range index gives undefined weights, so wts.reduce throws an opaque TypeError, and getReelWeights returns undefined typed as number[]. [L38-L44, L51-L53] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reels, paylines, jackpot, scatter and wild vocabulary and from the jackpot.ts, freespin.ts and paytable.ts filenames. Math.random() is not a certifiable RNG for regulated gaming. It is predictable and not cryptographically secure. Use crypto.randomInt or crypto.getRandomValues, with rejection sampling to avoid bias. An rng.ts module already exists in the project. [L28] |
| 15 | Testability | WARN | MEDIUM | Math.random is hardcoded and the weights are module-global. Neither can be injected, so deterministic tests are not possible. Inject an rng function parameter. [L26-L36, L38-L45] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and the weights could use `as const` / `satisfies Record<Symbol, number>`. [L3-L5, L12-L15] |

### Suggestions

- Replace Math.random with a CSPRNG-backed, injectable RNG
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { randomInt } from "node:crypto";
  const r = randomInt(0, total); // integer weights; or inject rng: (max: number) => number
  ```
- Use Record and readonly for weights and symbols, and avoid shadowing global Symbol
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; /* ... */ }
  const SYMBOLS: Symbol[] = [...];
  // After
  type ReelWeightConfig = Readonly<Record<SlotSymbol, number>>;
  const SYMBOLS = ["CHERRY", /* ... */] as const satisfies readonly SlotSymbol[];
  ```
- Validate reelIndex
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
