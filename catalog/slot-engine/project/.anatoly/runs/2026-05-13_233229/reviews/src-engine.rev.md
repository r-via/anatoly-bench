# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Internal constant used in computePayout function at line 108.
- **Duplication [UNIQUE]**: Numeric constant, no duplication detected
- **Correction [OK]**: Constant value 0.05 is correct for a 5% house edge; misuse is in computePayout, not here.
- **Overengineering [LEAN]**: Named constant for a domain value. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math but is never exercised in tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Value 0.05 needs context — whether it inflates or deflates payouts, and its RTP effect, are non-obvious.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Internal constant checked in spin function at line 169.
- **Duplication [UNIQUE]**: Boolean constant, no duplication detected
- **Correction [OK]**: Boolean flag correctly initialized to false.
- **Overengineering [LEAN]**: Simple compile-time flag. Acceptable for dead-code branches.
- **Tests [NONE]**: No test file exists. Constant controls debug logging path; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Trivial name but no comment describing what debug output is produced or how to enable it in other environments.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Internal class instantiated at line 29 to create container instance.
- **Duplication [UNIQUE]**: Simple service container/registry implementation, no similar code detected
- **Correction [OK]**: resolve uses an unchecked `as T` cast, but no better alternative exists without runtime generics; controlled usage poses no correctness risk.
- **Overengineering [OVER]**: Full IoC/DI container (register/resolve with a Map) whose only purpose is to hold three values that are already directly imported at the top of the file. `container.resolve<typeof weightedPick>("rng")` is strictly worse than calling `weightedPick` directly. No test-injection, no multi-implementation scenario, no external consumer — the abstraction provides zero value.
- **Tests [NONE]**: No test file exists. register/resolve logic, including unsafe cast in resolve, has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its methods. Purpose as a DI/service-locator registry is non-obvious; `resolve` silently returns `undefined` on missing keys.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Internal constant used in spin function for line evaluation (lines 138-139, 157).
- **Duplication [UNIQUE]**: Constant array definition, no duplication detected
- **Correction [OK]**: Ten paylines with row indices 0–2 on a 5-reel, 3-row grid are valid.
- **Overengineering [LEAN]**: Static payline configuration data. Flat array of arrays is the right shape.
- **Tests [NONE]**: No test file exists. Payline definitions drive all line-win logic but are never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The encoding (row indices per reel column) and the payline topology (zigzag patterns) are not described.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Internal function called by evaluateLine at line 78.
- **Duplication [DUPLICATE]**: Identical algorithm to lineWins in paytable.ts: both extract leading non-WILD symbol, validate against WILD/SCATTER, count consecutive matches with wildcard support, return run count if >= 3. Only differences are variable naming (lead→first, run→count) and return object property names (sym→symbol, run→count).
- **Correction [OK]**: Leading-WILD substitution, run counting, and SCATTER/all-WILD guards are logically correct.
- **Overengineering [LEAN]**: Single-responsibility helper: finds the leading non-WILD symbol and counts its run. Minimal for the task.
- **Tests [NONE]**: No test file exists. WILD-leading fallback, SCATTER short-circuit, and run-length boundary (run < 3) are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD-substitution logic, SCATTER exclusion, and the minimum run length of 3 are all implicit.

