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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 91% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 80% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type alias, 0 importers in codebase
- **Duplication [UNIQUE]**: Type alias for number
- **Correction [OK]**: Type alias only; constraint enforcement happens in spin().
- **Overengineering [LEAN]**: Single-line type alias. No abstraction complexity; 0 importers is a mild smell but the alias itself is trivial.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Type alias for number with no description of valid range, units, or constraints.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Non-exported constant used in computePayout at line 109
- **Duplication [UNIQUE]**: Numeric constant, no duplicates found
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named numeric constant. Appropriate extraction.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math and is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant with no explanation of how it is applied or its relationship to RTP.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Non-exported constant used in conditional at line 171 in spin
- **Duplication [UNIQUE]**: Boolean constant, no duplicates found
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Single boolean flag; dead (false) but trivial.
- **Tests [NONE]**: No test file exists. Constant is always false, but its conditional branch is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag with no description of what debug output it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Non-exported class instantiated at line 29
- **Duplication [UNIQUE]**: Service locator class with register/resolve methods
- **Correction [OK]**: resolve() returns undefined cast to T for unregistered keys, but all three keys are registered at module load before any spin() call, so no runtime fault occurs.
- **Overengineering [OVER]**: String-keyed IoC container (Map<string, unknown> + register/resolve with unsafe `as T` cast) for exactly 3 values that are already statically imported at the top of the file. Zero polymorphism, zero late-binding, zero testability gain — pure indirection that erases types and hides the actual dependencies.
- **Tests [NONE]**: No test file exists. register/resolve behavior and type-unsafe cast are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Purpose as a service-locator/DI container is not explained.

#### `container` (L29–L29)

- **Utility [USED]**: Non-exported module-level variable registered and resolved throughout spin function
- **Duplication [UNIQUE]**: Singleton instance, no duplicates found
- **Correction [OK]**: All keys registered synchronously before spin() can be called.
- **Overengineering [LEAN]**: Module-level instantiation of EngineContainer. Overengineering lives in the class definition; the variable itself is a trivial assignment.
- **Tests [NONE]**: No test file exists. Module-level singleton registration is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with no description of registered services or lifetime.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Non-exported constant used in evaluateLine loop (line 128) and line symbol retrieval (line 161)
- **Duplication [UNIQUE]**: 2D array defining payline patterns
- **Correction [OK]**: All ten payline arrays match the documented table exactly (middle, top, bottom, V-down, V-up, curve-down, curve-up, wave-1, wave-2, zigzag).
- **Overengineering [LEAN]**: Plain data declaration for 10 paylines. No abstraction; matches the documented payline table exactly.
- **Tests [NONE]**: No test file exists. Payline definitions drive win evaluation and are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Row-index layout for ten paylines is non-obvious and warrants shape/pattern descriptions.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Non-exported helper function called by evaluateLine at line 72
- **Duplication [DUPLICATE]**: Identical logic to lineWins — detects consecutive symbol runs with WILD handling; differs only in property names (sym/run vs symbol/count) and variable names (lead vs first)
- **Correction [OK]**: Lead resolution via find() is correct: scans left-to-right for the first non-WILD, SCATTER and all-WILD guards return null, and run counting stops at first mismatch as documented.
- **Overengineering [LEAN]**: Minimal left-to-right scan: resolve lead symbol, count consecutive matching positions, return null below threshold. Single responsibility, no generics or unnecessary indirection.
- **Tests [NONE]**: No test file exists. WILD leading, SCATTER short-circuit, run length threshold (>=3), and mixed-WILD sequences are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper, but WILD/SCATTER substitution logic and the minimum-run rule are non-trivial.

