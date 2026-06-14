# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists. Constant is used by engine.ts and legacy.ts but has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is non-obvious — it's unclear whether this is a theoretical RTP, a game-mode-specific RTP, or a legacy value. Purpose and usage context are undocumented.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced in getPayMultiplier (L15) on every call.
- **Duplication [UNIQUE]**: No similar lookup table found in RAG results.
- **Correction [OK]**: All multiplier triples match the reference paytable exactly.
- **Overengineering [LEAN]**: Flat lookup table mapping 6 symbols to fixed 3-element tuples. No abstraction beyond what the data requires.
- **Tests [NONE]**: No test file exists. Internal table is exercised indirectly via getPayMultiplier but has zero direct or indirect test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported private constant so leniency applies, but the tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is not self-evident from the type alone. An inline comment on the tuple indices would suffice.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly maps (symbol, count∈{3,4,5}) to multiplier; returns 0 for unknown symbols and out-of-range counts.
- **Overengineering [LEAN]**: Straight table lookup with three explicit if-branches for counts 3/4/5. Could use `row[count - 3]` but neither form is overengineered.
- **Tests [NONE]**: No test file exists. Function handles unknown symbols (returns 0), count branches 3/4/5, and out-of-range counts — none are tested. Used in critical payout paths in engine.ts and legacy.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc. Missing: what 'count' represents (run length), valid range for count, return value semantics (base multiplier, not a payout), and the fact that WILD/SCATTER return 0.

#### `lineWins` (L23–L40)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts.
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine in src/engine.ts. Both resolve a leading symbol (treating WILD as wildcard), guard against all-WILD/SCATTER, count the consecutive run, and return null if run < 3. Differences are purely cosmetic: variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run).
- **Correction [OK]**: Correctly skips leading WILDs to identify the pay symbol, counts contiguous (matching|WILD) from position 0, returns null when all-WILD or pay symbol is SCATTER, and gates on count≥3.
- **Overengineering [LEAN]**: Single-pass contiguous-run counter with WILD substitution and leading-WILD resolution. Complexity matches the payline evaluation contract.
- **Tests [NONE]**: No test file exists. Complex logic covering WILD substitution, SCATTER early-return, consecutive-match counting, and minimum-count threshold — all untested. Used in engine.ts and legacy.ts payout paths.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function with no JSDoc. Non-obvious behavior: WILD-first resolution picks the first non-WILD symbol as the anchor, SCATTER/all-WILD lines return null, and the function only counts a contiguous prefix run. None of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — ~97% identical logic — same WILD-resolution, same loop, same >=3 guard; only variable and return-property names differ

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE entries are mutable at runtime (tuple type is not readonly, Record values are not Readonly). `symbols` parameter in `lineWins` is not mutated but typed as mutable `Symbol[]`. [L5-L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `getPayMultiplier` and `lineWins` are non-trivial functions with domain-specific semantics that warrant documentation. [L3-L39] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` would benefit from `satisfies` to validate shape while retaining literal types, and `as const` on tuple entries for narrower readonly inference. Neither is applied. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: PAY_TABLE key is `string` instead of the imported `Symbol` union type, losing exhaustiveness guarantees that matter for payout correctness. `ANCIENT_RTP` is exported but the name implies a legacy/deprecated value — callers relying on it for current RTP calculations may be misconfigured. [L3-L5] |

### Suggestions

- Type PAY_TABLE key with the imported Symbol union and freeze entries with `as const` / readonly tuples
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = { ... };`
  - After: `const PAY_TABLE: Readonly<Record<Symbol, readonly [number, number, number]>> = { ... } satisfies Readonly<Record<Symbol, readonly [number, number, number]>>;`
- Mark `symbols` parameter as readonly since `lineWins` never mutates it
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: readonly Symbol[]): ...`
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number { ... }
  
  export function lineWins(symbols: Symbol[]): ...
  // After
  /** Theoretical RTP for the legacy paytable variant (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base pay multiplier for `symbol` matched `count` times (3–5).
   * Returns 0 for WILD, SCATTER, or any unrecognised symbol.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number { ... }
  
  /**
   * Evaluates a single payline of symbols, returning the matching pay-symbol
   * and contiguous run length, or null if no 3+-symbol win is present.
   */
  export function lineWins(symbols: readonly Symbol[]): ...
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
