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
| Correction errors | 4 | 0 | 0 | 4 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 1 | 2 | 0 | 3 |
| Best practices | 5 | 5 | 0 | 10 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[overengineering · warn]** `computePayout` in `src/engine.ts`:106
  - Reference (`README.md`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: Code applies `total * (1 + HOUSE_EDGE)` — multiplying by 1.05 — which *increases* the payout by 5%, the opposite of a house edge. A 95% RTP house edge should reduce payout (e.g. `total * (1 - HOUSE_EDGE)`).
- **[correction · warn]** `computePayout` in `src/engine.ts`:93
  - Reference (`src/engine.ts JSDoc on computePayout (L86-L89)`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: `total = total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 multiplies the payout by 1.05, increasing it by 5% rather than reducing it. Applying a house edge should reduce payouts (multiply by 0.95), not increase them.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Best Practices | 5 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-10-25_132657` |
| Duration | 5.6 min |
| API cost | $3.30 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 198ms |
| estimate | 146ms |
| triage | 2ms |
| rag-index | 11.1s |
| flows | 64ms |
| flow-doc | 1ms |
| review | 147.2s |
| refinement | 172.9s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.07 | 6 / 3668 |
| duplication | 11 | 1.0m | $0.09 | 12 / 4864 |
| correction | 11 | 8.0m | $0.91 | 33 / 32920 |
| overengineering | 10 | 2.8m | $0.20 | 30 / 9812 |
| best_practices | 10 | 11.7m | $1.07 | 30 / 47184 |

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
| Average score | 8.2/10 |
| Min / Max | 5.0 / 10.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 6 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 6 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
- `src/paytable.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL
- `src/strategy.ts`: NEEDS_REFACTOR → CRITICAL

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

*Generated: 2026-10-25T12:32:31.415Z*
