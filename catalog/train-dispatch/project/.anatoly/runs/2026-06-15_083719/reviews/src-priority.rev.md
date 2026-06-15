# Review: `src/priority.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| QueueEntry | type | yes | OK | - | - | - | - | 90% |
| compareTrains | function | yes | NEEDS_FIX | - | - | - | - | 72% |

### Details

#### `QueueEntry` (L3–L6)

- **Correction [OK]**: Interface definition is structurally sound; no correctness defects.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive type
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `compareTrains` (L8–L12)

- **Correction [NEEDS_FIX]**: `insertionOrder` is part of `QueueEntry` and exists solely to provide stable FIFO tie-breaking in a queue, but is never consulted; equal-`trainId` entries receive non-deterministic relative ordering.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Comparator sorts by trainId descending (higher IDs first), which is a non-obvious ordering choice. Missing: description of sort direction, what the return value means for the caller's priority queue, and why insertionOrder is present in QueueEntry but unused here.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** After the trainId comparison, add a tie-break on insertionOrder: `return a.insertionOrder - b.insertionOrder;` (ascending insertion order preserves FIFO for equal trainId values). [L11]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `compareTrains` (`compareTrains`) [L8-L12]
