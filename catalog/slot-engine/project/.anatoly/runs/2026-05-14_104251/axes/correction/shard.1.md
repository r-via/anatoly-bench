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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L25 | 🟡 NEEDS_FIX | 55% | Map.get() returns undefined for unknown keys; casting that to T propagates undefined as a typed value, causing obscure runtime failures downstream instead of an immediate diagnostic error. |
| `computePayout` | L105 | 🔴 ERROR | 95% | total * (1 + HOUSE_EDGE) multiplies the payout by 1.05, giving players 5% MORE than the raw line-win total. Forward derivation: RTP = raw_payout * 1.05 / bet > raw_payout / bet — any positive payout exceeds input, implying RTP > 100%. Backward derivation: target 95% RTP requires total * (1 - HOUSE_EDGE) = total * 0.95. Sanity: 1 - 0.05 = 0.95 → forward(0.95) = 95% ✓. Current sign is wrong; must be (1 - HOUSE_EDGE). |
| `computePayout` | L108 | 🔴 ERROR | 95% | bet * 0.01 is added unconditionally after the edge calculation, including on losing spins where total is 0. This undocumented 1%-of-bet consolation return raises RTP on every spin, compounding the inflated-edge error above. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds payout UP, giving fractional-coin remainders to the player instead of the house. Slot-machine industry convention (inferred from reel/payline/jackpot/WILD vocabulary throughout this file): payouts must round DOWN (Math.floor) so the house retains remainders. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | bet > 100 only emits console.warn and continues. The arbitrated contract specifies '1..100 coins, integer' [README.md]; values above 100 must be rejected with a thrown Error, not silently accepted. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a string literal. String throws carry no stack trace and bypass instanceof Error guards; must be throw new Error("invalid bet"). |
| `spin` | L122 | 🟡 NEEDS_FIX | 90% | reelsModule resolved from container but never referenced in the function body; factory.buildReels() does not receive it. The container registration is a dead stub and the actual reel configuration is unconnected to this resolution. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 90% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or reelIndex >= 5. undefined is then passed as wts to pickFromWeighted, where wts.reduce() throws TypeError. |
| `getReelSymbols` | L53 | 🟡 NEEDS_FIX | 78% | Returning SYMBOLS directly allows external code to mutate it (push, splice, index assignment). Mutations affect the items argument seen by every subsequent pickFromWeighted call inside spinReel. Should return [...SYMBOLS] or a ReadonlyArray. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] returns undefined for out-of-range index, silently violating the declared return type number[]. Additionally, callers mutating the returned array directly mutate REEL_WEIGHTS[reelIndex], corrupting weight state for all future spins on that reel. Should guard bounds and return a copy. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L12 | 🟡 NEEDS_FIX | 88% | `spinReel(i)` ignores `_rowCount`. If `spinReel` supports a row-count argument (or if the returned reel must be sliced to `rowCount` symbols), the caller's intent is silently dropped, producing reels of the wrong length. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17 | 🟡 NEEDS_FIX | 72% | Branch `state.active && scatters >= 3` does `remaining += 10` but never decrements for the in-progress free spin. Branch `else if (state.active)` (L19) decrements every normal free spin. A retrigger spin IS a free spin being consumed — remaining should become `remaining - 1 + 10` (net +9), not `remaining + 10`. This inflates free-spin count on every retrigger, increasing payout above the documented 95% RTP target. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or document the unconditional bet * 0.01 consolation payout; it raises RTP on every spin, including full losses. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so fractional payout remainders stay with the house per slot-machine industry convention. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Enforce the upper bound: replace console.warn with throw new Error('bet exceeds maximum') when bet > 100 to match the documented 1..100 integer range. [L118]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Pass `rowCount` (currently `_rowCount`) to `spinReel` or slice its output to `rowCount` symbols so callers receive reels of the requested depth instead of a silently wrong shape. [L12]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (state.active && scatters >= 3), decrement remaining before adding the bonus: `state.remaining += 9` (equivalently: `state.remaining--; state.remaining += 10;`) so the current free spin is consumed consistently with the normal free-spin path. Retrigger should yield net +9 spins, not +10. [L17]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `bet / 10` with integer-safe arithmetic (e.g. `Math.floor(bet / 10)`) so lineBet is always a whole number for any valid integer bet. [L22]
- [ ] <!-- ACT-f69593-2 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression in `Math.floor(...)` to ensure the payout is a whole-coin integer and the house retains any fractional remainder, consistent with the 95% RTP / 5% house-edge contract. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with a certifiable PRNG (e.g. crypto.getRandomValues() seeded buffer, or a tested MT19937 implementation) to meet regulated gaming RNG requirements. [L32]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel: throw RangeError (or return []) when reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length to prevent TypeError crash. [L44]
- [ ] <!-- ACT-83e35f-4 --> **[correction · medium · small]** `src/reels.ts`: Return a shallow copy in getReelSymbols (return [...SYMBOLS]) to prevent external mutation of the shared symbol pool. [L53]
- [ ] <!-- ACT-83e35f-5 --> **[correction · medium · small]** `src/reels.ts`: Add bounds guard and return a copy in getReelWeights (e.g. return [...REEL_WEIGHTS[reelIndex]]) to prevent undefined returns and in-place mutation of internal weight state. [L57]
- [ ] <!-- ACT-e0699c-1 --> **[correction · medium · small]** `src/strategy.ts`: In ConservativeStrategy.adjustPayout, also scale down each LineWin's amount by 0.8 (floored) to keep lineWins consistent with the reduced totalPayout. [L14]
- [ ] <!-- ACT-e0699c-2 --> **[correction · medium · small]** `src/strategy.ts`: ConservativeStrategy's 0.8 multiplier reduces engine RTP to ~76%, contradicting the arbitrated 95% target. Either remove the strategy, raise the multiplier to 1.0, or explicitly document it as an intentional out-of-scope exception to the engine-wide RTP invariant. [L16]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change total * (1 + HOUSE_EDGE) to total * (1 - HOUSE_EDGE) so the house deducts 5% from wins, targeting the documented 95% RTP. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight to a low single-digit value (e.g. 3–5). At weight 30 of 120 total (25% per cell), DIAMOND appears more often than any other symbol including low-value commons, contradicting slot-machine probability conventions and the documented 95% RTP target. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() or a certified CSPRNG. Math.random() is not certifiable for regulated gaming RNG; using it violates standard gaming-jurisdiction requirements and undermines the integrity of the documented 95% RTP target. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[correction · low · trivial]** `src/engine.ts`: Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack trace and support instanceof checks. [L115]
- [ ] <!-- ACT-28c3e3-6 --> **[correction · low · trivial]** `src/engine.ts`: Either pass reelsModule into factory.buildReels() so the registered reel config is actually used, or remove the dead container.resolve('reels') call. [L122]
- [ ] <!-- ACT-28c3e3-7 --> **[correction · low · trivial]** `src/engine.ts`: Add a guard in EngineContainer.resolve() to throw when the key is absent instead of returning undefined cast to T. [L25]
