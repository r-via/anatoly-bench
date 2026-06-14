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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 70% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 75% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type; runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Type alias with no RAG match.
- **Correction [OK]**: Type alias; runtime validation in spin enforces the 1..100 integer contract.
- **Overengineering [LEAN]**: Simple type alias for a primitive. Adds no abstraction overhead.
- **Tests [NONE]**: No test file exists. Type alias with no runtime behavior, but still undocumented by tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Public API consumers get no context on valid range, currency unit, or relationship to lineBet.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout: `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-local constant with no RAG match.
- **Correction [OK]**: Value 0.05 correctly represents 5% house edge; misapplication is in computePayout.
- **Overengineering [LEAN]**: Named constant for a magic number — appropriate.
- **Tests [NONE]**: No test file. HOUSE_EDGE is applied in computePayout and directly affects RTP correctness — critical business logic with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private module-level constant, no JSDoc. Internal; low priority, but the value's semantic (edge applied as a multiplier, not a deduction) is non-obvious.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the `if (DEBUG_MODE)` branch in spin is permanently dead code and can never execute.
- **Duplication [UNIQUE]**: Module-local constant with no RAG match.
- **Correction [OK]**: Boolean flag used correctly in conditional log branch inside spin.
- **Overengineering [LEAN]**: Hardcoded false; dead code but not an abstraction problem.
- **Tests [NONE]**: No test file. Constant always false; dead code path, but still untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private flag, self-descriptive name, no JSDoc needed for internal use.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`.
- **Duplication [UNIQUE]**: IoC registry class with no RAG match.
- **Correction [OK]**: Registry pattern is internally consistent; all keys are registered before any resolve call.
- **Overengineering [OVER]**: Hand-rolled DI container (register/resolve Map) used to store three symbols that are already directly imported at the top of the file. The container adds a runtime indirection layer with no benefit: callers in spin() resolve the same functions they could call directly. Single use, no interface, no swappable implementations.
- **Tests [NONE]**: No test file. register/resolve are core DI primitives used throughout spin(); no tests for missing key, type safety, or overwrite behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI registry class with no JSDoc. Not exported; moderate concern only because its purpose (why a custom container instead of direct imports) is non-obvious.

#### `container` (L29–L29)

