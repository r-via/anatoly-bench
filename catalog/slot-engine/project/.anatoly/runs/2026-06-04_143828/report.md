<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 1
- **Files with findings:** 12
- **Unresolved doc conflicts:** 3 (run `anatoly docs arbitrate`)

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 3 | 1 | 0 | 4 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 1 | 2 | 0 | 3 |
| Test coverage gaps | 6 | 2 | 21 | 29 |
| Best practices | 4 | 3 | 0 | 7 |
| Documentation gaps | 3 | 1 | 12 | 16 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/27 symbols)
  At least partial: 11% (3/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 4 pages to create

### Divergences code ↔ reference

- **[tests · warn]** `computePayout` in `src/engine.ts`:101
  - Reference (`src/engine.ts JSDoc comment (L98-L100)`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: HOUSE_EDGE is 0.05 and multiplies total by (1 + 0.05) = 1.05, increasing payout above raw line wins rather than reducing it — this inflates RTP above 100% on winning spins, not to 95%.
- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:57
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#reel-weights`): _"Weights are read-only at runtime — there is no setter. To adjust symbol frequency, fork src/reels.ts and modify DEFAULT_WEIGHTS."_
  - Observed: `getReelWeights` returns `REEL_WEIGHTS[reelIndex]` — a direct reference to the internal mutable array. Callers can call `.push()`, `.splice()`, or index-assign to silently mutate the module's internal weight table, contradicting the documented read-only contract.
- **[overengineering · warn]** `ConservativeStrategy` in `src/strategy.ts`:13
  - Reference (`README.md`): _"The engine targets a theoretical Return-to-Player of 95%. Long-run player return approximates the bet-weighted house edge of 5%."_
  - Observed: ConservativeStrategy multiplies totalPayout by 0.8, which would reduce effective RTP to ~76% (0.95 × 0.8) if applied — well below the documented 95% target.

### Unresolved doc conflicts (code ↔ reference) — run `anatoly docs arbitrate`

- `src/events.ts`::SpinEventEmitter vs `README.md` — detected 2026-05-12T20:08:21.308Z
  - Reference: Pure game logic — no UI, no persistence, no networking. … function spin(bet: Bet): SpinResult
  - Code: src/events.ts exports a `SpinEventEmitter` class (L3–L25) and a `SPIN_DONE` string constant (L27), indicating an event-driven interaction surface in the public API.
- `src/engine.ts`::spin vs `README.md` (lines 7–9) — detected 2026-05-15T19:40:00.951Z
  - Reference: import { spin } from "slot-engine";

const result = spin(10); // 10-coin bet
  - Code: The Installation guide's verification snippet calls spin with an object argument: spin({ bet: 1.0 }), and all other internal docs define Bet as a plain number with spin(bet: Bet) where Bet = number.
- `src/engine.ts`::computePayout vs `README.md` — detected 2026-05-19T12:03:14.347Z
  - Reference: Long-run player return approximates the bet-weighted house edge of 5%.
  - Code: The internal doc formula is `totalPayout = Σ(linePayout × wildMultiplier) × (1 + HOUSE_EDGE) + 0.01 × bet`, where multiplying by `(1 + 0.05)` increases payouts above the raw line sum, boosting player return rather than reducing it.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 7 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 4 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 4 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-06-04_143828` |
| Duration | 8.6 min |
| API cost | $3.46 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 154ms |
| estimate | 130ms |
| triage | 1ms |
| rag-index | 13.0s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 5.4s |
| review | 363.2s |
| refinement | 131.1s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.10 | 12 / 3252 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5338 |
| correction | 11 | 11.1m | $0.81 | 33 / 39839 |
| overengineering | 10 | 3.6m | $0.35 | 30 / 11332 |
| tests | 10 | 1.2m | $0.16 | 30 / 3487 |
| best_practices | 10 | 17.9m | $1.16 | 30 / 65218 |
| documentation | 10 | 2.3m | $0.25 | 30 / 7849 |

## Axis Summary

**Utility** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 35 | 83% |
| DEAD | 6 | 14% |
| LOW_VALUE | 1 | 2% |

**Duplication** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 38 | 90% |
| DUPLICATE | 4 | 10% |

**Correction** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| OK | 38 | 90% |
| NEEDS_FIX | 4 | 10% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 90% |
| ACCEPTABLE | 1 | 3% |
| OVER | 3 | 8% |

**Tests** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 3 | 9% |
| WEAK | 11 | 34% |
| NONE | 18 | 56% |

**Documentation** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 14 | 44% |
| PARTIAL | 2 | 6% |
| UNDOCUMENTED | 16 | 50% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.7/10 |
| Min / Max | 4.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Verified all three findings against source code. The spin function has genuine correctness bugs (inverted house-edge multiplier, bet leak, string throw, dead container resolves) — confirmed NEEDS_FIX with increased confidence. The pickFromWeighted and weightedPick findings were false positives on the correction axis: both functions implement weighted random selection correctly; the automated evaluator incorrectly classified their duplication as a correctness defect. Reclassified both to OK with confidence 92. The duplication itself is real and worth addressing on the duplication axis, but that axis was not escalated here.
- `src/rng.ts`: 1 symbol(s) — Verified all three findings against source code. The spin function has genuine correctness bugs (inverted house-edge multiplier, bet leak, string throw, dead container resolves) — confirmed NEEDS_FIX with increased confidence. The pickFromWeighted and weightedPick findings were false positives on the correction axis: both functions implement weighted random selection correctly; the automated evaluator incorrectly classified their duplication as a correctness defect. Reclassified both to OK with confidence 92. The duplication itself is real and worth addressing on the duplication axis, but that axis was not escalated here.

---

## Methodology

Each file is evaluated through 7 independent axis evaluators running in parallel.
Every symbol (function, class, variable, type) is analysed individually and receives a rating per axis along with a confidence score (0–100).
Findings with confidence < 30 are discarded; those with confidence < 60 are excluded from verdict computation.

| Axis | Model | Ratings | Description |
|------|-------|---------|-------------|
| Utility | haiku | USED / DEAD / LOW_VALUE | Is this symbol actually used in the codebase? |
| Duplication | haiku | UNIQUE / DUPLICATE | Is this symbol a copy of logic that exists elsewhere? |
| Correction | sonnet | OK / NEEDS_FIX / ERROR | Does this symbol contain bugs or correctness issues? |
| Overengineering | haiku | LEAN / OVER / ACCEPTABLE | Is the implementation unnecessarily complex? |
| Tests | haiku | GOOD / WEAK / NONE | Does this symbol have adequate test coverage? |
| Best Practices | sonnet | Score 0–10 | Does the file follow TypeScript best practices? |
| Documentation | haiku | DOCUMENTED / PARTIAL / UNDOCUMENTED | Are exported symbols properly documented with JSDoc? |

See each axis folder for detailed rating criteria and methodology.

### Severity Classification

- **High**: ERROR corrections, or NEEDS_FIX / DEAD / DUPLICATE with confidence >= 80%.
- **Medium**: NEEDS_FIX / DEAD / DUPLICATE with confidence < 80%, or OVER (any confidence).
- **Low**: LOW_VALUE utility or remaining minor findings.

### Verdict Rules

- **CLEAN**: No actionable findings with confidence >= 60%.
- **NEEDS_REFACTOR**: At least one confirmed finding (DEAD, DUPLICATE, OVER, or NEEDS_FIX) with confidence >= 60%.
- **CRITICAL**: At least one ERROR correction found.

### Inter-axis Coherence

After individual evaluation, coherence rules reconcile contradictions:

- If utility = DEAD, tests is forced to NONE (no point testing dead code).
- If utility = DEAD, documentation is forced to UNDOCUMENTED (no point documenting dead code).
- If correction = ERROR, overengineering is forced to ACCEPTABLE (complexity is secondary to correctness).

*Generated: 2026-06-04T12:47:03.813Z*
