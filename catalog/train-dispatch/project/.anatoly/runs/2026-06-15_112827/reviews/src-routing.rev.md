# Review: `src/routing.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| shortestPath | function | yes | OK | - | - | - | - | 95% |

### Details

#### `shortestPath` (L4–L36)

- **Correction [OK]**: Standard BFS with correct path reconstruction. `from` is never inserted into `parent`, so the while loop terminates when `parent.get(from)` returns `undefined`, producing a correctly ordered `[from, …, to]` path. Directed-edge traversal via `a.from === current` is consistent with the `ADJACENCY` shape.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of BFS algorithm used, what null return means, whether path includes both endpoints, and behavior when from === to.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `shortestPath` (`shortestPath`) [L4-L36]
