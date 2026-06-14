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
- **Correction [OK]**: Correctly iterates all reels and all symbols, counting every SCATTER across the full grid as documented.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical path: called by spin() in engine.ts to trigger free spin awards. Zero coverage for empty reels, no scatters, exactly 3 scatters, or scatters spread across multiple reels.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics, and return value meaning.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions are implemented correctly: activation with remaining=10, retrigger +10, and decrement-then-deactivate-at-zero. The `<= 0` guard in the deactivation branch is safely defensive and does not contradict the contract.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), re-trigger (scatters>=3, active), decrement while active, and deactivation when remaining<=0. All called from spin() in engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) is non-obvious and warrants documented parameter contracts and side-effect description.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both detectScatters and handleFreeSpins are public exports with no JSDoc. Consumers (e.g. engine.ts) benefit from inline documentation of the state-machine semantics. [L3-L22] |

### Suggestions

- Add JSDoc to both public exports to surface state-machine semantics at the call site.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (not confined to paylines).
   * @param reels - Full 5×3 reel window.
   * @returns Total SCATTER count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to handleFreeSpins documenting the three state-machine branches.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to the free-spin state machine:
   * - Not active + ≥3 scatters → activates, sets remaining = 10.
   * - Active + ≥3 scatters → retrigger, adds 10 to remaining.
   * - Active + <3 scatters → decrements remaining; deactivates at 0.
   * @param state - Persistent free-spin state (mutated in place).
   * @param scatters - SCATTER count from the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
