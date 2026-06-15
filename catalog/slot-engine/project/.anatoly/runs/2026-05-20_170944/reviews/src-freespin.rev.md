# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all cells in the grid and counts SCATTER symbols; matches documented 5×3 full-grid scan.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal and appropriate for its purpose.
- **Tests [NONE]**: No test file found. Critical game logic used by engine.ts has no coverage for scatter counting across multiple reels, empty reels, or non-scatter symbols.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D readonly array), and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-machine branches match the arbitrated doc table exactly: activate+set-10, retrigger+add-10, decrement-and-deactivate. The `<= 0` guard is safe — remaining cannot go negative in normal flow, and deactivating on negative is correct defensive behavior.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. State machine with 4 branches (activation, retrigger, decrement, deactivation) is entirely untested despite being core free-spin business logic consumed by engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state machine with three distinct branches (activation, retrigger, decrement/deactivation) and a mutation side-effect — none of which are documented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. `handleFreeSpins` in particular implements a non-trivial state machine; the conditions and side-effects warrant documentation. [L3-L22] |

### Suggestions

- Add JSDoc to both exported functions — especially `handleFreeSpins`, whose three-branch state machine is non-obvious
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Updates `state` in place according to the free-spin state machine.
   * - Not active + ≥3 scatters → activates, sets remaining = 10
   * - Active + ≥3 scatters → retrigger, adds 10 to remaining
   * - Active + <3 scatters → decrements remaining; deactivates at 0
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
