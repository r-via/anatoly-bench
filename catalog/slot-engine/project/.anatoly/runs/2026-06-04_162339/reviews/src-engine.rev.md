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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 75% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type aliases found in RAG results.
- **Correction [OK]**: Type alias only; runtime range enforcement belongs in spin().
- **Overengineering [LEAN]**: Single-line type alias for a domain concept. Acceptable even with 1 importer.
- **Tests [NONE]**: Type alias with no test file present.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Purpose and valid range not described.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Value 0.05 is correct for a 5% house edge; the misapplication is in computePayout.
- **Overengineering [LEAN]**: Named constant for a magic number. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no comment explaining its role in payout calculation or RTP target.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the guarded `console.log` block in spin (L168–170) can never execute. Dead branch masquerading as a feature flag.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Boolean constant with no logic.
- **Overengineering [LEAN]**: Named constant. Dead code (always false) is a quality issue, not an overengineering issue.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private flag with no comment. Name is self-descriptive but effect on behavior is undocumented.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`. However, the abstraction adds no value over direct references — `rng` and `reelsModule` resolved from it are never consumed in `spin`.
- **Duplication [UNIQUE]**: No similar classes found in RAG results.
- **Correction [OK]**: resolve() returns undefined-cast-to-T for unknown keys, but all call sites use keys that were registered.
- **Overengineering [OVER]**: DIY service-locator wrapping three direct module imports behind a Map<string, unknown>. Adds indirection and type-erasure (resolve returns unknown, requiring casts) for zero benefit. The three registered values are already available as named imports; using them directly eliminates the container entirely.
- **Tests [NONE]**: No test file exists; register/resolve logic untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private DI container class with no JSDoc. Purpose, register/resolve semantics, and type-erasure risk are undocumented.

#### `container` (L29–L29)

- **Utility [USED]**: Referenced in `spin` to resolve `rng`, `paytable`, and `reelsModule`. Only `paytable` is actually consumed (passed to `evaluateLine`); `rng` and `reelsModule` are resolved but unused, making two of three registrations dead.
- **Duplication [UNIQUE]**: No similar variables found in RAG results.
- **Correction [OK]**: All three keys registered match their call-site resolutions.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment describing its role or what it holds.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in `spin` (L137–139) to drive `evaluateLine`, and indexed again for wild multiplier calculation (L150).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Matches the reference documentation exactly.
- **Overengineering [LEAN]**: Plain data table. Correct representation for a fixed set of payline patterns.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining the coordinate scheme (column → row index), payline count, or win evaluation direction.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called inside `evaluateLine` at L75.
- **Duplication [DUPLICATE]**: Logic is identical to `lineWins` in src/paytable.ts: same WILD-substitution for lead symbol, same SCATTER/WILD early return, same counting loop with WILD inclusion, same >= 3 threshold. Only difference is property names in the return object (`sym`/`run` vs `symbol`/`count`), which is cosmetic and does not change behavior or semantic contract.
- **Correction [OK]**: Lead resolution (first non-WILD) and consecutive WILD-or-lead run count are correct; all-WILD and leading-SCATTER cases handled properly.
- **Overengineering [LEAN]**: Single-responsibility: resolves the leading symbol (WILD substitution) and counts the run. Straightforward loop.
- **Tests [NONE]**: No test file exists; WILD substitution, SCATTER bail-out, and run-length edge cases untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper but non-trivial: WILD substitution and SCATTER exclusion logic are undocumented. No @param/@returns.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve lead symbol with WILD substitution, count consecutive matches, return null below 3; differ only in return property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in `spin` at L138 inside the PAYLINES loop.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: basePayout and in-run wild-boost computation are internally consistent; wildCount loops only over the winning run.
- **Overengineering [LEAN]**: Computes a LineWin for one payline. Accepts payFn as a parameter to decouple it from the paytable — appropriate since it is called with different contexts. Length is justified by the wild-multiplier calculation.
- **Tests [NONE]**: No test file exists; wild-boost multiplier formula and null-return paths untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private but complex: wild-count multiplier formula `(1 + wc) * 2^wc` is opaque without documentation. No @param/@returns.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts, and called internally in `spin` at L140.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: Two independent defects: wrong sign on HOUSE_EDGE application inflates payout by 5% instead of reducing it; Math.ceil rounds in the player's favor against slot-machine industry convention.
- **Overengineering [LEAN]**: Simple reduce plus two arithmetic adjustments. No unnecessary abstraction.
- **Tests [NONE]**: Exported and used by src/index.ts; house-edge application and Math.ceil behavior completely untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param descriptions for `lineWins` and `bet`, doesn't document the unconditional `bet * 0.01` floor, and uses `any` for `bet` without explanation.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: bet > 100 only emits a console.warn and the spin proceeds; the arbitrated contract (README: 'type Bet = number; // 1..100 coins, integer') requires the upper bound to be enforced as a hard error, consistent with the lower-bound guard on line 114.
- **Overengineering [LEAN]**: Consumer of abstractions defined in other files (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter). Per rule 8, those are flagged at their definitions, not here. The spin function's own logic — validation, payline loop, payout, scatter/jackpot checks — is straightforward orchestration.
- **Tests [NONE]**: Primary exported function used by src/index.ts; invalid-bet validation, payout computation, free-spin triggering, and jackpot path all untested.
- **DOCUMENTED [DOCUMENTED]**: Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed. engine.ts:118 — `if (bet > 100) console.warn("bet exceeds maximum")` logs a warning but does not throw or return. The spin proceeds with an uncapped bet, flowing through lineBet calculation (L130), evaluateLine (L134), and computePayout (L138). An arbitrarily large bet (e.g., 10000) produces proportionally large payouts with no enforcement. The code explicitly identifies 100 as the maximum via the warning message but fails to enforce it. This is a real behavioral defect.)

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both public API signatures: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The file defines `type Bet = number` on L12 but never uses it as the parameter type on either function. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as mutable `number[][]` — should be `readonly number[][]` (or `ReadonlyArray<ReadonlyArray<number>>`) to prevent accidental mutation of a fixed configuration constant. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Four violations: (1) `throw "invalid bet"` on L115 violates `no-throw-literal`; (2) `const rng = container.resolve(...)` on L120 is declared but never used (`no-unused-vars`); (3) `const reelsModule = container.resolve(...)` on L122 is declared but never used (`no-unused-vars`); (4) `emitter.on(SPIN_DONE, () => {})` on L175 registers an empty no-op listener (`no-empty-function`). [L115, L120, L122, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (the primary public API, L113) and the `Bet` type alias (L12) have no JSDoc. `computePayout` is documented. Missing JSDoc on the entry-point function is notable. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L115) is a string, not an Error — callers catching `Error` instances will not catch it, and no stack trace is captured. `bet > 100` silently continues via `console.warn` (L118) instead of rejecting; per the Bet contract (1..100 integer), out-of-range values must be thrown at the validation boundary. [L115, L118] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated with bare `new` inside `spin()` (L124–L126), making them impossible to inject or mock. Additionally, `rng` and `reelsModule` are resolved from the DI container but never forwarded to the factory — the container's rng registration is dead code, so the test-injection seam for the RNG is non-functional. [L120, L122, L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies ReadonlyArray<ReadonlyArray<0 \| 1 \| 2>>` to enforce valid row-index values at compile time while retaining the literal tuple type. No `using` declarations used for the emitter despite it being a disposable resource. [L34] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Two casino-domain violations against arbitrated intents: (1) RTP formula inverted — `total * (1 + HOUSE_EDGE)` on L105 multiplies winning payouts by 1.05, boosting player return above theoretical, contradicting the arbitrated intent 'targets 95% RTP / 5% house edge'. Correct: `total * (1 - HOUSE_EDGE)`. (2) `bet > 100` only emits `console.warn` on L118 instead of throwing; the arbitrated Bet contract is `1..100 integer`, so values above 100 must be rejected at the boundary. [L105, L118] |

### Suggestions

- Use the already-defined `Bet` type instead of `any` on both public signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house-edge formula to target 95% RTP per arbitrated intent
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw Error objects and enforce the full 1..100 Bet range at one boundary
  ```typescript
  // Before
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");
  // After
  if (typeof bet !== "number" || !Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new Error(`invalid bet: ${bet} (must be integer 1–100)`);
  }
  ```
- Make PAYLINES immutable and enforce valid row indices with satisfies
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
  ] as const satisfies ReadonlyArray<ReadonlyArray<0 | 1 | 2>>;
  ```
- Remove unused rng/reelsModule resolutions or wire them into the factory so the DI seam is functional
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>("reels");
  const factory = new StandardReelBuilderFactory();
  // After
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>("reels");
  const factory = new StandardReelBuilderFactory(rng, reelsModule); // inject resolved deps
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add `bet > 100` to the validation guard in spin() as a thrown error (not a warning) to enforce the arbitrated 1..100 integer range. [L118]
- **[correction · medium · small]** Change Math.ceil to Math.floor in computePayout; slot-machine payouts must round down so the house retains fractional credits. [L110]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` in computePayout so the house edge reduces the player payout to the documented ~95% RTP instead of boosting it above 100%. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
