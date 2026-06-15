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
| Correction errors | 2 | 3 | 0 | 5 |
| Utility | 5 | 2 | 0 | 7 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 4 | 0 | 4 |
| Test coverage gaps | 4 | 6 | 19 | 29 |
| Best practices | 6 | 5 | 0 | 11 |
| Documentation gaps | 2 | 3 | 10 | 15 |

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
| Correction | 7 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 5 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
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
| Run ID | `2026-05-12_221633` |
| Duration | 9.6 min |
| API cost | $4.88 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 170ms |
| estimate | 123ms |
| triage | 1ms |
| rag-index | 5.9s |
| internal-docs | 2ms |
| doc-conflict-detection | 75.3s |
| review | 364.6s |
| refinement | 127.6s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.04 | 40 / 6471 |
| duplication | 11 | 1.4m | $0.07 | 40 / 11964 |
| correction | 11 | 12.4m | $1.46 | 31 / 49320 |
| overengineering | 10 | 3.3m | $0.49 | 30 / 11542 |
| tests | 10 | 1.1m | $0.18 | 30 / 3401 |
| best_practices | 10 | 20.7m | $2.18 | 30 / 78520 |
| documentation | 10 | 1.1m | $0.19 | 30 / 3639 |

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
| OK | 37 | 88% |
| NEEDS_FIX | 4 | 10% |
| ERROR | 1 | 2% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 35 | 88% |
| ACCEPTABLE | 1 | 3% |
| OVER | 4 | 10% |

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
| Average score | 6.7/10 |
| Min / Max | 2.5 / 9.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 2 |

**Verdict changes:**

- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/rng.ts`: 1 symbol(s) — computePayout is the critical finding: an inverted house-edge formula (multiplying by 1.05 instead of 0.95) combined with an unconditional 1% bet return pushes RTP above 100%, directly violating the documented 95% target. This is a financial correctness bug in a gambling engine. handleFreeSpins has a real but low-impact inconsistency — the retrigger branch doesn't consume the current spin — but the branch is unreachable in the current integration (engine.ts always creates a fresh state with active:false), so runtime impact is zero. weightedPick duplication with pickFromWeighted is confirmed but misclassified as a correction issue; the function itself is correct. Overall verdict is CRITICAL due to the computePayout defects.

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

*Generated: 2026-05-12T20:26:08.212Z*
