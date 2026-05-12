[← Back to report](../../public_report.md)

# 📋 Duplication

> Code clones identified via RAG semantic vector search against the full codebase index.

- 📁 **Files with findings:** 3
- 🎯 **Actions:** 3

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (3 files — 1 CRITICAL, 2 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 20 | 87% |
| DUPLICATE | 3 | 13% |

---

## 📖 Methodology

**Model:** haiku

Identifies code clones via RAG semantic vector search against the codebase index.

### Rating Criteria

- **UNIQUE**: No semantically similar function found, or similarity score < 0.75.
- **DUPLICATE**: Similarity score >= 0.85 with matching logic/behavior. The duplicate target file and symbol are reported.

*Generated: 2026-05-12T19:59:35.313Z*
