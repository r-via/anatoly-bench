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

- **Utility [DEAD]**: Exported but never imported; no runtime or type-only importers
- **Duplication [UNIQUE]**: Simple numeric constant. No similar symbols found.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The value 0.95 is inferrable as 95% RTP, but 'ANCIENT' is opaque — no comment explains what game variant or configuration this belongs to.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in getPayMultiplier function at line 15
- **Duplication [UNIQUE]**: Symbol-to-payout lookup table. No similar data structures found.
- **Correction [OK]**: All six symbol rows match the reference paytable exactly (3-of-a-kind, 4-of-a-kind, 5-of-a-kind columns).
- **Overengineering [LEAN]**: Plain Record mapping symbol names to fixed 3-tuple multipliers. No abstraction beyond what the domain requires.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private internal constant; leniency applies. Structure is partially inferrable from values and getPayMultiplier usage, but the tuple index semantics (index 0 = 3-of-a-kind, etc.) are implicit and undocumented.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: Retrieves payout multiplier from PAY_TABLE by symbol and count. No similar functions found.
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2]; returns 0 for unknown symbols and non-winning counts.
- **Overengineering [LEAN]**: Straight table lookup with three sequential count checks. Could use index arithmetic (row[count-3]) but sequential ifs are equally clear; no abstraction overhead.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts and src/legacy.ts — critical payout logic with no coverage for count boundaries (2, 3, 4, 5, 6), unknown symbols, or WILD/SCATTER inputs.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Missing: what 'count' represents (run length), valid input range, that WILD/SCATTER and count < 3 return 0, and that the return value is a bet multiplier.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but never imported; no runtime or type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine: handles WILD at position 0, validates lead symbol, counts consecutive matches, returns result if count ≥ 3. Only differences are variable names (first→lead, count→run, return object properties symbol→sym, count→run).
- **Correction [OK]**: Leading-WILD skip and contiguous-run counting are correct; SCATTER at position 0 or as the first non-WILD correctly returns null; all-WILD array falls back to first=WILD and returns null.
- **Overengineering [LEAN]**: Single-pass scan with WILD substitution for the anchor symbol. Complexity matches the payline win rules documented in Core-Concepts.md.
- **Tests [NONE]**: No test file exists. Complex WILD-resolution and contiguous-match logic has no coverage for leading WILDs, mixed WILD/symbol sequences, SCATTER early-exit, count < 3, or all-WILD arrays.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with non-trivial logic and no JSDoc. Missing: parameter contract (ordered left-to-right payline symbols), WILD substitution behavior for leading WILDs, why SCATTER returns null, and what the returned count represents.

> **Duplicate of** `src/engine.ts:checkLine` — 100% identical algorithmic logic with property/variable name aliases only

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable [number, number, number]; should be readonly [number, number, number]. The symbols parameter in lineWins is not mutated but typed as Symbol[] instead of ReadonlyArray<Symbol>. [L4-L11] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins return type uses an inline object literal { symbol: Symbol; count: number } instead of a named type or interface. The project already has a types.ts — this return shape should be defined there. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. getPayMultiplier and lineWins are non-trivial: their param semantics (count must be 3–5, symbols[0] WILD-skipping logic) are not self-evident. [L3,L13,L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use satisfies to retain literal tuple types while still enforcing the Record shape, enabling exhaustiveness at the type level. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | PAY_TABLE is typed as Record<string, ...> instead of Record<Symbol, ...>. Since Symbol is imported and the keys are exhaustively the pay symbols, using string widens the key type unnecessarily — a misspelled symbol key silently returns 0 instead of a type error. [L4] |

### Suggestions

- Type PAY_TABLE key as Symbol and values as readonly tuples to prevent mutation and improve type safety
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    ...
  } satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Use ReadonlyArray for the lineWins symbols parameter since it is never mutated
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: ReadonlyArray<Symbol>): LineWin | null {`
- Extract the inline return type of lineWins into a named type in types.ts
  - Before: `{ symbol: Symbol; count: number } | null`
  - After: `LineWin | null  // where LineWin is defined in types.ts`
- Add JSDoc to public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the payout multiplier for a (symbol, run-length) pair.
   * @param symbol - Pay symbol (WILD/SCATTER always return 0)
   * @param count - Run length; must be 3, 4, or 5 — all other values return 0
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
