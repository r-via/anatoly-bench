# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across all reels and positions.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER occurrences. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, single-reel input.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Two independent logic defects: retrigger increments before decrement, and `remaining` can reach 0 without deactivating when scatters >= 3.
- **Overengineering [LEAN]**: Three-branch state machine (activate, retrigger, decrement/deactivate) maps directly to free-spin game logic. No excess indirection.
- **Tests [NONE]**: No test file exists. Missing coverage for: inactive→active transition (scatters>=3), re-trigger while active, decrement, deactivation at remaining<=0, and inactive with scatters<3 (no-op).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State-mutation side effects, threshold logic (scatters >= 3), spin award amounts (10), and decrement/deactivation behavior are all undocumented. (deliberated: confirmed — Confirmed two independent defects. (1) engine.ts:141 creates a fresh `FreeSpinState` with `active: false` on every spin call. This makes freespin.ts:17-18 (retrigger branch: `state.active && scatters >= 3`) and freespin.ts:19-23 (decrement branch: `state.active`) permanently unreachable as integrated — the free spin feature is non-functional. Only the initial trigger path (freespin.ts:14-16) ever executes. (2) types.ts:21 defines `totalWon: number` on FreeSpinState, but `handleFreeSpins` never writes to it (grep confirms only two references: the type definition and the initialization to 0 at engine.ts:141). Free spin winnings are never accumulated. Both are real logic defects, not style preferences.)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `reels` correctly uses `ReadonlyArray<ReadonlyArray<Symbol>>`. However, `handleFreeSpins` mutates `state` in-place (three distinct field writes). A functional approach returning `Readonly<FreeSpinState>` would better enforce immutability. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. Public API surface should document parameters, return values, and side effects — especially mutation in `handleFreeSpins`. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is a pure function — fully testable. `handleFreeSpins` mutates its `state` argument, coupling tests to shared mutable objects and making snapshot-style assertions harder. Returning a new state object would improve testability and eliminate the need for pre-test state setup. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain inferred from project structure. Magic numbers `10` (free spins awarded) and `3` (scatter threshold) are hardcoded game-math parameters. In regulated gambling software these values must originate from a certified game-math configuration file, not inline literals. Externalize as named constants referencing a paytable/config module. [L15-L17] |

### Suggestions

- Add JSDoc to both exported functions
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across all reel windows.
   * @param reels - 2D grid of visible symbols (columns × rows).
   * @returns Total number of SCATTER symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Externalize magic game-math numbers as named constants (required in regulated gambling code)
  ```typescript
  // Before
  state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const FREE_SPINS_AWARDED = 10 as const;
  const SCATTER_TRIGGER_COUNT = 3 as const;
  
  // ...
      state.remaining = FREE_SPINS_AWARDED;
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.remaining += FREE_SPINS_AWARDED;
  ```
- Return new state instead of mutating to improve immutability and testability
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    }
  // After
  export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      return { ...state, active: true, remaining: FREE_SPINS_AWARDED };
    }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In the retrigger branch (scatters >= 3 while active), also decrement `remaining` by 1 to account for the current spin being consumed before adding the 10 bonus spins. [L17]

### Hygiene

- **[correction · low · trivial]** Ensure the deactivation check (`remaining <= 0`) is evaluated after all branches, including when scatters >= 3, so that an edge case where retrigger is awarded on the last possible spin still correctly terminates if remaining reaches 0 after the net adjustment. [L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
