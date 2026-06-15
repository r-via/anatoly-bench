[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 91% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | total * (1 + HOUSE_EDGE) = total * 1.05 increases the payout by 5%, giving the player an extra edge instead of applying the house's 5% cut. Must be total * (1 - HOUSE_EDGE) = total * 0.95 to achieve the documented 95% RTP target. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Math.ceil(total) rounds up, granting the player fractional credits. Slot/casino domain convention requires Math.floor so the house retains the remainder. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | console.warn allows the spin to proceed with an out-of-range bet. The arbitrated intent 'type Bet = number; // 1..100 coins, integer' requires a throw here, consistent with the bet < 1 guard above. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | Return value is the live array — not a copy. A caller can write getReelWeights(0)[0]=0 and permanently mutate REEL_WEIGHTS, changing all future spins. Docs state 'Weights are read-only at runtime — there is no setter.' Fix: return [...REEL_WEIGHTS[reelIndex]]. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor to round payouts down; casino domain requires the house keeps fractional remainders. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Throw an error (not just console.warn) when bet > 100 to enforce the arbitrated 1..100 valid bet range. [L118]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable gaming PRNG (e.g., Web Crypto getRandomValues or a certified RNG library) — Math.random() is not admissible for regulated slot RNG. [L33]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE) so the house retains 5% and player return approaches the documented 95% RTP target. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: DIAMOND multipliers [50, 250, 1000] with reel weight 30/120=0.25 yield ≈229% RTP from DIAMOND runs alone. Either lower these multipliers (e.g. to ~[6, 30, 120]) or reduce DIAMOND's reel weight in reels.ts (e.g. from 30 to ~3-5) until the full-table theoretical RTP converges on the arbitrated 95% target. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to ≤ 8 (and rebalance other weights) so the 5-DIAMOND combo does not alone consume the entire 95% RTP budget across 10 paylines. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() (or a certified PRNG wrapper) to produce a certifiable, auditable random draw required by gaming regulations. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-3 --> **[correction · low · trivial]** `src/reels.ts`: Return a shallow copy of the weight array in getReelWeights (return [...REEL_WEIGHTS[reelIndex]]) to enforce the documented read-only runtime invariant. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · low · trivial]** `src/rng.ts`: Add a pre-condition guard: if items.length === 0 (or items.length !== weights.length), throw a RangeError instead of silently returning undefined. [L15]
