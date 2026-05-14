# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but not imported by any file
- **Duplication [UNIQUE]**: Numeric constant with no similar definitions found
- **Correction [OK]**: Constant 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Named constant for RTP — minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations but never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name is partially self-descriptive but the significance of 0.95, what 'ANCIENT' refers to, and how this constant is consumed are unexplained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Used locally in getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Lookup table for slot payouts with no duplicates found
- **Correction [OK]**: Paytable structure is internally consistent; RTP verification requires reel-strip data not present in this file.
- **Overengineering [LEAN]**: Flat Record<string, tuple> lookup table; no abstraction beyond what the data requires.
- **Tests [NONE]**: No test file exists. Pay table values are business-critical and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple structure [number, number, number] implicitly maps to match counts (3, 4, 5) but this is undocumented; readers must infer from getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: Payout multiplier lookup function with no similar functions found
- **Correction [OK]**: Index mapping count→row[0/1/2] for 3/4/5-of-a-kind is correct; returns 0 for missing symbol or unsupported count.
- **Overengineering [LEAN]**: Three if-branches on a small fixed set of counts (3/4/5); no generalization needed. Could use `row[count - 3]` but the explicit form is clearer, not over-engineered.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with count boundary cases (count<3, count=3,4,5, unknown symbol) all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics (multiplier relative to what bet unit?), and the fact that counts outside {3,4,5} return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but not imported by any file
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine in engine.ts (RAG 0.831). Both extract leading symbol accounting for WILD, check for WILD/SCATTER, count consecutive matches, return symbol+count if >=3. Differs only in variable naming (first/lead, count/run) and return field names (symbol/sym).
- **Correction [OK]**: WILD substitution, SCATTER guard, and left-to-right chain counting are all correct across traced edge cases (leading WILDs, mid-chain WILDs, SCATTER at any position, all-WILDs returning null consistent with separate jackpot handler).
- **Overengineering [LEAN]**: Single linear scan with WILD-substitution and early-break. Complexity is proportional to the rule it encodes.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-return, consecutive-match break, and minimum-count threshold are all untested edge cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. WILD substitution logic, SCATTER exclusion, left-to-right contiguous matching, minimum count of 3, and null return semantics are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical line-matching logic with same parameters, behavior, and invariants

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE uses Record<string, ...> but the key should be constrained to the Symbol union (with Partial to account for WILD/SCATTER being absent). Record<string, ...> silently accepts any string key, eroding type safety at call sites. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a module-level constant whose values are never mutated, but neither the Record nor its tuple values are marked readonly. Adding Readonly / as const prevents accidental mutation. [L5-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. At minimum, the non-obvious WILD-substitution logic in lineWins and the pay-index semantics in getPayMultiplier (count 3→index 0, etc.) warrant documentation. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use satisfies to retain literal tuple types while enforcing the Record contract. As written, TypeScript widens the tuple values to number[]. [L5-L11] |

### Suggestions

- Narrow PAY_TABLE key from string to Symbol and mark values readonly to eliminate any-string lookup and prevent mutation.
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {`
  - After: `const PAY_TABLE: Partial<Record<Symbol, readonly [number, number, number]>> = {`
- Use satisfies to preserve literal tuple types while enforcing the Record shape, enabling exhaustiveness checking without widening to number.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    ...
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to public exports, especially lineWins whose WILD-substitution semantics are non-obvious.
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /**
   * Returns the leading run for a payline, substituting WILD for the first concrete symbol.
   * Returns null if the line starts with only WILDs or contains a SCATTER.
   */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
