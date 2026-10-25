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
| Over-engineering | 0 | 3 | 0 | 3 |
| Best practices | 6 | 4 | 0 | 10 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[best_practices · warn]** `spin` in `src/engine.ts`:118
  - Reference (`README.md#API`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: Bets above 100 only trigger console.warn and the spin proceeds. The 1..100 range is not enforced.
- **[best_practices · warn]** `weightedPick` in `src/rng.ts`:2
  - Reference (`src/rng.ts JSDoc`): _"Weighted random pick utility, suitable for gaming RNG applications."_
  - Observed: Uses Math.random(), a non-cryptographic PRNG that is not certifiable for regulated gaming RNG.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
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
| Run ID | `2026-10-25_122934` |
| Duration | 2.7 min |
| API cost | $1.83 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 250ms |
| estimate | 194ms |
| triage | 1ms |
| rag-index | 51.7s |
| flows | 23ms |
| flow-doc | 0ms |
| review | 36.8s |
| refinement | 70.1s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.07 | 4 / 1278 |
| duplication | 11 | 0.3m | $0.13 | 8 / 2495 |
| correction | 11 | 1.2m | $0.38 | 22 / 8230 |
| overengineering | 10 | 0.6m | $0.27 | 20 / 3373 |
| best_practices | 10 | 2.1m | $0.51 | 20 / 21116 |

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

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 31 | 78% |
| ACCEPTABLE | 6 | 15% |
| OVER | 3 | 8% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 6.7/10 |
| Min / Max | 2.0 / 9.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 2 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/rng.ts`: 1 symbol(s) — I read all 13 source files plus package.json, tsconfig.json and README.md, and used grep to check usages. 12 of the 13 findings hold. The two correction defects in src/engine.ts are real and affect money: computePayout applies the house edge in the wrong direction (×1.05), adds bet×0.01 on every spin and rounds up with ceil, so a 1-coin losing spin returns 1 coin. spin only warns on bets above the documented maximum of 100 and still pays them out. Both break the README contract (RTP 95%, bet 1..100), so the verdict is CRITICAL. The engine.ts best-practice failures are all present in the source (explicit any, thrown string, unused rng/reelsModule locals, empty handler, warn-and-continue), though the project has no ESLint config. The Math.random security and testability findings stand, and rng.ts:2 falsely claims the RNG is fit for gaming. The JSDoc findings are true for every exported symbol cited, even though those modules are internal to the package entry point. One finding is reclassified: the weightedPick correction finding becomes OK, because missing validation in a function that is never invoked with arguments (engine.ts:120 resolves it into an unused local) is not an observable defect.

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

*Generated: 2026-10-25T11:32:15.528Z*
