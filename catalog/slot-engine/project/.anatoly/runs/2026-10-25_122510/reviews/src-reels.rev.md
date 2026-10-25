# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 80% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 75% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 82% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 93% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used by spinReel and getReelSymbols.
- **Duplication [UNIQUE]**: Domain-specific list of slot symbols; no similar constant found.
- **Correction [OK]**: Symbol list is consistent with the weight array order.
- **Overengineering [LEAN]**: Simple symbol list.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS and weightsToArray parameter.
- **Duplication [UNIQUE]**: Domain-specific weight config interface; no similar type found.
- **Correction [OK]**: Type declaration only. No defect.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: Domain-specific default weights; no similar constant found.
- **Correction [OK]**: DIAMOND=30 is the largest weight, which is unusual. No documented RTP or contract is provided, so it cannot be shown wrong.
- **Overengineering [ACCEPTABLE]**: Named weights are readable, but the indirection through a config object and then an array is unneeded.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found.
- **Correction [OK]**: Field order matches SYMBOLS order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Read by spinReel and getReelWeights.
- **Duplication [UNIQUE]**: Reel-specific weights table; no similar constant found.
- **Correction [OK]**: 5 reels, each with 8 weights aligned with SYMBOLS.
- **Overengineering [ACCEPTABLE]**: Per-reel weights are identical, so the five repeated calls are redundant. Array.from would be shorter. Per-reel structure is plausible for later tuning.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel for each row.
- **Duplication [DUPLICATE]**: Logic is identical to the generic weightedPick: total weight, random roll, cumulative scan, last-item fallback. Only variable names and the Symbol type differ. weightedPick<T> can replace it directly.
- **Correction [OK]**: Standard cumulative weighted pick. The fallback return is correct.
- **Overengineering [LEAN]**: Standard weighted random selection with a fallback return.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~100% identical logic: weighted random selection via cumulative sum, with last-item fallback

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found. It builds a 3-row column of weighted picks for one reel.
- **Correction [OK]**: Returns 3 weighted symbols. No concrete out-of-range call is visible.
- **Overengineering [LEAN]**: Straightforward loop that builds a 3-row column.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts, consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the symbol list. No defect.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts, consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the weights for the given reel. No defect.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig hand-lists keys duplicating the Symbol union; Record<Symbol, number> is cleaner and keeps keys in sync. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS and REEL_WEIGHTS are mutable. getReelSymbols and getReelWeights return the internal mutable arrays, so callers can corrupt shared state. [L3-L5] |
| 8 | ESLint compliance | WARN | HIGH | The import shadows the global `Symbol` (no-shadow, no-redeclare, no-shadow-restricted-names). Both loops are index-based where for-of would do. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols and getReelWeights have no JSDoc. [L41-L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel does not validate reelIndex. An out-of-range index gives undefined weights, so pickFromWeighted throws a TypeError on `wts.reduce`. There is no explicit Error with a clear message. [L41-L48] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain inferred from reels, paylines, jackpot, wild and scatter vocabulary. Math.random() is not certifiable for regulated gaming RNG. Use a CSPRNG such as crypto.randomInt. The project also has rng.ts, which this file bypasses. [L28] |
| 14 | Performance | WARN | MEDIUM | pickFromWeighted recomputes the weight total on every pick, 3 times per reel per spin. Precompute it per reel. [L25-L26] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hard-wired, so the RNG cannot be injected. Tests cannot be deterministic. [L28] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | Could use `as const satisfies readonly Symbol[]` for SYMBOLS and `satisfies` on the weights. [L3-L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | The five REEL_WEIGHTS entries are identical. The magic number 3 (rows) is hard-coded. Weights are positional, so they depend on SYMBOLS order matching weightsToArray. [L19-L23] |

### Suggestions

- Use a CSPRNG instead of Math.random for gaming RNG
  - Before: `const r = Math.random() * total;`
  - After: `const r = (randomInt(0, 2**32) / 2**32) * total; // import { randomInt } from 'node:crypto'`
- Derive weights from Record<Symbol, number> and freeze the exports
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; ... }
  export function getReelSymbols(): Symbol[] { return SYMBOLS; }
  // After
  const DEFAULT_WEIGHTS: Readonly<Record<Symbol, number>> = { ... };
  export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
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
