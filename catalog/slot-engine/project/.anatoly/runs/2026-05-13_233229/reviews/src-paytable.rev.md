# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 91% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime and 0 type-only importers
- **Duplication [UNIQUE]**: Simple numeric constant. No similar constants found in RAG results.
- **Correction [OK]**: Value 0.95 matches the documented 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant for the RTP target. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Constant is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The name and value (0.95) suggest a return-to-player rate, but 'ANCIENT' qualifier and its role in the broader system are unexplained.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant used locally in getPayMultiplier function
- **Duplication [UNIQUE]**: Static lookup table for slot payout multipliers. No similar tables found in RAG results.
- **Correction [OK]**: Structure is a valid Record mapping symbol names to [3-match, 4-match, 5-match] multiplier tuples. RTP accuracy cannot be verified without reel probability weights; no paytable-internal defect is visible.
- **Overengineering [LEAN]**: Flat lookup table mapping symbol names to 3-element tuples. No unnecessary abstraction; tuple type accurately encodes the fixed 3-count structure.
- **Tests [NONE]**: No test file exists. Internal table untested; correctness of payout values (e.g. CHERRY=[2,5,25]) is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The tuple structure [number, number, number] lacks explanation of what each index represents (likely match counts 3/4/5), which is non-obvious to readers.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with 2 runtime importers: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: Retrieves payout multiplier from PAY_TABLE by symbol and count. RAG explicitly indicates no similar functions found.
- **Correction [OK]**: count 3→row[0], 4→row[1], 5→row[2] maps correctly to PAY_TABLE tuple indices. Missing row returns 0; WILD/SCATTER absent from PAY_TABLE also returns 0 correctly.
- **Overengineering [LEAN]**: Straight table lookup with an explicit if-chain for counts 3/4/5. Could use `row[count - 3]` but the verbosity is negligible and doesn't constitute overengineering.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — yet count=3/4/5 branches, unknown-symbol fallback, and count<3 fallback are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics, and the behavior when count < 3 (returns 0).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine (RAG score 0.831): both extract first non-WILD symbol, check against WILD/SCATTER, count consecutive matches with WILD support, return symbol+count if run >= 3. Only differ in variable naming (first/lead, count/run) and return field names (symbol/sym, count/run).
- **Correction [OK]**: Left-to-right consecutive matching with WILD substitution is correctly implemented. All-WILD line resolves first→'WILD' and returns null; if all-WILD jackpot payouts are required they are documented as belonging to a separate jackpot-detection path in SpinResult, not this function.
- **Overengineering [LEAN]**: Handles WILD substitution and consecutive-count logic in a single linear pass. Complexity is justified by the game rules; no unnecessary layers of abstraction.
- **Tests [NONE]**: No test file exists. WILD-substitution logic, SCATTER early-return, count threshold (>=3), and mid-line break behavior are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial logic — WILD substitution at position 0, left-to-right contiguous matching, SCATTER exclusion, and the null return cases — all require documentation that is absent.

> **Duplicate of** `src/engine.ts:checkLine` — Identical logic for line matching—both extract first non-WILD symbol, validate against wildcards, iterate symbols counting matches including WILD, return matched symbol and run length if >= 3.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | PAY_TABLE is typed `Record<string, [number, number, number]>` but the key should be `Record<Symbol, ...>` to enforce that only valid symbol names are present. Using `string` silently accepts any key. [L5] |
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE and its tuple values are mutable. Should use `as const` or `Readonly<Record<Symbol, readonly [number, number, number]>>`. ANCIENT_RTP is a primitive const so it is fine. [L5-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (ANCIENT_RTP, getPayMultiplier, lineWins) lack JSDoc. For a gambling payout module, documenting the contract (e.g. that count must be 3–5, that WILD/SCATTER return null) is especially important for auditability. [L3, L14, L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAY_TABLE would benefit from `satisfies Record<Symbol, readonly [number, number, number]>` combined with `as const` — this validates keys against the Symbol union while preserving literal tuple types and full immutability. [L5-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated slot-machine domain: payout tables should be auditable and tamper-evident. PAY_TABLE is runtime-mutable (no as const / Object.freeze), which is a compliance risk. Additionally, ANCIENT_RTP is exported without being used in this file — if it is the active RTP constant, it should be enforced; if it is a legacy value, it should be removed or clearly deprecated. |

### Suggestions

- Make PAY_TABLE fully immutable and properly keyed to the Symbol union using satisfies + as const
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
  } as const satisfies Record<Exclude<Symbol, 'WILD' | 'SCATTER'>, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports to satisfy auditability requirements for regulated gambling code
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the win multiplier for `symbol` appearing `count` consecutive times.
   * Returns 0 for WILD, SCATTER, unknown symbols, or count < 3.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Clarify or deprecate ANCIENT_RTP — if active, enforce it; if legacy, remove or mark deprecated
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Theoretical RTP for the Ancient variant. Must match the arbitrated 95% target. */
  export const ANCIENT_RTP = 0.95 as const;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
