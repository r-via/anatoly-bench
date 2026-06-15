# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 88% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 92% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found in RAG results.
- **Correction [OK]**: Type alias only; range enforcement is the caller's responsibility.
- **Overengineering [LEAN]**: One-line type alias over number; standard domain-typing practice.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported type alias with no constraints or usage notes documented.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 104: total * (1 + HOUSE_EDGE).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.05 is correct for a 5% house edge; the misapplication is in computePayout.
- **Overengineering [LEAN]**: Simple named constant, no structural complexity.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE affects computePayout output and is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; the JSDoc on computePayout alludes to RTP ~95%, but the constant itself has no comment explaining the value or intent.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded console.log block (lines 162–164) is unreachable dead code at runtime.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Boolean constant, no correctness issue.
- **Overengineering [LEAN]**: Hardcoded boolean flag — minimal by definition.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag, self-descriptive name, low severity.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create the module-level container.
- **Duplication [UNIQUE]**: No similar class found in RAG results.
- **Correction [OK]**: Simple registry; all resolved keys are registered before use.
- **Overengineering [OVER]**: Hand-rolled service-locator for 3 statically-imported values (rng, paytable, reels) that are never swapped at runtime. A Map<string, unknown> with untyped resolve<T> adds indirection with zero benefit over direct import calls. Two of the three resolved values (rng, reelsModule) are never even used after resolution.
- **Tests [NONE]**: No test file exists. register/resolve behavior and type-cast safety are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or either method. Purpose as a service-locator/DI container is non-obvious from the name alone.

#### `container` (L29–L29)

