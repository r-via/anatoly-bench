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
- **Correction [OK]**: Correctly iterates every cell in the 5×3 grid and counts SCATTER occurrences; matches documented grid-wide (non-payline-restricted) counting rule.
- **Overengineering [LEAN]**: Simple double-loop counter over a 2D array. Minimal and appropriate for counting SCATTER symbols across the full grid as documented in .anatoly/docs/02-Architecture/02-Core-Concepts.md.
- **Tests [NONE]**: No test file found. detectScatters is used by the core engine and has no test coverage for happy path (multiple scatters), edge cases (empty reels, no scatters, single scatter), or boundary conditions.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment present. As an exported public function, it should document its parameter (`reels` — a 2-D grid of symbols), the traversal strategy (full grid, not payline-restricted), and the return value (count of SCATTER symbols found).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All four cases (first trigger, retrigger, normal free spin, inactive+no scatter) are handled correctly and match the documented invariants: first trigger sets remaining=10; retrigger adds 10 without consuming the current spin; normal free spin decrements and deactivates at zero; totalWon is not touched here (presumably updated by the caller after payout accumulation). The `remaining <= 0` guard is defensive but harmless.
- **Overengineering [LEAN]**: Straightforward state machine with three branches matching exactly the documented rules (trigger, retrigger, decrement/deactivate). No unnecessary abstraction; complexity is proportional to the specified behavior.
- **Tests [NONE]**: No test file found. handleFreeSpins is used by the core engine and has no test coverage for any of its branches: initial activation (scatters >= 3), re-trigger while active, decrement while active, or deactivation when remaining reaches 0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment present. As an exported public function with non-trivial branching logic (initial trigger, retrigger, decrement, deactivation), it should document the `state` mutation side-effects, the `scatters` threshold (≥ 3), retrigger behaviour (+10 spins), and the void return.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly accepts ReadonlyArray<ReadonlyArray<Symbol>>. However, handleFreeSpins accepts `state: FreeSpinState` and mutates it in-place (state.active, state.remaining), with no Readonly guard on the parameter type. The parameter should be typed as Readonly<FreeSpinState> and the function should return a new FreeSpinState to enforce immutability. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions — detectScatters and handleFreeSpins — are part of the engine's public contract (documented in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and 02-Core-Concepts.md) but carry no JSDoc comments. At minimum, @param/@returns annotations should be present. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function and is highly testable. handleFreeSpins is impure — it mutates its `state` argument in-place rather than returning a new state. Tests must set up mutable state objects and assert post-mutation values, which increases test fragility. Returning a new FreeSpinState would make the function pure and easier to unit-test in isolation. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine / regulated-gaming domain inferred from reel/scatter/free-spin vocabulary and the package name slot-engine in .anatoly/docs/04-API-Reference/01-Public-API.md. In regulated gaming environments, all state transitions should be auditable. handleFreeSpins silently mutates FreeSpinState with no logging, no return value, and no bounds validation on the `scatters` parameter (a caller could pass a negative or fractional value). Minimally, `scatters` should be validated as a non-negative integer before acting on it. [L13-L24] |

### Suggestions

- Add JSDoc to both exported functions to satisfy rule 9 and align with the API reference documentation.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts every SCATTER symbol visible across the full reel grid.
   * @param reels - The fully visible reel columns (5×3 grid).
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Make handleFreeSpins a pure function (rule 5 + rule 15): accept Readonly<FreeSpinState> and return a new state rather than mutating in-place.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
    } else if (state.active) {
      state.remaining--;
      if (state.remaining <= 0) {
        state.active = false;
      }
    }
  }
  // After
  export function handleFreeSpins(
    state: Readonly<FreeSpinState>,
    scatters: number,
  ): FreeSpinState {
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    }
    if (state.active && scatters >= 3) {
      return { ...state, remaining: state.remaining + 10 };
    }
    if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```
- Add input validation on `scatters` for regulated-gaming robustness (rule 17).
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!Number.isInteger(scatters) || scatters < 0) throw new RangeError(`scatters must be a non-negative integer, got ${scatters}`);
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
