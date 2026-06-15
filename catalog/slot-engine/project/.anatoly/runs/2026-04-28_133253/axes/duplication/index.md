[← Back to report](../../public_report.md)

# 📋 Duplication

> Code clones identified via RAG semantic vector search against the full codebase index.

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

**Model:** haiku

Identifies code clones via RAG semantic vector search against the codebase index.

### Rating Criteria

- **UNIQUE**: No semantically similar function found, or similarity score < 0.75.
- **DUPLICATE**: Similarity score >= 0.85 with matching logic/behavior. The duplicate target file and symbol are reported.

*Generated: 2026-04-28T11:42:59.355Z*
