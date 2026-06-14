# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | GOOD | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 70% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 75% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Type-only imported by src/index.ts; removing it breaks compilation.
- **Duplication [UNIQUE]**: Simple type alias with no RAG candidates.
- **Correction [OK]**: Type alias only; runtime validation is handled in spin().
- **Overengineering [LEAN]**: Simple type alias for a public API boundary. One importer is fine for an exported type.
- **Tests [GOOD]**: Type alias with no runtime behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. No indication of valid range, currency unit, or relationship to the bet parameter in spin().

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L105): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-level constant, no RAG candidates.
- **Correction [OK]**: Value 0.05 is correct for 5% house edge; the misapplication lives in computePayout.
- **Overengineering [LEAN]**: Named constant for a magic number. Appropriate.
- **Tests [NONE]**: No test file exists; constant is untested. Its effect on payout is also not verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant, no JSDoc. Name is self-explanatory but the 0.05 value's effect on RTP (additive boost rather than reduction) is non-obvious and undocumented.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the guarded block at L160–162 is permanently dead. Zero runtime effect.
- **Duplication [UNIQUE]**: Module-level constant, no RAG candidates.
- **Correction [OK]**: Boolean guard around a console.log; no correctness impact.
- **Overengineering [LEAN]**: Simple boolean flag. The dead-code branch it guards is a quality issue, not overengineering.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag, no JSDoc. Trivially self-descriptive; leniency applied for internal constant.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to produce `container`, which is used throughout the file.
- **Duplication [UNIQUE]**: Registry class with no RAG candidates.
- **Correction [OK]**: All three registered keys are resolved by matching names in spin(); no untriggered missing-key path.
- **Overengineering [OVER]**: Hand-rolled service-locator/IoC container for 3 values (`rng`, `paytable`, `reels`) that are already directly imported at the top of the file. Adds a `Map<string, unknown>` + unsafe `as T` cast with no DI benefit, no swappability across call sites, and a single consumer (`spin`). The pattern exists purely to look architectural.
- **Tests [NONE]**: No test file exists; register/resolve behavior untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal class acting as a simple IoC container. No JSDoc on the class or its methods. Leniency applied for unexported internals.

#### `container` (L29–L29)

