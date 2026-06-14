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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 65% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 80% | Multiplies by (1 + HOUSE_EDGE) = 1.05, which increases payouts 5% above raw line wins rather than reducing them. Forward: raw paytable × 1.05 → implied RTP ≈ 105%. Backward: RTP=95% target requires × (1 − HOUSE_EDGE) = 0.95. Sanity: 0.95 forward → 95% ✓, formula is consistent. Conclusion: current multiplier 1.05 violates the RTP=95% arbitrated intent [README: 'Long-run player return approximates the bet-weighted house edge of 5%']. Fix: replace (1 + HOUSE_EDGE) with (1 − HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 80% | Math.ceil rounds the payout UP, crediting the player a fractional coin the house should retain. Slot-machine industry convention: payouts round DOWN (Math.floor). Inferred slot-machine domain from reel/payline/jackpot/paytable vocabulary throughout the file. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | bet > 100 triggers console.warn but execution continues. Arbitrated intent [README: 'type Bet = number; // 1..100 coins, integer'] makes the 1..100 range a documented contract; the upper bound must be rejected with a thrown error the same way bet < 1 is. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 60% | Inferred slot-machine domain from reel/payline/jackpot/SCATTER/WILD/lineBet/95%-RTP vocabulary. Math.random() is a non-cryptographic PRNG that is not certifiable under regulated gaming RNG standards (industry convention); must be replaced with a cryptographically secure, auditable RNG source. |
| `spinReel` | L44 | 🟡 NEEDS_FIX | 75% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5. undefined is then passed to pickFromWeighted where wts.reduce(...) throws TypeError: Cannot read properties of undefined. Exported functions should guard against invalid indices. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 72% | REEL_WEIGHTS[reelIndex] is undefined for reelIndex < 0 or >= 5. TypeScript declares the return as number[] but callers receive undefined, breaking any downstream numeric operations without a compiler error at the call site. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Add a throw (or equivalent rejection) for bet > 100 in spin() to enforce the documented 1..100 coin bet contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Track wildCount during the match loop and apply `(1 + wildCount) × 2^wildCount` to the base payout before returning. [L21]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds check in spinReel (and getReelWeights) to throw a descriptive error when reelIndex is outside [0, REEL_WEIGHTS.length). [L44]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Fix getReelWeights return type or add guard so it never silently returns undefined for invalid reelIndex. [L57]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so the 5% house edge reduces payouts and achieves the documented RTP=95% target. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable, cryptographically secure RNG (e.g. crypto.getRandomValues) to comply with regulated gaming RNG requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a CSPRNG (e.g., crypto.getRandomValues() via a uniform-float helper) so the RNG is certifiable for regulated gaming. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout: slot-machine industry convention requires payouts to round down so the house retains the fractional remainder. [L110]
