<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 15
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 3
- **Files with findings:** 12

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 4 | 1 | 0 | 5 |
| Utility | 6 | 1 | 0 | 7 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 1 | 2 | 0 | 3 |
| Test coverage gaps | 7 | 3 | 19 | 29 |
| Best practices | 5 | 2 | 0 | 7 |
| Documentation gaps | 5 | 1 | 10 | 16 |

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
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 6 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 13% |
| Evaluate | 13 | 87% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-06_113334` |
| Duration | 8.8 min |
| API cost | $6.45 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 86ms |
| estimate | 124ms |
| triage | 1ms |
| rag-index | 39.9s |
| review | 340.7s |
| refinement | 149.8s |
| internal-docs | 3ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.8m | $0.06 | 40 / 7926 |
| duplication | 13 | 1.9m | $0.10 | 50 / 14534 |
| correction | 13 | 11.6m | $1.60 | 39 / 49449 |
| overengineering | 12 | 4.4m | $0.63 | 36 / 14201 |
| tests | 12 | 1.5m | $0.33 | 39 / 3694 |
| best_practices | 12 | 23.7m | $2.59 | 36 / 91321 |
| documentation | 12 | 3.1m | $0.49 | 30 / 10302 |

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
| DOCUMENTED | 13 | 42% |
| PARTIAL | 3 | 10% |
| UNDOCUMENTED | 15 | 48% |

**Best Practices** — 12 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.5/10 |
| Min / Max | 2.5 / 10.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Both findings claim correction=NEEDS_FIX for what is fundamentally a duplication issue. Verified by reading src/reels.ts:30-41, src/rng.ts:5-16, src/engine.ts:2,30,120, and src/factories.ts:12. The two functions are algorithmically identical (cumulative-weight random selection with identical control flow and fallback). Neither contains a correctness bug. The real architectural concern is that engine.ts imports weightedPick and registers it in a DI container but the factory bypasses it entirely by calling spinReel() → pickFromWeighted(). This is a legitimate refactoring target (consolidate to one implementation) but not a correction issue — the existing code produces correct weighted random results. Reclassified both from NEEDS_FIX to OK on the correction axis. Overall verdict is NEEDS_REFACTOR to address the duplication and the dead-code-in-engine-path issue.
- `src/rng.ts`: 1 symbol(s) — Both findings claim correction=NEEDS_FIX for what is fundamentally a duplication issue. Verified by reading src/reels.ts:30-41, src/rng.ts:5-16, src/engine.ts:2,30,120, and src/factories.ts:12. The two functions are algorithmically identical (cumulative-weight random selection with identical control flow and fallback). Neither contains a correctness bug. The real architectural concern is that engine.ts imports weightedPick and registers it in a DI container but the factory bypasses it entirely by calling spinReel() → pickFromWeighted(). This is a legitimate refactoring target (consolidate to one implementation) but not a correction issue — the existing code produces correct weighted random results. Reclassified both from NEEDS_FIX to OK on the correction axis. Overall verdict is NEEDS_REFACTOR to address the duplication and the dead-code-in-engine-path issue.

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

*Generated: 2026-05-06T09:42:25.653Z*
