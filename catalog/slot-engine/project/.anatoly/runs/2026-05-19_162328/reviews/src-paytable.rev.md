# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime and 0 type-only importers.
- **Duplication [UNIQUE]**: Simple numeric constant; no similar symbols found
- **Correction [OK]**: Constant correctly set to 0.95 matching the documented 95% RTP target.
- **Overengineering [LEAN]**: Single constant export matching the documented 95% RTP target.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is unexplained — unclear whether this is a game-mode-specific RTP, a default, or a named constant for a particular configuration.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal constant referenced by getPayMultiplier on line 15.
- **Duplication [UNIQUE]**: Data structure mapping symbols to payout arrays; no duplicates found
- **Correction [OK]**: Data structure is well-formed; three-tuple entries map to 3-, 4-, and 5-match payouts.
- **Overengineering [LEAN]**: Plain Record lookup table; tuple type is minimal and appropriate for 3-column paytable data.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no JSDoc. The three-element tuple has no labels; readers must infer that indices map to 3-, 4-, and 5-symbol match payouts from the implementation of getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Index mapping is correct (count 3→row[0], 4→row[1], 5→row[2]); returns 0 for unknown symbols and out-of-range counts.
- **Overengineering [LEAN]**: Three explicit if-branches for counts 3/4/5 are readable and appropriate; index arithmetic (`count-3`) would be marginally shorter but this is not overengineering.
- **Tests [NONE]**: No test file exists. Critical function imported by engine.ts and legacy.ts — missing coverage for valid symbols at counts 3/4/5, unknown symbols (returns 0), count < 3 (returns 0), and count > 5 (returns 0).
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what `count` represents, valid range, return value semantics (multiplier vs. absolute payout), and behavior when symbol is absent from PAY_TABLE.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers.
- **Duplication [DUPLICATE]**: Nearly identical implementation to checkLine; both execute the same algorithm: extract leading symbol (skipping WILD), count consecutive matches, return symbol+count or null if count < 3
- **Correction [OK]**: Leading-WILD resolution via find(s => s !== 'WILD') correctly identifies the substituted symbol; SCATTER guard covers both direct and WILD-prefixed SCATTER cases; consecutive-run counter properly breaks on first non-matching non-WILD symbol.
- **Overengineering [LEAN]**: WILD-skip logic and consecutive-match loop are the minimal implementation needed for payline evaluation with wilds.
- **Tests [NONE]**: No test file exists. Missing coverage for WILD-leading lines, SCATTER returns null, runs broken before count 3, exact match at 3/4/5, all-WILD input, and mixed WILD+symbol sequences.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with non-trivial WILD-substitution logic and a minimum-count-of-3 rule. No JSDoc explaining the WILD promotion algorithm, why WILD/SCATTER leads return null, or the left-to-right contiguous matching constraint.

> **Duplicate of** `src/engine.ts:checkLine` — Identical algorithm with variable/property name differences: first→lead, count→run, symbol→sym

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is `const` but its type allows mutation of both the record and the tuple values. In a regulated slot context the pay table must be structurally immutable. Should be `Record<string, readonly [number, number, number]>` (or `as const`). [L4-L11] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `ANCIENT_RTP` in particular needs documentation explaining why it is named "ANCIENT" and what game context it applies to. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` would benefit from the `satisfies` operator to retain literal types while still enforcing the `Record` shape, enabling exhaustiveness and IDE autocomplete on symbol keys. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: `PAY_TABLE` key type is `string` instead of `Symbol`. A typo or unknown symbol silently returns `0` at runtime via `getPayMultiplier`. In a regulated paytable this is a correctness risk — `Record<Exclude<Symbol, 'WILD' \| 'SCATTER'>, readonly [number, number, number]>` or a similar constrained key type would catch invalid references at compile time. [L4-L11] |

### Suggestions

- Make PAY_TABLE structurally immutable and key it by the `Symbol` union to catch invalid lookups at compile time
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    ...
  // After
  type PayableSymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;
  
  const PAY_TABLE: Readonly<Record<PayableSymbol, readonly [number, number, number]>> = {
    CHERRY: [2, 5, 25],
    ...
  } satisfies Record<PayableSymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports, explaining ANCIENT_RTP naming
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Theoretical RTP for the classic ("ancient") reel configuration. Must equal 0.95 per spec. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the payout multiplier for `symbol` appearing `count` times in a row.
   * Returns 0 for counts below 3 or unknown symbols.
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
