# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target. Reel-weight interaction that could violate that target is rooted in src/reels.ts (DIAMOND weight), not here.
- **Overengineering [LEAN]**: Single numeric constant; no abstraction overhead.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar pay table structures found in RAG results.
- **Correction [OK]**: All six symbols × three run-lengths exactly match the documented paytable in both reference docs.
- **Overengineering [LEAN]**: Flat lookup table with fixed-size tuples — minimal, appropriate data structure for a fixed 6-symbol paytable.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Returns 0 for unknown symbols, routes count 3/4/5 to the correct tuple index, and returns 0 for any other count.
- **Overengineering [LEAN]**: Straight array index lookup behind three if-checks. No unnecessary abstraction for what is a direct table read.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Logic is virtually identical to checkLine in src/engine.ts: same WILD-first resolution (symbols[0]==='WILD' ? find first non-WILD : symbols[0]), same consecutive-run loop breaking on first mismatch, same threshold (>= 3). Differences are purely cosmetic — variable names (first/count vs lead/run) and return field names ({symbol,count} vs {sym,run}). Same semantic contract: extract the leading run of matching symbols from a payline.
- **Correction [OK]**: Leading-WILD skip correctly finds the pay symbol; the count loop starts from position 0 and increments for matching or WILD symbols, breaking on the first non-match; all-WILD and SCATTER-at-position-0 cases correctly return null.
- **Overengineering [LEAN]**: Single-pass contiguous-run counter with WILD substitution logic. Complexity is proportional to the payline evaluation rules it encodes.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical logic — both resolve WILD-leading symbol, count consecutive matches with WILD wildcard, gate on run>=3, return leading symbol+count or null

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are writable (PAY_TABLE["CHERRY"][0] = 99 compiles). lineWins parameter should be readonly Symbol[]. [L5-L12, L23] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins return type { symbol: Symbol; count: number } \| null is inlined. Extracting a named type (e.g. LineMatch) would make it reusable and consistent with project conventions. [L23] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc comments. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE uses an explicit Record<string, ...> annotation, losing key specificity. satisfies + as const would give both type checking and narrowed literal inference. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | ANCIENT_RTP has no listed consumers — likely a dead or misnamed export (the 'ANCIENT' prefix suggests a stale variant name, not a game theme). lineWins function name collides with the SpinResult.lineWins field, creating potential confusion between a computation function and a result property. [L3, L23] |

### Suggestions

- Make PAY_TABLE fully immutable using as const + satisfies
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    ....
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
- Extract named return type and mark parameter as readonly
  ```typescript
  // Before
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  // After
  export type LineMatch = { readonly symbol: Symbol; readonly count: number };
  
  export function lineWins(symbols: readonly Symbol[]): LineMatch | null {
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  export function lineWins(symbols: Symbol[]): ... {
  // After
  /** Theoretical Return-to-Player for this paytable (0.95 = 95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base payout multiplier for a given pay symbol and run length.
   * Returns 0 for WILD, SCATTER, or counts outside [3, 5].
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  
  /**
   * Evaluates a payline's symbols for a winning run from position 0.
   * WILDs substitute for any pay symbol. Returns null if no 3+ run is found.
   */
  export function lineWins(symbols: readonly Symbol[]): LineMatch | null {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
