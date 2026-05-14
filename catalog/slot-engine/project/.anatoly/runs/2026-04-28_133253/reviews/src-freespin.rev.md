# Review: `src/freespin.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates every cell of every reel and counts SCATTER symbols; matches the documented 5×3 grid-wide (non-payline-restricted) counting rule.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal, direct, and appropriate for the task as documented in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Three-branch state machine matches all documented invariants: trigger sets remaining=10, retrigger adds 10 without consuming the triggering spin, normal spin decrements and deactivates at zero.
- **Overengineering [LEAN]**: Straightforward state mutation with three mutually exclusive branches covering the documented trigger, retrigger, and decrement behaviors. Hardcoded literals are intentional per .anatoly/docs/03-Guides/02-Advanced-Configuration.md. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `detectScatters` correctly types its parameter as `ReadonlyArray<ReadonlyArray<Symbol>>`, which is good. However, the magic literals `3` (scatter threshold) and `10` (free-spin award count) appear three times across `handleFreeSpins` with no named `const` extractions. In a regulated gambling engine these thresholds are configurable parameters and should be declared as named constants at module scope for traceability and to comply with the single-source-of-truth principle. [L14-L22] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters` and `handleFreeSpins`) are part of the public engine API and are documented in `.anatoly/docs/` but lack JSDoc comments in source. Consumers reading the `.d.ts` will see no inline documentation for parameters, return values, or the mutation side-effect of `handleFreeSpins`. [L3-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Domain inferred as regulated gambling/slot engine from reel/scatter/freespin vocabulary and confirmed by `.anatoly/docs/02-Architecture/02-Core-Concepts.md` and `.anatoly/docs/03-Guides/02-Advanced-Configuration.md`. Two concerns: (1) The scatter trigger threshold (`3`) and award quantum (`10`) are magic literals hardcoded inline. In regulated gambling, these values are audit targets — hardcoding them rather than referencing named, externally-verifiable configuration constants makes compliance verification harder. `.anatoly/docs/03-Guides/02-Advanced-Configuration.md` even explicitly warns that changing them requires editing numeric literals. (2) `handleFreeSpins` returns `void` and mutates state silently. In regulated jurisdictions, every state transition in a free-spin lifecycle (trigger, retrigger, decrement, deactivation) should be observable/emittable for audit logging. The current design makes that impossible without wrapping. [L13-L24] |

### Suggestions

- Extract magic numbers as named module-level constants to make the regulated gambling parameters auditable and single-sourced
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
    }
  // After
  const SCATTER_TRIGGER_COUNT = 3 as const;
  const FREE_SPINS_AWARD = 10 as const;
  
  // …
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
    } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
      state.remaining += FREE_SPINS_AWARD;
    }
  ```
- Add JSDoc to both exported functions so generated .d.ts files carry inline documentation for API consumers
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts the total number of SCATTER symbols visible across all reels.
   * @param reels - Full 5×3 reel window as a nested readonly array.
   * @returns The total SCATTER symbol count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Consider returning a discriminated result object from handleFreeSpins to make state transitions observable for audit logging without coupling callers to side-effect inspection
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    // mutates state silently
  }
  // After
  export type FreeSpinTransition =
    | { kind: 'triggered'; spinsAwarded: number }
    | { kind: 'retriggered'; spinsAdded: number }
    | { kind: 'consumed'; remaining: number }
    | { kind: 'ended' }
    | { kind: 'none' };
  
  export function handleFreeSpins(state: FreeSpinState, scatters: number): FreeSpinTransition {
    // mutates state AND returns the transition for audit/logging
  }
  ```
