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

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.95 matches the arbitrated 95% RTP target; no defect in this constant.
- **Overengineering [LEAN]**: Single numeric constant, no complexity.
- **Tests [NONE]**: No test file exists. Constant is unreferenced in any consumer shown, so no transitive coverage either.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' prefix is non-obvious — unclear whether this is a target RTP, a legacy config value, or something else. Name alone does not convey semantics.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar lookup table found in RAG results.
- **Correction [OK]**: All multiplier triples exactly match the reference-documented paytable for every pay symbol; no defect.
- **Overengineering [LEAN]**: Static lookup table as Record with tuple values — minimal and appropriate for a fixed 6-symbol paytable.
- **Tests [NONE]**: No test file. Transitive coverage via getPayMultiplier is irrelevant because getPayMultiplier itself has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private, non-exported constant. Name and structure are self-descriptive (symbol → [3-of, 4-of, 5-of] multipliers), so absence of JSDoc is tolerable for an internal helper. No docs present.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG. Sole multiplier resolver for PAY_TABLE rows.
- **Correction [OK]**: Correctly returns 0 for absent symbols (WILD/SCATTER have no row), and maps count 3/4/5 to the right PAY_TABLE index. Counts outside 3–5 correctly return 0.
- **Overengineering [LEAN]**: Direct row lookup with three sequential count checks. Straightforward index into a fixed tuple.
- **Tests [NONE]**: No test file found. Imported by src/engine.ts and src/legacy.ts but no test coverage is confirmed for those callers either — no test file is available.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what `count` represents, valid range of `count`, return semantics (multiplier vs. payout), and behavior for WILD/SCATTER symbols (returns 0).

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Identical algorithm to checkLine in src/engine.ts: same WILD-lead resolution, same consecutive-match loop with WILD wildcard, same count>=3 guard, same return shape. Only differences are variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run) — the functions are fully interchangeable in computation.
- **Correction [OK]**: Leading-WILD resolution via find(), SCATTER/all-WILD guard, and consecutive-from-position-0 counting with WILD substitution are all implemented correctly per the documented payline win rule.
- **Overengineering [LEAN]**: Single-pass consecutive-run counter with WILD substitution. Logic matches domain complexity exactly.
- **Tests [NONE]**: No test file found. Critical edge cases (all-WILD input, SCATTER short-circuit, WILD prefix substitution, count < 3 boundary) are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of left-anchored consecutive matching, WILD substitution logic, why SCATTER/all-WILD lines return null, and what `count` in the return value represents.

> **Duplicate of** `src/engine.ts:checkLine` — ~98% identical logic — same WILD-lead lookup, identical loop body and break condition, identical threshold guard; differs only in local variable and return property names

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | PAY_TABLE tuple values are mutable at runtime (`PAY_TABLE.CHERRY[0] = 9999` is valid TypeScript). `symbols` parameter in `lineWins` should be `readonly Symbol[]`. In a regulated gaming context, paytable mutability is a compliance risk. [L4-L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`ANCIENT_RTP`, `getPayMultiplier`, `lineWins`) lack JSDoc. `getPayMultiplier` in particular has non-obvious semantics (returns 0 for count < 3 and for WILD/SCATTER) that callers benefit from having documented. [L3,L13,L22] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` should use `as const satisfies Record<string, readonly [number, number, number]>` to narrow tuple element types to literal numbers and enforce schema shape simultaneously — a TS 4.9+/5.x pattern that also locks down runtime mutability at the type level. [L4-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two of the three exports have no listed consumers: `ANCIENT_RTP` (name implies a legacy/deprecated constant) and `lineWins` (payline checking is described in docs as living in `engine.ts` via `checkLine`). Dead exports in a utility module add surface area without benefit and should be removed or documented as public API. [L3,L22-L38] |

### Suggestions

- Lock PAY_TABLE tuples as readonly to prevent accidental in-place mutation (critical for regulated gaming paytable integrity).
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
- Mark `symbols` parameter as readonly to express the non-mutation contract.
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: readonly Symbol[]): ...`
- Add JSDoc to all public exports, especially `getPayMultiplier` whose 0-return edge cases are non-obvious.
  ```typescript
  // Before
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  // After
  /**
   * Returns the base pay multiplier for a (symbol, run-length) pair.
   * Returns 0 for counts < 3, for WILD, and for SCATTER.
   */
  export function getPayMultiplier(symbol: Symbol, count: number): number {
  ```
- Rename or remove `ANCIENT_RTP` — the `ANCIENT` prefix implies deprecation; if still needed, rename to `BASE_RTP` and add a JSDoc explaining its role.
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Theoretical Return-to-Player target for this paytable configuration. */
  export const BASE_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
