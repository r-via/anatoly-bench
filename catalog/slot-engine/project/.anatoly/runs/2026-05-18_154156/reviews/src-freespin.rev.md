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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid, matching the documented whole-grid (not payline) counting rule.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. No abstractions, no generics — minimal for its purpose.
- **Tests [NONE]**: No test file exists. Used by engine.ts with no coverage for empty reels, no scatters, single scatter, or multiple scatters across columns.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, the shape of the input grid, and the return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: State machine correctly implements trigger (≥3 SCATTERs → active=true, remaining=10), retrigger (+10), and per-spin decrement with deactivation at 0, matching the documented spec.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes trigger, retrigger, and decrement logic. No unnecessary indirection or configuration overhead.
- **Tests [NONE]**: No test file exists. Four distinct branches uncovered: initial activation (scatters>=3), retrigger while active, decrement while active, and deactivation at remaining<=0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The trigger threshold (≥3 scatters), initial award (10 spins), retrigger behavior (+10), and decrement-on-spin logic are all undocumented. State mutation side-effects are not noted.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `handleFreeSpins` mutates `state` in-place (state.active, state.remaining). The parameter type is not `Readonly<FreeSpinState>`, making mutation invisible at call sites. In regulated gambling software, returning a new state object is strongly preferred for auditability. [L13-L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Given the gambling domain, parameter contracts and side-effect semantics should be documented. [L3,L13] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is a pure function (excellent). `handleFreeSpins` mutates its argument and returns void — tests must snapshot state before and after to assert outcomes, adding friction. A functional return-new-state pattern would improve isolation. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain (slot engine). `handleFreeSpins` returns `void`, so callers cannot determine `freeSpinsAwarded` for `SpinResult` without comparing state snapshots before and after the call. The authoritative reference doc (`02-Core-Concepts.md`) specifies `SpinResult.freeSpinsAwarded` must carry the spin's award count — this cannot be derived cleanly from a void-returning mutator. Returning the awarded spin count (0 or 10) would align the function with the `SpinResult` contract. [L13] |

### Suggestions

- Return `freeSpinsAwarded` from `handleFreeSpins` to satisfy the `SpinResult.freeSpinsAwarded` contract without requiring callers to diff state snapshots.
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
      if (state.remaining <= 0) state.active = false;
    }
  }
  // After
  export function handleFreeSpins(state: FreeSpinState, scatters: number): number {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
      return 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
      return 10;
    } else if (state.active) {
      state.remaining--;
      if (state.remaining <= 0) state.active = false;
    }
    return 0;
  }
  ```
- Add JSDoc to public exports documenting parameters and side effects.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Updates `state` in-place based on scatter count for the current spin.
   * @param state - Mutable free-spin session state.
   * @param scatters - Number of SCATTER symbols found on the grid this spin.
   * @returns Number of free spins awarded this spin (0 or 10).
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): number {
  ```
- Mark the `state` parameter as `Readonly<FreeSpinState>` if switching to a pure return-new-state pattern, or at minimum document mutation explicitly to surface the side effect at call sites.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  // pure alternative
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): { next: FreeSpinState; awarded: number } {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
