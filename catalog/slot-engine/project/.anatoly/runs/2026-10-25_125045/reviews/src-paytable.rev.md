# Review: `src/paytable.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: Simple exported numeric constant. No RAG similarity data; no comparable constant found.
- **Correction [OK]**: Constant value 0.95 is internally consistent; no callers to propagate a wrong value to.
- **Overengineering [LEAN]**: Single exported constant, no complexity.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: Module-private lookup table defining pay multipliers per symbol. No RAG similarity data; no comparable table found.
- **Correction [OK]**: Record structure is well-formed; tuples are [3-match, 4-match, 5-match] and are referenced correctly by getPayMultiplier.
- **Overengineering [LEAN]**: Flat lookup table keyed by symbol name; tuple-per-row is minimal and appropriate for 3-count tiers.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: RAG reports no similar functions. Sole multiplier-lookup helper; consumed by both engine.ts and legacy.ts.
- **Correction [OK]**: Row lookup and exact-equality count dispatch (3/4/5) are correct; returns 0 for missing symbol or out-of-range count, both valid no-win cases.
- **Overengineering [LEAN]**: Straightforward table lookup with three explicit count guards. Could use `row[count - 3]` but the explicit form is equally minimal and more readable.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is functionally identical to checkLine in src/engine.ts: both resolve the lead symbol by skipping WILDs, guard against WILD/SCATTER leads, count a consecutive matching run, and return null for runs < 3. Only differences are return property names (symbol/count vs sym/run) and variable names (first/count vs lead/run). RAG score 0.827 confirms high similarity.
- **Correction [OK]**: Base-symbol derivation correctly skips leading WILDs, guards SCATTER and all-WILD lines, and the counting loop correctly treats WILD as a match for any base symbol.
- **Overengineering [LEAN]**: Handles WILD-at-start substitution, SCATTER guard, and consecutive-match counting in one tight pass — each branch maps to a real game rule with no gratuitous abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical algorithm — same WILD-resolution, same SCATTER guard, same consecutive-run loop, same ≥3 threshold; differs only in return property names

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` tuple entries are mutable (no `readonly` qualifier on tuple, no `as const`). The `symbols` parameter in `lineWins` should be `readonly Symbol[]` to signal it is not mutated. [L5-L11] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports — `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` — lack JSDoc comments. Consumers cannot discover intent or parameter contracts without reading the implementation. [L3-L38] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is annotated with a wide `Record<string, [number, number, number]>`. Using `satisfies` would preserve the literal key types while still enforcing the value shape, enabling compile-time key exhaustiveness. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | `PAY_TABLE` key type is `string`, but the lookup is always by `Symbol`. Typing the key as `Record<Symbol, ...>` (or `Partial<Record<Symbol, ...>>`) narrows the index to only valid symbol names and removes the need for the `if (!row) return 0` guard. With `Record<string, ...>`, an invalid key silently returns `undefined` at runtime with no TS feedback. [L5] |

### Suggestions

- Use `satisfies` + `as const` for PAY_TABLE to lock literal keys and enforce readonly tuples
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY: [2, 5, 25],
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
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Mark `symbols` parameter as readonly to reflect the pure, non-mutating contract
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: readonly Symbol[]): ...`
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number { ... }
  
  export function lineWins(symbols: Symbol[]): ... { ... }
  // After
  /** Return-to-player ratio for ancient/classic machine configuration. */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the payout multiplier for `symbol` when `count` reels match.
   * Returns 0 for fewer than 3 matches or unknown symbols.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number { ... }
  
  /**
   * Evaluates a single payline left-to-right treating WILDs as substitutes.
   * Returns the winning symbol + consecutive count, or null for no win.
   */
  export function lineWins(symbols: readonly Symbol[]): ... { ... }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
