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

- **Utility [DEAD]**: Exported constant with zero runtime importers
- **Duplication [UNIQUE]**: Simple numeric constant with no duplicates found
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target in the Internal Reference Documentation.
- **Overengineering [LEAN]**: Single numeric constant export. Nothing to over-engineer.
- **Tests [NONE]**: No test file exists. Constant is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is unexplained — it's unclear why RTP is namespaced this way (default config? a specific game mode?). Purpose and units (fraction vs percent) are not stated.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced in getPayMultiplier (line 16)
- **Duplication [UNIQUE]**: Lookup table for symbol payouts, no similar structures found
- **Correction [OK]**: All six symbol tuples exactly match the [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] values documented in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/02-Architecture/02-Core-Concepts.md.
- **Overengineering [LEAN]**: Flat Record keyed by symbol name, tuple values matching exactly the documented 3/4/5-of-a-kind multipliers. No abstraction layers needed or present.
- **Tests [NONE]**: No test file exists. Internal constant is untested, though indirectly exercised via getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and non-obvious without context. A single comment line would suffice.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2]. Missing symbol and non-paying symbols (WILD, SCATTER) correctly return 0 via !row guard and the final fallthrough.
- **Overengineering [LEAN]**: Straight lookup with three explicit if-guards for counts 3/4/5. Could be written as `row[count - 3]` but neither form is overengineered — both are trivially simple.
- **Tests [NONE]**: No test file exists. Critical function imported by src/engine.ts and src/legacy.ts; count branching (3/4/5/other), unknown symbol, and zero-return paths are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Missing: description of what 'count' represents (reel positions matched), what happens for count < 3 or unsupported symbols (returns 0), and that WILD/SCATTER always return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with zero runtime importers
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine—same symbol matching logic with wildcard support, consecutive counting, and threshold validation
- **Correction [OK]**: Left-to-right consecutive counting with WILD substitution is correct across all identifiable edge cases: leading WILDs (find skips them to resolve the effective symbol), all-WILD lines (correctly returns null since WILD is not a pay symbol per docs), SCATTER at position 0 (caught by the null guard), and WILDs interspersed in a run (counted as substitutes until a non-matching non-WILD breaks the chain).
- **Overengineering [LEAN]**: Single-pass left-to-right match with WILD substitution and early break. Minimal and appropriate for the documented payline evaluation requirement.
- **Tests [NONE]**: No test file exists. WILD-as-first-symbol resolution, SCATTER early-return, consecutive-match counting, and count < 3 null-return paths are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Non-trivial logic: WILD substitution for the anchor symbol, left-to-right consecutive counting, early break on mismatch, null for SCATTER/all-WILD lines — none of this is documented.

> **Duplicate of** `src/engine.ts:checkLine` — 100% identical logic; only differences are variable names (first→lead, count→run) and object field names (symbol→sym)

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuples are mutable: Record<string, [number, number, number]> allows PAY_TABLE['CHERRY'][0] = 999 at runtime. Should use readonly [number, number, number] or as const. [L5] |
| 6 | Interface vs Type | WARN | MEDIUM | lineWins returns an anonymous inline type { symbol: Symbol; count: number } \| null. Per .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md, the project uses named interfaces (LineWin). The return type should be Pick<LineWin, 'symbol' \| 'count'> or a dedicated named type. [L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. ANCIENT_RTP is especially undocumented — the 'ANCIENT' qualifier implies it is a legacy or versioned value but there is no explanation of its purpose or deprecation status. [L3, L14, L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE could use satisfies to enforce the Record shape while preserving literal tuple types, enabling exhaustiveness checking and narrower row element types. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues: (1) lineWins return type is an anonymous object — inconsistent with the project's named-interface convention from .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md. (2) ANCIENT_RTP is exported with no documentation; in a regulated gambling domain, RTP values must be auditable and their provenance traceable. The undocumented 'ANCIENT' qualifier makes this constant opaque to auditors. |

### Suggestions

- Use readonly tuple type in PAY_TABLE to enforce immutability of payout values.
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = { ... };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25],
    // ...
  } as const satisfies Record<string, readonly [number, number, number]>;
  ```
- Replace the anonymous lineWins return type with a named Pick to align with the project's named-interface convention.
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {`
- Add JSDoc to all three exported symbols, especially ANCIENT_RTP to clarify its purpose and regulatory status.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /**
   * Return-to-player ratio for the legacy 'Ancient' slot variant.
   * @deprecated Use the active game config RTP instead.
   */
  export const ANCIENT_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
