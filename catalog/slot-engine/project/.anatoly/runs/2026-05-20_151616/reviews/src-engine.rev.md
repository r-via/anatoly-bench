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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 88% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with 0 runtime importers; not imported by any file
- **Duplication [UNIQUE]**: Simple type alias; no semantic duplicates found
- **Correction [OK]**: Type alias only; runtime range enforcement belongs in spin().
- **Overengineering [LEAN]**: One-line type alias. Trivially minimal even with 0 importers.
- **Tests [GOOD]**: Type alias with no runtime behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. As public API, it should at minimum note valid range constraints (e.g. positive integer, max 100).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Internal constant used in computePayout (line 105) to adjust payout
- **Duplication [UNIQUE]**: Module constant; no similar definitions found
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant, but its effect on payout math is non-obvious and undocumented.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Internal constant checked in spin (line 159) for debug logging
- **Duplication [UNIQUE]**: Module constant; no similar definitions found
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag; name is self-explanatory but acceptable to leave undocumented.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Internal class instantiated on line 29 to create service locator
- **Duplication [UNIQUE]**: Custom DI container class; no semantic duplicates found
- **Correction [OK]**: resolve() returns undefined (cast to T) for missing keys, but all keys used in spin() are pre-registered at module load, so no runtime failure in current code.
- **Overengineering [OVER]**: Service-locator container for 3 statically-imported module-level values (weightedPick, getPayMultiplier, {getReelSymbols,getReelWeights}) that never change and are not injected from outside. Adds register/resolve indirection with no substitution, testing, or extension benefit. Direct calls to the imports are sufficient.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Internal DI container; purpose and usage pattern are not obvious from the name alone.

#### `container` (L29–L29)

- **Utility [USED]**: Internal variable used to register (lines 30-32) and resolve (lines 120-122) services
- **Duplication [UNIQUE]**: Module singleton instance; no duplicates found
- **Correction [OK]**: All three keys registered correspond exactly to what spin() resolves.
- **Overengineering [LEAN]**: Plain variable declaration; over-engineering lives in EngineContainer class above.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with no comment explaining what it holds or why.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Internal constant array used in spin to evaluate paylines (lines 133-134, 149)
- **Duplication [UNIQUE]**: Game payline pattern matrix; no similar constants found
- **Correction [OK]**: All 10 paylines match the reference documentation exactly.
- **Overengineering [LEAN]**: Static lookup table, exactly the right representation for 10 fixed payline paths.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Row-index encoding of 10 payline paths is not self-evident; each entry's shape (straight, V, zigzag) is undocumented.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Internal function called by evaluateLine (line 74) to match symbols
- **Duplication [DUPLICATE]**: Identical logic to lineWins from paytable.ts — both identify winning symbol runs by filtering WILD/SCATTER, counting matches, requiring 3+ run length; only difference is field naming (sym/run vs symbol/count)
- **Correction [OK]**: Correctly resolves lead symbol across leading WILDs, counts the consecutive matching run, and returns null for all-WILD or SCATTER-led lines.
- **Overengineering [LEAN]**: Single-responsibility helper: finds lead symbol and counts consecutive matching run. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; WILD substitution logic and early-exit on SCATTER are non-trivial and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 92% — identical control flow and semantics; both extract leading symbol (handling WILD), reject SCATTER, count consecutive matches, enforce minimum run of 3, return symbol and count or null

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Internal function called by spin (line 134) to evaluate each payline
- **Duplication [UNIQUE]**: No similar functions found; computes payout with wild multiplier boost from checkLine result
- **Correction [OK]**: Correctly maps payline row indices to symbols, delegates run detection to checkLine, and applies the wild boost on top of the base payout.
- **Overengineering [LEAN]**: Straightforward payline evaluation with wild-boost math. Parameterised payFn is a clean seam, not premature abstraction.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function with a non-obvious wild-bonus formula (basePayout * (1 + wildCount) * 2^wildCount) that deserves explanation.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin (line 138); transitively used through spin import
- **Duplication [UNIQUE]**: No similar functions found; applies house edge and bonus to line wins total
- **Correction [NEEDS_FIX]**: Two independent defects: house-edge factor is inverted (raises payout instead of cutting it) and Math.ceil rounds in the player's favour.
- **Overengineering [LEAN]**: Simple reduce plus two adjustments. Minimal implementation for its purpose.
- **Tests [NONE]**: No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing) and always adds 1% of bet; untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc description and notes the house-edge RTP target, but missing @param for lineWins and bet (typed as any), missing @returns, and the unconditional floor of bet * 0.01 is not explained.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor to round payouts down; casino domain requires the house keeps fractional remainders. [L110]
- **[correction · medium · small]** Throw an error (not just console.warn) when bet > 100 to enforce the arbitrated 1..100 valid bet range. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE) so the house retains 5% and player return approaches the documented 95% RTP target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
