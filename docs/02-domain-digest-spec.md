# Spec: Domain Digest

> Status: **proposal**, surfaced by `anatoly-bench` after 9 runs on the `slot-engine` fixture, March 2026.
> Owner: TBD (Anatoly).
> Bench dependency: this is a spec for an **Anatoly** feature; `anatoly-bench` consumes the result via the same public artifact contract.

---

## 1. Goal

When Anatoly audits a project, every axis evaluator (`correction`, `best-practices`, `overengineering`, `duplication`) currently operates on the source code in isolation, with no visibility into the project's own description of what it is *supposed* to do. This produces two systematic failure modes observed across multiple bench runs:

1. **Domain-specific defects are missed** because nothing in the local code contradicts them. The slot-engine fixture's `(1+wc)·2^wc` wild-multiplier formula is mathematically self-consistent; the LLM has no reason to flag it without knowing the convention "wild substitutes, does not stack".
2. **The project's own README and `/docs/` already encode many of these conventions** but Anatoly only consumes them in the `documentation` axis (for coverage scoring) and in the dependency-verification pass (for resolving dep-related false positives). The business spec content is wasted.

**This feature closes the gap by extracting a compact, audit-time-injected "domain digest" from the project's existing documentation, and making it part of the prompt context for every business-logic axis.**

The digest is generated automatically by Anatoly at the start of each run, cached on hash, regenerable on demand, and overridable by the user when the auto-extraction misses or hallucinates.

## 2. Background

`anatoly-bench`'s slot-engine fixture has 7 cataloged correction defects. Across 9 runs, three are **systematically** missed:

| ID | Defect | Why it's missed today |
|---|---|---|
| `INV-WILD` | wild multiplier stacks `(1+wc)·2^wc` instead of `2^wc` | The convention "wild substitutes, does not stack" is a design choice. Not in the code, not in the README. |
| `INV-JACKPOT` | jackpot triggers on 4 diamonds anywhere instead of 5 on the middle row | Same — design convention, only knowable from a spec. |
| `BP-RNG` | `Math.random()` used as gaming RNG | Industry knowledge ("gaming RNG must be certifiable") that the LLM possesses but does not volunteer without prompting. |

`INV-RTP` is reliably caught because the JSDoc on `computePayout` says *"target ~95% RTP"* — the LLM sees that text and uses it as evidence. The fix is to provide the equivalent of that JSDoc-evidence, but at project level, to every axis.

The slot-engine `project/README.md` already says *"The engine targets a theoretical Return-to-Player of 95%"* — but this content never reaches the correction axis prompt today.

## 3. User-facing surface

### 3.1. New file artifacts

```
.anatoly/
├── cache/
│   └── domain/
│       ├── digest.md            # generated digest (markdown)
│       └── digest.hash          # source-input hash (for invalidation)
└── domain.md                    # OPTIONAL user override (precedence over generated digest)
```

- `.anatoly/cache/domain/digest.md` — fully generated, never edited by the user. Safe to delete (will regenerate). Committed or ignored at the user's discretion (recommended: gitignored, like other cache).
- `.anatoly/cache/domain/digest.hash` — a single SHA-256 hex string of the canonicalized source input set. Used to decide whether the cached digest is still valid.
- `.anatoly/domain.md` — optional user-provided override. When present, **takes precedence over the generated digest**. Manually written, version-controlled.

### 3.2. CLI flags

```bash
anatoly run                       # default: reuse if hash unchanged, else regenerate
anatoly run --reset-digest        # force regeneration even if hash matches
anatoly run --no-digest           # disable digest entirely (axes run with no domain context)
```

`--no-digest` is intended for debugging / bench A/B comparisons; not expected in normal use.

### 3.3. Configuration in `.anatoly.yml`

```yaml
domain_digest:
  enabled: true                   # default true
  model: google/gemini-2.5-flash  # default — cheap extraction model
  max_tokens: 600                 # cap for the generated digest (~2.4 KB)
  sources:                        # what to read from the project (defaults shown)
    - README.md
    - docs/**/*.md
    - package.json:description
    - package.json:keywords
  inject_into:                    # which axes receive the digest as context
    - correction
    - best_practices
    - overengineering
    # `duplication`, `utility`, `tests`, `documentation` are NOT injected by default
    # (low signal-to-noise for those axes)
```

