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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4 | 96% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | total * (1 + HOUSE_EDGE) multiplies by 1.05, boosting payout 5% above baseline. JSDoc states target RTP ≈ 95%, requiring factor (1 − HOUSE_EDGE) = 0.95. Forward: current code → player receives more than base wins → RTP > 100%. Backward: 95% target → factor = 1 − 0.05 = 0.95. Sanity: forward(0.95) = 95% ✓ — formula is consistent, constant application is inverted. Fix: replace (1 + HOUSE_EDGE) with (1 − HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Math.ceil rounds the final payout up; slot-machine industry convention requires Math.floor so the house retains fractional remainders. Combined with the wrong multiplier above, payouts are doubly inflated. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a string, not an Error. Callers using catch(e) { if (e instanceof Error) } or accessing e.message will silently mishandle this rejection. |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | rng and reelsModule are resolved from the container but never called; factory.buildReels(5, 3) builds reels independently. The registered weightedPick RNG (L30) and reels module (L32) are entirely bypassed, making those container registrations dead code and decoupling the actual spin from the configured RNG. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 62% | Inferred slot-machine domain from classic reel symbols (CHERRY, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER). Math.random() is a non-seeded, non-auditable PRNG; regulated gaming RNG must use a certifiable source (e.g., CSPRNG via crypto.getRandomValues). Industry convention for certified gaming software. |
| `spinReel` | L44–L47 | 🟡 NEEDS_FIX | 96% | REEL_WEIGHTS has indices 0–4. If reelIndex is negative or ≥ 5, REEL_WEIGHTS[reelIndex] is undefined. Passing undefined as wts to pickFromWeighted causes TypeError at wts.reduce() on L31. |
| `getReelSymbols` | L52–L54 | 🟡 NEEDS_FIX | 85% | Returns direct reference to internal SYMBOLS array; callers can mutate it, corrupting symbol-to-weight mapping for all future spins. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside 0–4, violating the declared return type number[] and causing downstream crashes. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | Returns the live array reference from REEL_WEIGHTS; any mutation by the caller (e.g. getReelWeights(0)[0] = 0) permanently alters spin probabilities for that reel. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L15–L17 | 🟡 NEEDS_FIX | 72% | On initial trigger (!state.active && scatters >= 3), state.remaining is set to 10 and no decrement occurs. If the caller treats each handleFreeSpins call as consuming one spin, the triggering spin is awarded for free (player gets 11 effective spins). Docs say '10 free spins awarded' implying the trigger spin is a paid spin; remaining should start at 10 and the trigger-spin's cost is borne by the normal spin loop, so this is only a bug if the caller passes the trigger spin through the decrement path as well — the function gives no guard against double-counting. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Docstring declares function 'suitable for gaming RNG applications' but uses Math.random(), a non-cryptographic PRNG. Regulated gaming RNG must be certifiable (provably uniform, auditable seed); Math.random() is neither (industry convention for gaming/casino RNG). Domain is confirmed by slot-machine vocabulary in the internal docs (DIAMOND weights, RTP target, free-spin mechanics). |
| `weightedPick` | L15 | 🟡 NEEDS_FIX | 85% | When items is empty (length 0), the loop never executes and the fallback evaluates items[-1] === undefined, silently returning undefined as T. Caller receives a typed value that is actually undefined, causing runtime errors downstream. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil(total) with Math.floor(total) in computePayout; slot-machine convention requires rounding down so the house retains fractional remainders. [L110]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: Clarify or enforce the caller contract: handleFreeSpins must NOT be called on the same spin that triggered free spins as if it were a free spin consumption. If it is called each spin unconditionally, set state.remaining = 9 on initial trigger (line 17) so the triggering spin counts as the first of the 10. [L17]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Return a shallow copy in getReelWeights (e.g. [...REEL_WEIGHTS[reelIndex]]) and add a bounds guard to avoid returning undefined. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add a guard at function entry: if items.length === 0 throw an error (or return a typed sentinel) rather than returning undefined as T. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so the house edge reduces the payout and achieves the documented ≈95% RTP. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with crypto.getRandomValues() or another certifiable CSPRNG suitable for regulated gaming. [L32]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Add bounds check in spinReel: throw or return an error if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length before accessing REEL_WEIGHTS[reelIndex]. [L44]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable, cryptographically-secure RNG (e.g. crypto.getRandomValues) to meet regulated gaming requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack trace and satisfy instanceof Error checks in callers. [L115]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Either wire the container-resolved rng into factory.buildReels() or remove the unused rng and reelsModule resolves; currently the registered weightedPick RNG is never invoked for reel generation. [L120]
- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Return a shallow copy in getReelSymbols (e.g. [...SYMBOLS]) to prevent external mutation of the internal symbol table. [L53]
