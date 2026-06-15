# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 82% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 60% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 72% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout function at line 107
- **Duplication [UNIQUE]**: Constant numeric value. No duplicates found.
- **Correction [OK]**: Value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named magic constant, appropriate.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose and RTP impact are not documented at the declaration site.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used in spin function at line 171
- **Duplication [UNIQUE]**: Constant boolean flag. No duplicates found.
- **Correction [OK]**: Correctly gates debug logging.
- **Overengineering [LEAN]**: Simple boolean flag; guarded block at L170 is trivially dead code but that is a correctness concern, not an overengineering one.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag with no explanation of what debug output is produced.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated to create container variable at line 29
- **Duplication [UNIQUE]**: Service locator container with register/resolve methods. No duplicates found.
- **Correction [OK]**: resolve() silently returns undefined for unknown keys, but all registered keys are always present in this file.
- **Overengineering [OVER]**: Hand-rolled service-locator with stringly-typed `register`/`resolve` and `Map<string, unknown>` casts — all to wrap three static module imports that never change at runtime. Direct imports would be zero-overhead and fully typed. The pattern adds indirection, erases types at the boundary, and provides no benefit a real DI framework would justify (no lifecycle, no scoping, no testing swap-out).
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container class, not exported, but its purpose and lifecycle are undocumented. Neither the class nor its methods carry JSDoc.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin function at lines 117-118 and accessed at line 163
- **Duplication [UNIQUE]**: Constant payline configuration array. No duplicates found.
- **Correction [OK]**: Matches the reference documentation exactly.
- **Overengineering [LEAN]**: Static data table exactly matching the documented 10-payline spec.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The coordinate encoding (row-index per column) and payline shapes are not explained at the declaration.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 74
- **Duplication [DUPLICATE]**: 93% identical to lineWins in paytable.ts — both identify lead symbol (handling WILD), verify non-WILD/SCATTER, count consecutive matches, return null if count < 3. Only difference: return object property names (sym/run vs symbol/count).
- **Correction [OK]**: Lead-symbol detection handles all-WILD and leading-WILD cases; run counting correctly breaks on the first non-matching non-WILD symbol.
- **Overengineering [LEAN]**: Single-purpose: resolves lead symbol and counts the run. Straightforward loop.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: WILD-only runs, SCATTER early-exit, runs of exactly 2 (boundary), mixed WILD leading.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, not exported. No JSDoc explaining WILD substitution semantics or why SCATTER returns null.

> **Duplicate of** `src/paytable.ts:lineWins` — Same semantic logic: identify lead symbol, handle WILD/SCATTER, count consecutive matches with WILDs, return {symbol, count} if >= 3.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called by spin function at line 118 for each payline
- **Duplication [UNIQUE]**: Extracts symbols from reels via payline, evaluates line win, applies wild multiplier to payout. No similar functions found.
- **Correction [OK]**: Grid indexing reels[col][row] is correct column-major. Wild-bonus multiplier formula is undocumented but not contradicted by any arbitrated intent.
- **Overengineering [LEAN]**: Computes payout for one payline including wild amplification. Complexity is proportional to the business rule.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding logic (exponential boost) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal but non-trivial: applies wild multiplier formula `(1 + wildCount) * 2^wildCount`. No JSDoc on parameters or the compounding multiplier logic.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin function at line 120; indirectly used via exported spin
- **Duplication [UNIQUE]**: Aggregates line win payouts, applies house edge multiplier, adds bet bonus. No similar functions found.
- **Correction [NEEDS_FIX]**: Two independent defects: HOUSE_EDGE applied as a 5% boost instead of a 5% reduction, and Math.ceil rounds payouts in the player's favour.
- **Overengineering [LEAN]**: Simple reduce + two arithmetic adjustments. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Comment claims RTP ~95% but code applies HOUSE_EDGE as a boost (multiplies total by 1.05), inverting the intended house-edge direction — untested and unverified.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and RTP target but omits @param descriptions for lineWins and bet, does not document the unconditional `bet * 0.01` floor, and bet is typed `any` without explanation.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit any on both public exports: computePayout(lineWins, bet: any) and spin(bet: any). Bet is already defined as number in this same file — use it. [L101,L113] |
| 3 | Discriminated unions | WARN | MEDIUM | EngineContainer.resolve<T> casts unknown → T via bare as T with no runtime guard. Acceptable DI pattern but the cast is unsafe when the registry key is wrong. [L24-L26] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES declared as number[][] — inner arrays are mutable. Should be readonly (readonly number[])[] or typed with as const / satisfies. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) throw "invalid bet" (L115) violates no-throw-literal — must be an Error object; (2) rng (L120) and reelsModule (L122) are resolved from the container but never used in the function body — no-unused-vars; (3) console.warn (L118) in unconditional production path violates no-console. [L115,L118,L120,L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computePayout has JSDoc; spin() has none. Re-exported SpinResult and Bet have no doc comments. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | throw "invalid bet" (L115) throws a primitive — callers cannot instanceof-check it and there is no stack trace. emitter.on(SPIN_DONE, () => {}) (L175) registers a new no-op listener on every spin call with no removal, causing listener accumulation in long-running processes. [L115,L175] |
| 14 | Performance | WARN | MEDIUM | wildMultiplier post-loop (L148-L157) re-executes PAYLINES[w.lineIndex].map((row, col) => reels[col][row]) per win, duplicating symbol extraction already performed in evaluateLine. emitter.on() adds a new no-op listener every call (see rule 12). [L148-L157,L175] |
| 15 | Testability | FAIL | MEDIUM | StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter are instantiated with new inside spin() — untestable without module mocking. The container's rng and reelsModule are resolved but unused; actual reel generation happens inside the factory black-box, meaning the certified-RNG injection path is entirely bypassed and unauditable. [L120-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAYLINES could use satisfies to get both type inference and immutability: const PAYLINES = [...] as const satisfies readonly (readonly number[])[]. No use of satisfies or const type parameters where applicable. [L34] |
| 17 | Context-adapted rules | FAIL | HIGH | Slot-machine domain inferred from reels/paylines/scatter/jackpot/WILD/lineBet vocabulary. computePayout applies total * (1 + HOUSE_EDGE) = total * 1.05, which increases payout by 5% — the opposite of a house edge. The arbitrated contract requires 95% RTP (5% house edge reduces return). Correct formula: total * (1 - HOUSE_EDGE). Current code yields ~105% RTP on winning lines, meaning the house continuously overpays. [L104-L106] |

### Suggestions

- Replace any with the already-defined Bet type on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house-edge formula to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object so callers get instanceof checks and stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES immutable with as const + satisfies
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
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove no-op listener registered every spin; emit directly
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Either remove unused container.resolve('rng'/'reels') calls or thread them into factory so the injectable RNG is actually exercised
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<...>("reels");
  // both are never referenced below
  // After
  // Pass rng to factory constructor so the DI path is actually used:
  const rng = container.resolve<typeof weightedPick>("rng");
  const factory = new StandardReelBuilderFactory(rng);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout to round slot payouts down per regulated gaming convention (house retains fractional remainder). [L110]
- **[correction · medium · small]** Throw an error when bet > 100 to enforce the upper bound of the arbitrated 1..100 coin constraint, consistent with the existing lower-bound throw. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so winning payouts are reduced by 5%, achieving the targeted 95% RTP instead of boosting RTP above 100%. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
