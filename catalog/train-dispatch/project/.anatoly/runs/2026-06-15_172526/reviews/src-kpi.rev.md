# Review: `src/kpi.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeOnTimeRate | function | yes | OK | - | - | - | - | 82% |

### Details

#### `computeOnTimeRate` (L4–L19)

- **Correction [OK]**: No runtime errors or definite logic bugs. `some` treats a train as on-time if any arrival record is on-time; whether this is correct vs. requiring all records to be on-time depends on the `TrainArrival` type (not shown) — in a single-terminus model it is fine, in a multi-stop model it would under-count late trains. Empty-records case (`records.some(...)` → false) correctly marks unserviced trains as not on-time. Zero-timetable guard returns 1 defensibly.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
