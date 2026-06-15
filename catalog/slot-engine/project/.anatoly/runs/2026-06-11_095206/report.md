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
| Correction errors | 2 | 0 | 0 | 2 |
| Utility | 5 | 1 | 0 | 6 |
| Duplicates | 4 | 0 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 5 | 3 | 22 | 30 |
| Best practices | 6 | 0 | 0 | 6 |
| Documentation gaps | 3 | 2 | 12 | 17 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 7% (2/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 3 pages to create

### Divergences code ↔ reference

- **[best_practices · info]** `computeLegacyPayout` in `src/legacy.ts`:4
  - Reference (`README.md`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: The bet parameter is typed as raw number rather than the canonical Bet alias, losing the 1–100 integer contract at the call site.
- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:58
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#Reel Weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: getReelWeights returns number[] (mutable). A caller can write getReelWeights(0)[0] = 0 to silently mutate the internal REEL_WEIGHTS matrix, violating the read-only guarantee.

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
| Correction | 4 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
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
| Run ID | `2026-06-11_095206` |
| Duration | 10.3 min |
| API cost | $2.94 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 156ms |
| estimate | 131ms |
| triage | 1ms |
| rag-index | 6.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 89.9s |
| review | 358.6s |
| refinement | 161.6s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.08 | 12 / 4097 |
| duplication | 11 | 1.2m | $0.10 | 12 / 5433 |
| correction | 11 | 12.6m | $0.75 | 33 / 45009 |
| overengineering | 10 | 3.1m | $0.19 | 30 / 9119 |
| tests | 10 | 1.2m | $0.10 | 30 / 3361 |
| best_practices | 10 | 18.6m | $1.06 | 30 / 67505 |
| documentation | 10 | 1.9m | $0.14 | 30 / 6187 |

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
| LEAN | 35 | 88% |
| ACCEPTABLE | 2 | 5% |
| OVER | 3 | 8% |

**Tests** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 2 | 6% |
| WEAK | 11 | 34% |
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
| Average score | 6.9/10 |
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Investigated all three escalated findings by reading source files end-to-end and tracing call chains. The spin finding is confirmed NEEDS_FIX with increased confidence: computePayout at engine.ts:105 applies house edge in the wrong direction (1+0.05 instead of 1-0.05), directly contradicting its own JSDoc. Combined with string-throw, guaranteed minimum payout, and unused container resolutions, spin has real correctness defects. The pickFromWeighted and weightedPick findings are false positives on the correction axis — both functions are algorithmically correct implementations of weighted random selection. The evaluator incorrectly classified their duplication (a valid observation) as a correction defect. Reclassified both to OK with confidence 92.
- `src/rng.ts`: 1 symbol(s) — Investigated all three escalated findings by reading source files end-to-end and tracing call chains. The spin finding is confirmed NEEDS_FIX with increased confidence: computePayout at engine.ts:105 applies house edge in the wrong direction (1+0.05 instead of 1-0.05), directly contradicting its own JSDoc. Combined with string-throw, guaranteed minimum payout, and unused container resolutions, spin has real correctness defects. The pickFromWeighted and weightedPick findings are false positives on the correction axis — both functions are algorithmically correct implementations of weighted random selection. The evaluator incorrectly classified their duplication (a valid observation) as a correction defect. Reclassified both to OK with confidence 92.

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

*Generated: 2026-06-11T08:02:25.081Z*
