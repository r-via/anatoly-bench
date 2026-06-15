# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files across the codebase. No consumer references it.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 correctly represents the arbitrated 95% RTP target; no correctness issues.
- **Overengineering [LEAN]**: Single named constant for the 95% RTP target. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is opaque — unclear whether this refers to a legacy mode, a game variant, or a historical configuration. Purpose and usage contract are undocumented.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced locally at L16 inside getPayMultiplier for multiplier lookups.
- **Duplication [UNIQUE]**: No similar lookup tables found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND multipliers [50, 250, 1000] combined with documented reel weight 30/120=0.25 produce system RTP ~238%, contradicting the arbitrated 95% target.
- **Overengineering [LEAN]**: Flat Record lookup with fixed-length tuples matching the exactly-three pay levels. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. PAY_TABLE drives all payout calculations but has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant, no JSDoc. The symbol names are readable but the tuple indices (3-of-a-kind / 4-of-a-kind / 5-of-a-kind) are implicit. Internal helper; reduced confidence penalty.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts (spin) and src/legacy.ts (computeLegacyPayout).
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly maps count 3→row[0], 4→row[1], 5→row[2]; returns 0 for absent symbols and counts outside 3–5.
- **Overengineering [LEAN]**: Straightforward index into PAY_TABLE with three explicit guards. `row[count - 3]` would be marginally tighter but the if-chain is clear and not overengineered.
- **Tests [NONE]**: No test file exists. Used by both src/engine.ts (core spin logic) and src/legacy.ts — critical payout path with zero test coverage. Missing tests for: all pay symbols at counts 3/4/5, unknown symbol returning 0, count <3 returning 0, WILD/SCATTER keys absent from PAY_TABLE.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for `count`, behavior for WILD/SCATTER symbols (returns 0), and the fact that only counts 3–5 yield non-zero results.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. No consumer references it anywhere in the codebase.
- **Duplication [DUPLICATE]**: Logic is virtually identical to checkLine in src/engine.ts: both resolve the leading non-WILD symbol, guard against WILD/SCATTER leads, count consecutive matching symbols (treating WILD as wildcard), and return null if run < 3. Differences are cosmetic only — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run).
- **Correction [OK]**: Correctly skips leading WILDs to determine pay symbol, counts consecutive matching-or-WILD positions from index 0, and returns null for runs < 3 or when first resolves to WILD or SCATTER.
- **Overengineering [LEAN]**: Leading-WILD skip, contiguous-count loop, and null-on-miss are all required by the payline semantics. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Complex WILD-substitution and run-counting logic with multiple branches (all-WILD line, SCATTER first, WILD-prefix resolution, break-on-mismatch) — none tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Non-obvious behavior includes: WILD substitution for the anchor symbol, left-anchored consecutive matching, minimum run of 3, and null return for WILD/SCATTER anchors — none of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical algorithm — same WILD-resolution, same guard clauses, same counting loop, same threshold; only variable and return-property names differ

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a module-level lookup table that should never be mutated, but neither the object nor its tuple values are marked readonly. Without as const or readonly tuples, any code with a reference can overwrite entries (e.g. PAY_TABLE['CHERRY'][0] = 0). [L4-L11] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. getPayMultiplier and lineWins are non-trivial functions with non-obvious semantics (e.g. count < 3 returns 0, WILD/SCATTER short-circuit). [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from satisfies to preserve literal types while enforcing the Record constraint. Current declaration widens tuple values to number[] and accepts arbitrary string keys. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues: (1) ANCIENT_RTP is exported but has zero consumers per codebase analysis — the 'ANCIENT' prefix signals legacy dead code that should be removed or renamed to the canonical RTP constant. (2) lineWins is exported but also has zero consumers; checkLine in engine.ts apparently provides the live payline evaluation path, making lineWins a dead export that adds maintenance surface in a regulated-payout context. [L3,L22-L38] |

### Suggestions

- Make PAY_TABLE fully immutable and narrow the key type using satisfies + as const
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25] as const,
    LEMON:   [2,   5,   25] as const,
    BELL:    [5,   20,  100] as const,
    BAR:     [10,  40,  200] as const,
    SEVEN:   [25,  100, 500] as const,
    DIAMOND: [50,  250, 1000] as const,
  } satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base pay multiplier for a given symbol and run length.
   * Returns 0 for run lengths below 3, and for WILD/SCATTER symbols.
   * @param symbol - The resolved pay symbol (not WILD/SCATTER).
   * @param count  - Consecutive matching symbols in the run (3–5).
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Remove or rename ANCIENT_RTP — it is dead code with no codebase consumers; the canonical RTP target should be a single named constant consumed by engine/rng modules
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `// Remove if unused, or rename to TARGET_RTP and wire into engine.ts RTP validation`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** Reduce DIAMOND paytable entries [50, 250, 1000] or coordinate with reels.ts to reduce DIAMOND weight (30→~23) so the system achieves ~95% RTP. With p=0.25, DIAMOND alone contributes ~229.5% RTP; full paytable implies ~238%. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
