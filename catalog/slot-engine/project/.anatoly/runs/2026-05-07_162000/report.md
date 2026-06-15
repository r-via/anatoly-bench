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
| Correction errors | 4 | 1 | 0 | 5 |
| Utility | 6 | 1 | 0 | 7 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 1 | 1 | 0 | 2 |
| Test coverage gaps | 7 | 2 | 20 | 29 |
| Best practices | 4 | 4 | 0 | 8 |
| Documentation gaps | 4 | 1 | 10 | 15 |

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
| Correction | 5 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 2 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 6 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-07_162000` |
| Duration | 6.4 min |
| API cost | $6.40 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 182ms |
| estimate | 137ms |
| triage | 1ms |
| rag-index | 13.1s |
| review | 214.6s |
| refinement | 156.0s |
| internal-docs | 4ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.09 | 40 / 6481 |
| duplication | 11 | 1.2m | $0.11 | 40 / 11300 |
| correction | 11 | 8.7m | $1.44 | 33 / 34604 |
| overengineering | 10 | 3.0m | $0.87 | 30 / 9735 |
| tests | 10 | 1.2m | $0.46 | 30 / 3221 |
| best_practices | 10 | 17.3m | $2.20 | 30 / 71942 |
| documentation | 10 | 1.8m | $0.67 | 30 / 5355 |

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
| Average score | 7.5/10 |
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 2 |

**Verdict changes:**

- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — The critical finding is computePayout's reversed house edge (engine.ts:105). The code multiplies winnings by 1.05 instead of 0.95, confirmed by docstring intent (engine.ts:99), ANCIENT_RTP=0.95 (paytable.ts:3), and raw paytable multipliers (paytable.ts:5-12). This is a financial logic bug. The two duplication-based NEEDS_FIX findings on pickFromWeighted and weightedPick were reclassified to OK on the correction axis — both functions are correct; duplication is a separate concern. getReelWeights retains NEEDS_FIX for its type-unsafe undefined return on out-of-bounds input, but confidence was lowered significantly since no current caller triggers the condition.
- `src/rng.ts`: 1 symbol(s) — The critical finding is computePayout's reversed house edge (engine.ts:105). The code multiplies winnings by 1.05 instead of 0.95, confirmed by docstring intent (engine.ts:99), ANCIENT_RTP=0.95 (paytable.ts:3), and raw paytable multipliers (paytable.ts:5-12). This is a financial logic bug. The two duplication-based NEEDS_FIX findings on pickFromWeighted and weightedPick were reclassified to OK on the correction axis — both functions are correct; duplication is a separate concern. getReelWeights retains NEEDS_FIX for its type-unsafe undefined return on out-of-bounds input, but confidence was lowered significantly since no current caller triggers the condition.

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

*Generated: 2026-05-07T14:26:26.896Z*
