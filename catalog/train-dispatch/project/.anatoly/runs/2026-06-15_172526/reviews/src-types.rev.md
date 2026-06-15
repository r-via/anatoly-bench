# Review: `src/types.ts`

**Verdict:** CLEAN
**Generated file:** yes (type-only)

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| TrainId | type | yes | OK | - | USED | UNIQUE | - | 100% |
| BlockId | type | yes | OK | - | USED | UNIQUE | - | 100% |
| PriorityClass | type | yes | OK | - | USED | UNIQUE | - | 100% |
| TrainArrival | type | yes | OK | - | USED | UNIQUE | - | 100% |
| OccupancyRecord | type | yes | OK | - | USED | UNIQUE | - | 100% |
| SimulationReport | type | yes | OK | - | USED | UNIQUE | - | 100% |

### Details

#### `TrainId` (L1–L1)

Type-only imported by 6 files: src/index.ts, src/interlocking.ts, src/priority.ts, src/signals.ts, src/telemetry.ts, src/timetable.ts

#### `BlockId` (L2–L2)

Type-only imported by 8 files: src/dispatcher.ts, src/index.ts, src/interlocking.ts, src/network.ts, src/routing.ts, src/signals.ts, src/telemetry.ts, src/timetable.ts

#### `PriorityClass` (L3–L3)

Type-only imported by 2 files: src/index.ts, src/timetable.ts

#### `TrainArrival` (L5–L9)

Type-only imported by 3 files: src/index.ts, src/kpi.ts, src/telemetry.ts

#### `OccupancyRecord` (L11–L15)

Type-only imported by 2 files: src/index.ts, src/telemetry.ts

#### `SimulationReport` (L17–L22)

Type-only imported by 2 files: src/dispatcher.ts, src/format.ts
