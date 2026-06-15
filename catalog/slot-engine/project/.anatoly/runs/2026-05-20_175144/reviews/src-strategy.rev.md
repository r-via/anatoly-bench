# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to be incorrect.
- **Overengineering [ACCEPTABLE]**: Abstract class with one abstract method could be a TypeScript interface (structurally equivalent, no runtime cost). However, project docs explicitly design this as an extension point with multiple documented subclass examples, and the class form enables instanceof checks and future concrete base methods. The pattern is justified by stated intent.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with a single abstract method; extension semantics and the contract of adjustPayout are undescribed.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through returning the input unchanged; trivially correct.
- **Overengineering [LEAN]**: Minimal identity wrapper — returns result unchanged. Fits the strategy polymorphism pattern with no excess.
- **Tests [NONE]**: No test file found. Used by src/engine.ts — pass-through identity behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Identity behavior (pass-through) is non-obvious without documentation; callers have no indication this is the engine default.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Multiplies totalPayout by 0.8 and floors. Math.floor rounds down (correct for casino domain — house keeps remainder). IEEE 754 representation of 0.8 is slightly above true 0.8, so for positive integer payouts n*0.8_double >= n*0.8_exact, preventing off-by-one floor errors. lineWins not adjusted alongside totalPayout is intentional per docs ("All other SpinResult fields are unchanged"). No correctness bug found.
- **Overengineering [LEAN]**: Single arithmetic operation on one field; no unnecessary indirection.
- **Tests [NONE]**: No test file found. The 0.8 payout multiplier and floor rounding are untested edge cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8 multiplier and Math.floor truncation are meaningful business rules that require documentation; neither the formula nor the rationale is explained.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 13 | Security | WARN | MEDIUM | Regulated gaming domain inferred from SpinResult/jackpot/scatter vocabulary throughout the project. `Math.floor(result.totalPayout * 0.8)` uses IEEE 754 floating-point multiplication on a coin payout value. `totalPayout` is typed as `number` (not a branded integer), so non-integer inputs are not excluded by the type system. For regulated RTP certification, integer-only arithmetic (e.g. `Math.floor(totalPayout * 8 / 10)`) is preferred to eliminate any floating-point rounding ambiguity. `Math.floor` mitigates practical risk for small integers, keeping this at WARN rather than FAIL. [L18] |

### Suggestions

- Use integer-safe arithmetic for regulated gaming payout reduction to eliminate any IEEE 754 ambiguity
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor(result.totalPayout * 8 / 10),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
