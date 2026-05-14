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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 68% | [details](#srcrngts) |
| `src/legacy.ts` | 🟢 CLEAN | 0 | 55% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | total * (1 + HOUSE_EDGE) multiplies gross wins by 1.05, increasing payout by 5% rather than deducting it. JSDoc states target RTP ≈ 95%; achieving that requires total * (1 - HOUSE_EDGE). As written the formula guarantees RTP > 100% on every winning spin. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds fractional payouts UP, giving players the remainder. Slot-machine industry convention requires Math.floor so the house retains the fractional unit. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a string, not an Error. Catch blocks testing instanceof Error miss it and no stack trace is captured. Use throw new Error("invalid bet"). |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | rng (line 120) and reelsModule (line 122) are resolved from the container but never used anywhere in the function body. factory.buildReels(5, 3) at line 128 uses its own internal implementation, bypassing the registered weightedPick RNG and getReelSymbols/getReelWeights. The IoC wiring for these two keys is dead code and the certifiable RNG path is skipped entirely. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L16–L17 | 🟡 NEEDS_FIX | 78% | Retrigger branch (active && scatters >= 3) adds 10 spins but never decrements remaining for the current spin. The spin that triggered the retrigger is consumed without being counted down, effectively granting a free extra spin on every retrigger. |
| `handleFreeSpins` | L19–L22 | 🟡 NEEDS_FIX | 78% | remaining is decremented before the zero-check, so it reaches 0 (or negative) and is then compared with <= 0. This is not wrong per se, but if handleFreeSpins is called with remaining already at 0 (edge case after a previous call left it at 0 without deactivating), active stays true and remaining becomes -1 before deactivation. The guard should be `if (state.remaining <= 1)` (deactivate before decrement) or decrement after the check to avoid the transient negative state. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 68% | JSDoc declares this function 'suitable for gaming RNG applications', but Math.random() is a non-seeded, non-auditable PRNG that fails regulated gaming certification requirements (GLI, BMM, iTech Labs all require hardware or CSPRNG-seeded generators). Inferred gaming domain from docstring and filename. Industry rule: slot/gaming RNG must be certifiable. |
| `weightedPick` | L15 | 🟡 NEEDS_FIX | 68% | When items is empty, the loop body never executes and the fallback returns items[-1] === undefined, typed as T. TypeScript does not narrow array index access to undefined by default (noUncheckedIndexedAccess off), so the compiler silently accepts the undefined-as-T return. Any caller relying on the result will receive undefined with no type error. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Pass the resolved rng function and reelsModule to the reel builder (or replace factory.buildReels with a path that uses weightedPick, getReelSymbols, and getReelWeights), so the registered certifiable RNG is actually exercised during reel generation. [L120]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (active && scatters >= 3), also decrement remaining by 1 before adding 10, so the spin that caused the retrigger is consumed: state.remaining = state.remaining - 1 + 10. [L17]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: All-WILD line should substitute for the highest-paying regular symbol (or the highest symbol found in the paytable) and call getPayMultiplier with that symbol, not return 0. [L7]
- [ ] <!-- ACT-f69593-2 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return value with Math.floor: `return Math.floor(multiplier * lineBet)` to guarantee integer credit payouts and comply with regulated-gaming rounding rules. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically secure RNG (e.g. crypto.getRandomValues with a Uint32Array) to satisfy regulated-gaming RNG certification requirements. [L32]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Guard against empty items array at the top of the function: if items.length === 0 throw a RangeError rather than returning undefined typed as T. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace total * (1 + HOUSE_EDGE) with total * (1 - HOUSE_EDGE) to deduct the house edge and achieve the documented ~95% RTP target instead of inflating wins. [L105]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a CSPRNG (e.g. crypto.getRandomValues on a Uint32Array scaled to [0, totalWeight)) to satisfy certified gaming RNG requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-2 --> **[correction · low · trivial]** `src/engine.ts`: Replace Math.ceil with Math.floor so the house retains fractional payout remainders per casino convention. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack traces and support instanceof Error checks. [L115]
- [ ] <!-- ACT-89de92-2 --> **[correction · low · trivial]** `src/freespin.ts`: Restructure the decrement block to check and deactivate before decrementing, or use `<= 1` as the threshold, to prevent remaining from going transiently negative and to handle the edge case where remaining is already 0 on entry. [L19]
