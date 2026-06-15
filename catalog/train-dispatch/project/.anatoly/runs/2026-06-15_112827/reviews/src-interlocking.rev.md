# Review: `src/interlocking.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| blockHolder | variable | no | OK | - | - | - | - | 60% |
| sectionReservation | variable | no | OK | - | - | - | - | 60% |
| resetInterlocking | function | yes | OK | - | - | - | - | 95% |
| isBlockFree | function | yes | ERROR | ACCEPTABLE | - | - | - | 98% |
| occupyBlock | function | yes | OK | - | - | - | - | 95% |
| releaseBlock | function | yes | OK | - | - | - | - | 90% |
| reserveSectionBlock | function | yes | OK | - | - | - | - | 95% |
| releaseSingleTrack | function | yes | OK | - | - | - | - | 95% |

### Details

#### `blockHolder` (L3–L3)

- **Correction [OK]**: Module-level Map correctly typed and used only by in-file functions.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported but semantics are non-obvious: maps the block a train currently occupies, not the block being requested. Tolerated as internal, but the distinction from sectionReservation is undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `sectionReservation` (L4–L4)

- **Correction [OK]**: Module-level Map correctly typed and used only by in-file functions.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported. The scope (only bS1/bS2) and purpose (exclusive single-track reservation) are opaque from the name alone.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetInterlocking` (L6–L9)

- **Correction [OK]**: Clears both maps; straightforward and correct.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API. Clears both maps — intended call site (simulation reset) and side effects are undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `isBlockFree` (L11–L14)

- **Correction [ERROR]**: Queries `currentBlock` instead of the `block` parameter — wrong block checked, `block` is silently ignored.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported and critically non-obvious: the `block` parameter is entirely unused; the check is against `currentBlock`. This asymmetry between the declared intent and the actual lookup is a documentation gap that can cause misuse. (deliberated: confirmed — Confirmed. src/interlocking.ts:12 — `blockHolder.get(currentBlock)` should be `blockHolder.get(block)`. The `block` parameter (the target block to check) is completely ignored. At call site src/dispatcher.ts:112 `isBlockFree(nextBlock, trainId, currentBlock)`, the function checks the train's own occupied block instead of the target, finds `holder === train`, and always returns true. This defeats all block-occupancy collision protection. The bug is masked at line 55 where both args happen to be `firstBlock`.)
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [ACCEPTABLE]**: *(default — evaluator did not produce a result)*
- **Tests [-]**: *(not evaluated)*

#### `occupyBlock` (L16–L18)

- **Correction [OK]**: Correctly sets the block holder in the map.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API. No documentation on preconditions (caller must call isBlockFree first) or relationship to reserveSectionBlock.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseBlock` (L20–L22)

- **Correction [OK]**: Unconditional delete; underscore prefix on `_train` signals intentional non-use. No concrete call site in the provided context demonstrates wrong-train misuse (rule 1).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The `_train` parameter is silently ignored, which is surprising — no comment explains why train identity is not validated on release.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `reserveSectionBlock` (L24–L32)

- **Correction [OK]**: Guard logic and reservation set/return values are correct for both section and non-section blocks.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API with complex, non-obvious behavior: silently no-ops for all blocks except hardcoded bS1/bS2, returns false when another train holds the reservation. The single-track constraint concept and the return-value contract are undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseSingleTrack` (L34–L40)

- **Correction [OK]**: Correctly iterates both section blocks and deletes only entries owned by the given train.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API. The hardcoded bS1/bS2 scope and the pairing with reserveSectionBlock are undocumented. Callers cannot know when to call this vs releaseBlock.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Refactors

- **[correction · high · large]** Change `blockHolder.get(currentBlock)` to `blockHolder.get(block)` in isBlockFree (L12). The current code checks the train's own current block instead of the target block, defeating all block-occupancy protection and allowing collisions. [L12]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `resetInterlocking`, `isBlockFree`, `occupyBlock`, `releaseBlock`, `reserveSectionBlock`, `releaseSingleTrack` (`resetInterlocking, isBlockFree, occupyBlock, releaseBlock, reserveSectionBlock, releaseSingleTrack`) [L6-L9, L11-L14, L16-L18, L20-L22, L24-L32, L34-L40]
