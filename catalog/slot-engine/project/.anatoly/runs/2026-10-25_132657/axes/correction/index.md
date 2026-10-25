[← Back to report](../../public_report.md)

# 🐛 Correction

> Bugs, logic errors, incorrect types, and unsafe operations. Only real correctness issues — not style.

- 📁 **Files with findings:** 3
- 🎯 **Actions:** 5

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (3 files — 3 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| OK | 10 | 71% |
| NEEDS_FIX | 4 | 29% |

---

## 📖 Methodology

**Model:** sonnet

Finds bugs, logic errors, incorrect types, and unsafe operations. Only flags real correctness issues, not style.

### How it works

It runs in two passes. The first reads the full function body (not just signatures) together with its callers, the interfaces of the functions it imports, and any resolved reference docs, then flags suspected bugs. A second verification pass re-reads each flagged symbol in context and keeps a NEEDS_FIX or ERROR verdict only when confidence is at least 85, which suppresses speculative findings. Unresolved documentation conflicts are excluded so stale docs never drive a false bug. The deliberation pass can re-arbitrate the result.

### Rating Criteria

- **OK**: No bugs or correctness issues found.
- **NEEDS_FIX**: A real bug, logic error, or type mismatch that would cause incorrect behavior at runtime.
- **ERROR**: A critical bug that would cause a crash, data loss, or security breach.

*Generated: 2026-10-25T12:32:31.422Z*
