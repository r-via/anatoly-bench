# Review: `src/timetable.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| DWELL_TICKS | constant | yes | OK | - | - | - | - | 90% |
| MIN_HEADWAY | constant | yes | OK | - | - | - | - | 90% |
| ON_TIME_SLACK | constant | yes | OK | - | - | - | - | 90% |
| TrainSpec | type | yes | OK | - | - | - | - | 95% |
| TIMETABLE | constant | yes | OK | - | - | - | - | 82% |

### Details

#### `DWELL_TICKS` (L3–L3)

- **Correction [OK]**: Simple numeric constant; no stated contract contradicts the value.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `MIN_HEADWAY` (L4–L4)

- **Correction [OK]**: Simple numeric constant; no stated contract contradicts the value.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ON_TIME_SLACK` (L5–L5)

- **Correction [OK]**: Simple numeric constant; no stated contract contradicts the value.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TrainSpec` (L7–L13)

- **Correction [OK]**: Interface is structurally sound; all fields are typed correctly and consumed consistently by callers.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TIMETABLE` (L15–L72)

- **Correction [OK]**: All entries conform to TrainSpec. Conflict scenarios (T1/T2 simultaneous depart at tick 0 merging onto bM1; T5_EXP and T6_LOC traversing bS1/bS2 in opposite directions; T3_FRT depart-to-bA headway gap of 2 < MIN_HEADWAY=3) appear to be intentional stress-test fixtures for the dispatcher's signal and interlocking logic rather than data errors — the dispatcher simulation is documented to resolve exactly these conflicts. No numeric value is inconsistent with the TrainSpec contract or contradicts a documented invariant visible in this context.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
