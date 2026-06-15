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
| `src/engine.ts` | 🔴 CRITICAL | 3 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `evaluateLine` | L86 | 🟡 NEEDS_FIX | 55% | Formula `basePayout * (1 + wildCount) * 2 ** wildCount` yields: 1 wild → 4×, 2 wilds → 12×, 3 wilds → 32×. For DIAMOND 5-of-a-kind with 3 wilds: 1000 × lineBet × 32 = 3200× total bet from a single line. Standard wild-doubles schemes yield 2×/4×/8×. The `(1 + wildCount)` and `2 ** wildCount` appear to be two independent multiplier concepts combined multiplicatively by mistake. |
| `computePayout` | L105 | 🔴 ERROR | 95% | Forward: `total * (1 + 0.05)` = total × 1.05 → INCREASES payout by 5%. Backward: target RTP 95% requires `total * (1 - 0.05)` = total × 0.95. Sanity: backward(95%) → factor 0.95 → forward(0.95) ≈ 95% ✓ formula consistent. Code uses `+` instead of `−`, yielding implied RTP ≈ 105% of base payout value. Directly violates arbitrated intent of 95% RTP. |
| `computePayout` | L108 | 🔴 ERROR | 95% | Unconditional `total += bet * 0.01` added every spin regardless of win/loss. For bet=100, player receives Math.ceil(1) = 1 credit on every losing spin. Inferred slot-machine domain: losing spins must return 0. This adds ~1% to effective RTP on top of the sign-inverted house edge. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds payout UP (player's favor). Inferred slot-machine domain from reel/payline/paytable vocabulary. Industry convention: payout rounding must use Math.floor (house keeps the remainder). |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | Arbitrated intent: 'type Bet = number; // 1..100 coins, integer'. Code only calls console.warn for bet > 100 but processes the spin. Bets above 100 are accepted, violating the documented contract. Should throw an error. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | Throws string literal "invalid bet" instead of an Error object. Callers using `instanceof Error` won't catch it, and no stack trace is produced. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Inferred slot-machine domain from reel/paytable/jackpot/scatter/wild vocabulary and documented RTP target in project docs. Math.random() relies on a non-cryptographic PRNG (e.g., xorshift128+ in V8) whose internal state is recoverable from a small number of observed outputs, making it predictable and non-certifiable for regulated gaming. The JSDoc explicitly claims suitability for 'gaming RNG applications,' compounding the issue. Replace with a CSPRNG source (e.g., crypto.getRandomValues) or a certified hardware RNG interface. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or guard the unconditional `total += bet * 0.01` — losing spins in a slot machine must return 0 [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Change Math.ceil to Math.floor — slot machine payouts must round down per industry convention (house keeps remainder) [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Replace `console.warn` with `throw new Error('bet exceeds maximum')` to enforce the documented 1..100 integer range [L118]
- [ ] <!-- ACT-28c3e3-6 --> **[correction · medium · small]** `src/engine.ts`: Review wild multiplier formula — `(1 + wildCount) * 2^wildCount` combines two scaling factors multiplicatively, producing extreme multipliers (4×/12×/32×) that likely inflate RTP beyond target [L86]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with a certifiable RNG source (injected interface or cryptographically secure PRNG) to comply with regulated gaming requirements. [L33]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` to correctly reduce payout by the house edge and target 95% RTP [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to a low single-digit value (e.g., 3–5) to bring RTP near the target 95%. Currently DIAMOND alone contributes ~230% RTP because it is both the most probable (25%) and highest-paying symbol (1000× at 5-of-a-kind). [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a cryptographically secure or certifiable RNG source (e.g., crypto.getRandomValues / crypto.randomInt) — Math.random() is predictable and non-certifiable for regulated gaming. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[correction · low · trivial]** `src/engine.ts`: Change `throw "invalid bet"` to `throw new Error("invalid bet")` for proper error handling and stack traces [L115]
