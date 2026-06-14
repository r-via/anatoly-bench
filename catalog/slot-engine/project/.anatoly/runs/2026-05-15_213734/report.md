<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 12
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 1
- **Files with findings:** 11

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 3 | 0 | 0 | 3 |
| Utility | 5 | 1 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 6 | 3 | 20 | 29 |
| Best practices | 4 | 2 | 0 | 6 |
| Documentation gaps | 2 | 1 | 11 | 14 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 8% (2/26 symbols)
  At least partial: 12% (3/26 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 4 pages to create

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 5 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 9 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 3 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-15_213734` |
| Duration | 12.0 min |
| API cost | $6.34 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 147ms |
| estimate | 109ms |
| triage | 1ms |
| rag-index | 49.4s |
| internal-docs | 3ms |
| doc-conflict-update | 96.3s |
| review | 414.8s |
| refinement | 156.3s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.2m | $0.08 | 40 / 13127 |
| duplication | 10 | 2.1m | $0.11 | 40 / 17866 |
| correction | 10 | 13.9m | $1.73 | 30 / 55136 |
| overengineering | 10 | 3.8m | $0.61 | 30 / 11032 |
| tests | 10 | 1.3m | $0.28 | 30 / 3510 |
| best_practices | 10 | 21.2m | $2.38 | 30 / 81458 |
| documentation | 10 | 2.1m | $0.39 | 30 / 6534 |

## Axis Summary

**Utility** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 35 | 85% |
| DEAD | 6 | 15% |

**Duplication** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 37 | 90% |
| DUPLICATE | 4 | 10% |

**Correction** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| OK | 38 | 93% |
| NEEDS_FIX | 3 | 7% |

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
| DOCUMENTED | 15 | 48% |
| PARTIAL | 1 | 3% |
| UNDOCUMENTED | 15 | 48% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.0/10 |
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 4 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/freespin.ts`: 1 symbol(s) — All four correction-axis NEEDS_FIX claims are false positives. (1) handleFreeSpins: the 10-spin award matches documentation; the finding misidentifies L16 as the retrigger branch. (2) DEFAULT_WEIGHTS: values are intentional design constants matching docs; no target 'correct' values provided. (3-4) pickFromWeighted/weightedPick: both are algorithmically correct weighted-random implementations. The real issues — duplication between the two functions, and weightedPick being effectively dead code (imported but never called at runtime) — are valid concerns but belong on the duplication and utility axes, not the correction axis. No behavioral defect or data corruption risk was found.
- `src/reels.ts`: 2 symbol(s) — All four correction-axis NEEDS_FIX claims are false positives. (1) handleFreeSpins: the 10-spin award matches documentation; the finding misidentifies L16 as the retrigger branch. (2) DEFAULT_WEIGHTS: values are intentional design constants matching docs; no target 'correct' values provided. (3-4) pickFromWeighted/weightedPick: both are algorithmically correct weighted-random implementations. The real issues — duplication between the two functions, and weightedPick being effectively dead code (imported but never called at runtime) — are valid concerns but belong on the duplication and utility axes, not the correction axis. No behavioral defect or data corruption risk was found.
- `src/rng.ts`: 1 symbol(s) — All four correction-axis NEEDS_FIX claims are false positives. (1) handleFreeSpins: the 10-spin award matches documentation; the finding misidentifies L16 as the retrigger branch. (2) DEFAULT_WEIGHTS: values are intentional design constants matching docs; no target 'correct' values provided. (3-4) pickFromWeighted/weightedPick: both are algorithmically correct weighted-random implementations. The real issues — duplication between the two functions, and weightedPick being effectively dead code (imported but never called at runtime) — are valid concerns but belong on the duplication and utility axes, not the correction axis. No behavioral defect or data corruption risk was found.

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

*Generated: 2026-05-15T19:49:32.120Z*
