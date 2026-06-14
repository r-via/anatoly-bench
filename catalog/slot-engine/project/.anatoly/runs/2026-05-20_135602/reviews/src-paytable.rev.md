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

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Constant definition. No duplicates found.
- **Correction [OK]**: Value 0.95 matches the arbitrated RTP target of 95%.
- **Overengineering [LEAN]**: Single numeric constant — minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name gives no hint about what 'ANCIENT' qualifies, what game mode or context uses this constant, or how 0.95 is applied (theoretical RTP? base RTP before bonuses?).

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal constant referenced in getPayMultiplier function at line 15
- **Duplication [UNIQUE]**: Pay multiplier lookup table. No duplicates found.
- **Correction [OK]**: All six pay symbol rows exactly match the reference documentation multiplier table.
- **Overengineering [LEAN]**: Fixed-at-load-time lookup table; tuple type precisely encodes the 3-of/4-of/5-of multipliers without unnecessary abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant — leniency applies — but the tuple indices [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] are implicit and not documented anywhere in the file. A single-line comment explaining the tuple layout would suffice.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: Returns pay multiplier from lookup. No duplicates found.
- **Correction [OK]**: Index mapping (count 3→row[0], 4→row[1], 5→row[2]) is correct; missing symbol and out-of-range count both return 0 as documented.
- **Overengineering [LEAN]**: Direct table lookup with three explicit if-branches. `row[count - 3]` would shorten it, but three ifs are not abstraction overhead — function does one thing.
- **Tests [NONE]**: No test file exists. Function is imported by src/engine.ts and src/legacy.ts, making untested count/symbol boundary logic a risk. Cases like count<3, unknown symbol, and all six symbols across all three counts are uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: what `count` represents (consecutive matching symbols on a line), what the returned number is a multiplier of (line bet), and that WILD/SCATTER return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers
- **Duplication [DUPLICATE]**: Duplicate of checkLine. Identical logic: find leading non-WILD symbol, validate non-WILD/SCATTER, count consecutive matches with WILD as wildcard, return if count >= 3.
- **Correction [OK]**: Leading-WILD skip via find(), SCATTER/all-WILD early exits, and contiguous count loop are all correct per the documented win-detection contract.
- **Overengineering [LEAN]**: Single-pass leading-WILD skip then contiguous-count loop; returns a plain object. No unnecessary abstraction for straightforward payline evaluation logic.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-exit, mixed WILD+symbol runs, all-WILD input, and count<3 short-circuit are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious behavior includes: WILD substitution for the anchor symbol, early-break on first non-matching symbol, SCATTER exclusion, and the minimum run length of 3. None of this is described.

> **Duplicate of** `src/engine.ts:checkLine` — Identical implementation — both skip leading WILD to find lead symbol, reject WILD/SCATTER, count consecutive matches including WILD, return symbol+count if >= 3

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `Record` is used, but the key is `string` instead of the imported `Symbol` union. `Partial<Record<Symbol, readonly [number, number, number]>>` would make missing entries a compile-time error and preserve tuple immutability. [L5] |
| 5 | Immutability | WARN | MEDIUM | Tuple values `[number, number, number]` are mutable. `PAY_TABLE` should be typed with `readonly [number, number, number]` or defined `as const` to prevent accidental index-writes. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. In a regulated gaming context, documenting the RTP constant and win-detection semantics (especially WILD substitution logic) is important for auditability. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` would allow `PAY_TABLE` to be typed as the exact literal structure (enabling per-symbol tuple narrowing) while still checking against `Record<string, [number, number, number]>`. Missed opportunity for both better inference and immutability. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot domain: `PAY_TABLE` keyed by `string` means adding a new `Symbol` variant (e.g. BONUS) will silently return 0 rather than failing at compile time. In a certified paytable this creates an audit gap — a `Partial<Record<Symbol, ...>>` key enforces exhaustiveness checks during symbol-set changes. [L4] |

### Suggestions

- Use the Symbol union as key and readonly tuples to get compile-time exhaustiveness and immutability
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
  } as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;
  ```
- Add JSDoc to all public exports for regulatory auditability
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /** Theoretical Return-to-Player target for the Ancient theme (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /**
   * Returns the base pay multiplier for a (symbol, run-length) pair.
   * Returns 0 for WILD, SCATTER, or any unrecognised symbol.
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
