[← Back to report](../../public_report.md)

# ♻️ Utility

> Dead or low-value code detected via a pre-computed import/usage graph across the codebase.

- 📁 **Files with findings:** 5
- 🎯 **Actions:** 6

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (5 files — 1 CRITICAL, 4 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| USED | 16 | 70% |
| DEAD | 6 | 26% |
| LOW_VALUE | 1 | 4% |

---

## 📖 Methodology

**Model:** haiku

Detects dead or low-value code using a pre-computed import/usage graph.

### Rating Criteria

- **USED**: The symbol is imported or referenced by at least one other file (exported) or used locally (non-exported).
- **DEAD**: The symbol is exported but imported by 0 files, or is a non-exported symbol with no local references. Likely safe to remove.
- **LOW_VALUE**: The symbol is used but provides negligible value (trivial wrapper, identity function, unnecessary indirection).

*Generated: 2026-05-14T08:52:40.157Z*
