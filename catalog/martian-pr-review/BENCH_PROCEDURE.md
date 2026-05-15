# Bench procedure — martian-pr-review

> **Status: BLOCKED.** This fixture cannot be benched today. It is gated on an
> Anatoly `--diff` epic that does not exist yet. This file is a placeholder
> that records *why* and *what the procedure will be* once unblocked.

## Why it cannot be benched yet

`martian-pr-review` does not fit the slot-engine procedure:

- **No SPEC.md, no bipartite scorer.** Ground truth is upstream free-text
  `{comment, severity}` (see [golden_comments/](./golden_comments/)), with no
  file/line anchors. The deterministic `(file, line, axis, verdict)` matcher
  used by slot-engine does not apply.
- **Scoring will use Martian's LLM-judge** ([step3_judge_comments.py](https://github.com/withmartian/code-review-benchmark/blob/main/offline/code_review_benchmark/step3_judge_comments.py)),
  ported as a dedicated track in anatoly-bench — not `node dist/cli.js score`.
- **Anatoly audits whole projects, not diffs.** The Martian format scores
  PR-scoped review comments. Running Anatoly in project-audit mode would
  produce a misleadingly low score (most findings fall outside the PR scope →
  false positives by Martian's framework).

Full rationale and the proto-analysis that established the structural ceiling
(75% today / 90% post-roadmap): [docs/03-martian-integration.md](../../docs/03-martian-integration.md)
and [proto-analysis.md](./proto-analysis.md).

## Unblock prerequisite: Anatoly `--diff` mode

An epic against [r-via/anatoly](https://github.com/r-via/anatoly), not against
this bench. The mode must:

- consume `(base ref, head ref)` instead of a working dir
- restrict findings to PR scope (touched files + symbols whose signature or
  call-sites change in the diff)
- emit Martian's output shape: `{file, line, description, severity}`

Estimated effort: 1-2 weeks. Until it ships, nothing below is actionable.

## Procedure once unblocked (draft)

Shared infra (VM/SSH/GPU, `make update`, run launch/monitor, copy-back) is
identical to every fixture → [docs/04-bench-procedure.md](../../docs/04-bench-procedure.md).
The martian-specific deltas will be:

1. **Input prep**: for each of the 50 PRs, fetch `(base ref, head ref)` from
   the upstream repo (Sentry/Grafana/Cal.com/Discourse/Keycloak).
2. **Run**: `anatoly run --diff <base>..<head>` (flag TBD by the epic),
   producing PR-scoped findings.
3. **Adapter**: translate Anatoly findings → Martian comment shape.
4. **Score**: run the ported Martian LLM-judge track against
   `golden_comments/<repo>.json`.
5. **Baseline**: write `baselines/${DATE}_martian-${VERSION}.{json,md}` (note
   the `martian-` namespace, distinct from `slot-engine-`).

## TODO (mirrors the sequenced plan in docs/03 §5)

- [ ] Open the `--diff` epic in r-via/anatoly (references docs/03 + proto-analysis)
- [ ] Expand proto-analysis 5 → 15-20 PRs (does not depend on `--diff`; can start now)
- [ ] Contact Martian re: their shared evaluation harness
- [ ] (post-`--diff`) Port step3_judge_comments.py as a dedicated scorer track
- [ ] (post-`--diff`) First real-execution baseline under `baselines/martian-*`
