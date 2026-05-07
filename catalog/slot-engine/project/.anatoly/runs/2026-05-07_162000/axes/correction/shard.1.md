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
| `src/engine.ts` | 🔴 CRITICAL | 2 | 97% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcreelsts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 93% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 82% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 97% | Sign error: `total * (1 + HOUSE_EDGE)` multiplies by 1.05, boosting payout above raw wins. Documented target is RTP ≈ 95%, requiring factor (1 − 0.05) = 0.95. Forward: current code yields implied RTP > 100%. Backward: RTP=95% → factor 0.95. Sanity: 0.95 → forward(0.95) = 95% ✓ formula is consistent; current constant 1.05 is wrong. Contradicts documented RTP ≈ 95% [.anatoly/docs/02-Architecture/02-Core-Concepts.md, function docstring]. |
| `computePayout` | L108 | 🔴 ERROR | 97% | `total += bet * 0.01` unconditionally adds 1% of bet to every spin result, including zero-win spins. No documentation supports this addend; it further inflates RTP and bypasses the house-edge branch entirely. |
| `computePayout` | L110 | 🔴 ERROR | 97% | `Math.ceil` rounds payout UP. Slot-machine industry convention requires rounding DOWN (`Math.floor`) so the house retains the fractional remainder; rounding up transfers that remainder to the player. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | `throw "invalid bet"` throws a string, not an Error. Callers using `instanceof Error` guards silently swallow it; no stack trace is captured on the thrown value. |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | `rng` (L120) and `reelsModule` (L122) are resolved from the container but never passed to `factory.buildReels` or used anywhere else in `spin`. The container-registered `weightedPick` RNG is dead code; actual reel generation is fully delegated to the factory with no confirmed RNG injection, making the container registration for 'rng' ineffective. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 92% | REEL_WEIGHTS has indices 0–4; reelIndex < 0 or >= 5 returns undefined, which crashes at wts.reduce() inside pickFromWeighted. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 62% | REEL_WEIGHTS[reelIndex] is undefined when reelIndex < 0 or >= 5; the declared return type number[] is violated at runtime, silently propagating undefined to callers. |

### `src/events.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `SpinEventEmitter` | L17–L23 | 🟡 NEEDS_FIX | 80% | emit holds a direct reference to the array stored in the map. on (L6–L9) does handlers.push() on that same reference when the event already exists, so a handler that calls on(sameEvent, newHandler) appends to the array currently under the for-of cursor. newHandler fires in the same emission cycle; if it re-registers itself the loop never terminates. Fix: snapshot before iterating — `const handlers = [...(this.listeners.get(event) ?? [])]`. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil` with `Math.floor` to round payouts down, preserving house edge per slot-machine industry convention. [L110]
- [ ] <!-- ACT-28c3e3-5 --> **[correction · medium · small]** `src/engine.ts`: Pass the container-resolved `rng` function to `StandardReelBuilderFactory` (or confirm the factory already imports `weightedPick` directly), then remove the unused `rng` and `reelsModule` resolutions if injection is handled internally. [L120]
- [ ] <!-- ACT-7dd2fe-1 --> **[correction · medium · small]** `src/events.ts`: In emit, snapshot the handler list before iterating: replace `this.listeners.get(event)` with a spread copy so that on/off calls made from within a handler do not affect the current iteration cycle and cannot produce infinite loops. [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Before returning, count the number of WILD symbols in the matched prefix (positions 0..matchCount-1) and apply the escalation: `return multiplier * lineBet * (1 + wildCount) * Math.pow(2, wildCount)`. When wildCount is 0 the factor reduces to 1, preserving existing non-wild behaviour. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with crypto.getRandomValues() or an equivalent CSPRNG to satisfy regulated gaming RNG certification requirements. [L32]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel: throw a descriptive RangeError when reelIndex < 0 or >= REEL_WEIGHTS.length before accessing REEL_WEIGHTS[reelIndex]. [L44]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to correctly deduct the 5% house edge and target RTP ≈ 95%. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: Remove or document `total += bet * 0.01`; it unconditionally inflates all payouts (including zero-win spins) and is absent from the documented RTP formula. [L108]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() (Web Crypto API) or a certified CSPRNG to make the RNG auditable for regulated gaming. Example: const arr = new Uint32Array(1); crypto.getRandomValues(arr); const roll = (arr[0] / 0xFFFFFFFF) * totalWeight; [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to capture a stack trace and support `instanceof Error` checks. [L115]
- [ ] <!-- ACT-83e35f-3 --> **[correction · low · trivial]** `src/reels.ts`: Add a bounds guard in getReelWeights: throw or return a typed sentinel when reelIndex is out of range instead of silently returning undefined. [L57]
