# Review: `src/interlocking.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| blockHolder | variable | no | OK | - | - | - | - | 60% |
| sectionReservation | variable | no | OK | - | - | - | - | 60% |
| resetInterlocking | function | yes | OK | - | - | - | - | 95% |
| isBlockFree | function | yes | NEEDS_FIX | - | - | - | - | 95% |
| occupyBlock | function | yes | OK | - | - | - | - | 95% |
| releaseBlock | function | yes | OK | - | - | - | - | 90% |
| reserveSectionBlock | function | yes | OK | - | - | - | - | 95% |
| releaseSingleTrack | function | yes | OK | - | - | - | - | 95% |

### Details

#### `blockHolder` (L3–L3)

- **Correction [OK]**: Module-scoped map correctly typed and used by in-file consumers.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal module-level Map with no JSDoc. Private helper state; leniency applies, but the semantics (maps block to occupying train) are non-obvious from the name alone.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `sectionReservation` (L4–L4)

- **Correction [OK]**: Module-scoped map correctly typed and used by in-file consumers.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal Map tracking single-track section reservations. No JSDoc; the distinction between this and blockHolder (occupation vs reservation) is undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetInterlocking` (L6–L9)

- **Correction [OK]**: Clears both maps completely; correct reset semantics.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Clears both blockHolder and sectionReservation; callers need to know this resets all interlocking state globally.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `isBlockFree` (L11–L14)

- **Correction [NEEDS_FIX]**: Checks occupancy of `currentBlock` instead of the target `block`, so the function never verifies whether the destination block is free — a train can enter an already-occupied block.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Critically non-obvious: the `block` parameter is ignored — the lookup uses `currentBlock`, not `block`. This asymmetry demands documentation but has none.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `occupyBlock` (L16–L18)

- **Correction [OK]**: Correctly records train ownership for the specified block.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Simple operation but no description of preconditions or interaction with sectionReservation.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseBlock` (L20–L22)

- **Correction [OK]**: Deletes the block entry unconditionally; `_train` is unused by design (underscore prefix). No concrete call site misuse visible.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. The `_train` parameter is intentionally unused (prefixed underscore), which is non-obvious to callers and undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `reserveSectionBlock` (L24–L32)

- **Correction [OK]**: Correctly gates on bS1/bS2, checks for conflicting holder, then sets and returns true.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Complex logic: silently succeeds for non-section blocks (bS1/bS2), implements mutual exclusion for those blocks, returns false on conflict. None of this is documented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseSingleTrack` (L34–L40)

- **Correction [OK]**: Correctly iterates both section blocks and removes only those held by the given train.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Hardcoded block IDs bS1/bS2 and the concept of a 'single track section' are undocumented; callers cannot tell when to call this vs releaseBlock.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Refactors

- **[correction · high · large]** In isBlockFree, change `blockHolder.get(currentBlock)` to `blockHolder.get(block)` so the function actually checks whether the destination block is free, not the block the train already occupies. [L12]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `resetInterlocking`, `isBlockFree`, `occupyBlock`, `releaseBlock`, `reserveSectionBlock`, `releaseSingleTrack` (`resetInterlocking, isBlockFree, occupyBlock, releaseBlock, reserveSectionBlock, releaseSingleTrack`) [L6-L9, L11-L14, L16-L18, L20-L22, L24-L32, L34-L40]
