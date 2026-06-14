# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 85% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 92% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with 0 importers from other files
- **Duplication [UNIQUE]**: Type alias with no similar types found
- **Correction [OK]**: Type alias with no implementation; no correctness issues.
- **Overengineering [LEAN]**: Public API type alias matching the README contract. One line, zero overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Consumers cannot tell valid bet ranges or units from the type alone.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used locally at line 109 in computePayout function
- **Duplication [UNIQUE]**: Constant value; no duplicates found
- **Correction [OK]**: Value 0.05 is correct; the defect is in how it is applied inside computePayout.
- **Overengineering [LEAN]**: Named constant for the 5% house edge used in computePayout. Appropriate.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private module-level constant, no JSDoc. Name implies direction but not how it is applied (markup vs. deduction) or its relationship to RTP.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used locally at line 171 in spin function conditional
- **Duplication [UNIQUE]**: Boolean constant; no duplicates found
- **Correction [OK]**: Boolean flag constant; no correctness issues.
- **Overengineering [LEAN]**: Single boolean constant guarding a console.log. Trivial; no abstraction concern.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private flag, self-explanatory name and trivial semantics — tolerable without JSDoc.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated on line 29 to create container instance
- **Duplication [UNIQUE]**: Service container class with no similar implementations found
- **Correction [OK]**: resolve silently returns undefined cast to T on a missing key, but all registered keys are present before use in this file.
- **Overengineering [OVER]**: Hand-rolled IoC/DI container for exactly three items (rng, paytable, reels) that are already directly imported at the top of the file. The class adds a string-keyed, untyped Map lookup where direct references would be zero-overhead and fully type-safe. No injection ever occurs — entries are hardcoded in the module. This is a classic premature-abstraction of a dependency-injection pattern with a single, hardcoded instantiation.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI registry class with no JSDoc. Purpose and expected key/value contracts are non-obvious from names alone.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Referenced at lines 139, 140, 157 in spin and evaluateLine logic
- **Duplication [UNIQUE]**: Data constant array; no duplicates found
- **Correction [OK]**: Ten valid 5-column paylines using row indices 0–2 for a 5×3 grid.
- **Overengineering [LEAN]**: Static 10×5 payline matrix. Exactly the right representation for a fixed payline slot engine.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining row-index encoding, coordinate system, or which axis is reel vs. row. Structure is not self-evident.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called at line 83 from evaluateLine function
- **Duplication [DUPLICATE]**: Identical logic to lineWins in paytable.ts: finds leading symbol, validates against WILD/SCATTER, counts consecutive matches, returns result if count >= 3. Differs only in variable naming (lead/first, run/count, sym/symbol).
- **Correction [OK]**: Left-to-right consecutive-run detection with WILD substitution, all-WILD guard, and SCATTER exclusion is correct.
- **Overengineering [LEAN]**: Single-responsibility helper: scans symbols left-to-right for a winning run, handles WILD substitution. Well-decomposed.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, under 20 lines, but WILD/SCATTER exclusion logic and early-exit semantics are non-trivial and warrant at least a brief JSDoc.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% code duplication—same control flow, same algorithm, same return contract. Only naming differs.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called at line 140 in spin function payline evaluation loop
- **Duplication [UNIQUE]**: Evaluates payline with specialized wild multiplier logic; no similar functions found
- **Correction [OK]**: Wild multiplier formula (1+wc)×2^wc yields ×4 for 1 wild and ×12 for 2 wilds, matching documented values.
- **Overengineering [LEAN]**: Combines payline extraction, checkLine, and wild-multiplier math into one cohesive step. The payFn parameter enables testability without adding unnecessary layers.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private function but implements significant logic (wild multiplier compounding formula). No JSDoc on parameters or the exponential payout formula.

