# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 92% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime and 0 type-only importers
- **Duplication [UNIQUE]**: Simple numeric constant. No similar symbols found.
- **Correction [OK]**: Constant correctly encodes the 95% RTP target; no logic error in the value itself.
- **Overengineering [LEAN]**: Single numeric constant. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Name implies RTP=95% but 'ANCIENT' prefix is unexplained — could mean a preset, a game variant, or a legacy value.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported; referenced locally in getPayMultiplier at line 16
- **Duplication [UNIQUE]**: Data lookup table mapping symbols to payout arrays. No duplicates found.
- **Correction [NEEDS_FIX]**: DIAMOND multipliers combined with documented reel weight (30/120 = 25%) produce RTP >> 100% from DIAMOND wins alone, violating the arbitrated 95% target.
- **Overengineering [LEAN]**: Fixed lookup table as a Record of tuples. Right data structure for a static 6×3 paytable; no abstraction overhead.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal (non-exported) constant, but tuple semantics [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] are not obvious from the type alone.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly dispatches (symbol, count) → multiplier; returns 0 for unknown symbols (WILD/SCATTER) and out-of-range counts; matches reference docs exactly.
- **Overengineering [LEAN]**: Straight table lookup with three explicit if-branches for counts 3/4/5. Clear and appropriate; `row[count-3]` would be equivalent but neither form is over-engineered.
- **Tests [NONE]**: No test file exists. Called by engine.ts and legacy.ts — critical payout logic with count boundary conditions (3/4/5) and unknown symbol handling are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported public function. Missing: param descriptions for symbol and count, return value semantics, behavior for WILD/SCATTER (returns 0), and valid count range.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime and 0 type-only importers
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine in engine.ts (similarity 0.823). Both find leading symbol, validate for WILD/SCATTER, count consecutive matches including WILDs, return if count >= 3. Only difference is field naming (symbol/count vs sym/run).
- **Correction [OK]**: Correctly skips leading WILDs to find pay symbol, counts contiguous WILD-or-matching symbols from position 0, and returns null for all-WILD and SCATTER-led paylines.
- **Overengineering [LEAN]**: Single-pass contiguous-run counter with leading-WILD resolution. Does exactly one thing; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-exit, consecutive-match break, and count threshold (>=3) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported public function. Missing: description of consecutive-match algorithm, WILD substitution logic, SCATTER/WILD exclusion from anchor symbol, null return semantics, and minimum count threshold of 3.

> **Duplicate of** `src/engine.ts:checkLine` — Identical logic with only superficial field naming differences in return object.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` entries are mutable tuples at runtime — `PAY_TABLE.CHERRY[0] = 999` is valid. In a regulated gambling context, paytable mutation is a integrity risk. Should use `as const` or `readonly [number, number, number]` tuple elements. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three public exports — `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` — lack JSDoc. The `ANCIENT_RTP` name is especially opaque; a doc comment explaining what 'ANCIENT' refers to and how the constant is consumed by the engine is necessary. [L3, L13, L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` is a good candidate for `satisfies Record<Symbol, readonly [number, number, number]>` combined with `as const`, which would give literal-typed tuple inference and catch missing/extra symbol keys at compile time without widening the declared type. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: `PAY_TABLE` is keyed by `string` instead of the imported `Symbol` type. In a regulated slot engine, a stray string key (e.g. a typo) silently returns 0 multiplier rather than a compile error. Keying by `Symbol` (or the pay-symbol subset) would catch invalid lookups at build time and prevent silent zero-payout bugs. [L4] |

### Suggestions

- Key PAY_TABLE by Symbol instead of string for compile-time coverage of all pay symbols
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {`
  - After: `const PAY_TABLE: Record<Symbol, readonly [number, number, number]> = {`
- Use `as const satisfies` to make tuples readonly and verify key coverage at compile time
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
  } as const satisfies Record<PaySymbol, readonly [number, number, number]>;
  ```
- Add JSDoc to all public exports, especially the opaque ANCIENT_RTP name
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Theoretical Return-to-Player for the Ancient-theme variant (95%). Used by the engine to validate long-run payout targets. */
  export const ANCIENT_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** Recalibrate DIAMOND multipliers [50, 250, 1000] at L11: the 5× entry alone contributes ~97.7% RTP across 10 paylines given reel weight 30/120. Either reduce M5 to ≤390 (keeping weight=30) or coordinate with src/reels.ts to lower DIAMOND weight to ≤25. All three multipliers likely need proportional reduction since 3× and 4× DIAMOND add a further ~120%+ to the implied RTP. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
