# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 65% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates every cell of every reel and counts SCATTER symbols, matching the documented 5×3 full-grid scatter counting rule.
- **Overengineering [LEAN]**: Simple double-loop counter over a 2D array. Minimal and appropriate for full-grid scatter counting as documented.
- **Tests [NONE]**: No test file exists. Used by engine.ts for a critical game mechanic — scatter counting across all reels — with no coverage of empty reels, single scatter, or multiple scatters per column.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing: parameter description for `reels`, return value semantics (total count across all positions, not per-reel), and the fact that detection is grid-wide rather than payline-restricted.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Retrigger branch adds 10 to remaining without decrementing for the current consumed free spin, yielding a net +10 instead of net +9.
- **Overengineering [LEAN]**: Three-branch conditional directly encodes the documented state machine: trigger, retrigger, and decrement. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being core free-spin lifecycle logic called by engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing: description of state mutation side-effects, the scatter threshold of 3, the 10-spin award and retrigger behavior, and the decrement/deactivation path when scatters < 3 during an active session. (deliberated: confirmed — Off-by-one confirmed in retrigger path. src/freespin.ts:17-18: when `state.active && scatters >= 3`, `remaining += 10` without decrementing for the current spin, unlike the normal active path at line 20 (`remaining--`). However, the sole caller (src/engine.ts:141) creates a fresh FreeSpinState with `active: false` on every spin, making the retrigger branch (line 17) and decrement branch (line 19) permanently unreachable in production. Bug is real but has zero blast radius in current codebase. Lowered confidence accordingly.)

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither detectScatters nor handleFreeSpins carry JSDoc. Both are public library exports where parameter semantics (e.g., what scatters represents, side-effect contract of state mutation) warrant documentation. [L3-L23] |
| 15 | Testability | WARN | MEDIUM | handleFreeSpins mutates FreeSpinState in place and returns void. Tests must reset shared state between cases and cannot use snapshot assertions. A pure function returning a new FreeSpinState would eliminate this friction. [L12-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/regulated-gaming domain (inferred from slot-engine vocabulary and confirmed by .anatoly/docs/). handleFreeSpins mutates its argument in place (void return); immutable state transitions are preferred in regulated gaming engines for auditability and deterministic replay. The retrigger branch correctly adds 10 spins without consuming the current spin per .anatoly/docs/02-Architecture/02-Core-Concepts.md, but this non-obvious contract is uncommented. [L12-L23] |

### Suggestions

- Add JSDoc to both public exports documenting parameters and the side-effect contract.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the full reel grid.
   * @param reels - 2-D array of visible symbols (columns × rows)
   * @returns total visible SCATTER count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Return a new FreeSpinState instead of mutating the argument to improve testability and support immutable state transitions in a regulated gaming context.
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
      // Retrigger: add 10 spins; current spin is not consumed (per design)
      return { ...state, remaining: state.remaining + 10 };
    }
    if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch, decrement remaining before adding 10: `state.remaining--; state.remaining += 10;` (or equivalently `state.remaining += 9;`) so the retrigger spin is counted as a consumed free spin, matching the behaviour of the non-retrigger branch. [L18]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
