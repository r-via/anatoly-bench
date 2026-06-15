# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 88% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Internal constant used in computePayout at L110 to adjust total payout.
- **Duplication [UNIQUE]**: Numeric constant. No similar definitions found.
- **Correction [OK]**: Value 0.05 is correct; misapplication is in computePayout, not here.
- **Overengineering [LEAN]**: Standard named constant for a magic number.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math but is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose and effect on payout calculation not documented inline.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Internal constant checked in spin function at L173 for debug logging.
- **Duplication [UNIQUE]**: Boolean constant. No similar definitions found.
- **Correction [OK]**: Boolean constant, no issues.
- **Overengineering [LEAN]**: Simple boolean flag; minimal.
- **Tests [NONE]**: No test file exists. Constant is always false; dead code path is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Flag with no explanation of what debug behavior it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Internal class instantiated at L29 to create the container object.
- **Duplication [UNIQUE]**: Service locator implementation. No similar classes found.
- **Correction [NEEDS_FIX]**: resolve() casts Map.get() result to T without checking for key absence; missing key silently propagates as undefined typed as T.
- **Overengineering [OVER]**: Custom service-locator for 3 fixed dependencies (`rng`, `paytable`, `reels`) that could be imported directly. Uses `Map<string, unknown>` with unsafe casts. Single consumer (`spin`). Classic premature DI infrastructure in a simple game engine.
- **Tests [NONE]**: No test file exists. register/resolve logic and type-unsafe cast are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Purpose as a service locator/DI container, and the typed resolve pattern, are undocumented.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Internal array iterated in spin loop at L132-L133 and accessed at L154 to extract line symbols.
- **Duplication [UNIQUE]**: Game payline configuration. No similar definitions found.
- **Correction [OK]**: 10 paylines, row values all in [0,2], 5 elements each — consistent with a 5-reel 3-row grid.
- **Overengineering [LEAN]**: Plain data array defining 10 paylines — appropriate for a slot engine.
- **Tests [NONE]**: No test file exists. Payline coordinate data drives all win evaluation but is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Array semantics (row indices per reel column) and the 10-line layout are not explained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Internal function called by evaluateLine at L69 to check payline matches.
- **Duplication [DUPLICATE]**: Identical logic to lineWins in paytable.ts — same symbol matching algorithm with WILD handling and 3+ run requirement. Only differences are variable naming (lead/first, run/count, sym/symbol) and export status.
- **Correction [OK]**: WILD substitution for lead symbol and run counting are logically correct; all-WILD payline correctly returns null.
- **Overengineering [LEAN]**: Focused WILD-aware run-detection helper; logic matches slot machine requirements.
- **Tests [NONE]**: No test file exists. WILD-lead substitution, SCATTER short-circuit, and run-length cutoff logic are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD substitution logic, SCATTER exclusion, and minimum run length of 3 are undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — Identical functional behavior — both identify leading symbol, validate against WILD/SCATTER, count consecutive matches, return structured result or null

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Internal function called in spin at L133 to evaluate each payline and generate line wins.
- **Duplication [UNIQUE]**: Combines symbol checking with payout calculation and wild multiplier logic. No similar functions found.
- **Correction [OK]**: Wild multiplier applied once here; spin() recomputes it only for the metadata field, no double-application to totalPayout.
- **Overengineering [LEAN]**: Single-responsibility payline evaluator with injected pay function; complexity is proportional to the wild-bonus calculation.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-return path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Parameters, wild multiplier formula ((1+wc)*2^wc), and nullable return are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called in spin at L135; transitively used via spin which is runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Aggregates line wins with house edge and bonus adjustment. No similar functions found.
- **Correction [ERROR]**: Three independent defects collectively make RTP exceed 100%, violating the arbitrated 95% RTP / 5% house-edge invariant (README).
- **Overengineering [LEAN]**: Simple reduce + arithmetic; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE inflation on wins, guaranteed 1% bet floor, and Math.ceil rounding are all untested. Called by spin which is the public entry point.
- **PARTIAL [PARTIAL]**: JSDoc describes house-edge application and RTP target, but omits parameter types/descriptions, the +1% floor added unconditionally, Math.ceil rounding, and the `bet: any` type issue. (deliberated: confirmed — Confirmed ERROR. Three defects at src/engine.ts: (1) L105: `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payouts 5% instead of reducing them. README (L42) specifies 95% RTP / 5% house edge, requiring `(1 - HOUSE_EDGE)`. (2) L108: `total += bet * 0.01` unconditionally adds 1% of bet on every spin, guaranteeing a return even on losing spins, further inflating RTP above 100%. (3) L101: `bet: any` bypasses the type system; `Bet` type alias exists at L12 but is unused in the signature. All three issues are verified by reading the actual formulas against the documented 95% RTP invariant.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig not provided; explicit any on public API signatures (rule 2) indicates strict enforcement is absent or incomplete. |
| 2 | No any | FAIL | CRITICAL | Explicit any on both public exports: computePayout(lineWins: LineWin[], bet: any) and spin(bet: any). The arbitrated Bet contract defines the type as a bounded integer — both parameters must be typed Bet. [L100, L112] |
| 3 | Discriminated unions | WARN | MEDIUM | EngineContainer.resolve<T>() widens via as T with no runtime guard. A branded-token registry or discriminated union of service descriptors eliminates the unsafe cast. [L25] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is typed number[][] with no readonly annotation. Should be readonly number[][] or appended with as const. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) throw "invalid bet" triggers no-throw-literal — must be throw new Error(...). (2) rng resolved at L119 is never referenced. (3) reelsModule resolved at L121 is never referenced; factory.buildReels is called directly, making the resolve dead code. [L114, L119, L121] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spin() — the primary public API — has no JSDoc. Bet type alias also lacks a doc comment. computePayout is documented. [L112] |
| 12 | Async/Promises/Error handling | WARN | HIGH | throw "invalid bet" (L114) throws a string literal. Callers cannot branch on instanceof Error and stack traces are lost. Use throw new Error("invalid bet"). [L114] |
| 13 | Security | FAIL | HIGH | Gambling domain inferred from WILD/SCATTER/JACKPOT/PAYLINES/freeSpins/lineWins vocabulary. Three compliance violations: (1) The registered certified RNG (weightedPick) is resolved into rng at L119 but never called — reels are produced by factory.buildReels(5, 3) whose RNG source is opaque, bypassing the registered RNG entirely. (2) computePayout applies total * (1 + HOUSE_EDGE), multiplying wins by 1.05 and producing ~105% effective RTP on win events — the inverse of the arbitrated 95% RTP contract; correct formula is total * (1 - HOUSE_EDGE). (3) The unconditional total += bet * 0.01 further distorts RTP by guaranteeing return on every spin. All three affect financial correctness in a regulated-gambling context. [L104, L107, L119] |
| 14 | Performance | WARN | MEDIUM | The wildMultiplier loop (L147-L156) re-maps each winning payline's row indices to symbols — work already performed inside evaluateLine. Return symbols from evaluateLine or cache them on LineWin to avoid redundant iteration. [L147-L156] |
| 15 | Testability | WARN | MEDIUM | spin() directly instantiates StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter with new. None can be injected or mocked, making deterministic unit testing impossible. These should be registered in the container or accepted as parameters. [L123-L125] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No satisfies, const type params, or using. Container registration sites are a natural fit for satisfies to validate service conformance at compile time. |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues: (1) emitter.on(SPIN_DONE, () => {}) at L174 registers a fresh no-op listener on every spin() call with no cleanup, leaking listeners — use emitter.once() or remove the registration. (2) bet > 100 triggers only console.warn (L117) but the arbitrated Bet contract restricts values to 1..100; exceeding bets must throw, not warn. [L117, L174] |

### Suggestions

- Replace any with Bet on both public signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix the inverted house-edge formula to produce 95% RTP per arbitrated contract
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 → ~105% RTP on wins`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 → ~95% RTP`
- Reject bets above 100 instead of warning — enforces the arbitrated 1..100 Bet range
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Remove unused rng and reelsModule resolves or thread rng into factory
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  // Pass rng to factory so the certified RNG drives reel outcomes:
  const rng = container.resolve<typeof weightedPick>("rng");
  const reels = factory.buildReels(5, 3, rng);
  ```
- Remove the no-op listener that leaks on every spin
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Mark PAYLINES as readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly number[][] = [`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor so the house retains fractional remainders (casino payout convention). [L110]
- **[correction · medium · small]** Throw an error when bet > 100 (matching the existing throw on L114–L116) to enforce the 1..100 range invariant. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) to deduct 5% from wins instead of adding 5%. [L105]
- **[correction · high · large]** Remove unconditional total += bet * 0.01; it adds a guaranteed per-spin return that inflates RTP above 100%. [L108]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Add a key-existence guard in EngineContainer.resolve before the as T cast, or throw for unknown keys. [L25]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
