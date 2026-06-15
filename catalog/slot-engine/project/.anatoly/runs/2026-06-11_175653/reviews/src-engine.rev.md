# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias with no RAG matches.
- **Correction [OK]**: Type alias is correct; runtime 1..100 integer constraints are enforced in spin.
- **Overengineering [LEAN]**: Simple type alias, no abstraction overhead.
- **Tests [NONE]**: Type alias with no test file present.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Type alias lacks description of valid range or constraints (e.g. 1–100 integer).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-level constant with no RAG matches.
- **Correction [OK]**: Value 0.05 correctly represents 5%; the defect is in computePayout's application of it, not in the constant itself.
- **Overengineering [LEAN]**: Named constant for a magic number — minimal and appropriate.
- **Tests [NONE]**: No test file exists; transitive coverage via computePayout is moot since computePayout itself has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious value with a semantic impact on RTP; warrants at least an inline explanation.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded branch in spin (L161–163) is permanently dead. Symbol is syntactically referenced but never enables any behavior.
- **Duplication [UNIQUE]**: Module-level constant with no RAG matches.
- **Correction [OK]**: Boolean flag, used correctly in spin for conditional logging.
- **Overengineering [LEAN]**: Simple boolean flag; hardcoded false is dead but not complex.
- **Tests [NONE]**: No test file exists; spin (the only caller) is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag; low severity, but no comment explaining effect.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create the module-level container.
- **Duplication [UNIQUE]**: Simple IoC registry class with no RAG matches.
- **Correction [OK]**: Registry pattern is self-consistent; all keys are registered before being resolved.
- **Overengineering [OVER]**: DIY service-locator / IoC container wrapping a Map<string, unknown> with type-unsafe resolve<T>. All three registered values (weightedPick, getPayMultiplier, reelsModule) are already available as direct module imports at the top of the file and never need runtime substitution. The abstraction adds zero testability benefit (nothing swaps implementations) and introduces unsafe casting. Replace with the three direct import references.
- **Tests [NONE]**: No test file present; register/resolve behavior is never directly or indirectly verified by any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Non-exported but non-trivial: acts as a manual IoC container — purpose is not obvious from name alone.

#### `container` (L29–L29)

