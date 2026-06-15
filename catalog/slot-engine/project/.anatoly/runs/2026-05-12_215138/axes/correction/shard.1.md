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
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟢 CLEAN | 0 | 55% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L24–L25 | 🟡 NEEDS_FIX | 60% | Map.get() returns undefined for missing keys; the `as T` cast hides this, giving callers a runtime undefined where they expect T. |
| `computePayout` | L105 | 🔴 ERROR | 95% | total * (1 + HOUSE_EDGE) = total × 1.05 increases payout by 5% instead of deducting the house edge. Forward: any win W > 0 → payout > W → RTP > 100%. Backward: target RTP 95% → factor = 0.95 = (1 − HOUSE_EDGE). Sanity: forward(0.95) = 95% ✓. Fix: replace (1 + HOUSE_EDGE) with (1 − HOUSE_EDGE). |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds payout up; slot-machine domain requires Math.floor — house retains the fractional remainder per industry convention. |
| `spin` | L120–L128 | 🟡 NEEDS_FIX | 90% | rng (line 120) and reelsModule (line 122) are resolved from the container but ignored; factory.buildReels(5, 3) at line 128 builds reels independently, bypassing the registered weightedPick RNG. The controlled RNG is dead code in this spin path. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a string literal, not an Error. Callers checking `e instanceof Error` or reading `e.message` will fail; stack trace is lost. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L10–L13 | 🟡 NEEDS_FIX | 55% | `_rowCount` is never passed to `spinReel(i)`. The abstract contract accepts `rowCount` as a meaningful parameter, but the concrete implementation discards it, producing reels whose length is determined solely by spinReel's internal default rather than the requested row count. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 90% | Retrigger branch (`state.active && scatters >= 3`) only adds spins but never decrements `remaining` for the current spin. The spin that triggered the retrigger is consumed without being counted, inflating total spins awarded by 1. |
| `handleFreeSpins` | L20–L23 | 🟡 NEEDS_FIX | 90% | `remaining` is decremented to 0 and then `state.active` is set to false inside `if (state.remaining <= 0)`, but the guard is `else if (state.active)` — meaning a spin where `scatters >= 3` also skips the decrement entirely (handled by the retrigger branch). This is consistent with the retrigger defect above but compounds it: the final spin of a retrigger sequence is never consumed. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Change Math.ceil(total) to Math.floor(total) so the house retains the fractional remainder per slot-machine industry convention. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Pass the registered RNG to factory.buildReels, or use reelsModule with the registered weightedPick, so reel generation uses the controlled RNG rather than an independent path. [L128]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Pass `_rowCount` (rename to `rowCount`) to `spinReel` so each reel contains exactly the requested number of rows, e.g. `spinReel(i, rowCount)` — assuming spinReel supports a length argument. If spinReel does not support it, the slicing/padding must happen here. [L12]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (scatters >= 3 while active), also decrement `remaining` by 1 to account for the current spin being consumed before adding the 10 bonus spins. [L17]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return Math.floor(multiplier * bet / 10);` to avoid floating-point imprecision and ensure payouts are floor-rounded to whole credit units, consistent with regulated slot-machine accounting. [L21]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add a guard at function entry: throw if items is empty or if items.length !== weights.length, preventing undefined returns and silent distribution skew. [L6]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change total * (1 + HOUSE_EDGE) to total * (1 - HOUSE_EDGE) to actually deduct the house edge and approach the documented ~95% RTP target. [L105]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues()-based uniform draw to satisfy regulated gaming RNG certification requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack traces and enable proper instanceof checks in callers. [L115]
- [ ] <!-- ACT-28c3e3-5 --> **[correction · low · trivial]** `src/engine.ts`: Add a key-existence check in EngineContainer.resolve() and throw a descriptive error when the requested key is not registered, rather than returning undefined cast to T. [L24]
- [ ] <!-- ACT-89de92-2 --> **[correction · low · trivial]** `src/freespin.ts`: Ensure the deactivation check (`remaining <= 0`) is evaluated after all branches, including when scatters >= 3, so that an edge case where retrigger is awarded on the last possible spin still correctly terminates if remaining reaches 0 after the net adjustment. [L20]
