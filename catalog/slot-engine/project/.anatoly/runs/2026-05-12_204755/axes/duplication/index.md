[← Back to report](../../public_report.md)

# 📋 Duplication

> Code clones identified via RAG semantic vector search against the full codebase index.

- 📁 **Files with findings:** 3
- 🎯 **Actions:** 3

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (3 files — 3 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| UNIQUE | 17 | 85% |
| DUPLICATE | 3 | 15% |

---

## 📖 Methodology

**Model:** haiku

Identifies code clones via RAG semantic vector search against the codebase index.

### Rating Criteria

- **UNIQUE**: No semantically similar function found, or similarity score < 0.75.
- **DUPLICATE**: Similarity score >= 0.85 with matching logic/behavior. The duplicate target file and symbol are reported.

*Generated: 2026-05-12T19:15:06.249Z*