Sensible defaults; users typically don't touch this section.

## 4. Pipeline integration

The new phase fits into Anatoly's pipeline immediately after `scan` and `estimate`, and before `triage`:

```
scan → estimate → DOMAIN-DIGEST → triage → rag-index → review (axes) → refinement → report → badge
```

It runs once per `anatoly run` invocation, regardless of the number of files audited. Subsequent axis evaluators receive the digest as additional context in their user message.

The phase is logged in `run-metrics.json` under `phaseDurations.domain-digest` and reported in the TUI like other phases.

## 5. Caching and invalidation

### 5.1. Hash input

The cache key is `SHA-256(source_blob)` where `source_blob` is the canonicalized concatenation of:

- The current text of every file listed in `domain_digest.sources` (resolved via glob), in lexicographic path order, each prefixed by its path
- The values of `package.json:description` and `package.json:keywords` (when listed in `sources`)
- The Anatoly version number and the digest prompt template hash (so prompt changes invalidate stale digests)
- The configured extraction model identifier
- The configured `max_tokens` budget

The hash is written to `.anatoly/cache/domain/digest.hash`. At run start, Anatoly recomputes the hash from current sources; if it matches the cached value AND `digest.md` exists, the cached digest is reused.

### 5.2. Cache miss triggers

A new digest is generated when:

- `--reset-digest` is passed
- `digest.hash` is missing or unreadable
- `digest.md` is missing or unreadable
- The recomputed hash differs from the cached one (any source changed)
- The Anatoly version or prompt template hash changes between runs

### 5.3. Override precedence

If `.anatoly/domain.md` exists, it is loaded instead of the generated digest. Cache logic is bypassed. Anatoly logs `[domain-digest] using user override (.anatoly/domain.md)`.

The override file is **not validated against any schema** — it is treated as opaque markdown and injected into axis prompts as-is. The only constraint is the size cap (`max_tokens`) — an override that exceeds the cap is truncated with a warning.

## 6. The extraction call

### 6.1. Model

Default: `google/gemini-2.5-flash` (cheap, structured-output-capable). Configurable via `domain_digest.model`. Expected cost: ~$0.001 per generation. Expected latency: 3–10 s.

### 6.2. Prompt

The extraction is a single-turn LLM call. The system prompt is the constant text shipped in `prompts/domain-digest.system.md` (sketch in Appendix A). The user message contains:

```
## Project metadata
- Name: <package.json:name>
- Description: <package.json:description>
- Keywords: <package.json:keywords joined by comma>

## Source documents

### `README.md`
<full text>

### `docs/<path>.md`
<full text>

(... repeated for every source file)
```

Sources are concatenated up to a hard input cap of 80 KB (~20 000 tokens). If the project's docs exceed the cap, files are included in priority order (README first, then `docs/` files sorted by path), and a warning is logged listing skipped files. This is unusual for normal projects.

### 6.3. Output schema

The LLM is asked to return JSON conforming to `DomainDigestSchema`:

```ts
const DomainDigestSchema = z.object({
  project_summary: z.string().min(20).max(400),
  business_invariants: z.array(z.object({
    statement: z.string().min(10),
    source: z.string(),                  // e.g. "README.md:42"
  })).max(20),
  numerical_claims: z.array(z.object({
    claim: z.string().min(5),
    source: z.string(),
  })).max(20),
  domain_conventions: z.array(z.object({
    quote: z.string().min(10),           // verbatim from source
    source: z.string(),
  })).max(20),
  non_goals: z.array(z.string()).max(10),
});
```

Schema is enforced; on parse failure, Anatoly retries once. Persistent failure → fail-soft (see §10).

The structured output is then rendered to a markdown file using a fixed template. The markdown form is what gets injected into axis prompts (markdown is what LLMs digest most cleanly). Both forms (JSON and markdown) are written to disk; bench tooling consumes either.

