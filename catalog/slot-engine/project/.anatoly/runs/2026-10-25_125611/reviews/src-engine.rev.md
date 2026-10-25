# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 85% |
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 96% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts per import analysis.
- **Duplication [UNIQUE]**: Trivial type alias; no similar symbol found.
- **Correction [OK]**: Type alias; no defect.
- **Overengineering [LEAN]**: Trivial type alias matching the documented README API; not an abstraction concern.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply the house edge.
- **Duplication [UNIQUE]**: Module-level constant; no similar symbol found.
- **Correction [OK]**: Constant is fine. The misuse is flagged in computePayout, where it is applied.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin as a debug-logging guard. Constant false, so the branch is unreachable, but the symbol is referenced.
- **Duplication [UNIQUE]**: Module-level flag constant; no similar symbol found.
- **Correction [OK]**: Constant flag; no defect.
- **Overengineering [LEAN]**: Simple hardcoded debug flag constant.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container`, which spin uses to resolve rng, paytable, and reels. Indirection is heavy but used.
- **Duplication [UNIQUE]**: Simple registry class; no similar symbol found.
- **Correction [OK]**: Simple registry. The unchecked cast in resolve is hypothetical misuse, since every key spin() resolves is registered.
- **Overengineering [OVER]**: Untyped string-keyed DI container for three statically imported functions; used once with a single registration set. Direct imports suffice, and resolve<T> casts defeat type safety.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Used in spin via container.resolve for rng, paytable, and reels.
- **Duplication [UNIQUE]**: Singleton instance of EngineContainer; no similar symbol found.
- **Correction [OK]**: The rng, paytable and reels keys that spin() resolves are all registered.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed by w.lineIndex.
- **Duplication [UNIQUE]**: Payline layout data constant; no similar symbol found.
- **Correction [OK]**: 10 paylines of 5 columns each, with rows in 0..2, matching the 5x3 grid.
- **Overengineering [LEAN]**: Plain data table of paylines; the minimal representation.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine.
- **Duplication [DUPLICATE]**: Same logic as lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts the run with WILD substitution, requires >= 3. Only the return field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Resolves a leading WILD to the first non-wild symbol and counts the run with wilds substituting. Returns null for SCATTER, all-WILD, or runs under 3. No concrete bug.
- **Overengineering [LEAN]**: Straightforward run-detection with wild handling; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~98% identical logic; same lead resolution, run counting and min-3 threshold, differing only in the returned property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in the spin payline loop.
- **Duplication [UNIQUE]**: No similar function found. It builds line symbols, calls checkLine, and applies the pay function and wild multiplier.
- **Correction [OK]**: Maps the payline to symbols, looks up the pay, and counts wilds within the run. The wild multiplier formula has no stated contract, so it is not flagged.
- **Overengineering [ACCEPTABLE]**: Payline evaluation with an injected payFn parameter, which is mild but harmless. Wild-count logic is simple.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin to compute totalPayout. Not directly imported elsewhere, but used in-file.
- **Duplication [UNIQUE]**: No similar function found. It sums line payouts, applies the house edge, adds a bet-based bonus and rounds up.
- **Correction [NEEDS_FIX]**: The house edge raises payouts instead of lowering them, a flat bet bonus is paid on every spin including losses, and Math.ceil rounds payouts up.
- **Overengineering [LEAN]**: Short reduce plus house edge adjustment. Complexity is minimal. (deliberated: confirmed — Confirmed. src/engine.ts:105 `total = total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 (L14) raises winning payouts by 5% instead of lowering them. The JSDoc at L97-100 and README ('targets RTP 95%', 'house edge of 5%') say the opposite. L108 `total += bet * 0.01` runs on every spin, including losses (total=0). L110 `Math.ceil` rounds in the player's favor, so the bet*0.01 bonus becomes at least 1 coin on any losing spin with bet ≥1 (e.g. bet=10 → 0.1 → ceil → 1). spin() returns this value as totalPayout (L138), so it reaches the public API.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts; main entry point.
- **Duplication [UNIQUE]**: Top-level orchestration of a spin; no similar function found.
- **Correction [NEEDS_FIX]**: A bet above the documented maximum of 100 only logs a warning and still spins.
- **Overengineering [ACCEPTABLE]**: Orchestration is mostly straightforward. Instantiating a factory, strategy and emitter per call, registering a no-op listener, and recomputing the wild multiplier add some needless ceremony. Per the rules, those abstractions live in other files and are judged there. The DI resolve calls are flagged on the container symbols. (deliberated: confirmed — Confirmed. README API says `type Bet = number; // 1..100 coins, integer`. src/engine.ts:114-116 rejects only non-number, <1 or non-integer bets. L118 `if (bet > 100) console.warn(...)` logs and continues, so spin(1000) runs and pays out against an out-of-contract bet. spin is the public entry point (src/index.ts:1).)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on `bet` in `computePayout(lineWins, bet: any)` and `spin(bet: any)`. README declares `Bet = number`; the file exports `Bet` but does not use it. [L81, L90] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is mutable and should be `as const` or `ReadonlyArray<readonly number[]>`. `registry` should be `readonly`. The README declares readonly reels and lineWins, but the function signatures use mutable arrays. [L14-L16, L28-L39] |
| 8 | ESLint compliance | FAIL | HIGH | Violates `no-explicit-any`. `throw` of a string violates `no-throw-literal`. `emitter.on(SPIN_DONE, () => {})` registers an empty function (`no-empty-function`). `rng` and `reelsModule` are assigned but never used (`no-unused-vars`). The `Symbol` import shadows the global. [L81, L90, L93, L99-L101, L142-L143] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has JSDoc, but `spin` does not. The `Bet` type is also undocumented. The `computePayout` doc claims a ~95% RTP target, but the code only multiplies wins by 1.05 and adds `bet*0.01`, which is a house-edge inversion. [L11, L90] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string, not an `Error`. This loses the stack trace and breaks `instanceof Error` checks for callers. Out-of-range input (>100) only logs a warning with `console.warn`, although the README says the bet is 1..100, so bets above 100 are accepted. [L92-L96] |
| 13 | Security | FAIL | CRITICAL | Slot/casino domain inferred from reels, paylines, jackpot, and free-spin vocabulary. Payout math has regulated-gaming problems: `computePayout` applies a positive house-edge multiplier (`total * 1.05`) that raises payouts instead of lowering them. It also adds a flat `bet*0.01` even on a losing spin, and `Math.ceil` rounds up in the player's favor. `lineBet = bet / 10` produces fractional amounts, so floating-point arithmetic is used on money. The RNG path is not visibly seeded with `Math.random()` here, but the RNG is resolved from an untyped container. No hardcoded secrets or eval. [L81-L90, L111] |
| 14 | Performance | WARN | MEDIUM | `spin` allocates a new factory, strategy, and emitter on every call. It recomputes the wild multiplier by rebuilding each winning line's symbols. A listener is registered with `emitter.on` and then fired on a fresh emitter, so it does nothing. [L103-L106, L131-L141, L163-L164] |
| 15 | Testability | FAIL | MEDIUM | A module-level service-locator container returns `unknown` cast to `T`. `spin` hard-instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter`, so none of them can be injected. The `rng` dependency is resolved but never used, so reel generation cannot be controlled in tests. `HOUSE_EDGE` and `DEBUG_MODE` are hardcoded constants. [L13-L27, L97-L106] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies`, and the container could use typed keys through a registry interface. |
| 17 | Context-adapted rules | WARN | MEDIUM | `DEBUG_MODE` is a hardcoded dead-code flag. `console.warn` and `console.log` in library code leak spin data. Wild-multiplier logic is duplicated between `evaluateLine` and `spin`, although a `wild.ts` module exists in the project structure. [L7-L8, L108-L109, L131-L145] |