- **Utility [USED]**: Populated at lines 30–32; paytable resolved at line 129 and passed to evaluateLine.
- **Duplication [UNIQUE]**: No similar variable found in RAG results.
- **Correction [OK]**: All three registrations are valid imports.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Module-level singleton with registered dependencies is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with no explanation of registered keys or lifecycle.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin at lines 143–145 and indexed again at line 165 for wild multiplier calculation.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Matches the 10-payline layout in the reference docs exactly.
- **Overengineering [LEAN]**: Plain data array matching the documented 10-payline definition exactly.
- **Tests [NONE]**: No test file exists. Payline coordinate correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index encoding convention and which patterns correspond to which payline shapes are not documented inline.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine at line 75.
- **Duplication [DUPLICATE]**: Logic is ~95% identical to `lineWins` in src/paytable.ts: same WILD-first resolution, same SCATTER guard, same counting loop with break, same >= 3 threshold. Only differences are field names (`sym`/`run` vs `symbol`/`count`) and local variable names (`lead` vs `first`). Functions are interchangeable in behavior.
- **Correction [OK]**: WILD substitution for lead detection, run counting, and SCATTER/all-WILD guard are correct.
- **Overengineering [LEAN]**: Focused helper: resolves lead symbol through WILDs then counts the matching run. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. WILD-leading logic, SCATTER early-return, run threshold, and mixed-symbol break are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; WILD substitution and SCATTER-exclusion logic are non-trivial and warrant at least a brief description.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic — both resolve WILD-first symbol, guard on SCATTER, count consecutive matching symbols, return null below 3; differ only in return-object field names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin at line 144 for each payline.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Symbol extraction, checkLine delegation, and WILD bonus application are internally consistent.
- **Overengineering [LEAN]**: Single responsibility: maps a payline + reel grid to a LineWin. WILD bonus formula is domain-specific but self-contained and not duplicated elsewhere in this function.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding formula and null-return path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; wild-count bonus formula (basePayout * (1 + wildCount) * 2^wildCount) is a notable undocumented behavior.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin at line 147; spin is runtime-imported by src/index.ts, making this transitively live.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [ERROR]**: House edge applied in wrong direction (increases payout → ~105% RTP); payout rounded up instead of down.
- **Overengineering [LEAN]**: Straightforward reduce with two post-adjustments. Structure is minimal regardless of whether the house-edge direction is correct.
- **Tests [NONE]**: No test file exists. Comment claims house edge reduces RTP to ~95% but code multiplies by (1 + HOUSE_EDGE) — inflating rather than reducing — plus unconditional bet*0.01 bonus. None of this is tested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet, no @returns, and does not document the unconditional floor addition (bet * 0.01) or the use of Math.ceil. (deliberated: confirmed — Confirmed. src/engine.ts:105 computes total * (1 + 0.05) = total * 1.05, increasing payouts 5% instead of reducing them. JSDoc at L97-100 states '95% RTP' — requires (1 - HOUSE_EDGE). L108 adds bet*0.01 unconditionally (nonzero return every spin). L110 uses Math.ceil (rounds up, player-favorable). All three produce RTP >> 100%, contradicting stated intent. Function is called at L138 and transitively live via src/index.ts:1.)

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: bet > 100 emits a warning instead of throwing, violating the arbitrated 1..100 integer contract.
- **Overengineering [LEAN]**: spin's own code is a linear orchestration loop: validate, build reels, evaluate paylines, collect features, return result. The factory/strategy/emitter abstractions it instantiates are defined in other files and will be evaluated there; spin itself does the simple thing of calling them.
- **Tests [NONE]**: No test file exists. Primary exported function used by src/index.ts has zero coverage: invalid-bet validation, free spin triggering, jackpot path, wild multiplier accumulation, and strategy.adjustPayout integration are all untested.
- **DOCUMENTED [DOCUMENTED]**: Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit any on both public export signatures: computePayout(lineWins: LineWin[], bet: any) and spin(bet: any). The Bet alias is already defined in this very file — both parameters should use it. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is a module-level constant typed as number[][] — mutable element access is possible. Should be ReadonlyArray<ReadonlyArray<number>> or as const to prevent accidental row mutation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) throw "invalid bet" (string literal) violates no-throw-literal — must be new Error("invalid bet"); (2) const rng (L120) is declared via container.resolve but never consumed; (3) const reelsModule (L122) is declared via container.resolve but never consumed. Both unused variables violate @typescript-eslint/no-unused-vars. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spin() is the primary public export but has no JSDoc. The Bet type alias also lacks documentation. computePayout has JSDoc. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Two issues: (1) container.resolve<T> silently casts undefined to T when a key is absent (L25) — no null/undefined guard before use; (2) bet > 100 triggers console.warn (L118) instead of throwing, violating the arbitrated Bet = 1..100 contract: the upper bound must be a hard error, not a warning. [L25, L118] |
| 14 | Performance | WARN | MEDIUM | wildMultiplier is re-computed in spin() (L148–L157) by re-iterating paylines and reels — the same wild counts were already processed inside evaluateLine. Additionally, rng and reelsModule are fetched from the container map on every spin call but never used, adding two unnecessary lookups. [L120, L122, L148-L157] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter are instantiated inside spin() with no injection point, making it impossible to substitute deterministic stubs in unit tests. The module-level container singleton cannot be reset between test runs without reimporting the module. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAYLINES and the result object literal are candidates for the satisfies operator to retain literal types while checking structural compatibility. No use of const type params or using declarations where applicable. [L34, L163] |
| 17 | Context-adapted rules | FAIL | HIGH | Gambling domain — two violations: (1) computePayout applies total * (1 + HOUSE_EDGE) = total * 1.05, which INCREASES winning payouts by 5% and produces RTP > 100%. The arbitrated intent mandates 95% RTP; the correct formula is total * (1 - HOUSE_EDGE) = total * 0.95. (2) emitter.on(SPIN_DONE, () => {}) registers a new no-op listener on every spin() invocation, causing unbounded listener accumulation over the lifetime of the process. [L105, L175] |

### Suggestions

- Replace any with the Bet alias already defined in this file
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object to preserve stack trace and allow instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix house-edge direction to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Enforce the upper-bound Bet invariant with a hard throw instead of a warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Mark PAYLINES as a readonly nested array to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`
- Remove unused container.resolve calls for rng and reelsModule
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Remove the no-op listener that accumulates on every spin
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout; slot-machine payouts round down so the house retains the fractional remainder. [L110]
- **[correction · medium · small]** Replace `console.warn` with `throw new Error('invalid bet')` for bet > 100 to enforce the arbitrated 1..100 range contract. [L118]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` in computePayout to reduce payouts by 5% and achieve ~95% RTP instead of ~105%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
