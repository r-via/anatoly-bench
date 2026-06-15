# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 65% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 75% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Type alias with no similar definitions in provided context.
- **Correction [OK]**: Type alias only; runtime constraint is enforced in spin().
- **Overengineering [LEAN]**: Single-line type alias. Minimal, appropriate for domain clarity.
- **Tests [NONE]**: Type alias with no test file present.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. 'Bet' does not convey constraints (integer-only, range 1–100) that are enforced in spin().

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L107): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-local constant; no similar constant found in provided context.
- **Correction [OK]**: Value 0.05 is correct; the bug is in how computePayout applies it, not in the constant itself.
- **Overengineering [LEAN]**: Named constant for a magic number. Correct practice.
- **Tests [NONE]**: No test file exists; transitive coverage through computePayout is moot with zero tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant with no JSDoc. No comment explaining its role in RTP calculation or that it inflates payouts rather than reducing them.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false` — the guarded block in spin (L161–163) is permanently dead code at runtime.
- **Duplication [UNIQUE]**: Module-local boolean flag; no similar constant found in provided context.
- **Correction [OK]**: Guards a debug log branch; no correctness issues.
- **Overengineering [LEAN]**: Simple boolean flag gating one console.log. No abstraction overhead.
- **Tests [NONE]**: No test file exists; no transitive coverage through spin.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag with no JSDoc. Purpose is inferrable from name, but no comment on how to enable or what it logs.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`, which is used in spin.
- **Duplication [UNIQUE]**: Registry class with no similar class found in provided context.
- **Correction [OK]**: Simple registry; resolve() returning undefined-cast-to-T is acceptable given all keys are registered at module load and no unknown key is ever passed.
- **Overengineering [OVER]**: Hand-rolled IoC/DI container (register/resolve with a Map) used solely in this file to wrap three statically-imported symbols (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). None of these registrations are ever overridden or swapped; direct calls to the imports would be identical. Unnecessary indirection layer with no testability or extensibility benefit in practice.
- **Tests [NONE]**: No test file found; class is untested directly or indirectly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or either method. Purpose as a service-locator DI container is non-obvious and undocumented.

#### `container` (L29–L29)

