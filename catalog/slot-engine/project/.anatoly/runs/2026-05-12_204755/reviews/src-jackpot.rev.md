# Review: `src/jackpot.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts all DIAMOND symbols across all reels and triggers jackpot at >=4; logic is internally consistent with no off-by-one or type errors.
- **Overengineering [LEAN]**: Flat double-loop count with a single threshold check. No unnecessary abstractions or generics.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, boundary (exactly 4 diamonds), or negative-case tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot condition (>=4 DIAMONDs across all reels), parameter shape, and return semantics.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is a public export with no JSDoc. Should document the jackpot trigger condition (>=4 DIAMONDs) and the reels parameter structure. [L3] |
| 10 | Modern 2026 practices | WARN | MEDIUM | Imperative nested loop with a mutable counter could use `Array.prototype.flat()` + `filter` for a more declarative approach. Not deprecated, but a minor modernization opportunity. [L4-L10] |
| 13 | Security | FAIL | CRITICAL | Slot/casino domain inferred from jackpot, reels, DIAMOND symbols, paytable, freespin, and rng filenames in project structure. Jackpot determination logic must rely on a certified PRNG (see rng.ts). This file itself does not call Math.random(), but the string-equality comparison `sym === 'DIAMOND'` with a magic string rather than a typed enum/const is a correctness risk that could silently pass wrong symbols as jackpot hits in regulated gaming code. Additionally, no boundary validation: `reels` could be empty or malformed with no guard. [L7] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No use of `satisfies`, const type parameters, or other TS 5.5+ features where applicable. The magic string `'DIAMOND'` could be replaced with a `satisfies` or `as const` enum pattern from types.ts. [L7] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Regulated gaming domain: jackpot threshold (>=4) is a hardcoded magic number with no named constant, comment, or reference to a paytable/config source. In regulated gaming, all RTP-affecting thresholds must be auditable and traceable to certified configuration. Magic literal `4` and string `'DIAMOND'` both lack traceability. [L4-L10] |

### Suggestions

- Add JSDoc to document the exported function's contract and jackpot condition.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the reel grid contains at least 4 DIAMOND symbols,
   * triggering a jackpot payout.
   * @param reels - 2-D grid of visible symbols (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Replace magic literals with named constants for auditability in regulated gaming.
  ```typescript
  // Before
  if (sym === "DIAMOND") diamondCount++;
  }
  return diamondCount >= 4;
  // After
  const JACKPOT_SYMBOL = "DIAMOND" as const satisfies Symbol;
  const JACKPOT_THRESHOLD = 4;
  // ...
  if (sym === JACKPOT_SYMBOL) diamondCount++;
  }
  return diamondCount >= JACKPOT_THRESHOLD;
  ```
- Use flat + filter for a declarative, modern alternative to the nested loop.
  ```typescript
  // Before
  let diamondCount = 0;
  for (const col of reels) {
    for (const sym of col) {
      if (sym === "DIAMOND") diamondCount++;
    }
  }
  return diamondCount >= 4;
  // After
  const diamondCount = reels.flat().filter(sym => sym === JACKPOT_SYMBOL).length;
  return diamondCount >= JACKPOT_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
