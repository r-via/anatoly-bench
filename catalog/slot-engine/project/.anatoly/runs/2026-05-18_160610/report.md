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
| Correction errors | 3 | 2 | 0 | 5 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 2 | 0 | 2 |
| Test coverage gaps | 6 | 2 | 21 | 29 |
| Best practices | 4 | 3 | 0 | 7 |
| Documentation gaps | 4 | 1 | 10 | 15 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/26 symbols)
  At least partial: 12% (3/26 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 6 pages to create

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 5 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 2 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 10 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 4 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-18_160610` |
| Duration | 13.2 min |
| API cost | $4.85 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 123ms |
| estimate | 106ms |
| triage | 1ms |
| rag-index | 11.0s |
| internal-docs | 4ms |
| doc-conflict-update | 128.4s |
| review | 444.5s |
| refinement | 203.6s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.1m | $0.06 | 40 / 9633 |
| duplication | 10 | 1.0m | $0.05 | 40 / 7860 |
| correction | 10 | 17.2m | $1.82 | 30 / 68141 |
| overengineering | 10 | 3.8m | $0.39 | 30 / 11361 |
| tests | 10 | 1.2m | $0.18 | 30 / 3459 |
| best_practices | 10 | 16.8m | $1.63 | 30 / 60528 |
| documentation | 10 | 2.2m | $0.30 | 30 / 7997 |

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
| OK | 36 | 88% |
| NEEDS_FIX | 5 | 12% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 34 | 83% |
| ACCEPTABLE | 5 | 12% |
| OVER | 2 | 5% |

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
| Average score | 7.1/10 |
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 4 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/freespin.ts`: 1 symbol(s) — All four findings claimed NEEDS_FIX on the correction axis. Investigation found zero confirmed correctness defects. (1) handleFreeSpins retrigger behavior matches project documentation and the branch is unreachable in the current engine. (2) DEFAULT_WEIGHTS values are documented and mathematically correct. (3-4) pickFromWeighted and weightedPick are both algorithmically correct; the duplication between them is real but misclassified onto the correction axis rather than the duplication axis.
- `src/reels.ts`: 2 symbol(s) — All four findings claimed NEEDS_FIX on the correction axis. Investigation found zero confirmed correctness defects. (1) handleFreeSpins retrigger behavior matches project documentation and the branch is unreachable in the current engine. (2) DEFAULT_WEIGHTS values are documented and mathematically correct. (3-4) pickFromWeighted and weightedPick are both algorithmically correct; the duplication between them is real but misclassified onto the correction axis rather than the duplication axis.
- `src/rng.ts`: 1 symbol(s) — All four findings claimed NEEDS_FIX on the correction axis. Investigation found zero confirmed correctness defects. (1) handleFreeSpins retrigger behavior matches project documentation and the branch is unreachable in the current engine. (2) DEFAULT_WEIGHTS values are documented and mathematically correct. (3-4) pickFromWeighted and weightedPick are both algorithmically correct; the duplication between them is real but misclassified onto the correction axis rather than the duplication axis.

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

*Generated: 2026-05-18T14:19:20.113Z*
