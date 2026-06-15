# Review: `src/routing.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| shortestPath | function | yes | OK | - | - | - | - | 90% |

### Details

#### `shortestPath` (L4–L36)

- **Correction [OK]**: BFS implementation and path reconstruction are correct. The loop exits after prepending `from` because `parent.get(from)` returns `undefined`, which terminates the while-loop cleanly — `from` is still added before the termination condition triggers. The `from === to` early return is correct. No correctness defects found.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
