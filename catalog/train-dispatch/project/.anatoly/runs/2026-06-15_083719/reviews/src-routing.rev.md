# Review: `src/routing.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| shortestPath | function | yes | OK | - | - | - | - | 95% |

### Details

#### `shortestPath` (L4–L36)

- **Correction [OK]**: Standard BFS with correct visited-on-enqueue discipline and correct path reconstruction. Parent walk terminates because `from` has no entry in `parent`, so `parent.get(from)` returns `undefined`, ending the loop after `from` is unshifted — both endpoints are included. Early-exit on first BFS encounter of `to` is sound (BFS guarantees shortest path). Directed-graph semantics match the `ADJACENCY` structure.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of BFS algorithm, parameter semantics (what constitutes a valid BlockId pair), return value (null means unreachable vs. same-node shortcut), and any constraints on the ADJACENCY graph (directed, unweighted).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `shortestPath` (`shortestPath`) [L4-L36]
