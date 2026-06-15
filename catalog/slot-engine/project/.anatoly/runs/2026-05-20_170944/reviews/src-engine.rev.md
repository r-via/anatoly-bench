# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Local constant applied to payout calculation on line 109
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Constant 0.05 is correct; the defect is how computePayout applies it.
- **Overengineering [LEAN]**: Named constant for a domain magic number. Minimal and appropriate.
- **Tests [NONE]**: No test file exists; constant's effect on computePayout is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no comment. Non-obvious value (0.05 = 5%) and its effect on RTP is undocumented inline.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Local flag controlling debug logging on line 174
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Boolean flag; no correctness concern.
- **Overengineering [LEAN]**: Hardcoded-false debug flag. Common practice; no abstraction overhead.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private flag with no comment. Self-descriptive name; low severity.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Local class instantiated on line 29 as container; used for dependency injection
- **Duplication [UNIQUE]**: Simple DI container class. No similar classes found in RAG results.
- **Correction [OK]**: resolve() silently returns undefined cast to T for unregistered keys; safe only because all callers in this file use registered keys.
- **Overengineering [OVER]**: Hand-rolled IoC/service-locator for 3 functions that are already imported at the module top. `register`/`resolve` with a stringly-typed `Map<string, unknown>` sacrifices type safety for zero benefit — callers immediately cast via `as T`. The container is never exported, never mocked, and has a single consumer (`spin`). Direct module-level constants would be one line instead of ~15.
- **Tests [NONE]**: No test file exists; register/resolve behavior, missing-key cast, and type-unsafe resolve are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container class with no JSDoc. Not exported; lenient, but purpose and lifecycle are non-obvious from the name alone.

#### `container` (L29–L29)

- **Utility [USED]**: Local instance used to register (lines 30–32) and resolve dependencies (lines 140–142)
- **Duplication [UNIQUE]**: Single instance variable. No similar instances found in RAG results.
- **Correction [OK]**: All three keys consumed in spin() are registered before use.
- **Overengineering [LEAN]**: Straightforward consumer of EngineContainer; the abstraction overhead lives in that class, not here.
- **Tests [NONE]**: No test file exists; module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment explaining why specific services are registered here.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Local array iterated on line 149 and indexed on lines 150, 169 in spin function
- **Duplication [UNIQUE]**: Payline configuration array. No similar constants found in RAG results.
- **Correction [OK]**: Identical to the reference documentation definition.
- **Overengineering [LEAN]**: Static lookup table matching the documented 10-payline layout. Pure data, no abstraction.
- **Tests [NONE]**: No test file exists; payline shape correctness and index usage in evaluateLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Complex 2D array encoding payline row-index paths with no JSDoc. Geometric meaning of each row is not explained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Local helper called on line 75 within evaluateLine to check consecutive matching symbols
- **Duplication [DUPLICATE]**: Identical logic to lineWins: determines lead symbol, counts consecutive matches (including WILDs), returns null if <3 matches. Only differ in return object property names (sym vs symbol, run vs count) and internal variable names.
- **Correction [OK]**: Correctly resolves lead symbol through leading WILDs, counts consecutive matching run, and guards SCATTER/all-WILD lines.
- **Overengineering [LEAN]**: Single-responsibility: resolves leading symbol, counts consecutive matching run. Minimal and clear.
- **Tests [NONE]**: No test file exists; WILD-lead resolution, SCATTER early-return, run < 3 rejection, and mixed-WILD runs are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper with no JSDoc. SCATTER/WILD exclusion logic and run-counting semantics are non-trivial and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical implementation — both analyze symbol arrays for winning paylines with identical branching, WILD handling, and match-counting logic

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Local helper called on line 150 within spin to evaluate each payline
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Internally consistent; undocumented WILD multiplier flagged as doc_divergence.
- **Overengineering [LEAN]**: Composes checkLine, applies paytable multiplier, and adjusts for wilds. Appropriately granular.
- **Tests [NONE]**: No test file exists; wild-bonus multiplier formula and null propagation from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with no JSDoc. Wild multiplier stacking formula (basePayout * (1 + wildCount) * 2^wildCount) is complex and undocumented.

#### `computePayout` (L101–L111)

Auto-resolved: JSDoc block found before symbol

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Two public exports carry explicit `any` on the `bet` parameter: `computePayout` (L101) and `spin` (L113). The file already defines `Bet = number` — both signatures must use it. The runtime guard in `spin` does not excuse the static type annotation. [L101,L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is mutable at both array levels. A downstream mutate would silently corrupt all subsequent spins. Use `as const` or `readonly (readonly number[])[]`. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` (L115) throws a primitive string — no stack trace, `e.message`/`e instanceof Error` in callers will fail; (2) `rng` resolved at L120 is never referenced again; (3) `reelsModule` resolved at L122 is never referenced again. Both are `no-unused-vars` errors that also indicate dead container registrations. [L115,L120,L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is exported without JSDoc; `computePayout` has one. `Bet` type alias also has no doc comment. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code or unhandled rejections. The string throw (L115) is the sole error-handling gap: callers doing `catch (e) { e.message }` will receive `undefined`. Primary penalty lives under rule 8; noted here for completeness. [L115] |
| 14 | Performance | WARN | MEDIUM | L147-157 re-scans all winning payline symbols to recompute a WILD count that `evaluateLine` already computed internally. Propagating `wildCount` through `LineWin` would eliminate the redundant traversal. [L147-L157] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated with `new` inside `spin` (L124-L126). They cannot be injected or mocked without module interception, despite the DI container existing in the same file. Register them in `container` and resolve them to make `spin` fully testable. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAYLINES is a natural candidate for `as const satisfies readonly (readonly number[])[]` to get tuple-level inference and immutability simultaneously. No `using` or `const` type parameters are needed here; no other 5.5+ feature opportunities identified. [L34] |
| 17 | Context-adapted rules | FAIL | MEDIUM | House edge formula is inverted: `total = total * (1 + HOUSE_EDGE)` (L105) multiplies winning payouts by 1.05, INCREASING them above paytable baseline. To reach the arbitrated 95% RTP contract the formula must be `total * (1 - HOUSE_EDGE)`. As written, any non-zero `lineWins` round drives RTP above 100%, causing the house to lose money on wins. Contradicts the arbitrated intent: 'The engine targets a theoretical Return-to-Player of 95%.' [L104-L106] |

### Suggestions

- Replace `bet: any` with the already-defined `Bet` alias on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house edge to achieve 95% RTP as documented
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error instance so callers can use e.message and instanceof
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES deeply immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove the two unused container resolutions
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add bet > 100 to the validation guard and throw instead of console.warn to enforce the 1..100 integer contract. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- **[utility · high · trivial]** Remove dead code: `computePayout` is exported but unused (`computePayout`) [L101-L111]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) so the house edge reduces payouts toward 95% RTP instead of inflating them above 100%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace Math.ceil with Math.floor so fractional coins go to the house per casino convention. [L110]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `Bet`, `computePayout`, `spin` (`Bet, computePayout, spin`) [L12-L12, L101-L111, L113-L179]
