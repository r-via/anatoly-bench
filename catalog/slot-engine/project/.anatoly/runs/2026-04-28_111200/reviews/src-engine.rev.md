# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 72% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 85% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 93% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 90% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | - | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 80% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout function (line 107) to adjust total payout calculation.
- **Duplication [UNIQUE]**: Numeric constant. No similar constants found in RAG results.
- **Correction [OK]**: Value 0.05 correctly represents a 5% rate; the defect is in how it is applied inside computePayout, not in the constant itself.
- **Overengineering [LEAN]**: Simple named constant replacing a magic number. Appropriate and minimal.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

Auto-resolved: function ≤ 5 lines

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Class instantiated at line 29 to create the dependency injection container.
- **Duplication [UNIQUE]**: Service locator container class. No similar classes found in RAG results.
- **Correction [OK]**: resolve() silently returns undefined for unregistered keys via an unsafe cast, but all keys resolved in this file are pre-registered; no runtime bug in current usage.
- **Overengineering [OVER]**: A hand-rolled IoC/DI container (register + resolve with an untyped Map<string, unknown>) whose sole purpose is to hold three values (`rng`, `paytable`, `reels`) that are already available as direct module-level imports. All three are retrieved once in `spin` and could be called directly. The pattern imposes type-unsafe casts (`as T`) and indirection with no testability or extensibility benefit visible anywhere in the file.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Referenced in spin function (lines 127-128) to iterate and evaluate paylines, and at line 153 to extract line symbols.
- **Duplication [UNIQUE]**: Payline configuration array. No similar payline definitions found in RAG results.
- **Correction [OK]**: Ten paylines with valid row indices 0-2 for a 3-row grid; structure is correct.
- **Overengineering [LEAN]**: Plain data constant enumerating the ten payline row-index patterns. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called from evaluateLine function (line 75) to validate symbol matches on a payline.
- **Duplication [DUPLICATE]**: Identical semantic logic to lineWins from paytable.ts (similarity 0.841). Both functions detect consecutive symbol runs from array start, treat WILD as wildcard, return matched symbol and count if >= 3.
- **Correction [OK]**: Excluded per project instructions — previously investigated and confirmed correct.
- **Overengineering [LEAN]**: Focused helper that finds the leading symbol and measures the consecutive run length. Single responsibility, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — 92% identical implementation — both detect consecutive symbol runs accounting for WILD wildcards, only cosmetic differences in variable naming (lead vs first, run vs count, sym vs symbol in return object)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called from spin function (line 128) to evaluate each payline and compute line wins.
- **Duplication [UNIQUE]**: Evaluates payline with symbol extraction and wild multiplier calculation. No similar functions found in RAG results.
- **Correction [OK]**: Wild-multiplier formula `basePayout * (1 + wildCount) * 2^wildCount` matches the documented formula in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly.
- **Overengineering [LEAN]**: Implements exactly the documented wild-multiplier formula (`basePayout × (1 + wildCount) × 2^wildCount`) from `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. Length is justified by the formula's steps; no unnecessary indirection.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported and called within spin function (line 131) to calculate total payout from line wins.
- **Duplication [UNIQUE]**: Calculates total payout with house edge adjustment. No similar functions found in RAG results.
- **Correction [ERROR]**: Three independent defects: house edge applied in the wrong direction (increases payout instead of deducting), unconditional phantom payout on every spin, and Math.ceil rounds in the player's favour.
- **Overengineering [LEAN]**: Simple reduce + two arithmetic adjustments. From an overengineering standpoint the function is appropriately small and direct, even though the logic has correctness issues (HOUSE_EDGE inflates rather than reduces payout). (deliberated: confirmed — Confirmed ERROR. At src/engine.ts:105, `total = total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 (line 14) yields `total * 1.05`, which INCREASES the payout by 5%. The docstring at lines 98-100 explicitly states the intent is 'a target RTP of approximately 95%', meaning the correct formula is `total * (1 - HOUSE_EDGE)`. This inverts the house edge: the player gets a 5% bonus instead of a 5% deduction. Additionally, line 108 (`total += bet * 0.01`) unconditionally adds 1% of the bet on every spin, including zero-win spins, creating a phantom payout leak. Parameter `bet: any` at line 101 weakens type safety. This is a financial correctness bug affecting game economics.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Exported and runtime-imported by src/index.ts; primary API function for executing slot machine spins.
- **Duplication [UNIQUE]**: Main spin orchestration function managing reels, paylines, bonuses, and event emission. No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: Throws a bare string instead of an Error object; resolved `rng` and `reelsModule` are never used, bypassing the configured RNG.
- **Overengineering [LEAN]**: Per rule 9, `spin` is evaluated only on its own code. Its own logic — validating bet, iterating paylines, accumulating wins, computing scatter/jackpot/wildMultiplier, assembling SpinResult — is straightforward. The factory, strategy, and emitter it instantiates are defined in other files and will be evaluated there; at the call site `spin` simply instantiates and calls them, which is the minimal thing to do. (deliberated: confirmed — Confirmed NEEDS_FIX with raised confidence. (1) src/engine.ts:115 throws a string literal `throw "invalid bet"` instead of `new Error(...)`, losing stack traces and breaking `instanceof Error` checks. (2) Lines 120 and 122: `rng` (weightedPick) and `reelsModule` are resolved from the DI container but never called — grep confirms no downstream usage of either variable. The actual RNG work is done via `pickFromWeighted` in reels.ts:30-41, invoked through the factory chain (factories.ts:12 calls spinReel). (3) Line 113: `bet: any` should be `number`. (4) Lines 124-126: factory, strategy, and emitter are instantiated per call; DefaultStrategy.adjustPayout is a no-op (strategy.ts:8-10); the emitter registers an empty handler at line 175 and immediately emits. These are verifiable defects, not style preferences.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig.json was not provided for review. Cannot confirm `strict: true` is set. The presence of explicit `any` on public API signatures (L101, L113) is consistent with a project that either lacks strict mode or routinely bypasses it. [L101, L113] |
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on the `bet` parameter in both public exports: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The module already declares `export type Bet = number` on L12 — that alias must be used here. Using `any` erases type safety for the primary public API surface. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` (L34–L45) is module-level game configuration that never changes, but is typed as mutable `number[][]`. Both the outer array and each inner row array should be readonly to prevent accidental mutation by any code receiving a payline reference. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Three clear lint violations: (1) `throw "invalid bet"` at L115 — a string literal throw violates `no-throw-literal` / `@typescript-eslint/only-throw-error`; (2) `rng` (L120) is resolved from the container but never referenced anywhere in `spin()`; (3) `reelsModule` (L122) is resolved but never used. Both (2) and (3) trigger `no-unused-vars` / `@typescript-eslint/no-unused-vars`. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is the primary public export but carries no JSDoc — its parameters, return value, and thrown errors are undocumented. `computePayout` has a JSDoc block (L97–L100). `export type Bet` also lacks a doc comment. At minimum `spin` must be documented. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | The file is fully synchronous — no unhandled Promises or missing try-catch. However, `throw "invalid bet"` (L115) throws a primitive string instead of an `Error` object. This discards stack trace information and breaks `instanceof Error` checks in callers. The issue is low-severity for the async axis but still a clear error-handling deficiency. [L115] |
| 14 | Performance | WARN | MEDIUM | The wildMultiplier loop (L148–L157) re-fetches `lineSymbols` and re-scans the run for each winning line, duplicating symbol-access work already performed inside `evaluateLine`. The per-line wild count could be surfaced as part of the `LineWin` object to avoid the second O(n×m) pass. [L148-L157] |
| 15 | Testability | WARN | MEDIUM | The module-level `container` (L29–L32) is a service-locator: dependencies are hidden inside `spin()` via `container.resolve(...)` rather than injected through parameters. Unit-testing requires mutating module-level registry state between runs. Accepting an optional `deps` argument would eliminate this coupling. [L29-L32, L120-L122] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No use of `satisfies`, `as const`, or other TS 5.x improvements. `PAYLINES` is a prime candidate: `const PAYLINES = [...] satisfies ReadonlyArray<readonly [number, number, number, number, number]>` would enforce payline shape at declaration and provide deep immutability without a separate type annotation. [L34-L45] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Slot-machine / regulated-gambling domain confirmed by reel/payline/wild/scatter/free-spin/jackpot vocabulary throughout. `computePayout` JSDoc (L97–L100) states it 'maintains a target RTP of approximately 95%', but the implementation at L104–L106 multiplies all positive wins by `(1 + HOUSE_EDGE)` = ×1.05, which INCREASES payouts above baseline. Additionally, `total += bet * 0.01` (L108) guarantees a 1 % return on every spin including zero-win spins. Both effects together push effective RTP above 100 %, inverting the intended house edge and making the game financially insolvent for the operator. The formula should be `total * (1 - HOUSE_EDGE)` to achieve the documented ~95 % RTP. Cross-reference: `.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md` (payout formula) and `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md` (wild multiplier table). [L104-L108] |

### Suggestions

- Replace `any` with the already-declared `Bet` type alias on both public export signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix the house edge calculation to reduce payouts toward a ~95 % RTP instead of boosting them above 100 %
  ```typescript
  // Before
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE);
  }
  total += bet * 0.01;
  // After
  if (total > 0) {
    total = total * (1 - HOUSE_EDGE);
  }
  ```
- Throw a proper Error object to preserve stack traces and allow instanceof checks in callers
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the two unused container resolutions (`rng`, `reelsModule`) to eliminate no-unused-vars violations
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Mark PAYLINES deeply readonly and use satisfies to enforce payline shape at declaration
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... rows ...
  ] satisfies ReadonlyArray<readonly [number, number, number, number, number]>;
  ```
- Add JSDoc to `spin` documenting its parameter, return type, and thrown error
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given bet amount.
   * @param bet - Integer coin bet in [1, 100]
   * @returns SpinResult with reels, line wins, scatter count, free spins awarded, and total payout
   * @throws {Error} When bet is not a positive integer
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or explicitly document `total += bet * 0.01`; as written it awards coins on every losing spin without any specification backing, corrupting RTP calculations. [L108]
- **[correction · medium · small]** Replace `Math.ceil` with `Math.floor` so fractional coin remainders stay with the house, consistent with slot-machine domain convention and the stated RTP target. [L110]
- **[correction · medium · small]** Pass the resolved `rng` to `factory.buildReels()` (or remove the unused resolve calls for `rng` and `reelsModule`) so the configured certified RNG is not bypassed. [L120]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Fix house edge direction in computePayout: change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so 5% is deducted from wins, maintaining the documented RTP ≈ 95%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to produce a proper Error instance carrying a stack trace. [L115]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `DEBUG_MODE`, `EngineContainer`, `container` (`Bet, DEBUG_MODE, EngineContainer, container`) [L12-L12, L15-L15, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
