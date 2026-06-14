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
| Correction errors | 5 | 0 | 0 | 5 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 2 | 0 | 2 |
| Test coverage gaps | 6 | 2 | 21 | 29 |
| Best practices | 4 | 4 | 0 | 8 |
| Documentation gaps | 3 | 1 | 11 | 15 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/26 symbols)
  At least partial: 12% (3/26 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 3 pages to create

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 2 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 10 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 5 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-18_154156` |
| Duration | 11.6 min |
| API cost | $6.09 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 128ms |
| estimate | 114ms |
| triage | 2ms |
| rag-index | 5.8s |
| internal-docs | 3ms |
| doc-conflict-update | 128.2s |
| review | 425.3s |
| refinement | 135.7s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.4m | $0.10 | 40 / 13167 |
| duplication | 10 | 1.6m | $0.11 | 40 / 13609 |
| correction | 10 | 15.8m | $1.84 | 30 / 59268 |
| overengineering | 10 | 3.4m | $0.58 | 30 / 9968 |
| tests | 10 | 1.4m | $0.28 | 30 / 3370 |
| best_practices | 10 | 19.8m | $2.32 | 30 / 79064 |
| documentation | 10 | 2.1m | $0.39 | 30 / 6547 |

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
| LEAN | 35 | 85% |
| ACCEPTABLE | 4 | 10% |
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
| Average score | 7.2/10 |
| Min / Max | 3.5 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — The core issue across these findings is a broken injectable-RNG architecture. weightedPick (rng.ts) was designed as the swappable RNG and is registered in the EngineContainer, but spinReel (reels.ts) uses a private duplicate pickFromWeighted instead, making the container registration dead code. This is a genuine refactoring need, not a critical defect — the slot engine produces correct random results, just through the wrong code path. DEFAULT_WEIGHTS was reclassified from NEEDS_FIX to OK because the weight values are correct and documented; the mutability concern is best_practices, not a correctness bug. getReelWeights has a real but low-blast-radius bounds-check defect.

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

*Generated: 2026-05-18T13:53:33.598Z*
