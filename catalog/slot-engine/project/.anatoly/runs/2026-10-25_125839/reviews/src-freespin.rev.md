# Review: `src/freespin.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | - | 72% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts every SCATTER cell across all reel columns. No defect.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: The state transitions are consistent. A new trigger sets remaining to 10, and a retrigger adds 10. Otherwise an active session decrements remaining and deactivates at 0. On a retrigger, the free spin just played is not decremented. That may be intended, and no documentation states the contract, so it is not flagged.
- **Overengineering [LEAN]**: Straightforward three-branch state transition on a plain state object. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates its `state` parameter in place. This is a side-effect API with a `void` return, and it relies on a mutable `FreeSpinState`. A pure `(state, scatters) => FreeSpinState` function with a `Readonly<FreeSpinState>` input would be safer and easier to test. The input `reels` parameter is already `ReadonlyArray`. [L12-L24] |
| 8 | ESLint compliance | WARN | HIGH | The imported `Symbol` type shadows the global `Symbol` (no-shadow / no-redeclare of builtin globals). Magic numbers 3 and 10 are inlined, which `no-magic-numbers` would flag. The `if` statements without braces on L7 may breach `curly` rules. [L1, L7, L13-L19] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `detectScatters` and `handleFreeSpins` are exported without JSDoc. The free-spin trigger threshold, the retrigger behavior and the countdown semantics are undocumented. [L3-L25] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is pure. `handleFreeSpins` mutates its argument and hardcodes the trigger threshold (3) and the award size (10), so they cannot be configured or injected. [L12-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Free-spin constants (3 scatters, 10 spins) are magic numbers. In a slot-engine domain they should be named constants, ideally paytable-driven. `handleFreeSpins` also does not return a value, so the `freeSpinsAwarded` field in `SpinResult` has to be derived elsewhere. [L13-L16] |

### Suggestions

- Extract the magic numbers into named constants and return a new state instead of mutating.
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  }
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (scatters >= SCATTER_TRIGGER) {
      return { active: true, remaining: state.active ? state.remaining + FREE_SPINS_AWARD : FREE_SPINS_AWARD };
    }
    ...
  ```
- Add JSDoc to the public exports.
  ```typescript
  // Before
  export function detectScatters(
  // After
  /** Counts SCATTER symbols across all reels. */
  export function detectScatters(
  ```
