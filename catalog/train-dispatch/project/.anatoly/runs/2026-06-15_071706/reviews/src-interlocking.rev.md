# Review: `src/interlocking.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| blockHolder | variable | no | OK | - | - | - | - | 95% |
| sectionReservation | variable | no | OK | - | - | - | - | 95% |
| resetInterlocking | function | yes | OK | - | - | - | - | 95% |
| isBlockFree | function | yes | NEEDS_FIX | - | - | - | - | 97% |
| occupyBlock | function | yes | OK | - | - | - | - | 95% |
| releaseBlock | function | yes | OK | - | - | - | - | 95% |
| reserveSectionBlock | function | yes | OK | - | - | - | - | 95% |
| releaseSingleTrack | function | yes | OK | - | - | - | - | 95% |

### Details

#### `blockHolder` (L3–L3)

- **Correction [OK]**: Module-level Map used correctly by all in-file consumers.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `sectionReservation` (L4–L4)

- **Correction [OK]**: Module-level Map used correctly by all in-file consumers.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetInterlocking` (L6–L9)

- **Correction [OK]**: Clears both maps correctly.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `isBlockFree` (L11–L14)

- **Correction [NEEDS_FIX]**: Queries `blockHolder` with `currentBlock` instead of `block`; the first parameter is dead and the wrong block is checked.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `occupyBlock` (L16–L18)

- **Correction [OK]**: Sets block→train in blockHolder correctly.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseBlock` (L20–L22)

- **Correction [OK]**: Deletes the correct key; unused `_train` param is intentional.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `reserveSectionBlock` (L24–L32)

- **Correction [OK]**: Guard, reservation, and conflict detection logic are all correct.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseSingleTrack` (L34–L40)

- **Correction [OK]**: Correctly removes all section reservations held by the given train.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Refactors

- **[correction · high · large]** In `isBlockFree`, replace `blockHolder.get(currentBlock)` with `blockHolder.get(block)` so the function actually checks whether the target block is free rather than the block the train already occupies. [L12]
