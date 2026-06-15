# Review: `src/engine.ts`

**Verdict:** CRITICAL

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
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type; 0 runtime importers, 0 type-only importers.
- **Duplication [UNIQUE]**: Type alias for number with no similar definitions found
- **Correction [OK]**: Type alias only; no logic to evaluate.
- **Overengineering [LEAN]**: Minimal type alias matching the documented public API surface in README.
- **Tests [GOOD]**: Type alias with no runtime behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Purpose and valid range are not explained.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout at line 106 to apply house edge multiplier.
- **Duplication [UNIQUE]**: Numeric constant with no duplicates found
- **Correction [OK]**: Constant value 0.05 is correct; the misapplication is in computePayout, not here.
- **Overengineering [LEAN]**: Named constant for a domain value used in computePayout. Appropriate.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported internal constant. No comment explaining the 5% value or its effect on RTP.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used in spin at line 171 to conditionally log debug information.
- **Duplication [UNIQUE]**: Boolean constant with no duplicates found
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag. Hardcoded false is dead code but not overengineering.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported internal flag. No comment; name is clear but leniency applied for private helper.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29; provides dependency registration/resolution.
- **Duplication [UNIQUE]**: Service container class with registry pattern, no similar implementations found
- **Correction [OK]**: resolve silently returns undefined cast to T for unknown keys, but all three keys are registered at module load before any spin() call.
- **Overengineering [OVER]**: DIY IoC container (register/resolve via a string-keyed Map) wrapping three static imports that are already in scope at the top of the file. The only consumer is the module-level `container` instance, which immediately registers `weightedPick`, `getPayMultiplier`, and the reels module — all directly imported — only so `spin()` can resolve them back out. No indirection benefit, no swappable implementations, no testability gain beyond what plain variables provide. Textbook single-use container anti-pattern.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported internal class acting as a service locator. No JSDoc on class or either method.

#### `container` (L29–L29)

