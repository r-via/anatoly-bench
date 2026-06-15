# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 80% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type not imported by any file.
- **Duplication [UNIQUE]**: Simple type alias for number; no similar types found
- **Correction [OK]**: Type alias only; runtime enforcement happens in spin().
- **Overengineering [LEAN]**: Simple type alias documented in the README API surface. No abstraction overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Name is clear but purpose (e.g. valid range, units) is undocumented.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout at line 108 for RTP calculation.
- **Duplication [UNIQUE]**: Numeric constant with no similar definitions found
- **Correction [OK]**: Constant value 0.05 is correct; defect is in how computePayout uses it, not the constant itself.
- **Overengineering [LEAN]**: Named constant for a magic number used in computePayout. Appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout calculation but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant with no comment explaining its role in RTP calculation or where it is applied.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used in spin at line 174 as condition for logging.
- **Duplication [UNIQUE]**: Boolean constant with no similar definitions found
- **Correction [OK]**: Boolean guard; no correctness issue.
- **Overengineering [LEAN]**: Common compile-time debug flag. Hardcoded false is fine for shipping code.
- **Tests [NONE]**: No test file exists. Constant is always false; branch it guards is dead code with no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag with no comment; effect (suppresses console.log in spin) is not stated.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create container variable.
- **Duplication [UNIQUE]**: Simple service locator pattern with no similar implementations found
- **Correction [OK]**: resolve() silently returns undefined for unregistered keys, but all keys resolved in spin() are pre-registered at module load, so no runtime failure in current paths.
- **Overengineering [OVER]**: DIY IoC container (string-keyed registry with generic resolve<T>) built for a single-file module that already imports its dependencies directly. The three registered values are direct module imports that could be used as-is; two of them (rng, reelsModule) are resolved in spin() but never actually called. Adds type-unsafe casting (as T) with zero benefit over plain imports.
- **Tests [NONE]**: No test file exists. register/resolve mechanics, including the unsafe cast in resolve, are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container class with no JSDoc. Purpose, lifetime, and usage contract are undocumented. Leniency applied as non-exported internal class.

#### `container` (L29–L29)

