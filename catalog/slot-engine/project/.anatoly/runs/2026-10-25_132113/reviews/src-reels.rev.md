# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 82% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 92% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 82% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by spinReel and getReelSymbols; the latter is imported by src/engine.ts.
- **Duplication [UNIQUE]**: Slot symbol list constant; no similar constant found.
- **Correction [OK]**: Symbol order matches weightsToArray order.
- **Overengineering [LEAN]**: Plain constant list of symbols.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS and the weightsToArray parameter.
- **Duplication [UNIQUE]**: Domain-specific weight config interface; no similar type found.
- **Correction [OK]**: Type declaration only; no defect.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when REEL_WEIGHTS is built.
- **Duplication [UNIQUE]**: Default reel weight values; no similar constant found.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 is the highest of all symbols, so the premium symbol is the most common. The paytable is not shown, so this rests on slot-machine convention.
- **Overengineering [ACCEPTABLE]**: Named weights object is readable, but the indirection through a config object and then array conversion is extra; ordering is coupled to SYMBOLS. (deliberated: confirmed — src/reels.ts:12-15 gives DIAMOND weight 30, the highest of all symbols (total weight 120, so p=0.25 per cell). The paytable is visible in src/paytable.ts:11: DIAMOND is the top-paying symbol (50/250/1000). The evaluator's 'paytable not shown' caveat is resolved, and DIAMOND really is the premium symbol. The jackpot rule at src/jackpot.ts:10 is `diamondCount >= 4` over 15 cells (5 reels x 3 rows via src/factories.ts:11-12 and src/reels.ts:46). With p=0.25, the expected count is 3.75 per spin, so P(≥4) is about 54%. The 'progressive jackpot' would fire on more than half of all spins, and the most common symbol also pays the most. This is a real defect with heavy effect on RTP.)
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found.
- **Correction [OK]**: Array order matches SYMBOLS order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Read by spinReel and getReelWeights, both imported elsewhere.
- **Duplication [UNIQUE]**: Per-reel weights table built from defaults; no similar constant found.
- **Correction [OK]**: Five independent arrays built from the defaults; no defect.
- **Overengineering [ACCEPTABLE]**: Per-reel weights are identical, so five repeated calls are redundant (Array.from would do), but per-reel structure is a plausible extension point and consumed externally.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel for each row.
- **Duplication [DUPLICATE]**: Same algorithm as weightedPick: sum weights, random roll, cumulative scan, fall back to last item. Differs only in the Symbol type versus a generic T. weightedPick covers it.
- **Correction [OK]**: Standard cumulative weighted pick. The `r < acc` comparison is correct, and the fallback only covers floating-point edge cases.
- **Overengineering [LEAN]**: Standard weighted random selection; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — Near-identical logic; weightedPick is the generic version of pickFromWeighted

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: Builds a 3-row column from reel weights; no similar function found.
- **Correction [OK]**: Builds a 3-row column from the reel's weights. No in-tree caller is shown passing an out-of-range index.
- **Overengineering [LEAN]**: Straightforward: picks three symbols for a column.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor for SYMBOLS.
- **Correction [OK]**: Returns the symbol list; no defect.
- **Overengineering [LEAN]**: Simple accessor, used by engine.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed by spin.
- **Duplication [UNIQUE]**: Trivial accessor for REEL_WEIGHTS by index.
- **Correction [OK]**: Returns the weights array for the reel; no concrete misuse is visible.
- **Overengineering [LEAN]**: Simple accessor, used by engine.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig hand-lists every symbol key. Record<Symbol, number> derives it from the Symbol union. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS and REEL_WEIGHTS are mutable. getReelSymbols and getReelWeights return the internal arrays directly, so callers can mutate the module's RNG tables. Nothing uses readonly or as const. [L3-L28, L50-L56] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols and getReelWeights have no JSDoc. [L40-L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights do not validate reelIndex. An out-of-range index yields undefined weights, and wts.reduce then throws an opaque TypeError. [L40-L47] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reels, symbols, SCATTER, WILD, DIAMOND and the spin/jackpot/paytable modules. Math.random() is not certifiable for regulated gaming RNG. pickFromWeighted uses it directly, bypassing the project's own rng.ts, which engine.ts resolves from the container. [L32] |
| 15 | Testability | FAIL | MEDIUM | Math.random is hard-wired, and weights are module-level state. No exported function accepts an RNG or weight table, and the pure weighted-pick core is not exported. Deterministic tests are impossible. [L29-L47] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS could use `as const satisfies readonly Symbol[]`. DEFAULT_WEIGHTS could use satisfies. [L3-L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | weightsToArray must list keys in the same order as SYMBOLS, so the two can silently drift apart. The five identical reel weight rows are copy-pasted instead of built with Array.from. The row count (3) and reel count (5) are magic numbers. [L15-L28, L42] |

### Suggestions

- Inject the RNG, and reuse the project's rng.ts instead of Math.random
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rand: () => number): Symbol {
    const r = rand() * total;
  ```
- Derive weights from the symbol list and freeze the tables
  ```typescript
  // Before
  interface ReelWeightConfig { CHERRY: number; ... }
  const SYMBOLS: Symbol[] = [...];
  // After
  const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const satisfies readonly Symbol[];
  const DEFAULT_WEIGHTS: Readonly<Record<Symbol, number>> = {...};
  const weightsToArray = (cfg: Readonly<Record<Symbol, number>>) => SYMBOLS.map(s => cfg[s]);
  ```
- Validate reelIndex and return read-only views
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  /** Returns the weight table for a reel. @throws RangeError if reelIndex is out of range. */
  export function getReelWeights(reelIndex: number): readonly number[] {
    const w = REEL_WEIGHTS[reelIndex];
    if (!w) throw new RangeError(`Invalid reel index: ${reelIndex}`);
    return w;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Check the DIAMOND weight (30) in DEFAULT_WEIGHTS against the paytable and the target RTP. Lower it to a rare-symbol value if it is not intended. [L14]

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
