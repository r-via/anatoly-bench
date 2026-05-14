<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 15
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 4
- **Files with findings:** 11

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 3 | 0 | 0 | 3 |
| Utility | 7 | 0 | 0 | 7 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Best practices | 5 | 4 | 0 | 9 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 1 pages to create

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Documentation | 5 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 6 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 13% |
| Evaluate | 13 | 87% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-04-28_133253` |
| Duration | 10.1 min |
| API cost | $6.13 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 74ms |
| estimate | 174ms |
| triage | 1ms |
| rag-index | 14.7s |
| review | 301.2s |
| refinement | 140.4s |
| internal-docs | 2ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.7m | $0.09 | 40 / 6775 |
| duplication | 13 | 1.3m | $0.11 | 40 / 11025 |
| correction | 13 | 8.7m | $1.69 | 35 / 34065 |
| overengineering | 12 | 4.4m | $1.12 | 36 / 14115 |
| best_practices | 12 | 20.1m | $2.72 | 36 / 75539 |

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
| OK | 39 | 93% |
| NEEDS_FIX | 3 | 7% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 37 | 90% |
| ACCEPTABLE | 1 | 2% |
| OVER | 3 | 7% |

**Best Practices** — 12 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.4/10 |
| Min / Max | 3.5 / 10.0 |

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

*Generated: 2026-04-28T11:42:59.348Z*
