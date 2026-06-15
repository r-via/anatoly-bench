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
| releaseBlock | function | yes | OK | - | - | - | - | 90% |
| reserveSectionBlock | function | yes | OK | - | - | - | - | 95% |
| releaseSingleTrack | function | yes | OK | - | - | - | - | 95% |

### Details

#### `blockHolder` (L3–L3)

- **Correction [OK]**: Module-level Map, correctly used by all in-file consumers.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `sectionReservation` (L4–L4)

- **Correction [OK]**: Module-level Map, correctly used by all in-file consumers.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetInterlocking` (L6–L9)

- **Correction [OK]**: Clears both maps; correct.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `isBlockFree` (L11–L14)

- **Correction [NEEDS_FIX]**: Checks `currentBlock` occupancy instead of the target `block`; `block` parameter is never read.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `occupyBlock` (L16–L18)

- **Correction [OK]**: Sets block → train in blockHolder; correct.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseBlock` (L20–L22)

- **Correction [OK]**: `_train` is intentionally unused (underscore prefix); no concrete in-tree call site releases a block it doesn't own.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `reserveSectionBlock` (L24–L32)

- **Correction [OK]**: Guard, reservation, and conflict logic are all correct.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `releaseSingleTrack` (L34–L40)

- **Correction [OK]**: Correctly iterates both single-track blocks and removes only the given train's reservations.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Refactors

- **[correction · high · large]** In `isBlockFree`, replace `blockHolder.get(currentBlock)` with `blockHolder.get(block)` so the function actually checks whether the target block is occupied by another train rather than always checking the train's current block. [L12]
