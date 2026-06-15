<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 12
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 1
- **Files with findings:** 11

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 5 | 3 | 0 | 8 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 6 | 5 | 18 | 29 |
| Best practices | 6 | 6 | 0 | 12 |
| Documentation gaps | 3 | 3 | 7 | 13 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 new)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/26 symbols)
  At least partial: 12% (3/26 symbols)
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
| Correction | 6 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 4 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 10 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 6 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-13_233229` |
| Duration | 8.4 min |
| API cost | $4.57 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 130ms |
| estimate | 111ms |
| triage | 1ms |
| rag-index | 13.8s |
| internal-docs | 4ms |
| doc-conflict-update | 78.2s |
| review | 229.0s |
| refinement | 181.7s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.1m | $0.11 | 40 / 10509 |
| duplication | 10 | 1.6m | $0.11 | 40 / 14350 |
| correction | 10 | 10.5m | $1.24 | 30 / 38883 |
| overengineering | 10 | 3.2m | $0.53 | 30 / 11096 |
| tests | 10 | 1.0m | $0.29 | 30 / 3056 |
| best_practices | 10 | 17.5m | $1.98 | 30 / 67582 |
| documentation | 10 | 1.1m | $0.31 | 30 / 3737 |

## Axis Summary

**Utility** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 33 | 80% |
| DEAD | 6 | 15% |
| LOW_VALUE | 2 | 5% |

**Duplication** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 37 | 90% |
| DUPLICATE | 4 | 10% |

**Correction** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| OK | 33 | 80% |
| NEEDS_FIX | 8 | 20% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 90% |
| ACCEPTABLE | 1 | 3% |
| OVER | 3 | 8% |

**Tests** — 31 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 2 | 6% |
| WEAK | 11 | 35% |
| NONE | 18 | 58% |

**Documentation** — 29 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 14 | 48% |
| PARTIAL | 2 | 7% |
| UNDOCUMENTED | 13 | 45% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.2/10 |
| Min / Max | 3.5 / 9.0 |

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

*Generated: 2026-05-13T21:40:54.144Z*
