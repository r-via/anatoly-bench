[← Back to report](../../public_report.md)

# ♻️ Utility

> Dead and low-value code detected via import/usage graph analysis.

- 📁 **Files with findings:** 5
- 🎯 **Actions:** 5

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (5 files — 5 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| USED | 8 | 57% |
| DEAD | 6 | 43% |

---

## 📖 Methodology

**Model:** sonnet

Detects dead or low-value code using a pre-computed import/usage graph.

### How it works

The static import graph is computed once for the whole codebase, then every exported symbol is matched to its direct importers, type-only importers, and transitive references. A symbol with zero importers is marked DEAD without ever calling the model; the rest are sent to the model with their full reverse-usage breakdown so it can spot live-but-pointless wrappers. No semantic search or documentation is involved, and low-confidence verdicts can be re-examined by the deliberation pass.

### Rating Criteria

- **USED**: The symbol is imported or referenced by at least one other file (exported) or used locally (non-exported).
- **DEAD**: The symbol is exported but imported by 0 files, or is a non-exported symbol with no local references. Likely safe to remove.
- **LOW_VALUE**: The symbol is used but provides negligible value (trivial wrapper, identity function, unnecessary indirection).

*Generated: 2026-10-25T11:32:15.538Z*
