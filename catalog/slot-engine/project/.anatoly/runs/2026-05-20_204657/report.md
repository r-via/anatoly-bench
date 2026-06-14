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
| Correction errors | 4 | 3 | 0 | 7 |
| Utility | 7 | 0 | 0 | 7 |
| Duplicates | 3 | 1 | 0 | 4 |
| Over-engineering | 0 | 4 | 0 | 4 |
| Test coverage gaps | 6 | 7 | 16 | 29 |
| Best practices | 5 | 6 | 0 | 11 |
| Documentation gaps | 3 | 3 | 8 | 14 |

## Documentation Reference

.anatoly/docs/ updated: 18 pages (18 cached)

Documentation coverage (.anatoly/docs/):
  Fully documented: 7% (2/27 symbols)
  At least partial: 11% (3/27 symbols)
  Pages generated: 18
  Modules: 100% (0/0 modules > 200 LOC in internal docs)

Sync status: 5 pages to create

### Divergences code ↔ reference

- **[best_practices · info]** `computeLegacyPayout` in `src/legacy.ts`:4
  - Reference (`README.md`): _"type Bet = number; // 1..100 coins, integer"_
  - Observed: Parameter typed as `number` instead of the project-defined `Bet` alias, bypassing the documented 1..100 integer constraint at the type level.
- **[best_practices · warn]** `ANCIENT_RTP` in `src/paytable.ts`:3
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#paytable`): _"src/paytable.ts exports getPayMultiplier, which maps (symbol, count) to a base multiplier. The table is fixed at module load time."_
  - Observed: paytable.ts also exports ANCIENT_RTP = 0.95. The 'ANCIENT' prefix is not explained anywhere in the reference docs — no 'ancient' game variant is defined. Likely a stale or incorrectly named constant; may have been TARGET_RTP or similar before a rename.
- **[best_practices · info]** `lineWins` in `src/paytable.ts`:23
  - Reference (`.anatoly/state/internal-docs/02-Architecture/02-Core-Concepts.md#paylines`): _"checkLine in engine.ts skips leading WILDs to determine the pay symbol, then counts WILD or matching symbols contiguously from position 0."_
  - Observed: paytable.ts exports a lineWins function implementing payline-win detection (WILD substitution, contiguous run counting). Reference docs attribute this responsibility to checkLine in engine.ts, not to paytable.ts.
- **[best_practices · warn]** `getReelWeights` in `src/reels.ts`:55
  - Reference (`.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md#reel-weights`): _"Weights are read-only at runtime — there is no setter."_
  - Observed: `getReelWeights` returns a direct mutable reference to `REEL_WEIGHTS[reelIndex]`. Callers can mutate internal weights via the returned array (e.g. `getReelWeights(0)[0] = 999`), violating the documented read-only guarantee.

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
| Correction | 6 | 1 | [axes/correction/index.md](./axes/correction/index.md) |
| Utility | 6 | 1 | [axes/utility/index.md](./axes/utility/index.md) |
| Duplication | 4 | 1 | [axes/duplication/index.md](./axes/duplication/index.md) |
| Overengineering | 4 | 1 | [axes/overengineering/index.md](./axes/overengineering/index.md) |
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
| Run ID | `2026-05-20_204657` |
| Duration | 9.6 min |
| API cost | $3.75 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 136ms |
| estimate | 116ms |
| triage | 1ms |
| rag-index | 32.0s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 6.2s |
| review | 401.8s |
| refinement | 136.1s |

**Per-axis breakdown:**

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.5m | $0.12 | 40 / 14499 |
| duplication | 11 | 1.3m | $0.08 | 40 / 10945 |
| correction | 11 | 13.5m | $1.01 | 33 / 50700 |
| overengineering | 10 | 3.0m | $0.33 | 30 / 8044 |
| tests | 10 | 1.2m | $0.17 | 30 / 3220 |
| best_practices | 10 | 20.3m | $1.25 | 27 / 55002 |
| documentation | 10 | 2.4m | $0.27 | 30 / 8173 |

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
| NEEDS_FIX | 6 | 14% |
| ERROR | 1 | 2% |

**Overengineering** — 41 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 34 | 83% |
| ACCEPTABLE | 3 | 7% |
| OVER | 4 | 10% |

**Tests** — 31 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| GOOD | 2 | 6% |
| WEAK | 11 | 35% |
| NONE | 18 | 58% |

**Documentation** — 31 symbols evaluated

| Verdict | Count | % |
|---------|-------|---|
| DOCUMENTED | 15 | 48% |
| PARTIAL | 1 | 3% |
| UNDOCUMENTED | 15 | 48% |

**Best Practices** — 10 files evaluated

| Metric | Value |
|--------|-------|
| Average score | 7.4/10 |
| Min / Max | 4.0 / 9.5 |

## Deliberation

| Metric | Value |
|--------|-------|
| Files deliberated | 2 |
| Symbols reclassified | 3 |
| Actions removed | 0 |
| Verdict changes | 0 |

**Reclassified files:**

- `src/reels.ts`: 2 symbol(s) — All three findings conflate duplication concerns with the correction axis. The codebase has a genuine duplication problem (pickFromWeighted duplicates weightedPick with only cosmetic differences) and an architectural inconsistency (the DI container registers weightedPick but the reel generation bypasses it). However, none of these are correctness bugs — both implementations are algorithmically sound. The only legitimate correction-axis concern is spinReel's missing bounds check on reelIndex, which is a real defensive gap but not an active defect since all callers pass valid indices 0-4. Downgraded from ERROR to NEEDS_FIX accordingly.
- `src/rng.ts`: 1 symbol(s) — All three findings conflate duplication concerns with the correction axis. The codebase has a genuine duplication problem (pickFromWeighted duplicates weightedPick with only cosmetic differences) and an architectural inconsistency (the DI container registers weightedPick but the reel generation bypasses it). However, none of these are correctness bugs — both implementations are algorithmically sound. The only legitimate correction-axis concern is spinReel's missing bounds check on reelIndex, which is a real defensive gap but not an active defect since all callers pass valid indices 0-4. Downgraded from ERROR to NEEDS_FIX accordingly.

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

*Generated: 2026-05-20T18:56:35.671Z*
