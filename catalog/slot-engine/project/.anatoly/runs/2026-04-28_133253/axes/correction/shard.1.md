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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcenginets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | total * (1 + HOUSE_EDGE) = total * 1.05 amplifies the payout by 5%, contradicting the JSDoc claim of 'target RTP of approximately 95%'. Forward derivation: multiply by 1.05 → implied RTP > 100% (house loses money). Backward derivation: target 95% RTP requires multiplying by (1 - 0.05) = 0.95. Sanity: forward(0.95 factor) → 95% ✓ formula consistent. Fix: replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE). |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 90% | Unconditional total += bet * 0.01 adds 1% of the bet to every payout with no basis in any internal reference document or JSDoc; it distorts the RTP on every spin, including losing spins. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Math.ceil(total) rounds the payout UP, giving the player the fractional remainder. Slot-machine industry convention (inferred from reel/payline/scatter/jackpot domain vocabulary) requires Math.floor so the house retains the remainder. |
| `spin` | L115 | 🟡 NEEDS_FIX | 88% | throw "invalid bet" produces a string, not an Error instance. No stack trace is captured and any catch block relying on instanceof Error or e.message will silently mishandle the exception. Should be: throw new Error("invalid bet"). |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 90% | Inferred slot-machine domain from JSDoc ('suitable for gaming RNG applications'), reel/payline/RTP vocabulary in .anatoly/docs/, and symbol tables (WILD, SCATTER, DIAMOND, SEVEN). V8's Math.random() is backed by xorshift128+, which is neither cryptographically secure nor independently certifiable. Regulated gaming RNG must be auditable and unpredictable (industry convention); a CSPRNG (e.g., crypto.getRandomValues()) is required. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove (or document and justify) the unconditional 'total += bet * 0.01' bonus in computePayout; it is absent from all project specifications and corrupts RTP on every spin. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil(total) with Math.floor(total) in computePayout so fractional coin remainders stay with the house per slot-machine industry convention. [L110]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: When `lineSymbols.find(s => s !== "WILD")` returns undefined (all-WILD line), substitute the highest-paying symbol (e.g. "DIAMOND") instead of falling back to "WILD" and returning 0. An all-WILD combination should award the maximum payout per industry convention for certified slot-machine logic. [L5]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a CSPRNG source (e.g., crypto.getRandomValues() scaled to [0, totalWeight)) so the RNG is certifiable for regulated gaming use, as required by industry convention for slot-machine applications. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace total * (1 + HOUSE_EDGE) with total * (1 - HOUSE_EDGE) in computePayout so the house edge reduces the payout to the documented 95% RTP target instead of boosting it above 100%. [L105]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace throw "invalid bet" with throw new Error("invalid bet") in spin to produce a proper Error with a stack trace and correct instanceof behaviour. [L115]
