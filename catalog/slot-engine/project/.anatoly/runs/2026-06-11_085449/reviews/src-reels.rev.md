# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 88% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L49) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Array order matches weightsToArray and docs exactly; no correctness issues.
- **Overengineering [LEAN]**: Plain array of enum-like string literals. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant with no JSDoc. Name is clear but no comment explaining role or valid values.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17).
- **Duplication [UNIQUE]**: No similar interfaces found in RAG results.
- **Correction [OK]**: Interface fields match SYMBOLS order; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface; all fields are symbol names mapped to numeric weights — semantics obvious from names and context.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (P=0.25/cell) makes DIAMOND winning combinations alone contribute ~229% RTP, violating the arbitrated 95% target.
- **Overengineering [LEAN]**: Straightforward data constant; complexity belongs to the type, not the value.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The specific numeric weight values and their probabilistic interpretation are non-obvious and worth documenting.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Field extraction order matches SYMBOLS exactly; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Key logic: maps config fields to a fixed-order array; wrong field order would silently corrupt weights.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, <10 lines, clear name. Tolerated as undocumented per internal-helper leniency rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Five reels with identical DEFAULT_WEIGHTS matches documented configuration.
- **Overengineering [ACCEPTABLE]**: Five identical arrays instead of a shared reference. Docs confirm all reels use the same weights and per-reel customization requires forking the file, so the per-reel array structure is not providing runtime extensibility. Minor overhead but a defensible slot-machine convention.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Shape (5 reels × 8 weights) and the fact that all reels share DEFAULT_WEIGHTS is non-obvious without a comment.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L49).
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both sum total weight, multiply Math.random() by total, accumulate in a loop, and return items[items.length-1] as fallback. Only differences are variable names and that pickFromWeighted is typed to Symbol[] while weightedPick is generic. The two functions are fully interchangeable.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated slot-machine gaming.
- **Overengineering [LEAN]**: Textbook weighted-random implementation. Single responsibility, no unnecessary abstraction.
- **Tests [NONE]**: No test file. Core probabilistic logic with boundary conditions (r exactly at boundary, all-zero weights, single item) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal, not exported, but the weighted-random-sampling algorithm is non-trivial. No JSDoc explaining the contract or edge cases. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is logically identical to weightedPick in src/rng.ts:5-16 (same cumulative-weight scan, same Math.random() * total, same fallback to last element). Duplication is confirmed. However, duplication is not a correctness defect — pickFromWeighted produces correct weighted-random results. No bug, no wrong output, no crash. The correction axis should be OK; the duplication concern belongs on the duplication axis (which was not escalated). Reclassified from NEEDS_FIX to OK.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted random selection algorithm, same fallback, differs only in Symbol-specific typing vs generic T

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Draws 3 independent symbols per reel using the correct weight array; logic is correct.
- **Overengineering [LEAN]**: Minimal loop delegating to pickFromWeighted. Does exactly one thing.
- **Tests [NONE]**: No test file. Imported by src/factories.ts — a critical path. Out-of-bounds reelIndex returns undefined weights silently.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 symbols (one per row), and that sampling is independent per cell.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found.
- **Correction [OK]**: Returns SYMBOLS as documented.
- **Overengineering [LEAN]**: Trivial accessor exposing module-private constant.
- **Tests [NONE]**: No test file. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. A one-line description of the return value and ordering would suffice.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found.
- **Correction [OK]**: Returns the weight array for the requested reel index as documented.
- **Overengineering [LEAN]**: Trivial accessor; matches documented API contract exactly.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; invalid reelIndex returns undefined with no guard.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), description of returned array order, and that weights are read-only at runtime.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually lists all 8 symbol keys. Record<Symbol, number> (where Symbol is the imported union) would be self-maintaining and enforce exhaustiveness when the union grows. [L9-L12] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelWeights returns a live mutable reference to REEL_WEIGHTS[reelIndex], allowing callers to corrupt the weight table at runtime. [L3,L13,L19,L54-L56] |
| 8 | ESLint compliance | WARN | HIGH | @typescript-eslint/prefer-readonly would flag SYMBOLS, DEFAULT_WEIGHTS, REEL_WEIGHTS, and the wts parameter in pickFromWeighted as requiring readonly modifiers. [L3,L13,L19,L31] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights have no JSDoc. spinReel's reelIndex domain (0–4) and 3-row column return shape are undocumented. [L43,L50,L54] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform no bounds check on reelIndex. An out-of-range index makes REEL_WEIGHTS[reelIndex] return undefined, causing a TypeError in wts.reduce at runtime with no diagnostic. [L43-L48,L54-L56] |
| 13 | Security | FAIL | CRITICAL | Casino/slot-machine domain inferred from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbol vocabulary and co-located jackpot.ts, freespin.ts, paytable.ts. Math.random() is a non-cryptographic, non-auditable PRNG and is not certifiable for regulated gaming RNG. The project includes src/rng.ts — a dedicated RNG abstraction — which is bypassed entirely here. [L35] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded in pickFromWeighted with no injection point; deterministic testing requires monkey-patching. src/rng.ts exists as a project-level RNG abstraction but is unused here. [L31-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig for type-checked inference without widening. SYMBOLS could use as const satisfies readonly Symbol[] for literal narrowing. [L3,L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights exposes a live mutable reference to the internal REEL_WEIGHTS array. In a casino domain, callers mutating the weight table mid-session is a game-integrity risk. Return type should be readonly number[] and implementation should return a copy or the readonly reference. [L54-L56] |

### Suggestions

- Replace Math.random() with the project's src/rng.ts abstraction and inject it as a parameter for both regulated-gaming compliance and deterministic testability.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Mark all module-level constants as readonly and use Record<Symbol, number> for ReelWeightConfig.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  interface ReelWeightConfig { CHERRY: number; LEMON: number; ... }
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  type ReelWeightConfig = Record<Symbol, number>;
  const DEFAULT_WEIGHTS = { ... } satisfies Readonly<ReelWeightConfig>;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]
  ```
- Return readonly number[] from getReelWeights to prevent callers from mutating the live weight table.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a certified, auditable PRNG (e.g. a seeded Mersenne Twister or a crypto-module-backed generator) to satisfy regulated-gaming RNG auditability requirements. [L33]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to ~3–7 (e.g. 5). At w=30, DIAMOND win combinations alone contribute ~229% expected payout per bet; total RTP >> 100%, violating the arbitrated 95% RTP target. Backward derivation puts the ceiling around w=5–7 to leave room for all other symbols to reach ~95% combined. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
