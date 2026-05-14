<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** CRITICAL
- **Clean files:** 1
- **Files with findings:** 12

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 4 | 0 | 0 | 4 |
| Utility | 7 | 0 | 0 | 7 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 7 | 3 | 19 | 29 |
| Best practices | 6 | 4 | 0 | 10 |
| Documentation gaps | 4 | 1 | 10 | 15 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/27 symbols)
  At least partial: 11% (3/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 1 pages to create

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 7 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-06_210736` |
| Duration | 8.4 min |
| API cost | $4.70 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 159ms |
| estimate | 130ms |
| triage | 1ms |
| rag-index | 158.9s |
| review | 213.4s |
| refinement | 118.5s |
| internal-docs | 2ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 2.1m | $0.12 | 40 / 23076 |
| duplication | 11 | 1.6m | $0.09 | 40 / 14428 |
| correction | 11 | 8.3m | $1.15 | 33 / 36019 |
| overengineering | 10 | 3.3m | $0.47 | 30 / 10073 |
| tests | 10 | 1.1m | $0.17 | 30 / 2869 |
| best_practices | 10 | 16.4m | $1.92 | 30 / 67464 |
| documentation | 10 | 1.5m | $0.34 | 30 / 4897 |

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
| NEEDS_FIX | 3 | 7% |
| ERROR | 1 | 2% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 88% |
| ACCEPTABLE | 2 | 5% |
| OVER | 3 | 7% |

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
| Average score | 6.8/10 |
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Investigated all three findings against source code. The spinReel ERROR (missing bounds check) is confirmed as a real defect: REEL_WEIGHTS has 5 entries and no validation prevents out-of-bounds access on the exported function, though current callers always pass valid indices 0-4. The two duplication findings (pickFromWeighted vs weightedPick) are reclassified from NEEDS_FIX to OK on the correction axis because both implementations are algorithmically correct — duplication is a code quality issue, not a correctness bug. Additionally, weightedPick is effectively dead code: it's imported and container-registered in engine.ts but never invoked. Overall verdict is NEEDS_REFACTOR rather than CRITICAL because the ERROR-level defect requires an invalid reelIndex that no current caller produces.
- `src/rng.ts`: 1 symbol(s) — Investigated all three findings against source code. The spinReel ERROR (missing bounds check) is confirmed as a real defect: REEL_WEIGHTS has 5 entries and no validation prevents out-of-bounds access on the exported function, though current callers always pass valid indices 0-4. The two duplication findings (pickFromWeighted vs weightedPick) are reclassified from NEEDS_FIX to OK on the correction axis because both implementations are algorithmically correct — duplication is a code quality issue, not a correctness bug. Additionally, weightedPick is effectively dead code: it's imported and container-registered in engine.ts but never invoked. Overall verdict is NEEDS_REFACTOR rather than CRITICAL because the ERROR-level defect requires an invalid reelIndex that no current caller produces.

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

*Generated: 2026-05-06T19:16:01.455Z*