- **Utility [USED]**: Resolved three times inside spin (rng, paytable, reels).
- **Duplication [UNIQUE]**: Module-level singleton with no RAG match.
- **Correction [OK]**: Module-level singleton with all three keys registered before first use in spin.
- **Overengineering [LEAN]**: Module-level instantiation; over-engineering source is EngineContainer, not this binding.
- **Tests [NONE]**: No test file. Module-level singleton with no isolation mechanism; not tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton, no JSDoc. Internal only; low priority.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated and indexed in spin for both evaluateLine and wild-multiplier recalculation.
- **Duplication [UNIQUE]**: Data constant with no RAG match.
- **Correction [OK]**: Matches the reference documentation payline table exactly.
- **Overengineering [LEAN]**: Fixed data table — minimal and appropriate for 10 paylines.
- **Tests [NONE]**: No test file. 10 payline definitions directly drive win detection; correctness of each row/col index is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining the coordinate convention (row index per column, 0=top) or the payline shapes. Each row's geometry is opaque without comments.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called inside evaluateLine to detect winning runs.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-skip lead resolution, same SCATTER/WILD guard, same consecutive-match loop, same run>=3 threshold. Differences are only cosmetic — variable names (lead/run vs first/count) and return property names ({sym,run} vs {symbol,count}).
- **Correction [OK]**: Lead-symbol resolution, consecutive-run counting, and SCATTER/all-WILD early-exit are correct.
- **Overengineering [LEAN]**: Single-responsibility: resolves lead symbol and counts the run. Straightforward loop.
- **Tests [NONE]**: No test file. WILD-leading resolution, SCATTER early-exit, run counting, and the >=3 threshold are all untested edge cases critical to payout correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, no JSDoc. Under 20 lines; tolerable, but the WILD/SCATTER early-return and lead-symbol resolution logic benefit from brief documentation.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve the leading non-WILD symbol, count consecutive matching/WILD symbols, and return null when run < 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin for each payline to collect wins.
- **Duplication [UNIQUE]**: No RAG match found.
- **Correction [OK]**: Symbol extraction via payline mapping, base payout, and wild-boost calculation are internally consistent.
- **Overengineering [LEAN]**: Delegates symbol detection to checkLine, then applies wild multiplier math inline. All complexity is domain-necessary.
- **Tests [NONE]**: No test file. Wild-boost multiplier formula (1+wc)*2^wc applied on top of base payout is complex and completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper with non-trivial wild-multiplier escalation formula (basePayout * (1 + wildCount) * 2^wildCount). No JSDoc explains this exponential boost.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin (L137); spin is runtime-imported by src/index.ts, making this transitively live.
- **Duplication [UNIQUE]**: No RAG match found.
- **Correction [NEEDS_FIX]**: House edge applied with wrong sign and payout rounded up, together driving RTP above 100%.
- **Overengineering [LEAN]**: Short aggregation function with a simple reduce and two adjustments. No unnecessary abstraction.
- **Tests [NONE]**: No test file. House-edge inflation on wins and unconditional +bet*0.01 offset (which increases effective RTP rather than reducing it) are business-critical bugs with no test coverage.
- **PARTIAL [PARTIAL]**: Has a JSDoc block but omits @param descriptions for lineWins and bet, omits @returns, and the claim 'target RTP of approximately 95%' is misleading — the code adds HOUSE_EDGE (raising payout) rather than deducting it, contradicting the stated intent.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported; runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG match found.
- **Correction [NEEDS_FIX]**: bet > 100 logs a warning and continues instead of rejecting, violating the arbitrated 1..100 integer contract.
- **Overengineering [LEAN]**: The function's own logic is a straight sequential pipeline: validate → build reels → evaluate lines → aggregate. The factory, strategy, and emitter patterns it consumes are defined elsewhere and will be evaluated in their own files.
- **Tests [NONE]**: No test file. Exported entry point imported by src/index.ts; bet validation, free-spin state, jackpot path, wildMultiplier accumulation, and strategy.adjustPayout integration all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc. No description of the bet parameter constraints (integer, 1–100), thrown string on invalid bet, or the structure of SpinResult fields.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Both public exports type bet as any. The runtime typeof guard narrows the value, but the signature disables call-site inference and advertises any to all consumers. The Bet alias already exists on L12 and is unused. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is typed as number[][] — mutable nested arrays. The reference doc specifies reels as ReadonlyArray<ReadonlyArray<Symbol>>; the constant payline table warrants the same protection. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) throw 'invalid bet' fires no-throw-literal — callers cannot catch it with instanceof Error. (2) rng resolved at L120 is never read after resolution. (3) reelsModule resolved at L122 is never read — both are no-unused-vars violations. The actual reel helpers are consumed from direct imports, making the container registrations dead code. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spin — the primary public entry point — has no JSDoc. Bet type alias also undocumented. computePayout has a doc block. [L12, L113] |
| 10 | Modern 2026 practices | WARN | MEDIUM | throw 'invalid bet' is a bare string throw. Modern practice: throw new Error('invalid bet') for stack trace, message, and instanceof compatibility. [L115] |
| 12 | Async/Promises/Error handling | WARN | HIGH | String throw at L115 breaks catch (e instanceof Error) contracts for every caller. EngineContainer.resolve<T> at L24-L26 returns the registry value cast as T with no existence check — silently produces undefined as T when a key is missing, bypassing the type system. [L24-L26, L115] |
| 13 | Security | WARN | CRITICAL | Slot-machine / casino domain confirmed from reel/payline/scatter/jackpot/WILD/SEVEN vocabulary. weightedPick from ./rng.js is unverified as CSPRNG-compliant. Regulated gaming requires certifiable randomness (Math.random()-seeded PRNGs are not certifiable). Cannot confirm the violation without rng.js source, but this must be audited before any regulated deployment. No hardcoded secrets or eval in this file. [L2, L30] |
| 14 | Performance | WARN | MEDIUM | emitter.on(SPIN_DONE, () => {}) registers a permanent no-op listener on every spin() invocation. The listener is never removed via off(), so the listener list grows unboundedly over the session. [L175] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter are hard-instantiated inside spin() with no injection seam. The module-level singleton container compounds isolation difficulty — replacing the RNG or strategy in tests requires monkey-patching the container directly. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | EngineContainer.resolve<T> returns registry.get(key) as T — an unsafe cast. Using satisfies at registration time or a type-safe Map<K, V> variant would eliminate the cast without runtime cost. [L24-L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming domain: computePayout multiplies wins by (1 + HOUSE_EDGE) = 1.05, inflating payouts by 5% instead of reducing them. The arbitrated contract specifies 95% RTP (multiply by 0.95, not 1.05). The JSDoc on computePayout itself states 'Applies the house edge to maintain a target RTP of approximately 95%' — the math is directly inverted relative to both the documentation and the arbitrated intent. [L104-L106] |

### Suggestions

- Replace explicit any with the already-exported Bet alias
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house-edge multiplier to achieve documented 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 — increases payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 — correct 95% RTP`
- Throw an Error instance instead of a bare string
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the two unused container resolutions (rng, reelsModule)
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  // deleted — weightedPick and reel helpers are consumed via direct imports; container holds dead registrations
  ```
- Remove the permanent no-op listener registered on every spin
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Strengthen PAYLINES immutability
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout; slot-machine payouts must round down so the house retains fractional remainders. [L110]
- **[correction · medium · small]** Throw an error when bet > 100, consistent with the arbitrated 1..100 integer contract and the existing throws for bet < 1 and non-integer inputs. [L118]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` in computePayout so the house edge reduces payout to ~95% RTP instead of inflating it above 100%. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
