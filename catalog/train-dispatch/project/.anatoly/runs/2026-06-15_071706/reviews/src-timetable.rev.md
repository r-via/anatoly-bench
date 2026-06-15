# Review: `src/timetable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| DWELL_TICKS | constant | yes | OK | - | - | - | - | 95% |
| MIN_HEADWAY | constant | yes | OK | - | - | - | - | 95% |
| ON_TIME_SLACK | constant | yes | OK | - | - | - | - | 95% |
| TrainSpec | type | yes | OK | - | - | - | - | 95% |
| TIMETABLE | constant | yes | NEEDS_FIX | - | - | - | - | 82% |

### Details

#### `DWELL_TICKS` (L3–L3)

- **Correction [OK]**: Constant consumed by dispatcher; no correctness issue visible.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `MIN_HEADWAY` (L4–L4)

- **Correction [OK]**: Constant consumed by headway check in signals; no correctness issue visible.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ON_TIME_SLACK` (L5–L5)

- **Correction [OK]**: Constant consumed by KPI on-time rate computation; no correctness issue visible.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TrainSpec` (L7–L13)

- **Correction [OK]**: Interface shape is structurally consistent with all TIMETABLE entries.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TIMETABLE` (L15–L72)

- **Correction [NEEDS_FIX]**: T6_LOC route traverses bS2→bS1→bM2 (reverse direction) while T5_EXP departs the same tick going bM2→bS1→bS2, creating a head-on conflict on the shared bS1/bS2 segment.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Fix T6_LOC's route to eliminate the head-on conflict with T5_EXP on bS1/bS2: either reverse its route to conform to the shared traffic direction (bM2→bS1→bS2→bE if bE connects there), assign it a non-overlapping path, or stagger its departure by enough ticks that T5_EXP has fully cleared bS2 before T6_LOC enters bS2. [L54]
