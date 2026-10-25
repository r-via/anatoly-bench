<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 2
- **Files with findings:** 11

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 2 | 0 | 0 | 2 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 4 | 0 | 4 |
| Best practices | 7 | 5 | 0 | 12 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[best_practices · warn]** `spin` in `src/engine.ts`:96
  - Reference (`README.md#API`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: Bets above 100 are accepted and only trigger console.warn. The signature uses `bet: any` instead of `Bet`.
- **[best_practices · warn]** `weightedPick` in `src/rng.ts`:2
  - Reference (`src/rng.ts JSDoc`): _"Weighted random pick utility, suitable for gaming RNG applications."_
  - Observed: Uses Math.random(), which is not a certifiable gaming RNG.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 1 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 4 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Best Practices | 8 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-10-25_125611` |
| Duration | 2.4 min |
| API cost | $1.56 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 215ms |
| estimate | 208ms |
| triage | 2ms |
| rag-index | 49.2s |
| flows | 30ms |
| flow-doc | 1ms |
| review | 36.2s |
| refinement | 57.3s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.05 | 4 / 1319 |
| duplication | 11 | 0.3m | $0.12 | 8 / 2484 |
| correction | 11 | 1.4m | $0.36 | 22 / 9728 |
| overengineering | 10 | 0.6m | $0.24 | 20 / 3389 |
| best_practices | 10 | 2.2m | $0.43 | 20 / 21197 |

## Axis Summary

**Utility** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 36 | 86% |
| DEAD | 6 | 14% |

**Duplication** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 38 | 90% |
| DUPLICATE | 4 | 10% |

**Correction** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| OK | 40 | 95% |
| NEEDS_FIX | 2 | 5% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 32 | 78% |
| ACCEPTABLE | 5 | 12% |
| OVER | 4 | 10% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 6.3/10 |
| Min / Max | 0.0 / 8.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 4 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 4 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/legacy.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

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

*Generated: 2026-10-25T11:58:37.257Z*
