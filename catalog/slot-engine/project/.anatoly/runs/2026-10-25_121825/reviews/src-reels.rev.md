# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 88% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 75% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by pickFromWeighted (via spinReel) and getReelSymbols, both exported and consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: 8 symbols correctly defined; order matches the weight array produced by weightsToArray.
- **Overengineering [LEAN]**: Simple typed array of all slot symbols.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS and weightsToArray parameter, both locally active.
- **Duplication [UNIQUE]**: No similar type found in the codebase.
- **Correction [OK]**: Interface fields map 1-to-1 with SYMBOLS array entries in the same order.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times to populate REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Internally consistent weight values; no documented RTP target is provided in context to validate against via rule 12.
- **Overengineering [LEAN]**: Plain config object; complexity is in the interface it satisfies, not the constant itself.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times to build REEL_WEIGHTS array, which feeds spinReel and getReelWeights.
- **Duplication [UNIQUE]**: No similar function found in the codebase.
- **Correction [OK]**: Return order [CHERRY,LEMON,BELL,BAR,SEVEN,DIAMOND,WILD,SCATTER] exactly matches SYMBOLS array order, preserving index alignment.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced by spinReel and getReelWeights, both consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Each call to weightsToArray produces a distinct array copy; five independent reel weight arrays are correctly initialized.
- **Overengineering [ACCEPTABLE]**: Repeating weightsToArray(DEFAULT_WEIGHTS) five times is slightly verbose (could use Array.from({length:5})), but all five reels differ only in index, so explicit expansion is readable. The real complexity comes from upstream abstractions.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel, which is runtime-imported by src/factories.ts.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both compute total weight via reduce, roll Math.random() * total, accumulate weights in a loop, return items[i] on first hit, and fall back to the last item. The only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol — making them interchangeable for Symbol arrays.
- **Correction [OK]**: Standard weighted-random selection; Math.random() returns [0,1) so r is always in [0,total), guaranteeing the loop finds a match before exhaustion. Fallback is unreachable but harmless.
- **Overengineering [LEAN]**: Textbook O(n) weighted random selection — minimal and correct.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted random selection algorithm, same fallback, same structure; only variable names and generic vs concrete type differ

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found in the codebase.
- **Correction [OK]**: Correctly spins 3 rows per reel using per-reel weights. Out-of-bounds reelIndex would crash, but no concrete misuse is visible in the static caller graph (src/factories.ts).
- **Overengineering [LEAN]**: Straightforward: look up weights, fill 3-row column, return it.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts, consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns direct SYMBOLS reference; no concrete in-tree consumer shown to mutate it.
- **Overengineering [LEAN]**: Simple accessor needed by engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts, consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns direct weight array reference for the given reel index. No concrete out-of-bounds caller visible in the static graph.
- **Overengineering [LEAN]**: Simple accessor needed by engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually duplicates every symbol name from the SYMBOLS array. Record<Symbol, number> would be more concise, keep symbol changes in one place, and leverage the existing Symbol union type. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. SYMBOLS should be ReadonlyArray<Symbol> or Symbol[] & { readonly [n: number]: Symbol }; DEFAULT_WEIGHTS should be Readonly<ReelWeightConfig>; REEL_WEIGHTS should be ReadonlyArray<ReadonlyArray<number>>. getReelWeights and getReelSymbols return live mutable references to internal state. [L3-L29] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. At minimum, spinReel should document the valid range of reelIndex and the 3-element return contract. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights access REEL_WEIGHTS[reelIndex] without bounds-checking. REEL_WEIGHTS has 5 entries (indices 0–4); any caller passing reelIndex >= 5 or negative silently receives undefined, causing a runtime TypeError when .reduce() or .push() is called. No thrown error, no guard. [L43-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, WILD, SCATTER, JACKPOT), project path (slot-engine), and sibling files (freespin.ts, jackpot.ts, paytable.ts, wild.ts). Math.random() is a non-seeded, non-cryptographic PRNG that does not meet regulatory requirements for certified gaming RNG (e.g., GLI, BMM, iTech standards). The project already contains src/rng.ts, indicating a dedicated RNG module exists — yet pickFromWeighted calls Math.random() directly, bypassing it entirely. In regulated gambling contexts this is a critical compliance failure. [L35] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded inside pickFromWeighted with no injection point. Deterministic unit tests for spinReel require mocking the global, which is brittle. An injected RNG function parameter (already available from rng.ts) would allow pure-function testing. [L33-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use the satisfies operator (DEFAULT_WEIGHTS = { ... } satisfies ReelWeightConfig) to validate shape while preserving literal types. SYMBOLS could use as const to lock the tuple type and enable symbol-indexed narrowing downstream. [L3-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelSymbols() and getReelWeights() return live references to internal module-level arrays. In a gaming engine, callers mutating SYMBOLS or REEL_WEIGHTS[i] would silently alter future spin probabilities without any audit trail. Both functions should return defensive copies or be typed as ReadonlyArray. [L52-L58] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay in sync with the Symbol union and enable exhaustiveness checking.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  ```
- Inject an RNG function instead of calling Math.random() directly — use the project's existing rng.ts — to satisfy both regulatory requirements and testability.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
    ...
  // After
  import { nextFloat } from "./rng.js";
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng = nextFloat): Symbol {
    const r = rng() * total;
    ...
  ```
- Add a bounds guard in spinReel and getReelWeights to fail loudly on invalid reelIndex.
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
- Return defensive copies from getReelSymbols and getReelWeights to prevent external mutation of internal state.
  ```typescript
  // Before
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelSymbols(): readonly Symbol[] {
    return SYMBOLS;
  }
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
