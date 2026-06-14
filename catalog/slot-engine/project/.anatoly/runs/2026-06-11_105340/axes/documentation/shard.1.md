[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 91% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 95% | Public type alias with no JSDoc. Purpose (coin denomination? integer constraint?) is not obvious from the name alone, and the type accepts any number including floats despite spin() enforcing integer-only bets. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc describes purpose and RTP intent but omits @param docs for lineWins and bet (typed as any), @returns description, and the unconditional floor of bet*0.01 added regardless of wins. The house-edge application direction (multiplies up, not down) also contradicts the stated 95% RTP goal and is unexplained. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 92% | Primary exported function with no JSDoc. No documentation of the bet parameter constraints (integer, 1–100), return shape, thrown exception type (string literal rather than Error), or side effects (emitter, strategy adjustment). (deliberated: confirmed — Confirmed. computePayout (engine.ts:105) applies `total * (1 + HOUSE_EDGE)` which INCREASES payout by 5% — the opposite of house edge semantics. The JSDoc at L98-100 states 'target RTP of approximately 95%' but the math yields >100% RTP. Additionally, engine.ts:108 `total += bet * 0.01` guarantees non-zero payout on every spin, further inflating RTP. The container-resolved `rng` (L120) and `reelsModule` (L122) are never used — actual RNG flows through factory.buildReels → spinReel → pickFromWeighted, bypassing the container entirely. `bet: any` at L113 and `throw "invalid bet"` (string, not Error) at L115 are secondary defects. The computePayout math error is a genuine behavioral bug in a gambling engine.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 92% | Exported public API. No JSDoc describing the reelIndex range (0–4), return shape (3-element column), or behavior when reelIndex is out of bounds. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API. No JSDoc; does not document that the returned array is the ordered canonical list used for weight indexing. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 92% | Exported public API. No JSDoc describing the reelIndex range, return value semantics (parallel to getReelSymbols), or read-only nature of the array. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Missing @param descriptions for symbol and count, no @returns explaining the multiplier semantics, and no note that WILD/SCATTER always return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, usage pattern, and the contract of adjustPayout are undescribed. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or method. The pass-through behavior of adjustPayout is non-obvious without a comment explaining it is the identity/no-op strategy. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 85% | No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage, and method parameters/return values are entirely undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment explaining when this event is emitted or what payload, if any, accompanies it. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Purpose, contract, and intended extension points are not described. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or `buildReels` method. The `_rowCount` parameter being ignored is a non-obvious behavior that warrants documentation. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of grid traversal logic, parameter shape, and return value semantics (total scatter count across all reels). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-trivial state machine with three branches (activate, retrigger, decrement/deactivate) — none of the transitions, mutation side-effects, or parameter semantics are documented. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 91% | JSDoc describes purpose and algorithm but omits @param descriptions (no documentation of what `items` or `weights` expect, e.g. length parity requirement, non-negative weights), no @returns tag, and no @throws or edge-case notes (e.g. empty array behavior). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. weightedPick (rng.ts:5-16) is algorithmically correct: same cumulative-weight sampling pattern, generic type parameter, proper fallback at L15. The NEEDS_FIX was based on duplication with pickFromWeighted — not a correctness defect. The function is imported in engine.ts:2 and registered in the container at L30, but never invoked during spin execution (the actual path goes through factories.ts → reels.ts:pickFromWeighted). Being unused in the runtime path is a dead-registration issue in spin's architecture, not a bug in weightedPick itself. The function would work correctly if called.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The function name hints at purpose but non-obvious semantics are undocumented: the >= 4 DIAMOND threshold, that counting is grid-wide (not payline-restricted), and that the parameter represents a 2-D reel/column layout. |

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

### `src/engine.ts` — 35% covered

- [ ] **computePayout / house edge** — MISSING: README never mentions computePayout, HOUSE_EDGE, the 5% markup, or the unconditional bet*0.01 floor.
- [ ] **PAYLINES structure** — PARTIAL → `README.md`: README says 'ten left-to-right paylines' but does not document the row-index coordinate system, the 10 specific patterns, or the lineBet = bet/10 split.
- [ ] **wild multiplier formula** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but the exponential formula (1+wc)*2^wc is undocumented.
- [ ] **Bet type constraints** — MISSING: README shows spin(10) but never documents valid bet range (integer 1–100) or the thrown string exception for invalid input.
