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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 82% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias. No similar symbols found.
- **Correction [OK]**: Type alias only; runtime enforcement in spin() covers the 1..100 integer constraint.
- **Overengineering [LEAN]**: Single-line type alias for number. Minimal, no complexity.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public type with no description of valid range or usage semantics.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to scale total payout upward.
- **Duplication [UNIQUE]**: Module-scoped numeric constant. No similar symbols found.
- **Correction [OK]**: Constant value 0.05 is correct; the misapplication lives in computePayout, not here.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE affects payout computation but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name conveys intent but the exact effect on payout math is undocumented.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false makes the guarded console.log block permanently unreachable; the constant is referenced but never toggleable at runtime.
- **Duplication [UNIQUE]**: Module-scoped boolean constant. No similar symbols found.
- **Correction [OK]**: Used correctly in the in-file conditional log in spin(); no defect.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag; self-descriptive name, tolerable as a private constant.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as module-level container at L29; its resolve method is called in spin.
- **Duplication [UNIQUE]**: Local DI container class. No similar symbols found.
- **Correction [OK]**: resolve() casts unknown to T without a missing-key guard, but all three registered keys have matching resolve() calls in spin() — no concrete missing-key dereference path exists.
- **Overengineering [OVER]**: Bespoke DI container (register/resolve via Map) built for 3 static module-level imports that never change at runtime. Direct usage of the imported functions (weightedPick, getPayMultiplier, getReelSymbols/getReelWeights) would be equivalent and clearer. Adds string-keyed indirection and an unsafe cast (as T) with zero payoff.
- **Tests [NONE]**: No test file exists. register/resolve behavior, type-safety gaps, and missing-key behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or either method. Purpose as a DI registry is non-obvious from name alone.

#### `container` (L29–L29)

