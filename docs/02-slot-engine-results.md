# slot-engine — bench results

Detailed progression of Anatoly scores on the `slot-engine` fixture (27 cataloged defects across 5 scored axes — correction:7, utility:7, duplication:4, overengineering:4, best-practices:5; tests and documentation intentionally excluded — the fixture ships no test suite or JSDoc by design).

Each run is a single execution of `anatoly run` against `catalog/slot-engine/project/`, scored via `anatoly-bench score`. Per-run JSON + Markdown baselines are in [`baselines/`](../baselines/).

## Global F1 progression

```mermaid
xychart-beta
    title "slot-engine — global F1 (%) per run"
    x-axis [v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22]
    y-axis "F1 (%)" 0 --> 100
    line [40.7, 43.2, 46.8, 43.5, 56.8, 65.5, 62.7, 61.0, 65.0, 57.8, 67.8, 63.8, 72.9, 64.2, 69.9, 65.5, 71.4, 69.7, 67.0, 66.2, 69.4]
```

The 9pp spread across v13 → v15 (63.8% → 72.9% → 64.2%) on a fixed code state defines the **run-to-run LLM noise floor**. Treat any single-run delta below this band as noise. v18 → v22 trace the epic 55 (doc-conflicts arbitration loop) landing — see [Epic 55 detail](#epic-55--doc-conflicts-arbitration-loop-v18--v22) below.

## Per-axis F1 progression

```mermaid
xychart-beta
    title "slot-engine — F1 per axis (%)"
    x-axis [v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22]
    y-axis "F1 (%)" 0 --> 100
    line "correction" [53.3, 61.5, 57.1, 54.5, 54.5, 61.5, 36.4, 46.2, 53.3, 44.4, 53.3, 42.9, 71.4, 50.0, 53.3, 47.1, 52.6, 53.3, 53.3, 50.0, 57.1]
    line "utility" [60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7, 85.7]
    line "duplication" [0.0, 0.0, 0.0, 0.0, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7, 66.7]
    line "overengineering" [40.0, 40.0, 66.7, 66.7, 66.7, 66.7, 75.0, 66.7, 75.0, 33.3, 66.7, 57.1, 57.1, 57.1, 66.7, 66.7, 75.0, 85.7, 85.7, 85.7, 75.0]
    line "best-practices" [50.0, 54.5, 50.0, 36.4, 36.4, 72.7, 50.0, 40.0, 44.4, 58.8, 66.7, 66.7, 83.3, 61.5, 76.9, 61.5, 76.9, 57.1, 43.5, 42.9, 62.5]
```

Five lines overlaid — Mermaid auto-assigns colors and shows the axis name as legend on each line. Crosswise patterns to note: **utility** is a step from 60% to 85.7% at v8 (per-axis triage fix). **duplication** is a step from 0 to 66.7% at v6 (tier-1 invariant fix), flat since. **correction** is the most volatile, peaking at v14 (71.4%) and dipping at v8 (36.4%), v17 (47.1%) — sensitive to prompt + context-rot defenses; v22 (57.1%) is the best post-context-rot-fix score. **overengineering** locked at 85.7% across v19–v21 (best-ever plateau, courtesy of epic 55 internal-doc pre-review timing) before regressing to 75% at v22 (variance). **best-practices** has the widest dynamic range (36.4% to 83.3%) — runs hot when industry-knowledge prompting triggers (v11+).

## Tabular baseline

Kept for data extraction / regression diffs. Bold marks historical peaks.

| Run | Date | Global F1 | correction | utility | duplication | overengineering | best-practices |
|-----|------|----------:|-----------:|--------:|------------:|----------------:|---------------:|
| v1* | 2026-04-24 | 27.7% | 53.3% | 60.0% | 0.0% | 0.0% | 40.0% |
| v2  | 2026-04-24 | 40.7% | 53.3% | 60.0% | 0.0% | 40.0% | 50.0% |
| v3  | 2026-04-24 | 43.2% | 61.5% | 60.0% | 0.0% | 40.0% | 54.5% |
| v4  | 2026-04-24 | 46.8% | 57.1% | 60.0% | 0.0% | 66.7% | 50.0% |
| v5  | 2026-04-24 | 43.5% | 54.5% | 60.0% | 0.0% | 66.7% | 36.4% |
| v6  | 2026-04-24 | 56.8% | 54.5% | 60.0% | **66.7%** | 66.7% | 36.4% |
| v7  | 2026-04-26 | 65.5% | 61.5% | 60.0% | 66.7% | 66.7% | **72.7%** |
| v7† | 2026-04-26 | 66.9% | 61.5% | 66.7% | 66.7% | 66.7% | 72.7% |
| v8  | 2026-04-27 | 62.7% | 36.4%‡ | **85.7%** | 66.7% | 75.0% | 50.0%‡ |
| v9  | 2026-04-27 | 61.0% | 46.2% | 85.7% | 66.7% | 66.7% | 40.0% |
| v10 | 2026-04-28 | 65.0% | 53.3% | 85.7% | 66.7% | 75.0% | 44.4% |
| v11 | 2026-04-28 | 57.8% | 44.4% | 85.7% | 66.7% | 33.3%§ | 58.8% |
| v12 | 2026-04-28 | 67.8% | 53.3% | 85.7% | 66.7% | 66.7% | 66.7% |
| v13 | 2026-05-06 | 63.8% | 42.9% | 85.7% | 66.7% | 57.1% | 66.7% |
| **v14**¶ | 2026-05-06 | **72.9%** | **71.4%** | 85.7% | 66.7% | 57.1% | **83.3%** |
| v15 | 2026-05-06 | 64.2% | 50.0% | 85.7% | 66.7% | 57.1% | 61.5% |
| **v16** | 2026-05-07 | **69.9%** | 53.3% | 85.7% | 66.7% | **66.7%** | 76.9% |
| v17  | 2026-05-12 | 65.5% | 47.1%◊ | 85.7% | 66.7% | 66.7% | 61.5% |
| v18  | 2026-05-12 | 71.4% | 52.6% | 85.7% | 66.7% | 75.0% | 76.9% |
| v19  | 2026-05-12 | 69.7%★ | 53.3% | 85.7% | 66.7% | **85.7%** | 57.1% |
| v20  | 2026-05-12 | 67.0% | 53.3% | 85.7% | 66.7% | 85.7% | 43.5% |
| v21  | 2026-05-12 | 66.2% | 50.0% | 85.7% | 66.7% | 85.7% | 42.9% |
| v22  | 2026-05-12 | 69.4% | **57.1%**☆ | 85.7% | 66.7% | 75.0% | 62.5% |

\* v1 used a different scoring scope (7 axes vs 5). Comparisons are meaningful from v2 onwards.
† v7 re-scored against the v8 catalog (DEAD-WILD-HELPER + DEAD-LINE-WIN added) for an apples-to-apples delta against v8.
‡ v8 lost three findings vs v7 to LLM variance (INV-WEIGHTS, INV-BETCAP on correction; BP-STRING-THROW on best-practices). The structural improvement is the **+19pp on utility** (DEAD-TYPE, DEAD-WILD-HELPER, DEAD-LINE-WIN all caught after the triage fix).
§ v11 saw an OE collapse where the LLM agglomerated three over-engineered patterns into a single finding on `engine.ts::spin` instead of flagging each at its source file. The next commit added an explicit "flag the source, not the consumer" rule to the correction, OE, and best-practices prompts; v12 restored OE to 66.7% with 100% precision.
¶ v14 is the historical best — same Anatoly state as v13/v15, but the LLM converged on INV-FREESPIN, INV-WEIGHTS, and BP-STRING-THROW that the sister runs missed. The 9pp spread across v13–v15 (63.8% → 72.9% → 64.2%) is pure run-to-run LLM variance on a fixed code state, which sets the noise floor for any single-run comparison.
◊ v17 ran on the epic-52/53/54 stabilization branch. The correction regression (-6pp vs v16) traces to the cross-project sharing rollback for code-derived caches: `renderReferenceDocsContext` now marks only human-authored documentation as authoritative, so the internal `.anatoly/docs/` (generated from code) no longer feeds correction as ground truth. This closes the context-rot loop at a measurable cost on this fixture. Global F1 stays inside the v13–v16 variance band (63.8–72.9%).

★ v19 first run with the doc-conflict-detector LLM call actually firing (Story 55.10). 4 substantive conflicts surfaced and persisted to `doc-conflicts.yaml` — first non-empty arbitration set ever produced on this fixture.

☆ v22 is the best correction score post-epic-54 (57.1%). The four arbitrations rendered by v20 are now wired correctly: `renderReferenceDocsContext` no longer suppresses arbitrated fragments when no human-authored reference is configured, and the prompt instructs axes to flag a contradiction with arbitrated intent as a regular correction bug (not as `doc_divergence`). INV-WILD / INV-JACKPOT remain irreducible without a more specific README (or a `verdict_note` UI in the arbitrate wizard).

## Anatoly fixes landed during the bench lifetime

- **v6 — duplication tier-1 invariant** ([r-via/anatoly@44f0617](https://github.com/r-via/anatoly/commit/44f0617)). Tier-1 refinement was overriding the LLM's `DUPLICATE` verdict whenever the underlying RAG embedding score stayed below 0.68, even when the LLM had committed to a concrete `duplicate_target`. The bench surfaced the bug; the fix landed; v6 measured the gain (duplication 0% → 66.7%).
- **v8 — per-axis triage policy** ([r-via/anatoly@b784caf](https://github.com/r-via/anatoly/commit/b784caf)). Triage's `skip` tier was binary: type-only / trivial / barrel-export files bypassed every axis with blanket safe defaults, including utility. Files like `src/types.ts` (an exported type alias never imported) silently classified as `USED`, and a 4-line `src/wild.ts` never saw the LLM at all. The fix splits triage decisions per-axis, consults the usage graph for utility on skipped files, and routes trivial files through `correction`/`duplication`/`utility` evaluators. utility 66.7% → 85.7%.
- **v9 — multi-defect findings per symbol** ([r-via/anatoly@75cdf08](https://github.com/r-via/anatoly/commit/75cdf08)). The correction axis used to return one record per symbol — symbols carrying several distinct defects collapsed into a single prose detail, leaving downstream consumers no way to count the second defect. Schema now supports an optional `findings` array per symbol; the shard renderer emits one row per finding.
- **v10 — internal-docs injection into business-logic axes**. Anatoly's existing `.anatoly/docs/` scaffolder produces high-quality, agent-curated business context that previously only fed the `documentation` axis. The fix injects it into `correction`, `best_practices`, and `overengineering` user messages, with a prompt rule instructing the model to treat documented invariants as authoritative ground truth. correction 46.2% → 53.3%; INV-ROUND now detected.
- **v11 — industry-knowledge prompting** ([r-via/anatoly@d0068a2](https://github.com/r-via/anatoly/commit/d0068a2)). The LLM had pretrained knowledge of industry-specific correctness rules (gaming RNG must be certifiable; monetary code must use exact arithmetic; deprecated cryptographic primitives) but did not volunteer it without prompting. Added a rule to the correction and best-practices system prompts inviting the model to apply such rules when it can confidently infer the project's domain, with a discipline clause requiring citation of both the inferred domain and the rule. best-practices recall hit 100% (5/5) for the first time; BP-RNG (`Math.random()` for gaming) detected.
- **v12 — anti-collapse rules + temperature pin** ([r-via/anatoly@d8fd931](https://github.com/r-via/anatoly/commit/d8fd931), [r-via/anatoly@ebb8505](https://github.com/r-via/anatoly/commit/ebb8505)). Two changes: (1) added a "flag the source of a defect, not its consumer" rule to the correction, overengineering, and best-practices prompts — the LLM was previously free to choose between flagging one consumer-side finding or N source-side findings, producing run-to-run-flapping verdicts. (2) Pinned `temperature: 0` in the Vercel SDK transport (Anthropic Claude Agent SDK and Gemini CLI do not expose temperature, so subscription-mode calls remain at the SDK default). overengineering 33.3% → 66.7% with 100% precision; global F1 jumped from 57.8% (v11) to 67.8% (v12).
- **v13 / v14 / v15 — variance triplet (no Anatoly change)**. Three back-to-back runs on the same code and same Anatoly state, scored on the new score-output metadata (commit/duration/cost/tokens surfaced via [r-via/anatoly-bench@e743a53](https://github.com/r-via/anatoly-bench/commit/e743a53)). The 9-point spread (63.8% / 72.9% / 64.2%) is the run-to-run LLM noise floor: same prompts, same code, different convergence on INV-FREESPIN, INV-WEIGHTS, BP-STRING-THROW from one run to the next. Treat any single-run delta below this band as noise.
- **v16 — local sidecar architectural cleanup + per-axis bench metrics** ([r-via/anatoly@f8e52e8](https://github.com/r-via/anatoly/commit/f8e52e8), [r-via/anatoly@a515eb2](https://github.com/r-via/anatoly/commit/a515eb2), [r-via/anatoly@c58fae8](https://github.com/r-via/anatoly/commit/c58fae8), [r-via/anatoly-bench@f892b0d](https://github.com/r-via/anatoly-bench/commit/f892b0d)). Three Anatoly fixes plus one bench feature: (1) unified the `local-advanced` config-facing name with the `anatoly-local` runtime registry entry — the v3 config path was forwarding the user's placeholder `base_url: http://localhost:8082/v1` into the connectivity probe and the SDK call, both of which were supposed to use the per-axis URLs (`:11437` code / `:11438` NLP) hardcoded in `KNOWN_EMBEDDING_PROVIDERS`. (2) Propagated input/output/cache tokens from the agentic SDK call through `Tier3 QueryResult → ShardResult → Tier3Result → RefinementResult → recordLlmCost`, so `phaseStats.refinement` now reports real token counts instead of zeros. (3) Skipped the GGUF connectivity probe at run start (saves a 30–120 s container swap that was reduplicating the warm-up the indexer would do anyway). On the bench side, `score` now surfaces per-axis Time / Cost / Output tokens columns next to F1 — see the v16 baseline below for the new layout. F1 settled at 69.9%, inside the v13–v15 variance band; the run is qualitatively similar to v12 with INV-WEIGHTS recovered and INV-FREESPIN lost (net-zero on correction, +10pp on best-practices vs v12 from a clean refinement pass).
- **v17 — epic 52/53/54 stabilization**. Big multi-epic landing: (1) **Epic 54** documentation overhaul — `documentation.reference.paths` + `documentation.internal.mode` become required (no-magic config), split between `renderReferenceDocsContext` (human-authored = authoritative) and `renderInternalDocsContext` (code-derived = non-authoritative weak context), `doc_divergence` findings emitted transversally by correction/best-practices/overengineering/tests when code contradicts reference, lite/full/off modes for internal-doc generation, 3-way coherence in full mode. (2) **Epic 52** path layout corrections — reviews/refinements/nlp-summaries rolled back from cross-project `shared/` to project-local `cache/` (multi-tenant safety: shared/ is for provider/lang/product-public content only — pricing sources, grammars, models). `pricing/normalized.json` moves to `cache/` (project-config-keyed). Auto-migration in `bootstrapAnatoly` for legacy state (`.anatoly/{docs,rag,calibration.json,deliberation-memory.json}` → canonical homes). Legacy `~/.anatoly/models/*.gguf` symlinked under `shared/models/gguf/` (zero-mv migration). Sandbox-aware bootstrap: no implicit `~/.anatoly/` creation. (3) **Epic 53** wired the ndjson events (`phase_start`/`phase_end`/`file_review_end`/`estimate_total`) that `anatoly attach` consumes for live rendering. (4) Fixed `--no-cache` to **bypass** cache in-memory instead of `clearCache()` mid-run (the old behavior wiped freshly-built tasks/RAG/progress.json, leaving review loop with zero files). Global F1 65.5% — within v13–v16 variance band but ~4pp under v16; correction takes the hit (47.1%) because internal-doc context is no longer authoritative for flagging bugs. Net design improvement, mild bench cost.

## Epic 55 — doc-conflicts arbitration loop (v18 → v22)

Epic 54 closed the context-rot loop at the cost of internal-doc no longer being authoritative for the business-logic axes (visible in v17). Epic 55 reopens a *human-validated* path back: detect contradictions between internal doc (machine-derived from code) and reference doc (human-authored), persist them for human arbitration, and on `doc-wins` verdict promote the reference statement to authoritative status for downstream axis prompts. Five bench runs trace the landing:

- **v18 — Story 55.1 → 55.9 landed (LLM detection deferred).** The full machinery in place — schema, persistence, wizard, axis hooks, estimate forecast — but `runDocConflictDetection` still returned `newConflicts: 0` via a placeholder pending Story 55.10. The detector phase ran for 2 min on Sonnet at $0.42 and emitted nothing. F1 71.4% (best post-v14): the gain over v17 comes from the `runDocUpdate` move to pre-review (Story 55.2) which lets the freshly-regenerated internal-doc fragments feed the axes within the same run, plus general stabilization (`anatoly run --no-cache` no longer destructive, deterministic temperature in axis runs). best-practices recovered to 76.9% (sister-run of v18 pattern), overengineering jumped to 75%.
- **v19 — Story 55.10 LLM detection live.** First run where the 3-way (CODE_SURFACE / INTERNAL_DOCS / REFERENCE_DOCS) prompt actually fired. Generated 4 substantive conflicts persisted to `doc-conflicts.yaml`, all at `verdict: pending`: `engine.ts::Bet` (≈ INV-BETCAP), `jackpot.ts::isJackpotHit` (≈ INV-JACKPOT), `paytable.ts::ANCIENT_RTP` (≈ DEAD-ANCIENT-RTP), `types.ts::SpinResult` (stylistic). Run took 27 min because the bench was cleaned (full `bootstrap-doc` regenerated 18 pages at $2 + coherence review at $2). F1 dropped to 69.7% (variance: best-practices fell back to 57.1% after the v18 outlier).
- **v20 — arbitrations applied, but injection broken.** All 4 conflicts arbitrated as `doc-wins` via the wizard between runs; v20 detector flipped them to `status: applied`. But `renderReferenceDocsContext` was returning `''` whenever `referenceDocs` was empty — and `ctx.referenceDocs` is *never populated* on this codebase (a Story 54 plumbing gap inherited from before epic 55). The arbitrated fragments loaded correctly into `ctx.arbitratedFragments`, the axes called the renderer with them, the renderer dropped them all on the floor. Correction misses unchanged (INV-JACKPOT / INV-WILD / INV-WEIGHTS still in red). F1 67.0%.
- **v21 — injection fixed, prompt instruction wrong.** [r-via/anatoly@8833bd6](https://github.com/r-via/anatoly/commit/8833bd6) decouples the three independent authoritative sources (human-authored ref docs, lite-mode digest, arbitrated fragments) so each renders independently. v21 prompts now show the `### ARBITRATED INTENTS` section. The agent on `jackpot.ts` saw the contradiction and emitted a `doc_divergence` finding — exactly as the (stale) prompt instructed. But `doc_divergence` findings route under axis `documentation` (Story 54.9), and anatoly-bench's INV-JACKPOT catalog entry expects a `correction` finding. Net zero on misses. F1 66.2%.
- **v22 — prompt clarified, loop closed.** [r-via/anatoly@2834cba](https://github.com/r-via/anatoly/commit/2834cba) updates the arbitrated-intents instruction to: *"these are the agreed-upon contract — if the code contradicts one of these, that is a regular correctness bug, emit it as a normal correction finding, not as `doc_divergence`"*. Correction climbs to 57.1% — best post-context-rot-fix score. F1 69.4%. **INV-WILD and INV-JACKPOT still missed**: the architecture works, but the arbitrated text is whatever the README literally says, and the slot-engine README mentions jackpot generically (*"detects scatter bonuses and the progressive jackpot"*) without specifying the catalog invariant (`= 5 DIAMOND on middle row`). The arbitration loop cannot create precision the human did not type. Two paths forward to catch them: enrich the README, or add a `verdict_note` step in the wizard that lets the human attach a specific invariant during arbitration.

## Per-axis execution profile (v22 — 9m 35s wall · $4.88 API)

| Axis | F1 | Time | Cost | Out tokens |
|------|---:|-----:|-----:|-----------:|
| correction | 57.1% | 12m 24s | $1.46 | 49K |
| utility | 85.7% | 44s | $0.04 | 6K |
| duplication | 66.7% | 1m 25s | $0.07 | 11K |
| overengineering | 75.0% | 3m 18s | $0.49 | 11K |
| best-practices | 62.5% | 20m 44s | $2.18 | 78K |
| tests (unscored) | — | 1m 5s | $0.18 | 3K |
| documentation (unscored) | — | 1m 8s | $0.19 | 3K |

Wall time is shorter than the sum of axis times because axes run in parallel across files (concurrency 8). best-practices dominates the spend on this run — almost half the API cost — and is the slowest axis end-to-end (over 20 min of cumulative axis time across all files). The doc-conflict-detection phase added a flat ~75 s / $0.10 on top (single Sonnet call, irrespective of file count).

## Remaining misses (v22 — same catalog as v17)

Eight defects from the catalog that Anatoly does not yet detect on this fixture:

| Axis | ID | Difficulty | Defect |
|------|----|----|--------|
| correction | INV-WEIGHTS | medium | `DEFAULT_WEIGHTS` has DIAMOND weight 30 instead of ~3 (10× too generous) — variance-sensitive: caught v6/v7/v14/v15/v16/v17/v18, missed v19+ |
| correction | INV-WILD | hard | wild multiplier stacks `(1+wc)·2^wc` instead of `2^wc` (wild.ts) — README too vague on wild semantics for arbitration loop to derive the formula |
| correction | INV-JACKPOT | medium | jackpot triggers on 4 diamonds anywhere instead of 5 on middle row — arbitration loop detected the divergence (v19), user arbitrated `doc-wins` (v20), but the README text "detects scatter bonuses and the progressive jackpot" lacks the count/position invariant. Catch requires either README enrichment or wizard `verdict_note` step. |
| utility | DEAD-DEBUG-BRANCH | medium | `if (DEBUG_MODE)` branch with `DEBUG_MODE = false` const — statically unreachable |
| duplication | DUP-PAYOUT | medium | `legacy.ts::computeLegacyPayout` duplicates `engine.ts::computePayout` — duplication axis never runs on legacy.ts (`fileHasSimilarityCandidates` short-circuits before the LLM can vote) |
| duplication | DUP-WILD | hard | wild multiplier formula duplicated inline in `engine.ts::evaluateLine` vs the helper in `wild.ts::applyWildBonus` (sub-symbol granularity) |
| overengineering | OVER-STRATEGY | medium | `SpinStrategy` abstraction for a single used implementation (needs class-hierarchy + use-site cross-reference) |
| best-practices | BP-STRING-THROW | trivial | `throw "string"` instead of `throw new Error(...)` — variance-sensitive |

These cluster around five themes:

- **Project-private design conventions** (INV-WILD, INV-JACKPOT, INV-WEIGHTS) — not in the README precisely enough for the arbitration loop to crystallize. INV-JACKPOT is now in the arbitrated set (`doc-wins, applied`) but the arbitrated text inherited from the vague README does not state the specific invariant. Next step: extend `anatoly docs arbitrate` to let the human attach a `verdict_note` with the precise invariant, then inject that note alongside the reference excerpt.
- **Sub-symbol granularity** (DUP-WILD inline, DEAD-DEBUG-BRANCH branch-level) — defects that sit below the named-symbol level (ROADMAP item 6).
- **Upstream duplication-axis short-circuit** (DUP-PAYOUT) — when `fileHasSimilarityCandidates` returns false on a file, the LLM never votes on duplication for any of its symbols. Distinct from item 3 (which fixed the tier2 silencing of an existing DUPLICATE verdict on DEAD code) — this is gating *whether* the verdict gets emitted in the first place.
- **Hierarchy + usage cross-reference** (OVER-STRATEGY) — overengineering needs to count concrete subclasses + their use sites (ROADMAP item 4). OVER-FACTORY now caught reliably v19+ (overengineering at 85.7% plateau).

A prioritized roadmap of the Anatoly evolutions needed to close these gaps lives in [../ROADMAP.md](../ROADMAP.md). The original 3-run feedback report (more historical context) is in [01-feedback-anatoly.md](./01-feedback-anatoly.md).
