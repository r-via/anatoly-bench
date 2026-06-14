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
| `src/reels.ts` | 🔴 CRITICAL | 3 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 82% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🔴 ERROR | 92% | REEL_WEIGHTS[reelIndex] returns undefined for any reelIndex outside [0, 4]. pickFromWeighted then calls undefined.reduce(), throwing a TypeError at runtime. Guard with: if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...). |
| `getReelSymbols` | L52–L54 | 🟡 NEEDS_FIX | 75% | Returns a direct mutable reference to the internal SYMBOLS array; a caller mutating the returned array corrupts all subsequent spinReel and getReelSymbols calls. Return a shallow copy instead. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | Returns a mutable reference to REEL_WEIGHTS[reelIndex]; docs state weights are read-only at runtime, but any caller mutating the returned array will corrupt spinReel's weight table for all future spins. Return a shallow copy (slice). |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside [0, 4]; return type is number[] but the actual value is undefined, violating the documented contract of valid range 0–4. Add a bounds guard. |

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | Forward: `total * (1 + 0.05)` = `total * 1.05` raises payout 5% above the paytable base → RTP > 100%. Backward: target RTP 95% requires coefficient 0.95 = (1 − HOUSE_EDGE). Sanity: (1 − 0.05) × base = 0.95 × base → 95% ✓ formula consistent. Conclusion: must be `total * (1 - HOUSE_EDGE)`. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Math.ceil rounds fractional credits up, transferring the remainder to the player. Slot-machine industry convention: payouts round DOWN so the house retains fractional credits. Replace with Math.floor. |
| `spin` | L113–L179 | 🟡 NEEDS_FIX | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/paytable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `PAY_TABLE` | L11 | 🟡 NEEDS_FIX | 60% | DIAMOND row [50, 250, 1000]: with reel weight 30/120 these multipliers alone produce E[multiplier per payline] ≥ 2.223 (no-wild) and ≥ 9+ (with wild bonus), far exceeding the entire 0.95 RTP budget. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L10–L14 | 🟡 NEEDS_FIX | 55% | `rowCount` is declared in the signature but unused (renamed `_rowCount`). The abstract contract `buildReels(reelCount, rowCount): Symbol[][]` implies the returned grid respects `rowCount`. If callers pass a value other than 3, the output silently has the wrong number of rows, producing an incorrectly sized reel grid for the engine. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Throw an error when bet > 100 (same path as the existing < 1 / non-integer check); arbitrated contract defines Bet as 1..100 integer. [L118]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Either pass `rowCount` to `spinReel` so the returned reel respects the requested row count, or explicitly document and enforce that only `rowCount === 3` is valid (throw on other values) to prevent silent misconfiguration. [L10]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to produce integer coin payouts and eliminate floating-point accumulation errors. Applies to both the `bet/10` division and the final multiply — integer-coin slot domains must floor payouts (house keeps the remainder). [L23]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Return a copy in getReelWeights to prevent external mutation of internal reel state; add the same bounds guard. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add a precondition guard at function entry that throws when items.length !== weights.length or items.length === 0, preventing silent NaN-corruption of the distribution on mismatched arrays. [L6]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout; current code boosts payouts by 5% instead of reducing them, producing RTP > 100% against the documented 95% target. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: DIAMOND row [50, 250, 1000] combined with DIAMOND reel weight 30/120 produces implied RTP > 200%, violating the arbitrated 95% target. Reduce DIAMOND multipliers and/or DIAMOND reel weight until the combined E[multiplier per payline] across all symbols equals 0.95. At w=30, the 3+4+5-of-a-kind DIAMOND no-wild contribution alone (2.223) already exceeds the full RTP budget. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable CSPRNG (e.g., Web Crypto getRandomValues) required for regulated gaming. [L32]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Add bounds check in spinReel: throw RangeError if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length. [L44]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a crypto.getRandomValues()-backed uniform draw (e.g. generate a random uint32 and divide by 2^32) to produce certifiable, cryptographically-secure randomness required for regulated gaming RNG. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout; slot-machine payouts must round down so the house retains fractional remainder. [L110]
- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Return a copy in getReelSymbols to prevent callers from corrupting the internal SYMBOLS array. [L53]
