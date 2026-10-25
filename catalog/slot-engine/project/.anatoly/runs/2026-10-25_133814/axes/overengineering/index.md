[← Back to report](../../public_report.md)

# 🏗️ Overengineering

> Unnecessary complexity, premature abstractions, and over-engineering.

- 📁 **Files with findings:** 3
- 🎯 **Actions:** 3

## 📦 Shards

Findings are split into shards of up to 10 files each to keep pages readable and avoid GitHub rendering limits.

- [ ] [shard.1.md](./shard.1.md) (3 files — 3 NEEDS_REFACTOR)

## 📈 Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| LEAN | 15 | 71% |
| ACCEPTABLE | 3 | 14% |
| OVER | 3 | 14% |

---

## 📖 Methodology

**Model:** sonnet

Evaluates whether complexity is justified by actual requirements.

### How it works

Each symbol is judged against how widely it is actually used. The reverse-usage graph supplies its caller count and transitive importer count, while the project tree and dependency manifest give context on whether an abstraction earns its keep. A class or type with a single importer is surfaced as a candidate, and the model weighs its complexity against that real demand. Reference and internal docs are injected as context but never decide the verdict, and the deliberation pass can re-examine borderline cases.

### Rating Criteria

- **LEAN**: Implementation is minimal and appropriate for its purpose. A long function doing one thing well is still LEAN.
- **OVER**: Unnecessary abstractions, premature generalization, factory patterns for single use, excessive configuration for simple behavior.
- **ACCEPTABLE**: Some complexity present but justified by requirements.

*Generated: 2026-10-25T12:41:31.952Z*
