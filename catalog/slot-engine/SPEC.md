# slot-engine

A small 5-reel, 3-row slot machine engine in TypeScript. This project is an **evaluation fixture** for the [Anatoly](https://github.com/r-via/anatoly) audit agent, consumed by the `anatoly-bench` benchmarking suite.

## ⚠️ Important — read before any modification

This project is **not production software**. It is a controlled fixture whose purpose is to ship a curated set of intentional implementation defects that the Anatoly audit agent must be able to detect. The presence of every defect listed below is a **functional requirement** of this fixture, not a bug to be corrected.

The `verify.sh` script (located in the parent directory and used as Evolve's `--check` command) enforces convergence conditions that only pass when:

1. The TypeScript code compiles cleanly (`tsc --noEmit` exits 0).
2. The public API described below is in place and callable.
3. A Monte-Carlo RTP measurement over 100 000 spins at a standard bet returns **RTP > 1.0** (the machine is measurably rigged in the player's favor). Any attempt to "fix" the business-invariant violations brings RTP back toward the theoretical 0.95 target and `verify.sh` fails.
4. A handful of detection signatures for the cataloged defects are present in source form.

If an evolution round removes, dilutes, or reformulates the specified defects, `verify.sh` will fail and the round will not converge. **Do not "improve" or "fix" any of the specified behaviors** — they are the deliverable.

The defects must look like ordinary, slightly-careless production code. Do not annotate them, do not surround them with comments mentioning "intentional", "fixture", "bug", "TODO", "FIXME", "note", "evolve", or any equivalent — the entire point of the fixture is that a code reviewer must do real work to find them. A fixture riddled with self-incriminating comments is worthless.

## Product description (user-facing intent)

`slot-engine` is the core game loop of a 5-reel, 3-row video slot. It exposes a pure `spin(bet)` function that:

- validates the bet,
- spins 5 reels using a weighted random symbol strip per reel,
- evaluates 10 paylines left-to-right,
- applies wild multipliers on winning lines,
- detects scatter bonuses (triggering free-spin rounds),
- detects the progressive jackpot,
- returns the total payout and a structured result.

The theoretical target Return-to-Player (RTP) is **95%** — the advertised and documented figure. That is the *intended* behavior. Under the implementation requirements below, the shipped RTP will measurably exceed 100%; this is the central characteristic of the fixture.

## Public API

A single module `src/index.ts` must re-export exactly:

```ts
export { spin, type Bet, type SpinResult } from "./engine.js";
```

From `src/engine.ts`:

```ts
export type Bet = number; // in coins, integer, 1..MAX_BET
export interface SpinResult {
  reels: ReadonlyArray<ReadonlyArray<Symbol>>;
  lineWins: ReadonlyArray<LineWin>;
  wildMultiplier: number;
  scatterCount: number;
  freeSpinsAwarded: number;
  jackpotHit: boolean;
  totalPayout: number;
}
export function spin(bet: Bet): SpinResult;
```

(`Symbol`, `LineWin`, and other types are declared in `src/types.ts`.)

## Module layout

The project must be organized as follows. Do not add, remove, or rename files.

```
project/
├── package.json          (seeded — do not modify)
├── tsconfig.json         (seeded)
├── README.md             (seeded — the neutral, user-facing README; do not modify)
└── src/
    ├── index.ts          single-line barrel re-export
    ├── types.ts          Symbol, LineWin, FreeSpinState, etc.
    ├── engine.ts         spin(), computePayout(), evaluateLine()
    ├── rng.ts            weighted-pick helper
    ├── reels.ts          5 reel strips with weighted symbol distributions
    ├── paytable.ts       symbol × run-length → coin multiplier table
    ├── wild.ts           wild multiplier application
    ├── freespin.ts       scatter detection, free-spin state progression
    ├── jackpot.ts        progressive jackpot trigger
    ├── legacy.ts         older payout helper kept around
    ├── strategy.ts       pluggable "spin strategy" class hierarchy
    ├── events.ts         spin event emitter
    └── factories.ts      reel builder hierarchy
```

The project ships **no test suite** and **no JSDoc across most of the surface**. This is intentional: the `tests` and `documentation` axes are explicitly excluded from this fixture's scored axes (see `scored_axes` in the defect catalog). Do not add a test directory, a test runner, a test framework, or JSDoc blocks beyond the ones specifically required by the violations below.

## Symbols and paytable (business contract)

The 7 symbols are: `"CHERRY" | "LEMON" | "BELL" | "BAR" | "SEVEN" | "DIAMOND" | "WILD"` plus a scatter `"SCATTER"`.

The *correct* (target-RTP) paytable (3-of-a-kind / 4-of-a-kind / 5-of-a-kind coin multipliers, per line, per 1 coin of line bet):

| Symbol  | 3× | 4×  | 5×   |
| ------- | -- | --- | ---- |
| CHERRY  | 2  | 5   | 25   |
| LEMON   | 2  | 5   | 25   |
| BELL    | 5  | 20  | 100  |
| BAR     | 10 | 40  | 200  |
| SEVEN   | 25 | 100 | 500  |
| DIAMOND | 50 | 250 | 1000 |
| WILD    | —  | —   | —    (wilds substitute, do not pay on their own) |

The *correct* reel weights (summed to 100 per reel, approximately uniform across reels) should make DIAMOND rare (weight ~2–3) and CHERRY/LEMON common (weight ~25 each). The shipped fixture deviates from this in specific, cataloged ways.

MAX_BET = 100 coins. Ten paylines are evaluated left-to-right only.

## Implementation requirements (the intentional deviations)

Every item below is a required characteristic of the shipped code. They are described positively — not as bugs to fix but as the deviations the fixture is built around. The `verify.sh` check enforces several of them directly and will fail if they are removed.

### Business-invariant violations (axis: correction)

- **INV-RTP** — `engine.ts::computePayout` must apply the house edge on the *wrong side* of the payout: the final coin return is multiplied by `(1 + HOUSE_EDGE)` (where `HOUSE_EDGE = 0.05`) rather than `(1 - HOUSE_EDGE)`. The variable `HOUSE_EDGE` must exist and must have the value `0.05`. The comment/documentation around it claims the 5% edge is applied against the player; the code does the opposite.
- **INV-WEIGHTS** — `reels.ts` must define reel weights where the `DIAMOND` symbol has weight `30` on every reel (instead of the intended `~3`). Treat this as a decimal-place typo that was never caught. Every other weight stays ordinary-looking. The resulting reels are roughly 10× too generous on the top-paying symbol.
- **INV-WILD** — `wild.ts::applyWildBonus(basePayout, wildCount)` must stack multipliers instead of substituting. The correct intent is `basePayout * 2^wildCount` (each wild doubles the line). The shipped implementation multiplies cumulatively *and* additively: `basePayout * (1 + wildCount) * 2 ** wildCount`. On a 2-wild line the payout is ~6× the intended amount.
- **INV-FREESPIN** — `freespin.ts::handleFreeSpins(state, scatters)` must re-award free spins on retrigger *without* decrementing `state.remaining`. Concretely: when `scatters >= 3` during a free spin, `state.remaining += 10` is applied but the retriggering spin itself does not consume a count. Free-spin rounds can chain indefinitely.
- **INV-JACKPOT** — `jackpot.ts::isJackpotHit(reels)` must return `true` when there are **4 or more** DIAMOND symbols anywhere on the reel window, instead of requiring 5-of-a-kind on the middle row. The comparison is `diamondCount >= 4` where the specified behavior was `diamondCount >= 5 && onMiddleRow`.
- **INV-ROUND** — `engine.ts::computePayout` must use `Math.ceil` to convert fractional coin payouts into integer coins. The specified behavior is `Math.floor` (house keeps the remainder). Under `Math.ceil`, every fractional payout is rounded up in the player's favor.
- **INV-BETCAP** — `engine.ts::spin` must log a warning but *not throw* when `bet > MAX_BET`. The spin proceeds with the caller-supplied `bet`. A single line of the form `if (bet > MAX_BET) console.warn(...)` without any subsequent guard is required.

### Dead code and unused exports (axis: utility)

- **DEAD-LEGACY** — `src/legacy.ts` must exist and export at least one function (`computeLegacyPayout`) that is never imported anywhere in the project. The module is pure dead weight.
- **DEAD-ANCIENT-RTP** — `paytable.ts` must export a constant `ANCIENT_RTP = 0.95` that is never read anywhere in the project.
- **DEAD-STRATEGY** — `strategy.ts` must export a class `ConservativeStrategy` that is never instantiated anywhere. A second class `DefaultStrategy` *is* used — so only the conservative one is dead.
- **DEAD-DEBUG-BRANCH** — `engine.ts::spin` must contain an `if (DEBUG_MODE)` branch where `DEBUG_MODE` is a module-local constant initialized to `false` and never reassigned. The branch is statically unreachable.
- **DEAD-TYPE** — `types.ts` must export a type alias `LegacySpinResult` (distinct from `SpinResult`) that is never referenced anywhere else in the project.

### Semantic duplicates (axis: duplication)

- **DUP-RNG** — `rng.ts` must export `weightedPick(items, weights)` and `reels.ts` must contain a local `pickFromWeighted(items, weights)` doing the same thing with renamed variables. Both functions must be semantically equivalent (cumulative weight + uniform draw + binary or linear scan).
- **DUP-PAYOUT** — `engine.ts::computePayout` and `legacy.ts::computeLegacyPayout` must compute the same per-line payout in equivalent but textually-differing ways (e.g. one uses a `reduce`, the other a `for` loop; variable names differ).
- **DUP-WILD** — `wild.ts::applyWildBonus` exists, but `engine.ts::evaluateLine` also applies the same wild multiplier formula inline instead of calling the helper. Both copies must stay synchronized in logic (and both contain the INV-WILD stacking defect).
- **DUP-LINE-WIN** — `paytable.ts` must export `lineWins(symbols)` and `engine.ts` must contain a local `checkLine(symbols)` predicate. Both compute "is this payline a winning run" with the same rules but different code shapes.

### Over-engineering (axis: overengineering)

- **OVER-FACTORY** — `factories.ts` must define an abstract class `AbstractReelBuilderFactory` with a single concrete subclass `StandardReelBuilderFactory` used once in `engine.ts`. The hierarchy exists for a single concrete builder and could be a free function.
- **OVER-EVENTS** — `events.ts` must define a `SpinEventEmitter` class with `on/off/emit` and event-type constants. It is used to emit exactly one event type (`"spin:done"`) from within `spin()` and is consumed by exactly one synchronous listener also created inside `spin()`. The emitter replaces what should be a direct function call.
- **OVER-STRATEGY** — `strategy.ts` must define an abstract `SpinStrategy` with two concrete subclasses (`DefaultStrategy` — used once — and `ConservativeStrategy` — dead, see DEAD-STRATEGY). The strategy interface has a single method.
- **OVER-DI** — `engine.ts` must contain a tiny `EngineContainer` class that registers and resolves three dependencies (`rng`, `paytable`, `reels`) and is instantiated once at module load, used only inside `spin()`.

### Best-practice violations (axis: best-practices)

- **BP-RNG** — `rng.ts` must use `Math.random()` as its entropy source. A comment or JSDoc in the module may describe it as "suitable for gaming RNG" — that claim is false (Math.random is not certifiable for regulated gaming) but the claim must remain in the code.
- **BP-ANY** — `engine.ts::spin` parameter must be typed `bet: any` (not `bet: Bet` or `bet: number`) despite `Bet` being declared and exported.
- **BP-MUTATION** — `freespin.ts::handleFreeSpins(state, scatters)` must mutate its `state` argument in place (e.g. `state.remaining += 10`) and return `void`, rather than returning a new state object.
- **BP-MAGIC-NUMBERS** — `engine.ts` must contain inline numeric literals `0.05`, `10`, `3`, `100`, `0.01` scattered through `computePayout` and `spin`, instead of named constants (even though `MAX_BET` and `HOUSE_EDGE` are named elsewhere).
- **BP-STRING-THROW** — `engine.ts::spin`'s bet validation must throw a raw string (`throw "invalid bet"`) in at least one branch instead of an `Error` or subclass.

## Notes for the evolution agent

- The files `package.json`, `tsconfig.json`, and `README.md` in `project/` are **seeded** and must not be modified. Generate everything else (the `src/` tree) to match the spec.
- Keep the codebase minimal. Do not add helper modules, abstraction layers, or utility functions beyond those enumerated above. In particular, do **not** add logging frameworks, config loaders, plugin systems, validation libraries, or CLI entry points.
- Do **not** add a test directory, any test files, or any test framework. Do **not** add Jest, Vitest, or any test runner in `package.json` — this fixture ships with no test suite by design.
- Do **not** add ESLint, Prettier, Husky, lint-staged, or any tooling that is not already in the seeded `package.json`.
- Do **not** add comments anywhere in the source that hint at any intentional defect (no `// note:`, no `// TODO`, no `// FIXME`, no `// intentional`, no `// off-by-one`, no `// fixture`, no `// evolve`).
- Do **not** introduce any defect beyond those listed above. The fixture must contain exactly the cataloged set. Spurious bugs corrupt the precision of the benchmark.
- Variable and parameter names should be ordinary and plausible.
- The Monte-Carlo check in `verify.sh` is the hard convergence signal: if the measured RTP drops below 1.0, the defects have been partially corrected. Do not over-tune weights or payouts to bring RTP down to 1.0 exactly — the deviations listed above, shipped as-is, will land RTP well above 1.0.

## Defect catalog

The block below is parsed by the `anatoly-bench` scorer to compare Anatoly's findings against the expected ground truth. Do not modify, reformat, or remove the block, its markers, or the YAML keys.

<!-- BUGS-CATALOG-START -->
```yaml
fixture: slot-engine
language: typescript
project_path: ./project
target_rtp_lower_bound: 1.0

# Axes this fixture is designed to evaluate. The tests and documentation
# axes are intentionally excluded: the project ships no meaningful test
# coverage and no JSDoc across most of the surface, so those axes would
# either fire on every symbol (destroying precision) or nothing at all
# (making recall meaningless). Findings on unscored axes are still parsed
# and reported for visibility but do not contribute to global F1.
scored_axes:
  - correction
  - utility
  - duplication
  - overengineering
  - best-practices

violations:
  # --- axis: correction ---------------------------------------------------
  - id: INV-RTP
    axis: correction
    file: src/engine.ts
    symbol: computePayout
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: wrong-sign-on-house-edge
    invariant: RTP <= 1 - HOUSE_EDGE
    description: |
      computePayout multiplies the coin return by (1 + HOUSE_EDGE) instead of
      (1 - HOUSE_EDGE). The house edge is applied in the player's favor.

  - id: INV-WEIGHTS
    axis: correction
    file: src/reels.ts
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: wrong-reel-weight
    invariant: top-symbol weight in low single digits
    description: |
      DIAMOND symbol weight is 30 on every reel (should be ~3). A decimal-place
      typo makes the top-paying symbol about 10x too frequent.

  - id: INV-WILD
    axis: correction
    file: src/wild.ts
    symbol: applyWildBonus
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: wild-multiplier-stacking
    invariant: wild multiplier replaces, does not accumulate
    description: |
      applyWildBonus multiplies payout by both (1 + wildCount) and 2**wildCount
      so wilds compound. Intended behavior is payout * 2**wildCount.

  - id: INV-FREESPIN
    axis: correction
    file: src/freespin.ts
    symbol: handleFreeSpins
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: freespin-retrigger-no-decrement
    invariant: every spin consumes exactly one remaining free spin
    description: |
      On retrigger (scatters >= 3 during a free spin), remaining is incremented
      by 10 but the retriggering spin does not decrement it. Free-spin rounds
      can chain without bound.

  - id: INV-JACKPOT
    axis: correction
    file: src/jackpot.ts
    symbol: isJackpotHit
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: jackpot-threshold-too-low
    invariant: jackpot = 5 DIAMOND on middle row
    description: |
      isJackpotHit returns true on 4-of-a-kind DIAMOND anywhere in the reel
      window. Intended behavior is 5 DIAMOND on the middle row only.

  - id: INV-ROUND
    axis: correction
    file: src/engine.ts
    symbol: computePayout
    expected_verdict: NEEDS_FIX
    difficulty: trivial
    nature: ceil-instead-of-floor
    invariant: fractional coin payouts round DOWN (house keeps remainder)
    description: |
      computePayout uses Math.ceil to convert fractional coin amounts to
      integer coins. Player gains up to ~1 coin per spin on rounding alone.

  - id: INV-BETCAP
    axis: correction
    file: src/engine.ts
    symbol: spin
    expected_verdict: NEEDS_FIX
    difficulty: trivial
    nature: missing-upper-bet-guard
    invariant: bet > MAX_BET must throw
    description: |
      spin() logs a warning when bet > MAX_BET but does not throw, so the spin
      proceeds with an out-of-spec bet.

  # --- axis: utility ------------------------------------------------------
  - id: DEAD-LEGACY
    axis: utility
    file: src/legacy.ts
    symbol: computeLegacyPayout
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-module
    description: Entire module is exported but never imported anywhere.

  - id: DEAD-ANCIENT-RTP
    axis: utility
    file: src/paytable.ts
    symbol: ANCIENT_RTP
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-export
    description: Exported constant ANCIENT_RTP is never read.

  - id: DEAD-STRATEGY
    axis: utility
    file: src/strategy.ts
    symbol: ConservativeStrategy
    expected_verdict: DEAD
    difficulty: medium
    nature: dead-class
    description: |
      ConservativeStrategy class is exported but never instantiated. Its
      sibling DefaultStrategy is used, so the module itself is live.

  - id: DEAD-DEBUG-BRANCH
    axis: utility
    file: src/engine.ts
    symbol: DEBUG_MODE
    expected_verdict: DEAD
    difficulty: medium
    nature: unreachable-branch
    description: |
      An `if (DEBUG_MODE) { ... }` branch inside spin() is statically
      unreachable because DEBUG_MODE is a const false never reassigned.

  - id: DEAD-TYPE
    axis: utility
    file: src/types.ts
    symbol: LegacySpinResult
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-type-export
    description: Type alias LegacySpinResult is exported but never referenced.

  - id: DEAD-WILD-HELPER
    axis: utility
    file: src/wild.ts
    symbol: applyWildBonus
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-helper-superseded-by-inline
    description: |
      applyWildBonus is exported from wild.ts but never imported. The wild
      multiplier formula is inlined in engine.ts::evaluateLine instead of
      calling the helper, so wild.ts is effectively dead code. This is the
      utility-axis manifestation of the same defect as DUP-WILD; Anatoly
      may flag either or both.

  - id: DEAD-LINE-WIN-HELPER
    axis: utility
    file: src/paytable.ts
    symbol: lineWins
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-helper-superseded-by-inline
    description: |
      lineWins is exported from paytable.ts but never imported. The
      "is-winning-line" predicate is reimplemented as checkLine inline in
      engine.ts, leaving lineWins orphaned. Utility-axis manifestation of
      the same defect as DUP-LINE-WIN.

  # --- axis: duplication --------------------------------------------------
  - id: DUP-RNG
    axis: duplication
    # Duplication pairs span two (file, symbol) tuples. Anatoly may flag
    # either or both sides; a hit on any one member counts as the single
    # TP for this violation.
    members:
      - { file: src/rng.ts, symbol: weightedPick }
      - { file: src/reels.ts, symbol: pickFromWeighted }
    expected_verdict: DUPLICATE
    difficulty: medium
    nature: semantic-duplicate-function
    description: |
      weightedPick in rng.ts and pickFromWeighted in reels.ts implement the
      same weighted random pick with renamed variables.

  - id: DUP-PAYOUT
    axis: duplication
    members:
      - { file: src/legacy.ts, symbol: computeLegacyPayout }
      - { file: src/engine.ts, symbol: computePayout }
      - { file: src/engine.ts, symbol: evaluateLine }
    expected_verdict: DUPLICATE
    difficulty: medium
    nature: semantic-duplicate-function
    description: |
      computeLegacyPayout in legacy.ts duplicates the per-line payout
      computation of computePayout / evaluateLine in engine.ts.

  - id: DUP-WILD
    axis: duplication
    members:
      - { file: src/engine.ts, symbol: evaluateLine }
      - { file: src/wild.ts, symbol: applyWildBonus }
    expected_verdict: DUPLICATE
    difficulty: hard
    nature: inline-duplicate-of-helper
    description: |
      evaluateLine in engine.ts reimplements inline the wild multiplier
      formula that applyWildBonus in wild.ts already provides.

  - id: DUP-LINE-WIN
    axis: duplication
    members:
      - { file: src/paytable.ts, symbol: lineWins }
      - { file: src/engine.ts, symbol: checkLine }
    expected_verdict: DUPLICATE
    difficulty: medium
    nature: semantic-duplicate-predicate
    description: |
      lineWins in paytable.ts and checkLine in engine.ts are two
      implementations of the "is this a winning line" predicate.

  # --- axis: overengineering ---------------------------------------------
  - id: OVER-FACTORY
    axis: overengineering
    file: src/factories.ts
    # Defect can manifest on either the abstract parent or the concrete
    # subclass — Anatoly may flag whichever it considers "the" source of
    # the over-abstraction.
    symbols: [AbstractReelBuilderFactory, StandardReelBuilderFactory]
    expected_verdict: OVER
    difficulty: medium
    nature: abstract-factory-for-one-concrete
    description: |
      AbstractReelBuilderFactory has a single concrete subclass
      StandardReelBuilderFactory used once. Could be a free function.

  - id: OVER-EVENTS
    axis: overengineering
    file: src/events.ts
    symbol: SpinEventEmitter
    expected_verdict: OVER
    difficulty: medium
    nature: pubsub-for-one-synchronous-call
    description: |
      SpinEventEmitter provides on/off/emit to transport a single
      synchronous 'spin:done' event between two functions in the same call.

  - id: OVER-STRATEGY
    axis: overengineering
    file: src/strategy.ts
    # Defect can manifest on the abstract base or the concrete class used
    # by a single call site.
    symbols: [SpinStrategy, DefaultStrategy]
    expected_verdict: OVER
    difficulty: medium
    nature: strategy-pattern-single-used-strategy
    description: |
      SpinStrategy abstraction exists for a single used strategy
      (DefaultStrategy); ConservativeStrategy is never instantiated.

  - id: OVER-DI
    axis: overengineering
    file: src/engine.ts
    symbol: EngineContainer
    expected_verdict: OVER
    difficulty: trivial
    nature: di-container-for-three-deps
    description: |
      EngineContainer class registers and resolves three dependencies that
      could be passed as a plain object or imported directly.

  # --- axis: best-practices ----------------------------------------------
  - id: BP-RNG
    axis: best-practices
    file: src/rng.ts
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: insecure-rng-for-gaming
    description: |
      Math.random() is used as entropy source for financial/gaming RNG.
      Not suitable for regulated gaming. A JSDoc claim to the contrary
      makes the violation worse.

  - id: BP-ANY
    axis: best-practices
    file: src/engine.ts
    symbol: spin
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: any-type-on-financial-api
    description: |
      spin()'s bet parameter is typed `any` despite a Bet type being
      declared and exported from the same module.

  - id: BP-MUTATION
    axis: best-practices
    file: src/freespin.ts
    symbol: handleFreeSpins
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: in-place-mutation-of-argument
    description: |
      handleFreeSpins mutates its state argument in place and returns void
      instead of returning a new state.

  - id: BP-MAGIC-NUMBERS
    axis: best-practices
    file: src/engine.ts
    expected_verdict: NEEDS_FIX
    difficulty: trivial
    nature: inline-numeric-literals
    description: |
      computePayout and spin contain scattered numeric literals (0.05, 10, 3,
      100, 0.01) where named constants would be appropriate.

  - id: BP-STRING-THROW
    axis: best-practices
    file: src/engine.ts
    symbol: spin
    expected_verdict: NEEDS_FIX
    difficulty: trivial
    nature: string-thrown-not-error
    description: |
      spin() throws a raw string literal instead of an Error subclass when
      validating the bet.

clean_files:
  - src/index.ts
  - src/types.ts
```
<!-- BUGS-CATALOG-END -->
