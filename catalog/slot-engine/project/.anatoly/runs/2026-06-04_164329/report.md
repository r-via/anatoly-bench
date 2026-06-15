<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** CRITICAL
- **Clean files:** 1
- **Files with findings:** 12
- **Unresolved doc conflicts:** 3 (run `anatoly docs arbitrate`)

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 4 | 1 | 0 | 5 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 6 | 4 | 20 | 30 |
| Best practices | 5 | 2 | 0 | 7 |
| Documentation gaps | 2 | 2 | 12 | 16 |

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
  - Reference (`src/engine.ts JSDoc comment L98-L100`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: Code multiplies total by (1 + HOUSE_EDGE) = 1.05, increasing payout rather than reducing it. A 95% RTP implementation would multiply by (1 - HOUSE_EDGE) = 0.95. Additionally, `bet * 0.01` is unconditionally added regardless of wins.
- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:54
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#reel-weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: getReelWeights() returns the raw REEL_WEIGHTS[reelIndex] array reference. Callers can mutate elements directly (e.g. getReelWeights(0)[0] = 999), bypassing the documented read-only contract.
- **[best_practices · info]** `ConservativeStrategy` in `src/strategy.ts`:15
  - Reference (`README.md`): _"The engine targets a theoretical Return-to-Player of 95%. Long-run player return approximates the bet-weighted house edge of 5%."_
  - Observed: `ConservativeStrategy.adjustPayout` multiplies `totalPayout` by 0.8, reducing any base RTP (e.g. 95%) to approximately 76%. The README states 95% RTP as the engine target without qualifying that it only applies when `DefaultStrategy` is active.

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
| Correction | 5 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
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
| Run ID | `2026-06-04_164329` |
| Duration | 11.3 min |
| API cost | $3.18 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 199ms |
| estimate | 119ms |
| triage | 2ms |
| rag-index | 9.4s |
| internal-docs | 4ms |
| rag-index-update | 2ms |
| doc-conflict-update | 110.1s |
| review | 399.7s |
| refinement | 159.4s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.9m | $0.09 | 12 / 3470 |
| duplication | 11 | 1.2m | $0.09 | 12 / 5049 |
| correction | 11 | 15.5m | $0.89 | 33 / 55487 |
| overengineering | 10 | 3.5m | $0.22 | 30 / 10814 |
| tests | 10 | 1.1m | $0.13 | 30 / 3469 |
| best_practices | 10 | 18.5m | $1.05 | 30 / 66313 |
| documentation | 10 | 2.1m | $0.15 | 30 / 6925 |

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
| OK | 37 | 88% |
| NEEDS_FIX | 4 | 10% |
| ERROR | 1 | 2% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 35 | 88% |
| ACCEPTABLE | 2 | 5% |
| OVER | 3 | 8% |

**Tests** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 2 | 6% |
| WEAK | 11 | 34% |
| NONE | 19 | 59% |

**Documentation** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 14 | 44% |
| PARTIAL | 2 | 6% |
| UNDOCUMENTED | 16 | 50% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.3/10 |
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 1 |

**Verdict changes:**

- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — computePayout ERROR confirmed: three independent bugs (house-edge direction, unconditional floor, ceil rounding) all push RTP above 100%, contradicting the documented 95% target. DEFAULT_WEIGHTS NEEDS_FIX confirmed with higher confidence: DIAMOND weight 30 (p=0.25) produces 229.5% EV per line from a single symbol, making 95% RTP mathematically impossible regardless of other fixes. pickFromWeighted downgraded from NEEDS_FIX to OK: the function correctly implements weighted random selection; Math.random() is a security/regulatory concern (not a correctness bug), and the canonical RNG module (src/rng.ts) uses the same Math.random() anyway.

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

*Generated: 2026-06-04T14:54:49.360Z*