- **Utility [USED]**: resolve called three times in spin; paytable resolution is functionally needed. rng and reelsModule are resolved but unused, so the container provides only partial value, but it is actively referenced.
- **Duplication [UNIQUE]**: Module-scoped singleton instance. No similar symbols found.
- **Correction [OK]**: All three registrations match their resolve() calls in spin(); no defect.
- **Overengineering [LEAN]**: Straightforward instantiation of EngineContainer; over-engineering source is the class definition, not this consumer.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal module-level singleton; no comment explaining what it holds or why.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin's main win-detection loop and again in the wild-multiplier accumulation block.
- **Duplication [UNIQUE]**: Static payline configuration data. No similar symbols found.
- **Correction [OK]**: Matches reference documentation verbatim.
- **Overengineering [LEAN]**: Static data table; no abstraction needed or added.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluation; correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining row-index encoding, coordinate system, or the meaning of each pattern.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called inside evaluateLine to determine leading symbol and run length.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-skip lead detection, same run-counting loop with WILD pass-through, same >=3 threshold, same null return. Only differences are variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Both functions are interchangeable given the same input contract.
- **Correction [OK]**: WILD-as-lead and mid-run WILD substitution handled correctly; SCATTER guard in place; all-WILD payline correctly returns null.
- **Overengineering [LEAN]**: Single-purpose helper: resolves WILD-leading runs and counts consecutive matches. Clear and minimal.
- **Tests [NONE]**: No test file exists. WILD-lead resolution, SCATTER short-circuit, run counting, and minimum-run threshold (3) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported helper; WILD substitution logic and null return semantics are not described.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — same WILD-aware lead detection, identical counting loop, identical threshold and null return; only variable and property names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called for every payline in spin's main loop to collect LineWin entries.
- **Duplication [UNIQUE]**: No similar functions found. Combines line extraction, checkLine invocation, pay multiplier lookup, and wild bonus multiplication into a single pipeline not replicated elsewhere.
- **Correction [OK]**: Wild multiplier formula is internally consistent and mirrored by the SpinResult.wildMultiplier field; reference docs do not specify the formula must be absent from per-line payout calculation.
- **Overengineering [LEAN]**: Maps a payline to a LineWin by composing checkLine and the paytable. Wild-bonus arithmetic is domain logic, not gratuitous complexity.
- **Tests [NONE]**: No test file exists. Wild-count multiplier formula and payout calculation are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported helper with five parameters including a function callback; none are described.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called directly inside spin (L~151); transitively used by the runtime-imported spin function.
- **Duplication [UNIQUE]**: No similar functions found. Applies house-edge inflation and minimum-return floor in a pattern not replicated elsewhere.
- **Correction [NEEDS_FIX]**: Two bugs: house edge applied in the wrong direction (multiplies payouts up by 5% instead of reducing by 5%), and Math.ceil rounds fractional payouts up when slot-machine convention requires rounding down.
- **Overengineering [LEAN]**: Simple reduce + two arithmetic adjustments. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. House-edge application, flat bet bonus, zero-win path, and Math.ceil rounding are untested. Exported and used by spin; critical business logic.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent, but omits @param for both lineWins and bet, omits @returns, and does not explain the unconditional bet*0.01 floor or the Math.ceil rounding behavior.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found. Orchestrates reel generation, payline evaluation, scatter/free-spin detection, jackpot check, wild multiplier aggregation, and event emission — a top-level entry point with no duplicate.
- **Correction [NEEDS_FIX]**: Max bet of 100 coins is not enforced — bets above 100 only emit console.warn and proceed, violating the arbitrated Bet contract (1..100 coins, integer).
- **Overengineering [LEAN]**: The function's own logic (payline loop, scatter/freespin delegation, jackpot check, result assembly) is straightforward. It consumes StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter from other files — those abstractions are the source of any over-engineering and will be evaluated in their own files per rule 8.
- **Tests [NONE]**: No test file exists. Input validation (invalid bet throws, >100 warns), reel construction, payline evaluation, scatter/free-spin wiring, jackpot detection, and event emission are all untested. Primary public API imported by src/index.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the primary exported function. Bet validation rules, thrown string error, emitter side-effect, and SpinResult structure are all undocumented. (deliberated: confirmed — Confirmed multiple correctness defects. (1) Inverted house edge at engine.ts:105: `total * (1 + HOUSE_EDGE)` multiplies payout by 1.05 instead of 0.95, contradicting the JSDoc at engine.ts:98-99 which states '95% RTP'. This gives the house a negative edge — the casino loses money. Should be `(1 - HOUSE_EDGE)`. (2) engine.ts:115: `throw "invalid bet"` throws a string, not an Error — callers using `instanceof Error` will miss it, no stack trace captured. This is a public API re-exported at src/index.ts:1. (3) engine.ts:108: `total += bet * 0.01` adds a guaranteed 1% minimum payout on every spin regardless of outcome, which inflates RTP further. (4) engine.ts:101: `bet: any` when `Bet = number` is defined at line 12. (5) engine.ts:120-122: `rng` and `reelsModule` resolved from container but never used — reels are built via factory.buildReels → spinReel → pickFromWeighted (reels.ts), bypassing the container entirely. The inverted house edge alone is a severe financial logic bug. Increasing confidence from 55 to 92.)

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both public export signatures. `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113) should both use the already-exported `Bet` type. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — a module-level constant array that is never mutated. Should be `readonly number[][]` (or `as const`) to prevent accidental writes. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L115) violates `no-throw-literal`. `emitter.on(SPIN_DONE, () => {})` (L175) violates `@typescript-eslint/no-empty-function`. Both are straightforward lint-clean violations. [L115, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is the primary public export and has no JSDoc. `computePayout` has JSDoc but the comment claims 95% RTP while the implementation multiplies total by 1.05 (increases payout) — misleading documentation. [L97-L100, L113] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` (L115) throws a string primitive. This breaks `instanceof Error` checks, loses the stack trace, and is uncatchable as a typed error by callers. Must be `throw new RangeError("...")`. [L115] |
| 15 | Testability | WARN | MEDIUM | `spin` hardcodes `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` (L124-126) despite `EngineContainer` existing for DI. These three dependencies cannot be replaced in tests without module-level monkey-patching. [L124-L126] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from reel/payline/scatter/jackpot/lineBet vocabulary. Two domain-specific violations: (1) `computePayout` applies `total * (1 + HOUSE_EDGE)` = ×1.05, which increases winning payouts by 5% instead of reducing them — the inverse of the arbitrated 95% RTP contract. (2) `bet > 100` only emits `console.warn` (L118) rather than throwing, silently accepting out-of-range bets past the 1–100 integer contract. [L105, L118] |

### Suggestions

- Replace `any` with the exported `Bet` type on both public function signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance to preserve stack trace and support instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError("invalid bet: must be an integer between 1 and 100");`
- Enforce the upper bet bound instead of warning past it
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new RangeError("bet exceeds maximum: must be <= 100");`
- Fix house-edge direction to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05, increasing payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95, applying 5% house cut`
- Mark PAYLINES as readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly number[][] = [`
- Register and resolve factory, strategy, and emitter via EngineContainer for testability
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  const factory = container.resolve<StandardReelBuilderFactory>("factory");
  const strategy = container.resolve<DefaultStrategy>("strategy");
  const emitter = container.resolve<SpinEventEmitter>("emitter");
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout, replace Math.ceil with Math.floor so the house retains fractional coins per slot-machine industry convention. [L110]
- **[correction · medium · small]** In spin, replace `console.warn('bet exceeds maximum')` with `throw new Error('bet exceeds maximum')` to enforce the upper bound of 100 coins per the arbitrated Bet contract, consistent with the bet < 1 guard above it. [L118]

### Refactors

- **[correction · high · large]** In computePayout, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so winning payouts are reduced by 5%, achieving the documented 95% RTP / 5% house-edge contract. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
