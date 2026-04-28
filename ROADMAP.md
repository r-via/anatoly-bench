# Anatoly evolution roadmap

> Items in this file are **changes needed in [Anatoly](https://github.com/r-via/anatoly)**, not in `anatoly-bench` itself. They are surfaced by misses that this benchmark consistently records on the `slot-engine` fixture across multiple runs.
>
> The roadmap is organized by **effort × bench impact**. Each item lists the symptom observed in the bench, the most likely cause based on Anatoly's current architecture, a proposed fix, and an estimated F1 gain on the slot-engine fixture if landed in isolation.

---

## ✅ Shipped

Two Anatoly fixes have landed during the lifetime of this benchmark, both surfaced by persistent bench misses.

### Duplication tier-1 invariant (v6)

**Commit:** [r-via/anatoly@44f0617](https://github.com/r-via/anatoly/commit/44f0617)

Tier-1 refinement was overriding the LLM's `DUPLICATE` verdict whenever the underlying RAG embedding score stayed below 0.68 — even when the LLM had committed to a concrete `duplicate_target`. Five runs in a row, the duplication axis returned 0/4 on a fixture containing four obvious semantic duplicates. The bench logs showed the LLM had actually returned the right answer (e.g. `weightedPick` → `pickFromWeighted` at 99% similarity); tier-1 was stripping it.

**Bench impact:** duplication F1 0% → 66.7% (recall 2/4 on slot-engine; precision 100% via the `members` matching mechanism).

### Multi-defect findings per symbol (v9)

**Commit:** [r-via/anatoly@75cdf08](https://github.com/r-via/anatoly/commit/75cdf08)

The correction axis used to return one record per symbol (one verdict, one detail prose). When a symbol carried several distinct defects (a function with both a wrong-sign multiplier and a Math.ceil rounding bug), they collapsed into a single paragraph; only one could match a cataloged violation downstream.

**Fix shipped:** added an optional `findings` array on `CorrectionSymbolSchema` — one entry per defect, each with its own `line_start` / `line_end` / `detail`. The shard renderer emits one markdown row per finding for symbols that ship the array. New prompt rule #9 instructs the LLM to enumerate distinct defects rather than collapsing.

**Bench impact (v9):** validated structurally — the LLM produced multi-row entries for `spin` (2 findings) and `handleFreeSpins` (2 findings) on a real run. INV-ROUND itself still missed at v9 because the LLM didn't flag `Math.ceil` as a separate defect on `computePayout`; that materialized one run later, paired with the internal-docs injection (see below).

### Internal-docs injection into business-logic axes (v10)

**Commit:** TBD (Epic 48 reverted; final implementation injects existing `.anatoly/docs/` content into the `correction`, `best_practices`, and `overengineering` user messages via a new `renderInternalDocsContext` helper, plus prompt rule #10 in `correction.system.md` instructing the model to treat documented invariants as authoritative ground truth and cite the source page in finding details.)

The bench surfaced three correction misses systematically tied to domain knowledge — facts the LLM had no reason to flag because nothing in the local code contradicted them. An initial proposal ([previously at `docs/02-domain-digest-spec.md`, now removed](https://github.com/r-via/anatoly-bench/commit/HEAD)) suggested building a parallel "domain digest" extraction pipeline that would distill README and `/docs/` into a small spec injected into every axis. Implementation revealed a simpler path: Anatoly's existing **internal-docs scaffolder** (Epic 29) already produces high-quality, agent-curated business context as `.anatoly/docs/` — the same content the digest would have synthesized. The fix collapses to "inject what's already generated, into the axes that need it."

No new extraction phase, no new cache, no new artifact format. The internal docs already invalidate on source-hash changes; the axes simply consume them.

**Bench impact (v9 → v10):** correction 46.2% → 53.3% (+7pp, INV-ROUND now detected); best-practices 40.0% → 44.4% (+4.4pp); overengineering 66.7% → 75.0% (+8.3pp). Global F1 61.0% → 65.0%.

The persistent misses (INV-WILD, INV-JACKPOT, BP-RNG, BP-MUTATION variance) belong to either pretrained-knowledge prompting (item 5a, separate evolution) or user-provided private conventions (item 5c, deferred).

### Per-axis triage policy (v8)

**Commit:** [r-via/anatoly@b784caf](https://github.com/r-via/anatoly/commit/b784caf)

Triage's `skip` tier used to be binary: type-only / trivial / barrel-export / constants-only files bypassed every axis with blanket safe defaults (`utility: 'USED'`, `correction: 'OK'`, etc.). `src/types.ts` (containing an exported but unused type alias) silently classified as `USED`. A 4-line `src/wild.ts` never saw the LLM at all. Investigation revealed type-only import tracking was already correctly implemented — the actual blocker was the all-or-nothing skip.

**Fix shipped:**

- Extracted `autoResolveSymbol` into `usage-graph.ts::resolveExportedSymbolUtility` so triage can reuse it.
- `generateSkipReview` now consults the usage graph and writes per-symbol `DEAD`/`USED` instead of blanket `USED`.
- New `evaluatorAxesForSkip(reason)` returns the axes that should still run on skip-tier files: `trivial → {correction, duplication, utility}`, others → empty (utility recovered via the skip path).
- `commands/run.ts` filters evaluators per file based on this policy.

**Bench impact (v7 → v8 apples-to-apples on the v8 catalog):** utility 66.7% → 85.7% F1 (+19pp). Three new TPs (DEAD-TYPE, DEAD-WILD-HELPER, DEAD-LINE-WIN). The global F1 movement is masked by independent LLM variance on `correction` and `best-practices`, but the structural lift on the targeted axis is unambiguous.

---

## Quick wins (<1 day each)

### 5a. Industry-knowledge prompting

See [§5 — Domain awareness — remaining sub-items](#5-domain-awareness--remaining-sub-items) below for the detailed rationale and proposed prompt addition. Listed here as a quick-win because it is a one-hour prompt change with an immediately measurable bench delta on BP-RNG.

---

## Medium efforts (1–3 days each)

### 3. Don't suppress `duplication` on `DEAD` code

**Symptom:** `DUP-PAYOUT` is missed — `legacy.ts::computeLegacyPayout` is correctly flagged `DEAD` by `utility`, but the `duplication` axis never produces a verdict on this symbol. Yet the function is a textbook duplicate of `engine.ts::computePayout` (semantically equivalent payout computation, different naming).

**Likely cause:** an inter-axis suppression rule short-circuits downstream axes when `utility` resolves to `DEAD`. Economical (no point analyzing dead code in depth) but discards useful information: a duplicate-of pointer in a dead-code finding tells the maintainer where the surviving copy lives, which is actionable.

**Proposed fix:** audit inter-axis suppressions in `axis-merger.ts` / `phase.ts`. At minimum, keep `duplication` running on `DEAD`-flagged symbols. The merged finding can be presented as "DEAD + duplicates X" rather than "DEAD" alone.

**Estimated bench gain:** +1 TP duplication (DUP-PAYOUT), duplication 66.7% → 85.7%, global +3.8 pp.

### 4. Cross-reference class hierarchy + concrete usage in `overengineering`

**Symptom:** `OVER-STRATEGY` is missed — `strategy.ts` defines an abstract `SpinStrategy` with two concrete subclasses (`DefaultStrategy` used at one call site, `ConservativeStrategy` never instantiated). Strategy-pattern abstraction for a single client = textbook over-engineering. Anatoly already detects the same shape on `OVER-FACTORY` (factory abstract class for one concrete subclass), but does not generalize it.

**Likely cause:** the `overengineering` axis evaluates each symbol largely in isolation. It does not systematically pull in subclass relationships and use-site counts.

**Proposed fix:** enrich the OE axis context with, for each abstract class symbol:

- the list of concrete subclasses
- per-subclass instantiation count

Heuristic: if `count(used concrete subclasses) ≤ 1`, the abstraction is a strong `OVER` candidate. The fact that `OVER-FACTORY` is caught suggests the LLM can recognize the pattern when it has enough context; the gap is on what context is shipped to the prompt.

**Estimated bench gain:** +1 TP OE (OVER-STRATEGY), OE 75.0% → 88.9%, global +2.8 pp.

---

## Hard (architectural — weeks, not days)

### 5. Domain awareness — remaining sub-items

The doc-derived half of the original "domain context injection" item is shipped (see Shipped section, internal-docs injection). What remains:

#### 5a. Industry-knowledge prompting (no config)

**Symptom:** `BP-RNG` is consistently missed. `Math.random()` used as a gaming RNG is a well-known industry rule (regulated gaming requires certifiable RNG sources). The LLM has this knowledge from pretraining but does not volunteer it.

**Proposed fix:** add to the `best_practices` and `correction` system prompts an instruction along the lines of:

> Before clearing a symbol, identify the project's domain from filenames, imports, types, and the internal-docs context if present. Then apply industry-specific correctness rules you know for that domain — even if not contradicted by the local code (e.g. `Math.random()` for gaming/security RNG, monetary rounding conventions for finance code, IND-CCA properties for crypto).

**Estimated bench gain:** +1 TP best-practices (BP-RNG). Global +1 pp. Cost: ~1h of prompt iteration plus a bench run to validate.

**Risk:** false positives. The model may speculate about domains that don't apply. The internal-docs injection partially mitigates this by anchoring the inferred domain in the project's own description.

#### 5c. User-provided invariants override (config-explicit)

**Symptom:** `INV-WILD` and `INV-JACKPOT` are systematically missed and cannot be unlocked by docs alone — they are project-private design conventions ("wild substitutes, does not stack"; "jackpot is 5 DIAMOND on the middle row"). Slot-engine's README does not state them; the internal docs scaffolder doesn't have a source for them either.

**Proposed fix:** support a user-edited `.anatoly/domain.md` (free-form markdown) and/or a structured `.anatoly/invariants.yml` (one entry per invariant: id, statement, applies_to_files). Loaded by Anatoly with explicit precedence over generated internal-docs context. The user writes them once for project-specific conventions that no auto-extraction can reach.

**Estimated bench gain on slot-engine:** +2 TPs correction (INV-WILD, INV-JACKPOT). Global +3 pp. Useful primarily for projects where the spec exists in someone's head, not in the docs.

**Effort:** ~1 week. Format design + parser + axis-prompt integration + cache key extension.

### 6. Sub-symbol granularity

**Symptom:**

- `DUP-WILD` (duplication, hard) — `wild.ts::applyWildBonus` and a verbatim copy of its formula inside `engine.ts::evaluateLine`. The inline copy is not a named symbol, so the symbol-keyed RAG cannot index it for similarity comparison. Note: the v8 triage fix surfaced `applyWildBonus` itself as `DEAD` on the utility axis (the helper is dead because the inline copy is canonical). The duplication relationship between the inline block and the dead helper still requires sub-symbol indexing to detect via the `duplication` axis.
- `DEAD-DEBUG-BRANCH` (utility, medium) — `if (DEBUG_MODE) { ... }` block inside `spin()` where `DEBUG_MODE` is a const initialized to `false` and never reassigned. The branch is statically unreachable. The `utility` axis flags symbols, not sub-symbol blocks.

**Likely cause:** Anatoly's atomic unit of analysis is the named symbol (function, class, exported constant). Many real-world defects sit below that level: a single line, a control-flow branch, a sub-expression.

**Proposed fix:** introduce sub-symbol findings. Several pieces are needed:

- **Schema:** allow findings to point at `(file, line_start, line_end)` without a symbol name.
- **Duplication RAG:** index "snippets" (configurable-size code chunks) in addition to named symbols, and compare both ways.
- **Control-flow analysis:** for the `utility` axis, run a lightweight const-folding pass to detect statically-unreachable branches.

**Estimated bench gain on slot-engine:** +2 TPs (DUP-WILD, DEAD-DEBUG-BRANCH), global +3–4 pp. On other fixtures with denser inline code or more dead branches, the gain would be larger.

**Effort:** 2–4 weeks. This touches the schema, the axes, the RAG, and the consolidation steps.

---

## Summary

| Priority | Items | Effort | Status | Cumulative bench gain |
|---|---|---|---|---|
| Shipped | Dup tier-1 invariant, per-axis triage, multi-defect findings, internal-docs injection | — | ✅ | v6 0% dup → 66.7% · v8 utility +19pp · v10 correction +7pp |
| Quick win | Industry-knowledge prompting (item 5a) | <1 day | open | v10 65.0% → ~66% global F1 |
| Medium (3–4) | DEAD ↛ skip duplication, OE class-hierarchy context | 1–3 days each | open | ~66% → ~72% |
| User-config | Domain invariants override (item 5c) | ~1 week | open | ~72% → ~75% |
| Hard (6) | Sub-symbol granularity (DUP-WILD inline, DEAD-DEBUG-BRANCH) | 2–4 weeks | open | ~75% → ~80%+ |

**Recommended order:**

1. **Item 5a** (industry-knowledge prompting) — minimal cost, plausibly catches BP-RNG. ~1h.
2. **Item 3** (don't suppress duplication on DEAD) — DUP-PAYOUT, ~1–3 days.
3. **Item 4** (OE class-hierarchy context) — OVER-STRATEGY, ~1–3 days.
4. **Item 5c** (user-provided invariants) — INV-WILD, INV-JACKPOT, ~1 week. Most valuable for domain-private conventions.
5. **Item 6** (sub-symbol granularity) — last because it's the most architecturally disruptive; gains are real but diminish vs the cheaper items above.

---

## Tracking

Update this file when:

- a roadmap item is implemented in Anatoly → move it to the **Shipped** section with the merge commit and the measured bench delta.
- a new persistent miss is added to the catalog of remaining misses (see [README.md](./README.md)).
- a new fixture surfaces a structural gap not covered above.

The bench's per-run baselines in [`baselines/`](./baselines/) are the source of truth for measuring deltas.
