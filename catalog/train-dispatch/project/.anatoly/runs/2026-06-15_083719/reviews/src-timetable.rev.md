# Review: `src/timetable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| DWELL_TICKS | constant | yes | OK | - | - | - | - | 95% |
| MIN_HEADWAY | constant | yes | OK | - | - | - | - | 95% |
| ON_TIME_SLACK | constant | yes | OK | - | - | - | - | 92% |
| TrainSpec | type | yes | OK | - | - | - | - | 90% |
| TIMETABLE | constant | yes | OK | - | - | - | - | 88% |

### Details

#### `DWELL_TICKS` (L3–L3)

- **Correction [OK]**: No code-level defect; value diverges from README (see doc_divergences).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Units (ticks) and semantic meaning (station dwell duration) are implicit. README further contradicts this value (says 2 ticks, code is 6).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `MIN_HEADWAY` (L4–L4)

- **Correction [OK]**: Value 3 matches README's documented 3-tick minimum headway.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No inline comment clarifying that the unit is ticks or that this enforces block-entry spacing.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ON_TIME_SLACK` (L5–L5)

- **Correction [OK]**: No documented target to contradict; value is internally consistent with kpi.ts consumer.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The name alone does not convey that it is an additive tick tolerance applied to scheduledArrival, nor its unit.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TrainSpec` (L7–L13)

- **Correction [OK]**: Interface fields are well-typed and fully consumed by TIMETABLE and importers.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the interface or any field. Non-obvious semantics: depart and scheduledArrival are tick-based, route is an ordered list of BlockIds, and priority maps to a custom enum — none of this is documented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `TIMETABLE` (L15–L72)

- **Correction [OK]**: Entries are structurally valid TrainSpec objects; relative depart/scheduledArrival deltas are internally consistent across comparable routes.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No comment explaining the scenario being modeled, the tick scale, or why certain trains share departure ticks. Consumed by dispatcher, formatter, and KPI modules — a brief description of intent would be warranted.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `DWELL_TICKS`, `MIN_HEADWAY`, `ON_TIME_SLACK`, `TrainSpec`, `TIMETABLE` (`DWELL_TICKS, MIN_HEADWAY, ON_TIME_SLACK, TrainSpec, TIMETABLE`) [L3-L3, L4-L4, L5-L5, L7-L13, L15-L72]
