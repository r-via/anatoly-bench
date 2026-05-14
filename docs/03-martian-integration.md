# Martian code-review-benchmark integration — rationale and state

**Date:** 2026-05-13
**Status:** proto-analysis delivered. Decision: wait for an Anatoly `--diff` mode before industrializing.
**Associated fixture:** [catalog/martian-pr-review/](../catalog/martian-pr-review/)

---

## 1. Why this fixture exists

[withmartian/code-review-benchmark](https://github.com/withmartian/code-review-benchmark) is becoming the de-facto benchmark for AI PR-review tools. 9 tools already tracked (CodeRabbit, Cursor, Copilot, Qodo, Greptile, Codex, Augment, Sentry), [public methodology](https://github.com/withmartian/code-review-benchmark/blob/main/methodology/summary.md), 50 PRs offline + an online track using behavioral signals on OSS repos. Qodo publicly leverages it [as evidence of their #1 ranking](https://www.qodo.ai/blog/qodo-ranked-1-ai-code-review-tool-in-martians-code-review-benchmark/).

The methodology doc explicitly invites tool builders to engage on their "shared evaluation harness": inputs `(diff, file context, repo context, config files)`, outputs `(comments with file, line, description, severity)`. That's an open door Anatoly should walk through before the interface ossifies (their stage-3 goal is to become a SWE-Bench-style standard).

## 2. The paradigm gap

| | anatoly-bench / slot-engine | martian-pr-review |
|---|---|---|
| Scope | full project | PR diff |
| Ground truth | YAML `(axis, file, line, verdict, weight)` | free-text `{comment, severity}` |
| Scorer | deterministic bipartite match | LLM-as-judge (semantic) |
| Languages | TS | TS, Python, Go, Java, Ruby |

Consequence: the existing anatoly-bench scorer does not apply as-is. Either we annotate file/line manually on 580 comments (expensive), or we integrate Martian's LLM-judge as a dedicated track, or we apply directly to their benchmark.

## 3. Current state — 5-PR proto-analysis

Full details: [catalog/martian-pr-review/proto-analysis.md](../catalog/martian-pr-review/proto-analysis.md).

20 golden comments classified (Anatoly axis fit + detectability tier) across 5 PRs, one per language. Result:

- **Structural ceiling today: 75%** (15/20 comments fall within Anatoly's currently scored axes, at detectability tier T1+T2 = local or cross-file).
- **Ceiling after roadmap items 5a + 5c shipped: 90%** (tier-T3 domain-knowledge defects unlocked by industry-knowledge prompting and user-provided invariants).
- **Permanent miss: 10%** (axis `n/a`: i18n translation correctness; tier T5: regression-vs-prior-behavior, undetectable from a single post-PR snapshot).

Observed comment distribution: **60% `correction`**, **20% `best-practices`**, 5% duplication, 0% utility/overengineering/tests/documentation, 15% out-of-scope. This is exactly Anatoly's most mature axis (`correction` is the most stable on slot-engine).

**Rough estimate for Anatoly post-`--diff` mode: 50-60% F1.** Comparison with the [agentic-review-benchmarks leaderboard](https://github.com/agentic-review-benchmarks/benchmark-pr-mapping): Qodo Exhaustive 60.1%, Qodo Precise 55.4%, Augment 44.1%, Copilot 42.8%, the rest below 40%. Podium-credible.

## 4. Single blocker: Anatoly `--diff` mode

Anatoly today audits full working trees. To be eligible for the Martian format, it needs a mode that:

- consumes `(base ref, head ref)` instead of a working dir
- restricts findings to PR scope (touched files + symbols whose signature or call-sites change)
- emits in Martian's format: `{file, line, description, severity}` rather than the current sharded markdown

Estimated effort on the Anatoly side: 1-2 weeks. This is an **Anatoly epic**, not a bench epic.

## 5. Decision

**Do not mirror Martian's pipeline internally before the Anatoly `--diff` epic ships.** Without that mode, Anatoly running in project-audit mode would produce a misleadingly low score (most findings would fall outside the PR scope → FPs by Martian's framework) that does not reflect its structural potential of 75%+.

**Sequenced plan:**

1. **Open the `--diff` epic in Anatoly** ([r-via/anatoly](https://github.com/r-via/anatoly)). Reference this doc and the proto-analysis.
2. **During implementation**, expand the proto-analysis from 5 to 15-20 PRs to validate that the distribution (60% correction, 20% best-practices, 10% n/a, 5% T5) holds on a larger sample. If `n/a` or T5 climbs above 25%, the ceiling drops and the priority changes.
3. **Contact Martian** to confirm their "shared evaluation harness" and participate in its definition while it is still malleable.
4. **Once `--diff` ships:** redo the analysis with real execution, port Martian's scorer (step3_judge_comments.py) as a dedicated track in anatoly-bench, publish the first baselines under `baselines/martian-*`.

---

## Decision log

- **2026-05-13** — 5-PR proto-analysis delivered. Recommendation: wait for `--diff` on Anatoly's side before industrializing. Fixture stub created at [catalog/martian-pr-review/](../catalog/martian-pr-review/).
