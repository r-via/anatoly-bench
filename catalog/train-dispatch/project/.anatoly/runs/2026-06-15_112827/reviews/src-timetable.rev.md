# Review: `src/timetable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| DWELL_TICKS | constant | yes | OK | - | - | - | - | 90% |
| MIN_HEADWAY | constant | yes | OK | - | - | - | - | 95% |
| ON_TIME_SLACK | constant | yes | OK | - | - | - | - | 92% |
| TrainSpec | type | yes | OK | - | - | - | - | 90% |
| TIMETABLE | constant | yes | OK | - | - | - | - | 90% |

### Details

#### `DWELL_TICKS` (L3–L3)

- **Correction [OK]**: Value is internally consistent and consumed correctly by dispatcher. README contradiction captured as doc_divergence.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. README also contradicts this value (documents 2 ticks; constant is 6).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `MIN_HEADWAY` (L4–L4)

- **Correction [OK]**: Value 3 matches README spec exactly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. README mentions the 3-tick headway rule but the constant itself carries no inline documentation.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ON_TIME_SLACK` (L5–L5)

- **Correction [OK]**: No documented target contradicts this value; usage in computeOnTimeRate is consistent with its semantics.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Neither the constant's purpose (tolerance window added to scheduledArrival) nor its unit is documented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TrainSpec` (L7–L13)

- **Correction [OK]**: Interface fields match all TIMETABLE entries and downstream consumer signatures.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the interface or any field. Non-obvious semantics include: tick unit for depart/scheduledArrival, what PriorityClass values are valid, and whether route is ordered.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TIMETABLE` (L15–L72)

- **Correction [OK]**: All entries conform to TrainSpec. T6_LOC reverse route (bE→bS2→bS1→bM2) is valid bi-directional traffic; no constraint in code or docs forbids it.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose, scenario coverage, and authoring conventions (e.g., block naming) are undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `DWELL_TICKS`, `MIN_HEADWAY`, `ON_TIME_SLACK`, `TrainSpec`, `TIMETABLE` (`DWELL_TICKS, MIN_HEADWAY, ON_TIME_SLACK, TrainSpec, TIMETABLE`) [L3-L3, L4-L4, L5-L5, L7-L13, L15-L72]
