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
| `src/engine.ts` | 🔴 CRITICAL | 2 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 78% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 95% | total * (1 + HOUSE_EDGE) increases payout by 5% instead of deducting it. Must be total * (1 - HOUSE_EDGE). Violates the arbitrated RTP=95% target [README.md]; current formula yields RTP > 100% on every non-zero line win. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds payout up, giving the player the fractional remainder. Slot-machine industry convention requires Math.floor (house retains fractional coins). Domain inferred from reel/payline/jackpot/WILD/SCATTER vocabulary throughout the file. |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | rng (L120) and reelsModule (L122) are resolved from the container but never referenced again. factory.buildReels(5, 3) constructs reels independently, bypassing the container-registered weightedPick and getReelSymbols/getReelWeights. The paytable resolve (L121) is used correctly when passed to evaluateLine. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 72% | REEL_WEIGHTS[reelIndex] is undefined for reelIndex ≥ 5 or negative; wts.reduce() at line 31 then throws TypeError at runtime. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 68% | Out-of-bounds reelIndex returns undefined but the signature promises number[], causing downstream callers to receive undefined without a type error unless noUncheckedIndexedAccess is enabled. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L9–L13 | 🟡 NEEDS_FIX | 55% | `rowCount` is discarded (`_rowCount`) and never forwarded to `spinReel(i)`. If `spinReel` returns a fixed-length strip, the concrete implementation silently violates the contract declared by the abstract base class — callers requesting a specific row count (e.g. `buildReels(5, 5)`) receive whatever fixed length `spinReel` happens to produce, with no error or adaptation. Confidence is moderated because `spinReel`'s signature is not shown here. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout; slot-machine payouts must round down so the house retains the fractional remainder. [L110]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Forward `rowCount` to `spinReel` (or slice/pad its result) so callers receive reels of the requested height; remove the `_` suppression prefix once the parameter is used. [L9]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Apply Math.floor to the return value: `return Math.floor(multiplier * lineBet)` — bets of 1–9, 11–19, etc. (all valid per Bet=1..100) produce fractional lineBet values; returning fractional coins is incorrect in a coin-based slot engine and violates the house-keeps-remainder convention. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError instead of allowing undefined to propagate into pickFromWeighted. [L44]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a certifiable RNG source (e.g. crypto.getRandomValues) required for regulated gaming applications. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout to deduct the 5% house edge rather than inflate the payout. [L105]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Remove the unused container.resolve calls for rng (L120) and reelsModule (L122) from spin(), or thread them through factory.buildReels so the container-registered RNG actually governs reel construction. [L120]
- [ ] <!-- ACT-83e35f-2 --> **[correction · low · trivial]** `src/reels.ts`: Add the same bounds guard in getReelWeights and narrow the return type or throw on invalid index so callers cannot silently receive undefined. [L57]
