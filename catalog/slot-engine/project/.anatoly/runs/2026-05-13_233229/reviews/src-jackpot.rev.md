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
- **Correction [OK]**: Logic is correct: counts all DIAMOND symbols across the full reel grid and returns true when four or more are found. No type errors, off-by-one issues, or unsafe operations.
- **Overengineering [LEAN]**: Flat iteration over a 2D array with a counter — minimal and appropriate for a jackpot threshold check.
- **Tests [NONE]**: No test file exists. Critical game logic called by src/engine.ts with no coverage for threshold boundary (exactly 4 DIAMONDs), below-threshold cases, empty reels, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot logic, explanation of the threshold (>=4 DIAMONDs), parameter shape, and return semantics.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters are correctly typed ReadonlyArray. However, the symbol string 'DIAMOND' and threshold 4 are inlined magic literals rather than named readonly constants, reducing auditability. [L5-L10] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | isJackpotHit is exported with no JSDoc. Missing: parameter description, return semantics, and documentation of the 4-diamond threshold rule. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine domain inferred from reels, paytable, freespin, rng vocabulary in project structure. In regulated gaming, jackpot payout conditions (symbol identity and hit threshold) should be externalized to auditable configuration rather than embedded as inline magic literals. The hardcoded threshold >= 4 and string 'DIAMOND' are gambling-critical parameters that regulators typically require to be traceable to a certified math spec. [L5-L10] |

### Suggestions

- Add JSDoc to isJackpotHit documenting the 4-diamond scatter rule, parameter, and return value
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when at least {@link JACKPOT_THRESHOLD} DIAMOND symbols appear
   * anywhere across all reels (scatter jackpot condition).
   * @param reels - Resolved reel grid after a spin.
   * @returns true if the jackpot condition is met.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract gambling-critical magic literals as named readonly constants for auditability and traceability to the math spec
  ```typescript
  // Before
    if (sym === "DIAMOND") diamondCount++;
      }
    }
    return diamondCount >= 4;
  // After
  const JACKPOT_SYMBOL = "DIAMOND" as const;
  const JACKPOT_THRESHOLD = 4 as const;
  
  // inside the loop:
    if (sym === JACKPOT_SYMBOL) diamondCount++;
      }
    }
    return diamondCount >= JACKPOT_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
