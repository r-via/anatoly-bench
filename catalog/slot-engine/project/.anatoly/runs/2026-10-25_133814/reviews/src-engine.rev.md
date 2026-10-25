# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 93% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 88% |
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 95% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 80% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias; no similar symbols found.
- **Correction [OK]**: Plain type alias for number. The 1..100 integer range is enforced in spin, not in the type.
- **Overengineering [LEAN]**: Trivial type alias documented in the README API; `spin` doesn't use it, but the alias adds no complexity.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply house edge.
- **Duplication [UNIQUE]**: Module constant; no similar symbols found.
- **Correction [OK]**: 0.05 matches the documented ~95% RTP target. The misuse is in computePayout, which is where the defect is reported.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin's `if (DEBUG_MODE)` guard. Always false, so the branch is unreachable, but the constant is referenced.
- **Duplication [UNIQUE]**: Module constant flag; no similar symbols found.
- **Correction [OK]**: Constant flag with no correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag constant.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`, which spin uses to resolve dependencies.
- **Duplication [UNIQUE]**: Simple registry class; no similar symbols found.
- **Correction [OK]**: Simple registry. All resolve calls in spin use registered keys.
- **Overengineering [OVER]**: A DI container with an untyped registry and unchecked casts. It has a single instance and registers static imports that could be called directly. Premature indirection that loses type safety.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Used in spin via container.resolve for rng, paytable and reels.
- **Duplication [UNIQUE]**: Module-level instance of EngineContainer; no similar symbols found.
- **Correction [OK]**: Registers the rng, paytable and reels keys that spin resolves.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed for wildMultiplier computation.
- **Duplication [UNIQUE]**: Payline layout constant; no similar symbols found.
- **Correction [OK]**: 10 paylines, each with 5 row indices in 0..2. These fit a 5x3 grid and match the README's ten paylines.
- **Overengineering [LEAN]**: A plain data table of the ten paylines. This is the minimal representation.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine to detect winning runs.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in paytable.ts: same wild-lead resolution, same SCATTER/WILD early return, same run counting, same >=3 threshold. Only the returned field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Resolves a leading WILD run to the first non-WILD symbol. Returns null for all-WILD or SCATTER lines and requires a run of 3 or more. Logic is consistent.
- **Overengineering [LEAN]**: A short, direct run-detection routine with wild handling. Complexity matches the domain.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~99% identical logic: leading symbol resolution, wild-aware run count, min run of 3; only result field names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin's payline loop.
- **Duplication [UNIQUE]**: Builds line symbols, applies the pay function and wild multiplier, and returns a LineWin. No similar function found.
- **Correction [OK]**: Maps payline rows to reel columns correctly and counts wilds within the run. The (1+wc)*2^wc wild multiplier is unusual but no contract states a different value.
- **Overengineering [ACCEPTABLE]**: The `payFn` parameter is an injected function, which is a small amount of indirection. The wild-counting loop is straightforward and the function does one thing.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported and called by spin to compute totalPayout.
- **Duplication [UNIQUE]**: Sums line wins and applies house edge and a bet bonus. No similar function found.
- **Correction [NEEDS_FIX]**: The house edge is applied in the wrong direction, a flat payout is added to losing spins, and the payout is rounded up. All three over-pay the player.
- **Overengineering [LEAN]**: A simple reduce plus house-edge adjustment. (deliberated: confirmed — Confirmed. The JSDoc at src/engine.ts:97-99 says it 'Applies the house edge to maintain a target RTP of approximately 95%', and README.md (## RTP) says the 5% house edge comes off player return. src/engine.ts:105 does `total = total * (1 + HOUSE_EDGE)` with HOUSE_EDGE = 0.05 (L14), which adds 5% to every win instead of taking 5% off. L108 adds `bet * 0.01` on every spin, even losing ones (no `total > 0` guard), and L110 rounds up with `Math.ceil`, so a losing spin with any bet from 1 to 100 still pays 1 coin. All three push payout up and away from the stated 95% RTP. Its only caller is spin at src/engine.ts:138, so every spin result is wrong.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Exported main entry point, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Top-level spin orchestration. No similar function found.
- **Correction [NEEDS_FIX]**: Bets above the documented maximum of 100 are only warned about and still played.
- **Overengineering [ACCEPTABLE]**: The orchestration is straightforward. The body instantiates a factory, a strategy and an emitter per call, and the emitter registers a no-op listener. The over-engineering lives in those abstractions' own files, so the consumer is not flagged for them. The wild-multiplier recomputation duplicates `evaluateLine` logic, which is minor. (deliberated: confirmed — Confirmed. README.md (## API) defines `type Bet = number; // 1..100 coins, integer`. The guard at src/engine.ts:114 only rejects bet < 1 or non-integer bets. A bet over 100 only logs `console.warn` (L118) and the spin goes ahead, so the public entry point (re-exported at src/index.ts:1) accepts out-of-contract bets. spin also passes on the payout defect: totalPayout comes from computePayout (L138), and strategy.adjustPayout (L173) is DefaultStrategy (src/strategy.ts:7-11), which returns the result unchanged. The original detail text was empty, which is why confidence started low. These defects are verified directly in the source.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Both exported functions take `bet: any`. `computePayout` then does arithmetic on it (`bet * 0.01`) with no type check. `spin` narrows it at runtime, but the public signature is still `any`. The README declares `spin(bet: Bet)`, and `Bet` is defined but unused. [L101, L113] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>` returns `unknown as T`, an unchecked assertion. Callers cast to function types with no tagged or typed registry. [L24-L26, L120-L122] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is a shared module constant typed as mutable `number[][]`. `freeSpinState` is mutated in place by `handleFreeSpins`. No in-place mutation of a shared constant is visible, so this stays WARN. [L34-L45, L141-L142] |
| 8 | ESLint compliance | FAIL | HIGH | Likely lint violations: `no-explicit-any` (L101, L113), `no-throw-literal` (L115), `no-empty-function` on the `() => {}` handler (L175), and `no-console` (L118, L160). The imported type `Symbol` also shadows the global `Symbol`, which `@typescript-eslint/no-shadow` or `no-redeclare` with builtinGlobals would flag. [L1, L101, L113, L115, L118, L160, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` has no JSDoc. Its throw behavior, console warning, event emission and bet range are not readable from its signature. The `computePayout` doc claims a 'target RTP of approximately 95%', but the code adds 5% to wins and a flat bet bonus. [L97-L101, L113] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string, not an `Error`. Callers get no stack trace, no `.message` and no `instanceof Error` check. This is on the public API path. [L115] |
| 14 | Performance | WARN | MEDIUM | Each `spin` call builds a new factory, strategy and emitter. It also registers a no-op listener, which does nothing. Wild counts are recomputed in a second pass over the wins, duplicating `evaluateLine`. [L124-L126, L147-L157, L175] |
| 15 | Testability | WARN | MEDIUM | A module-level container is built, but `spin` resolves `rng` and `reelsModule` and never uses them. The factory, strategy and emitter are hard-wired with `new` inside `spin`, so there is no injection point. `computePayout` is pure and exported, so this stays WARN. [L29-L32, L120-L126] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic numbers appear in the code (5, 3, 10, 0.01, 100). `Bet` is exported but not used in signatures. The bet limit is only warned about, not enforced. [L12, L118, L128, L130] |

### Suggestions

- Type the bet parameter and throw an Error
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
      throw "invalid bet";
    }
  // After
  export function spin(bet: Bet): SpinResult {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`invalid bet: ${bet}`);
    }
  ```
- Type computePayout's bet parameter
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number`
  - After: `export function computePayout(lineWins: readonly LineWin[], bet: Bet): number`
- Inject the collaborators with defaults and drop the unused container
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
    const { factory, strategy, emitter } = deps;
  ```
- Make PAYLINES readonly
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly (readonly number[])[] = [`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor so payouts round down. [L110]
- **[correction · medium · small]** Reject bets above 100 (throw an Error) instead of only warning, to enforce the documented 1..100 range. [L118]

### Refactors

- **[correction · high · large]** Apply the house edge as total * (1 - HOUSE_EDGE), not (1 + HOUSE_EDGE), so wins are reduced to meet the ~95% RTP target. [L105]
- **[correction · high · large]** Remove the unconditional `total += bet * 0.01`. Losing spins must pay 0. [L108]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
