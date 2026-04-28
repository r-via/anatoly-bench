# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 80% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 90% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 95% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 90% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 88% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 107 to adjust total payout calculation.
- **Duplication [UNIQUE]**: Constant numeric value. No similar symbols found in RAG results.
- **Correction [OK]**: Constant value 0.05 is the correct representation of a 5% house edge; the defect is in how computePayout applies it, not in the constant itself.
- **Overengineering [LEAN]**: Named constant for a magic number used in computePayout. Appropriate and minimal.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

Auto-resolved: function ≤ 5 lines

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Class instantiated at line 29 to create the container instance used throughout spin.
- **Duplication [UNIQUE]**: Custom service locator/DI container class with registry pattern. No similar implementations found.
- **Correction [OK]**: resolve() silently returns undefined cast to T if a key is missing, but all three keys are registered before any resolution occurs in this module; no live defect.
- **Overengineering [OVER]**: A bespoke IoC / service-locator container (register + resolve via a stringly-typed Map<string, unknown>) built to hold exactly three static module-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). These are pure functions that could be imported directly. The abstraction adds casting noise (`as T`, `as unknown`) with zero benefit for a single-file use case.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Referenced in spin function multiple times: length checked at line 130, indexed at lines 131 and 160.
- **Duplication [UNIQUE]**: Constant array defining slot machine payline configurations. No duplication detected.
- **Correction [OK]**: Ten paylines, each with 5 row indices in [0,2] for a 5-reel 3-row grid; values and shape are correct.
- **Overengineering [LEAN]**: Ten payline patterns matching the documented 10-payline design. Necessary game configuration data, minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Function called in evaluateLine at line 77 to check for winning symbol combinations.
- **Duplication [DUPLICATE]**: Identical semantic logic to lineWins() from paytable.ts. Both implement the same symbol sequence detection with WILD substitution and minimum run of 3. Differences are only variable names (lead/run vs first/count) and return object property names (sym vs symbol).
- **Correction [OK]**: Previously verified correct per deliberation review; no new evidence of defect.
- **Overengineering [LEAN]**: Focused helper that detects a consecutive winning run on a single payline, handles WILD substitution, and returns a minimal result. Matches the documented line-win detection logic in `.anatoly/docs/02-Architecture/02-Core-Concepts.md`.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical implementation — both detect consecutive matching symbols with WILD wildcard support, returning the leading symbol and run length if count >= 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Function called in spin at line 131 to evaluate each payline for wins.
- **Duplication [UNIQUE]**: Evaluates payline wins with payout calculation and wild multiplier logic. No similar functions found in RAG search results.
- **Correction [OK]**: Wild multiplier formula basePayout × (1 + wildCount) × 2^wildCount matches the documented spec (×4 for 1 wild, ×12 for 2, ×32 for 3); symbol extraction and LineWin assembly are correct.
- **Overengineering [LEAN]**: Applies the documented wild-multiplier formula (`basePayout × (1 + wildCount) × 2^wildCount`) and produces a `LineWin`. Complexity is justified by the spec in `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called in spin at line 135 to calculate total payout from line wins.
- **Duplication [UNIQUE]**: Calculates total payout from line wins, applying house edge adjustment. No similar functions found in codebase.
- **Correction [NEEDS_FIX]**: Three independent defects: house-edge multiplier sign is inverted (boosts payout instead of reducing it, implying RTP > 100%); undocumented bet×0.01 bonus; Math.ceil rounds in favour of the player instead of the house.
- **Overengineering [LEAN]**: Simple reduce + ceiling; no unnecessary abstractions. (Correctness of the house-edge direction is a separate concern from overengineering.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Exported function with 1 runtime importer (src/index.ts) and is core public API.
- **Duplication [UNIQUE]**: Main spin orchestration function coordinating reel building, line evaluation, free spins, and result emission. No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: throw "invalid bet" throws a string literal rather than an Error object; callers using instanceof Error or accessing e.message / e.stack will not handle this exception correctly.
- **Overengineering [LEAN]**: The function's own logic — iterating PAYLINES, accumulating wins, computing the wild-multiplier high-water mark, and assembling SpinResult — is straightforward consumer code. Per rule 9, the overengineering in `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` lives in their own files and is not attributed here. (deliberated: confirmed — Confirmed multiple correctness bugs. (1) engine.ts:105 — house edge is inverted: `total * (1 + HOUSE_EDGE)` multiplies payout by 1.05 instead of 0.95, contradicting the comment on lines 98-100 about 95% RTP. HOUSE_EDGE is 0.05 at engine.ts:14. (2) engine.ts:108 — `total += bet * 0.01` guarantees a nonzero payout on every spin, including losses. (3) engine.ts:120-122 — `rng` and `reelsModule` are resolved from the DI container but never called; actual reel generation goes through factory.buildReels() → reels.ts:spinReel() → reels.ts:pickFromWeighted(), bypassing the container entirely. (4) engine.ts:113 — `bet: any` weakens type safety; the Bet type alias exists on line 12 but is unused. (5) engine.ts:116 — throws a raw string instead of an Error. Raising confidence from 55 to 88 because all issues are empirically verifiable in the source.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig.json is not provided in context, so strict mode cannot be confirmed. The presence of explicit `any` parameters (see rule 2) is consistent with a project where strict mode is absent or partially enforced. Cannot award PASS without visibility into tsconfig. [L1-L5] |
| 2 | No `any` | FAIL | CRITICAL | Two public-facing exported functions use explicit `any` for the `bet` parameter: `computePayout(lineWins: LineWin[], bet: any): number` and `spin(bet: any): SpinResult`. This completely erases type safety for the primary input surface of the engine. Additionally, `EngineContainer.resolve<T>` performs an unchecked `as T` cast from `unknown` storage, which is effectively a silent `any`. [L97, L108, L22] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>` returns `this.registry.get(key) as T` — an unconstrained type assertion from `unknown`. There is no tag, narrowing guard, or runtime check. A discriminated union or branded-key approach (e.g. a typed registry map) would eliminate this unsafe cast without sacrificing the DI pattern. [L22-L24] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is declared as `const PAYLINES: number[][]` but is fully mutable at the nested-array level. It should be annotated as `readonly (readonly number[])[]` or declared with `as const` to prevent accidental mutation inside evaluateLine or external consumers. `HOUSE_EDGE` and `DEBUG_MODE` are fine as primitive consts. [L35-L46] |
| 8 | ESLint compliance | FAIL | HIGH | Multiple clear ESLint violations: (1) `throw "invalid bet"` violates `no-throw-literal` — a string is thrown instead of an Error instance; (2) `bet: any` on two exported functions violates `@typescript-eslint/no-explicit-any`; (3) The no-op listener `emitter.on(SPIN_DONE, () => {})` may trigger rules against empty functions / unused listeners depending on project config. [L110, L97, L108, L162] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has a JSDoc comment, but the more prominent exported function `spin` and the exported type `Bet` have no documentation. `spin` is the primary API entry point of the engine and should describe its parameters, return value, and thrown errors. [L108] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` at L110 throws a string primitive instead of `new Error("Invalid bet: must be a positive integer")`. Throwing non-Error values loses stack traces, breaks `instanceof Error` checks, and prevents typed `catch` narrowing. No async or Promise patterns in this file that are mishandled. [L110] |
| 15 | Testability | WARN | MEDIUM | `container` is a module-level singleton instantiated at import time (L27-L30). Because `spin()` reads from this shared singleton via `container.resolve()`, there is no way to inject a mock RNG, paytable, or reels module in unit tests without monkey-patching the module. Exposing the container as a parameter or providing a factory function for `spin` would make it trivially testable. [L27-L30, L115-L119] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two casino/game-engine-specific concerns: (1) `emitter.on(SPIN_DONE, () => {})` registers a no-op listener on a fresh emitter that is discarded after the function returns — this is dead code that signals an incomplete implementation and may confuse maintainers about the event contract. (2) `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` are re-instantiated on every `spin()` call; if these constructors are non-trivial, this is a throughput bottleneck for a high-frequency slot engine. Both patterns should be lifted to module scope or passed in as dependencies. [L122-L124, L162] |

### Suggestions

- Replace explicit `any` on `bet` with a proper type or branded type for compile-time safety
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  export function computePayout(lineWins: LineWin[], bet: any): number {
  // After
  export type Bet = number & { readonly __brand: 'Bet' };
  export function spin(bet: Bet): SpinResult {
  export function computePayout(lineWins: LineWin[], bet: Bet): number {
  ```
