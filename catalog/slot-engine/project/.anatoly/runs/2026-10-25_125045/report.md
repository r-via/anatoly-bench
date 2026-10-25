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
| Utility | 5 | 1 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Best practices | 4 | 3 | 0 | 7 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[overengineering · warn]** `computePayout` in `src/engine.ts`:101
  - Reference (`src/engine.ts JSDoc comment above computePayout`): _"Applies the house edge to maintain a target RTP of approximately 95%."_
  - Observed: Code multiplies winning payout by (1 + HOUSE_EDGE) = 1.05, increasing player return by 5%, then unconditionally adds bet * 0.01. A house edge should reduce player return (multiply by ~0.95), not increase it.
- **[best_practices · warn]** `spin` in `src/engine.ts`:106
  - Reference (`README.md#api`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: When bet > 100, spin() emits console.warn but does not throw — the upper bound of 100 is documented as a hard constraint but is only softly enforced.
- **[best_practices · info]** `lineWins` in `src/paytable.ts`:24
  - Reference (`README.md#API`): _"lineWins: ReadonlyArray<LineWin>"_
  - Observed: Returns an anonymous `{ symbol: Symbol; count: number } | null` rather than a named `LineWin` type. If `LineWin` is declared in `types.ts`, this function should import and return it directly to keep the shape canonical.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 2 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
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
| Run ID | `2026-10-25_125045` |
| Duration | 5.4 min |
| API cost | $2.19 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 247ms |
| estimate | 175ms |
| triage | 1ms |
| rag-index | 13.4s |
| flows | 23ms |
| flow-doc | 0ms |
| review | 204.8s |
| refinement | 104.0s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.5m | $0.05 | 6 / 2793 |
| duplication | 11 | 0.9m | $0.09 | 12 / 4277 |
| correction | 11 | 9.4m | $0.66 | 33 / 38918 |
| overengineering | 10 | 3.1m | $0.21 | 30 / 10096 |
| best_practices | 10 | 13.4m | $0.88 | 30 / 54636 |

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
| OK | 40 | 95% |
| NEEDS_FIX | 2 | 5% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 90% |
| ACCEPTABLE | 1 | 3% |
| OVER | 3 | 8% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.5/10 |
| Min / Max | 4.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 3 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/jackpot.ts`: CLEAN → CRITICAL
- `src/paytable.ts`: NEEDS_REFACTOR → CRITICAL

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

*Generated: 2026-10-25T11:56:10.193Z*
