<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 12
- **Global verdict:** CRITICAL
- **Clean files:** 1
- **Files with findings:** 11

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 5 | 3 | 0 | 8 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 1 | 2 | 0 | 3 |
| Test coverage gaps | 8 | 4 | 17 | 29 |
| Best practices | 5 | 4 | 0 | 9 |
| Documentation gaps | 5 | 3 | 7 | 15 |

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
| Correction | 7 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 5 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 4 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 10 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 4 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 17% |
| Evaluate | 10 | 83% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-05-14_104251` |
| Duration | 9.8 min |
| API cost | $5.63 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 127ms |
| estimate | 118ms |
| triage | 2ms |
| rag-index | 14.3s |
| internal-docs | 2ms |
| doc-conflict-update | 70.2s |
| review | 317.4s |
| refinement | 184.8s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.3m | $0.11 | 40 / 10569 |
| duplication | 10 | 1.6m | $0.13 | 40 / 14665 |
| correction | 10 | 11.7m | $1.47 | 30 / 47541 |
| overengineering | 10 | 3.2m | $0.51 | 30 / 10585 |
| tests | 10 | 1.1m | $0.30 | 30 / 3351 |
| best_practices | 10 | 19.1m | $2.34 | 30 / 82007 |
| documentation | 10 | 1.2m | $0.30 | 30 / 3578 |

## Axis Summary

**Utility** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 34 | 83% |
| DEAD | 6 | 15% |
| LOW_VALUE | 1 | 2% |

**Duplication** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 37 | 90% |
| DUPLICATE | 4 | 10% |

**Correction** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| OK | 33 | 80% |
| NEEDS_FIX | 7 | 17% |
| ERROR | 1 | 2% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 35 | 88% |
| ACCEPTABLE | 2 | 5% |
| OVER | 3 | 8% |

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
| Average score | 6.6/10 |
| Min / Max | 3.0 / 9.0 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 5 |
| Symbols reclassified | 3 |
| Actions removed | 0 |
| Verdict changes | 4 |

**Verdict changes:**

- `src/factories.ts`: NEEDS_REFACTOR → CRITICAL
- `src/freespin.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL
- `src/rng.ts`: NEEDS_REFACTOR → CRITICAL

**Reclassified files:**

- `src/reels.ts`: 2 symbol(s) — The critical finding is computePayout in engine.ts: an inverted house edge (1+0.05 instead of 1-0.05) and an unconditional bet*0.01 leak constitute financial correctness bugs in a gambling engine. The StandardReelBuilderFactory finding is valid — _rowCount is silently discarded, violating the abstract interface contract. handleFreeSpins is correct as a standalone state machine but its integration in engine.ts creates a fresh state every call, making 2/3 branches unreachable — the defect is real but located in the caller. DEFAULT_WEIGHTS was reclassified to OK: DIAMOND's high weight is a game design choice with no observable code defect. Both pickFromWeighted and weightedPick were reclassified to OK on the correction axis: they are algorithmically identical duplicates, but each is individually correct. Duplication is a maintainability concern, not a correctness defect.
- `src/rng.ts`: 1 symbol(s) — The critical finding is computePayout in engine.ts: an inverted house edge (1+0.05 instead of 1-0.05) and an unconditional bet*0.01 leak constitute financial correctness bugs in a gambling engine. The StandardReelBuilderFactory finding is valid — _rowCount is silently discarded, violating the abstract interface contract. handleFreeSpins is correct as a standalone state machine but its integration in engine.ts creates a fresh state every call, making 2/3 branches unreachable — the defect is real but located in the caller. DEFAULT_WEIGHTS was reclassified to OK: DIAMOND's high weight is a game design choice with no observable code defect. Both pickFromWeighted and weightedPick were reclassified to OK on the correction axis: they are algorithmically identical duplicates, but each is individually correct. Duplication is a maintainability concern, not a correctness defect.

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

*Generated: 2026-05-14T08:52:40.151Z*