- Throw an Error instance instead of a string primitive to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error(`Invalid bet: expected a positive integer, received ${bet}`);`
- Mark PAYLINES as deeply readonly to prevent accidental mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Make EngineContainer.resolve type-safe using a typed registry map instead of casting from unknown
  ```typescript
  // Before
  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
  // After
  // Use a typed map or a discriminated key registry so no cast is needed:
  type RegistryKey = 'rng' | 'paytable' | 'reels';
  type RegistryMap = { rng: typeof weightedPick; paytable: typeof getPayMultiplier; reels: { getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }; };
  resolve<K extends RegistryKey>(key: K): RegistryMap[K] {
    return this.registry.get(key) as RegistryMap[K];
  }
  ```
- Lift factory/strategy/emitter out of the hot-path spin() function and add JSDoc
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    // ...
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
    // ...
    emitter.on(SPIN_DONE, () => {});
  // After
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  
  /**
   * Executes a single spin of the slot engine.
   * @param bet - Total bet amount in coins; must be a positive integer in [1, 100].
   * @returns A fully-evaluated SpinResult including line wins, scatter count, free spins, and jackpot flag.
   * @throws {Error} If bet is not a valid positive integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove (or document and justify) the unconditional 'total += bet * 0.01' bonus in computePayout; it is absent from all project specifications and corrupts RTP on every spin. [L108]
- **[correction · medium · small]** Replace Math.ceil(total) with Math.floor(total) in computePayout so fractional coin remainders stay with the house per slot-machine industry convention. [L110]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace total * (1 + HOUSE_EDGE) with total * (1 - HOUSE_EDGE) in computePayout so the house edge reduces the payout to the documented 95% RTP target instead of boosting it above 100%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace throw "invalid bet" with throw new Error("invalid bet") in spin to produce a proper Error with a stack trace and correct instanceof behaviour. [L115]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `DEBUG_MODE`, `EngineContainer`, `container` (`Bet, DEBUG_MODE, EngineContainer, container`) [L12-L12, L15-L15, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
