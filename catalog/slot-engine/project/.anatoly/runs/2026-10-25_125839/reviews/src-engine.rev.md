# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 88% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 97% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 80% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts per import analysis.
- **Duplication [UNIQUE]**: Simple type alias; no similar symbol found.
- **Correction [OK]**: Type alias only; no correctness issue.
- **Overengineering [LEAN]**: Simple type alias documented in the README API; not used in spin's signature but trivial.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply house edge.
- **Duplication [UNIQUE]**: Module-local constant; no similar symbol found.
- **Correction [OK]**: Constant 0.05 is consistent with the documented ~95% RTP. The defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Single named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin as debug-log guard. Constant false, so the branch is unreachable, but the symbol is referenced.
- **Duplication [UNIQUE]**: Module-local flag constant; no similar symbol found.
- **Correction [OK]**: Constant flag; no correctness issue.
- **Overengineering [LEAN]**: Simple flag constant.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` and used in spin via resolve. Over-engineered as a registry for three static values, but it is in use.
- **Duplication [UNIQUE]**: Simple registry/DI container; no similar class found.
- **Correction [OK]**: Simple registry. The unchecked cast in resolve is not triggered by any visible call.
- **Overengineering [OVER]**: DI container with untyped string-keyed registry used for three statically imported functions that could be called directly. Adds indirection and loses type safety via casts.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Used in spin to resolve rng, paytable and reels.
- **Duplication [UNIQUE]**: Singleton instance of EngineContainer; no similar symbol found.
- **Correction [OK]**: Registers the dependencies that spin resolves, under matching keys.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed for wildMultiplier computation.
- **Duplication [UNIQUE]**: Payline layout constant; no similar symbol found.
- **Correction [OK]**: 10 paylines of 5 columns each, with row indices in 0..2, which fits a 5x3 grid.
- **Overengineering [LEAN]**: Plain data table of paylines; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in paytable.ts: same wild-lead resolution, same WILD/SCATTER rejection, same run counting, same >=3 threshold. Only the returned field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Resolves the lead symbol past leading wilds and counts the run, requiring at least 3. Scatter and all-wild lines return null. No contract here says otherwise.
- **Overengineering [LEAN]**: Straightforward run-length check with wild handling.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~99% identical logic — both resolve the lead symbol past leading WILDs, count the consecutive matching/WILD run, and return it if >=3. Only the return property names differ.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called per payline in spin.
- **Duplication [UNIQUE]**: Builds line symbols, computes payout with wild multiplier. No similar function found.
- **Correction [OK]**: Builds the line from the payline, looks up the pay multiplier, and applies a wild multiplier over the winning run only. This matches the wildMultiplier computed in spin. No documented formula contradicts it.
- **Overengineering [LEAN]**: Direct line evaluation. The payFn parameter is mild injection but reasonable.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin to compute totalPayout. Exported but not imported elsewhere; used locally.
- **Duplication [UNIQUE]**: Sums line wins and applies house edge. No similar function found.
- **Correction [NEEDS_FIX]**: The house edge is added instead of subtracted, a flat 1% of the bet is paid on every spin, and the result is rounded up.
- **Overengineering [LEAN]**: Simple reduce and arithmetic; no unnecessary abstraction. (deliberated: confirmed — src/engine.ts:97-111. The JSDoc says the function applies the house edge to target about 95% RTP (README 'RTP' section says the same), but the code works against the house: L105 `total = total * (1 + HOUSE_EDGE)` raises winning payouts by 5% (HOUSE_EDGE = 0.05, L14) instead of applying (1 - HOUSE_EDGE). L108 `total += bet * 0.01` adds 1% of the bet to every spin, losing spins included. L110 `Math.ceil` always rounds in the player's favor, so any losing spin with bet ≥ 1 pays at least 1 coin. The only call is spin at L138, which puts the value straight into SpinResult.totalPayout. Here DefaultStrategy.adjustPayout (strategy.ts) is a pass-through, so the inflated value reaches the caller unchanged. Confirmed defect: payout math works against the house and contradicts the documented RTP.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Top-level orchestration of a spin. No similar function found.
- **Correction [NEEDS_FIX]**: Bets above the documented maximum of 100 only trigger a console.warn and are processed anyway.
- **Overengineering [ACCEPTABLE]**: Orchestrator is mostly straightforward. It instantiates a factory, strategy and emitter, and has a no-op listener. The over-engineering lives in those abstractions' own files. Wild multiplier recomputation is duplicated but not overengineered.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on `computePayout(bet: any)` and `spin(bet: any)`. README declares `Bet = number`; the exported `Bet` type is unused. Use `Bet`/`number`. [L89, L101] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is mutable. Should be `as const` or `ReadonlyArray<ReadonlyArray<number>>`. Function params (`Symbol[][]`, `LineWin[]`) are not readonly, while README's `SpinResult` uses ReadonlyArray. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | `no-explicit-any` violations. `Symbol` is imported from types and shadows the global `Symbol` (`no-shadow`/`no-redeclare` of builtin). `reelsModule`, `strategy` setup, and the no-op `emitter.on(SPIN_DONE, () => {})` are dead or useless code (`no-unused-vars` on `reelsModule`). `console.warn`/`console.log` trip `no-console`. `throw` of a literal trips `no-throw-literal`. [L1, L108-L112, L153, L120, L156] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` and the `Bet` type are exported without JSDoc. `computePayout` has JSDoc but doesn't document its params. [L100, L11] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string, not an `Error`. This drops the stack trace and defeats `instanceof Error` checks. Callers get no `.message` contract. Use `throw new RangeError(...)`/`TypeError`. [L103-L105] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/regulated-gaming domain inferred from reels, paylines, jackpot, RTP and house-edge vocabulary. Payout is computed from floating-point arithmetic: `bet / 10` gives fractional line bets, and multipliers by `1.05` and `bet * 0.01` are applied before `Math.ceil`. Money in floats is unsafe, and rounding always up favors the player, which breaks the stated ~95% RTP. A 'house edge' applied as a payout increase (`total * (1 + HOUSE_EDGE)`) inverts the edge. No hardcoded secrets or eval. The RNG implementation is in `rng.ts`, so it is not judged here. [L89-L99, L118] |
| 14 | Performance | WARN | MEDIUM | `spin` builds a factory, strategy, and emitter on every call. It recomputes payline symbols and wild counts that `evaluateLine` already derived. Minor. [L108-L112, L141-L151] |
| 15 | Testability | FAIL | MEDIUM | A module-level container is a service locator with untyped `unknown` storage. It is populated at import time, and `rng` and `reelsModule` are resolved but not used. `spin` hard-instantiates the factory, strategy, and emitter, and `buildReels` has no injected RNG. Dependencies can't be substituted, and the output is non-deterministic. [L16-L28, L108-L112] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies ...`. Typed generics are used in `resolve<T>` where a typed map would be better. |
| 17 | Context-adapted rules | WARN | MEDIUM | Dead code and unused config: `DEBUG_MODE` is a hardcoded constant. The emitter registers a no-op listener immediately before emitting. The wild multiplier is recomputed with a different formula than the payout path. `bet > 100` only warns while the README specifies 1..100, so validation is inconsistent. |

### Suggestions

- Type the bet parameter and throw a proper Error
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
      throw new RangeError(`Invalid bet: ${bet}; expected an integer in 1..100`);
    }
  ```
- Make PAYLINES immutable and checked
  - Before: `const PAYLINES: number[][] = [[1,1,1,1,1], ...];`
  - After: `const PAYLINES = [[1,1,1,1,1], ...] as const satisfies ReadonlyArray<readonly number[]>;`
- Inject dependencies instead of using a service locator
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult { const { rng, paytable } = deps; /* ... */ }`

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout, replace Math.ceil with Math.floor so fractional payouts round down in the house's favour. [L110]
- **[correction · medium · small]** In spin, throw an Error when bet > 100 instead of only warning, to enforce the documented 1..100 range. [L118]

### Refactors

- **[correction · high · large]** In computePayout, apply the house edge as total * (1 - HOUSE_EDGE) (or remove it if the paytable already encodes the RTP) instead of (1 + HOUSE_EDGE). [L105]
- **[correction · high · large]** In computePayout, remove the unconditional `total += bet * 0.01`. It pays a bonus on every losing spin. [L108]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
