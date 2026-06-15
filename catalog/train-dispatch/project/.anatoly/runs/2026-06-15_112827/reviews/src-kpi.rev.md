# Review: `src/kpi.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeOnTimeRate | function | yes | OK | - | - | - | - | 92% |

### Details

#### `computeOnTimeRate` (L4–L19)

- **Correction [OK]**: Logic is internally consistent: null-guard on actualArrival is present, empty-TIMETABLE division-by-zero is guarded, and Array.some correctly short-circuits. No reachable defect path given available type information.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behaviors undocumented: return value is a ratio [0,1] not a percentage; returns 1 (not 0) when TIMETABLE is empty; train membership is sourced from TIMETABLE rather than from the arrivals argument; a train is considered on-time if ANY of its arrival records satisfies the slack threshold.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeOnTimeRate` (`computeOnTimeRate`) [L4-L19]
