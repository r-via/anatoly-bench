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
| `src/reels.ts` | 🔴 CRITICAL | 3 | 90% | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 80% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 95% | total * (1 + HOUSE_EDGE) multiplies by 1.05, giving players a 5% bonus instead of deducting the house margin. JSDoc states the intent is ~95% RTP. Forward: if base payout equals bet (100% pre-edge), result is 105% RTP. Backward: target 95% requires multiplier 0.95 = 1 − 0.05. Sanity: 1 − 0.05 = 0.95 → forward(0.95) = 95% ✓ formula is consistent. Fix: total * (1 - HOUSE_EDGE). |
| `computePayout` | L108 | 🔴 ERROR | 95% | total += bet * 0.01 unconditionally adds 1% of the bet on every spin, including losing spins (total = 0 before this line). Not mentioned in the JSDoc or any spec; inflates effective RTP by roughly 1 percentage point per spin. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds payouts up, paying players fractional coins the house should retain. Slot-machine industry convention requires Math.floor (house keeps the remainder). Domain inferred from jackpot/payline/WILD/SCATTER vocabulary throughout the file. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a primitive string. Callers catching the error as an Error instance receive a string with no .message or .stack, breaking standard error handling. Should be: throw new Error("invalid bet"). |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | rng (line 120) and reelsModule (line 122) are resolved from the container but never referenced afterward. factory.buildReels(5, 3) builds the reels instead, bypassing the registered weightedPick RNG and reel functions entirely. The container registrations for "rng" and "reels" are dead; the actual RNG driving the spin is uncontrolled by the DI configuration. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 75% | Inferred slot-machine domain from reel/spin/paytable vocabulary (CHERRY, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER). Math.random() uses a browser-internal PRNG (xorshift128+/Mulberry32) with no external seed audit trail; regulated gaming jurisdictions (GLI-11, BMM) require a certified, independently auditable RNG. Math.random() cannot satisfy that requirement. |
| `spinReel` | L44 | 🔴 ERROR | 88% | REEL_WEIGHTS has exactly 5 entries (indices 0–4). Any reelIndex outside that range returns undefined. pickFromWeighted then calls undefined.reduce() → TypeError at runtime. No guard exists. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 88% | REEL_WEIGHTS[reelIndex] is undefined for reelIndex < 0 or >= 5. TypeScript types this as number[] but the runtime value is undefined, silently breaking any caller that relies on the return type. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L9–L14 | 🟡 NEEDS_FIX | 85% | `_rowCount` is dropped entirely. The contract inherited from `AbstractReelBuilderFactory` implies callers control both dimensions. Because `spinReel` hard-codes 3 rows, a call like `buildReels(5, 4)` silently returns a 5×3 grid instead of 5×4, producing a dimension mismatch for any downstream consumer (payline evaluator, win-condition checker) that sizes itself from the requested `rowCount`. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 80% | Inferred slot-machine domain from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbol vocabulary in internal docs and the function's own JSDoc ('suitable for gaming RNG applications'). Math.random() delegates to the JS engine's built-in PRNG (V8 uses xorshift128+), which is not independently certifiable by a gaming lab (GLI/BMM/etc.). Regulated gaming RNG must use a certifiable algorithm (e.g., AES-CTR-DRBG seeded from a hardware entropy source or Web Crypto getRandomValues()). NEEDS_FIX per industry convention for casino/gaming RNG. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or document total += bet * 0.01; it silently returns 1% of bet on every spin including losses, inflating RTP beyond the documented target. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so the house retains fractional remainders per casino-industry convention. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Add a missing-key guard in EngineContainer.resolve that throws a descriptive Error instead of returning undefined cast to T. [L25]
- [ ] <!-- ACT-28c3e3-6 --> **[correction · medium · small]** `src/engine.ts`: Either pass the resolved rng and reelsModule into the factory/reel-building logic, or remove the dead container.resolve calls so the DI setup reflects actual runtime behavior. [L120]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Either validate that `rowCount` equals the row count actually produced by `spinReel` and throw if they differ, or restructure `spinReel` to accept `rowCount` so the contract is honoured. [L9]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Apply Math.floor to the final return value so payout is always an integer number of coins: `return Math.floor(multiplier * lineBet)`. Fractional coin payouts violate regulated gaming payout-rounding requirements. [L23]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add the same bounds guard to getReelWeights to prevent silently returning undefined and violating the declared return type. [L57]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() (or an equivalent certifiable PRNG) to satisfy regulated gaming RNG requirements. Example: use a Uint32Array with crypto.getRandomValues and normalise to [0, 1) before multiplying by totalWeight. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Fix house-edge direction in computePayout: change total * (1 + HOUSE_EDGE) to total * (1 - HOUSE_EDGE) to deduct the 5% margin and achieve the documented ~95% RTP. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically auditable RNG (e.g., crypto.getRandomValues) to meet regulated gaming certification requirements (GLI-11, BMM). [L32]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Add a bounds guard at the top of spinReel: if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(`Invalid reel index: ${reelIndex}`). [L44]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[correction · low · trivial]** `src/engine.ts`: Replace throw "invalid bet" with throw new Error("invalid bet") to produce a proper Error instance with a stack trace. [L115]
