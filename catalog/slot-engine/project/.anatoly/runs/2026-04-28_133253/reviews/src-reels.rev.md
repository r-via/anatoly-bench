# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 78% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 72% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 75% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported constant used locally at line 44 in pickFromWeighted call within spinReel function
- **Duplication [UNIQUE]**: Data constant with symbol array. No similar constants found in codebase.
- **Correction [OK]**: Eight symbols correctly defined; order matches weightsToArray and all downstream consumers.
- **Overengineering [LEAN]**: Simple constant array of symbol names. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported constant used locally in REEL_WEIGHTS initialization at lines 23-27, called 5 times via weightsToArray
- **Duplication [UNIQUE]**: Data constant with default weight values. No similar constants found.
- **Correction [OK]**: 25+25+15+10+5+30+5+5=120, matching the documented total of 120 in .anatoly/docs/01-Getting-Started/03-Configuration.md and .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: Simple object literal capturing the documented weight configuration. Matches the design documented in .anatoly/docs/01-Getting-Started/03-Configuration.md exactly.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported constant used locally at line 45 (spinReel) and line 57 (getReelWeights)
- **Duplication [UNIQUE]**: Constant array of reel weight arrays. No similar constants found.
- **Correction [OK]**: Five entries, all using DEFAULT_WEIGHTS, consistent with documented five-reel identical-weight design.
- **Overengineering [ACCEPTABLE]**: Five explicit identical calls is slightly verbose given the docs confirm all reels share one weight distribution, but having separate arrays per reel leaves room for future per-reel differentiation without a structural change. Acceptable trade-off.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported helper function called locally at line 44 within spinReel function loop
- **Duplication [DUPLICATE]**: Implements weighted random selection algorithm using cumulative distribution. RAG score 0.852 with matching logic and identical algorithmic behavior to weightedPick.
- **Correction [OK]**: Cumulative-weight selection algorithm is correct; previously flagged finding overturned per deliberation record.
- **Overengineering [LEAN]**: Textbook weighted random selection algorithm. Minimal, correct, and appropriately generic for its use across all reels.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both implement weighted random selection using cumulative distribution with matching algorithm structure and control flow

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function with runtime import from src/factories.ts per pre-computed analysis
- **Duplication [UNIQUE]**: Specific reel-spinning logic for slot machine. No similar functions found per RAG.
- **Correction [OK]**: Builds a 3-row column from REEL_WEIGHTS[reelIndex]; previously flagged out-of-bounds concern overturned per deliberation record.
- **Overengineering [LEAN]**: Straightforward: looks up the reel's weights, samples 3 symbols, returns the column. No unnecessary indirection.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function with runtime import from src/engine.ts per pre-computed analysis
- **Duplication [UNIQUE]**: Trivial getter function returning SYMBOLS constant. No similar functions found.
- **Correction [OK]**: Trivially correct; returns the module-level SYMBOLS array.
- **Overengineering [LEAN]**: Thin accessor exposing the SYMBOLS constant. Appropriate for encapsulation of the module's internal array.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function with runtime import from src/engine.ts per pre-computed analysis
- **Duplication [UNIQUE]**: Trivial getter function accessing REEL_WEIGHTS array. No similar functions found.
- **Correction [OK]**: Trivially correct getter; previously flagged concern overturned per deliberation record.
- **Overengineering [LEAN]**: Simple indexed accessor for reel weight arrays. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates every symbol as a property. Since `Symbol` is already a string-literal union type imported from `./types.js`, `Record<Symbol, number>` would be the idiomatic utility-type form, eliminating duplication and staying in sync automatically if the Symbol union ever changes. [L8-L12] |
| 5 | Immutability | FAIL | MEDIUM | Three module-level constants — `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` — are mutable at runtime. `SYMBOLS` should be `readonly Symbol[]` (or `as const`), `DEFAULT_WEIGHTS` should be `Readonly<ReelWeightConfig>` (or use `satisfies` + `as const`), and `REEL_WEIGHTS` should be `ReadonlyArray<readonly number[]>`. Without these guards any module can silently mutate the shared reel state. [L3-L26] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions — `spinReel`, `getReelSymbols`, and `getReelWeights` — lack JSDoc. At minimum, `spinReel` should document the expected range of `reelIndex` (0–4) and the return shape; `getReelWeights` should document that it returns a live reference to the weight array. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex: number)` performs no bounds check before indexing `REEL_WEIGHTS[reelIndex]`. Valid indices are 0–4; any other value yields `undefined`, which is then passed as `wts` to `pickFromWeighted` where `wts.reduce(...)` throws a `TypeError` at runtime. Because `spinReel` is exported (callable from untrusted orchestration code), this is a real crash path. A guard such as `if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)` is required. [L43-L51] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain conclusively inferred from reel/symbol/weight vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) and confirmed by `.anatoly/docs/01-Getting-Started/03-Configuration.md` and `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`, which describe this file as the reel-composition engine. `Math.random()` (line 36) is a non-deterministic, non-seeded, non-auditable PRNG that is not certifiable under any regulated gaming jurisdiction (GLI, BMM, eCOGRA, etc.). All RNG calls in regulated slot machines must use a cryptographically secure, independently certified RNG. The project structure lists `src/rng.ts`, which should be the canonical RNG provider — `pickFromWeighted` must delegate to that module instead of calling `Math.random()` directly. [L36] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point, making deterministic unit testing impossible without monkey-patching. Accepting an `rng: () => number` parameter (defaulting to `Math.random`) would allow pure, reproducible tests. This concern is compounded by Rule 13 — the intended fix (delegating to `src/rng.ts`) naturally enables DI. [L32-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` and `REEL_WEIGHTS` are good candidates for `satisfies` + `as const` to gain both type-narrowing and deep immutability in one declaration. Example: `const DEFAULT_WEIGHTS = { CHERRY: 25, ... } as const satisfies ReelWeightConfig;` — this preserves literal types, enables readonly inference, and validates shape against the interface simultaneously. |

### Suggestions

- Replace manual `ReelWeightConfig` interface with `Record<Symbol, number>` to stay DRY and in sync with the Symbol union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  // No separate interface needed — derive from the Symbol union:
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as deeply readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
  const REEL_WEIGHTS: number[][] = [...];
  // After
  const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
  const DEFAULT_WEIGHTS = { CHERRY: 25, ... } as const satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  ```
- Inject the RNG function instead of calling Math.random() directly — fixes testability and prepares for the certified RNG required by Rule 13.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add a bounds guard to `spinReel` to prevent silent undefined-weights crash.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Add JSDoc to all three exported functions, documenting parameter constraints and return shapes.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spin a single reel and return 3 visible symbols.
   * @param reelIndex - Zero-based reel index (0–4).
   * @returns Array of 3 symbols from top to bottom.
   * @throws {RangeError} if reelIndex is out of bounds.
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
