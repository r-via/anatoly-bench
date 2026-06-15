# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant for the RTP target. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The value 0.95 is clear as a percentage, but 'ANCIENT' is opaque — no explanation of which game variant this RTP applies to or how it is used.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar lookup tables found in RAG results.
- **Correction [OK]**: All multipliers match the documented paytable exactly; index layout (3-of-a-kind→[0], 4-of-a-kind→[1], 5-of-a-kind→[2]) aligns with getPayMultiplier's access pattern.
- **Overengineering [LEAN]**: Fixed data table as a typed Record with tuple values. Flat and direct — no abstraction beyond what the domain requires.
- **Tests [NONE]**: No test file exists; getPayMultiplier (sole caller) is itself untested, so no transitive coverage applies.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal constant. The symbol keys are readable, but the three-element tuple structure ([3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multipliers) is undocumented — no inline comments on the tuple indices or overall table purpose.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Correctly maps count∈{3,4,5} to row indices 0–2; missing-row guard returns 0 for WILD/SCATTER as documented.
- **Overengineering [LEAN]**: Simple index lookup with three explicit count guards. Could use `row[count - 3]` but explicit branches are equally clear with no added complexity.
- **Tests [NONE]**: No test file found. Callers src/engine.ts and src/legacy.ts are listed as importers but no test evidence was provided for those either.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: parameter descriptions, return value semantics, behavior for unknown symbols (returns 0), and that count values outside {3,4,5} also return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is identical to checkLine: both resolve a lead symbol skipping WILDs, early-return null for WILD/SCATTER leads, count consecutive matching-or-WILD symbols, and return null if count < 3. Only difference is return-object property names (symbol/count vs sym/run) and local variable names — not a semantic distinction.
- **Correction [OK]**: Leading-WILD resolution via find(s !== WILD) is correct: when symbols[0] is WILD, find skips it and returns the first pay symbol; the loop then counts WILD-or-first contiguously from position 0, matching the documented checkLine semantics. All-WILD and SCATTER-as-first-symbol cases correctly return null.
- **Overengineering [LEAN]**: Single-pass contiguous-run detector with WILD substitution. Logic is proportional to the domain rules it encodes.
- **Tests [NONE]**: No test file exists. Critical edge cases (WILD prefix substitution, SCATTER early return, count < 3 boundary, mixed WILD/symbol run) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Non-trivial logic (WILD substitution for first symbol, left-to-right consecutive run counting, SCATTER exclusion, minimum count of 3) is entirely undocumented. Parameters, return shape, and edge cases need description.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical algorithm — same WILD-resolution, same loop, same threshold check; differs only in return property names (symbol/count vs sym/run)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` tuple values are mutable at runtime. The inner type should be `readonly [number, number, number]` and the outer object `as const` or `Readonly`. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. At minimum, each should document its parameters, return type, and semantic contract (e.g. what `count` values are valid). [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` operator (TS 4.9+, idiomatic in 5.x) would validate `PAY_TABLE` entries against the tuple type while preserving the literal structure for inference, and enable `as const` narrowing without losing the type constraint. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: `PAY_TABLE` key is typed `string` instead of the imported `Symbol` union. A stray string key (e.g. a typo) passes TypeScript silently and returns `0` at runtime, masking configuration errors. Use `Record<Exclude<Symbol, "WILD" \| "SCATTER">, ...>` to encode the invariant stated in the docs. [L4] |

### Suggestions

- Type PAY_TABLE keys as valid pay symbols and make tuple values readonly
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
  // After
  type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;
  const PAY_TABLE: Record<PaySymbol, readonly [number, number, number]> = {
  ```
- Use `satisfies` + `as const` to freeze entries and get precise literal types
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    // ...
  };
  // After
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
   * Returns the base payout multiplier for a (symbol, run-length) pair.
   * @param symbol - A pay symbol (WILD/SCATTER always return 0).
   * @param count  - Consecutive run length; valid values are 3, 4, or 5.
   * @returns Multiplier to apply to lineBet, or 0 for no win.
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

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
