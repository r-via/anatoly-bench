# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias with no RAG matches.
- **Correction [OK]**: Type alias only; runtime range enforcement belongs to spin().
- **Overengineering [LEAN]**: Trivial type alias, no abstraction overhead.
- **Tests [NONE]**: No test file exists. Type alias with no runtime behavior, but still untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Public type alias with no JSDoc. Purpose (coin denomination? integer constraint?) is not obvious from the name alone, and the type accepts any number including floats despite spin() enforcing integer-only bets.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L104): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-level constant with no RAG matches.
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in computePayout's use of it.
- **Overengineering [LEAN]**: Named constant replacing a magic number.
- **Tests [NONE]**: No test file exists. Critical constant affecting payout math — zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant with no JSDoc. The value 0.05 and its application (applied only when total > 0, then added to rather than subtracted from payout) are non-obvious and undocumented.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded to false; the guarded block in spin (L165-167) is permanently dead and never executes.
- **Duplication [UNIQUE]**: Module-level constant with no RAG matches.
- **Correction [OK]**: Boolean debug flag; no correctness defect.
- **Overengineering [LEAN]**: Simple compile-time boolean flag.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag with no JSDoc. Self-descriptive name and trivial use; low severity.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`, which is used in spin to resolve paytable, rng, and reelsModule.
- **Duplication [UNIQUE]**: Registry/IoC class with no RAG matches.
- **Correction [OK]**: resolve() returns undefined-cast-as-T for missing keys, but all three keys resolved in spin() are registered at construction time.
- **Overengineering [OVER]**: Hand-rolled IoC container (string-keyed Map<string,unknown>, type-unsafe resolve<T> cast) wrapping three statically-imported symbols used only inside spin(). Direct invocation of weightedPick, getPayMultiplier, getReelSymbols, and getReelWeights is simpler and fully type-safe. Single file, single consumer — no runtime substitution is ever performed.
- **Tests [NONE]**: No test file exists. register/resolve behavior and type-unsafe resolve return untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported DI/service-locator class with no JSDoc. Neither the class nor its register/resolve methods are documented; the resolve cast-to-T pattern and lack of missing-key handling are undescribed.

#### `container` (L29–L29)

- **Utility [USED]**: Populated at L30-32 and resolved in spin (L118-120); paytable resolved value is actively passed to evaluateLine.
- **Duplication [UNIQUE]**: Singleton instance with no RAG matches.
- **Correction [OK]**: Registers all keys consumed by spin(); initialization is consistent.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no JSDoc. Its role as the engine's service registry is implicit.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin (L134-136) and used again at L153 for wild multiplier computation.
- **Duplication [UNIQUE]**: Data constant with no RAG matches.
- **Correction [OK]**: Matches reference documentation exactly.
- **Overengineering [LEAN]**: Static data literal for 10 fixed paylines. No abstraction overhead.
- **Tests [NONE]**: No test file exists. Payline correctness (shape, uniqueness, index alignment) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc describing what each row-index array represents, the coordinate convention (col→row), or the 10-line layout. The shape patterns (V, zigzag, etc.) are entirely uncommented.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called from evaluateLine (L71) to detect a winning run on a payline.
- **Duplication [DUPLICATE]**: Logic is ~95% identical to lineWins in src/paytable.ts: both find the lead non-WILD symbol, count consecutive matches (including WILDs), return null for <3 matches. Only differences are property names in the return object (sym/run vs symbol/count) and local variable names (lead/run vs first/count) — no behavioral distinction.
- **Correction [OK]**: Lead-symbol resolution (first non-WILD) and run-counting with WILD substitution are correct; WILD-only and SCATTER-lead cases both return null as expected.
- **Overengineering [LEAN]**: Single-responsibility: resolves lead symbol (with WILD substitution) and measures run length. Length proportional to task.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER/WILD-only rejection, run counting, and run<3 cutoff are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper with no JSDoc. The WILD-as-substitute and SCATTER-returns-null semantics are non-trivial and undocumented, though leniency applies for unexported helpers.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic — same WILD-skip, same consecutive-run counting, same ≥3 threshold; return object carries same data under different property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin (L135) for each payline to compute LineWin entries.
- **Duplication [UNIQUE]**: No RAG matches. Combines payline extraction, checkLine, payout multiplication, and wild bonus calculation — no equivalent elsewhere.
- **Correction [OK]**: Wild-boost formula is internally consistent; no documented contract specifies a different multiplier scheme.
- **Overengineering [LEAN]**: Maps one payline to a LineWin, including WILD-count multiplier. All branches serve the task directly.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding (basePayout * (1+wc) * 2^wc) is a complex formula with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported function with no JSDoc. The wild-count bonus formula `(1 + wildCount) * 2^wildCount` applied on top of the base multiplier is a significant undocumented behavior.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin (L139) to derive totalPayout; exported and transitively reachable from src/index.ts via spin.
- **Duplication [UNIQUE]**: No RAG matches. Applies house-edge adjustment and minimum-bet return; logic is specific to this module.
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied in the wrong direction (increases RTP to ~105% instead of reducing to 95%), and Math.ceil violates slot-domain rounding convention.
- **Overengineering [LEAN]**: Straightforward reduce + house-edge adjustment + floor. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. House-edge application, the unconditional +bet*0.01 bonus, and Math.ceil rounding are untested. Comment claims RTP ~95% but edge is added on top of wins, inflating actual RTP — doc divergence risk.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and RTP intent but omits @param docs for lineWins and bet (typed as any), @returns description, and the unconditional floor of bet*0.01 added regardless of wins. The house-edge application direction (multiplies up, not down) also contradicts the stated 95% RTP goal and is unexplained.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches. Orchestrates the full spin lifecycle across container, factory, strategy, emitter, and free-spin/jackpot subsystems.
- **Correction [NEEDS_FIX]**: Bets above 100 are only warned about, not rejected; arbitrated contract specifies Bet as 1..100 coins.
- **Overengineering [LEAN]**: spin's own logic is linear: validate bet, build reels, iterate PAYLINES, detect scatter/jackpot, assemble result. Upstream abstractions (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter) are defined in other files and will be evaluated there.
- **Tests [NONE]**: No test file exists. Exported to src/index.ts (production entry point). Bet validation, free-spin triggering, jackpot path, wildMultiplier aggregation, and strategy delegation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc. No documentation of the bet parameter constraints (integer, 1–100), return shape, thrown exception type (string literal rather than Error), or side effects (emitter, strategy adjustment). (deliberated: confirmed — Confirmed. computePayout (engine.ts:105) applies `total * (1 + HOUSE_EDGE)` which INCREASES payout by 5% — the opposite of house edge semantics. The JSDoc at L98-100 states 'target RTP of approximately 95%' but the math yields >100% RTP. Additionally, engine.ts:108 `total += bet * 0.01` guarantees non-zero payout on every spin, further inflating RTP. The container-resolved `rng` (L120) and `reelsModule` (L122) are never used — actual RNG flows through factory.buildReels → spinReel → pickFromWeighted, bypassing the container entirely. `bet: any` at L113 and `throw "invalid bet"` (string, not Error) at L115 are secondary defects. The computePayout math error is a genuine behavioral bug in a gambling engine.)

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Two public exports use explicit any: computePayout(lineWins, bet: any) and spin(bet: any). Both parameters should be typed as Bet (already exported from this file), providing validation at compile time instead of the runtime guard at L105-L107. [L97, L103] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is declared as number[][] with no readonly modifier. A module-level constant in a gaming engine should be readonly (readonly number[][]) or as const to prevent accidental mutation. [L35] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) throw "invalid bet" fires no-throw-literal — must throw an Error object; (2) rng resolved at L110 but never referenced afterward (no-unused-vars); (3) reelsModule resolved at L112 but never referenced afterward (no-unused-vars). factory.buildReels and the direct paytable call bypass both injected modules entirely. [L108, L110, L112] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computePayout has JSDoc; spin (the primary public export) and the Bet type alias have none. [L103] |
| 12 | Async/Promises/Error handling | WARN | HIGH | throw "invalid bet" (L108) throws a string literal; callers that guard with instanceof Error will silently swallow it. container.resolve<T> casts unknown as T with no undefined guard (L22) — a missing key produces undefined typed as T, causing a silent runtime crash at the first property access downstream. [L108, L22] |
| 13 | Security | WARN | MEDIUM | Gambling domain inferred from reel/payline/scatter/jackpot/wild vocabulary. The RTP formula at L99-L101 applies total * (1 + HOUSE_EDGE) = total * 1.05, boosting payouts by 5% instead of reducing them. The arbitrated intent states the engine targets 95% RTP (5% house edge) — this formula produces >100% RTP, a compliance violation. Correct to total * (1 - HOUSE_EDGE). No hardcoded secrets, no eval, no injection vectors found. [L99-L101] |
| 14 | Performance | WARN | MEDIUM | emitter.on(SPIN_DONE, () => {}) at L170 registers a new no-op listener on every spin() call with no corresponding off(). Across many spins the listener list grows unboundedly. The listener does nothing and should be removed entirely. [L170] |
| 15 | Testability | WARN | MEDIUM | Module-level container singleton (L27) is not injectable from tests. factory, strategy, and emitter are constructed inside spin() with no injection point, requiring monkey-patching to substitute test doubles. Consider accepting an optional deps parameter or wrapping spin into a class with constructor injection. [L27-L30, L119-L121] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No satisfies, const type parameters, or using declarations used anywhere. PAYLINES is the clearest opportunity: as const satisfies readonly (readonly number[])[] would provide exact literal types and an immutability guarantee simultaneously. [L35] |
| 17 | Context-adapted rules | WARN | MEDIUM | DI container registers rng and reels (L27-L29) but spin() ignores them — factory.buildReels() and the direct paytable usage bypass both. Dead DI registrations misrepresent the actual dependency graph. In a slot engine this is especially confusing: it implies the RNG can be swapped via DI, but the factory does not consume the injected rng reference. [L27-L29, L110, L112, L125] |

### Suggestions

- Replace bet: any with the already-exported Bet type in both public signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix the RTP formula — (1 + HOUSE_EDGE) boosts payouts; (1 - HOUSE_EDGE) applies the house edge as documented
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw a proper Error object to allow instanceof guards in catch blocks
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError(`Invalid bet: expected integer 1–100, received ${String(bet)}`);`
- Remove the no-op listener that accumulates on every spin() call
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Remove unused DI resolutions or wire them into the actual spin logic
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  // Pass rng into factory so the injected RNG is actually used:
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  // Remove reelsModule or thread it through factory.buildReels
  ```
- Lock PAYLINES with as const satisfies for literal types and compile-time immutability
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // payline arrays
  ] as const satisfies readonly (readonly number[])[];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor: slot-machine payouts must round down so the house retains fractional remainders; Math.ceil currently inflates every payout. [L110]
- **[correction · medium · small]** Replace `console.warn` with a throw when bet > 100, enforcing the arbitrated 1..100 integer range consistently with the lower-bound check on L114. [L118]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to deduct the 5% house edge rather than add it, achieving the documented 95% RTP target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
