<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 12
- **Global verdict:** CRITICAL
- **Clean files:** 2
- **Files with findings:** 10

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 3 | 1 | 0 | 4 |
| Documentation gaps | 3 | 1 | 26 | 30 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 8% (3/39 symbols)
  At least partial: 10% (4/39 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 9 pages to create, 1 pages outdated

### Divergences code ↔ reference

- **[correction · warn]** `canEnterBlock` in `src/signals.ts`:14
  - Reference (`README.md#Timing`): _"The minimum headway between two trains entering the same block is 3 ticks."_
  - Observed: Condition `elapsed >= MIN_HEADWAY - 1` (i.e., >= 2) permits block entry after only 2 ticks, not 3.
- **[correction · warn]** `DWELL_TICKS` in `src/timetable.ts`:3
  - Reference (`README.md#Timing`): _"A station dwell is **2 ticks**."_
  - Observed: DWELL_TICKS is set to 6, three times the documented value. This constant is consumed by runSchedule() in src/dispatcher.ts and will inflate all computed dwell periods and therefore scheduled-arrival comparisons.

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
| Run ID | `2026-06-15_112827` |
| Duration | 2.7 min |
| API cost | $0.99 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 172ms |
| estimate | 121ms |
| triage | 1ms |
| rag-index | 6.5s |
| review | 100.7s |
| invariants | 141ms |
| refinement | 50.9s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| correction | 10 | 6.9m | $0.52 | 30 / 25315 |
| documentation | 10 | 3.4m | $0.34 | 30 / 11457 |

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
| NEEDS_FIX | 2 | 4% |
| ERROR | 2 | 4% |

**Overengineering** — 8 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 6 | 75% |
| ACCEPTABLE | 2 | 25% |

**Documentation** — 39 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 9 | 23% |
| PARTIAL | 1 | 3% |
| UNDOCUMENTED | 29 | 74% |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 0 |

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

*Generated: 2026-06-15T09:31:07.550Z*
