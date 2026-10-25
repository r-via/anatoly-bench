[← Back to report](../../public_report.md)

# 📋 Duplication

> Code clones detected via RAG semantic vector search.

- 📁 **Files with findings:** 4
- 🎯 **Actions:** 4

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (4 files — 4 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 20 | 83% |
| DUPLICATE | 4 | 17% |

---

## 📖 Methodology

**Model:** sonnet

Identifies code clones via RAG semantic vector search against the codebase index.

### How it works

Every function is embedded and searched against the codebase index with a hybrid code-and-text vector search (60% code weight), keeping up to 8 candidates above a 0.70 similarity score. Trivial functions (two lines or fewer) and symbols with no candidate are marked UNIQUE without a model call. The remaining candidates, together with their signatures and call sites, are handed to the model so it can confirm whether the logic is genuinely a clone rather than a coincidental name match. Verdicts can be revisited by the deliberation pass.

### Rating Criteria

- **UNIQUE**: No semantically similar function found, or similarity score < 0.75.
- **DUPLICATE**: Similarity score >= 0.85 with matching logic/behavior. The duplicate target file and symbol are reported.

*Generated: 2026-10-25T12:41:31.949Z*
