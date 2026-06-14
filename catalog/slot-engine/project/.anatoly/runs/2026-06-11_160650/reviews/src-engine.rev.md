# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found elsewhere.
- **Correction [OK]**: Type alias is correct; runtime constraints enforced in spin().
- **Overengineering [LEAN]**: Single-line type alias for a domain concept. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **DOCUMENTED [DOCUMENTED]**: Simple type alias for number; self-descriptive name requires no JSDoc.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (line 106): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: No similar constant found elsewhere.
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named numeric constant. No abstraction overhead.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE affects computePayout output but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant — name and value are legible, but the design decision (why 0.05, relationship to RTP target) is undocumented. Not exported, so severity is low.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the guarded `if (DEBUG_MODE)` block in spin can never execute, making the flag permanently dead weight.
- **Duplication [UNIQUE]**: No similar constant found elsewhere.
- **Correction [OK]**: Boolean constant; no correctness defect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag; name is self-explanatory. Low severity as it is not exported.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create `container`.
- **Duplication [UNIQUE]**: No similar class found elsewhere.
- **Correction [OK]**: Registry stores and retrieves values via cast correctly; no correctness defect.
- **Overengineering [OVER]**: DIY Map-backed IoC container for 3 statically-imported ES modules. All three dependencies (weightedPick, getPayMultiplier, getReelSymbols/getReelWeights) are already in scope as named imports — the register/resolve indirection adds zero testability or runtime flexibility. In spin(), rng and reelsModule are resolved from the container but never actually consumed (factory.buildReels() replaces reelsModule; rng goes unused).
- **Tests [NONE]**: No test file exists. register/resolve behavior, missing-key behavior, and type-cast correctness are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class, register, or resolve methods. The class implements a service-locator pattern that is not obvious from the name alone; resolve uses an unsafe cast with no explanation of failure behavior.

#### `container` (L29–L29)

- **Utility [USED]**: Populated at lines 30–32 and resolved inside spin for rng, paytable, and reelsModule.
- **Duplication [UNIQUE]**: No similar variable found elsewhere.
- **Correction [OK]**: Module-level DI container initialized correctly.
- **Overengineering [LEAN]**: Plain instantiation of EngineContainer; overengineering lives in the class definition above.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with no explanation of lifecycle or why it is used as a DI container.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin (line 139) and indexed again at line 156 for wild multiplier calculation.
- **Duplication [UNIQUE]**: No similar constant found elsewhere.
- **Correction [OK]**: Matches the 10-payline definition in reference documentation exactly.
- **Overengineering [LEAN]**: Fixed data table for 10 paylines. Correct representation for a static config.
- **Tests [NONE]**: No test file exists. Payline coordinate correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index encoding of each payline path is non-obvious (e.g., [0,1,2,1,0] = V-shape). No inline comments label the shapes; consumers reading the constant cannot understand the geometry without external context.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine (line 73).
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-skipping lead resolution, same SCATTER guard, same counting loop with WILD match, same threshold of 3. Only difference is variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Functions are interchangeable in behavior.
- **Correction [OK]**: WILD substitution and consecutive-run detection are correct; all-WILD and SCATTER leads are properly rejected.
- **Overengineering [LEAN]**: Single-purpose: identify leading symbol and run length. Straightforward loop, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. WILD-leading, SCATTER early-exit, run < 3 cutoff, and mixed WILD runs are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper with non-trivial WILD-substitution logic and SCATTER exclusion — both warrant at least a brief comment. Not exported so severity is moderate.

