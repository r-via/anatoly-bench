# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 75% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 85% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in spinReel and getReelSymbols.
- **Duplication [UNIQUE]**: Slot symbol list constant; no similar symbol found.
- **Correction [OK]**: Symbol list matches the weight array order (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER).
- **Overengineering [LEAN]**: Plain symbol list; needed for weighted picking and consumed externally.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type used for DEFAULT_WEIGHTS and weightsToArray parameter.
- **Duplication [UNIQUE]**: Interface of per-symbol weights; no similar type found.
- **Correction [OK]**: Type is well-formed.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray in REEL_WEIGHTS initialization.
- **Duplication [UNIQUE]**: Default weight constant specific to this reel config; no similar symbol found.
- **Correction [OK]**: DIAMOND at 30 is the heaviest weight, which is unusual for a premium symbol. No paytable, doc, or RTP target is shown to contradict it, so there is no contract to check it against.
- **Overengineering [ACCEPTABLE]**: Single named weight table is reasonable; the object form only exists to feed weightsToArray, adding an indirection.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found. Maps config object to ordered array.
- **Correction [OK]**: Field order matches SYMBOLS order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced in spinReel and getReelWeights.
- **Duplication [UNIQUE]**: Per-reel weights table built from defaults; no similar symbol found.
- **Correction [OK]**: Builds five independent weight arrays, one per reel.
- **Overengineering [ACCEPTABLE]**: Per-reel weights are plausible slot-machine design, but all five reels are identical. The repeated calls could be Array.from({length:5}, ...). Mild speculative generality.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel for each row.
- **Duplication [DUPLICATE]**: Same algorithm as weightedPick: sum weights, Math.random() * total, cumulative scan with r < acc, fallback to last item. Only differences are variable names and the generic type parameter (this one is fixed to Symbol); weightedPick<T> can replace it directly.
- **Correction [OK]**: Standard cumulative-weight selection. Math.random() is in [0,1), and the fallback to the last item is only a safety net. The RNG choice is a best-practices matter, not correctness.
- **Overengineering [LEAN]**: Standard weighted random selection; minimal and appropriate. The fallback return guards against floating-point edge cases.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~100% identical logic: weighted random selection by cumulative-weight scan with last-item fallback

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: Builds a 3-row column from reel weights; no similar function found.
- **Correction [OK]**: Returns 3 weighted picks per reel. No caller is shown passing an out-of-range reelIndex.
- **Overengineering [LEAN]**: Simple loop that builds a 3-row column from weighted picks.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported and consumed by spin in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor returning module-level SYMBOLS; no similar function found.
- **Correction [OK]**: Returns the internal array. This is only a hypothetical mutation risk, and no consumer mutates it.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported and consumed by spin in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor returning weights for a reel index; no similar function found.
- **Correction [OK]**: Returns the weight array for the given reel. No in-tree misuse is visible.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig repeats each key manually; Record<Symbol, number> would derive it from the Symbol union. [L5-L12] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS and REEL_WEIGHTS are mutable. getReelSymbols and getReelWeights return the internal mutable arrays, so callers can corrupt shared reel state. Use readonly/as const/ReadonlyArray. [L3-L25, L49-L57] |
| 8 | ESLint compliance | WARN | HIGH | The local type `Symbol` shadows the global `Symbol` builtin (no-shadow/no-redeclare on globals). Weights are positionally coupled to SYMBOLS by a hand-written array order. Missing bounds check on `reelIndex` under noUncheckedIndexedAccess. This file only imports the type, so the naming is owned by types.ts. [L1, L18-L22] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols and getReelWeights are exported with no JSDoc. [L42-L57] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | spinReel(reelIndex) does not validate the index. An out-of-range index gives `weights` undefined, and pickFromWeighted then throws a TypeError on `wts.reduce`. getReelWeights returns undefined for such an index, contrary to its number[] type. No explicit guard or descriptive Error. [L42-L46, L53-L55] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain inferred from reels, paylines, jackpot and SCATTER/WILD vocabulary. Math.random() is not certifiable for regulated gaming RNG. It is not a CSPRNG and is predictable. The project has an rng.ts, which this file bypasses. Use crypto.randomInt or an injected certified RNG. [L32] |
| 14 | Performance | WARN | MEDIUM | The weight total is recomputed via reduce on every pick (3 times per reel) even though the weights are static. Precompute cumulative weights once. [L28-L31] |
| 15 | Testability | WARN | MEDIUM | Math.random is hard-wired with no injection point. pickFromWeighted is pure apart from the RNG call but is not exported or parameterized by an RNG. [L28-L38] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use `satisfies Record<Symbol, number>`; SYMBOLS could use `as const satisfies readonly Symbol[]`. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | The five identical REEL_WEIGHTS entries are hand-copied rather than built with Array.from. The row count 3 is a magic number. DIAMOND at weight 30 is the highest, which is unusual for a premium symbol. That is a configuration or correctness concern, not a best-practices one. [L21-L27, L44] |

### Suggestions

- Derive the weight config from the Symbol union and make the data readonly
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; LEMON: number; ... }
  const SYMBOLS: Symbol[] = [...];
  // After
  type ReelWeightConfig = Readonly<Record<Symbol, number>>;
  const SYMBOLS = ["CHERRY","LEMON","BELL","BAR","SEVEN","DIAMOND","WILD","SCATTER"] as const satisfies readonly Symbol[];
  ```
- Use a certified or injected RNG instead of Math.random
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { randomInt } from "node:crypto";
  const r = randomInt(0, total);
  ```
- Validate reelIndex and throw an Error
  ```typescript
  // Before
  const weights = REEL_WEIGHTS[reelIndex];
  // After
  const weights = REEL_WEIGHTS[reelIndex];
  if (!weights) throw new RangeError(`Invalid reel index: ${reelIndex}`);
  ```
- Build the per-reel weights with Array.from
  - Before: `const REEL_WEIGHTS: number[][] = [weightsToArray(DEFAULT_WEIGHTS), ... ];`
  - After: `const REEL_WEIGHTS: readonly (readonly number[])[] = Array.from({ length: 5 }, () => weightsToArray(DEFAULT_WEIGHTS));`

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
