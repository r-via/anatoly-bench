# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND symbols across all reels and returns true when count >= 4. Logic matches the arbitrated contract (4 or more DIAMONDs trigger jackpot) and the reference documentation example.
- **Overengineering [LEAN]**: Flat double-loop count with a single threshold check. No unnecessary abstractions; exactly as complex as the task requires.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is an exported public API with no JSDoc. At minimum a one-liner describing the counting logic and threshold would aid consumers. [L3] |

### Suggestions

- Add JSDoc to `isJackpotHit` so tooling and consumers get inline documentation.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when 4 or more DIAMOND symbols appear anywhere across the
   * full reel grid in a single spin (threshold is hardcoded per design).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
