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

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target; no logic to misfire.
- **Overengineering [LEAN]**: Single named constant for the RTP value. No abstraction beyond a readable name.
- **Tests [NONE]**: No test file exists. Constant is never tested directly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. 'ANCIENT' prefix is opaque — nothing explains what configuration or context this RTP applies to, or why 0.95.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar data tables found in RAG results.
- **Correction [OK]**: All six symbol rows match the reference-doc paytable exactly (CHERRY→[2,5,25] … DIAMOND→[50,250,1000]).
- **Overengineering [LEAN]**: Fixed module-level lookup table as a typed Record. No dynamic construction, no abstraction layers — just data.
- **Tests [NONE]**: No test file exists. Transitive coverage via getPayMultiplier would apply, but getPayMultiplier itself has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private unexported constant, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and undocumented. No inline comment on the columns.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Correctly returns 0 for unknown/WILD/SCATTER symbols and maps count∈{3,4,5} to the right row index; all other counts return 0 as specified.
- **Overengineering [LEAN]**: Direct table lookup with three explicit if-branches for counts 3/4/5. Readable and minimal; `row[count-3]` would save two lines but the current form is not over-engineered.
- **Tests [NONE]**: No test file exists. Consumed by spin() and computeLegacyPayout() in engine.ts and legacy.ts — no evidence those callers are tested either.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: parameter descriptions, return semantics, and the key constraint that WILD/SCATTER return 0 (non-obvious caller behavior).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is ~97% identical to checkLine in src/engine.ts: same WILD-substitution lead detection, same null guard for WILD/SCATTER leads, same consecutive-run loop with WILD wildcard, same >= 3 threshold. Only differences are local variable names (first/count vs lead/run) and return field names (symbol/count vs sym/run). Both functions are interchangeable given an adapter at the call site.
- **Correction [OK]**: Leading-WILD skip and contiguous-count loop correctly implement the documented payline evaluation rule (skip leading WILDs to find pay symbol, count WILD-or-match from position 0, require ≥3).
- **Overengineering [LEAN]**: Single-pass scan: resolve anchor symbol (skipping leading WILDs), count contiguous matching symbols, return result or null. Each step maps directly to the documented payline win rule.
- **Tests [NONE]**: No test file exists. Edge cases like WILD-prefix resolution, SCATTER early return, count < 3, and mixed-symbol break are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of the left-to-right consecutive-match algorithm, WILD substitution logic, why SCATTER/leading-WILD lines return null, and the minimum-count threshold of 3.

> **Duplicate of** `src/engine.ts:checkLine` — 97% identical logic — both resolve WILD-skipped lead symbol, count consecutive matching/WILD symbols, and return null if run < 3; differ only in variable and return-field naming

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `PAY_TABLE` key type is `string` instead of a union of the six valid pay-symbol literals, permitting invalid string keys to silently return `undefined` rather than a compile-time error. [L5] |
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is neither `as const` nor `Readonly<Record<...>>` with `readonly` tuples, leaving the payout data mutably accessible within the module. [L5-L12] |
| 6 | Interface vs Type | WARN | MEDIUM | `lineWins` return type is an anonymous inline object `{ symbol: Symbol; count: number }` rather than the named `LineWin` type that `SpinResult.lineWins: ReadonlyArray<LineWin>` implies exists in the project. [L24] |
| 8 | ESLint compliance | WARN | HIGH | `symbols[0]` is accessed without a length guard; with `noUncheckedIndexedAccess` (part of strict+) this is `Symbol \| undefined` and the subsequent `=== "WILD"` comparison would be a type error. `ANCIENT_RTP` and `lineWins` have no static consumers — likely dead exports that a `no-unused-vars` rule configured for exports would flag. [L25] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports — `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` — have no JSDoc. Each should document parameters, return semantics, and edge cases (e.g., count outside 3–5 returns 0; empty or WILD-only arrays return null). [L3, L15, L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is an ideal candidate for `as const satisfies Record<PaySymbol, readonly [number, number, number]>`: preserves literal types, enforces key completeness at compile time, and prevents tuple mutation. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot domain: (1) `lineWins` function name collides with the `lineWins` field on `SpinResult`, creating cognitive noise; it has no static consumers, and the docs attribute line-checking to `checkLine` in `engine.ts`. (2) `ANCIENT_RTP` is unconsumed, undocumented, and the 'ANCIENT' prefix strongly implies a legacy artifact that should be removed or replaced with the canonical RTP constant used by the engine. [L3, L24-L38] |

### Suggestions

- Lock PAY_TABLE to precise literal types and prevent mutation
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    // ...
  };
  // After
  type PaySymbol = "CHERRY" | "LEMON" | "BELL" | "BAR" | "SEVEN" | "DIAMOND";
  
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base payout multiplier for a pay symbol and run length.
   * @param symbol - Matched pay symbol. WILD/SCATTER always return 0.
   * @param count - Consecutive run length (3, 4, or 5); any other value returns 0.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Guard against empty symbols array to satisfy noUncheckedIndexedAccess
  ```typescript
  // Before
  const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];
  // After
  if (symbols.length === 0) return null;
  const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];
  ```
- Use the project's LineWin named type as the return type of lineWins
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: Symbol[]): LineWin | null {`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
