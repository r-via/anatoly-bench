# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files. No runtime or type-only consumers.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target exactly.
- **Overengineering [LEAN]**: Single numeric constant export. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is exported and likely consumed by engine/RTP calculations — no coverage at all.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The name hints at RTP but doesn't explain what 'ANCIENT' refers to, the 0.95 value's significance, or how it is applied in the payout calculation.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported. Referenced in getPayMultiplier (L15) via PAY_TABLE[symbol].
- **Duplication [UNIQUE]**: No similar data structure found in RAG results.
- **Correction [OK]**: All multipliers match the reference documentation table exactly for every symbol and run length.
- **Overengineering [LEAN]**: Flat record mapping symbol names to fixed tuple of three multipliers. No abstraction beyond what the domain requires.
- **Tests [NONE]**: No test file exists. Internal constant backing getPayMultiplier; all six symbol rows untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant so leniency applies, but the 3-tuple semantics (3-of-a-kind / 4-of-a-kind / 5-of-a-kind multipliers) are non-obvious from the type alone and have no inline or block comment explaining them.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Correctly maps count 3/4/5 to row indices 0/1/2; returns 0 for missing entries (WILD, SCATTER) and for count outside {3,4,5}.
- **Overengineering [LEAN]**: Simple index lookup into PAY_TABLE with three explicit count guards. Direct and readable for a fixed 3/4/5 count domain.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — critical pay calculation path. Count branches (3/4/5), unknown symbol, and count < 3 return 0 all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing @param descriptions for symbol and count, no @returns explaining the multiplier semantics, and no note that WILD/SCATTER always return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files. No runtime or type-only consumers.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine in src/engine.ts: same WILD-skipping lead detection, same consecutive-match loop with WILD substitution, same >= 3 guard. Only cosmetic differences: variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Functions are fully interchangeable in behavior.
- **Correction [OK]**: Correctly skips leading WILDs via find() to identify the pay symbol, counts contiguous WILD-or-matching symbols from position 0, returns null for all-WILD and SCATTER leads, and enforces minimum run of 3.
- **Overengineering [LEAN]**: Contiguous-run scan with WILD substitution in ~15 lines. Logic is straightforward for its purpose.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-return, consecutive-count break, and count < 3 null return are all untested edge cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The WILD substitution logic, left-to-right run counting, minimum run length of 3, and SCATTER exclusion are all non-trivial behaviors with no documentation.

> **Duplicate of** `src/engine.ts:checkLine` — ~98% identical logic — same algorithm, same guards, same loop structure; differs only in variable and return-property names

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE key is plain string instead of Partial<Record<Symbol, ...>>. Invalid-symbol lookups silently return undefined rather than being rejected at compile time. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable. Should use as const assertion or readonly tuple elements (readonly [number, number, number]) plus Readonly<> wrapper. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc comments. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from the satisfies operator (TS 4.9+, standard in 5.x) to preserve literal inference while enforcing shape constraints. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. lineWins does not validate that symbols carries the expected 5-element payline length; an empty array silently returns null rather than surfacing an invariant violation. In regulated gaming code, silent failure on malformed input should be an explicit guard. [L23-L38] |

### Suggestions

- Replace Record<string, ...> with satisfies + Partial<Record<Symbol, ...>> to gain key-type safety and immutability
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
  } satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Theoretical return-to-player ratio for this paytable (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a given pay symbol and run length.
   * Returns 0 for WILD, SCATTER, or runs shorter than 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Guard lineWins against under-length payline arrays
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
    const first = symbols[0] === "WILD"
  // After
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
    if (symbols.length < 3) return null;
    const first = symbols[0] === "WILD"
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
