[← Back to report](../../public_report.md)

# ✅ Best Practices

> Language-specific best practices and code quality standards.

- 📁 **Files with findings:** 4
- 🎯 **Actions:** 0

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (4 files — 4 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Metric | Value |
|--------|-------|
| Average score | 4.4/10 |
| Min / Max | 2.0 / 9.0 |

---

## 📖 Methodology

**Model:** sonnet

File-level evaluation against language-specific TypeScript best-practice rules. Starts at 10/10, penalties subtracted per violation.

### How it works

The file is first classified by role (React component, API handler, utility, config, test, or general) and then scored against a fixed set of TypeScript rules covering naming, error handling, type safety, and code organisation. Each rule returns PASS, WARN, or FAIL at a CRITICAL, HIGH, or MEDIUM severity; penalties are subtracted from a starting 10/10, and failing rules come with concrete before/after fix suggestions. This is the only file-level axis, so its verdicts apply to the whole file rather than to individual symbols, and the deliberation pass can reclassify them.

### Rating Criteria

Files are scored on a 0–10 scale. A score below 7 triggers a NEEDS_REFACTOR verdict.
The score reflects adherence to language-specific conventions: naming, error handling, type safety, and code organisation.

*Generated: 2026-10-25T11:23:27.054Z*
