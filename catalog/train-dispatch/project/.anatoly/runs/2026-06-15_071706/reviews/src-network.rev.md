# Review: `src/network.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| STATIONS | constant | yes | OK | - | - | - | - | 95% |
| StationId | type | yes | OK | - | - | - | - | 95% |
| BLOCKS | constant | yes | OK | - | - | - | - | 95% |
| SINGLE_TRACK_BLOCKS | constant | yes | OK | - | - | - | - | 95% |
| BlockInfo | type | yes | OK | - | - | - | - | 95% |
| T | constant | no | OK | - | - | - | - | 90% |
| BLOCK_INFO | constant | yes | OK | - | - | - | - | 90% |
| getTraversalTime | function | yes | OK | - | - | - | - | 95% |
| getBlockInfo | function | yes | OK | - | - | - | - | 95% |
| AdjacencyEntry | type | yes | OK | - | - | - | - | 95% |
| ADJACENCY | constant | yes | OK | - | - | - | - | 90% |
| getNextBlocks | function | yes | OK | - | - | - | - | 95% |

### Details

#### `STATIONS` (L3–L3)

- **Correction [OK]**: Five-station const tuple matches README network description exactly.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `StationId` (L4–L4)

- **Correction [OK]**: Union type correctly derived from STATIONS tuple.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BLOCKS` (L6–L8)

- **Correction [OK]**: Block ID list is internally consistent with BLOCK_INFO and ADJACENCY entries.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `SINGLE_TRACK_BLOCKS` (L10–L10)

- **Correction [OK]**: Correctly identifies bS1 and bS2 as the single-track section blocks.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BlockInfo` (L12–L17)

- **Correction [OK]**: Interface shape is correct and fully consumed by BLOCK_INFO array.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `T` (L19–L19)

- **Correction [OK]**: Uniform traversal time constant; README states per-block times are fixed, does not mandate a specific value.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `BLOCK_INFO` (L21–L30)

- **Correction [OK]**: Eight block records correctly describe topology; bS1/bS2 intermediate endpoints (bS1_end, bS2_start) model the passing-loop geometry without contradiction.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getTraversalTime` (L32–L34)

- **Correction [OK]**: Correctly returns uniform T for all blocks; _block intentionally unused since all traversal times are equal.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getBlockInfo` (L36–L38)

- **Correction [OK]**: Array find by id is correct; returning undefined on miss is appropriate for a lookup helper.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `AdjacencyEntry` (L40–L43)

- **Correction [OK]**: Interface correctly types directed edge entries.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ADJACENCY` (L45–L55)

- **Correction [OK]**: Graph encodes both traversal directions through the single-track section (bS1↔bS2) and the one-way ALPHA/BRAVO junction merge; topology is internally consistent.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `getNextBlocks` (L57–L59)

- **Correction [OK]**: Correctly filters ADJACENCY by `from` and maps to successor block IDs.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