#### `computePayout` (L101–L111)

Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total * (1 + HOUSE_EDGE)` (= ×1.05), increasing payouts by 5%. The JSDoc at lines 97-100 says 'Applies the house edge to maintain a target RTP of approximately 95%', which conventionally means a deduction (×0.95). HOUSE_EDGE constant name (line 14) reinforces the deduction interpretation. ANCIENT_RTP=0.95 in paytable.ts:3 is defined but never imported or used in any computation — no code enforces the 95% target. RAG design docs claim the markup is intentional (paytable calibrated below target), but no inline comment at line 105 documents this, no tests validate it, and the naming/JSDoc directly contradict a markup interpretation. The code either has a formula bug (should be `1 - HOUSE_EDGE`) or the JSDoc and constant name are dangerously misleading for a financial computation. Either way this is a correction-level defect.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both public exports: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The project already exports `Bet = number` — use it. [L100, L112] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>` blindly casts `unknown → T` via `as T` with no runtime guard. A typed registry map keyed by a symbol/string union with overloads would eliminate the unsafe assertion. [L24-L26] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is `number[][]` — a mutable array of mutable arrays. `as const` or `readonly (readonly number[])[]` would prevent accidental mutation and enable narrower literal types. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Two unused variables: `rng` (L119) and `reelsModule` (L121) are resolved from the container but never called — actual reels come from `factory.buildReels`. `throw "invalid bet"` (L114) violates `no-throw-literal`. [L114, L119, L121] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (primary public API, L112) has no JSDoc. `Bet` (L12) has no JSDoc. `computePayout` has JSDoc but its description is factually wrong (see rule 17). [L12, L112] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L114) throws a string literal. Library consumers cannot use `instanceof Error` to classify engine errors from other exceptions. Replace with `throw new Error("invalid bet")`. [L114] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` registers a fresh no-op listener on every `spin` call. In high-throughput usage the emitter accumulates unbounded dead listeners. [L174] |
| 15 | Testability | WARN | MEDIUM | `spin` directly instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L123–125). None can be substituted in unit tests. The DI container exists for `rng`/`paytable`/`reels` but is bypassed for these three collaborators — inconsistent and untestable. [L123-L125] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies readonly (readonly number[])[]` to get both literal-type narrowing and compile-time immutability. No use of `satisfies` elsewhere where it would tighten inference. [L34] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: `computePayout` JSDoc (L98) states it 'applies the house edge to maintain a target RTP of approximately 95%', but `total * (1 + HOUSE_EDGE)` multiplies wins by 1.05 — increasing payout by 5%, not decreasing it. Actual RTP exceeds 100%, directly contradicting the arbitrated 95% RTP invariant (README). Correct formula: `total * (1 - HOUSE_EDGE)`. The string throw (L114) is additionally poor ergonomics for a casino library. [L96-L110] |

### Suggestions

- Use the existing `Bet` type alias instead of `any` on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix house-edge formula: `1 + HOUSE_EDGE` increases payout; use `1 - HOUSE_EDGE` to achieve 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove unused container resolutions for `rng` and `reelsModule` (reels come from factory, not the container)
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Make PAYLINES deeply immutable for safety and literal-type narrowing
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... values unchanged
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove the no-op emitter listener registered on every spin call to prevent listener accumulation
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Either inject rng and reelsModule into StandardReelBuilderFactory.buildReels so the container-configured dependencies are actually used, or remove the dead container.resolve calls on lines 120 and 122. [L120]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- **[utility · high · trivial]** Remove dead code: `computePayout` is exported but unused (`computePayout`) [L101-L111]

### Refactors

- **[correction · high · large]** In computePayout line 105, replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to apply a 5% deduction and achieve the documented 95% RTP target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Change `bet: any` to `bet: Bet` (or `number`) in spin's signature to match the arbitrated API contract. [L113]
- **[correction · low · trivial]** Change `bet: any` to `bet: number` in computePayout to prevent silent NaN propagation from non-numeric inputs. [L101]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `Bet`, `computePayout`, `spin` (`Bet, computePayout, spin`) [L12-L12, L101-L111, L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