- **Utility [USED]**: Used for registering and resolving dependencies in spin function.
- **Duplication [UNIQUE]**: Singleton instance of EngineContainer; no similar instances found
- **Correction [OK]**: Module-level DI container; three registrations are consistent with what spin() resolves.
- **Overengineering [LEAN]**: Instantiation of EngineContainer; the overengineering lives in the class definition above, not here.
- **Tests [NONE]**: No test file exists. Module-level singleton with registered dependencies is never exercised in isolation.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment explaining why it exists or what it registers.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin at line 125-126 for line evaluation and at line 151 for wild count calculation.
- **Duplication [UNIQUE]**: Payline configuration constant with no similar definitions found
- **Correction [OK]**: All 10 row-index sequences match the architecture documentation exactly.
- **Overengineering [LEAN]**: Flat 2D array of ten fixed payline row-index sequences. Correct representation for the domain; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. The 10 payline definitions drive all win evaluation logic but are never validated for correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: No comment describing payline semantics (row-index sequences per reel column, left-to-right evaluation direction, or pattern shapes).

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine at line 76 to validate symbol patterns.
- **Duplication [DUPLICATE]**: Identical logic to lineWins from paytable.ts; both detect winning symbol patterns with same algorithm
- **Correction [OK]**: Lead detection via symbols.find() correctly handles all-WILD (returns null) and SCATTER-as-first-non-WILD (returns null); consecutive run counting is correct.
- **Overengineering [LEAN]**: Single-responsibility: scans a 5-symbol slice left-to-right, returns lead symbol and run length or null. Appropriately concise.
- **Tests [NONE]**: No test file exists. Critical logic covering WILD substitution, SCATTER short-circuit, run counting, and minimum-run threshold is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper with no JSDoc. Lead-symbol resolution logic, WILD substitution rules, and minimum-run threshold are not documented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical implementation — same input/output contract, identical loop structure for detecting consecutive matching symbols, differ only in variable names (lead/first, run/count, sym/symbol)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin at line 126 for each payline to compute wins.
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Wild bonus formula (1 + wildCount) × 2^wildCount matches the reference documentation table: wc=1→×4, wc=2→×12, wc=3→×32.
- **Overengineering [LEAN]**: Combines checkLine, paytable lookup, wild-bonus calculation into one payline evaluation pass. Complexity matches the documented wild-multiplier formula; no unnecessary indirection.
- **Tests [NONE]**: No test file exists. Wild-count bonus multiplier formula (basePayout * (1+wc) * 2^wc) and null-return path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with no JSDoc. Wild-bonus formula `(1+wildCount)×2^wildCount`, lineBet derivation, and return contract are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin at line 128; transitively used via exported spin function.
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [NEEDS_FIX]**: House edge applied as × (1 + HOUSE_EDGE) = × 1.05, which increases player payout by 5% instead of deducting it; violates the arbitrated RTP=95% target.
- **Overengineering [LEAN]**: Straightforward reduce + house-edge application + floor. Matches the documented payout formula exactly.
- **Tests [NONE]**: No test file exists. Exported function with inverted HOUSE_EDGE application (adds edge instead of reducing it), fixed 1% bet bonus, and Math.ceil rounding — all business-critical, all untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param descriptions for lineWins and bet, omits @returns, and does not explain the unconditional `bet * 0.01` floor or the Math.ceil rounding.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Two exported function signatures use explicit `any`: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). Both should use the locally defined `Bet` type. Additionally, `EngineContainer.resolve<T>` casts `unknown` to `T` via `as T` (L25), which bypasses the type system entirely — the container has no way to verify the stored value matches T. [L25, L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as mutable `number[][]`. It is a module-level constant whose rows are indexed directly by payline logic and should never be mutated. Declare it `readonly (readonly number[])[]` or use `as const`. [L34-L45] |
| 8 | ESLint compliance | WARN | HIGH | Four lint violations: (1) `throw "invalid bet"` (L115) throws a string literal instead of `new Error(...)`, losing the stack trace. (2) `const rng = container.resolve(...)` (L120) is declared but never read — the factory builds reels independently. (3) `const reelsModule = container.resolve(...)` (L122) is also declared and never read. (4) `emitter.on(SPIN_DONE, () => {})` (L175) registers a no-op listener that is never removed. Additionally, per the arbitrated README contract (`Bet = 1..100 coins`, doc-wins), `bet > 100` must be rejected, but L118 only emits a warning. [L115, L118, L120, L122, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is the primary public API with no JSDoc (L113). `export type Bet` has no doc comment (L12). Only `computePayout` is documented. [L12, L113] |
| 14 | Performance | WARN | MEDIUM | `spin()` re-iterates every winning line (L147-L157) to recompute wild counts already computed inside `evaluateLine`. Attach `wildCount` to `LineWin` or accumulate it inside `evaluateLine` and return it to avoid the second pass. [L147-L157] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` with no injection points (L124-L126). The global `container` singleton (L29-L32) makes isolated unit testing require mutating module-level state. Accepting these as parameters or via a factory function would enable deterministic testing. [L29-L32, L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies readonly (readonly number[])[]` to retain literal-type inference while enforcing the shape. `SpinEventEmitter` could be managed with `using` if it implements `Symbol.dispose` to guarantee listener cleanup. [L34, L126] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: (1) `emitter.on(SPIN_DONE, () => {})` (L175) is dead code — it registers a no-op listener immediately before `emit`, serving no observable purpose and leaking the subscription. (2) The DI container registers `getReelSymbols`/`getReelWeights` but the resolved `reelsModule` is never consumed — `factory.buildReels` independently handles reel construction, making the container registration vestigial. [L30-L32, L122, L175] |

### Suggestions

- Replace explicit `any` on public params with the local `Bet` type alias
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw Error objects to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce upper bound per arbitrated contract (Bet = 1..100, doc-wins)
  ```typescript
  // Before
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");
  // After
  if (typeof bet !== "number" || bet < 1 || bet > 100 || !Number.isInteger(bet)) {
    throw new Error("invalid bet");
  }
  ```
- Make PAYLINES immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    // ...
  ];
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove unused resolved variables `rng` and `reelsModule` from spin()
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Remove no-op event listener
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Eliminate redundant wild-count pass by carrying wildCount in LineWin
  ```typescript
  // Before
  // In evaluateLine — wildCount is computed but not returned
  return { lineIndex, symbol: result.sym, count: result.run, payout: basePayout };
  
  // In spin() — recomputed from scratch
  for (const w of wins) {
    const lineSymbols = PAYLINES[w.lineIndex].map((row, col) => reels[col][row]);
    let wc = 0;
    for (let k = 0; k < w.count; k++) { if (lineSymbols[k] === "WILD") wc++; }
    if (wc > 0) wildMultiplier = Math.max(wildMultiplier, (1 + wc) * 2 ** wc);
  }
  // After
  // In evaluateLine — include wildCount in return
  return { lineIndex, symbol: result.sym, count: result.run, payout: basePayout, wildCount };
  
  // In spin() — derive directly
  const wildMultiplier = wins.reduce((max, w) =>
    w.wildCount > 0 ? Math.max(max, (1 + w.wildCount) * 2 ** w.wildCount) : max, 1);
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout (line 105) to correctly deduct the 5% house share and achieve the arbitrated RTP=95% target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