- **Utility [USED]**: Resolved in spin for paytable (L127) and rng/reels (L126, L128), with paytable actively passed to evaluateLine (L136).
- **Duplication [UNIQUE]**: Module-level singleton instance with no RAG matches.
- **Correction [OK]**: All three dependencies registered with correct keys and values.
- **Overengineering [LEAN]**: Single instantiation and wiring of EngineContainer. Overengineering is attributed to the class definition; this is just the consumer.
- **Tests [NONE]**: No test file; spin is the only caller and is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal singleton with side-effecting registrations; purpose and lifetime undocumented.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin (L135) and used for wild multiplier recalculation (L147).
- **Duplication [UNIQUE]**: Payline definition array with no RAG matches.
- **Correction [OK]**: All 10 paylines match the reference documentation exactly.
- **Overengineering [LEAN]**: Plain data table of 10 fixed payline paths — appropriate for this domain.
- **Tests [NONE]**: No test file; spin is the only caller and is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index semantics and payline shapes are non-obvious without a comment; none present.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine (L72): `const result = checkLine(symbols)`.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-skip leading-symbol resolution, same consecutive-run loop with WILD substitution, same >= 3 threshold. Only cosmetic differences: variable names (lead vs first) and return property names (sym/run vs symbol/count).
- **Correction [OK]**: Lead-symbol resolution and consecutive-run counting handle WILD substitution and SCATTER-break correctly.
- **Overengineering [LEAN]**: Single-purpose: resolves the effective lead symbol and counts the run. Clean and appropriately sized.
- **Tests [NONE]**: No test file; WILD/SCATTER logic, run-length counting, and minimum-run threshold are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported but non-trivial: WILD-substitution and SCATTER-exclusion logic is not captured in the name alone.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve the leading non-WILD symbol, count a consecutive run allowing WILDs, and return null when run < 3; differs only in return property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin (L136) for every payline.
- **Duplication [UNIQUE]**: No RAG matches. Computes a LineWin from a payline index, applying wild-count bonus multiplier; no equivalent found.
- **Correction [OK]**: Symbol extraction via payline mapping and wild-boost formula are internally consistent; no reference contract specifies the wild bonus magnitude.
- **Overengineering [LEAN]**: Computes line payout including wild bonus in one pass. The exponential wild-boost formula is game logic, not unnecessary complexity.
- **Tests [NONE]**: No test file; wild-count multiplier logic and null-return path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported but complex: wild-multiplier stacking formula `(1 + wildCount) * 2^wildCount` is undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin (L139): `computePayout(wins, bet)`. spin is imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches. Aggregates LineWin payouts, applies HOUSE_EDGE bonus, and adds a flat participation credit.
- **Correction [NEEDS_FIX]**: Two independent bugs: house edge applied with wrong sign (boosts payouts instead of reducing them), and Math.ceil rounds payout up (slot domain requires floor).
- **Overengineering [LEAN]**: Simple reduce plus two adjustments. Minimal for its purpose.
- **Tests [NONE]**: No test file; house-edge application (adds edge instead of reducing payout — likely a bug) and base-bet bonus are untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param descriptions for `lineWins` and `bet` (typed `any`), omits @returns, and does not document the unconditional floor `bet * 0.01`.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches. Orchestrates the full spin lifecycle: reel generation, payline evaluation, scatter/free-spin detection, jackpot check, and event emission.
- **Correction [NEEDS_FIX]**: Bet upper-bound is not enforced: bets > 100 only trigger console.warn and proceed, violating the arbitrated contract (1..100 coins, integer).
- **Overengineering [LEAN]**: Straightforward orchestration: validate bet, build reels, evaluate paylines, aggregate features, return result. The factory, strategy, and emitter instances it creates are defined in other files; per the one-finding-per-source-pattern rule those abstractions are not flagged here. Spin's own code is direct.
- **Tests [NONE]**: No test file; bet validation, free-spin integration, jackpot path, wild-multiplier accumulation, and strategy adjustment are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Primary exported public API. Throw condition for invalid bet, side effects (emitter, free-spin state mutation), and return shape are entirely undocumented in-source. (deliberated: confirmed — Verified two correctness bugs in computePayout (engine.ts:101-111). (1) Line 105: `total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 (line 14) increases payout by 5% instead of decreasing it — comment on line 99 says 'maintain a target RTP of approximately 95%' but the math yields ~105% RTP. Should be `(1 - HOUSE_EDGE)`. (2) Line 108: `total += bet * 0.01` unconditionally adds 1% of bet even on zero-win spins, guaranteeing non-zero payout on every spin. Both are behavioral bugs affecting game economics.)

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on `bet` in both public exports: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). The `Bet` type alias exists on L12 but is not applied to these parameters. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — mutable. Should be `readonly (readonly number[])[]` or use `as const`. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | `throw 'invalid bet'` (L115) violates `no-throw-literal`; `console.warn` (L118) and `console.log` (L160) violate `no-console`; `bet: any` on both public exports triggers `@typescript-eslint/no-explicit-any`. [L115, L118, L160] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has JSDoc; `spin` (L113) and `Bet` (L12) have none. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw 'invalid bet'` (L115) discards the stack trace and breaks `instanceof Error` checks. `EngineContainer.resolve<T>` (L25) casts `Map.get()` — which returns `undefined` for missing keys — directly to `T` with no existence guard, causing silent runtime failures. [L24-L26, L115] |
| 14 | Performance | WARN | MEDIUM | `spin()` allocates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` on every invocation (L124-L126). In a hot-path game loop these should be module-level singletons. A no-op `SPIN_DONE` listener is also registered per call (L175). [L124-L126, L175] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L124-L126) rather than resolving them from the already-present DI container. The module-level `container` singleton (L29) cannot be reset between test runs without re-importing the module. [L29, L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` and the `result` object literal (L163) are natural candidates for `satisfies` to get literal-type inference while preserving assignability checks. `SpinEventEmitter` could implement `Symbol.dispose` and be declared with `using`. [L34, L163] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain inferred from payline/jackpot/scatter/freespin/WILD vocabulary. `computePayout` applies `total * (1 + HOUSE_EDGE)` (L105), which multiplies wins by 1.05 — INCREASING payouts above the raw line-win sum rather than targeting the documented 95% RTP. The correct formula is `total * (1 - HOUSE_EDGE)`. Additionally, `bet: any` on the public wagering API skips compile-time range enforcement for a regulated function. [L101, L105, L113] |

### Suggestions

- Apply the existing `Bet` type alias to both public exports instead of `any`
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw Error instances to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house-edge formula to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES immutable with as const satisfies
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
- Guard EngineContainer.resolve against missing keys
  ```typescript
  // Before
  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
  // After
  resolve<T>(key: string): T {
    const value = this.registry.get(key);
    if (value === undefined) throw new Error(`Service '${key}' not registered`);
    return value as T;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.ceil(total)` with `Math.floor(total)`: slot-machine convention rounds fractional credits down, retaining the sub-credit remainder for the house. [L110]
- **[correction · medium · small]** Add `if (bet > 100) throw 'invalid bet'` (or fold `bet > 100` into the existing guard on L114) to reject bets exceeding the documented maximum of 100 instead of merely warning. [L118]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the 5% house edge reduces payouts toward the 95% RTP target instead of boosting them above it. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
