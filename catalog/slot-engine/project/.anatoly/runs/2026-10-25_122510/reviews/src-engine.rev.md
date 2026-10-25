# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | - | LOW_VALUE | UNIQUE | - | 80% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 88% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 96% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts per import analysis.
- **Duplication [UNIQUE]**: Simple type alias; no similar symbol found.
- **Correction [OK]**: Type alias; no issue.
- **Overengineering [LEAN]**: Simple type alias documenting the README API; trivial and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout.
- **Duplication [UNIQUE]**: Module-level constant; no similar symbol found.
- **Correction [OK]**: Constant is fine. The defect is in how computePayout uses it.
- **Overengineering [LEAN]**: Plain named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin's debug branch; constant false, so the branch is dead but the symbol is referenced.
- **Duplication [UNIQUE]**: Module-level flag constant; no similar symbol found.
- **Correction [OK]**: Constant flag; no issue.
- **Overengineering [LEAN]**: Plain constant flag.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [LOW_VALUE]**: Used to instantiate container, but it is a trivial Map wrapper with an untyped resolve cast. Direct imports would do.
- **Duplication [UNIQUE]**: Simple registry class; no similar symbol found.
- **Correction [OK]**: Simple registry; no correctness defect.
- **Overengineering [OVER]**: DI container with untyped registry for three statically importable functions. Single use, no swapping, loses type safety via casts. Direct imports suffice.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Used in spin to resolve rng, paytable and reels.
- **Duplication [UNIQUE]**: Container instance; no similar symbol found.
- **Correction [OK]**: Instance creation; no issue.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and used for wildMultiplier computation.
- **Duplication [UNIQUE]**: Payline layout constant; no similar symbol found.
- **Correction [OK]**: 10 paylines of 5 rows each, all rows in 0..2, which fits a 5x3 grid.
- **Overengineering [LEAN]**: Static data table of ten paylines matching the README.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine.
- **Duplication [DUPLICATE]**: Logic matches lineWins in paytable.ts: same wild-lead resolution, same run counting, same >=3 threshold. Only the returned field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Wild-lead handling and run counting are consistent.
- **Overengineering [LEAN]**: Straightforward wild-aware run detection.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~98% identical logic; same wild/scatter lead handling, run count and >=3 threshold, different return field names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in the spin payline loop.
- **Duplication [UNIQUE]**: No similar function found. It maps a payline to symbols, calls checkLine, and applies the wild payout multiplier.
- **Correction [OK]**: No demonstrable defect. The wild multiplier formula has no stated contract.
- **Overengineering [LEAN]**: Direct line evaluation; injected payFn is minor and reasonable.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin to compute totalPayout.
- **Duplication [UNIQUE]**: No similar function found. It sums line wins and applies the house edge.
- **Correction [NEEDS_FIX]**: The house edge is applied as a bonus, a flat per-spin payout is added, and the total rounds up.
- **Overengineering [LEAN]**: Short reduce and arithmetic; no unnecessary abstraction. (deliberated: confirmed — Confirmed. src/engine.ts:105 does `total * (1 + HOUSE_EDGE)`, which raises every win by 5%. A house edge should lower the payout (×0.95). The function's own JSDoc (L97-99) and the README RTP section both say 95% RTP. Two more things push payout up: L108 adds `bet * 0.01` to every spin, losing spins included, and L110 rounds up with Math.ceil. HOUSE_EDGE = 0.05 is set at L14.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found. It is the orchestration entry point for a spin.
- **Correction [NEEDS_FIX]**: A bet above the documented 1..100 range only logs a warning and still runs the spin.
- **Overengineering [ACCEPTABLE]**: Own logic is straightforward, though it recomputes wild multiplier and has a no-op emitter listener per call. Upstream abstractions (factory, strategy, emitter) are flagged in their own files. (deliberated: confirmed — Confirmed. The README API declares `type Bet = number; // 1..100 coins, integer`. src/engine.ts:114 rejects bets below 1 and non-integers. But L118 only calls `console.warn("bet exceeds maximum")` when bet > 100 and then plays the spin anyway, so out-of-range bets are accepted and paid out.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on `bet` in computePayout and spin; the README declares `Bet`, which is already defined in this file. [L89,L100] |
| 3 | Discriminated unions | WARN | MEDIUM | EngineContainer.resolve casts unknown to T with `as T`, an unchecked assertion. [L21-L23] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is a mutable number[][]; it should be readonly or `as const`. The registry field is not readonly. [L31-L42] |
| 8 | ESLint compliance | FAIL | HIGH | Explicit any (no-explicit-any), a throw of a literal (no-throw-literal), console usage, and an empty arrow callback. The imported `Symbol` shadows the global. [L1,L89,L100,L103,L160] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spin has no JSDoc; the exported Bet type has none either. [L100] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string, not an Error. The result has no stack and no `.message`. [L102] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from reels, paylines, jackpot and RTP. Money math uses float arithmetic: `bet / 10`, `bet * 0.01`, and a 1.05 house-edge multiplier. This is unsafe for regulated payouts. The rng is `weightedPick`; whether it is certifiable is unverifiable here. `computePayout` adds `bet * 0.01` to every spin, including losing ones. That is a payout rule beyond the 'house edge' the doc comment describes. |
| 14 | Performance | WARN | MEDIUM | Factory, strategy and emitter are rebuilt on every spin. Wild multiplier recomputes the payline symbols already computed in evaluateLine. [L113-L158] |
| 15 | Testability | FAIL | MEDIUM | A module-level service locator is used. Dependencies are constructed inside spin. `rng` and `reelsModule` are resolved but never used. The `buildReels` call ignores the RNG, so spin results cannot be deterministically tested. [L26-L33,L108-L119] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAYLINES could use `as const satisfies`. The container could use typed keys. |
| 17 | Context-adapted rules | WARN | MEDIUM | Dead code: DEBUG_MODE branch, the no-op emitter listener, and the unused `rng` and `reelsModule`. `emitter.on` is registered immediately before `emit`, which is pointless. |

### Suggestions

- Type bet as Bet and throw an Error
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (...) { throw "invalid bet"; }
  // After
  export function spin(bet: Bet): SpinResult {
    if (...) { throw new RangeError("invalid bet"); }
  ```
- Use integer minor units for money and inject dependencies
  - Before: `const lineBet = bet / 10;`
  - After: `const lineBet = Math.floor(bet * 100 / 10); // integer cents, or use a Decimal library`

## Actions

### Quick Wins

- **[correction · medium · small]** Remove the unconditional `bet * 0.01` addition so losing spins pay 0. [L107]
- **[correction · medium · small]** Replace Math.ceil with Math.floor so payouts round down. [L109]
- **[correction · medium · small]** Reject bets greater than 100 in spin, as the README documents (1..100). Currently it only warns. [L118]

### Refactors

- **[correction · high · large]** In computePayout, apply the house edge as a reduction (1 - HOUSE_EDGE) instead of 1 + HOUSE_EDGE. [L104]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[utility · low · trivial]** Consider removing low-value code: `EngineContainer` (`EngineContainer`) [L17-L27]
