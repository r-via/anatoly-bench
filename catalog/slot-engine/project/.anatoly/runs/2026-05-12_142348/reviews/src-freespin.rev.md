# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 75% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across every reel and row with no off-by-one or early-exit issues.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and full-grid scatter counts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what 'scatters' means in context, parameter docs for `reels`, and return value semantics (count of SCATTER symbols across the full grid).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Logic is internally consistent with documented behavior; retrigger branch adds 10 without consuming the triggering spin, which is an unusual but valid design choice in some slot implementations. No authoritative external spec contradicts it, and confidence in industry-norm violation stays below the 80-point threshold required for NEEDS_FIX.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding the documented trigger/retrigger/decrement rules. Complexity matches the business logic exactly.
- **Tests [NONE]**: No test file exists. Missing coverage for all branches: initial activation (scatters>=3), retrigger while active, decrement while active, deactivation at remaining<=0, and inactive state with scatters<3.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing docs for parameters `state` and `scatters`, the three-branch state-machine logic (trigger, retrigger, decrement/deactivate), and the hardcoded threshold/award values of 3 and 10.

## Best Practices — 8.75/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly accepts ReadonlyArray inputs. handleFreeSpins mutates the FreeSpinState argument in place; returning a new state object would match the immutability posture of the rest of the API and is preferred in a regulated gambling engine where state transitions must be auditable. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither detectScatters nor handleFreeSpins has JSDoc. In a regulated slot engine, documenting the trigger threshold (≥3 scatters) and the award quantum (10 spins) directly on the exported symbols is important for compliance readability. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function and trivially testable. handleFreeSpins mutates its argument, requiring callers to construct mutable state objects and assert side effects rather than compare return values. A pure form would improve unit test clarity. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling/slot domain inferred from reels, SCATTER, free-spin/jackpot vocabulary and internal docs (.anatoly/state/internal-docs). Magic numbers 3 (scatter trigger) and 10 (spin award) are inlined without named constants. In regulated gambling software, configurable/labelled thresholds improve auditability during certification reviews. [L14-L21] |

### Suggestions

- Add JSDoc to both public exports, documenting the trigger threshold and award count
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the full reel grid.
   * @param reels - Full 5×3 grid of symbols
   * @returns Total number of SCATTER symbols visible
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Extract magic numbers to named constants for regulatory auditability
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPIN_AWARD = 10;
  
  // …
  if (!state.active && scatters >= SCATTER_TRIGGER) {
      state.active = true;
      state.remaining = FREE_SPIN_AWARD;
    } else if (state.active && scatters >= SCATTER_TRIGGER) {
      state.remaining += FREE_SPIN_AWARD;
  ```
- Return a new FreeSpinState instead of mutating in place to satisfy immutability and testability
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
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= SCATTER_TRIGGER) {
      return { ...state, active: true, remaining: FREE_SPIN_AWARD };
    } else if (state.active && scatters >= SCATTER_TRIGGER) {
      return { ...state, remaining: state.remaining + FREE_SPIN_AWARD };
    } else if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