### Suggestions

- Replace `any` with the exported `Bet` type and throw a proper Error with a range check that enforces the documented 1..100 limit.
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
      throw "invalid bet";
    }
    if (bet > 100) console.warn("bet exceeds maximum");
  // After
  export function spin(bet: Bet): SpinResult {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`invalid bet: ${bet}; expected an integer in 1..100`);
    }
  ```
- Make PAYLINES immutable and checked.
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Inject collaborators with defaults, and drop the untyped container.
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const factory = new StandardReelBuilderFactory();
  // After
  export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
    const { factory, strategy, emitter, paytable } = deps;
  ```
- Fix the payout math. Apply the house edge as a reduction, work in integer minor units, and drop the unconditional per-spin bonus.
  ```typescript
  // Before
  total = total * (1 + HOUSE_EDGE);
  }
  total += bet * 0.01;
  return Math.ceil(total);
  // After
  return Math.floor(total * (1 - HOUSE_EDGE));
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout so fractional payouts round down. [L110]
- **[correction · medium · small]** Reject bets above 100 in spin by throwing an Error, instead of only logging console.warn and proceeding. [L118]

### Refactors

- **[correction · high · large]** In computePayout, change the house-edge application to total * (1 - HOUSE_EDGE) so the engine moves toward the documented ~95% RTP. [L105]
- **[correction · high · large]** In computePayout, remove the unconditional `total += bet * 0.01`, or move it inside the `total > 0` branch if a bonus is intended. It currently pays out on losing spins. [L108]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