> **Duplicate of** `src/paytable.ts:lineWins` — 92% identical implementation for detecting consecutive symbol runs with WILD and SCATTER handling

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Non-exported helper function called in spin at line 128 within payline evaluation loop
- **Duplication [UNIQUE]**: Evaluates individual paylines with wild multiplier calculations, no similar functions found
- **Correction [OK]**: Wild bonus formula (1+wildCount)×2^wildCount yields ×4/×12/×32 for counts 1/2/3, matching the documented multiplier table exactly.
- **Overengineering [LEAN]**: Passing payFn as a parameter is a mild generalization but aids testability and keeps the function decoupled from the module-level paytable. Inline wild-bonus math is the documented formula, nothing extra.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-result path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function with five parameters including a callback; wild-bonus formula is undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called at line 130 in spin; transitively used by imported spin function
- **Duplication [UNIQUE]**: Aggregates payouts, applies house edge adjustment, no similar functions found
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied in the wrong direction (inflates payouts), and payout rounded up instead of down.
- **Overengineering [LEAN]**: Reduce over line wins, apply house-edge scaling, add floor, ceil. Directly implements the documented payout formula with no extra layers.
- **Tests [NONE]**: No test file exists. House-edge application (only when total>0), flat +1% bet bonus, and Math.ceil rounding are untested. Note: comment claims 95% RTP but HOUSE_EDGE inflates wins, which is the opposite of a house edge.
- **PARTIAL [PARTIAL]**: Has a two-line JSDoc but omits @param and @returns. The description says house edge 'maintains ~95% RTP' yet the code multiplies payout by (1 + HOUSE_EDGE), inflating rather than deducting, making the description misleading. The +1% flat bet bonus is undocumented.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both public export boundaries: `computePayout(lineWins: LineWin[], bet: any)` at L101 and `spin(bet: any)` at L113. The exported `Bet` alias exists at L12 but is unused in both signatures. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` at L34 is typed as mutable `number[][]`. Use `readonly (readonly number[])[]` or `as const` to prevent accidental mutation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Two declared-but-never-used variables: `rng` (L120) and `reelsModule` (L122) — no-unused-vars violations. Both are resolved from the container but never referenced; `factory.buildReels` (L128) bypasses them entirely. [L120-L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` at L113 is the primary public API and has no JSDoc. `export type Bet` at L12 is also undocumented. [L12, L113] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` at L115 throws a string literal instead of an Error object. The thrown value has no `.message`, no `.stack`, and cannot be caught with `instanceof Error`. [L115] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from reel/scatter/jackpot/freespin vocabulary. Regulated gaming requires a single auditable RNG. The registered `weightedPick` (L120) is resolved but never invoked — `factory.buildReels(5, 3)` (L128) uses the factory's own internal randomness, bypassing the auditable RNG layer. No eval, hardcoded secrets, or injection vectors found. [L120, L128] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated directly inside `spin()` (L124–126) rather than injected via the existing `EngineContainer`, making them impossible to mock in unit tests. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies` for structural validation with inferred literal types. The `emitter` could use `using` (explicit resource management) to guarantee listener cleanup instead of the unremoved empty listener at L175. [L34, L175] |
| 17 | Context-adapted rules | WARN | MEDIUM | Arbitrated intent (README): `Bet = number; // 1..100 coins, integer` — bets > 100 only emit `console.warn` at L118 and proceed, violating the stated 100-coin ceiling. `emitter.on(SPIN_DONE, () => {})` at L175 registers an empty, never-removed listener immediately before `emit` — dead code that leaks listener references. [L118, L175] |

### Suggestions

- Use the exported Bet type instead of any in both public signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the 100-coin ceiling per the arbitrated contract
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet must not exceed 100");`
- Make PAYLINES deeply readonly using as const
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
  ] as const;
  ```
- Remove or wire the unused container resolutions into the factory/strategy
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  
  const factory = new StandardReelBuilderFactory();
  // After
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  // Pass rng to factory so the certified RNG drives reel generation
  const factory = container.resolve<StandardReelBuilderFactory>("factory");
  ```
- Add JSDoc to spin() and the Bet type alias
  ```typescript
  // Before
  export type Bet = number;
  
  export function spin(bet: any): SpinResult {
  // After
  /** Integer coin bet in range [1, 100]. */
  export type Bet = number;
  
  /**
   * Executes one full spin across 5 reels, evaluates 10 paylines,
   * applies wild multipliers, detects scatters and jackpot.
   * @param bet - Integer coin bet in [1, 100].
   * @throws {Error} When bet is not a positive integer or exceeds 100.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a throw (or equivalent rejection) for bet > 100 in spin() to enforce the documented 1..100 coin bet contract. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so the 5% house edge reduces payouts and achieves the documented RTP=95% target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace Math.ceil with Math.floor in computePayout: slot-machine industry convention requires payouts to round down so the house retains the fractional remainder. [L110]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
