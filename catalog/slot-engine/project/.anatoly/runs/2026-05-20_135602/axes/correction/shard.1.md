[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 83% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | Forward: total*(1+0.05)=total*1.05 — natural payouts amplified 5%, implying RTP > 100% (house loses). Backward: target RTP 95% requires total*(1-0.05)=total*0.95. Sanity: factor 0.95 → forward(0.95)=95% RTP ✓ formula consistent. Current code uses wrong sign; (1+HOUSE_EDGE) must be (1-HOUSE_EDGE). The function's own JSDoc states 'maintains a target RTP of approximately 95%', directly contradicting the implementation. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds fractional payout UP to the player. Slot-machine industry convention (inferred from reel/payline/jackpot/lineBet vocabulary throughout this codebase): payout rounds DOWN (Math.floor); the house retains the fractional credit. ceil further inflates effective RTP beyond the already-wrong line 105 calculation. |
| `spin` | L114–L118 | 🟡 NEEDS_FIX | 90% | Validation throws for bet < 1 but accepts bet > 100 with only console.warn. Arbitrated intent: 'type Bet = number; // 1..100 coins, integer'. The > 100 branch must throw the same way the < 1 branch does. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 92% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex<0 or reelIndex>4. pickFromWeighted then calls undefined.reduce(), throwing TypeError at runtime. Add a guard: if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...). |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 88% | Reference docs state 'Weights are read-only at runtime — there is no setter.' Returning the live array allows callers to write getReelWeights(0)[0]=999 and silently corrupt all future spins on reel 0. Fix: return REEL_WEIGHTS[reelIndex].slice(). |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: In computePayout L110: replace Math.ceil with Math.floor. Slot machines round payout down; ceil awards fractional credits to the player, further widening the RTP overpayment. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In spin L118: replace console.warn with a throw (matching the < 1 guard) to enforce the documented upper bound of 100. Current code allows arbitrarily large bets. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return Math.floor(multiplier * bet / 10);` to guarantee integer coin payouts and correct casino rounding (round down, house keeps remainder). [L22]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds check in spinReel before accessing REEL_WEIGHTS[reelIndex] to prevent TypeError on invalid indices. [L44]
- [ ] <!-- ACT-83e35f-4 --> **[correction · medium · small]** `src/reels.ts`: Return a shallow copy (slice()) from getReelWeights to prevent external mutation of the internal weight table. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Guard against empty `items` array: throw an error (or return a typed sentinel) rather than silently returning `undefined` cast as `T`. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout L105: replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)`. Current formula amplifies payouts to RTP > 100%; 1 - 0.05 = 0.95 correctly targets the documented 95% RTP. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable, auditable RNG suitable for regulated gaming. [L33]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to approximately 9–12 (or rebalance the full weight table) so that the total expected line-bet return across all symbols stays near the arbitrated 95% RTP target. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable RNG source suitable for regulated gaming (e.g. a seeded, auditable PRNG or CSPRNG). Math.random() is not acceptable for certified slot-machine RNG. [L7]
