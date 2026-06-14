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
- **Correction [OK]**: Counts all SCATTER symbols across the full grid unconditionally; matches the documented 5×3 whole-grid counting contract.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Missing coverage for: zero scatters, one/two scatters, exactly 3, mixed symbols, empty reels.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., counts all SCATTER symbols across the entire grid).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-transition branches match the arbitrated contract exactly: activate+set-10, retrigger+add-10, decrement+deactivate-at-zero.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state transition table. Minimal and correct for its purpose.
- **Tests [NONE]**: No test file exists. Missing coverage for: initial activation (scatters>=3), retrigger while active, decrement, deactivation at remaining<=0, and no-op when inactive+scatters<3.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state machine with three distinct transition branches (activate, retrigger, decrement/deactivate) and a mutation side-effect — all undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Given the non-trivial free-spin retrigger semantics, documenting params and side effects would help callers. [L3-L22] |

### Suggestions

- Add JSDoc to both public exports to document the mutation side-effect and retrigger semantics.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to free-spin transition rules.
   * @param state - Persistent free-spin state shared across spin calls.
   * @param scatters - Number of SCATTER symbols in the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Add JSDoc to `detectScatters` to clarify grid-wide counting (not payline-confined).
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (not confined to paylines).
   * @param reels - 2-D grid of symbols (columns × rows).
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
