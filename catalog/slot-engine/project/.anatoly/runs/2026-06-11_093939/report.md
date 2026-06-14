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
| Correction errors | 2 | 1 | 0 | 3 |
| Utility | 6 | 0 | 0 | 6 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 4 | 0 | 4 |
| Test coverage gaps | 3 | 6 | 20 | 29 |
| Best practices | 5 | 2 | 0 | 7 |
| Documentation gaps | 2 | 3 | 12 | 17 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 0% (0/27 symbols)
  At least partial: 7% (2/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 3 pages to create

### Divergences code ↔ reference

- **[correction · warn]** `evaluateLine` in `src/engine.ts`:86
  - Reference (`.anatoly/state/internal-docs/02-Architecture/02-Core-Concepts.md#paytable-and-multipliers`): _"basePayout = multiplier × lineBet. WILD and SCATTER have no paytable entry and return 0 from getPayMultiplier."_
  - Observed: After computing basePayout = baseMultiplier * lineBet, the code applies an additional WILD-count multiplier: basePayout *= (1 + wildCount) * 2 ** wildCount (4× for 1 WILD, 12× for 2, 32× for 3). This extra multiplier is absent from the reference documentation and materially inflates per-line payouts for any WILD-inclusive win.
- **[best_practices · info]** `ANCIENT_RTP` in `src/paytable.ts`:3
  - Reference (`README.md`): _"The engine targets a theoretical Return-to-Player of **95%**."_
  - Observed: Exports a constant named `ANCIENT_RTP = 0.95`. The 'ANCIENT' qualifier implies a game-variant-specific RTP, but no such variant is mentioned in any reference document. If the engine uses a different constant (or a hardcoded literal) for its RTP target, this export is unused dead code.
- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:56
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#reel-weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: getReelWeights returns a direct mutable reference to REEL_WEIGHTS[reelIndex]. Callers can mutate the internal weight array without any setter, silently corrupting future spins.
- **[best_practices · warn]** `ConservativeStrategy` in `src/strategy.ts`:17
  - Reference (`README.md`): _"The engine targets a theoretical Return-to-Player of **95%**. Long-run player return approximates the bet-weighted house edge of 5%."_
  - Observed: ConservativeStrategy applies `* 0.8` to totalPayout on every spin, reducing effective RTP from ~95% to ~76% when active. The 95% RTP contract has no guards preventing a lower-RTP strategy from being substituted.

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
| Overengineering | 4 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 9 | 1 | [axes/documentation/index.md](./axes/documentation/index.md) |
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
| Run ID | `2026-06-11_093939` |
| Duration | 9.9 min |
| API cost | $2.91 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 156ms |
| estimate | 129ms |
| triage | 2ms |
| rag-index | 6.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 70.8s |
| review | 409.8s |
| refinement | 102.9s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.08 | 12 / 3905 |
| duplication | 11 | 1.2m | $0.10 | 12 / 5322 |
| correction | 11 | 12.9m | $0.93 | 33 / 47633 |
| overengineering | 10 | 3.3m | $0.20 | 30 / 9969 |
| tests | 10 | 1.1m | $0.09 | 30 / 3327 |
| best_practices | 10 | 18.6m | $1.04 | 30 / 65724 |
| documentation | 10 | 2.3m | $0.15 | 30 / 7309 |

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
| OK | 39 | 93% |
| NEEDS_FIX | 3 | 7% |

**Overengineering** — 40 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 36 | 90% |
| OVER | 4 | 10% |

**Tests** — 32 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 3 | 9% |
| WEAK | 11 | 34% |
| NONE | 18 | 56% |

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
| Min / Max | 3.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 1 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Investigated both escalated findings by reading src/engine.ts, src/reels.ts, src/rng.ts, src/index.ts, and src/factories.ts. Finding 1 (spin) confirmed: throw "invalid bet" at engine.ts:115 is a genuine defect — public API throws a string instead of an Error, breaking standard error handling for callers. Finding 2 (pickFromWeighted) reclassified: the function is algorithmically correct; the duplication with weightedPick in rng.ts is real but belongs on the duplication axis, not correction. No correctness bug exists in pickFromWeighted's logic.

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

*Generated: 2026-06-11T07:49:30.976Z*