- **Utility [USED]**: DI container instance; resolves dependencies in spin function.
- **Duplication [UNIQUE]**: Singleton instance initialization with no duplicates found
- **Correction [OK]**: Module-level registration of three known keys; no logic errors.
- **Overengineering [LEAN]**: Straightforward instantiation of EngineContainer. Overengineering lives in the class definition, not here.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported module-level singleton. No comment; tolerated as internal wiring.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin to iterate paylines and evaluate wins.
- **Duplication [UNIQUE]**: Payline configuration array with no similar data structures found
- **Correction [OK]**: Ten paylines, each with five valid row indices (0–2) matching a 3-row reel grid.
- **Overengineering [LEAN]**: Static data table for 10 paylines. No abstraction, appropriate representation.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported constant. No comment describing the row-index encoding scheme or how paylines map to the 3×5 grid.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 84 to detect winning symbol runs.
- **Duplication [DUPLICATE]**: Identical algorithm to lineWins in paytable.ts (score 0.835). Both detect winning symbol runs by counting consecutive matches with WILD substitution and 3+ threshold. Only cosmetic differences: field names (sym/run vs symbol/count)
- **Correction [OK]**: Lead resolution and run counting correctly handle leading WILDs, all-WILD, and SCATTER cases.
- **Overengineering [LEAN]**: Resolves lead symbol through WILDs and counts the run. Single responsibility, no unnecessary indirection.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper. Non-trivial WILD-resolution logic and the SCATTER exclusion rule are undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — Same logic flow: determine lead symbol, validate non-WILD/SCATTER, count consecutive matches, return null if <3, else return symbol and count

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin loop at line 145 to evaluate paylines.
- **Duplication [UNIQUE]**: Wrapper around checkLine that calculates payouts with wild multiplier bonuses. No similar functions found in RAG
- **Correction [OK]**: Wild amplification formula matches documented ×4 for wildCount=1 and ×12 for wildCount=2.
- **Overengineering [ACCEPTABLE]**: The `payFn` higher-order parameter adds one layer of indirection (always called with `getPayMultiplier` in practice), but enables unit testing with a stub paytable. Minor complexity trade-off, not egregious.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper with complex wild-amplification formula. No JSDoc on params, formula, or return value.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin at line 147; transitively used by external spin consumers.
- **Duplication [UNIQUE]**: Aggregates line wins and applies house edge adjustment. No similar functions found in RAG
- **Correction [ERROR]**: House edge applied in the wrong direction (inflates payout by 5%, RTP > 100%); payout also rounds up instead of down.
- **Overengineering [LEAN]**: Straightforward: reduce wins, apply house edge, add floor, ceil. Matches documented formula exactly.
- **Tests [NONE]**: No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing, then adds flat 1% of bet), untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent, but omits @param for both parameters (notably bet typed as any), missing @returns, and does not document the unconditional bet*0.01 floor. (deliberated: confirmed — Confirmed. engine.ts:105 applies `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (engine.ts:14), multiplying winning payouts by 1.05 instead of 0.95. The docstring at engine.ts:99 states 'target RTP of approximately 95%' and paytable.ts:3 defines ANCIENT_RTP=0.95, confirming intent. The correct formula is `total * (1 - HOUSE_EDGE)`. Additionally, engine.ts:108 adds `bet * 0.01` unconditionally (even on losses), and engine.ts:110 uses Math.ceil (rounds up favoring player). All three issues compound to produce RTP well above 100%. This is a real financial/mathematical bug.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on both public exports: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). Both must be `Bet` (or `number`); `any` bypasses all downstream type safety. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` and fully mutable. Should be `as const` or `readonly (readonly number[])[]` to prevent accidental row mutation inside payline evaluation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` (L115) — no-throw-literal, loses stack trace; (2) `console.warn` in the production path (L118) — no-console; (3) `emitter.on(SPIN_DONE, () => {})` (L175) — no-op listener registered on every call, no-unused-expressions. [L115, L118, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L113) has no JSDoc. `Bet` type alias (L12) has no JSDoc. `computePayout` has JSDoc (L97–L100). [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L115) throws a string literal instead of an Error instance, dropping the call stack. No async paths in this file, so no unhandled-rejection risk. [L115] |
| 14 | Performance | WARN | MEDIUM | Wild count is computed inside `evaluateLine` (L80–L83) then recomputed from scratch in the `spin` post-loop (L148–L157) for `wildMultiplier` — redundant O(n) traversal per win line. The no-op `emitter.on` (L175) adds a dead closure allocation on every spin. [L148-L157, L175] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hardcoded inside `spin` with `new` — no injection point for mocks. The module-level `EngineContainer` singleton has no reset/swap path for test isolation. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies readonly (readonly number[])[]` to preserve literal tuple types while enforcing shape. No use of `const` type parameters or `using` where applicable. [L34] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Slot-engine domain. `computePayout` applies `total * (1 + HOUSE_EDGE)` (L105), multiplying winning payouts by 1.05 — boosting them 5% instead of reducing them. This inverts the house edge, producing RTP > 100% on all winning spins. Contradicts the arbitrated invariant (README.md): 'The engine targets a theoretical Return-to-Player of 95% / house edge of 5%'. Correct formula: `total * (1 - HOUSE_EDGE)`. [L105] |

### Suggestions

- Replace `any` with the `Bet` type on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house edge to correctly target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable to prevent accidental mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove redundant wild-count recomputation and no-op event listener
  ```typescript
  // Before
  let wildMultiplier = 1;
  for (const w of wins) {
    const lineSymbols = PAYLINES[w.lineIndex].map((row, col) => reels[col][row]);
    let wc = 0;
    for (let k = 0; k < w.count; k++) {
      if (lineSymbols[k] === "WILD") wc++;
    }
    if (wc > 0) {
      wildMultiplier = Math.max(wildMultiplier, (1 + wc) * 2 ** wc);
    }
  }
  // ...
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // Carry wildCount out of evaluateLine so spin can read it directly.
  // Remove the post-hoc recomputation loop entirely.
  // Remove the no-op listener — emit only:
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout; slot-machine payouts must round down so the house retains the fractional remainder. [L110]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout to deduct the 5% house edge rather than inflate the payout. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Remove the unused container.resolve calls for rng (L120) and reelsModule (L122) from spin(), or thread them through factory.buildReels so the container-registered RNG actually governs reel construction. [L120]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
