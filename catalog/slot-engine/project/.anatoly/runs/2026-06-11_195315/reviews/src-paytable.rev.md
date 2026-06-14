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
- **Duplication [UNIQUE]**: No similar constants found; single declaration.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target in the reference docs. Whether the engine achieves that RTP in practice depends on reel weights and engine logic outside this file.
- **Overengineering [LEAN]**: Single numeric constant for the RTP target. Minimal and appropriate.
- **Tests [NONE]**: No test file exists; constant is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is opaque — nothing explains what game mode or configuration this RTP applies to, or how it differs from other RTP values.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar lookup tables found in the codebase.
- **Correction [OK]**: All six symbol rows and their three multiplier tiers exactly match the paytable specified in the reference documentation.
- **Overengineering [LEAN]**: Flat Record keyed by symbol name with fixed-length tuples for 3/4/5-of-a-kind multipliers. No unnecessary indirection; tuple type directly matches the three possible run lengths.
- **Tests [NONE]**: No test file; sole caller getPayMultiplier also has no tests, so transitive coverage is absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant; leniency applied. Still, the tuple index semantics ([3-of-a-kind, 4-of-a-kind, 5-of-a-kind]) are implicit and undocumented.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly maps (symbol, count) to multiplier for counts 3/4/5; returns 0 for unknown symbols (WILD, SCATTER) and out-of-range counts. Count > 5 is unreachable with 5-reel paylines.
- **Overengineering [LEAN]**: Straightforward index lookup with explicit count guards. Three if-branches instead of `row[count-3]` is a minor style choice, not overengineering.
- **Tests [NONE]**: No test file. Used by engine.ts and legacy.ts but neither file's tests are provided or referenced.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for `count` (3–5), behavior for WILD/SCATTER symbols (returns 0), and what the returned multiplier is applied against (line bet).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is identical to checkLine: both resolve the leading non-WILD symbol, count consecutive matches allowing WILD substitution, and return the symbol+count if run >= 3. Only differences are cosmetic — return property names (symbol/count vs sym/run) and function name. The functions are fully interchangeable modulo the output shape.
- **Correction [OK]**: Leading-WILD anchor detection, consecutive-run counting with WILD substitution, and SCATTER/all-WILD null returns all match the documented payline win semantics. Empty-array input correctly yields null.
- **Overengineering [LEAN]**: Handles leading-WILD resolution, early-exit for non-pay symbols, and contiguous run counting in a single pass. Complexity matches the payline win-detection contract described in the architecture docs.
- **Tests [NONE]**: No test file. WILD-substitution logic, SCATTER short-circuit, and consecutive-count break are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Non-trivial logic: WILD substitution for the anchor symbol, left-to-right consecutive counting with WILD as wildcard, minimum run of 3, and SCATTER/all-WILD early-exit — none of this is described.

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical logic — same WILD-resolution, same consecutive-match loop, same >= 3 guard; only return-property names differ

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a module-level constant that should never mutate, but its type allows mutation of both the record and its tuple values. `as const` or `Readonly<Record<Symbol, readonly [number, number, number]>>` would seal it. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. Public API surface of a domain library should be documented. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE is a good candidate for `satisfies Record<string, [number, number, number]>` — it would preserve tuple literal types for each row while still enforcing the record shape, catching misspelled keys at definition site. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | PAY_TABLE key type is `string`, but the domain has a finite `Symbol` union. `Partial<Record<Symbol, readonly [number, number, number]>>` would surface typos or new symbols at compile time rather than silently returning `0` at runtime. `ANCIENT_RTP` also lacks a clear naming rationale — 'ANCIENT' suggests legacy provenance, but the value matches the current RTP target from the docs. [L3,L4] |

### Suggestions

- Seal PAY_TABLE with `as const` to prevent accidental mutation and preserve literal tuple types
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
    ...
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    LEMON:   [2,   5,   25],
    BELL:    [5,   20,  100],
    BAR:     [10,  40,  200],
    SEVEN:   [25,  100, 500],
    DIAMOND: [50,  250, 1000],
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to all three public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  export function lineWins(symbols: Symbol[]): ...
  // After
  /** Theoretical Return-to-Player target for the engine (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for `count` consecutive `symbol` hits.
   * Returns 0 for WILD, SCATTER, or run lengths below 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a five-symbol payline slice and returns the winning symbol and run
   * length, or null if no qualifying run exists.
   */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
