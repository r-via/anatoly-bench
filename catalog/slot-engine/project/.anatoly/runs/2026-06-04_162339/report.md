<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

## Executive Summary

- **Files reviewed:** 13
- **Global verdict:** NEEDS_REFACTOR
- **Clean files:** 2
- **Files with findings:** 11
- **Unresolved doc conflicts:** 3 (run `anatoly docs arbitrate`)

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Correction errors | 2 | 0 | 0 | 2 |
| Utility | 2 | 0 | 0 | 2 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 3 | 0 | 3 |
| Test coverage gaps | 5 | 4 | 24 | 33 |
| Best practices | 5 | 4 | 0 | 9 |
| Documentation gaps | 3 | 2 | 14 | 19 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 4% (1/27 symbols)
  At least partial: 11% (3/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 3 pages to create

### Divergences code ↔ reference

- **[correction · warn]** `getReelWeights` in `src/reels.ts`:57
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#Reel Weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: Returns a direct reference to the mutable REEL_WEIGHTS[reelIndex] array; a caller can overwrite individual weight values, silently violating the read-only contract.
- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:57
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#Reel-Weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: getReelWeights returns REEL_WEIGHTS[reelIndex] as a plain mutable number[]. Callers can write getReelWeights(0)[0] = 999 and permanently alter the module-level weight table, violating the documented read-only contract.

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
| Utility | 3 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 3 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
| Tests | 9 | 1 | [axes/tests/index.md](./axes/tests/index.md) |
| Documentation | 11 | 2 | [axes/documentation/index.md](./axes/documentation/index.md) |
| Best Practices | 6 | 1 | [axes/best-practices/index.md](./axes/best-practices/index.md) |

## Performance & Triage

| Tier | Files | % |
|------|-------|---|
| Skip | 2 | 15% |
| Evaluate | 11 | 85% |

Estimated time saved: **0.3 min**

## Run Statistics

| Metric | Value |
|--------|-------|
| Run ID | `2026-06-04_162339` |
| Duration | 8.6 min |
| API cost | $3.37 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 160ms |
| estimate | 768ms |
| triage | 1ms |
| rag-index | 32.1s |
| internal-docs | 4ms |
| rag-index-update | 5ms |
| doc-conflict-update | 5.4s |
| review | 391.6s |
| refinement | 85.2s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.10 | 12 / 3459 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5316 |
| correction | 11 | 10.2m | $0.76 | 33 / 36783 |
| overengineering | 10 | 3.1m | $0.32 | 30 / 9555 |
| tests | 10 | 1.0m | $0.15 | 30 / 3039 |
| best_practices | 10 | 19.8m | $1.30 | 30 / 74075 |
| documentation | 10 | 2.3m | $0.24 | 30 / 7253 |

## Axis Summary

**Utility** — 42 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| USED | 39 | 93% |
| DEAD | 2 | 5% |
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

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 35 | 85% |
| ACCEPTABLE | 3 | 7% |
| OVER | 3 | 7% |

**Tests** — 35 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 2 | 6% |
| WEAK | 11 | 31% |
| NONE | 22 | 63% |

**Documentation** — 35 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 14 | 40% |
| PARTIAL | 2 | 6% |
| UNDOCUMENTED | 19 | 54% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.2/10 |
| Min / Max | 4.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 3 |
| Symbols reclassified | 2 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 1 symbol(s) — Of three escalated findings, only `spin`'s bet validation gap is a genuine correction-axis defect: the code acknowledges bet > 100 as exceeding the maximum but only warns instead of enforcing. The two duplication findings (pickFromWeighted and weightedPick) were incorrectly placed on the correction axis — both functions are algorithmically correct and produce valid results. Duplication is a legitimate concern but belongs on the duplication axis, not correction. Notably, weightedPick is also dead code at runtime: it's registered in the EngineContainer but the resolved reference is never invoked — actual reel generation bypasses it entirely via the factory → spinReel → pickFromWeighted chain.
- `src/rng.ts`: 1 symbol(s) — Of three escalated findings, only `spin`'s bet validation gap is a genuine correction-axis defect: the code acknowledges bet > 100 as exceeding the maximum but only warns instead of enforcing. The two duplication findings (pickFromWeighted and weightedPick) were incorrectly placed on the correction axis — both functions are algorithmically correct and produce valid results. Duplication is a legitimate concern but belongs on the duplication axis, not correction. Notably, weightedPick is also dead code at runtime: it's registered in the EngineContainer but the resolved reference is never invoked — actual reel generation bypasses it entirely via the factory → spinReel → pickFromWeighted chain.

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

*Generated: 2026-06-04T14:32:17.544Z*
