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
| Correction errors | 6 | 1 | 0 | 7 |
| Utility | 6 | 1 | 0 | 7 |
| Duplicates | 2 | 2 | 0 | 4 |
| Over-engineering | 0 | 2 | 0 | 2 |
| Test coverage gaps | 6 | 4 | 19 | 29 |
| Best practices | 4 | 4 | 0 | 8 |
| Documentation gaps | 5 | 1 | 9 | 15 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 new)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/27 symbols)
  At least partial: 11% (3/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 1 pages to create

New pages generated:
  + .anatoly/docs/01-Getting-Started/01-Overview.md  (from scaffolded)
  + .anatoly/docs/01-Getting-Started/02-Installation.md  (from scaffolded)
  + .anatoly/docs/01-Getting-Started/03-Configuration.md  (from scaffolded)
  + .anatoly/docs/01-Getting-Started/04-Quick-Start.md  (from scaffolded)
  + .anatoly/docs/02-Architecture/01-System-Overview.md  (from scaffolded)
  + .anatoly/docs/02-Architecture/02-Core-Concepts.md  (from scaffolded)
  + .anatoly/docs/02-Architecture/03-Data-Flow.md  (from scaffolded)
  + .anatoly/docs/02-Architecture/04-Design-Decisions.md  (from scaffolded)
  + .anatoly/docs/03-Guides/01-Common-Workflows.md  (from scaffolded)
  + .anatoly/docs/03-Guides/02-Advanced-Configuration.md  (from scaffolded)
  + .anatoly/docs/03-Guides/03-Troubleshooting.md  (from scaffolded)
  + .anatoly/docs/04-API-Reference/01-Public-API.md  (from scaffolded)
  + .anatoly/docs/04-API-Reference/02-Configuration-Schema.md  (from scaffolded)
  + .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md  (from scaffolded)
  + .anatoly/docs/05-Development/01-Source-Tree.md  (from scaffolded)
  + .anatoly/docs/05-Development/02-Build-and-Test.md  (from scaffolded)
  + .anatoly/docs/05-Development/03-Code-Conventions.md  (from scaffolded)
  + .anatoly/docs/05-Development/04-Release-Process.md  (from scaffolded)

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 5 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 2 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 7 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-12_142348` |
| Duration | 8.6 min |
| API cost | $7.09 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 169ms |
| estimate | 125ms |
| triage | 1ms |
| rag-index | 64.1s |
| review | 250.6s |
| refinement | 200.5s |
| internal-docs | 3ms |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.06 | 40 / 7828 |
| duplication | 11 | 1.3m | $0.07 | 40 / 10268 |
| correction | 11 | 11.4m | $1.77 | 33 / 42908 |
| overengineering | 10 | 3.2m | $0.79 | 30 / 9909 |
| tests | 10 | 1.2m | $0.67 | 30 / 3464 |
| best_practices | 10 | 18.5m | $2.40 | 30 / 73011 |
| documentation | 10 | 1.9m | $0.67 | 30 / 5315 |

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
| OK | 35 | 83% |
| NEEDS_FIX | 5 | 12% |
| ERROR | 2 | 5% |

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
| Min / Max | 3.5 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 4 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 2 |

**Verdict changes:**

- `src/factories.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

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

*Generated: 2026-05-12T12:32:24.412Z*
