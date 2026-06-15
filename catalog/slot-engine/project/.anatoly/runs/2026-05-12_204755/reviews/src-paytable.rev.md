# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | UNIQUE | - | 85% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with zero runtime importers and zero type-only importers.
- **Duplication [UNIQUE]**: Simple constant; no similar values found
- **Correction [OK]**: Constant correctly set to 0.95 (95% RTP); no computation involved.
- **Overengineering [LEAN]**: Single named constant for a magic number. Appropriate.
- **Tests [NONE]**: No test file exists. Constant used in RTP calculations with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name hints at purpose but 'ANCIENT' qualifier and the significance of 0.95 (theoretical return-to-player percentage) are not explained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Internal constant referenced in getPayMultiplier at line 17.
- **Duplication [UNIQUE]**: Lookup table; no similar structures found
- **Correction [OK]**: Static data table; indices [0,1,2] map to 3-match, 4-match, 5-match multipliers respectively, consistent with getPayMultiplier usage.
- **Overengineering [LEAN]**: Flat lookup table mapping symbol names to fixed-length tuples. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Private constant but its values drive all payout logic — zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple layout [3-match, 4-match, 5-match] multipliers is not documented; readers must infer the index semantics from getPayMultiplier.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with runtime importers in src/engine.ts and src/legacy.ts.
- **Duplication [UNIQUE]**: No similar functions found
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2]; missing symbols and out-of-range counts safely return 0.
- **Overengineering [LEAN]**: Simple index-by-count lookup into a tuple. The explicit if-chain over count values is clear and appropriate for three discrete cases.
- **Tests [NONE]**: No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid symbols (count 3/4/5), unknown symbols (returns 0), or out-of-range counts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that 0 means no win or unrecognised symbol, and no note on valid count range (3–5).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with zero runtime importers and zero type-only importers.
- **Duplication [UNIQUE]**: Similar to checkLine (0.834 score) but different return contracts: {symbol,count} vs {sym,run}
- **Correction [OK]**: WILD-resolution via find(s => s !== 'WILD') correctly identifies the leftmost non-WILD theme symbol; the contiguous-count loop properly handles embedded WILDs, SCATTER breaks, all-WILD input, and empty arrays.
- **Overengineering [LEAN]**: Straightforward left-to-right count with WILD substitution. Single responsibility, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Complex logic covering WILD substitution, SCATTER early-return, contiguous-match counting, and minimum-count threshold — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. WILD substitution logic, left-to-right contiguous-match rule, SCATTER/all-WILD null return, and the assumption that symbols represent a single payline are all undocumented.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE entries are runtime-mutable — callers can overwrite tuples (e.g. PAY_TABLE['SEVEN'][2] = 1). Should use readonly tuples or as const. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | ANCIENT_RTP, getPayMultiplier, and lineWins are all exported with no JSDoc. ANCIENT_RTP's meaning (Ancient game variant RTP) is non-obvious without documentation. [L3, L13, L22] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND symbols, ANCIENT_RTP, and project files (freespin.ts, jackpot.ts, reels.ts, rng.ts). In regulated gaming, pay tables must be tamper-evident and immutable. PAY_TABLE is a mutable object — tuple entries can be silently overwritten at runtime (e.g. PAY_TABLE['SEVEN'][2] = 1), altering certified payout ratios without detection. Exploitability requires internal code access, hence HIGH rather than CRITICAL. [L5-L12] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use satisfies to preserve literal tuple types while still enforcing the Record shape, enabling compile-time exhaustiveness on payout tiers. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | PAY_TABLE is keyed by string instead of a narrowed pay-symbol union, allowing any arbitrary string key to silently return undefined in getPayMultiplier. The Symbol type from types.ts likely includes WILD and SCATTER which are deliberately excluded from the table, but this exclusion is not encoded in the PAY_TABLE key type. [L5] |

### Suggestions

- Make PAY_TABLE fully immutable using as const satisfies to prevent runtime mutation of certified payout ratios.
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
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Narrow PAY_TABLE key type to a pay-symbol union to eliminate silent undefined returns for unknown symbols.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... }
  // After
  type PaySymbol = 'CHERRY' | 'LEMON' | 'BELL' | 'BAR' | 'SEVEN' | 'DIAMOND';
  const PAY_TABLE: Record<PaySymbol, readonly [number, number, number]> = { ... }
  ```
- Add JSDoc to all public exports.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  
  export function getPayMultiplier(symbol: Symbol, count: number): number { ... }
  
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null { ... }
  // After
  /** Return-to-player ratio for the Ancient slot variant (95%). */
  export const ANCIENT_RTP = 0.95;
  
  /** Returns the payout multiplier for `symbol` appearing `count` consecutive times, or 0 if below threshold. */
  export function getPayMultiplier(symbol: Symbol, count: number): number { ... }
  
  /** Evaluates a payline left-to-right, respecting WILDs. Returns the winning symbol and run length, or null for no win. */
  export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null { ... }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
