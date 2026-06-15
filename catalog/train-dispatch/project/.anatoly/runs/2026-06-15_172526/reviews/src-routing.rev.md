# Review: `src/routing.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| shortestPath | function | yes | NEEDS_FIX | - | - | - | - | 85% |

### Details

#### `shortestPath` (L4–L36)

- **Correction [NEEDS_FIX]**: Path reconstruction omits `from` node when BFS terminates early: the `while (node !== undefined)` loop walks parent map but `from` has no parent entry, so the loop stops before prepending it.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Path reconstruction loop exits before prepending `from`. Either seed the parent map with `parent.set(from, undefined as any)` and guard with `parent.has(node)`, or change the termination from `node !== undefined` to `node !== from` and then push `from` after the loop. As-is, the returned array is missing its first element for all paths of length > 1. [L21]
