# Review: `src/telemetry.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| MovementRecorder | class | yes | OK | - | - | - | - | 95% |

### Details

#### `MovementRecorder` (L3–L14)

- **Correction [OK]**: No bugs or logic errors; push-based recording is straightforward and correct.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or either method. The class purpose (recording train movements and arrivals for telemetry/simulation reporting), the semantics of `tick`, and the relationship between `arrivals` and `occupancy` are non-obvious and warrant documentation. Both public methods lack parameter or behavior descriptions.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `MovementRecorder` (`MovementRecorder`) [L3-L14]
