<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 15
- **Global verdict:** CRITICAL
- **Clean files:** 3
- **Files with findings:** 12

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 2 | 4 | 0 | 6 |
| Utility | 7 | 0 | 0 | 7 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 4 | 7 | 18 | 29 |
| Best practices | 4 | 3 | 0 | 7 |
| Documentation gaps | 2 | 4 | 9 | 15 |

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
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 5 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 13% |
| Evaluate | 13 | 87% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-06_114407` |
| Duration | 6.4 min |
| API cost | $5.11 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 65ms |
| estimate | 126ms |
| triage | 1ms |
| rag-index | 8.2s |
| review | 180.4s |
| refinement | 193.8s |
| internal-docs | 3ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.8m | $0.06 | 40 / 7975 |
| duplication | 13 | 1.6m | $0.09 | 50 / 12878 |
| correction | 13 | 10.5m | $1.31 | 37 / 39184 |
| overengineering | 12 | 3.2m | $0.50 | 36 / 9111 |
| tests | 12 | 1.4m | $0.30 | 36 / 3067 |
| best_practices | 12 | 16.8m | $1.96 | 36 / 65969 |
| documentation | 12 | 1.8m | $0.38 | 30 / 6054 |

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
| OK | 36 | 86% |
| NEEDS_FIX | 5 | 12% |
| ERROR | 1 | 2% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 88% |
| ACCEPTABLE | 2 | 5% |
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

**Best Practices** — 12 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.4/10 |
| Min / Max | 3.0 / 10.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 4 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 3 |

**Verdict changes:**

- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — One critical confirmed bug: computePayout (src/engine.ts:105) applies house edge in the wrong direction — `(1 + 0.05)` instead of `(1 - 0.05)` — causing the engine to pay 105% of line wins instead of 95%, violating the documented RTP target. One confirmed-but-unreachable off-by-one in handleFreeSpins retrigger path (engine always creates fresh state). One valid defensive coding gap in spinReel (no bounds check on reelIndex). Two false positives where duplication between pickFromWeighted and weightedPick was misclassified as a correction issue — both functions are algorithmically correct; the duplication belongs on the duplication axis. Notably, weightedPick is registered in the DI container but the resolved reference is never called; all reel generation flows through pickFromWeighted directly.
- `src/rng.ts`: 1 symbol(s) — One critical confirmed bug: computePayout (src/engine.ts:105) applies house edge in the wrong direction — `(1 + 0.05)` instead of `(1 - 0.05)` — causing the engine to pay 105% of line wins instead of 95%, violating the documented RTP target. One confirmed-but-unreachable off-by-one in handleFreeSpins retrigger path (engine always creates fresh state). One valid defensive coding gap in spinReel (no bounds check on reelIndex). Two false positives where duplication between pickFromWeighted and weightedPick was misclassified as a correction issue — both functions are algorithmically correct; the duplication belongs on the duplication axis. Notably, weightedPick is registered in the DI container but the resolved reference is never called; all reel generation flows through pickFromWeighted directly.

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

*Generated: 2026-05-06T09:50:30.323Z*
