# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with zero runtime importers and no type-only importers
- **Duplication [UNIQUE]**: Simple numeric constant. No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 is consistent with standard 95% RTP target. Cannot verify against actual reel weights from this file alone, but no in-file contradiction detected.
- **Overengineering [LEAN]**: Single numeric constant representing the configured RTP. No abstraction at all.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced in getPayMultiplier function at line 15
- **Duplication [UNIQUE]**: Data structure mapping symbols to payout multipliers. No similar lookups found in RAG.
- **Correction [OK]**: All six symbol tuples [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] match the authoritative table in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/02-Architecture/02-Core-Concepts.md exactly.
- **Overengineering [LEAN]**: Plain Record mapping each pay symbol to a fixed-length tuple of three multipliers, exactly matching the documented paytable schema in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: RAG explicitly reports no similar functions found for this symbol lookup.
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2] matches the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] tuple layout. WILD and SCATTER lack a PAY_TABLE row so !row correctly returns 0, consistent with documented behaviour.
- **Overengineering [LEAN]**: Straightforward O(1) table lookup with three explicit branches for counts 3/4/5. The explicit if-chain is readable and maps directly to the domain. Using row[count-3] would be marginally shorter but the current form is not overengineered.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with zero runtime importers and no type-only importers
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine: both find leading symbol, skip WILD, count consecutive matches, return symbol+count if >= 3. Variable names differ (first vs lead, count vs run, symbol vs sym) but semantic logic is 100% interchangeable.
- **Correction [OK]**: Leading-WILD resolution, consecutive-run counting, SCATTER/all-WILD early-null returns, and minimum count=3 guard are all logically correct for a left-to-right consecutive payline evaluator. WILD substitution mid-run is handled correctly by the unified loop condition.
- **Overengineering [LEAN]**: Single-responsibility function: resolves the effective lead symbol (accounting for leading WILDs), counts the left-to-right consecutive match, and returns the result or null. Logic is compact and maps directly to documented payline evaluation semantics.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — Semantically identical — both count consecutive matching symbols allowing WILD wildcards, return null if fewer than 3 matches, differing only in variable/field naming conventions

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is declared as const (preventing reassignment) but its tuple values are mutable arrays — e.g. PAY_TABLE['CHERRY'][0] = 999 is valid at runtime. The tuples should be readonly. Additionally, `as const satisfies Record<string, readonly [number, number, number]>` would enforce both immutability and type correctness. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc comments. The paytable semantics (multiplier applied to lineBet, count range 3–5, WILD/SCATTER exclusions) are non-trivial and warrant inline documentation per project API surface. [L3, L13, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The `satisfies` operator (TS 4.9+, idiomatic in 5.x/2026) would strengthen PAY_TABLE's typing: it would catch missing/extra symbol keys against the Symbol union while preserving literal tuple types for narrowing. Currently the explicit Record<string, ...> annotation widens key inference unnecessarily. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Paytable-specific: PAY_TABLE key is typed as `string` rather than a narrower PaySymbol union (the paying subset of Symbol). This means getPayMultiplier(symbol, count) accepts any Symbol (including WILD/SCATTER) and silently returns 0 via the runtime guard, rather than being rejected at compile time. Per .anatoly/docs/04-API-Reference/02-Configuration-Schema.md, WILD and SCATTER are explicitly non-pay symbols — a type-level PaySymbol = 'CHERRY' \| 'LEMON' \| 'BELL' \| 'BAR' \| 'SEVEN' \| 'DIAMOND' would encode this invariant statically. [L5-L20] |

### Suggestions

- Make PAY_TABLE tuple values readonly using `as const satisfies` to prevent accidental mutation and leverage TypeScript 5.5+ idioms simultaneously.
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
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Introduce a PaySymbol type alias for the paying-symbol subset to eliminate the loose `string` key on PAY_TABLE and make the non-pay exclusion of WILD/SCATTER a compile-time invariant.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... };
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  type PaySymbol = 'CHERRY' | 'LEMON' | 'BELL' | 'BAR' | 'SEVEN' | 'DIAMOND';
  
  const PAY_TABLE = { ... } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  
  export function getPayMultiplier(symbol: PaySymbol, count: number): number {
  ```
- Add JSDoc to all three public exports to document semantics, parameter contracts, and return value meanings inline with the paytable API surface.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Return-to-player ratio used by the legacy ("Ancient") slot variant (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a (symbol, matchCount) pair.
   * Multiplier is applied to lineBet. Returns 0 for WILD, SCATTER, or count < 3.
   * @param symbol - The resolved (non-WILD) pay symbol.
   * @param count  - Number of consecutive matching positions (3, 4, or 5).
   */
  export function getPayMultiplier(symbol: PaySymbol, count: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `ANCIENT_RTP` (`ANCIENT_RTP`) [L3-L3]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `lineWins` (`lineWins`) [L23-L40]
