<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 1
- **Files with findings:** 12
- **Unresolved doc conflicts:** 3 (run `anatoly docs arbitrate`)

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 3 | 1 | 0 | 4 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 5 | 5 | 21 | 31 |
| Best practices | 4 | 1 | 0 | 5 |
| Documentation gaps | 3 | 2 | 12 | 17 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 7% (2/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 5 pages to create

### Divergences code ↔ reference

- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:55
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#Reel-Weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: `getReelWeights` returns the raw `REEL_WEIGHTS[reelIndex]` reference (`number[]`), allowing callers to mutate the internal weight array via `push`, `splice`, or index assignment.

### Unresolved doc conflicts (code ↔ reference) — run `anatoly docs arbitrate`

- `src/events.ts`::SpinEventEmitter vs `README.md` — detected 2026-05-12T20:08:21.308Z
  - Reference: Pure game logic — no UI, no persistence, no networking. … function spin(bet: Bet): SpinResult
  - Code: src/events.ts exports a `SpinEventEmitter` class (L3–L25) and a `SPIN_DONE` string constant (L27), indicating an event-driven interaction surface in the public API.
- `src/engine.ts`::spin vs `README.md` (lines 7–9) — detected 2026-05-15T19:40:00.951Z
  - Reference: import { spin } from "slot-engine";

const result = spin(10); // 10-coin bet
  - Code: The Installation guide's verification snippet calls spin with an object argument: spin({ bet: 1.0 }), and all other internal docs define Bet as a plain number with spin(bet: Bet) where Bet = number.
- `src/engine.ts`::computePayout vs `README.md` — detected 2026-05-19T12:03:14.347Z
  - Reference: Long-run player return approximates the bet-weighted house edge of 5%.
  - Code: The internal doc formula is `totalPayout = Σ(linePayout × wildMultiplier) × (1 + HOUSE_EDGE) + 0.01 × bet`, where multiplying by `(1 + 0.05)` increases payouts above the raw line sum, boosting player return rather than reducing it.

## Axes

| Axis | Files | Shards | Link |
|------|-------|--------|------|
| Correction | 3 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 9 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
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
| Run ID | `2026-06-11_175653` |
| Duration | 12.3 min |
| API cost | $3.65 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 159ms |
| estimate | 173ms |
| triage | 1ms |
| rag-index | 107.9s |
| internal-docs | 3ms |
| rag-index-update | 3ms |
| doc-conflict-update | 109.4s |
| review | 427.3s |
| refinement | 94.4s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.9m | $0.09 | 6 / 3827 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5511 |
| correction | 11 | 16.0m | $1.15 | 31 / 60443 |
| overengineering | 10 | 3.1m | $0.33 | 30 / 9532 |
| tests | 10 | 1.1m | $0.17 | 30 / 3288 |
| best_practices | 10 | 16.0m | $1.07 | 30 / 58295 |
| documentation | 10 | 1.9m | $0.23 | 30 / 6263 |

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

**Tests** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 1 | 3% |
| WEAK | 12 | 38% |
| NONE | 19 | 59% |

**Documentation** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 13 | 41% |
| PARTIAL | 2 | 6% |
| UNDOCUMENTED | 17 | 53% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.1/10 |
| Min / Max | 2.5 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 0 |
| Actions removed | 0 |
| Verdict changes | 2 |

**Verdict changes:**

- `src/engine.ts`: NEEDS_REFACTOR → CRITICAL
- `src/reels.ts`: NEEDS_REFACTOR → CRITICAL

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

*Generated: 2026-06-11T16:09:15.196Z*
