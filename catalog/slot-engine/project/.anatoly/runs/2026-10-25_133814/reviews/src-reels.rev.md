# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 93% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 80% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 82% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in spinReel and getReelSymbols; both are imported by other files.
- **Duplication [UNIQUE]**: Reel symbol list constant; no similar symbol found.
- **Correction [OK]**: Symbol list is consistent with the weight array order (CHERRY..SCATTER).
- **Overengineering [LEAN]**: Simple symbol list constant.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type of DEFAULT_WEIGHTS and weightsToArray parameter.
- **Duplication [UNIQUE]**: Interface of per-symbol weights; no similar type found.
- **Correction [OK]**: Plain interface; no defects.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when building REEL_WEIGHTS.
- **Duplication [UNIQUE]**: Default weight config constant; no similar symbol found.
- **Correction [OK]**: DIAMOND=30 is unusually high, but no documented RTP or contract is provided to show it is wrong.
- **Overengineering [ACCEPTABLE]**: Named weights are readable, but the object form is an extra layer over a positional array. Minor.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found; converts config object to ordered array.
- **Correction [OK]**: Array order matches SYMBOLS order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced by spinReel and getReelWeights, both imported elsewhere.
- **Duplication [UNIQUE]**: Per-reel weight table built from defaults; no similar symbol found.
- **Correction [OK]**: Five reels, each with its own array from weightsToArray; arrays are not shared between reels.
- **Overengineering [OVER]**: Five identical per-reel weight arrays built by repeated calls. Per-reel configuration is not used, so Array.from({length:5}, ...) or a single shared array would be simpler. Per-reel indexing is speculative generality.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel for each row; spinReel is imported by src/factories.ts.
- **Duplication [DUPLICATE]**: Line-for-line identical to generic weightedPick in src/rng.ts: sum weights, random roll, cumulative scan, fallback to last item. Only differences are variable names and the Symbol-specific typing.
- **Correction [OK]**: Cumulative-weight selection is correct. The `r < acc` check gives each item the right probability, and the last-item fallback only guards against floating-point edge cases.
- **Overengineering [LEAN]**: Standard weighted random selection. No library is needed for this.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~100% identical logic — weighted random selection via cumulative weights; pickFromWeighted is a Symbol-typed specialization of generic weightedPick

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found; builds a 3-row column by weighted picks for a reel.
- **Correction [OK]**: Builds a 3-row column from the reel's weights. No in-tree caller passes an out-of-range index.
- **Overengineering [LEAN]**: Straightforward loop that picks 3 symbols for a reel.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor returning the module's SYMBOLS constant.
- **Correction [OK]**: Returns the symbol list; no defect.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor returning weights for a reel index.
- **Correction [OK]**: Returns the weights for the given reel; no concrete misuse is visible.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig hand-lists the 8 symbol keys, duplicating the Symbol union. `Record<Symbol, number>` keeps them in sync. weightsToArray hard-codes key order, which must match SYMBOLS. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | `getReelSymbols` and `getReelWeights` return the shared mutable module-level `SYMBOLS` and `REEL_WEIGHTS` entries. Any caller can mutate them in place and corrupt every later spin. `SYMBOLS`, `DEFAULT_WEIGHTS` and `REEL_WEIGHTS` are also not readonly. [L3-L5, L18-L24, L47-L53] |
| 8 | ESLint compliance | WARN | HIGH | `Symbol` is imported and shadows the global `Symbol`, which triggers no-shadow and no-redeclare rules in typical configs. The index-based loop could be `for...of`. Both are minor. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | No JSDoc on any export. `spinReel` has a non-obvious contract: it returns 3 rows, its randomness source is Math.random, and an out-of-range `reelIndex` throws a TypeError. `getReelWeights` shares internal state, and neither fact is documented. [L38-L52] |
| 13 | Security | FAIL | CRITICAL | Slot machine and casino domain inferred from the reels, paylines, jackpot and SCATTER/WILD vocabulary, and from the sibling `rng.ts`, `jackpot.ts` and `paytable.ts` files. Rule: `Math.random()` is not certifiable for regulated gaming RNG. `pickFromWeighted` uses it to choose symbols. Use a CSPRNG such as `crypto.randomInt`, or the project's rng module. [L28-L29] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` is hard-wired to `Math.random`, so spins cannot be made deterministic. The rule-13 FAIL covers the same line, so this stays a WARN. An injectable RNG parameter would fix both. [L26-L38] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` and `as const` could define the symbols and weights. `SYMBOLS` could be derived from a const tuple, so the Symbol union and the list stay in sync. [L3-L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | `REEL_WEIGHTS` repeats the same call five times, and a magic 3 row count is hard-coded. The reel count is implicit. [L18-L24, L42] |

### Suggestions

- Use a CSPRNG instead of Math.random and inject it for testability
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { randomInt } from "node:crypto";
  const r = randomInt(0, total * 1000) / 1000;
  ```
- Derive the config type from the Symbol union and freeze shared data
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; ... }
  const SYMBOLS: Symbol[] = [...];
  // After
  type ReelWeightConfig = Readonly<Record<Symbol, number>>;
  const SYMBOLS: readonly Symbol[] = [...] as const;
  ```
- Return readonly views of shared state
  - Before: `export function getReelSymbols(): Symbol[] { return SYMBOLS; }`
  - After: `export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }`
- Build REEL_WEIGHTS without repetition
  - Before: `const REEL_WEIGHTS: number[][] = [weightsToArray(DEFAULT_WEIGHTS), ...];`
  - After: `const REEL_WEIGHTS: readonly (readonly number[])[] = Array.from({ length: 5 }, () => weightsToArray(DEFAULT_WEIGHTS));`

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
