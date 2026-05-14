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
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 87% | [details](#srclegacyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L24–L25 | 🟡 NEEDS_FIX | 60% | registry.get(key) returns undefined when key is absent; as T suppresses the type error, delivering undefined to callers that expect a real T. |
| `computePayout` | L105 | 🔴 ERROR | 95% | Wrong sign: total * (1 + HOUSE_EDGE) = total * 1.05 increases the payout by 5% instead of deducting it. Forward: wins * 1.05 → RTP > 100%. Backward: 95% target requires multiplier 0.95. Sanity: 0.95 forward → RTP = 95% ✓. Must be total * (1 - HOUSE_EDGE). |
| `computePayout` | L108 | 🔴 ERROR | 95% | total += bet * 0.01 executes unconditionally, including when total = 0 (losing spin). This adds a guaranteed 1%-of-bet return on every spin, pushing expected RTP further above 100%. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds payout up; slot-machine industry convention (and house-edge correctness) requires Math.floor so the house retains the fractional remainder. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | console.warn for bet > 100 is inconsistent with the hard throws used for bet < 1 and non-integer bets on L114–L116. Should throw to enforce the documented upper bound. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L9 | 🟡 NEEDS_FIX | 78% | `_rowCount` is discarded and never forwarded to `spinReel(i)`. The abstract interface establishes that callers pass `rowCount` to control grid height; if `spinReel` returns a fixed or random row count internally, the resulting `Symbol[][]` may have wrong dimensions for every call site that passes a non-default rowCount. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 60% | When `state.active && scatters >= 3` (retrigger during a free spin), `state.remaining += 10` is applied but `state.remaining--` is never called. Every other active-spin path (Branch 3, L20) decrements remaining for the spin being played. The retrigger spin is itself a free spin that should be consumed, making the net award +9 (add 10, consume 1). As written, the player receives 10 extra spins instead of 9 on every retrigger, inflating RTP above the documented 95% target. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so the house retains fractional remainders (casino payout convention). [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Throw an error when bet > 100 (matching the existing throw on L114–L116) to enforce the 1..100 range invariant. [L118]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Forward rowCount to spinReel (or slice/pad its result) so the returned reels always contain exactly rowCount symbols per reel, honoring the abstract contract. [L9]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (`state.active && scatters >= 3`), decrement `state.remaining` by 1 after adding 10 (i.e., `state.remaining += 9` or `state.remaining += 10; state.remaining--;`) to correctly consume the current free spin, consistent with Branch 3 behaviour and the 95% RTP target. [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to guarantee integer coin payouts and preserve the documented 5% house edge for all valid bet values (1..100). [L23]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a cryptographic PRNG (e.g., crypto.getRandomValues-based) or a certified RNG service to satisfy regulated-gaming auditability and statistical-independence requirements. [L7]
- [ ] <!-- ACT-e0699c-1 --> **[correction · medium · small]** `src/strategy.ts`: ConservativeStrategy.adjustPayout multiplies totalPayout by 0.8, reducing RTP to ~76%. If this strategy must preserve the 95% RTP contract, the multiplier must be removed or the base payouts must be pre-scaled so that post-multiplier RTP still approximates 95% (i.e. base payouts targeting ~118.75% before the 0.8 reduction). If ConservativeStrategy is intentionally a lower-RTP mode, the README invariant must be scoped to DefaultStrategy only. [L17]
- [ ] <!-- ACT-6c7a2e-1 --> **[correction · medium · small]** `src/wild.ts`: Remove the (1+wildCount) linear factor; the canonical wild-multiplier formula for this domain is basePayout * 2**wildCount, keeping each wild as a 2× multiplier without a stacked linear bonus. [L3]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) to deduct 5% from wins instead of adding 5%. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: Remove unconditional total += bet * 0.01; it adds a guaranteed per-spin return that inflates RTP above 100%. [L108]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[correction · low · trivial]** `src/engine.ts`: Add a key-existence guard in EngineContainer.resolve before the as T cast, or throw for unknown keys. [L25]
