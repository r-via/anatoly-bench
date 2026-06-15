<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 12
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 2
- **Files with findings:** 10

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 3 | 1 | 0 | 4 |
| Documentation gaps | 3 | 1 | 27 | 31 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 8% (3/39 symbols)
  At least partial: 10% (4/39 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 10 pages to create, 1 pages outdated

### Divergences code ↔ reference

- **[correction · warn]** `DWELL_TICKS` in `src/timetable.ts`:3
  - Reference (`README.md#Timing`): _"A station dwell is **2 ticks**. These constants and the per-block traversal times are fixed in the timetable module."_
  - Observed: DWELL_TICKS = 6, which is 3× the documented dwell of 2 ticks. This inflates all station dwell time used by runSchedule, skewing simulation results and on-time KPIs.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Documentation | 10 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.2 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-06-15_083719` |
| Duration | 2.8 min |
| API cost | $0.83 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 165ms |
| estimate | 132ms |
| triage | 2ms |
| rag-index | 18.3s |
| review | 147.3s |
| refinement | 19ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| correction | 10 | 7.4m | $0.56 | 30 / 28227 |
| documentation | 10 | 3.0m | $0.27 | 30 / 11261 |

## Axis Summary

**Utility** — 6 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 6 | 100% |

**Duplication** — 6 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 6 | 100% |

**Correction** — 45 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| OK | 41 | 91% |
| NEEDS_FIX | 4 | 9% |

**Overengineering** — 6 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 6 | 100% |

**Documentation** — 39 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 8 | 21% |
| PARTIAL | 2 | 5% |
| UNDOCUMENTED | 29 | 74% |

---

## Methodology

Each file is evaluated through 7 independent axis evaluators running in parallel.
Every symbol (function, class, variable, type) is analysed individually and receives a rating per axis along with a confidence score (0–100).
Findings with confidence < 30 are discarded; those with confidence < 60 are excluded from verdict computation.

| Axis | Model | Ratings | Description |
|------|-------|---------|-------------|
| Utility | sonnet | USED / DEAD / LOW_VALUE | Is this symbol actually used in the codebase? |
| Duplication | sonnet | UNIQUE / DUPLICATE | Is this symbol a copy of logic that exists elsewhere? |
| Correction | sonnet | OK / NEEDS_FIX / ERROR | Does this symbol contain bugs or correctness issues? |
| Overengineering | sonnet | LEAN / OVER / ACCEPTABLE | Is the implementation unnecessarily complex? |
| Tests | sonnet | GOOD / WEAK / NONE | Does this symbol have adequate test coverage? |
| Best Practices | sonnet | Score 0–10 | Does the file follow TypeScript best practices? |
| Documentation | sonnet | DOCUMENTED / PARTIAL / UNDOCUMENTED | Are exported symbols properly documented with JSDoc? |

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

*Generated: 2026-06-15T06:40:06.444Z*
