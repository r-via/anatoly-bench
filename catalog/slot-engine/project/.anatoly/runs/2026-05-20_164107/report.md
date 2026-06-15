<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 1
- **Files with findings:** 12

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 4 | 0 | 0 | 4 |
| Utility | 7 | 0 | 0 | 7 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 4 | 0 | 4 |
| Test coverage gaps | 6 | 5 | 18 | 29 |
| Best practices | 5 | 4 | 0 | 9 |
| Documentation gaps | 4 | 2 | 9 | 15 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/27 symbols)
  At least partial: 11% (3/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 2 pages to create

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
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 5 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 5 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-20_164107` |
| Duration | 8.9 min |
| API cost | $3.57 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 134ms |
| estimate | 129ms |
| triage | 1ms |
| rag-index | 11.6s |
| internal-docs | 3ms |
| rag-index-update | 4ms |
| doc-conflict-update | 4.5s |
| review | 388.0s |
| refinement | 129.1s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.5m | $0.07 | 40 / 5147 |
| duplication | 11 | 1.4m | $0.11 | 40 / 12668 |
| correction | 11 | 10.6m | $0.83 | 33 / 39112 |
| overengineering | 10 | 2.9m | $0.33 | 30 / 8184 |
| tests | 10 | 1.1m | $0.17 | 30 / 2880 |
| best_practices | 10 | 19.1m | $1.27 | 30 / 70463 |
| documentation | 10 | 2.3m | $0.26 | 30 / 7701 |

## Axis Summary

**Utility** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 35 | 83% |
| DEAD | 7 | 17% |

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
| LEAN | 34 | 85% |
| ACCEPTABLE | 2 | 5% |
| OVER | 4 | 10% |

**Tests** — 31 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 2 | 6% |
| WEAK | 11 | 35% |
| NONE | 18 | 58% |

**Documentation** — 31 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 14 | 45% |
| PARTIAL | 2 | 6% |
| UNDOCUMENTED | 15 | 48% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.4/10 |
| Min / Max | 3.5 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Both findings flag functionally identical weighted-selection algorithms under the correction axis as NEEDS_FIX. Investigation confirms the duplication is real (reels.ts:30-41 vs rng.ts:5-16 — same math, same control flow, same edge-case handling). However, neither function contains a bug. Both produce correct results. The NEEDS_FIX classification conflates duplication (a refactoring concern) with correction (a defect concern). Additionally, weightedPick in rng.ts is imported and registered in the engine container but the resolved value is never actually invoked at runtime — the real work goes through pickFromWeighted via the spinReel → buildReels call chain. This is an unused-code issue, not a correctness issue. Verdict: NEEDS_REFACTOR for the module overall (the duplication and dead registration should be cleaned up), but neither symbol has a correction defect.
- `src/rng.ts`: 1 symbol(s) — Both findings flag functionally identical weighted-selection algorithms under the correction axis as NEEDS_FIX. Investigation confirms the duplication is real (reels.ts:30-41 vs rng.ts:5-16 — same math, same control flow, same edge-case handling). However, neither function contains a bug. Both produce correct results. The NEEDS_FIX classification conflates duplication (a refactoring concern) with correction (a defect concern). Additionally, weightedPick in rng.ts is imported and registered in the engine container but the resolved value is never actually invoked at runtime — the real work goes through pickFromWeighted via the spinReel → buildReels call chain. This is an unused-code issue, not a correctness issue. Verdict: NEEDS_REFACTOR for the module overall (the duplication and dead registration should be cleaned up), but neither symbol has a correction defect.

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

*Generated: 2026-05-20T14:50:02.383Z*
