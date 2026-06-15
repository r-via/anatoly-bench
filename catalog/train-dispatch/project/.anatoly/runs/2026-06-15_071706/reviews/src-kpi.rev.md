# Review: `src/kpi.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeOnTimeRate | function | yes | OK | - | - | - | - | 90% |

### Details

#### `computeOnTimeRate` (L4–L19)

- **Correction [OK]**: Logic is internally consistent: trains with no arrival records are correctly treated as not on-time; the zero-timetable guard returns 1 as a vacuous truth; the null-actualArrival guard is valid. Without a stated contract specifying whether 'on-time' means any-stop or all-stops (and without the TrainArrival type visible), the `some` semantics cannot be definitively characterized as wrong.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
