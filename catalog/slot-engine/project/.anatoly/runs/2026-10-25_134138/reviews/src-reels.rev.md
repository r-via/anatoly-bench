# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 93% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 80% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 88% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 82% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 93% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by spinReel and getReelSymbols, which are imported elsewhere.
- **Duplication [UNIQUE]**: Reel-specific symbol list constant; no similar constant found.
- **Correction [OK]**: Order matches weightsToArray's index order.
- **Overengineering [LEAN]**: Simple symbol list constant.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as the type of DEFAULT_WEIGHTS and the parameter of weightsToArray.
- **Duplication [UNIQUE]**: Domain-specific interface for per-symbol weights; no similar type found.
- **Correction [OK]**: Type declaration only. No defect.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when building REEL_WEIGHTS.
- **Duplication [UNIQUE]**: Domain-specific default weight config; no similar constant found.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 is the highest of all symbols, breaking the descending-rarity pattern (CHERRY 25, LEMON 25, BELL 15, BAR 10, SEVEN 5). The symbol list is ordered by ascending value, so DIAMOND should be rare. Forward: P(DIAMOND) = 30/120 = 0.25 per cell, so a 3-of-a-kind line is about 1.6% per payline at 5 reels. That is likely an RTP overshoot if the paytable pays premium for DIAMOND. No explicit contract is visible, so confidence is limited.
- **Overengineering [ACCEPTABLE]**: Named weights are readable, but the object-to-array indirection is unnecessary; a plain array or Record would do. (deliberated: confirmed — Confirmed, with higher confidence. src/reels.ts:12-15 gives DIAMOND weight 30 of 120 total (p=0.25). That is the highest weight on the reel, yet DIAMOND is the top-paying symbol (src/paytable.ts:11: 50/250/1000) and the jackpot trigger (src/jackpot.ts:10 fires at 4 or more DIAMONDs among 15 cells). Binomial(15, 0.25) gives P(≥4) = 0.539, so the 'progressive jackpot' would hit on about 54% of spins. The DIAMOND line wins alone also push RTP far above the documented 95%. The same weights are used on all 5 reels (L22-28), so every spin is affected.)
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called to build each REEL_WEIGHTS entry.
- **Duplication [UNIQUE]**: No similar functions found. Converts the weight config to an ordered array.
- **Correction [OK]**: Element order matches SYMBOLS.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Read by spinReel and getReelWeights, which are imported elsewhere.
- **Duplication [UNIQUE]**: Per-reel weights table built from the defaults; no similar constant found.
- **Correction [OK]**: Five independent arrays, one per reel.
- **Overengineering [ACCEPTABLE]**: Per-reel weights are plausible for slot design, but all five reels are identical and built by repeated calls. Array.from({length:5}, ...) would be simpler. Per-reel structure is justified by getReelWeights and likely future tuning.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel for each row.
- **Duplication [DUPLICATE]**: Line-for-line the same algorithm as weightedPick: sum the weights, roll Math.random() * total, scan the cumulative sum, fall back to the last item. The only difference is that it takes Symbol[] instead of a generic T[]. weightedPick<T> can be called directly with the same arguments.
- **Correction [OK]**: Standard cumulative weighted pick. r is in [0, total) and the fallback is only reached on floating-point edge cases.
- **Overengineering [LEAN]**: Standard weighted random selection, minimal and correct.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~100% identical logic: cumulative-weight random selection, fallback to last item; the generic version covers the Symbol-specific one

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found. Builds a 3-row column from the reel's weights.
- **Correction [OK]**: Builds a 3-row column from the reel's weights. No concrete out-of-range caller is visible.
- **Overengineering [LEAN]**: Straightforward: picks 3 weighted symbols per reel.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor for the module-level SYMBOLS constant.
- **Correction [OK]**: Returns the symbol list. No defect.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor for the per-reel weights.
- **Correction [OK]**: Returns the weights for the given reel. Returning the internal array is not a concrete defect.
- **Overengineering [LEAN]**: Trivial accessor with a live consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig hand-lists every Symbol key. Record<Symbol, number> would derive the keys from the union and remove the manual ordering in weightsToArray. [L5-L18] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS and REEL_WEIGHTS are mutable. getReelSymbols and getReelWeights return the internal mutable arrays, so callers can alter reel state. Nothing is mutated in place in this file. [L3-L33, L51-L57] |
| 8 | ESLint compliance | WARN | HIGH | The imported type Symbol shadows the global Symbol. This can trip no-shadow with builtinGlobals and hurts readability. Rename it, for example ReelSymbol. [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | No JSDoc on any export. The valid reelIndex range (0-4), the 3-row column size and the aliasing of the returned arrays are undocumented. [L38-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reels, symbols, weights, paytable, jackpot and free-spin vocabulary. Math.random() is not certifiable for regulated gaming RNG. The reel outcome comes from a non-cryptographic, non-auditable PRNG, and the project already has rng.ts. [L31] |
| 15 | Testability | WARN | MEDIUM | The RNG is hard-wired (see rule 13), so spins cannot be made deterministic. Inject an rng function or reuse rng.ts. The weighted-pick logic is otherwise a pure core. [L28-L38] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use `satisfies Record<Symbol, number>` with `as const`. SYMBOLS could be a readonly tuple. [L3-L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | reelIndex is unchecked. An out-of-range index gives undefined weights, and pickFromWeighted then throws a TypeError on wts.reduce. The per-reel weight tables are identical copies, and the weights, including DIAMOND at 30, are hard-coded. [L21-L26, L28-L38] |

### Suggestions

- Use the project's injectable RNG instead of Math.random (regulated gaming).
  - Before: `const r = Math.random() * total;`
  - After: `const r = rng.nextFloat() * total; // injected from ./rng.js, certified/CSPRNG-backed`
- Derive the weights type from the symbol union and make the data readonly.
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; ... }
  const SYMBOLS: Symbol[] = [...]
  // After
  type ReelWeightConfig = Readonly<Record<ReelSymbol, number>>;
  const SYMBOLS = [...] as const satisfies readonly ReelSymbol[];
  ```
- Return read-only views and validate reelIndex.
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

### Quick Wins

- **[correction · medium · small]** Check DIAMOND weight (30) against the paytable and the documented RTP target. It is likely meant to be a rare premium weight (low single digits to about 5). [L14]

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
