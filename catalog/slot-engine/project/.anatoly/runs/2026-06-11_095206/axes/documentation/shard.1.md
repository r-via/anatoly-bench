[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Exported public type with no description of valid range or usage semantics. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 85% | JSDoc describes purpose and house-edge intent, but omits @param for both lineWins and bet, omits @returns, and does not explain the unconditional bet*0.01 floor or the Math.ceil rounding behavior. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 92% | No JSDoc on the primary exported function. Bet validation rules, thrown string error, emitter side-effect, and SpinResult structure are all undocumented. (deliberated: confirmed — Confirmed multiple correctness defects. (1) Inverted house edge at engine.ts:105: `total * (1 + HOUSE_EDGE)` multiplies payout by 1.05 instead of 0.95, contradicting the JSDoc at engine.ts:98-99 which states '95% RTP'. This gives the house a negative edge — the casino loses money. Should be `(1 - HOUSE_EDGE)`. (2) engine.ts:115: `throw "invalid bet"` throws a string, not an Error — callers using `instanceof Error` will miss it, no stack trace captured. This is a public API re-exported at src/index.ts:1. (3) engine.ts:108: `total += bet * 0.01` adds a guaranteed 1% minimum payout on every spin regardless of outcome, which inflates RTP further. (4) engine.ts:101: `bet: any` when `Bet = number` is defined at line 12. (5) engine.ts:120-122: `rng` and `reelsModule` resolved from container but never used — reels are built via factory.buildReels → spinReel → pickFromWeighted (reels.ts), bypassing the container entirely. The inverted house edge alone is a severe financial logic bug. Increasing confidence from 55 to 92.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 90% | Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that it returns 3 symbols (one column), and that each cell is sampled independently. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API. No JSDoc. No description of return value ordering or whether the array is a copy or a live reference. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array maps 1-to-1 with getReelSymbols(), and whether mutations to the result affect internal state. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Missing: description of `count` valid range (3–5), that WILD/SCATTER return 0, and that the return is a dimensionless multiplier applied to lineBet. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, intended use, and the contract of `adjustPayout` are not described. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc. It is not clear that this is a passthrough/identity strategy — the name alone does not convey that payouts are returned unchanged. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 88% | No JSDoc on the class or any of its public methods (on, off, emit). Purpose, event model, and method parameters/return values are undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc explaining when this event is emitted or what payload (if any) it carries. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Purpose, contract, and intended extension pattern are not described. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 82% | No JSDoc on class or its buildReels method. Parameters reelCount/_rowCount, return value shape, and the ignored _rowCount are unexplained. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter semantics (grid dimensions, symbol type), and return value meaning. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of the three state-transition branches, mutation side-effect on `state`, and parameter semantics for `scatters` threshold. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 92% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns, and no mention of edge cases (empty arrays, mismatched lengths, zero/negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. rng.ts:5-16 implements standard cumulative-weight sampling correctly. The evaluator conflated duplication with a correctness defect. Additionally, while weightedPick is imported at engine.ts:2 and registered in the container at engine.ts:30, the resolved variable `rng` at engine.ts:120 is never called — reel generation flows through StandardReelBuilderFactory.buildReels (factories.ts:9-15) → spinReel (reels.ts:43) → pickFromWeighted (reels.ts:30). This makes weightedPick effectively unused via the container path, but that is a utility/dead-code concern, not a correctness bug in the function itself.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The function name hints at purpose but non-obvious details are undocumented: the DIAMOND-counting mechanic, the hardcoded threshold of 4, and that detection spans the full grid (not restricted to paylines). |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
- [ ] <!-- ACT-83e35f-3 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 33% covered

- [ ] **computePayout** — MISSING: Exported function not mentioned anywhere in README.md or any other docs/ page.
- [ ] **Bet** — MISSING: Exported type alias not mentioned in any docs/ page; valid range and constraints are undocumented for consumers.
