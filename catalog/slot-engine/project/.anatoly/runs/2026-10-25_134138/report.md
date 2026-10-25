<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 3
- **Files with findings:** 10

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 2 | 1 | 0 | 3 |
| Utility | 5 | 1 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 2 | 0 | 2 |
| Best practices | 5 | 2 | 0 | 7 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[correction · warn]** `spin` in `src/engine.ts`:118
  - Reference (`README.md#API`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: A bet above 100 only triggers console.warn('bet exceeds maximum') and the spin proceeds. The documented 1..100 range is not enforced; only bets below 1 or non-integers are rejected.
- **[best_practices · warn]** `spin` in `src/engine.ts`:118
  - Reference (`README.md#API`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: Bets above 100 only trigger console.warn and are still played. Only bets below 1 or non-integer bets are rejected.
- **[best_practices · info]** `spin` in `src/engine.ts`:113
  - Reference (`README.md#API`): _"function spin(bet: Bet): SpinResult;"_
  - Observed: The implementation declares `bet: any` instead of `Bet`.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 2 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Best Practices | 4 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-10-25_134138` |
| Duration | 2.6 min |
| API cost | $1.44 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 205ms |
| estimate | 179ms |
| triage | 1ms |
| rag-index | 53.0s |
| flows | 25ms |
| flow-doc | 1ms |
| review | 38.6s |
| refinement | 62.7s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.04 | 4 / 1283 |
| duplication | 11 | 0.4m | $0.10 | 8 / 2529 |
| correction | 11 | 1.6m | $0.35 | 22 / 10401 |
| overengineering | 10 | 0.7m | $0.22 | 20 / 3581 |
| best_practices | 10 | 2.5m | $0.42 | 20 / 23284 |

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
| OK | 39 | 93% |
| NEEDS_FIX | 3 | 7% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 32 | 78% |
| ACCEPTABLE | 7 | 17% |
| OVER | 2 | 5% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 6.7/10 |
| Min / Max | 2.5 / 8.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 3 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL

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

*Generated: 2026-10-25T12:44:15.329Z*
