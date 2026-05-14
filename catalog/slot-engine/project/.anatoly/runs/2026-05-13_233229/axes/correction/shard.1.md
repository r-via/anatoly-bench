[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | Forward: `total * (1 + 0.05)` = `total * 1.05` — increases gross payout by 5%, implying RTP > 100% (player always wins long-run). Backward: target RTP 95% requires `total * (1 - 0.05)` = `total * 0.95`. Sanity: forward(0.95) = 95% ✓ formula consistent. Contradicts arbitrated intent: 'The engine targets a theoretical Return-to-Player of 95%. Long-run player return approximates the bet-weighted house edge of 5%.' Fix: replace `(1 + HOUSE_EDGE)` with `(1 - HOUSE_EDGE)`. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 85% | `total += bet * 0.01` adds 1% of bet unconditionally on every spin (including zero-win spins), further driving effective RTP above 100% on top of the wrong-sign bug on line 105. This line has no documented basis and must be removed. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | `Math.ceil` rounds payout up, awarding the player the fractional coin. Casino/gambling industry convention requires `Math.floor` so the house retains the remainder. |
| `spin` | L114–L118 | 🟡 NEEDS_FIX | 90% | Validation on L114 rejects `bet < 1` and non-integers but silently accepts `bet > 100` (L118 only warns). Arbitrated intent specifies valid range is 1..100; oversized bets must be rejected with the same throw used for other invalid bets. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L33 | 🟡 NEEDS_FIX | 60% | Inferred slot-machine domain from reel/payline/jackpot/scatter vocabulary and README's 95% RTP target. Math.random() is a deterministic PRNG seeded by the runtime — it is not certifiable by gaming regulators (GLI-11, BMM standards). Regulated slot engines must use a hardware or certified software RNG. Using Math.random() here is an industry-level correctness violation. |
| `spinReel` | L44 | 🟡 NEEDS_FIX | 90% | REEL_WEIGHTS[reelIndex] returns undefined for any reelIndex outside [0, 4]. Passing undefined as wts to pickFromWeighted causes wts.reduce() to throw TypeError at runtime. No guard or early-return exists. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] is undefined for reelIndex outside [0, 4]. TypeScript types the return as number[] but the actual value is undefined, which will crash any caller that iterates or reads from the result. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L9–L12 | 🟡 NEEDS_FIX | 72% | `_rowCount` is part of the abstract contract (L5) and callers rely on it to control the inner-array length of the returned `Symbol[][]`, but it is never forwarded to `spinReel(i)`. Any caller requesting a `rowCount` other than `spinReel`'s internal default gets silently wrong reel dimensions, which will corrupt payline evaluation. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 70% | When free spins re-trigger (active=true, scatters>=3), the current spin is itself a free spin being consumed but remaining is not decremented. The normal active branch (L20) always decrements, so a re-triggering spin grants remaining+10 instead of remaining+9, giving the player one unearned free spin per re-trigger. Fix: decrement before adding (state.remaining = state.remaining - 1 + 10) or add 9 instead of 10. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Math.random() is a non-cryptographic PRNG and is not certifiable for regulated gaming. Domain is unambiguously casino/slot from the README arbitrated intents (jackpotHit, freeSpinsAwarded, 95% RTP target, lineWins). Industry convention requires a CSPRNG or certified algorithm (e.g. crypto.getRandomValues); Math.random() is explicitly prohibited in regulated gaming RNG contexts (Rule 12). |
| `weightedPick` | L15 | 🟡 NEEDS_FIX | 85% | When items is empty, the for-loop body never executes and the fallback returns items[items.length - 1] = items[-1] = undefined, violating the T return type. No guard exists for this case. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil(total)` with `Math.floor(total)` so fractional coins remain with the house. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Add `bet > 100` to the existing throw condition on L114 (or add a separate guard) and remove the console.warn on L118 to enforce the documented 1..100 coin range. [L114]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Pass `rowCount` into `spinReel` (or an equivalent parameter) so the returned inner arrays contain exactly `rowCount` symbols, honouring the abstract contract. [L12]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the re-trigger branch, decrement remaining for the current spin before adding the re-trigger award: `state.remaining = state.remaining - 1 + 10` (or equivalently `+= 9`). Every active free spin must consume one count from remaining; the re-trigger spin is no exception. [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `multiplier * lineBet` (floating-point) with `Math.floor((multiplier * bet) / 10)` to ensure integer-coin payouts that round down, satisfying casino-domain exact-arithmetic and house-edge rounding conventions. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds check in spinReel: throw RangeError (or return early) when reelIndex is outside [0, REEL_WEIGHTS.length - 1] to prevent undefined being passed to pickFromWeighted. [L44]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds check in getReelWeights: throw RangeError when reelIndex is out of range instead of silently returning undefined as number[]. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add an early guard (throw or return a typed sentinel) when items.length === 0 to prevent the undefined-as-T return from the fallback path. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to deduct 5% from wins and achieve the documented 95% RTP. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: Remove `total += bet * 0.01`; this undocumented bonus inflates every payout and pushes RTP above 100%. [L108]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certified/cryptographically-secure RNG (e.g. crypto.getRandomValues) suitable for regulated gaming. [L33]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues (or an equivalent certified/seeded CSPRNG) to satisfy regulated gaming RNG requirements. [L7]
