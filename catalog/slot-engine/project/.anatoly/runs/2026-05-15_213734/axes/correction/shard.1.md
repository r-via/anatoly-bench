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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 91% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | `bet > 100` only emits console.warn. The arbitrated intent from README confirms the valid range is 1..100 coins integer — bets above 100 must throw just as bets below 1 do. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | `throw "invalid bet"` throws a primitive string. Any catch block testing `err instanceof Error` silently falls through; `err.message` is undefined. Replace with `throw new Error("invalid bet")`. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS has exactly 5 entries (indices 0–4). Any reelIndex ≥ 5 or < 0 yields undefined; pickFromWeighted then throws at wts.reduce(...) with 'Cannot read properties of undefined'. No guard or assertion present. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 80% | REEL_WEIGHTS[reelIndex] returns undefined for any out-of-range index, violating the declared number[] return type and allowing callers to proceed with an undefined array reference. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-1 --> **[correction · medium · small]** `src/engine.ts`: Add `|| bet > 100` to the existing guard on line 114 (or a separate throw on line 118) so bets above 100 are rejected, matching the arbitrated 1..100 valid-range contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Track `wildCount` (count of WILD symbols in the matched run) inside the counting loop, then multiply the base payout by `(1 + wildCount) * Math.pow(2, wildCount)` before returning. [L22]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a CSPRNG (e.g., crypto.getRandomValues()) to meet regulated gaming RNG requirements. [L32]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add bounds check in spinReel: throw RangeError (or assert) when reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length before accessing the weights array. [L44]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add an early throw (or type-level NonEmptyArray constraint) when items.length === 0 to prevent a silent undefined return that violates the declared return type T. [L6]

## 🔧 Refactors

- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight so its 5-match contribution (1000 × (w/120)^5 × 10 paylines) stays within a fraction of the 95% RTP budget; a weight in the range 3–13 is consistent with targeting 95% total RTP alongside other symbol payouts. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues (or equivalent CSPRNG) to produce certifiable randomness required for regulated gaming RNG. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-2 --> **[correction · low · trivial]** `src/engine.ts`: Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to give callers a proper Error instance with a stack trace and `.message` property. [L115]
- [ ] <!-- ACT-89de92-1 --> **[correction · low · trivial]** `src/freespin.ts`: In the retrigger branch, decrement remaining by 1 after adding 10 (i.e. `state.remaining += 9`) so the current free spin is consumed and exactly 10 new spins are granted, matching the documented retrigger award. [L17]
- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Add the same bounds check in getReelWeights to prevent returning undefined where number[] is expected. [L57]
