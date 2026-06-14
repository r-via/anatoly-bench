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
- **Duplication [UNIQUE]**: Standalone numeric constant. No similar symbol found in RAG.
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target exactly.
- **Overengineering [LEAN]**: Single numeric constant; minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is exported and likely used in RTP calculations — no coverage at all.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is unexplained — unclear whether this is a game variant, a configuration key, or a legacy constant. Purpose and usage context are not documented.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced in getPayMultiplier (L15).
- **Duplication [UNIQUE]**: Module-local lookup table. No similar structure found in RAG.
- **Correction [OK]**: All multiplier triples match the reference documentation table exactly.
- **Overengineering [LEAN]**: Plain Record lookup with fixed 6-entry tuple rows — correct data structure for a static paytable.
- **Tests [NONE]**: No test file exists. Module-private table drives all payout logic; untested indirectly or directly.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no JSDoc. The three-element tuple structure (index 0 = 3-of-a-kind, 1 = 4-of-a-kind, 2 = 5-of-a-kind) is implicit and undocumented. Being lenient since it is non-exported, but the tuple semantics are non-obvious.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG.
- **Correction [OK]**: Correctly indexes row[0/1/2] for counts 3/4/5; returns 0 for absent symbols (WILD, SCATTER) and out-of-range counts.
- **Overengineering [LEAN]**: Straight table lookup with three explicit count branches. `row[count - 3]` would be marginally shorter but the explicit guards are equally clear and not abstraction overhead.
- **Tests [NONE]**: No test file. Called by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: unknown symbol (returns 0), count < 3 (returns 0), counts 3/4/5 for each symbol, boundary behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of what a 'multiplier' represents (base multiplier × lineBet), parameter semantics for count, return value of 0 for WILD/SCATTER or unknown symbols, and valid count range.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers.
- **Duplication [DUPLICATE]**: Logic is identical to checkLine in src/engine.ts: both resolve the lead symbol by skipping leading WILDs, guard on WILD/SCATTER, count consecutive matching-or-WILD symbols, and return null below 3. Differences are cosmetic only — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). The two functions are interchangeable.
- **Correction [OK]**: Leading-WILD skip logic correctly finds pay symbol via find(); count loop accumulates WILD-or-matching symbols contiguously from position 0; all-WILD and SCATTER edge cases handled correctly.
- **Overengineering [LEAN]**: Single-pass loop with WILD-skip preamble; complexity is proportional to the spec requirement (leading-WILD substitution + contiguous run detection).
- **Tests [NONE]**: No test file. Complex win-line logic with WILD substitution, SCATTER early-exit, leading WILD resolution, and count threshold — all paths untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Complex WILD-substitution algorithm (leading WILDs inherit the first non-WILD symbol, SCATTER returns null) with no documentation on parameters, return value shape, or the left-to-right consecutive matching rule.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical logic — same WILD-resolution, same guard, same counting loop, same threshold; only variable and property names differ

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is a module-level payout table that is never mutated but lacks `as const` or `Readonly`. In a regulated gaming context, mutable payout data is a hygiene risk even when not exported. [L5-L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. Public API surface is entirely undocumented. [L3-L38] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` should use `satisfies` to validate entries against the record type while preserving tuple literal types for tighter index inference. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | `PAY_TABLE` key type is `string` instead of the imported `Symbol` union, losing exhaustiveness and allowing invalid symbol lookups to silently return `undefined`. Should be `Record<Symbol, ...>` (or a narrower pay-symbol-only subtype excluding WILD/SCATTER). [L5] |

### Suggestions

- Lock PAY_TABLE with `as const` and tighten key type to the pay-symbol subset
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
    ...
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Theoretical Return-to-Player ratio targeted by the engine (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a (symbol, run-length) pair.
   * WILD and SCATTER return 0.
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
