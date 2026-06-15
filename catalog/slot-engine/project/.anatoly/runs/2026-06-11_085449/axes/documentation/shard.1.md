[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Exported type alias carries implicit semantics (valid range 1–100, integer-only) that are enforced in spin() but invisible at the type declaration. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | Has a JSDoc block describing purpose and house-edge intent, but missing @param descriptions for lineWins and bet (typed any), missing @returns, and does not document the unconditional bet*0.01 floor added to every payout. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 90% | No JSDoc at the function declaration. Primary exported public API; parameter constraints, thrown error form, and SpinResult fields are undocumented inline. (deliberated: confirmed — Both issues confirmed. (1) src/engine.ts:115 — `throw "invalid bet"` throws a string literal instead of an Error object, breaking stack traces and `instanceof Error` checks in callers. (2) src/engine.ts:118 — `if (bet > 100) console.warn("bet exceeds maximum")` warns but does not reject. The validation block at L114 enforces `bet >= 1` and `Number.isInteger(bet)` but has no upper bound, meaning arbitrarily large bets are processed. In a slot engine this is a genuine financial-risk defect.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 93% | Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 symbols (one per row), and that sampling is independent per cell. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. A one-line description of the return value and ordering would suffice. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), description of returned array order, and that weights are read-only at runtime. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | Exported public API with no JSDoc. Missing: description of what a 'multiplier' represents (base multiplier × lineBet), parameter semantics for count, return value of 0 for WILD/SCATTER or unknown symbols, and valid count range. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class has no JSDoc. Purpose, intended usage pattern, and extension contract are not documented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 88% | No JSDoc on class or method. While name implies pass-through behavior, the no-op contract of adjustPayout is not explicitly stated. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 90% | Class and all three public methods (on, off, emit) lack JSDoc. Missing: class purpose, parameter descriptions for event/handler, and emit's variadic args behavior. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment explaining when this event is emitted or who emits it. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract base class with non-obvious contract (what constitutes a valid reel, what reelCount/rowCount mean) warrants documentation. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. `_rowCount` is ignored silently — a noteworthy behavioral constraint that should be documented. Neither the class nor `buildReels` carry any doc comment. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of purpose, parameter meaning (reels layout), and return value semantics (scatter count across full grid). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. State mutation side-effects, retrigger logic (+10 on active + ≥3 scatters), and decrement-to-deactivation behavior are non-obvious and entirely undocumented. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Exported public function with non-obvious semantics: the DIAMOND threshold of 4, grid-wide counting (not payline-restricted), and the ReadonlyArray<ReadonlyArray<Symbol>> parameter shape all warrant documentation. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 85% | Block-level JSDoc describes purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array lengths). |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-6 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
- [ ] <!-- ACT-83e35f-4 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 38% covered

- [ ] **computePayout / house edge** — MISSING: Neither computePayout nor the 5% house-edge adjustment or bet*0.01 floor appears in any docs/ page.
- [ ] **Paylines** — PARTIAL → `README.md`: README mentions 'ten left-to-right paylines' but gives no detail on the row-index encoding, shape of each payline, or 3-of-5 win rule.
- [ ] **Wild multiplier bonus** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but the (1+wc)*2^wc stacking formula is not described.
