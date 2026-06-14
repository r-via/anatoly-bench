# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | GOOD | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Type-only imported by src/index.ts; removing it breaks compilation.
- **Duplication [UNIQUE]**: Simple type alias with no RAG matches.
- **Correction [OK]**: Type alias only; range enforcement delegated to spin() runtime guard.
- **Overengineering [LEAN]**: Simple type alias for number. 1 importer is low but the alias adds no wrapping logic.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. No documentation of valid range, units, or constraints (e.g. integer-only, 1–100 enforced in spin()).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 106: `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches.
- **Correction [OK]**: Constant value 0.05 is correct; the application error lives in computePayout.
- **Overengineering [LEAN]**: Named constant for a domain-significant magic number. Appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE affects computePayout output but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private module-level constant, no JSDoc. Non-exported, so low severity, but value affects all payouts.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the guarded `console.log` block in spin() is permanently unreachable dead code. No runtime value.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches.
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Dead boolean flag gating a single console.log. Simple constant, no extra machinery.
- **Tests [NONE]**: No test file exists. Dead constant (always false); branch it guards is untestable as written.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private flag, no JSDoc. Non-exported; name is self-explanatory.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create `container`.
- **Duplication [UNIQUE]**: IoC container class with no RAG matches.
- **Correction [OK]**: All three keys are registered before any resolve call in this file.
- **Overengineering [OVER]**: Hand-rolled DI container (string-keyed register/resolve) for 3 static module imports that are bound at startup and never change at runtime. Direct imports of weightedPick, getPayMultiplier, getReelSymbols, getReelWeights would eliminate this class entirely with no loss of testability or flexibility.
- **Tests [NONE]**: No test file exists. register/resolve behavior, missing-key behavior, and type-cast safety are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container class with no JSDoc on the class or its methods. Purpose (service locator pattern) is non-obvious from the name alone.

#### `container` (L29–L29)

- **Utility [USED]**: register() called at lines 30–32; resolve() called at lines 118–120 inside spin().
- **Duplication [UNIQUE]**: Module singleton instance with no RAG matches.
- **Correction [OK]**: Registration is correct; unused rng/reelsModule resolutions in spin() are style concerns, not correctness bugs.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton, not exported, no JSDoc. Internal detail; low severity.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin() loop (line 131) and indexed at line 155 for wild multiplier calculation.
- **Duplication [UNIQUE]**: Payline grid data with no RAG matches.
- **Correction [OK]**: Matches reference documentation exactly.
- **Overengineering [LEAN]**: Pure data constant for 10 fixed payline patterns. Matches reference docs exactly.
- **Tests [NONE]**: No test file exists. Payline definitions (shape, row bounds) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: 10 payline definitions with no JSDoc explaining row-index semantics, ordering conventions, or shape patterns. Non-obvious without external docs.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine at line 72.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-skip to find leading symbol, same SCATTER/WILD early-exit, same counting loop with break, same ≥3 threshold. Only differences are variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Functions are fully interchangeable after a rename.
- **Correction [OK]**: Lead detection and run counting are logically correct; all-WILD edge case handled via ?? fallback and null return.
- **Overengineering [LEAN]**: Single-responsibility helper: resolves WILD-substituted lead symbol and counts the consecutive run. Appropriate complexity.
- **Tests [NONE]**: No test file exists. WILD-lead resolution, SCATTER early-return, run < 3 cutoff, and mixed WILD/symbol runs are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, not exported. No JSDoc; logic for WILD substitution and SCATTER exclusion is non-trivial. Lenient due to private scope.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve lead symbol past WILDs, count consecutive matching/WILD symbols, gate on run>=3, return symbol+count tuple

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside spin() at line 132.
- **Duplication [UNIQUE]**: No RAG matches. Unique composition of payline mapping, checkLine call, wild-boost multiplier, and LineWin construction.
- **Correction [OK]**: Symbols extracted column-major (reels[col][row]) per spec; wild multiplier bonus formula not contradicted by reference docs.
- **Overengineering [LEAN]**: Higher-order payFn parameter decouples the paytable and is justified. Combines symbol extraction, run check, WILD boost, and payout in one cohesive unit. Appropriate.
- **Tests [NONE]**: No test file exists. Wild-boost multiplier formula, zero-win path, and lineBet scaling are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, not exported. No JSDoc; wild-boost formula (1+wc)*2^wc is non-obvious and undocumented. Lenient due to private scope.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called directly in spin() at line 134; also exported for external consumers.
- **Duplication [UNIQUE]**: No RAG matches. Unique house-edge application and base-bet bonus logic.
- **Correction [NEEDS_FIX]**: House edge applied in wrong direction (boosts payout rather than reducing it, implying RTP > 100%); Math.ceil further over-pays the player.
- **Overengineering [LEAN]**: Simple reduce with two post-processing steps. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE application (only on positive totals), floor bet bonus, and Math.ceil rounding are untested. Exported and critical to RTP correctness.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent, but omits @param descriptions for lineWins and bet (bet is typed any), no @returns, and does not document the unconditional floor (bet*0.01) or ceiling (Math.ceil).

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches. Orchestrates reel build, payline evaluation, scatter/free-spin detection, jackpot check, wild multiplier aggregation, and event emission.
- **Correction [NEEDS_FIX]**: Upper-bound of bet range (max 100) is not enforced; arbitrated intent requires a hard 1..100 integer constraint.
- **Overengineering [LEAN]**: Orchestration function whose own code is straightforward. StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter are abstractions defined in other files; per the single-source rule spin is not penalized for upstream design choices.
- **Tests [NONE]**: No test file exists. Only public entry point (imported by src/index.ts). Bet validation, jackpot path, free-spin state mutation, wildMultiplier accumulation, and strategy delegation are all untested.
- **DOCUMENTED [DOCUMENTED]**: Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed multiple real bugs. (1) src/engine.ts:105 — `total * (1 + HOUSE_EDGE)` applies house edge backwards; comment on L99 says 'target RTP of ~95%' but code yields ~105% RTP. Should be `(1 - HOUSE_EDGE)`. (2) src/engine.ts:108 — `total += bet * 0.01` adds 1% of bet to every result including losses; combined with Math.ceil on L110, every losing spin returns ≥1 unit. (3) src/engine.ts:115 — throws string literal instead of Error object. (4) src/engine.ts:120,122 — `rng` and `reelsModule` resolved from container but never used; factory.buildReels (src/factories.ts:12) calls spinReel → pickFromWeighted, completely bypassing the container-registered weightedPick.)

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` in both public API signatures: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). `Bet` is already exported from this same file — both parameters should use it. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is a module-level constant typed as mutable `number[][]` (L34). It should be `ReadonlyArray<readonly number[]>` or declared with `as const` to prevent accidental mutation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` at L115 — string literal throw fires `@typescript-eslint/no-throw-literal`; (2) `rng` resolved at L120 but never consumed — `no-unused-vars`; (3) `reelsModule` resolved at L122 but never consumed — `no-unused-vars`. The factory builds reels independently, making both container lookups dead code. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` (L113) — the primary public API — and `Bet` (L12) are exported without JSDoc. `computePayout` has a doc comment; parity is missing for `spin`. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | MEDIUM | Bet > 100 emits `console.warn` (L118) but is not rejected. The arbitrated contract fixes the valid range at 1–100 coins; a caller passing `bet = 500` proceeds silently through the full spin. Additionally, `throw "invalid bet"` (L115) discards the stack trace — use `throw new Error(...)`. [L115, L118] |
| 14 | Performance | WARN | MEDIUM | Wild count per line is computed twice: once inside `evaluateLine` (L80–83) and again in the `spin()` wild-multiplier loop (L148–157). Returning `wildCount` from `LineWin` (or from `evaluateLine`) would eliminate the redundant re-scan. [L80-L83, L148-L157] |
| 15 | Testability | WARN | MEDIUM | `spin()` hardcodes `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` (L124–L126). None of these can be swapped in unit tests. Expose them as optional parameters or register/resolve them from the existing container. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` is unused. `PAYLINES` (L34) and the `result` object literal (L163) are natural candidates: `[...] as const satisfies ReadonlyArray<readonly number[]>` and `{ ... } satisfies SpinResult`. [L34, L163] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/slot-machine domain inferred from reel/payline/jackpot/scatter/freespin vocabulary. `computePayout` multiplies the total by `(1 + HOUSE_EDGE)` = 1.05 (L105), which INCREASES payouts by 5% and produces >100% RTP — directly contradicting the stated 95% RTP target. The correct formula is `total * (1 - HOUSE_EDGE)`. In regulated gaming, incorrect RTP is a compliance violation. [L101-L111] |

### Suggestions

- Replace `any` with the already-exported `Bet` type in both public signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix house-edge direction to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object (preserves stack trace) and enforce the 100-coin ceiling
  ```typescript
  // Before
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");
  // After
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw new Error("invalid bet: must be an integer between 1 and 100");
  }
  if (bet > 100) throw new Error("bet exceeds maximum: must be ≤ 100");
  ```
- Make PAYLINES immutable and use `satisfies` for type-checked `as const`
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    ...
  ];
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    ...
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Remove the two dead container resolutions (`rng`, `reelsModule`) that are resolved but never consumed
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Carry `wildCount` out of `evaluateLine` in `LineWin` to avoid re-scanning symbols in `spin()`
  ```typescript
  // Before
  return {
    lineIndex,
    symbol: result.sym,
    count: result.run,
    payout: basePayout,
  };
  // After
  return {
    lineIndex,
    symbol: result.sym,
    count: result.run,
    wildCount,
    payout: basePayout,
  };
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.ceil(total)` with `Math.floor(total)` to follow slot-machine convention: fractional remainder stays with the house. [L110]
- **[correction · medium · small]** Add `|| bet > 100` to the throwing validation condition and remove the separate console.warn, so bets outside 1..100 are rejected rather than silently accepted. [L114]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` so the house correctly retains 5% of winnings and RTP targets 95%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
