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

- **Utility [DEAD]**: Exported constant with 0 runtime importers
- **Duplication [UNIQUE]**: Simple constant with no duplicates found in codebase
- **Correction [OK]**: Matches documented 95% RTP target exactly.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists. Constant is likely used in RTP calculations; correctness of 0.95 value is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name hints at a return-to-player value but 'ANCIENT' prefix is unexplained — is this a game variant, a legacy constant, or a theme name? Purpose and usage context are undocumented.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant used in getPayMultiplier on line 16
- **Duplication [UNIQUE]**: Configuration data structure with no equivalent found in provided code
- **Correction [OK]**: Multipliers are monotonically increasing within each row and across symbols; index mapping (0=3-match, 1=4-match, 2=5-match) is internally consistent with getPayMultiplier.
- **Overengineering [LEAN]**: Flat record mapping symbol names to fixed-length tuples — minimal structure for a static paytable.
- **Tests [NONE]**: No test file exists. All payout values are untested; misconfigured multipliers would silently corrupt game math.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple structure [number, number, number] represents payouts for 3/4/5 matches, but this mapping is implicit — no comment explains the tuple index semantics or units (multiplier? coins?).

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function imported by 2 runtime importers: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: RAG reports no similar functions; fetches multiplier from PAY_TABLE by symbol and count index
- **Correction [OK]**: Correctly maps count 3/4/5 to row indices 0/1/2; returns 0 for missing symbols (WILD, SCATTER) and out-of-range counts.
- **Overengineering [LEAN]**: Straightforward index-into-tuple lookup; no generics or indirection needed.
- **Tests [NONE]**: No test file exists. Called by engine.ts and legacy.ts — critical payout path with count branching (3/4/5) and unknown-symbol fallback entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing documentation for parameters (what valid values of `count` are, what happens outside 3–5), return value (multiplier of what?), and the 0 sentinel for unknown symbols or out-of-range counts.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers
- **Duplication [DUPLICATE]**: RAG score 0.834 with checkLine; identical logic comparing source code confirms duplication: both identify first non-WILD symbol, validate against WILD/SCATTER, count consecutive matches including wildcards, return result if count >= 3
- **Correction [OK]**: Left-to-right consecutive counting with WILD substitution is correct; leading-WILD resolution via find(s => s !== 'WILD') is sound; all-WILD and empty-array edge cases return null without crashing.
- **Overengineering [LEAN]**: Single-pass scan for consecutive matches with WILD substitution — appropriate complexity for slot line evaluation.
- **Tests [NONE]**: No test file exists. Contains non-trivial WILD substitution logic, SCATTER early-exit, and sequential counting with break — all edge cases (all-WILD, leading WILD resolving to pay symbol, mixed WILD mid-line, count < 3) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial WILD substitution logic and left-to-right contiguous matching are undocumented. Missing explanation of why WILD/SCATTER as the resolved first symbol returns null, and what 'line' means in the game context.

> **Duplicate of** `src/engine.ts:checkLine` — Identical implementation with only field name differences (symbol vs sym, count vs run). Both functions are semantically interchangeable.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE is a module-level constant whose values never change but is typed as a mutable Record with mutable tuples. symbols parameter in lineWins is read-only by usage but typed as mutable Symbol[]. [L4-L11] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline object type { symbol: Symbol; count: number } instead of the named LineWin type implied by the README's SpinResult interface. The project has types.ts; this shape belongs there. [L23] |
| 9 | JSDoc on public exports | WARN | MEDIUM | ANCIENT_RTP, getPayMultiplier, and lineWins are exported without JSDoc. At minimum getPayMultiplier and lineWins warrant parameter/return documentation. [L3, L14, L23] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use the satisfies operator to get precise literal inference while still validating against Record<Symbol, readonly [number, number, number]>. Currently loses literal types entirely. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER vocabulary). PAY_TABLE key is Record<string, ...> instead of Record<Symbol, ...>, allowing any string key at compile time. In a gambling paytable, a missed symbol key silently returns 0 payout — constraining the key to Symbol catches such errors statically. [L4] |

### Suggestions

- Use satisfies + as const on PAY_TABLE to retain literal types and enforce valid Symbol keys
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
  } as const satisfies Record<Symbol, readonly [number, number, number]>;
  ```
- Mark symbols parameter readonly and return the named LineWin type
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: readonly Symbol[]): LineWin | null {`
- Add JSDoc to public exports
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the payout multiplier for `count` consecutive `symbol` matches.
   * Returns 0 for counts below 3 or unknown symbols.
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

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
