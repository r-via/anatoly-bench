# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 88% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L44, L34) and returned by getReelSymbols.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Eight symbols defined in correct order matching ReelWeightConfig and weightsToArray.
- **Overengineering [LEAN]**: Simple constant array, serves as the canonical symbol order for the whole module.
- **Tests [NONE]**: No test file exists. Symbol is referenced by exported functions used in engine and factories.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant, but a comment noting it is the canonical symbol roster (and that order must match weight arrays) would prevent subtle bugs.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17).
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface correctly models all eight symbol weights as numbers.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Interface fields are all named after symbols with numeric weights — purpose is self-evident from names alone.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when building REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Weights sum to 120 (25+25+15+10+5+30+5+5), matching reference docs exactly.
- **Overengineering [LEAN]**: Plain config object — clear, readable, exactly what the docs prescribe for user-facing weight editing.
- **Tests [NONE]**: No test file. Weight values directly affect game odds; correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The raw numbers are non-obvious (e.g. why DIAMOND=30 vs CHERRY=25); a comment on the total sum (120) and design intent would add value.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Returns weights in the same order as SYMBOLS array; mapping is consistent.
- **Overengineering [ACCEPTABLE]**: Exists as a bridge between the named-field config and the positional number[] that pickFromWeighted needs. Four lines, no branching. The indirection is a consequence of ReelWeightConfig's design, not extra complexity here.
- **Tests [NONE]**: No test file. Ordering of weights array must match SYMBOLS order — silent misalignment is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, <10 lines, name is clear. Tolerable per guidelines, but the ordering dependency on SYMBOLS array is a silent contract worth noting.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels each initialized with DEFAULT_WEIGHTS; matches documented 5-reel configuration.
- **Overengineering [ACCEPTABLE]**: Five separate arrays instead of one shared reference. Redundant given all reels share identical weights now, but enables per-reel divergence via a source edit without API changes — consistent with the docs' 'fork and modify' customization model.
- **Tests [NONE]**: No test file. Five-reel weight matrix drives all spin probabilities; structure and values are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all 5 reels share identical weights; a one-liner would clarify intent and make per-reel customisation easier to discover.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel (L47) to select each symbol.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random()*total, accumulate weights in a loop, and return the item when roll < cumulative, with the same fallback. Only differences are variable names and that pickFromWeighted is typed to Symbol rather than being generic.
- **Correction [NEEDS_FIX]**: Uses Math.random() as the RNG source in a regulated slot-machine engine — not certifiable.
- **Overengineering [LEAN]**: Canonical weighted-random-selection loop. Single responsibility, no unnecessary abstraction.
- **Tests [NONE]**: No test file. Core probability logic with boundary behavior (r == acc edge, last-item fallback) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper implementing weighted random selection. The algorithm is non-trivial (cumulative-sum scan) and has a subtle edge-case fallback on the last element; lacks any JSDoc explaining parameters, return value, or the floating-point edge case. (deliberated: reclassified: correction: NEEDS_FIX → OK — The finding conflates duplication with correction. Verified src/reels.ts:30-41 against src/rng.ts:5-16 — both implement the same cumulative-weight algorithm and both are mathematically correct. pickFromWeighted correctly sums weights (L31), draws Math.random()*total (L32), accumulates in a loop (L34-38), and falls back to the last item (L40). No off-by-one, no boundary error, no incorrect result. The duplication with weightedPick is a valid refactoring concern but not a correctness defect. The Math.random() concern (non-certifiable RNG) is a design/requirements issue, not a code bug. Downgrading correction to OK.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted random selection algorithm, same loop structure, same fallback; pickFromWeighted is a non-generic, non-exported clone

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Correctly spins 3 symbols per reel column using the reel-indexed weight array.
- **Overengineering [LEAN]**: Straightforward: look up weights, fill a 3-row column, return it.
- **Tests [NONE]**: No test file. Imported by factories.ts; out-of-bounds reelIndex silently returns undefined weights — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols (one per row), and behaviour when reelIndex is out of bounds.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG.
- **Correction [OK]**: Returns the SYMBOLS array; no in-tree mutation of the returned reference is present.
- **Overengineering [LEAN]**: Thin accessor exposing the internal SYMBOLS array — appropriate for the module's read-only contract.
- **Tests [NONE]**: No test file. Imported by engine.ts; returns shared mutable array reference — mutation risk untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of return value (ordered array matching weight indices) and that mutating the returned array is unsafe.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG.
- **Correction [OK]**: Returns the weight array for the requested reel; no in-tree mutation of the returned reference is present.
- **Overengineering [LEAN]**: Thin accessor matching the documented API; no extra logic.
- **Tests [NONE]**: No test file. Imported by engine.ts; invalid reelIndex returns undefined without error — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is a direct reference (mutation affects spin behaviour), and that weights correspond positionally to getReelSymbols().

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbols. If Symbol (imported from ./types.js) is a string-union of those same values, Record<Symbol, number> eliminates the duplication and keeps the two in sync automatically. [L7-L11] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable at runtime. SYMBOLS should be `as const` (or ReadonlyArray<Symbol>); DEFAULT_WEIGHTS should be Readonly<ReelWeightConfig>; REEL_WEIGHTS should be ReadonlyArray<ReadonlyArray<number>>. getReelWeights also returns a direct mutable reference to an internal row, contradicting the documented read-only contract. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights have no JSDoc. spinReel in particular should document the valid reelIndex range (0–4) and the 3-row output contract. [L44-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by reel/symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) and project structure. Math.random() is a non-cryptographic PRNG seeded by the JS engine and is not certifiable under regulated gaming standards (GLI-11, BMM, eCOGRA). Regulated RNGs must pass statistical test suites (NIST SP 800-22, Diehard) and be auditable. Critically, src/rng.ts exists in the project structure, indicating a dedicated RNG module that is not being used here — Math.random() is called directly instead. [L34] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, not injected. spinReel and pickFromWeighted cannot be tested deterministically without patching the global. The existing src/rng.ts module should be injected or imported so tests can supply a seeded/mock RNG. [L32-L43] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use `satisfies ReelWeightConfig` to get both widening-prevention and type-checking. SYMBOLS could use `as const` for a narrower literal-array type instead of Symbol[]. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | spinReel accepts any number as reelIndex with no bounds check — REEL_WEIGHTS[reelIndex] silently returns undefined for index ≥ 5 or < 0, propagating to pickFromWeighted as an undefined wts array and crashing at runtime. For a gaming engine, invalid reel indexes should throw or be guarded. Additionally, getReelWeights returns a mutable array reference, allowing external mutation of the weight table despite the documented read-only contract. [L44-L50] |

### Suggestions

- Replace ReelWeightConfig with Record<Symbol, number> to stay in sync with the Symbol union type
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level data structures as readonly and use satisfies for type-checked literals
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies ReadonlyArray<Symbol>;
  
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies Readonly<ReelWeightConfig>;
  
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  
  ```
- Inject RNG so spinReel is testable and compliant; add bounds guard
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
    ...
  }
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
    ...
  }
  // After
  import { nextFloat } from "./rng.js"; // use certified RNG module
  
  function pickFromWeighted(items: ReadonlyArray<Symbol>, wts: ReadonlyArray<number>): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = nextFloat() * total;
    ...
  }
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    ...
  }
  ```
- Return a copy from getReelWeights to enforce the documented read-only contract
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    return REEL_WEIGHTS[reelIndex]; // ReadonlyArray prevents callers from mutating
  }
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certifiable, auditable PRNG (e.g., a seeded crypto-quality generator or a gaming-certified RNG library). Math.random() is non-certifiable for regulated slot machine software. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
