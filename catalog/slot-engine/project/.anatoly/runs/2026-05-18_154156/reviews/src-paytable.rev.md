# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers.
- **Duplication [UNIQUE]**: Simple numeric constant with no similar symbols found.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single named constant for the RTP value. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is not tested, though trivial by nature.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose of the constant (target RTP for this paytable configuration), its use context, and what 'ANCIENT' refers to are all unexplained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Used locally in getPayMultiplier function at line 15.
- **Duplication [UNIQUE]**: Unique static data structure mapping symbols to payout multiplier tuples.
- **Correction [OK]**: All six symbol rows match the authoritative pay table in both internal docs and configuration schema exactly.
- **Overengineering [LEAN]**: Flat Record mapping symbol names to fixed 3-tuples. No abstraction beyond what the domain requires.
- **Tests [NONE]**: No test file exists. Private constant; coverage only via getPayMultiplier tests, which also don't exist.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing explanation that tuple indices correspond to 3-, 4-, and 5-match multipliers applied to lineBet, and that WILD/SCATTER have no entries.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found. Looks up payout multiplier from PAY_TABLE by symbol and count.
- **Correction [OK]**: Strict-equality guards on count 3/4/5 correctly index row[0]/[1]/[2]; unknown symbols and out-of-range counts return 0 as specified.
- **Overengineering [LEAN]**: Straight lookup with three if-branches for counts 3/4/5. Tuple index access (row[count-3]) would be marginally shorter but the current form is clear and not over-engineered.
- **Tests [NONE]**: No test file exists. Used by engine.ts and legacy.ts — critical business logic (payout calculation) with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that the multiplier is applied to lineBet (not raw bet), and no note that counts < 3 or > 5 return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers.
- **Duplication [DUPLICATE]**: Semantically identical to checkLine in src/engine.ts (similarity: 0.823). Both find consecutive matching symbols (or WILD) starting from array head, return match or null.
- **Correction [OK]**: Lead-symbol discovery via find(s=>s!=='WILD') is correct; SCATTER and all-WILD cases are guarded; consecutive run counting with WILD substitution matches the documented left-to-right algorithm.
- **Overengineering [LEAN]**: Single-pass left-to-right scan matching the documented algorithm exactly. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Contains non-trivial WILD substitution logic, early-break counting, and SCATTER/WILD null guards — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Left-to-right scan logic, WILD substitution behavior, SCATTER exclusion, minimum count of 3, and the meaning of the returned object are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical — both locate consecutive symbol matches (treating WILD as wildcard), count the run, and return symbol/run or null if <3 matches

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable at runtime (no readonly tuples). The symbols parameter accepts a mutable array but only reads from it — should be ReadonlyArray<Symbol>. [L5-L11, L23] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline object type. The project uses named interfaces for win records (interface LineWin per internal docs). An extracted named type/interface (e.g. LineMatch) would be consistent. [L23] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc comments. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE uses a widening type annotation (Record<string, ...>) instead of satisfies, losing literal-type inference and exhaustiveness. satisfies Record<PaySymbol, readonly [number, number, number]> would give compile-time coverage of missing/extra symbol entries. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine gambling domain. PAY_TABLE key type is string rather than a payable-symbol subset (Exclude<Symbol, 'WILD'\|'SCATTER'>), so the compiler cannot catch a missing or misspelled symbol entry at the call sites — a reliability risk in regulated payout logic. ANCIENT_RTP export with an undocumented 'ANCIENT' qualifier could be consumed on the wrong code path by a caller expecting the canonical RTP constant. [L3, L5] |

### Suggestions

- Replace widening type annotation on PAY_TABLE with satisfies for exhaustiveness and readonly tuple inference
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    // ...
  };
  // After
  type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;
  
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    // ...
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Mark symbols parameter as ReadonlyArray to signal non-mutation intent and prevent accidental writes
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: ReadonlyArray<Symbol>): { symbol: Symbol; count: number } | null {`
- Extract named interface for the lineWins return type to match project interface convention
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  interface LineMatch { readonly symbol: Symbol; readonly count: number; }
  
  export function lineWins(symbols: ReadonlyArray<Symbol>): LineMatch | null {
  ```
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  export function lineWins(symbols: Symbol[]): ... {
  // After
  /** Theoretical RTP for the classic pay table variant (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the pay multiplier for a symbol at a given match count (3–5).
   * Returns 0 for unknown symbols or out-of-range counts.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a 5-position payline left-to-right and returns the leading
   * win match (symbol + run length ≥ 3), or null if no win.
   */
  export function lineWins(symbols: ReadonlyArray<Symbol>): LineMatch | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
