# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 80% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Wild substitution, scatter and all-wild handling, and the consecutive-match count are consistent. An empty line returns 0. The fractional `bet / 10` line bet has no stated contract in the shown docs, and the function has no callers, so there is nothing concrete to flag.
- **Overengineering [LEAN]**: Short, linear function: resolves first non-wild symbol, counts leading matches, looks up multiplier. No unnecessary abstractions.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is read-only in use but typed mutable; use `readonly Symbol[]` (README uses ReadonlyArray for reels). [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `computeLegacyPayout` has no JSDoc (bet semantics, 10-line division, wild handling undocumented). [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | Hard-coded magic numbers (`3` minimum match, `10` paylines) and string literals `"WILD"`/`"SCATTER"` should be named constants shared with the paytable. The README says 10 paylines, so `bet / 10` is consistent with it. Money arithmetic is floating-point, but this is a single in-memory computation from the inputs. |

### Suggestions

- Accept a readonly array since the function never mutates its input
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc and name the magic numbers
  ```typescript
  // Before
  const lineBet = bet / 10;
  ...
  if (matchCount < 3) return 0;
  // After
  const PAYLINE_COUNT = 10;
  const MIN_MATCH = 3;
  ...
  /** Computes the legacy payout for one payline; the bet is split evenly across paylines. */
  const lineBet = bet / PAYLINE_COUNT;
  if (matchCount < MIN_MATCH) return 0;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
