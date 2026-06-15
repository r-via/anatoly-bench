<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 12
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 7
- **Files with findings:** 5

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 4 | 1 | 0 | 5 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/39 symbols)
  At least partial: 0% (0/39 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[correction · warn]** `canEnterBlock` in `src/signals.ts`:14
  - Reference (`README.md#timing`): _"The minimum headway between two trains entering the same block is **3 ticks**."_
  - Observed: canEnterBlock returns true when elapsed >= MIN_HEADWAY - 1 (i.e., >= 2), allowing re-entry after only 2 ticks instead of the required 3.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 5 | 1 | [axes/correction/index.md](./axes/correction/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.2 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-06-15_071706` |
| Duration | 3.4 min |
| API cost | $1.24 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 174ms |
| estimate | 120ms |
| triage | 1ms |
| rag-index | 83.9s |
| review | 115.4s |
| refinement | 21ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| correction | 10 | 7.0m | $0.95 | 30 / 26106 |

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
| OK | 40 | 89% |
| NEEDS_FIX | 5 | 11% |

**Overengineering** — 6 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 6 | 100% |

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

*Generated: 2026-06-15T05:20:28.636Z*
