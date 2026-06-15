# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 correctly represents the documented 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists; constant is never exercised in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is non-obvious — unclear which game variant this RTP applies to or how it differs from other RTP values in the project.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar lookup tables found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND multipliers combined with documented reel weight of 30 produce ~97.7% RTP from DIAMOND 5-of-a-kind alone, violating the arbitrated 95% RTP target before any other combination is counted.
- **Overengineering [LEAN]**: Flat Record with tuple values — minimal representation for a fixed paytable.
- **Tests [NONE]**: No test file exists; sole caller getPayMultiplier is also untested, so no transitive coverage applies.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Tuple indices are opaque — nothing documents that positions [0], [1], [2] correspond to 3-, 4-, and 5-of-a-kind multipliers respectively.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: RAG explicitly reports no similar functions.
- **Correction [OK]**: Correctly maps (symbol, count) to multiplier; returns 0 for missing symbols (WILD, SCATTER) and for counts outside {3, 4, 5}.
- **Overengineering [LEAN]**: Straightforward table lookup with three explicit count guards. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Callers src/engine.ts and src/legacy.ts are not confirmed to have tests that exercise this symbol.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: what 'count' represents, what the returned number means (base multiplier for lineBet calculation), and that WILD/SCATTER always return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine in src/engine.ts: same WILD-skipping lead detection, same SCATTER/WILD null guard, same counting loop with WILD matching, same >= 3 threshold. Only differences are variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Functions are fully interchangeable.
- **Correction [OK]**: Correctly skips leading WILDs via find() to identify the pay symbol, then counts consecutive first-or-WILD symbols; all-WILD and SCATTER-leading edge cases handled correctly.
- **Overengineering [LEAN]**: Core payline evaluation logic: WILD skip, consecutive-count loop, threshold guard. Complexity matches the game mechanic requirement.
- **Tests [NONE]**: No test file found. WILD substitution logic, SCATTER early-return, and consecutive-count boundary (count < 3) are all uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: description of WILD substitution logic for the leading symbol, what the returned {symbol, count} fields represent, the left-to-right consecutive-run constraint, and the null return conditions.

> **Duplicate of** `src/engine.ts:checkLine` — ~98% identical logic — both resolve WILD-skipping lead, guard on SCATTER/WILD, count consecutive matches with WILD substitution, return null below 3; differ only in local variable and return property names

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is typed as a mutable `Record` and its tuple values are also mutable. Both the object and inner tuples should be readonly to prevent accidental mutation at runtime. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `ANCIENT_RTP` is especially under-documented — the name gives no hint about what 'ANCIENT' refers to or how the constant is used. [L3,L13,L22] |

### Suggestions

- Make PAY_TABLE fully immutable to prevent accidental runtime mutation of the canonical payout data.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25] as const,
    LEMON:   [2,   5,   25] as const,
    BELL:    [5,   20,  100] as const,
    BAR:     [10,  40,  200] as const,
    SEVEN:   [25,  100, 500] as const,
    DIAMOND: [50,  250, 1000] as const,
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports. `ANCIENT_RTP` especially needs clarification on what 'ANCIENT' means.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Baseline theoretical RTP for the classic ("ancient") variant — 95%. Used for statistical validation and legacy mode. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a given symbol and run length.
   * Returns 0 for WILD, SCATTER, or runs shorter than 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** Reduce DIAMOND multipliers from [50, 250, 1000] (e.g. to approximately [3, 15, 51]) so that DIAMOND 5-of-a-kind contributes <5% RTP, leaving budget for other combinations to reach 95% total. Alternatively, reduce DIAMOND reel weight in reels.ts from 30 to ≈17. Full solution requires solving the complete RTP equation across all symbol/count combinations and WILD amplification. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
