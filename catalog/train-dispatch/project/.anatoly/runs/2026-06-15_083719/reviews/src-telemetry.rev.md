# Review: `src/telemetry.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| MovementRecorder | class | yes | OK | - | - | - | - | 95% |

### Details

#### `MovementRecorder` (L3–L14)

- **Correction [OK]**: No bugs or logic errors. Push-only mutation on readonly arrays is valid TypeScript (readonly prevents reassignment, not element mutation). Both record methods correctly construct and append typed records.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or either method. Purpose (recording train arrivals and block occupancy during simulation), parameters, and the distinction between the two record types are not documented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `MovementRecorder` (`MovementRecorder`) [L3-L14]
