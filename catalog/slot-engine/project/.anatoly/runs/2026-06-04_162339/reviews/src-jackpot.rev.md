# Review: `src/jackpot.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reels and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat nested loop counting DIAMOND occurrences. No unnecessary abstraction; logic is minimal and direct for the task.
- **Tests [NONE]**: No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty reel cases all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Public export with non-obvious semantics: counts DIAMOND symbols grid-wide (not payline-restricted) and uses a hardcoded threshold of 4. Parameter and return behavior are undocumented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters are correctly `ReadonlyArray`, but the threshold `4` is a magic number. Extracting it as `const JACKPOT_THRESHOLD = 4 as const` would document intent and enable easy reconfiguration. [L8] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is an exported public function with no JSDoc. A brief doc block describing the DIAMOND-count threshold and the grid shape assumption would help consumers. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | In a regulated gaming utility, the jackpot threshold `4` being a bare magic number makes threshold adjustments error-prone and untraceable in diffs. A module-level named constant is the idiomatic slot-engine pattern. [L8] |

### Suggestions

- Extract the magic number threshold as a named `as const` export so it appears in diffs and is reusable in tests.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
    ...
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_THRESHOLD = 4 as const;
  
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
    ...
    return diamondCount >= JACKPOT_THRESHOLD;
  }
  ```
- Add JSDoc to document the DIAMOND-count contract and grid assumption for API consumers.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the reels contain 4 or more DIAMOND symbols anywhere
   * across the full 5 × 3 grid in a single spin.
   *
   * @param reels - Column-major 5 × 3 symbol grid from a completed spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
