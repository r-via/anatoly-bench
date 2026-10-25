# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 85% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 93% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by spinReel and getReelSymbols, both consumed externally.
- **Duplication [UNIQUE]**: Slot symbol list constant; no similar candidate found.
- **Correction [OK]**: Symbol list is index-aligned with the weight arrays from weightsToArray (same 8 entries, same order).
- **Overengineering [LEAN]**: Simple symbol list; needed for weighted picking and exposed via getReelSymbols.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type of DEFAULT_WEIGHTS and weightsToArray parameter.
- **Duplication [UNIQUE]**: Interface specific to reel weights per symbol; no similar candidate.
- **Correction [OK]**: Type declaration is correct.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: Default weight constants for this reel config; no similar candidate.
- **Correction [OK]**: Weights sum to 120 and the type is satisfied. No documented RTP target or paytable is provided, so the large DIAMOND weight (30) cannot be shown to be wrong.
- **Overengineering [ACCEPTABLE]**: Single weights table is reasonable. The named-field config form is more than needed, but the data itself is fine.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called to build each REEL_WEIGHTS entry.
- **Duplication [UNIQUE]**: Converts config object to ordered array; no similar functions found.
- **Correction [OK]**: Field order matches the SYMBOLS order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Read by spinReel and getReelWeights, both imported elsewhere.
- **Duplication [UNIQUE]**: Per-reel weights table built from defaults; no similar candidate.
- **Correction [OK]**: Builds 5 independent weight arrays, one per reel. weightsToArray returns a fresh array on each call.
- **Overengineering [OVER]**: Five identical copies of the same weights, built through the config indirection. Per-reel weights are not used. Array.from({length:5}, ...) or a single shared array would be simpler. It is a small speculative per-reel extension point.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel for each row.
- **Duplication [DUPLICATE]**: Line-for-line identical algorithm to weightedPick (total weight, random roll, cumulative scan, fallback to last item). Only difference is the generic type vs Symbol, and weightedPick<T> can be used directly.
- **Correction [OK]**: Standard cumulative weighted selection. Math.random() is in [0,1), so r < total and the fallback return is only a safeguard.
- **Overengineering [LEAN]**: Standard weighted random selection loop, minimal. Fallback return guards against float edge cases.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~100% identical logic — weighted random selection via cumulative sum with last-item fallback

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: Builds a 3-row column by weighted picks for a given reel; no similar functions found.
- **Correction [OK]**: Returns 3 weighted symbols per reel. No visible caller passes an out-of-range reelIndex.
- **Overengineering [LEAN]**: Straightforward generation of a 3-row column.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported and consumed by spin in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor returning SYMBOLS.
- **Correction [OK]**: Returns the symbol list. Returning the internal array is not a defect without a visible mutating caller.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported and consumed by spin in src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor returning weights for a reel index.
- **Correction [OK]**: Returns the weights for a reel. The array is index-aligned with SYMBOLS.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig hand-lists every symbol key. Record<Symbol, number> would stay in sync with the Symbol union. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS and REEL_WEIGHTS are mutable module state. getReelSymbols and getReelWeights return the internal arrays, so callers can mutate game odds. [L3-L5, L22-L28, L50-L56] |
| 8 | ESLint compliance | WARN | HIGH | The type import named Symbol shadows the global built-in Symbol (no-shadow with builtinGlobals, @typescript-eslint/no-redeclare). Rename it, e.g. ReelSymbol. [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols and getReelWeights have no JSDoc. [L41-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights do not bounds-check reelIndex. An out-of-range index gives weights undefined, so pickFromWeighted throws an unhelpful TypeError on wts.reduce. getReelWeights returns undefined despite its number[] type. [L41-L56] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel, payline, jackpot and SCATTER/WILD vocabulary. Math.random() is not a certifiable RNG for regulated gaming and is predictable and non-auditable. It also bypasses the project's rng.ts module, which engine.ts resolves from its container. [L32] |
| 15 | Testability | WARN | MEDIUM | Math.random is hard-coded and module-level weights are fixed. The random source and weights cannot be injected, so the code can't be tested deterministically. [L30-L43] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and the weight tables could use `as const satisfies` for stronger typing and readonly tuples. [L3-L5, L12-L15] |

### Suggestions

- Use an injectable, cryptographically secure RNG instead of Math.random (reuse rng.ts)
  - Before: `const r = Math.random() * total;`
  - After: `const r = rng.nextFloat() * total; // rng injected, CSPRNG-backed`
- Replace the hand-written config interface with Record and make the data readonly
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; ... }
  const SYMBOLS: Symbol[] = [...]
  // After
  type ReelWeightConfig = Readonly<Record<ReelSymbol, number>>;
  const SYMBOLS = ["CHERRY", ...] as const satisfies readonly ReelSymbol[];
  ```
- Validate reelIndex and avoid leaking internal arrays
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    const w = REEL_WEIGHTS[reelIndex];
    if (!w) throw new RangeError(`Invalid reel index: ${reelIndex}`);
    return w;
  }
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
