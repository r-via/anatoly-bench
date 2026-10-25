[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 97% | [details](#srcenginets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L107 | 🟡 NEEDS_FIX | 97% | (1 + HOUSE_EDGE) = 1.05 increases the total by 5% instead of reducing it. Forward: final = W*1.05 + 0.01*bet > W for any W > 0, implying RTP > 100%. Backward: targeting RTP ≈ 95% requires total * (1 − HOUSE_EDGE) = total * 0.95. Sanity: substituting (1−0.05) into forward gives RTP < 1 ✓ formula is consistent. Fix: replace (1 + HOUSE_EDGE) with (1 − HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 97% | Inferred slot-machine domain from reel/payline/jackpot/DIAMOND vocabulary. Math.ceil rounds payouts UP, over-paying up to 1 coin per spin; slot industry convention requires Math.floor so the house retains the fractional remainder. |
| `spin` | L118–L119 | 🟡 NEEDS_FIX | 88% | README defines Bet as 1..100 coins integer. Validation throws for bet < 1 or non-integer but only console.warn for bet > 100, allowing out-of-contract inputs to proceed silently. The upper-bound check must throw the same way the lower-bound does. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 95% | Inferred slot-machine domain from reel/payline/scatter/free-spin vocabulary in the codebase. Industry convention: a retrigger adds spins but does NOT exempt the current spin from being consumed. This branch should do `state.remaining += 10; state.remaining--;` (net +9) or equivalently `state.remaining += 9`. Omitting the decrement means the retrigger spin costs nothing, so rounds can chain indefinitely and total spins awarded is wrong by +1 per retrigger. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L10–L15 | 🟡 NEEDS_FIX | 85% | The parameter _rowCount is discarded and never passed to spinReel. spinReel is documented to return a 3-symbol reel unconditionally. If the engine ever calls buildReels with a rowCount other than 3, the returned reels will have the wrong number of rows without any error or warning. The contract of buildReels(reelCount, rowCount) implies the caller controls row count, but the implementation ignores it entirely. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil(total)` with `Math.floor(total)` to round slot payouts down, retaining fractional coins for the house per standard slot-industry convention. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `console.warn("bet exceeds maximum")` with `throw "invalid bet"` (or include `bet > 100` in the existing validation condition) so out-of-range bets are rejected per the 1..100 contract. [L119]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Either enforce that rowCount must equal 3 (throw if not) or update spinReel to accept and respect a rowCount parameter, so buildReels honors the rowCount contract it exposes. [L10]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (state.active && scatters >= 3), consume the current free spin in addition to adding the award: change `state.remaining += 10` to `state.remaining += 9` (or add `state.remaining--` after the increment). This matches the slot-machine convention that every played round is counted regardless of retrigger. [L18]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces the raw win total, bringing RTP toward the documented 95% target instead of exceeding 100%. [L107]
