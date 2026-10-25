# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 93% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Constant value 0.95 is internally consistent. No callers found — Utility axis concern, not correction.
- **Overengineering [LEAN]**: Single named constant. No abstraction overhead.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar data structures found in RAG results.
- **Correction [OK]**: Static paytable data; no logic to evaluate. Values are internally consistent.
- **Overengineering [LEAN]**: Flat Record with fixed-length tuples — minimal and appropriate for a static paytable. No factory, no class, no indirection.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly indexes row[0/1/2] for counts 3/4/5; returns 0 for missing symbol or out-of-range count.
- **Overengineering [LEAN]**: Straight table lookup plus index dispatch. The explicit if-chain for counts 3/4/5 is slightly verbose vs `row[count - 3]`, but not overengineered — readable and correct.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is identical to checkLine in src/engine.ts: both resolve the lead symbol from WILD-prefixed input, bail on WILD/SCATTER leads, count consecutive matching symbols treating WILD as wildcard, and return null below 3 matches. Only difference is return-object field names (symbol/count vs sym/run) and local variable names.
- **Correction [OK]**: WILD-leading case correctly finds first non-WILD symbol; counting loop correctly treats WILD as wildcard; all-WILD and SCATTER lines correctly return null.
- **Overengineering [LEAN]**: Standard left-to-right payline scan with WILD substitution. Complexity matches the domain requirements (WILD as prefix skip, consecutive counting, 3-match threshold).
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~98% identical logic — same WILD-lead resolution, same loop with break, same >=3 guard; only property names differ

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is a module-level constant but its Record entries are mutable arrays. `symbols` parameter in `lineWins` is `Symbol[]` rather than `readonly Symbol[]`; the function only reads it. [L5,L24] |
| 6 | Interface vs Type | WARN | MEDIUM | `lineWins` return type uses an inline anonymous object `{ symbol: Symbol; count: number }`. README shows a `LineWin` type in `SpinResult.lineWins: ReadonlyArray<LineWin>`, indicating a canonical type exists in `types.ts` that should be referenced here instead. [L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports lack documentation. `ANCIENT_RTP` is especially opaque — the `ANCIENT` prefix is unexplained (legacy game mode? specific RTP tier?) and the unit (fractional probability, not percentage) is non-obvious. `getPayMultiplier` does not document the valid `count` range (3–5). [L3,L14,L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` (TS 4.9+) would let `PAY_TABLE` be inferred as a literal-keyed record while still enforcing the tuple constraint, catching typos like `"CHEERY"` that `Record<string,…>` silently accepts. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | The exported function `lineWins` shares its name with the `lineWins` property on `SpinResult` (README). Consumers that import both will need an alias. The `PAY_TABLE` key type `string` should be tightened to `Exclude<Symbol, 'WILD' \| 'SCATTER'>` to make illegal lookups a compile-time error in a regulated gambling context where table completeness is auditable. [L5,L24] |

### Suggestions

- Make PAY_TABLE fully immutable and narrow its key type
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... };
  // After
  type PayableSymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    // …
  } as const satisfies Record<PayableSymbol, readonly [number, number, number]>;
  ```
- Use the canonical LineWin type and readonly parameter
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: readonly Symbol[]): LineWin | null {`
- Document ANCIENT_RTP — name and unit are not self-describing
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Return-to-player ratio for the Ancient Egypt theme (95 %). Used in house-edge validation. */
  export const ANCIENT_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
