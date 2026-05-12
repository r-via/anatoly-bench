# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 93% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime and 0 type-only importers
- **Duplication [UNIQUE]**: Simple constant export. No similar constants found in RAG results.
- **Correction [OK]**: Constant declaration only; no logic to evaluate.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction needed.
- **Tests [NONE]**: No test file exists. Constant exported and presumably used in RTP calculations — no coverage at all.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The value 0.95 is inferrable as a ratio, but 'ANCIENT' is opaque — no comment explains what game mode or configuration this RTP belongs to, or how it is consumed.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced locally in getPayMultiplier function at line 15
- **Duplication [UNIQUE]**: Data structure mapping symbols to payout multipliers. No similar structures found in RAG results.
- **Correction [OK]**: All six pay-symbol tuples match the documented paytable exactly.
- **Overengineering [LEAN]**: Flat Record with fixed-length tuple values maps directly to the documented (symbol, count) → multiplier structure. No unnecessary indirection.
- **Tests [NONE]**: No test file exists. Private constant but its correctness (payout values per symbol) is critical game logic with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is nowhere stated. A one-line comment would remove all ambiguity; without it the semantics must be reverse-engineered from getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: Looks up and returns payout multiplier from PAY_TABLE. No similar functions found.
- **Correction [OK]**: Guards undefined symbol rows, handles counts 3/4/5, returns 0 for WILD/SCATTER (no PAY_TABLE entry) and out-of-range counts — consistent with docs.
- **Overengineering [LEAN]**: Three explicit if-branches for counts 3/4/5 are readable and sufficient. `row[count - 3]` would be marginally shorter but the current form is not overengineered.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts and src/legacy.ts — sits on a critical business path (payout calculation). Edge cases like unknown symbol, count < 3, count > 5, and each valid count (3/4/5) for each symbol are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Missing: what 'count' represents, valid range of count values, return value of 0 for unrecognised symbols or counts outside 3–5, and that WILD/SCATTER always return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical logic to checkLine: finds first non-WILD symbol, validates it, counts consecutive matches including WILDs, returns result if count >= 3. Only differences are variable names (first/lead, count/run) and return property names (symbol/sym).
- **Correction [OK]**: WILD-leading resolution, SCATTER guard, and consecutive-run counting all behave correctly for the valid 5-symbol payline input contract.
- **Overengineering [LEAN]**: Single-pass left-to-right scan with WILD substitution logic. Every branch handles a documented rule (WILD anchor resolution, SCATTER exclusion, consecutive count). No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Complex WILD-substitution and early-break logic has multiple branches (all-WILD, leading WILD resolving to non-WILD, SCATTER short-circuit, mixed line, count < 3) — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Non-obvious behaviour includes: WILD-first resolution to the next non-WILD symbol, early-break on mismatch, null return for SCATTER/all-WILD lines, and the 3-symbol minimum threshold. None of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — 100% identical logic and behavior; semantic contract is identical (evaluate line of symbols for winning matches). Only cosmetic differences in naming.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable at runtime (e.g. PAY_TABLE['CHERRY'][0] = 999 is valid). Should use readonly tuples or as const. [L5] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline object type instead of a named interface or type alias. The project defines LineWin in src/types.ts; an intermediate named type for this return would be more consistent. [L22] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | ANCIENT_RTP, getPayMultiplier, and lineWins are all exported with no JSDoc. ANCIENT_RTP's name alone does not communicate its units, context, or why it is named 'ANCIENT'. [L3,L13,L22] |
| 13 | Security | WARN | HIGH | Regulated gambling domain inferred from symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND), ANCIENT_RTP constant, and project files reels.ts / jackpot.ts / freespin.ts / rng.ts. PAY_TABLE tuple values are mutable at runtime (overlaps Rule 5) — payout multipliers can be altered without re-certification, which is a compliance risk in regulated gaming. No hardcoded secrets, eval, or injection vectors present. [L5-L11] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from satisfies + as const: preserves narrow literal tuple types, enforces the Record shape, and eliminates the need for the explicit type annotation. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | PAY_TABLE key type is string, not Symbol. Lookups with invalid symbol names silently return undefined. Changing to Record<Symbol, ...> or a Map<Symbol, ...> would surface invalid keys at compile time. [L5] |

### Suggestions

- Make PAY_TABLE deeply immutable, key-narrowed to the Symbol union, and inferred via satisfies + as const.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
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
- Add JSDoc to all three public exports; ANCIENT_RTP especially needs context for its name and purpose.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** RTP (Return to Player) for the legacy paytable — 95%. Retained for historical audit trails. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the payout multiplier for `symbol` matched `count` times consecutively (3–5).
   * Returns 0 for unsupported symbols or counts outside [3, 5].
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a single payline's symbol sequence left-to-right.
   * Returns the winning symbol and run length, or null if fewer than 3 consecutive symbols match.
   */
  export function lineWins(symbols: Symbol[]): LineMatch | null {
  ```
- Extract the inline return type of lineWins into a named intermediate type for consistency with the project's interface conventions.
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  type LineMatch = { readonly symbol: Symbol; readonly count: number };
  export function lineWins(symbols: Symbol[]): LineMatch | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