> **Duplicate of** `src/paytable.ts:lineWins` — 99% identical logic with only cosmetic naming differences

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Internal function called in spin loop at line 139.
- **Duplication [UNIQUE]**: No semantically similar functions detected via RAG
- **Correction [OK]**: Wild-bonus formula applied to payout; wildMultiplier in SpinResult is informational and not re-applied.
- **Overengineering [LEAN]**: Combines symbol extraction, run detection, and wild-multiplier math for one payline. Length is justified by distinct steps; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Wild-multiplier compounding formula and null-return path have no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Wild-multiplier formula `(1 + wildCount) * 2^wildCount` and parameter semantics (`lineBet`, `payFn`) are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin at line 142; transitively used through spin's import.
- **Duplication [UNIQUE]**: No semantically similar functions detected via RAG
- **Correction [NEEDS_FIX]**: Three independent defects: wrong-sign house-edge multiplier inflates payout by 5% instead of reducing it; unconditional bet bonus further inflates every payout; Math.ceil rounds in favour of the player.
- **Overengineering [LEAN]**: Straightforward reduction over line wins with two adjustment steps. No unnecessary indirection.
- **Tests [NONE]**: No test file exists. Exported public function with house-edge application, base-bet bonus, and Math.ceil rounding — all untested.
- **PARTIAL [PARTIAL]**: JSDoc mentions house-edge and ~95% RTP but omits: the `bet * 0.01` floor addition, `Math.ceil` rounding, the meaning of the `bet: any` parameter type, and that HOUSE_EDGE actually inflates (not reduces) winning payouts.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on `bet` in both public exports: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The file already defines `Bet = number`; neither function uses it. [L92-L99] |
| 4 | Utility types | WARN | MEDIUM | `EngineContainer.resolve<T>` does `this.registry.get(key) as T` — an unchecked cast through `unknown`. A typed `Map` per key or overloaded signatures would eliminate the unsafe assertion. [L24-L26] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — a mutable module-level constant. Should be `readonly (readonly number[])[]` or use `as const satisfies`. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` violates `@typescript-eslint/no-throw-literal`. `bet: any` in two signatures violates `@typescript-eslint/no-explicit-any`. Empty listener `emitter.on(SPIN_DONE, () => {})` would trigger `@typescript-eslint/no-empty-function`. [L92-L101] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is exported with no JSDoc. `computePayout` has JSDoc. `Bet` type alias has no JSDoc. [L99] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` (string literal) breaks `instanceof Error` checks, stack traces, and error-chain APIs. `emitter.on(SPIN_DONE, () => {})` registers a new no-op listener on every `spin()` call with no corresponding `off()` — unbounded listener accumulation. [L101-L155] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` inside `spin()` adds a listener on every invocation. Over thousands of spins this accumulates unbounded listeners and will trigger MaxListenersExceededWarning. [L155] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hard-instantiated inside `spin()` with no injection point. The module-level `container` singleton shares state across test runs, preventing isolation. |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No `satisfies` operator (applicable to `PAYLINES` or the `result` object literal), no `const` type parameters, no `using` for emitter resource management. |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/slot-machine domain inferred from WILD/SCATTER/jackpot/paylines/reels/RTP vocabulary. Two violations: (1) `computePayout` does `total * (1 + HOUSE_EDGE)` = ×1.05, *increasing* payouts by 5% — the house edge is inverted. Correct formula for 95% RTP is `total * (1 - HOUSE_EDGE)`. This directly contradicts the arbitrated intent 'RTP of 95%, house edge of 5%'. (2) `bet > 100` emits `console.warn` instead of throwing — the arbitrated constraint 'Bet = 1..100 coins, integer' is unenforced at the upper bound. [L92-L100] |

### Suggestions

- Use the `Bet` type instead of `any` on both public function signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object to preserve stack traces and support instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);`
- Enforce the upper-bound constraint from the arbitrated intent (1..100 coins)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`Bet ${bet} exceeds maximum of 100.`);`
- Fix inverted house-edge formula to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 — increases payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 — applies 5% house edge`
- Make PAYLINES immutable with as const satisfies
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    ...
  ];
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    ...
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Register the SPIN_DONE listener once at module level, not inside spin()
  ```typescript
  // Before
  // inside spin():
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // module level:
  const emitter = new SpinEventEmitter();
  // inside spin():
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.ceil(total)` with `Math.floor(total)` so fractional coins remain with the house. [L110]
- **[correction · medium · small]** Add `bet > 100` to the existing throw condition on L114 (or add a separate guard) and remove the console.warn on L118 to enforce the documented 1..100 coin range. [L114]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to deduct 5% from wins and achieve the documented 95% RTP. [L105]
- **[correction · high · large]** Remove `total += bet * 0.01`; this undocumented bonus inflates every payout and pushes RTP above 100%. [L108]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
