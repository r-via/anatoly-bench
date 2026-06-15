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

- **Utility [DEAD]**: Exported constant with zero runtime importers and zero type-only importers
- **Duplication [UNIQUE]**: Constant export with no similar patterns found
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target exactly.
- **Overengineering [LEAN]**: Simple numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is opaque — unclear whether it refers to a game variant, a legacy value, or something else. Purpose and provenance of 0.95 are not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal constant used by getPayMultiplier on line 15
- **Duplication [UNIQUE]**: Constant mapping structure with no similar definitions found
- **Correction [OK]**: All six symbol rows match the reference-doc paytable exactly (3/4/5-of-a-kind multipliers).
- **Overengineering [LEAN]**: Flat record mapping symbols to fixed tuple — minimal and appropriate for a static paytable.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private constant, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and nowhere stated. A one-line comment would suffice.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with runtime imports from src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG results
- **Correction [OK]**: Correctly maps count∈{3,4,5} to row indices 0/1/2; returns 0 for unknown symbols (covering WILD and SCATTER) and counts outside {3,4,5}.
- **Overengineering [LEAN]**: Straightforward index lookup with three explicit count checks; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for valid symbols, unknown symbols, or count boundary values (2, 3, 4, 5, 6).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API. Missing: parameter semantics for `count`, valid range of `count`, return value meaning, and that WILD/SCATTER return 0 (non-obvious edge case).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with zero runtime importers and zero type-only importers
- **Duplication [DUPLICATE]**: RAG score 0.823; identical logic to checkLine in engine.ts, differs only in variable/field naming (count vs run, first vs lead, symbol vs sym)
- **Correction [OK]**: Leading-WILD skip via find(s => s !== 'WILD') correctly identifies the pay symbol; contiguous count loop from position 0 handles WILD substitution; all-WILD and SCATTER-leading cases return null correctly.
- **Overengineering [LEAN]**: Single-pass contiguous-run counter with WILD substitution; logic is minimal for the task.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER short-circuit, leading WILD resolution, and count threshold (< 3 returns null) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API with non-trivial logic: WILD-as-substitute for first symbol, SCATTER exclusion, left-to-right consecutive run requirement, minimum count of 3. None of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — Counts consecutive matching symbols treating WILD as wildcard, returns null for WILD/SCATTER lead or <3 matches; logic flow identical, implementation differs only in naming conventions

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is mutable at runtime — tuple elements can be overwritten. Should use `as const` or `Readonly<Record<string, readonly [number, number, number]>>`. [L4-L11] |
| 6 | Interface vs Type | WARN | MEDIUM | `lineWins` returns an anonymous inline object type `{ symbol: Symbol; count: number }`. Given the project has `types.ts`, this shape should be a named export (e.g. `LineWin`) for API clarity and reuse. [L22] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. For a game-logic library, documenting parameter semantics (what `count` means, valid range, WILD/SCATTER behavior) is especially important. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` should use `as const satisfies Record<...>` to retain literal tuple types while preserving type-safety validation. Current annotation widens the tuple elements to `number`. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine domain. Two issues: (1) `PAY_TABLE` key is typed as `string` rather than a constrained union of pay-symbol strings, allowing any string key to silently return `undefined`. (2) `ANCIENT_RTP` is an exported constant with an opaque name — nothing links it to the engine's configured RTP or documents that it is the canonical 95% target. A consuming module could import it unknowingly using a stale value. [L3,L4] |

### Suggestions

- Use `as const` on PAY_TABLE to get literal tuple types and prevent mutation
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
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
  } as const satisfies Record<string, [number, number, number]>;
  ```
- Name the anonymous return type of lineWins and move it to types.ts
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  // in types.ts
  export interface LineWin { symbol: Symbol; count: number; }
  
  // in paytable.ts
  export function lineWins(symbols: Symbol[]): LineWin | null {
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  export function lineWins(symbols: Symbol[]): ...
  // After
  /** Theoretical Return-to-Player target (95%). Used by the engine for RTP validation. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a (symbol, run-length) pair.
   * Returns 0 for WILD, SCATTER, or runs shorter than 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a 5-symbol payline left-to-right, respecting WILD substitution.
   * Returns the matching symbol and run count, or null if no win (< 3 matches).
   */
  export function lineWins(symbols: Symbol[]): LineWin | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
