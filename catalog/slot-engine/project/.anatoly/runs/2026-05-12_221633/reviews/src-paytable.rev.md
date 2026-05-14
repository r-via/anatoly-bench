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

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Single constant; no similar definitions found in RAG results
- **Correction [OK]**: Constant correctly reflects the documented 95% RTP target.
- **Overengineering [LEAN]**: Single constant matching the documented 95% RTP target. No complexity.
- **Tests [NONE]**: No test file exists. Constant used for RTP configuration — no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The name hints at a return-to-player ratio but 'ANCIENT' prefix, the specific value 0.95, and its intended usage context are unexplained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported symbol referenced in getPayMultiplier (line 15)
- **Duplication [UNIQUE]**: Game-specific lookup table; no similar structures found in RAG results
- **Correction [OK]**: Structure is consistent: three-element tuples map to 3-, 4-, 5-of-a-kind counts; getPayMultiplier accesses the correct indices.
- **Overengineering [LEAN]**: Plain static lookup table. Tuple type [number,number,number] cleanly models the three pay tiers (3/4/5-of-a-kind) without unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Private constant backing getPayMultiplier — untested indirectly and directly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The tuple structure [number, number, number] maps to 3/4/5-of-a-kind multipliers, but this is not stated anywhere — readers must infer it from getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers (src/engine.ts, src/legacy.ts)
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Index mapping count→row index is correct (3→0, 4→1, 5→2); missing PAY_TABLE entry and out-of-range counts both return 0 safely.
- **Overengineering [LEAN]**: Straightforward index lookup. Three explicit if-branches instead of row[count-3] is marginally verbose but readable and not over-engineered.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts (critical payout paths), yet count=3/4/5 branches, unknown symbol fallback, and count<3 return-0 path are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing description of what 'count' represents (matching symbols on a line), valid count range, return semantics (0 for no win), and relationship to PAY_TABLE.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine: leading symbol detection with WILD handling, consecutive symbol counting, and count >= 3 threshold. Differs only in return field names (symbol vs sym, count vs run) and local variable names.
- **Correction [OK]**: Left-to-right counting is correct; leading-WILD resolution via find() is in-order so effective symbol is correctly identified; SCATTER early-return is correct; all-WILD fallback to null is internally consistent though unusual — no documented invariant contradicts it.
- **Overengineering [LEAN]**: Left-to-right consecutive match scan with WILD substitution. Handles the documented wild/scatter distinctions directly with no superfluous abstraction.
- **Tests [NONE]**: No test file exists. WILD-prefix resolution, SCATTER early-return, mid-line break logic, count<3 null return, and all-WILD edge case are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD substitution logic, SCATTER exclusion, left-to-right consecutive matching, minimum count of 3, and null-on-no-win semantics are all undocumented.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical implementation; same algorithm and control flow with only cosmetic naming differences in return fields and variables

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE uses `Record<string, [number, number, number]>` but the domain key is `Symbol`. Using `string` widens the key to any string, bypassing the Symbol type constraint. Should be `Record<Symbol, readonly [number, number, number]>`. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable `[number, number, number]`. Should be `readonly [number, number, number]` to prevent accidental mutation of pay-table rows at runtime. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. At minimum, `getPayMultiplier` and `lineWins` need `@param` and `@returns` docs for a library-level paytable module. [L3,L14,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` uses a type annotation cast rather than the `satisfies` operator. Using `satisfies Record<Symbol, readonly [number, number, number]>` would preserve the literal tuple types for exhaustiveness while still constraining the shape. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. The return type `{ symbol: Symbol; count: number }` is the per-line win object — the README contract names this `LineWin` (used in `SpinResult.lineWins: ReadonlyArray<LineWin>`). The inline type should be extracted to a named `LineWin` type and reused across the codebase for consistency with the README contract. [L22] |

### Suggestions

- Narrow PAY_TABLE key type to Symbol and make tuples readonly
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    // ...
  } satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Extract inline return type to a named LineWin type matching the README contract
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  // in types.ts
  export interface LineWin { symbol: Symbol; count: number; }
  
  // in paytable.ts
  export function lineWins(symbols: Symbol[]): LineWin | null {
  ```
- Add JSDoc to public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the payout multiplier for a symbol appearing `count` times on a line.
   * @param symbol - The matched symbol.
   * @param count - Number of consecutive matches (3–5).
   * @returns Multiplier from the pay table, or 0 if no qualifying win.
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
