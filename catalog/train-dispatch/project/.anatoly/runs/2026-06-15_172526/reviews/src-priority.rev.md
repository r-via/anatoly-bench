# Review: `src/priority.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| QueueEntry | type | yes | OK | - | - | - | - | 95% |
| compareTrains | function | yes | NEEDS_FIX | - | - | - | - | 78% |

### Details

#### `QueueEntry` (L3–L6)

- **Correction [OK]**: Well-formed interface; both fields are structurally sound.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `compareTrains` (L8–L12)

- **Correction [NEEDS_FIX]**: insertionOrder is declared in QueueEntry and is never consulted in the comparator; when two entries tie on trainId (possible if trainId encodes a shared priority class, as the README implies with "priority class"), the comparator returns 0 and queue ordering becomes non-deterministic instead of FIFO.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Add FIFO tie-breaking: when a.trainId === b.trainId, return a.insertionOrder - b.insertionOrder so trains of equal priority are dispatched in arrival order. [L11]
