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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 97% | [details](#srcenginets) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 68% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L107 | 🟡 NEEDS_FIX | 97% | Forward: total * (1 + 0.05) = total * 1.05 increases the raw win by 5%, giving the house a negative edge. Backward: to reach RTP ≈ 95% the factor must be (1 − HOUSE_EDGE) = 0.95. Sanity: 0.95 × base → 5% reduction → target satisfied ✓. The JSDoc says 'target RTP of approximately 95%' but the code does the opposite. Fix: total * (1 - HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 97% | Inferred slot-machine domain from reel/payline/jackpot vocabulary throughout the project. Slot payouts must round DOWN so the house retains fractional coins; Math.ceil rounds UP, over-paying every non-integer result. Fix: Math.floor(total). |
| `spin` | L118–L119 | 🟡 NEEDS_FIX | 78% | README and the Bet type comment specify 1..100 integer. A bet of e.g. 500 passes the lower-bound/type guard, emits only a console.warn, and proceeds to spin with a 5× lineBet — breaking the documented contract. Fix: add `\|\| bet > 100` to the existing throw condition. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L9–L14 | 🟡 NEEDS_FIX | 85% | buildReels accepts rowCount but never passes it to spinReel. spinReel is documented to always generate a 3-symbol outcome. If the engine ever calls buildReels with a rowCount != 3, the returned Symbol[][] will have the wrong number of rows per reel, silently producing malformed reel state that payline evaluation in engine.ts will read incorrectly. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 85% | Inferred slot-machine domain from reel/scatter/jackpot vocabulary. Industry convention: every free spin, including the one that re-triggers, is consumed from `remaining`. The re-trigger branch does `remaining += 10` but omits the `-1` consumption of the current spin, yielding a net +10 instead of the correct +9 (i.e., -1 consumed + 10 awarded). This over-pays the player by one free spin on every re-trigger event. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Change `Math.ceil(total)` to `Math.floor(total)` to round slot payouts down per industry convention. [L110]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Either pass rowCount to spinReel (and update its signature to respect it), or document and enforce that rowCount must always equal 3 to match spinReel's fixed output. Silently ignoring the parameter hides misconfigurations from callers. [L9]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the re-trigger branch (`state.active && scatters >= 3`), change `state.remaining += 10` to `state.remaining += 9` (or equivalently decrement first then add 10) so the current free spin is consumed before awarding the new 10, matching standard slot-machine payout convention. [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `const lineBet = bet / 10; return multiplier * lineBet` with integer-safe math: `return Math.round(multiplier * bet) / 10` (or constrain callers to pass bets that are multiples of 10), so no floating-point imprecision accumulates in the payout. [L22]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces payouts by 5% rather than inflating them. [L107]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Add `|| bet > 100` to the existing invalid-bet throw guard so over-limit bets are rejected, not just warned about. [L118]
