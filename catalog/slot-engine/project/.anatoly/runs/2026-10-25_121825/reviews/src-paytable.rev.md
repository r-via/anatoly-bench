# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Constant declared correctly; no callers is a Utility axis concern, not a correctness defect.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction needed.
- **Tests [-]**: *(not evaluated)*

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Referenced in-file by getPayMultiplier (which is imported by other files)
- **Duplication [UNIQUE]**: No similar pay table data structure found in RAG results.
- **Correction [OK]**: Tuple layout [3-match, 4-match, 5-match] is internally consistent and correctly indexed by getPayMultiplier.
- **Overengineering [LEAN]**: Flat record mapping symbols to fixed-length tuples for 3/4/5-match payouts. The tuple type matches exactly the three meaningful counts; no generalization needed.
- **Tests [-]**: *(not evaluated)*

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Runtime-imported by 2 files: src/engine.ts, src/legacy.ts
- **Duplication [UNIQUE]**: No similar functions found per RAG. Logic is specific to PAY_TABLE lookup by symbol and count.
- **Correction [OK]**: Index mapping is correct: count 3→row[0], 4→row[1], 5→row[2]; missing symbol and out-of-range count both return 0 safely.
- **Overengineering [LEAN]**: Three explicit if-checks for counts 3/4/5 are readable and direct. Could be `row[count - 3] ?? 0` but the current form is clear, not padded.
- **Tests [-]**: *(not evaluated)*

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [DUPLICATE]**: Algorithm is identical to checkLine in src/engine.ts: both resolve the lead non-WILD symbol, guard on WILD/SCATTER, count a consecutive run treating WILD as wildcard, and return null if run < 3. Only difference is return property names (symbol/count vs sym/run) — the semantic contract is interchangeable.
- **Correction [OK]**: WILD substitution and consecutive-count logic are correct. Leading WILDs resolve via find(s => s !== 'WILD'), which returns the first non-WILD immediately after the run; SCATTER and all-WILD lines return null; empty input returns null safely. No defects found.
- **Overengineering [LEAN]**: Wild-anchor resolution and consecutive-match counting are both domain requirements for a left-to-right payline evaluator. The logic is appropriately compact for what it must handle.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/engine.ts:checkLine` — ~95% identical logic — same lead-symbol resolution, same WILD/SCATTER guard, same consecutive-run loop, same >=3 threshold; differs only in return field names symbol→sym, count→run

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `PAY_TABLE` is mutable at runtime — no `as const` or `Readonly<>` wrapper. `lineWins(symbols: Symbol[])` never mutates its argument but is not typed `readonly Symbol[]`. [L5-L12, L24] |
| 6 | Interface vs Type | WARN | MEDIUM | `lineWins` return type uses an anonymous inline object `{ symbol: Symbol; count: number }` instead of the `LineWin` named type used in `SpinResult` (README). Inline types here diverge from the project's named-type convention and couple the return shape implicitly. [L24] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Three public exports — `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` — carry no JSDoc. `ANCIENT_RTP` is especially opaque: the name hints at a theme but the value (0.95) and scope (which game variant?) are not self-evident. [L3, L14, L24] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAY_TABLE` uses a type annotation `Record<string, [number, number, number]>` instead of the `satisfies` operator. `satisfies` would preserve tuple literal types for each row while still enforcing the shape, enabling compile-time range checking. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine domain: `PAY_TABLE` key type is `string` instead of `Symbol` (the project's domain union type). Any string is accepted by the index, so an out-of-range lookup returns `undefined` silently, relying entirely on the runtime `!row` guard. Using `Record<Symbol, ...>` would shift this to a compile-time error. [L5] |

### Suggestions

- Use `satisfies` with the Symbol union key type to get compile-time coverage and preserve literal tuple types
  ```typescript
  // Before
  const PAY_TABLE: Record<string, [number, number, number]> = {
    CHERRY:  [2,   5,   25],
    // ...
  };
  // After
  const PAY_TABLE = {
    CHERRY:  [2,   5,   25] as const,
    LEMON:   [2,   5,   25] as const,
    BELL:    [5,   20,  100] as const,
    BAR:     [10,  40,  200] as const,
    SEVEN:   [25,  100, 500] as const,
    DIAMOND: [50,  250, 1000] as const,
  } satisfies Record<Exclude<Symbol, "WILD" | "SCATTER">, readonly [number, number, number]>;
  ```
- Narrow the `lineWins` parameter to `readonly` and return the named `LineWin` type
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: readonly Symbol[]): LineWin | null {`
- Add JSDoc to all public exports, particularly the opaque `ANCIENT_RTP` constant
  ```typescript
  // Before
  export const ANCIENT_RTP = 0.95;
  // After
  /** Return-to-player ratio for the Ancient Egypt theme variant (95 %). */
  export const ANCIENT_RTP = 0.95;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
