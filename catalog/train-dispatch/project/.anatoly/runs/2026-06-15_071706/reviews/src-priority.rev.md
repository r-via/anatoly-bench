# Review: `src/priority.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| QueueEntry | type | yes | OK | - | - | - | - | 92% |
| compareTrains | function | yes | NEEDS_FIX | - | - | - | - | 78% |

### Details

#### `QueueEntry` (L3–L6)

- **Correction [OK]**: Interface definition is structurally sound; no correctness issues within its own declaration.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `compareTrains` (L8–L12)

- **Correction [NEEDS_FIX]**: Sorts by trainId (a unique identifier), making insertionOrder permanently dead and omitting FIFO tiebreaking; README requires priority-class dispatch ordering.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Add a priority or priorityClass field to QueueEntry and rewrite compareTrains to sort descending by that field, falling back to ascending insertionOrder for FIFO tiebreaking within the same priority tier. Confirm with types.ts whether TrainId already encodes priority ordering before deciding whether a separate field is needed. [L9]
