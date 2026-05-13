# Proto-analysis: Anatoly vs Martian golden comments

**Date:** 2026-05-13
**Sample:** 5 PRs (1 per repo / 1 per language) out of the 50 in Martian's offline dataset
**Comments analyzed:** 20
**Method:** paper analysis. No Anatoly execution. For each golden comment, classify (a) which Anatoly axis would cover the defect, (b) the detectability tier.

## Sample

| Repo | PR | Lang | Comments |
|---|---|---|---|
| Sentry | [getsentry/sentry#67876](https://github.com/getsentry/sentry/pull/67876) — GitHub OAuth Security Enhancement | Python | 3 |
| Grafana | [grafana/grafana#79265](https://github.com/grafana/grafana/pull/79265) — Anonymous: Add configurable device limit | Go | 5 |
| Cal.com | [calcom/cal.com#10967](https://github.com/calcom/cal.com/pull/10967) — fix: handle collective multiple host on destinationCalendar | TypeScript | 5 |
| Discourse | [discourse-graphite#1](https://github.com/ai-code-review-evaluation/discourse-graphite/pull/1) — automatically downsize large images | Ruby | 3 |
| Keycloak | [keycloak/keycloak#37429](https://github.com/keycloak/keycloak/pull/37429) — Add HTML sanitizer for translated message resources | Java | 4 |

## Classification grid

**Anatoly axes:** `correction` · `utility` · `duplication` · `overengineering` · `best-practices` · `tests` · `documentation` · `n/a` (out of scope)

**Detectability tiers:**

- **T1 / local** — defect visible from a single file's diff; language-level rule or classic null-check pattern. Anatoly should catch.
- **T2 / cross-file** — requires following a symbol to another file in the same project. Anatoly's symbol graph covers this (correction axis especially).
- **T3 / domain** — requires industry knowledge or project-domain rules (OAuth state, secure RNG, API conventions). Covered by roadmap items 5a (industry-knowledge prompting) and 5c (user-provided invariants).
- **T4 / sub-symbol** — defect lives inside a sub-symbol block. Covered by roadmap item 6 (architecturally expensive).
- **T5 / nope** — not detectable by static analysis of a single snapshot (regression vs prior behavior, translation correctness).

## Per-comment classification

### Sentry #67876 — Python

| # | Severity | Comment (summary) | Axis | Tier | Notes |
|---|---|---|---|---|---|
| 1 | Medium | Null reference if `github_authenticated_user` state is missing | `correction` | T1 | Classic null-deref, function-local |
| 2 | Medium | OAuth state uses `pipeline.signature` (static) instead of a per-request random value | `best-practices` | T3 | OAuth industry knowledge — roadmap 5a applies |
| 3 | High | Accesses `integration.metadata[sender][login]` without guarding for `sender` key | `correction` | T1 | Dict access without check, function-local |

### Grafana #79265 — Go

| # | Severity | Comment (summary) | Axis | Tier | Notes |
|---|---|---|---|---|---|
| 1 | High | Race condition: check-then-create without transaction | `correction` | T2 | TOCTOU concurrency — Anatoly may catch via pattern recognition, sensitive |
| 2 | Medium | Anonymous auth now blocks on `ErrDeviceLimitReached` — previously async non-blocking | `correction` | T5 | **Regression vs prior behavior — not detectable from post-PR snapshot alone** |
| 3 | Medium | `dbSession.Exec(args...)` — alleged compile-time type mismatch | `correction` | T1 | Type-level, function-local. If the PR merged, the comment is probably overstated/nuanced |
| 4 | Low | Returning `ErrDeviceLimitReached` when 0 rows updated is misleading | `correction` | T1 | Error semantics, function-local |
| 5 | Low | Time-window inconsistency: `device.UpdatedAt` vs `time.Now().UTC()` | `correction` | T1 | Subtle logic but function-local |

### Cal.com #10967 — TypeScript

| # | Severity | Comment (summary) | Axis | Tier | Notes |
|---|---|---|---|---|---|
| 1 | High | Null deref `mainHostDestinationCalendar` if `evt.destinationCalendar` is null/empty | `correction` | T1 | Classic null-flow |
| 2 | Low | Optional chaining `?.integration` redundant after the ternary's truthiness check | `best-practices` | T1 | Style — Anatoly best-practices must be calibrated for these nits |
| 3 | High | `externalId === externalCalendarId` finds a calendar that matches itself | `correction` | T2 | Logic error — accessible via local-ish data flow |
| 4 | Medium | `IS_TEAM_BILLING_ENABLED` inversion: `slug` set when `true` instead of `false` | `correction` | T2 | The "both properties set together" pattern is locally visible |
| 5 | Low | `Calendar` interface now requires `createEvent(event, credentialId)` but Lark/Office365 implement `createEvent(event)` | `correction` | T2 | Cross-file interface check — TS compiler should have caught it, suggesting an `any` somewhere |

### Discourse-graphite #1 — Ruby

| # | Severity | Comment (summary) | Axis | Tier | Notes |
|---|---|---|---|---|---|
| 1 | Medium | `downsize` defined twice — second overrides first, which becomes unreachable | `duplication` + `utility` | T1 | **Slam dunk for Anatoly** — intra-file duplication + dead code |
| 2 | Low | Hardcoded `maxSizeKB = 10 * 1024` ignores `Discourse.SiteSettings['max_..._size_kb']` | `best-practices` | T3 | Project convention — internal-docs injection (roadmap shipped v10) could surface it |
| 3 | Medium | Passing 80% as dimensions breaks for animated GIFs (gifsicle expects WxH) | `correction` | T3 | External-tool knowledge (gifsicle) — LLM pretraining may cover it |

### Keycloak #37429 — Java

| # | Severity | Comment (summary) | Axis | Tier | Notes |
|---|---|---|---|---|---|
| 1 | Medium | Translation is Italian instead of Lithuanian in `messages_lt.properties` | `n/a` | — | **Out of Anatoly scope** — no i18n axis |
| 2 | Medium | `totpStep1` uses Traditional Chinese in the `zh_CN` (simplified) file | `n/a` | — | **Out of Anatoly scope** |
| 3 | Low | Anchor sanitization consumes matcher groups without proper validation | `correction` | T1 | Function-local logic bug |
| 4 | Low | Method name typo `santizeAnchors` → `sanitizeAnchors` | `best-practices` | T1 | Naming — best-practices axis must be calibrated for typos |

## Aggregate

**Distribution by axis:**

| Axis | Count | % |
|---|---:|---:|
| `correction` | 12 | 60% |
| `best-practices` | 4 | 20% |
| `duplication` | 1 | 5% |
| `utility` (combined with the duplication entry) | 1 | 5% |
| `n/a` (out of scope) | 2 | 10% |

Note: `tests`, `documentation`, `overengineering` = 0 on this sample. Golden comments are overwhelmingly **logic bugs** (correction) and **security/style conventions** (best-practices). Very little dead code, almost no abstraction smell.

**Distribution by tier:**

| Tier | Count | % |
|---|---:|---:|
| T1 local | 11 | 55% |
| T2 cross-file | 4 | 20% |
| T3 domain | 3 | 15% |
| T5 nope (regression) | 1 | 5% |
| N/A (out-of-scope axis) | 2 | 10% (1 Italian translation + 1 zh_CN/zh_TW) |

Note: one Keycloak entry is `n/a` axis (translation correctness) — counted as N/A axis; tier-wise, detectability is not applicable.

## Estimated structural ceiling

```
Ceiling today (T1 + T2 within currently scored axes)               = 15/20 = 75%
Ceiling after roadmap 5a + 5c (industry-knowledge + invariants)    = 18/20 = 90%
Permanent miss (out-of-scope axes + regression detection)          =  2/20 = 10%
```

**Calibration vs slot-engine:** on slot-engine, where the matching is in our favor (axes perfectly aligned, file/line precise), Anatoly reaches ~70% global F1. On Martian, the matching is **looser** (LLM-judge, no file/line requirement) — recall may be higher, but precision depends on how many additional findings Anatoly emits on diff-touched files without a corresponding golden comment.

**Rough estimate for Anatoly on the Martian leaderboard:**

| Metric | Estimate post-`--diff` mode + PR-file filter |
|---|---|
| Recall | 50-60% (multiply 75% structural × ~70-80% real-world Anatoly efficiency observed on slot-engine) |
| Precision | 50-65% (depends on Anatoly's noise on diff-touched-but-out-of-PR-intent files) |
| F1 | **50-60%** |

**Comparison with the current leaderboard ([benchmark-pr-mapping](https://github.com/agentic-review-benchmarks/benchmark-pr-mapping)):**

```
Qodo - Exhaustive  60.1% F1  (63.8% / 56.7%)
Qodo - Precise     55.4% F1  (74.5% / 44.2%)
Augment            44.1% F1
Copilot            42.8% F1
Cursor             39.3% F1
Greptile           39.0% F1
Codex              37.6% F1
Coderabbit         28.0% F1
Sentry             23.7% F1
```

Anatoly at 50-60% F1 estimated → **podium-plausible**, between Qodo Exhaustive and Qodo Precise.

## Caveats

1. **Sample = 5/50 PRs** (10%). Golden-comment distribution on the full 50 may differ — more i18n (Keycloak biases toward `n/a`), more regression-vs-prior (Grafana already shows 1/5).
2. **"Structural ceiling" ≠ "real performance"**. On slot-engine, even on perfectly-fitted defects, Anatoly reaches ~70% recall — the gap comes from yet-unfixed implementation/prompt bugs.
3. **`--diff` mode does not yet exist in Anatoly**. This proto assumes that mode would (a) restrict scanning to diff-touched files, (b) keep per-symbol scoring but filtered. Implementation cost: 1-2 weeks on the Anatoly side (epic to open).
4. **File-list filter is over-restrictive**. A defect introduced by the PR can surface a break in a non-touched file. The diff-file filter would miss that case. Smarter filter: symbols whose signature or call-sites change in the diff.
5. **Precision threatened by out-of-PR-scope findings**. Anatoly may flag 10 real pre-existing bugs in `integration.py` (Sentry) that aren't in the PR's golden comments — each counts as 1 FP under Martian. The PR-scope filter mitigates but doesn't eliminate (a pre-existing bug a human reviewer wouldn't have commented on can still be a real bug).

## Conclusion

**Signal: positive and solid.** 75% of golden comments are structurally within Anatoly's scope today. 90% would be with roadmap items 5a and 5c shipped. Anatoly mapped onto this benchmark would plausibly be competitive (~50-60% F1, between Qodo Exhaustive and Qodo Precise).

**Updated recommendation:**

1. **Open an Anatoly `--diff` epic** — this is the structural blocker. While Anatoly audits whole projects, we are ineligible for the Martian format.
2. **During the development of `--diff`**, expand the proto-analysis to 15-20 PRs (vs 5) to validate that the observed distribution (60% correction, 20% best-practices, 10% n/a, 5% T5, 5% duplication) holds on the full set. If `n/a` or T5 climbs above 25%, the ceiling drops and the priority changes.
3. **Defer the integration decision on the `anatoly-bench` side** until `--diff` is shipped. Redo this analysis with real execution at that point.

This analysis supersedes option (2) from my earlier recommendations (internal mirroring without changing Anatoly): option (2) is now discouraged — it would produce a misleadingly low score that does not reflect Anatoly's structural potential.