### 6.4. What MUST be extracted

- Numerical claims with concrete values ("RTP target 95%", "max 100 concurrent users", "P99 latency < 200 ms")
- "MUST", "SHOULD", "NEVER" rules
- Formulas or computational rules ("payout = lineBet × multiplier × wildBonus")
- Domain vocabulary glossary entries (when README has a "Glossary" or similar section)
- Non-goals when explicitly stated ("This library does NOT handle persistence")

### 6.5. What MUST NOT be extracted

- Installation instructions (`npm install`, etc.)
- License / copyright / contributing guidelines
- Badges, project status, social proof
- API reference (signatures, parameter lists) — already in code, axis already sees it
- Changelog / version history
- Marketing language without testable content

### 6.6. Citations are mandatory

Every extracted item must carry a `source: <file>:<line>` citation pointing to the verbatim location in the source documents. This makes the digest auditable: a downstream axis flagging a defect by reference to a digest entry can be traced back to the actual document line.

If the LLM cannot produce a citation, the entry is rejected at parse time.

## 7. Digest format (markdown)

The rendered markdown digest follows a fixed template:

```markdown
# Domain digest — <package.json:name>

> Auto-generated by Anatoly from README.md, docs/**/*.md, and package.json on <ISO-8601 timestamp>.
> Regenerate with `anatoly run --reset-digest` or by editing source documents.
> To override entirely, write `.anatoly/domain.md`.

## Project summary
<one paragraph, 20–400 chars>

## Business invariants
- <statement>  *[source: README.md:42]*
- <statement>  *[source: docs/payout-rules.md:15]*

## Numerical claims
- <claim>  *[source: README.md:78]*

## Domain conventions
> <verbatim quote>  *[source: docs/architecture.md:104]*

> <verbatim quote>  *[source: README.md:201]*

## Non-goals
- <statement>
```

Empty sections are omitted from the rendering. A digest with all sections empty is written as-is (a header and the `> Auto-generated` blockquote) — axes will simply receive a no-op context.

Hard size cap: `max_tokens` (default 600 tokens, ~2.4 KB). Items are truncated from the bottom (least important sections first: non-goals → domain conventions → numerical claims → invariants → summary).

## 8. Axis consumption

Axis evaluators that opt in (default: `correction`, `best_practices`, `overengineering`) receive the digest content as a top-level user-message section, immediately after the file content:

```
## File: `src/payouts.ts`
```typescript
<file content>
```

## Domain context (project-level)
<digest markdown rendered verbatim>

## Symbols to evaluate
- ...
```

The system prompt of each opted-in axis gains a small instruction:

> A "Domain context" section may appear in the user message. It contains business invariants, numerical targets, and conventions extracted from the project's own documentation. Treat them as authoritative ground truth when evaluating correctness or industry best practice. Cite which invariant or convention a finding violates when applicable.

Axes NOT in `inject_into` (default: `duplication`, `utility`, `tests`, `documentation`) ignore the digest entirely. The rationale:

- `duplication` decides on code-level similarity, domain knowledge rarely changes the verdict
- `utility` is a graph problem (importer count); domain doesn't help
- `tests` is about coverage of code, not of business invariants (separate axis would be needed for invariant-coverage)
- `documentation` is about documenting the code; the digest is *derived from* the documentation, would be circular

These can be added to `inject_into` by users with specific needs.

## 9. Acceptance criteria

The feature is considered complete when:

