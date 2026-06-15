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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 95% | Multiplies by (1 + HOUSE_EDGE) = 1.05, boosting payout instead of reducing it. Forward: if raw payout ≈ 95% of bet, applied total ≈ 0.95×1.05 + 0.01 ≈ 1.0075 per unit bet → RTP > 100%. Backward: 95% RTP requires (1 − HOUSE_EDGE) = 0.95. Sanity: forward(0.95 multiplier, no consolation) → ~95% ✓. Fix: change to total * (1 - HOUSE_EDGE). |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 95% | Adds bet * 0.01 unconditionally on every spin (winning and losing), returning 1% of bet as an undocumented consolation. No reference documentation mentions a minimum per-spin return; this inflates RTP by ~1% on every spin. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 95% | Math.ceil rounds payout up. Casino/slot domain convention: payouts must round DOWN so the house retains the remainder. Replace with Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 60% | bet > 100 emits console.warn and continues. Arbitrated intent states valid range is 1..100 integer coins. Should throw the same way bet < 1 does. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 95% | Forward derivation — DIAMOND weight=30 → p=30/120=0.25. Per-payline contributions (left-to-right consecutive runs): P(3-DIAMOND)×50 = (0.25³×0.75)×50 = 0.586; P(4-DIAMOND)×250 = (0.25⁴×0.75)×250 = 0.732; P(5-DIAMOND)×1000 = 0.25⁵×1000 = 0.977. Total DIAMOND EV ≈ 2.295 per unit line-bet (229.5% RTP contribution from DIAMOND alone, before any other symbol). Backward derivation — for 95% total RTP, even if DIAMOND were the only winning symbol, its contribution must be < 0.95; solving (w/120)³×0.75×50 + (w/120)⁴×0.75×250 + (w/120)⁵×1000 < 0.95 places w ≈ 14 as an upper bound (still leaving room for other symbols). Sanity check — forward(w=14): p=14/120≈0.117 → 0.117³×0.75×50+0.117⁴×0.75×250+0.117⁵×1000 ≈ 0.060+0.030+0.0058 ≈ 0.095; formula is self-consistent. Current w=30 gives 229.5% vs target 95% — factor > 2 violation. Fix: reduce DIAMOND weight to ≈ 8–12 and re-validate total RTP across all symbols. |
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 95% | Inferred casino/slot-machine domain from CHERRY/SEVEN/BAR/WILD/SCATTER vocabulary, RTP documentation, free-spin and jackpot mechanics across the project. Math.random() (V8 xorshift128+) is not cryptographically secure and cannot pass GLI-11 / BMM / eCOGRA RNG certification. Replace with crypto.getRandomValues() (Web Crypto API, available in Node ≥ 15 and all modern browsers) to draw a uniformly distributed integer in [0, total) before normalizing. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 95% | Inferred regulated slot-machine domain from JSDoc ('suitable for gaming RNG applications'), consumer `spin` in src/engine.ts (paylines, jackpot, free-spins), and reel/paytable vocabulary throughout the reference docs. Math.random() is seeded internally by the JS runtime with no guaranteed entropy source, cannot be audited or reproduced from a seed, and fails certification requirements (GLI-11, BMM, etc.) for RNG in regulated gaming. Replace with a cryptographically-seeded PRNG (e.g., crypto.getRandomValues()) whose seed and output are logged for regulatory audit. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or document the unconditional bet * 0.01 addition; it adds ~1% RTP on every spin with no basis in the reference spec and compounds the house-edge direction bug. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so payout rounding always favors the house, per casino/slot domain convention. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Throw an error (not just console.warn) when bet > 100 to enforce the arbitrated valid range of 1..100 coins, consistent with the existing throw for bet < 1. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to guarantee integer coin payouts across all valid bet values (1..100) per slot-machine industry rounding convention. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with crypto.getRandomValues() (or a certified RNG wrapper) to satisfy GLI/BMM gaming-regulator certification requirements for the slot-machine domain. [L32]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout; current code multiplies payout by 1.05 (boosting it) rather than 0.95 (applying the house edge), producing RTP > 100% instead of the documented 95%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to ≈ 8–12 and re-derive total per-payline EV across all symbols to confirm the 95% RTP target. At weight 30 (p=0.25), DIAMOND 3/4/5-of-a-kind outcomes alone contribute ~229% EV per line-bet, exceeding the arbitrated 95% RTP target by more than a factor of 2. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable RNG (e.g., crypto.getRandomValues() to draw a uint32, then divide by 2^32) so the slot engine's outcome distribution is auditable and reproducible from a logged seed, as required by regulated gaming standards (GLI-11 / equivalent). [L7]