- **Utility [USED]**: Resolved in spin at L121–L123 for rng, paytable, and reels.
- **Duplication [UNIQUE]**: Module-level singleton instance; no similar variable found in provided context.
- **Correction [OK]**: Registers known keys at module init; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file; no transitive coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment explaining it is the engine's DI registry or which keys are registered.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin (L131) and used again in wild-multiplier block (L151).
- **Duplication [UNIQUE]**: Payline matrix constant; no similar definition found in provided context.
- **Correction [OK]**: Matches the reference documentation exactly.
- **Overengineering [LEAN]**: 10-element constant array of payline patterns. Natural, flat representation for this domain.
- **Tests [NONE]**: No test file; no transitive coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining what the row-index arrays represent or the geometry of each payline pattern.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at L73.
- **Duplication [DUPLICATE]**: Identical algorithm to lineWins: same WILD-skip logic for lead symbol, same SCATTER guard, same run-counting loop with WILD substitution, same >= 3 threshold. Only differences are local variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count) — no behavioral distinction.
- **Correction [OK]**: WILD-substitution, SCATTER guard, and consecutive-run logic are all correct; run count starts from position 0 as required.
- **Overengineering [LEAN]**: Single-responsibility: find lead symbol, count matching run. Clear and minimal.
- **Tests [NONE]**: No test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper with no JSDoc. WILD-substitution logic and early-exit for SCATTER are non-trivial but undocumented. Lenient confidence given non-exported status.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve WILD-skipped lead symbol, guard SCATTER, count consecutive matches with WILD substitution, and return null below 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called by spin at L132 inside the PAYLINES loop.
- **Duplication [UNIQUE]**: No similar functions found in provided context.
- **Correction [OK]**: Core symbol mapping and checkLine delegation are correct; undocumented wild-boost multiplier is internally consistent (see doc_divergence).
- **Overengineering [LEAN]**: Computes per-payline payout including wild-boost logic. Complexity is justified by game rules.
- **Tests [NONE]**: No test file; no transitive coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with no JSDoc. Wild-multiplier stacking formula (basePayout * (1 + wildCount) * 2^wildCount) is non-obvious and warrants documentation.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin at L135. Not directly imported externally, but spin (which is imported) depends on it.
- **Duplication [UNIQUE]**: No similar functions found in provided context.
- **Correction [NEEDS_FIX]**: House edge applied with wrong sign (boosts payout by 5% instead of reducing it), yielding effective RTP > 100%; Math.ceil further favors the player against slot-industry convention.
- **Overengineering [LEAN]**: Straightforward reduce + edge application. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical payout logic — including the misapplied HOUSE_EDGE (inflates rather than reduces payout) and unconditional bet*0.01 floor — is completely untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and RTP intent, but omits @param for lineWins and bet, no @returns, and does not document the unconditional floor (bet * 0.01) or that HOUSE_EDGE inflates rather than reduces total.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported function, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found in provided context.
- **Correction [NEEDS_FIX]**: Bet upper bound of 100 is not enforced: bets > 100 produce only a console.warn and silently proceed, violating the arbitrated contract (Bet = 1..100 integer).
- **Overengineering [LEAN]**: Own logic is sequential and clear: validate bet, spin reels, iterate paylines, aggregate results. Upstream abstractions (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter) live in other files and will be evaluated there; per source-pattern rule, spin itself is not the source of those abstractions.
- **Tests [NONE]**: No test file found. Primary exported entry point imported by src/index.ts is entirely untested, including bet validation, wild multiplier logic, free spin handling, and jackpot detection.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc. Missing @param bet (valid range, integer constraint), @returns SpinResult shape, @throws for invalid bet, and documentation of side effects (emitter, strategy adjustment). (deliberated: confirmed — Confirmed. engine.ts:118 warns `console.warn("bet exceeds maximum")` when `bet > 100` but does not throw or cap the value — the spin proceeds with an arbitrarily large bet. The lower-bound validation at line 114 correctly throws, proving the developer intended hard enforcement. The upper bound is a genuine defect: a soft warning in a gambling engine allows unbounded exposure. Additionally, `computePayout` at line 105 multiplies by `(1 + HOUSE_EDGE)` which *increases* payouts by 5% instead of reducing them — the comment at line 99 states 'target RTP of approximately 95%' but the math yields ~105%. This compounds the bet-enforcement bug.)

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on two public exported functions: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). Both params have a well-defined type — `Bet` (the re-exported alias) or `number` — making `any` unjustified. [L101, L113] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>()` silently casts `unknown` to `T` with `as T` (L25), producing a nominally typed but structurally unchecked value. A typed service-map record (`Record<K, ServiceMap[K]>`) or a discriminated registry would eliminate the unsafe cast. [L24-L26] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` (L34) is a module-level constant that can be mutated at runtime. Adding `as const` would give the narrowest inferred type and prevent accidental writes. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` (L115) violates `@typescript-eslint/no-throw-literal` — only Error instances should be thrown. (2) `rng` (L120) and `reelsModule` (L122) are assigned from the container but never referenced again in the function body — `no-unused-vars`. (3) `emitter.on(SPIN_DONE, () => {})` (L175) registers a permanent no-op listener, flagged by lint rules as dead code and a potential memory leak. [L115, L120, L122, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L113) and `export type Bet` (L12) are public exports with no JSDoc. Only `computePayout` is documented. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Two error-handling issues: (1) `throw "invalid bet"` (L115) is a string — callers cannot catch by type and stack traces are lost. (2) Bets over 100 only trigger `console.warn` (L118) and continue processing. The arbitrated contract specifies `1..100 coins, integer`; values > 100 must be rejected, not warned. [L115, L118] |
| 13 | Security | WARN | MEDIUM | Gambling domain inferred from imports (`rng`, `freespin`, `jackpot`) and vocabulary (`WILD`, `SCATTER`, paylines, lineBet). Intermediate payout arithmetic uses IEEE 754 floats throughout; `Math.ceil` prevents fractional final values but floating-point rounding can accumulate across multiple paylines and WILD multiplier applications. Regulated gaming typically requires integer-coin arithmetic or a certified Decimal library for auditable payout calculations. No hardcoded secrets or eval. [L77-L94] |
| 14 | Performance | WARN | MEDIUM | The `wildMultiplier` loop (L148-L157) re-derives `lineSymbols` from `PAYLINES` and `reels` for every winning line — duplicating work already performed inside `evaluateLine`. Storing wild count on `LineWin` would eliminate the second pass. [L148-L157] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hard-instantiated inside `spin()` (L124-L126) with no injection point. The module-level `container` singleton is populated at import time, making isolated unit tests fragile without module mocking. [L29-L32, L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const` for inferred readonly tuple types. The `result` object literal (L163-L171) could use `satisfies SpinResult` to catch structural mismatches at the definition site without widening the inferred type. [L34, L163-L171] |
| 17 | Context-adapted rules | WARN | MEDIUM | Three casino-domain concerns: (1) `computePayout` applies `total * (1 + HOUSE_EDGE)` (L105), which multiplies by 1.05 and increases payout — inverting the intended house edge. The arbitrated contract specifies 95% RTP / 5% house edge, requiring `* (1 - HOUSE_EDGE)`. (2) `strategy.adjustPayout(result)` (L173) mutates declared outcomes post-evaluation; post-hoc payout adjustment is a regulatory red flag in licensed gaming. (3) `emitter.on(SPIN_DONE, () => {})` (L175) is dead code with no audit or observability value. [L105, L173, L175] |

### Suggestions

- Replace `bet: any` with the exported `Bet` type on both public functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Reject bets over 100 to satisfy the arbitrated 1..100 contract
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum (1–100 coins)");`
- Fix inverted house-edge: multiply by 0.95 not 1.05
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Mark PAYLINES as const to prevent mutation and narrow types
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [`
- Remove unused container resolutions or actually use them
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<...>("reels");
  // After
  // Remove or wire rng / reelsModule into reel generation instead of factory.buildReels()
  ```
- Remove the no-op SPIN_DONE listener (dead code)
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout: slot-machine convention requires rounding down so the house retains fractional-credit remainders. [L110]
- **[correction · medium · small]** Replace `console.warn` with a throw (matching the lower-bound error) in spin() when bet > 100 to enforce the arbitrated upper bound. [L118]

### Refactors

- **[correction · high · large]** Change `(1 + HOUSE_EDGE)` to `(1 - HOUSE_EDGE)` in computePayout so the house edge reduces payouts by 5%, targeting the arbitrated 95% RTP instead of inflating it above 100%. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
