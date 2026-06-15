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
| Correction errors | 2 | 3 | 0 | 5 |
| Utility | 5 | 1 | 0 | 6 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 4 | 6 | 19 | 29 |
| Best practices | 6 | 4 | 0 | 10 |
| Documentation gaps | 2 | 4 | 9 | 15 |

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
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 10 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 6 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-18_143526` |
| Duration | 13.5 min |
| API cost | $6.32 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 131ms |
| estimate | 112ms |
| triage | 1ms |
| rag-index | 6.0s |
| internal-docs | 4ms |
| doc-conflict-update | 127.7s |
| review | 509.3s |
| refinement | 166.2s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 0.7m | $0.07 | 40 / 5912 |
| duplication | 10 | 2.3m | $0.12 | 40 / 20504 |
| correction | 10 | 13.9m | $1.62 | 30 / 50575 |
| overengineering | 10 | 4.2m | $0.65 | 30 / 12705 |
| tests | 10 | 1.1m | $0.28 | 30 / 3406 |
| best_practices | 10 | 21.2m | $2.67 | 30 / 93093 |
| documentation | 10 | 2.2m | $0.42 | 30 / 7509 |

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
| Min / Max | 2.5 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/rng.ts`: 1 symbol(s) — spinReel has a genuine missing-bounds-check defect on its public API, confirmed at reels.ts:44. Rated NEEDS_FIX with modest confidence because the sole caller always provides valid indices. weightedPick is reclassified to OK on the correction axis: the function is algorithmically correct; the automated finding conflated duplication (with pickFromWeighted in reels.ts) with a correctness defect. The broader architectural issue — weightedPick registered in EngineContainer but never invoked at runtime (engine.ts:120 resolves it, never calls it) — is a design smell, not a bug in weightedPick itself.

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

*Generated: 2026-05-18T12:48:58.690Z*
