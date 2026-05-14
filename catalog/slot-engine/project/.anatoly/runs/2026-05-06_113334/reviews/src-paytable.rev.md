# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 93% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers. No files import this symbol.
- **Duplication [UNIQUE]**: Simple numeric constant with no similar symbols found in RAG results
- **Correction [OK]**: Value 0.95 is internally consistent with the project's stated 95% RTP target; no contradicting code constant visible in this file.
- **Overengineering [LEAN]**: Single numeric constant exported for use elsewhere. No indirection, no abstraction — as minimal as a value can be.
- **Tests [NONE]**: No test file exists for this module. ANCIENT_RTP is a simple exported constant but its usage in engine.ts and legacy.ts is untested at the source level.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. The constant name suggests a Return-to-Player value and the 0.95 figure is plausible, but 'ANCIENT' is opaque — it is unclear whether this refers to a game theme, a configuration mode, or a legacy preset. Purpose, units, and usage context are entirely absent.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced locally on line 17 within getPayMultiplier function. Used to look up pay multipliers by symbol.
- **Duplication [UNIQUE]**: Pay table lookup structure mapping symbols to payout multipliers; no similar data structures found in RAG results
- **Correction [OK]**: All six symbol rows exactly match the multiplier table in .anatoly/docs/02-Architecture/02-Core-Concepts.md; tuple index order [3-of, 4-of, 5-of] is consistent with getPayMultiplier usage.
- **Overengineering [LEAN]**: A flat Record mapping each symbol name to a fixed 3-tuple. Mirrors the documented paytable in `.anatoly/docs/02-Architecture/02-Core-Concepts.md` exactly. No class, no builder, no dynamic generation — just the data.
- **Tests [NONE]**: No test file found. PAY_TABLE is a module-private constant but its correctness (payout values for all 6 symbols across 3 count tiers) is never validated by any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no JSDoc/TSDoc. The name is self-descriptive but the tuple layout [number, number, number] — representing 3-of-a-kind, 4-of-a-kind, and 5-of-a-kind multipliers respectively — is not obvious and is not documented anywhere inline. Leniency applied for non-exported private data; confidence reduced accordingly.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts and src/legacy.ts. Active and necessary usage.
- **Duplication [UNIQUE]**: RAG found computeLegacyPayout (score 0.707, below 0.82 threshold) which has different purpose — computeLegacyPayout extracts/validates symbol and counts matches, then calls getPayMultiplier as a helper function. Different signatures and semantic contracts.
- **Correction [OK]**: Lookup uses correct tuple indices (row[0]=3-of, row[1]=4-of, row[2]=5-of), guards against missing symbol with falsy check, and returns 0 for unsupported counts including WILD/SCATTER.
- **Overengineering [LEAN]**: Straight O(1) table lookup with three explicit branch arms for counts 3/4/5. Each arm corresponds directly to a column in the documented paytable. The explicit branches are slightly more readable than an index expression (`row[count - 3]`) and carry negligible overhead — not overengineering.
- **Tests [NONE]**: No test file exists. This function is imported by two callers (engine.ts, legacy.ts) making it a critical business-logic path. Edge cases like unknown symbols, count < 3, count === 3/4/5, and count > 5 are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc/TSDoc comment. Missing documentation for both parameters (what 'count' valid range is, what happens outside 3–5), the return value meaning (multiplier applied to what base?), and the edge case where an unknown symbol returns 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers. No files import or use this symbol.
- **Duplication [DUPLICATE]**: Identical logic to checkLine in src/engine.ts (RAG score 0.831 >= 0.82 threshold). Both extract first non-WILD symbol, validate it's not WILD/SCATTER, count consecutive matches (including WILDs), and return if count >= 3. Only differences are variable naming (first vs lead, count vs run) and return field naming (symbol vs sym).
- **Correction [OK]**: Leading-WILD resolution via symbols.find is correct for left-to-right payline semantics; count loop breaks on first non-matching non-WILD; SCATTER guard and all-WILD fallback are handled correctly.
- **Overengineering [LEAN]**: Single-pass left-to-right scan that resolves the anchor symbol (skipping leading WILDs), counts the run, and returns early on a non-match. All logic is necessary to satisfy the documented WILD-substitution rules. No helper classes, no strategy objects, no configuration — minimal for the job.
- **Tests [NONE]**: No test file exists. lineWins has non-trivial logic including WILD substitution, SCATTER early-return, consecutive matching with early break, and a count >= 3 threshold — all edge cases are completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc/TSDoc comment. The non-trivial WILD substitution logic (leading WILDs resolved to the first non-WILD symbol), left-to-right contiguous counting, SCATTER exclusion, and the null return semantics are all undocumented. The return shape { symbol, count } also lacks explanation of what 'count' represents.

> **Duplicate of** `src/engine.ts:checkLine` — 95% identical logic — both functions extract the first non-WILD symbol, validate it is not WILD or SCATTER, count consecutive matches, and return symbol info if count >= 3. Differences are purely in naming conventions.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `PAY_TABLE` uses `Record<string, ...>` as the key type. Since `Symbol` is an imported literal union, `Partial<Record<Symbol, readonly [number, number, number]>>` would be more precise and close the door on arbitrary string key look-ups. Additionally, the `lineWins` return type is an anonymous inline shape that overlaps with the documented `LineWin` interface (`.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md`); `Pick<LineWin, 'symbol' \| 'count'>` would avoid type duplication. [L5] |
| 5 | Immutability | WARN | MEDIUM | The pay-table tuple values are typed as mutable `[number, number, number]`. Because `PAY_TABLE` is a module-level constant that must never be mutated, the tuple elements should be `readonly [number, number, number]` (or the whole object declared `as const`). [L5-L12] |
| 6 | Interface vs Type | WARN | MEDIUM | The `lineWins` function returns an anonymous inline object type `{ symbol: Symbol; count: number }` rather than a named type. The project explicitly defines a `LineWin` interface in `types.ts` (per `.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md`); re-using `Pick<LineWin, 'symbol' \| 'count'>` would maintain naming consistency and make the partial shape traceable. [L22] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. At minimum, `getPayMultiplier` and `lineWins` should document their parameter contracts and return semantics, especially because `count` is only meaningful in the range 3–5. [L3, L14, L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is a strong candidate for the `satisfies` operator (available since TS 4.9, standard in 5.x): it would validate the shape against the intended type while preserving literal tuple types for downstream narrowing, improving type precision without a runtime cost. [L5-L12] |

### Suggestions

- Use `Partial<Record<Symbol, readonly [number, number, number]>>` for a more precise and immutable PAY_TABLE type
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    ...
  };
  // After
  const PAY_TABLE: Partial<Record<Symbol, readonly [number, number, number]>> = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    ...
  };
  ```
- Apply the `satisfies` operator to PAY_TABLE to validate the shape while preserving literal types
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
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Base return-to-player ratio for the Ancient theme (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base pay multiplier for a matching symbol run.
   * @param symbol - The matched reel symbol (must not be WILD or SCATTER).
   * @param count - Number of consecutive matches from the left (3, 4, or 5).
   * @returns The multiplier to apply to the line bet, or 0 for no qualifying match.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a single payline's symbol sequence and returns the win result.
   * @param symbols - Ordered reel symbols along the payline (left to right).
   * @returns Matched symbol and count if a qualifying run of 3+ is found, or null.
   */
  export function lineWins(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {
  ```
- Replace the anonymous return type of lineWins with Pick<LineWin, 'symbol' | 'count'> to reuse the documented interface
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
