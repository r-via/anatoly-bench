# Review: `src/priority.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| QueueEntry | type | yes | OK | - | - | - | - | 90% |
| compareTrains | function | yes | NEEDS_FIX | - | - | - | - | 75% |

### Details

#### `QueueEntry` (L3–L6)

- **Correction [OK]**: Interface definition is well-formed; both fields are correctly typed.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive type
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `compareTrains` (L8–L12)

- **Correction [NEEDS_FIX]**: insertionOrder field declared on QueueEntry is never consulted; when two entries carry equal trainId values the comparator returns 0, making queue ordering non-deterministic instead of FIFO.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The comparison logic sorts by `trainId` descending (higher ID = higher priority), which is a non-obvious convention. Missing: description of sort order/semantics, @param docs for `a` and `b`, @returns explanation of the sign contract expected by comparators.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Add FIFO tiebreaker: after the trainId comparisons fall through to the final `return 0`, replace it with `return a.insertionOrder - b.insertionOrder;` so that equal-priority trains are dispatched in the order they entered the queue. [L11]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `compareTrains` (`compareTrains`) [L8-L12]
