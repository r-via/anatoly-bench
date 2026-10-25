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
- **Correction [OK]**: Iterates all reel positions, counts DIAMOND symbols, and returns whether the count meets the threshold — logic is sound with no off-by-one errors or missed cases. The `>= 4` threshold has no documented contract to contradict. The `import type { Symbol }` shadows the built-in `Symbol` global only at the type level, leaving runtime behavior unaffected.
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type; no abstractions, no unnecessary generalization. Exactly as complex as the task requires.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 10/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | import type { Symbol } shadows the built-in JavaScript global Symbol. @typescript-eslint/no-shadow flags this even for type-only imports. Prefer a local alias: import type { Symbol as SlotSymbol } from "./types.js". [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export without JSDoc. One missing doc → WARN (threshold for FAIL is three or more). [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: the jackpot trigger condition (symbol "DIAMOND", threshold 4) is hardcoded. In regulated gaming, jackpot parameters should be sourced from an auditable config constant to support compliance review and RTP certification. Single occurrence → WARN. [L7-L9] |

### Suggestions

- Avoid shadowing the built-in Symbol global by aliasing the imported type
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as SlotSymbol } from "./types.js";`
- Add JSDoc to the public export and extract magic values to named constants for audibility
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
    for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND") diamondCount++;
      }
    }
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_SYMBOL = "DIAMOND" as const;
  const JACKPOT_THRESHOLD = 4;
  
  /**
   * Returns true when the reel grid contains at least {@link JACKPOT_THRESHOLD}
   * {@link JACKPOT_SYMBOL} symbols, triggering the progressive jackpot.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<SlotSymbol>>): boolean {
    let diamondCount = 0;
    for (const col of reels) {
      for (const sym of col) {
        if (sym === JACKPOT_SYMBOL) diamondCount++;
      }
    }
    return diamondCount >= JACKPOT_THRESHOLD;
  }
  ```