> **Duplicate of** `src/paytable.ts:lineWins` — ~98% identical logic — both resolve lead symbol skipping WILDs, guard against SCATTER, count consecutive lead-or-WILD symbols, and return null if run < 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin (line 140) for each payline.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Base payout computed correctly per documented formula; wild bonus multiplier is self-consistent and not contradicted by any stated contract.
- **Overengineering [LEAN]**: Computes payout for one payline including wild-boost math. Complexity matches the domain logic it encodes.
- **Tests [NONE]**: No test file exists. Wild multiplier math, no-win path, and payout calculation against lineBet are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function with complex wild-multiplier math (basePayout * (1 + wildCount) * 2^wildCount). The formula is undocumented and not intuitive.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin (line 143); spin is runtime-imported by src/index.ts, making this transitively reachable.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied in the wrong direction (boosts payout by 5% instead of reducing it), and Math.ceil rounds in the player's favor.
- **Overengineering [LEAN]**: Simple reduce with two numeric adjustments. Not over-abstracted.
- **Tests [NONE]**: No test file exists. The house-edge application is inverted (multiplies by 1.05 instead of reducing), the flat +1% bet bonus is undocumented, and Math.ceil rounding are all untested. Critical exported function called via spin.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and RTP target. Missing: @param descriptions for lineWins and bet (typed any, no constraint documented), @returns, and the unconditional bet*0.01 floor behavior is not mentioned.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Bet upper-bound (≤100) is warned but not enforced, contradicting the arbitrated contract that valid bets are 1..100 integers.
- **Overengineering [LEAN]**: Own logic is direct: validate input, build grid, evaluate paylines, aggregate results. Factory/Strategy/Emitter complexity is defined in other files; per rule 8, do not flag the consumer for upstream abstractions.
- **Tests [NONE]**: No test file exists. Primary exported function imported by src/index.ts. Bet validation, payout computation, free-spin triggering, jackpot detection, and wildMultiplier accumulation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the primary exported public API. Bet validation rules, thrown string error, scatter/free-spin side effects, jackpot detection, and wild-multiplier computation are all undocumented at the call site. (deliberated: confirmed — Confirmed. src/engine.ts:118 — `if (bet > 100) console.warn("bet exceeds maximum")` only warns but does not throw or return, allowing arbitrarily large bets to be processed. Lines 114-115 enforce type/minimum/integer constraints with a throw, but the upper bound is a soft warning. No other enforcement exists: src/index.ts:1 re-exports spin directly. In a slot engine, bet limits are a financial safety boundary and must be enforced, not just logged.)

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | `bet: any` appears in both public signatures: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. `Bet = number` is defined at L11 but never applied as a param type. `EngineContainer.resolve<T>` returns `registry.get(key) as T` from an `unknown` map, which is an unchecked unsafe cast. [L11, L25, L90, L99] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is fully mutable; elements and rows can be overwritten at runtime. Should be `readonly (readonly number[])[]` or `as const`. [L37] |
| 8 | ESLint compliance | FAIL | HIGH | Four violations: (1) `rng` at L109 declared but never called (`no-unused-vars`); (2) `reelsModule` at L111 declared but never used; (3) `throw "invalid bet"` at L103 violates `no-throw-literal`; (4) `emitter.on(SPIN_DONE, () => {})` at L161 registers a no-op listener (`no-empty-function`). [L103, L109, L111, L161] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` (L99) and `type Bet` (L11) are exported without JSDoc. `computePayout` has JSDoc. [L11, L99] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` at L103 throws a string literal, not an `Error`. Callers lose `.message`, `.stack`, and `instanceof Error` checks, breaking standard catch-block patterns. [L103] |
| 13 | Security | WARN | MEDIUM | Casino/slot-machine domain inferred from reel/payline/scatter/jackpot/freespin vocabulary. `lineBet = bet / 10` (L118) introduces IEEE 754 floating-point imprecision into credit arithmetic. `Math.ceil` at L97 provides terminal rounding but intermediate per-line payout accumulations are lossy. No hardcoded secrets, `eval`, or command injection found. [L97, L118] |
| 14 | Performance | WARN | MEDIUM | Wild-multiplier loop at L138–L147 re-extracts symbols via `PAYLINES[w.lineIndex].map(...)`, duplicating the extraction already done inside `evaluateLine`. Cache symbol arrays from the primary evaluation pass. [L138-L147] |
| 15 | Testability | WARN | MEDIUM | `spin()` hardcodes `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` at L113–L115 with no injection path. The container provides partial DI for `rng`/`paytable`/`reels`, but these three objects are untestable without module-level mocking. [L113-L115] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` would benefit from `satisfies readonly (readonly number[])[]` to enforce shape while preserving literal inference. No TS5.5+ patterns (`satisfies`, `using`, const type params) used anywhere in the file. [L37] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino domain, two violations: (1) `computePayout` at L93 applies `total * (1 + HOUSE_EDGE)`, which INCREASES winning payouts by 5% — RTP exceeds 100%, directly contradicting the arbitrated 95% RTP contract (README.md). Correct: `total * (1 - HOUSE_EDGE)`. (2) `spin()` at L104 only `console.warn` when `bet > 100` instead of throwing, silently accepting out-of-range bets in violation of the 1–100 integer contract. [L93, L104] |

### Suggestions

- Apply Bet type to public function signatures instead of any
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object, not a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house edge — reduce payout, not inflate it
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Enforce bet upper-bound with a throw instead of a silent warn
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Make PAYLINES immutable with as const
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [`
- Remove unused container-resolved variables
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

- **[correction · medium · small]** Replace Math.ceil with Math.floor so the house retains the fractional remainder, consistent with slot-machine industry convention and the 95% RTP target. [L110]
- **[correction · medium · small]** Replace `console.warn("bet exceeds maximum")` with a throw (matching the lower-bound guard) to enforce the documented upper bound of 100 coins. [L118]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so wins are reduced by 5%, targeting the documented RTP of 95% instead of boosting payouts to >100% RTP. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
