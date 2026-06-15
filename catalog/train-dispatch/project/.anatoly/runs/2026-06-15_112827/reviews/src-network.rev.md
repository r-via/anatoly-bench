# Review: `src/network.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| STATIONS | constant | yes | OK | - | - | - | - | 95% |
| StationId | type | yes | OK | - | - | - | - | 95% |
| BLOCKS | constant | yes | OK | - | - | - | - | 95% |
| SINGLE_TRACK_BLOCKS | constant | yes | OK | - | - | - | - | 95% |
| BlockInfo | type | yes | OK | - | - | - | - | 85% |
| T | constant | no | OK | - | - | - | - | 60% |
| BLOCK_INFO | constant | yes | OK | - | - | - | - | 90% |
| getTraversalTime | function | yes | OK | - | - | - | - | 95% |
| getBlockInfo | function | yes | OK | - | - | - | - | 95% |
| AdjacencyEntry | type | yes | OK | - | - | - | - | 95% |
| ADJACENCY | constant | yes | OK | - | - | - | - | 90% |
| getNextBlocks | function | yes | OK | - | - | - | - | 95% |

### Details

#### `STATIONS` (L3–L3)

- **Correction [OK]**: Const tuple of five station IDs. No correctness issues.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name implies station identifiers but nothing explains what these stations represent in the network topology.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `StationId` (L4–L4)

- **Correction [OK]**: Union type derived correctly from STATIONS tuple.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive union type derived from STATIONS. No complex semantics requiring additional explanation.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BLOCKS` (L6–L8)

- **Correction [OK]**: Eight block IDs enumerated; matches the entries in BLOCK_INFO.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No explanation of whether this is an exhaustive list, an ordered list, or what it is used for relative to BLOCK_INFO.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `SINGLE_TRACK_BLOCKS` (L10–L10)

- **Correction [OK]**: Correctly lists bS1 and bS2 as the mutual-exclusion blocks used by dispatcher.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The name hints at single-track topology but the interlocking/collision-avoidance semantics enforced by the dispatcher are not described.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BlockInfo` (L12–L17)

- **Correction [OK]**: Interface shape is self-consistent and matches BLOCK_INFO usage.
- **PARTIAL [PARTIAL]**: No JSDoc. `traversalTime` lacks unit documentation (ticks? seconds?). `from`/`to` are untyped strings mixing station names and junction labels (e.g. 'JCT', 'WESTLOOP') — semantics not explained.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `T` (L19–L19)

- **Correction [OK]**: Shared traversal-time constant used consistently in BLOCK_INFO and getTraversalTime.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal unexported constant. Single-character name with no comment indicating its unit or purpose. Lenient since it is private, but any reader must infer it is a traversal time in ticks.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BLOCK_INFO` (L21–L30)

- **Correction [OK]**: All entries use traversalTime: T consistently. The synthetic node names 'bS1_end' and 'bS2_start' in bS1/bS2 are unused by any active consumer, so they cause no runtime defect.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Encodes the physical network layout including junction node labels ('JCT', 'WESTLOOP', 'EASTLOOP') that do not appear in STATIONS — this non-obvious topology is undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getTraversalTime` (L32–L34)

- **Correction [OK]**: Correctly returns T for every block; all BLOCK_INFO entries carry the same traversalTime: T, so the uniform return is consistent with the data model.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The `_block` parameter is ignored and a constant is always returned — this stub-like behavior and its intended future semantics are undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getBlockInfo` (L36–L38)

- **Correction [OK]**: Array.find over BLOCK_INFO is correct; returns undefined when the block is absent, which matches the declared return type.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing documentation on the undefined return case and what callers should do when a block is not found.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `AdjacencyEntry` (L40–L43)

- **Correction [OK]**: Simple interface; correctly typed.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface with two clearly named BlockId fields. No complex semantics requiring elaboration.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ADJACENCY` (L45–L55)

- **Correction [OK]**: Bidirectional single-track entries (bS1↔bS2, bS1↔bM2) are intentional and self-consistent. Terminal blocks bA, bB, bD have no outgoing edges by design (one-directional simulation). No orphaned or contradictory entries.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The graph contains bidirectional entries for the single-track loop (bS1↔bS2) alongside unidirectional edges — this directionality convention is undocumented and consumed by the routing algorithm.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getNextBlocks` (L57–L59)

- **Correction [OK]**: Correct filter-map over ADJACENCY. Returns empty array for terminal blocks (bA, bB, bD), which is the expected behaviour given the graph structure.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing documentation on directionality semantics, what an empty result means, and that it relies on the ADJACENCY graph.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `STATIONS`, `BLOCKS`, `SINGLE_TRACK_BLOCKS`, `BLOCK_INFO`, `getTraversalTime`, `getBlockInfo`, `ADJACENCY`, `getNextBlocks` (`STATIONS, BLOCKS, SINGLE_TRACK_BLOCKS, BLOCK_INFO, getTraversalTime, getBlockInfo, ADJACENCY, getNextBlocks`) [L3-L3, L6-L8, L10-L10, L21-L30, L32-L34, L36-L38, L45-L55, L57-L59]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `BlockInfo` (`BlockInfo`) [L12-L17]
