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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 88% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with zero runtime importers and zero type-only importers. Not used anywhere.
- **Duplication [UNIQUE]**: Simple type alias for number. No duplication found.
- **Correction [OK]**: Type alias — no implementation to evaluate.
- **Overengineering [LEAN]**: Trivial type alias for a domain concept. 0 importers makes it dead code, but the alias itself is minimal.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias with no description of valid range, units, or constraints (e.g., min/max bet values).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 108 to adjust total payout.
- **Duplication [UNIQUE]**: Numeric constant specific to engine configuration. No similar constants identified.
- **Correction [OK]**: Value 0.05 matches the documented 5% house edge; the constant itself is correct.
- **Overengineering [LEAN]**: Named constant for a magic number. Appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math in computePayout but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The value 0.05 and its role in payout calculation are not explained inline.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin at line 167 for conditional debug logging.
- **Duplication [UNIQUE]**: Boolean flag for debug logging. No duplication found.
- **Correction [OK]**: Simple boolean flag; no correctness issues.
- **Overengineering [LEAN]**: Simple hardcoded boolean flag. Not overengineered.
- **Tests [NONE]**: No test file exists. Trivial constant but untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Boolean flag with no explanation of what debug behavior it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create the dependency container.
- **Duplication [UNIQUE]**: Dependency container class with register/resolve pattern. No similar implementation found.
- **Correction [OK]**: Registry pattern is correct for current usage; all keys resolved in spin() are pre-registered.
- **Overengineering [OVER]**: DIY IoC container (register/resolve via Map<string, unknown>) for three static module-level imports that never change. Introduces type-unsafe `as T` casts, string-keyed lookups, and runtime indirection with zero benefit over direct references. Single consumer (spin), no swapping, no testing seam.
- **Tests [NONE]**: No test file exists. register/resolve contract, type-casting behavior, and missing-key behavior are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its methods. The DI-container pattern, registry semantics, and the untyped `unknown` resolution contract are non-obvious and warrant documentation.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Referenced multiple times in spin: line 128 for length, line 129 to pass paylines, line 155 for line symbols lookup.
- **Duplication [UNIQUE]**: Game-specific payline configuration array. No similar array structure identified.
- **Correction [OK]**: All row indices in [0, 2]; valid for a 3-row reel grid.
- **Overengineering [LEAN]**: Static payline matrix. Exactly the right representation for this data.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluation but are never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining the coordinate system (row indices per reel column), how many paylines exist, or their layout semantics.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 71 to check for matching symbol runs.
- **Duplication [DUPLICATE]**: Identical logic to lineWins in paytable.ts. Both handle WILD as leading symbol, check for SCATTER, count consecutive matches, and require count >= 3. Only superficial differences: field names (sym/run vs symbol/count).
- **Correction [OK]**: Lead-symbol detection and consecutive-run counting are correct for standard WILD-substitution semantics.
- **Overengineering [LEAN]**: Focused single-responsibility helper: finds leading non-WILD symbol and counts the run. Straightforward iteration.
- **Tests [NONE]**: No test file exists. Critical logic — WILD substitution, SCATTER short-circuit, run-length counting, minimum run of 3 — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD substitution logic, SCATTER exclusion, and the minimum run threshold (3) are non-obvious and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic for detecting winning symbol runs with same control flow and semantics.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called by spin at line 129 to evaluate each payline for wins.
- **Duplication [UNIQUE]**: No similar functions found in semantic search. Combines line checking with wild multiplier calculation.
- **Correction [OK]**: Symbol extraction and per-line wild-multiplier application are internally consistent.
- **Overengineering [LEAN]**: Higher-order payFn parameter is justified for testability and decoupling from paytable. Wild multiplier math is domain logic, not abstraction overhead.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding (wildCount exponent), zero-win null path, and lineBet scaling are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Parameters, the wild-count bonus formula `(1 + wc) * 2^wc`, and return semantics are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin at line 134. Exported and required for spin to compute final payout.
- **Duplication [UNIQUE]**: No similar functions found in semantic search. Applies house edge and bet adjustments to line wins.
- **Correction [ERROR]**: Three independent defects: inverted house-edge sign, unconditional +1% bet addition, and ceiling rounding — together push implied RTP well above 100%, violating the arbitrated 95% target.
- **Overengineering [LEAN]**: Simple reduce plus two arithmetic adjustments. Not over-abstracted.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE application on positive total, unconditional bet*0.01 bonus, Math.ceil rounding, and zero-win path are all untested.
- **PARTIAL [PARTIAL]**: JSDoc mentions house-edge application and ~95% RTP target but omits: the `bet * 0.01` floor added unconditionally, the `Math.ceil` rounding, the `any` type on `bet`, and the fact that house edge is applied as a bonus multiplier (increasing payout, not reducing it — which contradicts a typical house-edge definition). (deliberated: confirmed — Confirmed three independent defects. (1) engine.ts:105 — `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payout; should be `(1 - HOUSE_EDGE)` to achieve stated 95% RTP. (2) engine.ts:108 — `total += bet * 0.01` runs unconditionally, adding 1% of bet even on zero-win spins, leaking money every spin. (3) engine.ts:101 — `bet: any` despite exported `Bet = number` type alias at L12. Together these push implied RTP well above 100% in a gambling engine. Raising confidence to 95 because all three defects are trivially verifiable in source.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113) use explicit `any` on both exported public functions. `bet` has a well-defined domain (integer 1–100); the `Bet` type alias is already exported and should be used here. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — fully mutable. Should be `readonly (readonly number[])[]` or `as const` to prevent accidental mutation of payline definitions. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Three ESLint violations: (1) `throw "invalid bet"` (L115) violates `no-throw-literal` — must throw an `Error` instance. (2) `rng` (L120) is declared but never used (`no-unused-vars`). (3) `reelsModule` (L122) is declared but never used (`no-unused-vars`). [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is a public export with no JSDoc. `computePayout` has JSDoc. `Bet` type alias has none. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async operations. `throw "invalid bet"` (L115) throws a string literal, breaking `instanceof Error` guards in callers. Already penalised under Rule 8; noted here for error-handling completeness. [L115] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from paylines, wilds, scatters, jackpot, free-spins vocabulary. The injectable `rng` resolved from `container` (L120) is never passed to `factory.buildReels(5, 3)` (L128) — the actual RNG source is opaque and cannot be audited or certified. In regulated gaming, RNG traceability is a compliance requirement. Cannot FAIL without seeing the factory's implementation, but the bypass is a clear architectural gap. No hardcoded secrets or `eval` present. [L120, L128] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` (L175) registers a new no-op listener on every `spin()` call with no corresponding `off()`, causing unbounded listener accumulation (memory leak) over many spins. [L175] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated inside `spin()` (L124–L126) with no injection path — unit tests cannot substitute fakes. The `EngineContainer` DI mechanism exists but is not used for these three dependencies. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies readonly (readonly number[])[]` for type-safe immutability. No use of `satisfies`, `const` type parameters, or `using` where applicable. [L34] |
| 17 | Context-adapted rules | FAIL | HIGH | Two gambling-domain violations against arbitrated intents: (1) `total = total * (1 + HOUSE_EDGE)` (L105) multiplies payout by 1.05, INCREASING it — should be `* (1 - HOUSE_EDGE)` to apply a 5% house cut and achieve the stated 95% RTP. The current formula produces >100% RTP. (2) `bet > 100` only logs `console.warn` (L118); the arbitrated intent specifies Bet is capped at 100 coins and must enforce this as a hard error. [L105, L118] |

### Suggestions

- Remove `any` from public API — use the already-exported `Bet` type
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance, not a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house-edge formula to achieve 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Enforce the 100-coin maximum as a hard error (arbitrated intent: Bet is 1..100)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Mark PAYLINES immutable to prevent accidental row mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Pass the injectable rng to the factory so the RNG is auditable
  - Before: `const reels = factory.buildReels(5, 3);`
  - After: `const reels = factory.buildReels(5, 3, rng);`
- Remove the no-op listener registered on every spin to prevent listener leak
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or justify `total += bet * 0.01`; unconditional 1%-of-bet return inflates RTP above the 95% target on every spin. [L108]
- **[correction · medium · small]** Throw an error when `bet > 100` (matching the lower-bound guard) to enforce the arbitrated 1..100 integer contract. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to reduce payouts by 5% and achieve the documented 95% RTP instead of >100%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace `Math.ceil` with `Math.floor` to round payouts down, preserving the house edge on fractional results per casino-domain convention. [L110]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
