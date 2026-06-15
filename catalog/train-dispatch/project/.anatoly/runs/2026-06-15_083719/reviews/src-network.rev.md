# Review: `src/network.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| STATIONS | constant | yes | OK | - | - | - | - | 95% |
| StationId | type | yes | OK | - | - | - | - | 95% |
| BLOCKS | constant | yes | OK | - | - | - | - | 95% |
| SINGLE_TRACK_BLOCKS | constant | yes | OK | - | - | - | - | 95% |
| BlockInfo | type | yes | OK | - | - | - | - | 82% |
| T | constant | no | OK | - | - | - | - | 60% |
| BLOCK_INFO | constant | yes | OK | - | - | - | - | 90% |
| getTraversalTime | function | yes | OK | - | - | - | - | 95% |
| getBlockInfo | function | yes | OK | - | - | - | - | 95% |
| AdjacencyEntry | type | yes | OK | - | - | - | - | 95% |
| ADJACENCY | constant | yes | OK | - | - | - | - | 92% |
| getNextBlocks | function | yes | OK | - | - | - | - | 95% |

### Details

#### `STATIONS` (L3–L3)

- **Correction [OK]**: Correct const-asserted tuple; no defects.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API; no description of what these identifiers represent in the network topology.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `StationId` (L4–L4)

- **Correction [OK]**: Correctly derived union type from STATIONS.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive type alias derived directly from STATIONS. Semantics are obvious from the derivation.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BLOCKS` (L6–L8)

- **Correction [OK]**: Enumerates all eight block IDs that appear in BLOCK_INFO and ADJACENCY; no omissions or extras.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose (exhaustive list? ordered list? differs from BLOCK_INFO how?) is not explained.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `SINGLE_TRACK_BLOCKS` (L10–L10)

- **Correction [OK]**: Correct set of single-track block IDs consumed by dispatcher.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The interlocking semantics — why these blocks are constrained and how consumers must enforce that constraint — are undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BlockInfo` (L12–L17)

- **Correction [OK]**: Interface fields are consistent with all BLOCK_INFO entries.
- **PARTIAL [PARTIAL]**: No JSDoc. Fields id/from/to are self-explanatory, but traversalTime lacks unit documentation (ticks? seconds?) and no interface-level description explains the coordinate system for 'from'/'to' (station names vs. junction labels).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `T` (L19–L19)

- **Correction [OK]**: Constant used by getTraversalTime; no defects.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private internal constant. Single-letter name with magic value 4 and no comment indicating units or rationale.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BLOCK_INFO` (L21–L30)

- **Correction [OK]**: No live consumers; entries are internally consistent with the block IDs in BLOCKS.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No explanation of what junction labels like 'JCT', 'WESTLOOP', 'EASTLOOP', 'bS1_end', 'bS2_start' mean or how this list relates to BLOCKS.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getTraversalTime` (L32–L34)

- **Correction [OK]**: Underscore-prefixed param is an intentional simplification; always returns T=4 as designed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious behavior: parameter is unused (prefixed _block) and the function always returns the constant T regardless of block identity. This stub contract is undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getBlockInfo` (L36–L38)

- **Correction [OK]**: Correct linear scan over BLOCK_INFO by id; returns undefined for unknown ids, which is the declared return type.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No documentation on param, return type, or when undefined is returned.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `AdjacencyEntry` (L40–L43)

- **Correction [OK]**: Correct interface; fields match all ADJACENCY entries.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface; from/to BlockId fields unambiguously convey a directed edge in the block graph.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ADJACENCY` (L45–L55)

- **Correction [OK]**: Bidirectional edges for the single-track loop section (bS1↔bS2, bM2↔bS1) are intentional; BFS in shortestPath handles cycles via visited-node tracking. All referenced block IDs exist in BLOCKS.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Directionality rules (bidirectional entries for bS1↔bS2 and bS2↔bM2 path) and the graph's relationship to physical topology are unexplained.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getNextBlocks` (L57–L59)

- **Correction [OK]**: Correctly filters ADJACENCY by source block and maps to target block IDs.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No param, return, or behavior documentation (e.g. empty array vs null for terminal blocks).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `STATIONS`, `BLOCKS`, `SINGLE_TRACK_BLOCKS`, `BLOCK_INFO`, `getTraversalTime`, `getBlockInfo`, `ADJACENCY`, `getNextBlocks` (`STATIONS, BLOCKS, SINGLE_TRACK_BLOCKS, BLOCK_INFO, getTraversalTime, getBlockInfo, ADJACENCY, getNextBlocks`) [L3-L3, L6-L8, L10-L10, L21-L30, L32-L34, L36-L38, L45-L55, L57-L59]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `BlockInfo` (`BlockInfo`) [L12-L17]
