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

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Simple constant (0.95). No similar symbols found.
- **Correction [OK]**: Value 0.95 consistent with documented RTP target.
- **Overengineering [LEAN]**: Single numeric constant. Nothing to simplify.
- **Tests [NONE]**: No test file exists. Constant used in RTP configuration with no tests verifying its value or usage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The name hints at RTP but does not explain what 'ANCIENT' qualifies, what game configuration uses this constant, or where it is applied.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal constant used locally in getPayMultiplier at line 16
- **Duplication [UNIQUE]**: Lookup table mapping symbols to payout multipliers. No similar data structures found.
- **Correction [OK]**: All six symbol tuples match the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multipliers exactly (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md).
- **Overengineering [LEAN]**: Plain Record keyed by symbol name, values are fixed-length tuples matching the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] schema. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Internal constant backing getPayMultiplier; all six symbol rows and their payout tiers are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The tuple structure [number, number, number] is opaque without documentation explaining the indices map to 3-, 4-, and 5-of-a-kind multipliers applied to lineBet.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: Retrieves payout multiplier from PAY_TABLE by symbol and count. No similar functions found.
- **Correction [OK]**: Index mapping count→row index is correct (row[0]=3-oak, row[1]=4-oak, row[2]=5-oak); WILD/SCATTER absent from PAY_TABLE so !row guard correctly returns 0 per docs.
- **Overengineering [LEAN]**: Direct index lookup with three explicit if-branches. Could use row[count-3] but the explicit form is readable and not overengineered.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — with zero coverage of count=3/4/5 branches, unknown symbol fallback (returns 0), or boundary values like count=2.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: parameter semantics (valid count range is 3–5), return value meaning (multiplier applied to lineBet), and behavior for WILD/SCATTER or unknown symbols (returns 0).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine: identifies winning paylines by matching consecutive symbols with WILD wildcard support. Only cosmetic differences: field names (symbol/count vs sym/run) and variable names (first vs lead).
- **Correction [OK]**: WILD substitution resolves to first non-WILD pay symbol; SCATTER guard covers all-WILD and SCATTER-first cases; consecutive run count including WILDs is correct; count<3 path returns null.
- **Overengineering [LEAN]**: WILD-resolution and left-to-right counting loop are both required by documented payline rules. Logic is proportional to the problem.
- **Tests [NONE]**: No test file exists. Complex WILD-substitution and early-break logic across multiple branches (all-WILD, SCATTER lead, count<3, count>=3) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: expected input format (ordered left-to-right reel symbols), WILD substitution logic (WILD resolves to first non-WILD symbol), SCATTER exclusion, minimum match count of 3, and null return semantics.

> **Duplicate of** `src/engine.ts:checkLine` — 100% matching logic flow and semantics — both check for winning lines with WILD wildcards, differ only in return object field naming.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is typed as `Record<string, [number, number, number]>`. The key should be constrained to the imported `Symbol` union (`Record<Symbol, …>`), eliminating spurious key lookups at compile time. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE values are mutable tuples. Declaring the table `as const` or using `readonly [number, number, number]` prevents accidental mutation of payout data. [L5-L12] |
| 8 | ESLint compliance | WARN | HIGH | `symbols[0]` is accessed without a length guard. Without `noUncheckedIndexedAccess`, TypeScript infers `Symbol` rather than `Symbol \| undefined`, masking the empty-array edge case. A guard `if (!symbols.length) return null` before the destructure would satisfy both safety and lint rules like `@typescript-eslint/no-unnecessary-condition`. [L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. In a regulated-gaming domain, `ANCIENT_RTP`'s purpose and provenance are especially important to document. [L3,L14,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is a good candidate for the `satisfies` operator: `const PAY_TABLE = { … } satisfies Record<Symbol, readonly [number, number, number]>`. This preserves literal-tuple types for index narrowing while enforcing the shape constraint. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from symbol names and .anatoly/docs/. (1) `ANCIENT_RTP` carries a semantically loaded prefix ('ANCIENT') with no documentation — in regulated gaming this is ambiguous and could imply a deprecated/legacy RTP value. (2) `lineWins` (plural) returns a singular `{ symbol, count } \| null`, which is misleading; `evaluateLine` or `lineWin` would be clearer. [L3,L22] |

### Suggestions

- Constrain PAY_TABLE key to Symbol and use `satisfies` + `as const` for full type-safety and immutability
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    // …
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports, documenting the RTP constant's origin and each function's contract
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Base RTP target for the Ancient-theme game variant (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the payout multiplier for a given symbol and match count.
   * Returns 0 for WILD, SCATTER, or counts below 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Guard against empty `symbols` array to satisfy `noUncheckedIndexedAccess` and clarify intent
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
    const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];
  // After
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
    if (symbols.length === 0) return null;
    const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
