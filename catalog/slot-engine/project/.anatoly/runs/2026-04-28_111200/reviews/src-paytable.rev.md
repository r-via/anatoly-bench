# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 88% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers per exhaustive import analysis
- **Duplication [UNIQUE]**: Simple numeric constant with no similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the 95% RTP target documented in project references.
- **Overengineering [LEAN]**: Single numeric constant for the return-to-player value. As minimal as it gets.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced locally in getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Unique lookup table mapping symbols to payout tuples. No similar data structures reported.
- **Correction [OK]**: All six symbol rows exactly match the multiplier table in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/02-Architecture/02-Core-Concepts.md.
- **Overengineering [LEAN]**: Plain object literal keyed by symbol name, with fixed-length 3-tuples for 3/4/5-of-a-kind multipliers. Exactly matches the canonical paytable documented in `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. No abstraction layer, no class, no generics — data only.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers (src/engine.ts, src/legacy.ts)
- **Duplication [UNIQUE]**: Indexes PAY_TABLE and returns value by count threshold. No similar functions found in RAG.
- **Correction [OK]**: Index mapping count→row[0/1/2] is correct; WILD/SCATTER return 0 as documented.
- **Overengineering [LEAN]**: Straightforward O(1) lookup with three explicit index comparisons for count 3/4/5. A direct index map (count - 3) would save two lines but the current form is equally clear and short. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers per exhaustive import analysis
- **Duplication [DUPLICATE]**: Identical core logic to checkLine: determines first non-WILD symbol, rejects WILD/SCATTER, counts consecutive matches including WILDs, stops at first mismatch, returns result if count >= 3. Only differences are variable names (first→lead, count→run, symbol→sym) and return field names.
- **Correction [NEEDS_FIX]**: Return value omits wildCount, making the documented wild-bonus payout formula uncomputable by callers.
- **Overengineering [LEAN]**: Single-responsibility function: resolve effective leading symbol (WILD substitution), count the consecutive run, gate on minimum 3 matches. Complexity matches the documented WILD-substitution mechanic. The early-exit loop is idiomatic and appropriate for a left-to-right payline scan.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — 92% functionally identical — same algorithm, same input/output semantics, differs only in naming conventions

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | The return type of `lineWins` is an inline anonymous `{ symbol: Symbol; count: number }` that is a strict structural subset of the documented `LineWin` interface (`src/types.ts`, referenced in `.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md`). Using `Pick<LineWin, 'symbol' \| 'count'>` would express the intent more precisely, reuse the canonical interface, and keep the codebase DRY. [L23] |
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is a module-level constant whose values are mutable at runtime because neither the record nor the tuple arrays carry `readonly` modifiers. The tuple type `[number, number, number]` should be `readonly [number, number, number]`, and the outer type should be `Readonly<Record<...>>`. Better still, using `as const satisfies` (see Rule 16) would freeze both levels at zero runtime cost. [L4-L11] |
| 6 | Interface vs Type | WARN | MEDIUM | The project's documented convention (`.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md`) uses named `interface` declarations (e.g., `LineWin`). The inline return type `{ symbol: Symbol; count: number }` in `lineWins` bypasses this convention. Extracting it into a named type or reusing `Pick<LineWin, 'symbol' \| 'count'>` would be more consistent. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `ANCIENT_RTP` is particularly ambiguous — the `ANCIENT_` prefix suggests a theme or legacy context that is not explained. `getPayMultiplier` and `lineWins` expose domain logic that callers should not have to reverse-engineer. [L3, L13, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is declared with an explicit wide type annotation (`Record<string, [number, number, number]>`) which discards the literal key information available at definition time. The `satisfies` operator (TS 4.9+, stable in 5.x) combined with `as const` would simultaneously enforce the structural constraint and preserve narrow literal types for key exhaustiveness and tuple narrowing. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | In a typed slot-machine codebase, `PAY_TABLE` is keyed with the broad `string` type (`Record<string, ...>`) rather than the domain `Symbol` union imported from `./types.js`. This means the compiler cannot warn if a new symbol is added to the `Symbol` union but omitted from the pay table, and `getPayMultiplier` silently returns `0` for any misspelled or unknown key. Using `Partial<Record<Symbol, readonly [number, number, number]>>` (or a more precise paying-symbols union) would make such omissions a compile-time error rather than a silent runtime zero. |

### Suggestions

- Lock PAY_TABLE with `as const satisfies` to enforce readonly, preserve literal types, and gain compile-time exhaustiveness on the Symbol union.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  };
  // After
  type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;
  
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Replace the inline anonymous return type of `lineWins` with `Pick<LineWin, 'symbol' | 'count'>` to reuse the canonical `LineWin` interface and stay consistent with project conventions.
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  import type { Symbol, LineWin } from "./types.js";
  
  /** @returns The matched symbol and run length, or null if no qualifying run exists. */
  export function lineWins(symbols: Symbol[]): Pick<LineWin, "symbol" | "count"> | null {
  ```
- Add JSDoc to all three public exports to document the `ANCIENT_` prefix context, parameter semantics, and edge cases.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  ...
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  ...
  
  export function lineWins(symbols: Symbol[]): ...
  // After
  /** Return-to-player ratio for the Ancient theme (95%). Applied during payout calculation. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base pay multiplier for a given symbol and match count.
   * @param symbol - A paying symbol (WILD and SCATTER always return 0).
   * @param count  - Number of consecutive matches (3–5); values outside this range return 0.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a single payline window and returns the winning symbol+count if a
   * qualifying run of 3–5 is found from the left, respecting WILD substitution.
   * @returns `{ symbol, count }` or `null` when no match qualifies.
   */
  export function lineWins(symbols: Symbol[]): ...
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add `wildCount: number` to the return type of `lineWins` and populate it inside the counting loop (increment a separate `wildCount` variable when `s === 'WILD'`). Callers need this value to apply the wild-bonus formula `(1 + wildCount) × 2^wildCount` to the base multiplier. [L23]
- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `ANCIENT_RTP` (`ANCIENT_RTP`) [L3-L3]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `lineWins` (`lineWins`) [L23-L40]
