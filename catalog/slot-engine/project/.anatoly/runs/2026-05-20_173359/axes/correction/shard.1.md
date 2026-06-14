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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 93% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 82% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | total * (1 + HOUSE_EDGE) = total * 1.05 INCREASES the payout by 5% — the opposite of a house edge. Should be total * (1 - HOUSE_EDGE) = total * 0.95 to honour the arbitrated 95% RTP target. Forward: any winning payout is inflated 5% above the paytable → implied RTP > 100%. Backward: target RTP 95% requires multiplier (1 − 0.05) = 0.95. Sanity: 0.95 applied to a 100%-calibrated paytable → 95% RTP ✓. Current code uses 1.05, off by a sign. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds payout UP, giving the player the fractional remainder. Slot-machine convention requires Math.floor so the house retains the sub-unit remainder. Minor, but directionally wrong for a house-edge game. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | bet > 100 emits console.warn and allows the spin to proceed. Arbitrated intent states Bet is '1..100 coins, integer'. Bets above 100 must be rejected with a throw, not just warned about. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a string primitive, not an Error. Callers checking e.message get undefined; e instanceof Error is false. Should be throw new Error("invalid bet"). |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 75% | REEL_WEIGHTS has exactly 5 elements (indices 0–4). REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5; pickFromWeighted then crashes at wts.reduce(...) with TypeError: Cannot read properties of undefined. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 72% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside 0–4; TypeScript types this as number[] so callers receive undefined where they expect an array, causing downstream crashes. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 72% | Returns a direct reference to the internal weight array. A caller can mutate it (e.g. getReelWeights(0)[0]=0), silently corrupting the RNG distribution for all subsequent spins. Docs state 'Weights are read-only at runtime'; the implementation does not enforce this. |

### `src/paytable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `PAY_TABLE` | L11 | 🟡 NEEDS_FIX | 60% | Forward: P(DIAMOND/reel) = 30/120 = 0.25; P(5-of-a-kind, no WILD) = 0.25^5 = 0.000977; payout per hit = 1000 × lineBet = 1000 × (bet/10) = 100 × bet; expected RTP contribution over 10 paylines = 10 × 0.000977 × 100 = 0.977 (97.7% of bet). Backward: target total RTP = 95%; DIAMOND 5-of-a-kind alone already at 97.7% exhausts the full budget. Sanity: 0.25^5 × 1000 = 0.977 ✓ formula consistent. Conclusion: DIAMOND's multiplier (1000) is ~20× too large relative to its weight (25%), or the weight must be ~20× lower relative to the multiplier. Inferred regulated slot domain from payline/paytable/jackpot vocabulary; implied RTP > 100% violates the house-edge invariant (arbitrated target: 95%). |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Add a throwing guard for bet > 100 in spin() to enforce the arbitrated 1..100 coin contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to guarantee integer coin payouts and eliminate IEEE 754 fractional accumulation — required by slot-machine industry convention (house keeps the remainder). [L23]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel: throw a RangeError (or return an error type) if reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length. [L44]
- [ ] <!-- ACT-83e35f-4 --> **[correction · medium · small]** `src/reels.ts`: Add bounds validation to getReelWeights and return a defensive copy or ReadonlyArray<number> to prevent callers from mutating internal reel state. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Guard against empty items array at function entry (throw or return a typed sentinel) to prevent undefined-typed-as-T from escaping. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so payouts are reduced by 5%, achieving the arbitrated 95% RTP instead of the current >100% RTP. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: Recalibrate PAY_TABLE DIAMOND multipliers (50/250/1000) downward, or reduce DIAMOND reel weight from 30/120 in src/reels.ts, so the total theoretical RTP across all symbols and run lengths converges to ≤95%. DIAMOND 5-of-a-kind alone currently contributes ~97.7% RTP, exhausting the full 95% target before any other winning combination is counted. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to the single-digit range (~3–6) so its per-payline expected payout is a small fraction of the 95% RTP target. At weight=30, DIAMOND alone contributes ~229% RTP, making the total impossible to cap at 100%, let alone 95%. [L13]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() with a certifiable CSPRNG (e.g., crypto.getRandomValues) to meet regulated gaming RNG requirements. [L33]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues()-based uniform draw to satisfy regulated gaming RNG requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout so fractional remainders are kept by the house per slot-machine convention. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Change throw "invalid bet" to throw new Error("invalid bet") so standard Error handling works for callers. [L115]
