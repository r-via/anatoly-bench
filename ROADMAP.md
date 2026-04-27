# Anatoly evolution roadmap

> Items in this file are **changes needed in [Anatoly](https://github.com/r-via/anatoly)**, not in `anatoly-bench` itself. They are surfaced by misses that this benchmark consistently records on the `slot-engine` fixture across multiple runs.
>
> The roadmap is organized by **effort × bench impact**. Each item lists the symptom observed in the bench, the most likely cause based on Anatoly's current architecture, a proposed fix, and an estimated F1 gain on the slot-engine fixture if landed in isolation.

---

## Quick wins (<1 day each)

### ~~1. Track type-only imports in the usage graph~~ ✅ Shipped — actual fix was per-axis triage policy

**Status:** ✅ landed at [r-via/anatoly@b784caf](https://github.com/r-via/anatoly/commit/b784caf) (v8 of the bench).

**Investigation surfaced a different root cause than the original title.** Type-only import tracking was already implemented correctly (`getTypeOnlySymbolUsage` in `usage-graph.ts`). The actual blocker was triage's `skip` tier: any file matching `type-only` / `trivial` / `barrel-export` / `constants-only` short-circuited every axis with blanket safe defaults, including `utility: 'USED'`. `src/types.ts` was triage-skipped → `LegacySpinResult` got blanket `USED` regardless of its actual zero-importer status.

**Fix shipped:**
- Extracted the `autoResolveSymbol` core into `usage-graph.ts::resolveExportedSymbolUtility` so triage can reuse it.
- `generateSkipReview` now consults the usage graph and writes per-symbol `DEAD`/`USED` instead of blanket `USED`.
- New `evaluatorAxesForSkip(reason)` returns the axes that should still run on skip-tier files: `trivial → {correction, duplication, utility}`, others → empty (utility recovered via the skip path).
- `commands/run.ts` filters evaluators per file based on this policy.

**Side effect — fixed a second miss too:** `src/wild.ts` (4 lines) was previously triage-skipped, hiding the helper from the LLM entirely. It now goes through `correction`/`duplication`/`utility` evaluators. INV-WILD itself remains a miss for a different reason (domain-knowledge gap, item 5), but DEAD-WILD-HELPER and DEAD-LINE-WIN are now caught.

**Bench impact (v7 → v8 apples-to-apples on the v8 catalog):**
- utility: 66.7% → **85.7%** F1 (+19pp)
- 3 cataloged defects newly detected: DEAD-TYPE, DEAD-WILD-HELPER, DEAD-LINE-WIN
- (Global F1 movement is masked by independent LLM variance on correction and best-practices.)

### 2. Allow multiple findings per symbol

**Symptom:** `INV-ROUND` is missed — `engine.ts::computePayout` uses `Math.ceil` (player-favoring rounding) and also has the wrong sign on the house-edge multiplier (`INV-RTP`). Anatoly catches the latter and *mentions* the ceil in the same finding's `detail` text, but never produces a separate finding pinning down `Math.ceil` specifically.

**Likely cause:** the response schema for the `correction` axis returns one record per symbol, with a single `verdict` and a single `detail`. Multiple coexisting defects on the same symbol get collapsed.

**Proposed fix:** change the `correction` schema to return a list of findings instead, each with its own `defect_id`/`line_range`/`detail`. Same symbol can appear N times. Update prompt to encourage one finding per defect rather than collapsing.

**Estimated bench gain:** +1 TP correction (INV-ROUND), correction 61.5% → ~70%, global +1.5 pt.

---

## Medium efforts (1–3 days each)

### 3. Don't suppress `duplication` on `DEAD` code

**Symptom:** `DUP-PAYOUT` is missed — `legacy.ts::computeLegacyPayout` is correctly flagged `DEAD` by `utility`, but the `duplication` axis never produces a verdict on this symbol. Yet the function is a textbook duplicate of `engine.ts::computePayout` (semantically equivalent payout computation, different naming).

**Likely cause:** an inter-axis suppression rule short-circuits downstream axes when `utility` resolves to `DEAD`. Economical (no point analyzing dead code in depth) but discards useful information: a duplicate-of pointer in a dead-code finding tells the maintainer where the surviving copy lives, which is actionable.

**Proposed fix:** audit inter-axis suppressions in `axis-merger.ts` / `phase.ts`. At minimum, keep `duplication` running on `DEAD`-flagged symbols. The merged finding can be presented as "DEAD + duplicates X" rather than "DEAD" alone.

**Estimated bench gain:** +1 TP duplication (DUP-PAYOUT), duplication 66.7% → 75%, global +1 pt.

### 4. Cross-reference class hierarchy + concrete usage in `overengineering`

**Symptom:** `OVER-STRATEGY` is missed — `strategy.ts` defines an abstract `SpinStrategy` with two concrete subclasses (`DefaultStrategy` used at one call site, `ConservativeStrategy` never instantiated). Strategy-pattern abstraction for a single client = textbook over-engineering. Anatoly already detects the same shape on `OVER-FACTORY` (factory abstract class for one concrete subclass), but does not generalize it.

**Likely cause:** the `overengineering` axis evaluates each symbol largely in isolation. It does not systematically pull in subclass relationships and use-site counts.

**Proposed fix:** enrich the OE axis context with, for each abstract class symbol:
- the list of concrete subclasses
- per-subclass instantiation count

Heuristic: if `count(used concrete subclasses) ≤ 1`, the abstraction is a strong `OVER` candidate. The fact that `OVER-FACTORY` is caught suggests the LLM can recognize the pattern when it has enough context; the gap is on what context is shipped to the prompt.

**Estimated bench gain:** +1 TP OE (OVER-STRATEGY), OE 66.7% → 75%, global +1 pt.

---

## Hard (architectural — weeks, not days)

### 5. Domain context injection

**Symptom:** three defects systematically missed across all 7 runs:

- `INV-WILD` (correction, hard) — wild multiplier stacks (`(1+wc) · 2^wc`) instead of replacing (`2^wc`)
- `INV-JACKPOT` (correction, medium) — jackpot triggers on 4 diamonds anywhere instead of 5 on the middle row
- `BP-RNG` (best-practices, medium) — `Math.random()` used as gaming RNG (not certifiable for regulated gaming)

These three look correct in isolation. They violate **domain conventions** (gambling math, regulated-gaming RNG) that are not part of the LLM's general code-review knowledge.

**Likely cause:** Anatoly currently ships a single, universal prompt set per axis. There is no mechanism to inject project-level domain knowledge that would tell the LLM "this is a slot-machine engine, here are the invariants of slot-machine math, here are the regulatory constraints on RNG sources."

**Proposed fix:** introduce a domain-context mechanism. Several reasonable designs:

- **YAML preset:** `.anatoly.yml` adds `domain: gaming` (or `finance`, `healthcare`, `web-payments`); each preset ships a curated set of invariants and best-practice rules. Anatoly injects them into the relevant axis prompts.
- **Free-form domain file:** `.anatoly/domain.md` (project-specific) is read by every axis and injected as context. Lower overhead, no preset library to maintain.
- **Declarative business invariants:** `.anatoly/invariants.yml` lists named invariants the `correction` axis must validate against, in plain-language form.

The first two are complementary: presets for common verticals, free-form file for project-specific specifics.

**Estimated bench gain on slot-engine:** +3 TPs (INV-WILD, INV-JACKPOT, BP-RNG), global +6–8 pts. More importantly, this is the single highest-value item for **real-world enterprise audits** — it transforms Anatoly from "generic linter+" into "auditor with domain awareness", which is exactly the gap most static-analysis tools have.

**Effort:** 1–2 weeks for the YAML-preset path, more if the preset library is to be substantial.

### 6. Sub-symbol granularity

**Symptom:**

- `DUP-WILD` (duplication, hard) — `wild.ts::applyWildBonus` and a verbatim copy of its formula inside `engine.ts::evaluateLine`. The inline copy is not a named symbol, so the symbol-keyed RAG cannot index it for similarity comparison.
- `DEAD-DEBUG-BRANCH` (utility, medium) — `if (DEBUG_MODE) { ... }` block inside `spin()` where `DEBUG_MODE` is a const initialized to `false` and never reassigned. The branch is statically unreachable. The `utility` axis flags symbols, not sub-symbol blocks.

**Likely cause:** Anatoly's atomic unit of analysis is the named symbol (function, class, exported constant). Many real-world defects sit below that level: a single line, a control-flow branch, a sub-expression.

**Proposed fix:** introduce sub-symbol findings. Several pieces are needed:

- **Schema:** allow findings to point at `(file, line_start, line_end)` without a symbol name.
- **Duplication RAG:** index "snippets" (configurable-size code chunks) in addition to named symbols, and compare both ways.
- **Control-flow analysis:** for the `utility` axis, run a lightweight const-folding pass to detect statically-unreachable branches.

**Estimated bench gain on slot-engine:** +2 TPs (DUP-WILD, DEAD-DEBUG-BRANCH), global +3–4 pts. On other fixtures with denser inline code or more dead branches, the gain would be larger.

**Effort:** 2–4 weeks. This touches the schema, the axes, the RAG, and the consolidation steps.

---

## Summary

| Priority | Items | Effort | Cumulative bench gain (estimated) |
|---|---|---|---|
| Quick wins (1–2) | DEAD-TYPE tracking, multi-defect findings | <1 day each | 65.5% → ~68% global F1 |
| Medium (3–4) | DEAD ↛ skip duplication, OE class-hierarchy context | 1–3 days each | ~68% → ~70% |
| Hard (5–6) | Domain context injection, sub-symbol granularity | 1–4 weeks | ~70% → ~80%+ |

**Recommended order:**

1. Land the two quick wins first — short PRs, immediate measurable signal on the bench.
2. Tackle **domain context injection** (item 5) next. It is by far the highest-value architectural change because it generalizes beyond the slot-engine fixture: any future fixture in a regulated or domain-specific vertical (finance, healthcare, security-critical) will benefit from the same mechanism. On its own it lifts slot-engine global F1 by 6–8 points and unlocks Anatoly's positioning as a domain-aware auditor rather than a generic linter.
3. Items 3, 4, and 6 can land in any order after that; they are independent.

Items 1, 3, 4, and 6 are not blocked by anything in `anatoly-bench` — they can be implemented and merged independently. Item 5 (domain context) may benefit from a small `anatoly-bench` extension to declare the fixture's domain in the SPEC and route it back to Anatoly's `--spec`-style flag, but this is additive.

---

## Tracking

Update this file when:

- a roadmap item is implemented in Anatoly → cross it out and link the merge commit
- a new persistent miss is added to the catalog of remaining misses (see [README.md](./README.md))
- a new fixture surfaces a structural gap not covered above

The bench's per-run baselines in [`baselines/`](./baselines/) are the source of truth for measuring deltas.