- **Utility [USED]**: Populated at L30–32; resolved in spin() at L130–132 (rng, paytable, reelsModule).
- **Duplication [UNIQUE]**: Singleton instance variable, no RAG candidates.
- **Correction [OK]**: All required keys registered at module initialisation.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment explaining its role as the DI registry. Internal; leniency applied.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin() at L143 and indexed at L163 to compute line wins.
- **Duplication [UNIQUE]**: Data constant with no RAG candidates.
- **Correction [OK]**: Matches the canonical payline table in the reference documentation exactly.
- **Overengineering [LEAN]**: Plain data constant for 10 fixed payline paths. No abstraction, no complexity.
- **Tests [NONE]**: No test file exists; payline definitions and their correctness are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: 10-entry payline table with no JSDoc. The row-index semantics and coordinate system are non-obvious from the raw numbers alone; shape descriptions (straight, V-shape, zigzag) would aid maintainability.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called inside evaluateLine (L73) to detect winning symbol runs.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-first resolution, same WILD/SCATTER guard, same counting loop, same >= 3 threshold. Differences are cosmetic — field names sym/run vs symbol/count, variable names lead vs first.
- **Correction [OK]**: WILD substitution logic and consecutive-run counting are consistent with reference-doc payline semantics.
- **Overengineering [LEAN]**: Single-responsibility helper: find lead symbol and count consecutive matching/WILD positions. Logic is proportionate to the task.
- **Tests [NONE]**: No test file exists; WILD substitution logic, SCATTER short-circuit, run-length counting, and minimum-3 threshold are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper, under 20 lines; leniency applied. However the WILD/SCATTER early-return logic and the 'lead substitution' behaviour are non-trivial and uncommented.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve leading WILD, guard on SCATTER, count contiguous matches, return null below 3; only field/variable names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin() at L144 for every payline to collect line wins.
- **Duplication [UNIQUE]**: No RAG candidates found.
- **Correction [OK]**: Column-major symbol lookup `reels[col][row]` is correct; basePayout formula matches reference docs.
- **Overengineering [LEAN]**: Converts a payline + reels into a `LineWin`. Wild-bonus math adds lines but is domain-required. The `payFn` parameter is appropriate abstraction for testability.
- **Tests [NONE]**: No test file exists; wild-count bonus multiplier formula and null-propagation from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported but non-trivial: applies wild multiplier formula `(1 + wildCount) * 2^wildCount`. No JSDoc on parameters or the multiplier formula. More complex than a simple private helper.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin() at L146; spin is runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG candidates found.
- **Correction [ERROR]**: Two independent defects: house-edge applied with wrong sign (RTP > 100%); Math.ceil rounds payout up against slot-domain convention.
- **Overengineering [LEAN]**: Minimal aggregation function: reduce line wins, apply edge factor, add floor. No structural complexity.
- **Tests [NONE]**: No test file exists; house-edge application, base-bet bonus, Math.ceil rounding, and zero-win path are all untested.
- **PARTIAL [PARTIAL]**: Has a two-sentence JSDoc describing purpose and RTP target, but omits @param tags for lineWins and bet, no @returns tag, and the claim of ~95% RTP is misleading (the code applies HOUSE_EDGE as a 5% boost, not a reduction). The unconditional `bet * 0.01` floor is also undocumented. (deliberated: confirmed — Confirmed two defects in src/engine.ts. (1) L105: `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payouts 5% instead of decreasing them. JSDoc at L99 states 'target RTP of approximately 95%' and src/paytable.ts:3 defines ANCIENT_RTP=0.95, confirming intent is to reduce payouts. Should be `(1 - HOUSE_EDGE)`. (2) L108: `total += bet * 0.01` adds 1% of bet unconditionally on every spin, guaranteeing non-zero returns on losing spins and further inflating RTP above 100%. Both are genuine computational errors in a payout-critical function. Raising confidence to 95 after source verification.)

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG candidates found.
- **Correction [NEEDS_FIX]**: `bet > 100` guard logs a warning but lets execution continue; arbitrated intent specifies the valid range as 1..100 (integer), so bets above 100 must be rejected.
- **Overengineering [LEAN]**: The function's own logic is sequential game flow (validate → build grid → evaluate paylines → aggregate → detect bonuses). The factory, strategy, and emitter abstractions it consumes are sourced from other files and will be evaluated there; per the single-source rule, `spin` itself is not flagged for them. The redundant `container.resolve` calls are covered by the `EngineContainer`/`container` findings above.
- **Tests [NONE]**: No test file exists. Exported and called from src/index.ts, making its untested state high-risk. Invalid-bet validation, free-spin triggering, jackpot path, and wildMultiplier accumulation are all uncovered.
- **DOCUMENTED [DOCUMENTED]**: Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed at src/engine.ts:118. `if (bet > 100) console.warn('bet exceeds maximum')` only logs, does not throw or return. Meanwhile L114-116 enforces type/range/integer constraints with a hard throw. The max bet guard is inconsistent — if 100 is truly the maximum, bets of 101+ are processed normally. This allows users to exceed the bet limit, which is a real behavioral defect. NEEDS_FIX is the correct severity (not ERROR, since no crash or data corruption occurs — but out-of-bounds bets are silently accepted).)

## Best Practices — 1/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Two explicit `any` annotations on public API entry points: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). The file already exports `Bet = number`; both parameters must use it. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]` — mutable. As a module-level constant never mutated it should be `ReadonlyArray<readonly number[]>` or use `as const`. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Two violations: (1) `throw "invalid bet"` (L115) violates `no-throw-literal` — must throw an `Error` instance. (2) `rng` (L120) and `reelsModule` (L122) are resolved from the container but never referenced after assignment — `no-unused-vars`. Reels are built via `factory.buildReels()` instead, making both resolves dead code. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` (L113) is a public export with no JSDoc. `computePayout` has a block but its `bet` param is undocumented. `Bet` type alias also lacks documentation. [L113] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from payline/jackpot/freespin/reel vocabulary. Two violations: (1) `computePayout` applies `total * (1 + HOUSE_EDGE)` = ×1.05 (L105), which INCREASES line-win payouts by 5% — the opposite of a house deduction. The arbitrated intent mandates 95% RTP (house keeps 5%); the correct factor is `(1 - HOUSE_EDGE)` = 0.95. The JSDoc claim 'Applies the house edge to maintain … 95%' directly contradicts the formula. This is a correctness/compliance bug against the arbitrated 95% RTP contract. (2) All monetary arithmetic uses IEEE 754 floating-point (`bet * 0.01` L108, `basePayout * (1 + wildCount) * 2 ** wildCount` L86, `total * (1 + HOUSE_EDGE)` L105); regulated gambling requires integer-cent or Decimal-library arithmetic to prevent accumulation errors. [L97-L111, L86] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are constructed with `new` inside `spin()` on every call (L124-L126). They cannot be injected or mocked without monkey-patching. The DI container already in the file should cover these dependencies. [L124-L126] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues: (1) `emitter.on(SPIN_DONE, () => {})` registers a no-op listener immediately before `emitter.emit(SPIN_DONE, finalResult)` (L175-L176) — the listener never fires on subsequent emits and serves no purpose; likely scaffolding residue. (2) `EngineContainer.resolve<T>()` (L24-L26) casts `this.registry.get(key)` directly to `T` with no guard: a missing key silently returns `undefined` typed as `T`, bypassing type safety at runtime. [L175-L176, L24-L26] |

### Suggestions

- Replace `bet: any` with `Bet` on both public functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number {
  export function spin(bet: any): SpinResult {
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number {
  export function spin(bet: Bet): SpinResult {
  ```
- Fix house-edge direction so payout is reduced to 95% RTP, not inflated to 105%
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE); // reduces to ~95% of raw line-win total`
- Throw an Error instance to satisfy no-throw-literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("Invalid bet: must be a positive integer in [1, 100]");`
- Remove or wire the unused container resolves for rng and reelsModule
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  // Either delete these lines, or replace factory.buildReels() with calls through rng/reelsModule to honour the DI contract
  ```
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Guard EngineContainer.resolve against missing keys
  ```typescript
  // Before
  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
  // After
  resolve<T>(key: string): T {
    if (!this.registry.has(key)) throw new Error(`DI: no binding for '${key}'`);
    return this.registry.get(key) as T;
  }
  ```
- Use integer arithmetic for monetary values to avoid IEEE 754 drift
  ```typescript
  // Before
  total += bet * 0.01;
  return Math.ceil(total);
  // After
  // Work in integer cents throughout, convert only at display boundary
  const totalCents = Math.round(total * 100) + Math.round(bet * 1); // bet*0.01 coins = 1 cent per bet unit
  return Math.ceil(totalCents / 100);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout L110, replace Math.ceil with Math.floor so fractional credits are retained by the house, consistent with slot-machine payout rounding convention. [L110]
- **[correction · medium · small]** In spin L118, replace `console.warn('bet exceeds maximum')` with `throw 'invalid bet'` (or a proper Error) to enforce the documented upper bound of 100 coins. [L118]

### Refactors

- **[correction · high · large]** In computePayout L105, replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to reduce the payout by 5% and achieve the documented 95% RTP instead of paying out >100%. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
