<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 4
- **Files with findings:** 9

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 2 | 0 | 0 | 2 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 1 | 0 | 1 |
| Best practices | 7 | 3 | 0 | 10 |

## Documentation Reference

.anatoly/docs/ updated: 0 pages

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 0% (0/27 symbols)
  Pages generated: 0
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

### Divergences code ↔ reference

- **[best_practices · warn]** `spin` in `src/engine.ts`:100
  - Reference (`README.md#API`): _"function spin(bet: Bet): SpinResult;"_
  - Observed: spin accepts `any` and validates at runtime. It throws a string for invalid input, and a bet above 100 only logs a warning instead of being rejected as the documented 1..100 range requires.
- **[best_practices · warn]** `weightedPick` in `src/rng.ts`:2
  - Reference (`src/rng.ts JSDoc`): _"Weighted random pick utility, suitable for gaming RNG applications."_
  - Observed: Uses Math.random(), a non-cryptographic PRNG that is not certifiable for regulated gaming.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 1 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
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
| Run ID | `2026-10-25_122510` |
| Duration | 2.1 min |
| API cost | $1.75 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 168ms |
| estimate | 148ms |
| triage | 2ms |
| rag-index | 54.7s |
| flows | 20ms |
| flow-doc | 0ms |
| review | 19.6s |
| refinement | 50.3s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.07 | 4 / 1263 |
| duplication | 11 | 0.3m | $0.14 | 8 / 2331 |
| correction | 11 | 0.9m | $0.45 | 22 / 5840 |
| overengineering | 10 | 0.5m | $0.29 | 20 / 3031 |
| best_practices | 10 | 1.5m | $0.45 | 20 / 14841 |

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

**Overengineering** — 39 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 32 | 82% |
| ACCEPTABLE | 6 | 15% |
| OVER | 1 | 3% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 6.6/10 |
| Min / Max | 2.5 / 9.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 5 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 5 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
- `src/paytable.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/freespin.ts`: 1 symbol(s) — I read every file in src (engine, freespin, paytable, reels, rng, types, strategy, factories, index) plus README.md and package.json. 12 of 13 findings are confirmed by the source. The critical one is computePayout (engine.ts:105): the house edge multiplies payouts by 1.05 instead of reducing them. Together with the per-spin `bet * 0.01` bonus and Math.ceil, this contradicts the documented 95% RTP. spin also accepts bets above the documented 100 maximum and only warns. The best-practice findings (any, string throw, console, empty callback, service locator with unused resolutions, missing JSDoc, Math.random in a gaming RNG, float money math) are all present; a few cited line numbers are off by a few lines. One finding is dismissed: handleFreeSpins. Its only caller passes a fresh inactive state, so the disputed retrigger branch never runs and its semantics are a design choice the repo doesn't specify. Overall verdict is CRITICAL because payout math is wrong in the money path.

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

*Generated: 2026-10-25T11:27:17.112Z*
