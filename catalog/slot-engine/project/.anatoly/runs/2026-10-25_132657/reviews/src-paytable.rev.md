# Review: `src/paytable.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constant found in RAG results; standalone RTP config value.
- **Correction [OK]**: Plain constant 0.95; no logic to evaluate. Unused per call graph — Utility axis concern, not correction.
- **Overengineering [LEAN]**: Single exported numeric constant for RTP configuration.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar lookup table found in RAG results; sole pay table definition in codebase.
- **Correction [OK]**: Tuple structure and index semantics are consistent with getPayMultiplier's row[0]/[1]/[2] access. RTP cannot be numerically self-validated without reel strip weights, so rule 12 abstention applies.
- **Overengineering [LEAN]**: Flat Record mapping symbol names to fixed-length tuples. No abstraction needed for a static pay schedule.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: RAG reports no similar functions. Index-based row lookup with count switch; no equivalent found elsewhere.
- **Correction [OK]**: Index mapping count→3:row[0], 4:row[1], 5:row[2] is correct; returns 0 for missing symbols (WILD, SCATTER) and out-of-range counts. Max count on a 5-reel machine is 5, so no reachable off-end index.
- **Overengineering [LEAN]**: Three sequential if checks on count are slightly verbose vs. row[count-3], but readable and appropriate for a bounded 3-value lookup.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is structurally identical to checkLine in src/engine.ts: same WILD-lead resolution, same consecutive-match loop, same >=3 guard, same null return. Only differences are variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Both functions are interchangeable in computation.
- **Correction [OK]**: Leading-WILD resolution correctly finds first non-WILD symbol via find(); WILD-as-SCATTER guard prevents SCATTER being treated as a payline symbol; the consecutive-count loop correctly breaks on any non-(first|WILD) symbol; all-WILD lines resolve to null, consistent with WILD's absence from PAY_TABLE (getPayMultiplier would return 0 regardless).
- **Overengineering [LEAN]**: Standard left-to-right consecutive-match evaluation with WILD substitution. Logic is minimal and matches the problem domain directly.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical logic — both resolve WILD lead, count consecutive matches treating WILD as wildcard, return null below 3; differ only in variable and return-property names

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a module-level constant but its type allows mutation of both the record and the inner tuples. `as const satisfies Record<string, readonly [number, number, number]>` would make it fully immutable and narrow the tuple literals. [L5-L12] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline object type instead of a named type. The README references a LineWin type in SpinResult; reusing that named type here would align the project convention. [L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. Three or more missing crosses the FAIL threshold. ANCIENT_RTP is especially opaque — the 'ANCIENT' qualifier is unexplained. [L3,L15,L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use `as const satisfies Record<string, readonly [number, number, number]>` to get literal-narrowed tuple types while retaining type-safe indexing — a missed TS5.5+ ergonomic win. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | The exported function is named lineWins, identical to the SpinResult field lineWins in the public API (README). This name collision between a function and a result property can confuse consumers importing from the package; a name like evaluateLine or computeLineWin would disambiguate. [L24] |

### Suggestions

- Make PAY_TABLE fully immutable using as const satisfies, narrowing tuple literals while retaining type safety
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ...
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    ...
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Add JSDoc to all three public exports; document the opaque ANCIENT_RTP name
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  /** Base return-to-player ratio used by the classic ("ancient") cabinet configuration. */
  export const ANCIENT_RTP = 0.95;
  
  /** Returns the payout multiplier for `symbol` appearing `count` times on a payline, or 0 if ineligible. */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /** Evaluates a single payline and returns the winning symbol and count, or null if no win. */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  ```
- Rename lineWins to evaluateLine or computeLineWin to avoid name collision with SpinResult.lineWins
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function evaluateLine(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
