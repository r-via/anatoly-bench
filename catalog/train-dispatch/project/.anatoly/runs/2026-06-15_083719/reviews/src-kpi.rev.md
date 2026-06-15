# Review: `src/kpi.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeOnTimeRate | function | yes | OK | - | - | - | - | 90% |

### Details

#### `computeOnTimeRate` (L4–L19)

- **Correction [OK]**: Logic is sound: iterates TIMETABLE ids, filters arrivals by train, uses records.some() to detect any on-time arrival, guards against empty timetable with a ternary returning 1. No type mismatch, no null-dereference (actualArrival null-checked before comparison), no division by zero.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Exported public function with non-obvious semantics: counts trains from TIMETABLE that had at least one on-time arrival (not all arrivals), uses ON_TIME_SLACK threshold, and returns 1 when TIMETABLE is empty. None of this is documented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeOnTimeRate` (`computeOnTimeRate`) [L4-L19]
