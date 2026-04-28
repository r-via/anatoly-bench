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
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcrngts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 95% | House edge applied in wrong direction: `total * (1 + HOUSE_EDGE)` multiplies by 1.05, INCREASING player payout by 5%. The documented target is RTP ≈ 95% (a 5% deduction), requiring `total * (1 - HOUSE_EDGE)` = `total * 0.95`. Violates the RTP=95% target stated in the function's own JSDoc and in .anatoly/docs/02-Architecture/02-Core-Concepts.md. |
| `computePayout` | L108 | 🔴 ERROR | 95% | `total += bet * 0.01` executes unconditionally — including when total == 0 (losing spin) — silently awarding Math.ceil(bet * 0.01) coins on every loss. This undocumented phantom payout is present in no specification and distorts the RTP on every non-winning spin. |
| `computePayout` | L110 | 🔴 ERROR | 95% | `Math.ceil` rounds payouts UP, transferring fractional coin remainders to the player. Casino/slot-machine domain convention requires `Math.floor` so the house retains remainders and the target RTP is preserved (inferred slot-machine domain from reel/payline/jackpot/WILD/SCATTER vocabulary throughout the file). |
| `spin` | L115 | 🟡 NEEDS_FIX | 80% | `throw "invalid bet"` throws a primitive string, not an Error instance. Any catch handler checking `err instanceof Error` or reading `err.stack` / `err.message` will fail or behave incorrectly. |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 80% | `rng` (L120) and `reelsModule` (L122) are resolved from the DI container but are never passed to `factory.buildReels()` or used anywhere in the function. The factory builds reels with its own internal RNG, completely bypassing the injected and presumably certified `weightedPick`. In a regulated gaming context this means the certified RNG path is silently dead code. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 93% | Uses `Math.random()`, which is not a cryptographically secure or certifiable RNG. The Internal Reference Documentation (.anatoly/docs/03-Guides/02-Advanced-Configuration.md, .anatoly/docs/04-API-Reference/02-Configuration-Schema.md) unambiguously identifies this as a regulated slot-machine application with an RTP target of 95%. Industry convention for certified gaming software requires a certifiable PRNG (e.g., a seeded, auditable CSPRNG); `Math.random()` is explicitly excluded from certified gaming submissions. Inferred domain: slot machine / regulated gaming. |
| `weightedPick` | L13–L15 | 🟡 NEEDS_FIX | 93% | When `items` is empty, the for-loop never executes and the fallback `return items[items.length - 1]` evaluates to `items[-1]`, which is `undefined`. The function then returns `undefined` as type `T`, silently violating its own return-type contract. A guard (`if (items.length === 0) throw new Error(...)`) is needed. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L18–L19 | 🟡 NEEDS_FIX | 92% | Retrigger branch adds 10 to remaining but skips the decrement for the current spin. The normal active branch (L21) decrements remaining for each spin consumed. On a retrigger spin the current free spin is consumed but not counted, silently awarding one extra free spin compared to the documented 'add 10 more' retrigger rule. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or explicitly document `total += bet * 0.01`; as written it awards coins on every losing spin without any specification backing, corrupting RTP calculations. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil` with `Math.floor` so fractional coin remainders stay with the house, consistent with slot-machine domain convention and the stated RTP target. [L110]
- [ ] <!-- ACT-28c3e3-5 --> **[correction · medium · small]** `src/engine.ts`: Pass the resolved `rng` to `factory.buildReels()` (or remove the unused resolve calls for `rng` and `reelsModule`) so the configured certified RNG is not bypassed. [L120]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (state.active && scatters >= 3), decrement remaining by 1 after adding 10 to account for the current spin being consumed, consistent with the normal active branch. Change `state.remaining += 10` to `state.remaining += 10 - 1` (or `state.remaining += 9`) so the retrigger spin itself is counted. [L19]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Handle the all-WILD case explicitly before the WILD guard: resolve the line to the maximum-paying or designated top symbol instead of falling through to `first = "WILD"` and returning 0. [L5]
- [ ] <!-- ACT-f69593-2 --> **[correction · medium · small]** `src/legacy.ts`: Apply integer rounding (Math.floor or Math.ceil per house-edge convention) to the return value so that callers always receive an integer credit amount, consistent with the engine's documented rounding behaviour. [L22]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · medium · small]** `src/paytable.ts`: Add `wildCount: number` to the return type of `lineWins` and populate it inside the counting loop (increment a separate `wildCount` variable when `s === 'WILD'`). Callers need this value to apply the wild-bonus formula `(1 + wildCount) × 2^wildCount` to the base multiplier. [L23]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add a guard at the top of weightedPick that throws (or returns a typed error) when `items` is empty, preventing silent return of `undefined` typed as `T`. [L13]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Fix house edge direction in computePayout: change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so 5% is deducted from wins, maintaining the documented RTP ≈ 95%. [L105]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace `Math.random()` with a certifiable CSPRNG (e.g., crypto.getRandomValues or a seeded, auditable PRNG) to meet regulated gaming certification requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to produce a proper Error instance carrying a stack trace. [L115]
