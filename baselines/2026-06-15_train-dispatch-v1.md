# Anatoly Bench Score — train-dispatch

**Run:** `2026-06-15_071706` · Anatoly v0.9.6 (`94406c2-dirty`) · project main @ `e3d332c`
**Duration:** 3m 21s · **Cost:** $1.24 · **Tokens:** 30 in / 26K out

**Global F1:** 72.7%

**Scored axes:** correction

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 72.7% | 66.7% | 80.0% | 4 | 1 | 2 | 7m 2s | $0.95 | 26K |
| utility | — | — | — | — | 0 | 0 | 0 | — | — | — |
| duplication | — | — | — | — | 0 | 0 | 0 | — | — | — |
| overengineering | — | — | — | — | 0 | 0 | 0 | — | — | — |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | — | — | — | — | 0 | 0 | 0 | — | — | — |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 0s | $0.00 | 0 |

## Misses (2)

Cataloged violations that Anatoly did not flag.

- **[correction · trivial] INV-DWELL** — src/timetable.ts (DWELL_TICKS) — expected verdict `NEEDS_FIX` (numeric-target-contradicts-documented-dwell)
- **[correction · hard] INV-DEADLOCK** — src/interlocking.ts — expected verdict `NEEDS_FIX` (liveness-circular-wait-on-single-track)

## False positives (1)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/timetable.ts:51 (TIMETABLE) — _T6_LOC route ["bE","bS2","bS1","bM2"] moves bS2→bS1, opposite to every other train that uses those blocks (bS1→bS2). T5_EXP (L44–50) departs at the same tick (6) going bM2→bS1→bS2→bD. Under exclusive …_

