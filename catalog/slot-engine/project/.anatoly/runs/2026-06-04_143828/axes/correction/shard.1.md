[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 82% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | Forward: total * (1 + 0.05) = total * 1.05 — increases payout 5% above face value, implying RTP > 100%. Backward: arbitrated 95% RTP target requires total * (1 - HOUSE_EDGE) = total * 0.95. Sanity: (1 - 0.05) = 0.95 → forward(0.95) returns 95% ✓. The operand must be `(1 - HOUSE_EDGE)`, not `(1 + HOUSE_EDGE)`. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds the payout UP, gifting the player fractional credits that should belong to the house. Slot-machine industry convention mandates Math.floor so the house retains the remainder. |
| `spin` | L114–L118 | 🟡 NEEDS_FIX | 95% | Arbitrated intent: `type Bet = number; // 1..100 coins, integer`. The guard at L114 enforces `< 1` and non-integer but not `> 100`. L118 only emits a console.warn for oversized bets, allowing them to proceed. The `> 100` case must be folded into the throwing condition. |

### `src/events.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `SpinEventEmitter` | L7–L8 | 🟡 NEEDS_FIX | 88% | this.listeners.get(event) returns the exact array reference emit() is iterating on L21. handlers.push(handler) mutates that live array, so the new handler is appended mid-iteration and called immediately. Fix: in emit(), iterate over a snapshot — `for (const handler of handlers.slice())` — so in-cycle registrations are isolated. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L12 | 🟡 NEEDS_FIX | 72% | `spinReel(i)` receives no `rowCount` argument. The abstract method signature includes `rowCount` as a meaningful contract parameter, but this implementation discards it (`_rowCount`). If `spinReel` always returns a fixed-size array, calls with a different `rowCount` silently produce a mis-sized reel grid. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil(total)` with `Math.floor(total)` to follow slot-machine convention: fractional remainder stays with the house. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add `|| bet > 100` to the throwing validation condition and remove the separate console.warn, so bets outside 1..100 are rejected rather than silently accepted. [L114]
- [ ] <!-- ACT-7dd2fe-1 --> **[correction · medium · small]** `src/events.ts`: In emit(), change `for (const handler of handlers)` to `for (const handler of handlers.slice())` so mutations caused by on() calls inside a handler do not affect the current iteration, preventing unexpected mid-cycle invocations and potential infinite loops. [L21]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Pass `rowCount` to `spinReel` (or slice/pad its result) so the returned inner arrays have the caller-requested number of rows, honoring the abstract interface contract. [L12]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `const lineBet = bet / 10; return multiplier * lineBet` with `return Math.floor(multiplier * bet / 10)`. This keeps `multiplier * bet` as a safe integer product before the single division-and-floor, eliminating both IEEE 754 drift and fractional coin payouts, and enforces the slot-machine down-rounding rule. [L22]
- [ ] <!-- ACT-e0699c-1 --> **[correction · medium · small]** `src/strategy.ts`: ConservativeStrategy reduces totalPayout to 80% of base, pushing RTP to ~76% against the arbitrated 95% RTP target. Either remove ConservativeStrategy, gate it to non-regulated contexts only, or redesign it so it adjusts RTP within the approved 95% band (e.g. by redistributing wins rather than globally scaling down). [L16]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` so the house correctly retains 5% of winnings and RTP targets 95%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a seeded, auditable PRNG (e.g. AES-CTR DRBG or a certified Xorshift variant). Math.random() is not reproducible or independently verifiable, which fails regulatory certification requirements for slot-machine RNG. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a CSPRNG source (e.g. crypto.getRandomValues() scaled to a float in [0,1)) to satisfy regulated gaming RNG certification requirements. [L7]