1. **Pipeline integration** — `domain-digest` appears as a phase in `run-metrics.json` with non-zero duration when active, and zero duration when `--no-digest` is passed.
2. **Cache works** — A second `anatoly run` on the same project (no source changes) skips regeneration and logs `[domain-digest] cache hit`. Modifying README or any `docs/*.md` triggers a cache miss.
3. **`--reset-digest`** forces regeneration even on cache hit.
4. **Override** — Creating `.anatoly/domain.md` causes Anatoly to bypass the cache and use the override; the log line is unambiguous.
5. **Bench impact on slot-engine** — the v9 baseline (global F1 61.0%) lifts by at least **+5 pp** on the next run after this feature lands. The breakdown should show:
   - `INV-ROUND` flips from miss to hit (the README's "RTP 95%" + "house edge 5%" combined with the prompt's "treat as ground truth" should make the LLM connect Math.ceil to a player-favoring rounding violation).
   - `BP-RNG` plausibly flips from miss to hit (digest captures the "gaming" / "casino" / "RTP" vocabulary, the prompt invites the LLM to apply industry rules; the LLM knows Math.random isn't certifiable).
   - `INV-WILD` and `INV-JACKPOT` remain misses (their conventions are not in the README — they require user override `.anatoly/domain.md`, which is item 5c, out of scope here).
6. **Audit trail** — every finding that references a digest entry includes the citation in its detail. (Optional but recommended.)
7. **Tests** — unit tests for: cache hit/miss decision, override precedence, schema rejection on missing citation, size truncation, fail-soft on LLM error.

## 10. Failure modes

| Failure | Behavior |
|---|---|
| README and docs absent | Digest = empty markdown header. Axes run with empty domain context. No error. |
| LLM call fails (network, rate limit, schema rejection ×2) | Log warning. Cache nothing. Axes run with empty domain context. No error. |
| Digest exceeds `max_tokens` | Truncate from bottom (lowest-priority section first). Log warning. |
| `.anatoly/domain.md` exists but exceeds `max_tokens` | Truncate, log warning, keep run going. |
| Source-file decode error | Skip that file, log warning, continue with the rest. |
| Hash file present but digest file missing | Treat as cache miss, regenerate. |
| `inject_into` lists an unknown axis | Log warning, ignore. |

The phase **never blocks** an audit run. A failed digest gracefully degrades to today's behavior (no domain context).

## 11. Telemetry / observability

Logged at `info` level (or `debug` for cache decisions):

```
[domain-digest] sources: README.md, docs/api.md, docs/glossary.md (3 files, 18.2 KB)
[domain-digest] hash: 7f8a... (cached: 7f8a...) — cache hit
[domain-digest] reused cached digest (2.1 KB, 480 tokens estimated)

# OR on cache miss:
[domain-digest] hash mismatch (expected 7f8a..., found b3c2...) — regenerating
[domain-digest] LLM call: gemini-2.5-flash, 18.2 KB input, 6.3 s, $0.0008
[domain-digest] generated digest with 4 invariants, 3 numerical claims, 5 conventions
[domain-digest] written to .anatoly/cache/domain/digest.md (1.9 KB)
```

`run-metrics.json` gains:

```json
{
  "phaseDurations": {
    "domain-digest": 6312
  },
  "domainDigestStats": {
    "cacheHit": false,
    "sourceBytes": 18234,
    "outputBytes": 1942,
    "outputTokensEstimated": 480,
    "invariantsCount": 4,
    "numericalClaimsCount": 3,
    "conventionsCount": 5,
    "costUsd": 0.0008,
    "durationMs": 6312
  }
}
```

## 12. Out of scope (deferred)

The following are NOT in this spec and may be addressed in follow-ups:

- **User-provided invariants in YAML** (`.anatoly/invariants.yml` with structured `[id, statement, applies_to_files]` entries) — that is the planned ROADMAP item 5c. The free-form `.anatoly/domain.md` override is the entry point; structured invariants come later if needed.
- **Per-axis digest variants** — extracting different digests for different axes ("correction-flavored" vs "best-practices-flavored"). Start with one shared digest; partition only if signal-to-noise is poor.
- **Multi-language extraction** — the prompt is currently English. Source documents in other languages are passed through; extraction quality depends on the model. No explicit i18n support.
- **Citation-driven verification** — automatic check that every digest entry's citation actually corresponds to a real line in the cited source. Useful as a guard against hallucinations, but adds complexity. Manual user inspection of `digest.md` is the v1 verification.
- **Diffing digest changes between runs** — surfacing "the digest changed since last run, here's what's new" to highlight prompt drift or doc-edit-driven recall changes. Nice-to-have, not v1.
- **Direct injection of `/specs/`, `/rfcs/`, ADR files** — would expand the source set significantly. Start with README + docs/ only.

## 13. Open questions

- **Do we cache on per-content-hash or per-mtime?** Spec says hash; mtime is faster but unreliable on `git checkout`. Hash is the right call but adds a few hundred ms per run on large doc trees.
- **Should the prompt-template hash be part of the cache key?** Spec says yes — protects against silent quality regressions when Anatoly itself is upgraded. Confirm.
- **Should the digest schema cap counts (`.max(20)`) be hard limits or soft hints?** Hard for v1; revisit if real projects produce richer specs.
- **Token-counting strategy** — do we use the model's own tokenizer or a heuristic (~4 chars/token)? Heuristic is simpler and Good Enough for the size cap; revisit if it bites.

---

## Appendix A — Extraction system prompt (sketch)

```text
You are a documentation analyst. Extract the SPECIFICATION content from the
provided project documentation. The output is consumed by a code-review agent
that audits the project's source code for correctness against this spec.

Your output must be JSON conforming to the schema below. Every entry must
include a citation pointing to the source location (file:line).

EXTRACT:
- Business invariants (rules the system MUST uphold)
- Numerical claims (concrete values: targets, limits, thresholds)
- Domain conventions (verbatim quotes that establish industry/project rules)
- Non-goals (explicit "this does NOT do X" statements)

DO NOT EXTRACT:
- Installation, build, or setup instructions
- License, copyright, or contributing guidelines
- Badges, status indicators, social links
- API reference (function signatures, parameter lists, return types)
- Changelog or version history
- Marketing language without testable content
- Anything you cannot cite verbatim to a source line

Cap each section at 20 entries. Prefer fewer high-quality entries over many
weak ones. If a claim is not in the source documents, do not include it —
even if it seems obviously true for the domain.

Output schema:
{
  "project_summary": "<one paragraph, what this project does>",
  "business_invariants": [
    { "statement": "...", "source": "README.md:42" }
  ],
  "numerical_claims": [
    { "claim": "...", "source": "README.md:78" }
  ],
  "domain_conventions": [
    { "quote": "<verbatim text>", "source": "docs/...md:NN" }
  ],
  "non_goals": ["..."]
}
```

## Appendix B — Example: slot-engine digest

Generated from `slot-engine/project/README.md` (the only doc the fixture ships):

```markdown
# Domain digest — slot-engine

> Auto-generated by Anatoly from README.md and package.json on 2026-04-28T09:00:00Z.

## Project summary
A 5-reel, 3-row slot machine engine in TypeScript. Pure game logic, no UI / persistence / networking.

## Business invariants
- The engine targets a theoretical Return-to-Player of 95%.  *[source: README.md:42]*
- Long-run player return approximates the bet-weighted house edge of 5%.  *[source: README.md:42]*

## Numerical claims
- RTP target = 95%.  *[source: README.md:42]*
- House edge = 5%.  *[source: README.md:42]*
- Bet range = 1..100 coins, integer.  *[source: README.md:25]*

## Domain conventions
> "The engine targets a theoretical Return-to-Player of 95%."  *[source: README.md:42]*
> "ten left-to-right paylines, applies wild multipliers, detects scatter bonuses (free spins) and the progressive jackpot"  *[source: README.md:20]*
```

When this digest is injected into the correction axis prompt during the audit of `engine.ts::computePayout`, the LLM sees:

1. The code: `total = total * (1 + HOUSE_EDGE)` followed by `Math.ceil(total)`
2. The JSDoc: "yields RTP ~95%"
3. The digest: "RTP target = 95%, house edge = 5%, deducted from player wins"

The combination makes Math.ceil flagrantly inconsistent (ceil rounds in player's favor; "house edge deducted from wins" implies floor for any house-favored math). The LLM has the evidence to flag INV-ROUND as a separate finding, with the digest citation as proof.
