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
| Correction errors | 3 | 1 | 0 | 4 |
| Utility | 5 | 1 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 1 | 2 | 0 | 3 |
| Best practices | 5 | 1 | 0 | 6 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[correction · warn]** `computePayout` in `src/engine.ts`:107
  - Reference (`src/engine.ts JSDoc comment above computePayout`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: Multiplies total by (1 + HOUSE_EDGE) = 1.05, increasing payout by 5% and producing an RTP above the base rate rather than ≈ 95%.
- **[overengineering · warn]** `computePayout` in `src/engine.ts`:101
  - Reference (`src/engine.ts inline comment (lines 97–100)`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: total * (1 + HOUSE_EDGE) = total * 1.05 increases winning payouts by 5%; a house edge reducing RTP to 95% requires multiplying by (1 - HOUSE_EDGE) = 0.95.
- **[best_practices · warn]** `spin` in `src/engine.ts`:101
  - Reference (`README.md#api`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: spin() throws for bet < 1 and non-integers, but only console.warns for bet > 100 — the upper bound of 100 is not enforced, so callers can pass any large integer without error.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
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
| Run ID | `2026-10-25_121825` |
| Duration | 5.0 min |
| API cost | $4.11 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 146ms |
| estimate | 107ms |
| triage | 1ms |
| rag-index | 10.6s |
| flows | 14ms |
| flow-doc | 0ms |
| review | 138.7s |
| refinement | 150.5s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.6m | $0.12 | 6 / 3161 |
| duplication | 11 | 0.9m | $0.21 | 12 / 4812 |
| correction | 11 | 8.1m | $1.03 | 33 / 36122 |
| overengineering | 10 | 2.6m | $0.47 | 30 / 9888 |
| best_practices | 10 | 12.2m | $1.20 | 30 / 55310 |

## Axis Summary

**Utility** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 35 | 83% |
| DEAD | 6 | 14% |
| LOW_VALUE | 1 | 2% |

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

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 90% |
| ACCEPTABLE | 1 | 3% |
| OVER | 3 | 8% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 6.9/10 |
| Min / Max | 2.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 5 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 5 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/factories.ts`: NEEDS_REFACTOR → CRITICAL
- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
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

*Generated: 2026-10-25T11:23:27.020Z*
