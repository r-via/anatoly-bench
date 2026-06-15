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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 82% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | total * (1 + HOUSE_EDGE) = total * 1.05 raises the payout by 5% instead of reducing it. Forward: multiplier 1.05 → RTP exceeds base RTP, contradicting the arbitrated 95% target. Backward: for 95% RTP with HOUSE_EDGE=0.05, multiplier must be (1 - 0.05) = 0.95. Sanity: forward(0.95) → 95% RTP ✓. Fix: replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | Math.ceil rounds fractional credits UP, giving the player more than computed and eroding house edge. Slot-machine industry convention requires Math.floor so the house retains the remainder. |
| `spin` | L115 | 🟡 NEEDS_FIX | 72% | throw "invalid bet" throws a string literal, not an Error. Callers using catch(e) { e.message } get undefined; e instanceof Error returns false. Fix: throw new Error("invalid bet"). |
| `spin` | L118 | 🟡 NEEDS_FIX | 72% | bet > 100 emits only console.warn; the arbitrated intent specifies the valid range as 1..100 (integer). Values above 100 must throw the same Error as other invalid bets. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 82% | Inferred slot-machine domain from reel/paytable/jackpot vocabulary in reference docs and the function's own JSDoc ('suitable for gaming RNG applications'). Math.random() is a non-deterministic, non-auditable PRNG — not certifiable for regulated gaming RNG (industry convention, Rule 11). A certifiable implementation requires a seeded, auditable PRNG (e.g. a PCG or xoshiro variant with recorded seed) or crypto.getRandomValues()-based draw so regulators can reproduce and verify outcomes. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Add `|| bet > 100` to the validation guard so bets above 100 are rejected with an Error rather than silently allowed with a warning. [L118]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor to keep fractional credits for the house, consistent with slot-machine rounding conventions. [L110]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `multiplier * (bet / 10)` with `Math.floor(multiplier * bet / 10)` to ensure integer-coin payouts and eliminate floating-point imprecision on non-multiples-of-10 bet values. [L22]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the 5% house edge reduces payouts toward the 95% RTP target instead of inflating them. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable randomness source (e.g. crypto.getRandomValues to produce a uniform float in [0, total)) so the RNG meets regulated gaming certification requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable PRNG (seeded, auditable — e.g. PCG32/xoshiro128** with recorded seed, or a crypto.getRandomValues()-based uniform draw). Math.random() cannot satisfy regulatory RNG certification requirements for a licensed slot engine. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to produce a proper Error instance with a stack trace. [L115]
