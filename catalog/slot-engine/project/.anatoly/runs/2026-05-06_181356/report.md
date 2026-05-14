<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 1
- **Files with findings:** 12
- **Degraded reviews (axis crashes):** 1

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 2 | 2 | 0 | 4 |
| Utility | 5 | 2 | 0 | 7 |
| Duplicates | 2 | 2 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 3 | 6 | 20 | 29 |
| Best practices | 5 | 3 | 0 | 8 |
| Documentation gaps | 3 | 2 | 10 | 15 |

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
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 5 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Degraded Reviews

> One or more axis evaluators crashed for these files. Verdicts may be unreliable — re-run recommended.

- `src/freespin.ts`

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 10 | 77% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-06_postrefactor` |
| Duration | 6.3 min |
| API cost | $4.78 |
| Degraded reviews | 1 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 132ms |
| estimate | 138ms |
| triage | 1ms |
| rag-index | 58.1s |
| review | 317.0s |
| refinement | 19ms |
| internal-docs | 2ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.0m | $0.07 | 40 / 10517 |
| duplication | 10 | 1.5m | $0.09 | 50 / 12357 |
| correction | 10 | 10.1m | $1.48 | 28 / 40901 |
| overengineering | 9 | 6.3m | $0.65 | 24 / 10929 |
| tests | 10 | 4.9m | $0.31 | 24 / 2394 |
| best_practices | 10 | 22.2m | $1.42 | 24 / 47348 |
| documentation | 10 | 5.3m | $0.48 | 27 / 7124 |

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

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 35 | 85% |
| ACCEPTABLE | 3 | 7% |
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
| Average score | 7.0/10 |
| Min / Max | 2.0 / 9.5 |

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

*Generated: 2026-05-06T16:20:11.617Z*
