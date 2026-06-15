# martian-pr-review

External benchmark integration: [withmartian/code-review-benchmark](https://github.com/withmartian/code-review-benchmark) offline track. Status: **proto-stage**, signal-estimation only — no scorer yet.

## Why this fixture is different

`slot-engine` is the canonical anatoly-bench fixture model: a self-contained generated project with a hand-curated YAML catalog of seeded defects, scored deterministically by bipartite matching on `(file, line ± tolerance, axis, verdict)`.

`martian-pr-review` does not fit that model:

| | slot-engine | martian-pr-review |
|---|---|---|
| Code under audit | one generated project | 50 PRs from 5 unrelated upstream repos (Sentry, Grafana, Cal.com, Discourse, Keycloak) |
| Scope of findings | project-wide | diff-scoped (only what the PR introduces) |
| Ground truth shape | YAML catalog, `(axis, file, line, verdict, weight)` | free-text `{comment, severity}` — **no file, no line** |
| Scorer | deterministic bipartite match | LLM-as-judge (semantic similarity on natural-language comments) |
| Languages | TypeScript | TypeScript / Python / Go / Java / Ruby |

This is why it lives in `catalog/` but cannot be scored by the existing `anatoly-bench score` CLI.

## What this directory contains today

- [`golden_comments/`](./golden_comments/) — mirrored from upstream [offline/golden_comments/*.json](https://github.com/withmartian/code-review-benchmark/tree/main/offline/golden_comments). 5 files, 10 PRs each, 50 PRs total.
- [`proto-analysis.md`](./proto-analysis.md) — paper analysis on 5 selected PRs (one per repo / per language). For each golden comment we classify (a) the Anatoly axis the defect would fall under and (b) the detectability tier (local pattern / cross-file / requires domain knowledge / sub-symbol granularity). Output: a ceiling estimate for "what fraction of golden comments could Anatoly plausibly catch if a `--diff` mode existed."

## What this directory will contain if the proto signal is positive

- An adapter that produces Anatoly findings in [Martian's expected output shape](https://github.com/withmartian/code-review-benchmark/blob/main/methodology/full.md) (`{file, line, description, severity}`), restricted to files touched by a PR.
- A `score.ts` track that wraps Martian's [step3_judge_comments.py](https://github.com/withmartian/code-review-benchmark/blob/main/offline/code_review_benchmark/step3_judge_comments.py) LLM-judge as the matcher for this fixture only — the slot-engine bipartite scorer is **not** reused here.
- Per-run baselines in `baselines/` namespaced to this fixture.

If the proto signal turns out negative (< 10% of golden comments structurally reachable by Anatoly even with a `--diff` mode), this directory stays as a recorded "we looked at it, here's why we didn't pursue it."

## Pending decision

Whether to invest in:

1. An Anatoly `--diff` mode (a roadmap item against [Anatoly itself](https://github.com/r-via/anatoly), not against this bench).
2. Mirroring Martian's LLM-judge pipeline as a second scorer track in anatoly-bench.

Both are gated on the proto-analysis result, summarized in [docs/03-martian-integration.md](../../docs/03-martian-integration.md).
