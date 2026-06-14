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
- **Correction [OK]**: Abstract base class with single abstract method; no logic to evaluate.
- **Overengineering [ACCEPTABLE]**: Single-method abstract class is a textbook overengineering signal (a function type `(result: SpinResult) => SpinResult` would suffice), but the Code Conventions reference doc explicitly endorses this hierarchy as the correct extension pattern for the project.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Abstract base class with non-obvious extension contract — purpose, pattern, and subclassing rules are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches documented behavior exactly.
- **Overengineering [LEAN]**: Identity pass-through. Minimal and correct as the engine's default.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but adjustPayout (identity function) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Identity pass-through behavior is not obvious from the name alone and warrants at least a one-liner.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches internal and reference docs; flooring is correct for slot-domain (house retains fractional coin). DefaultStrategy is the engine default so the 95% RTP arbitrated target is unaffected by this opt-in reduction.
- **Overengineering [LEAN]**: Straightforward 80% floor multiplier. Implementation is minimal; the strategy pattern it plugs into is validated by project conventions.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor payout reduction logic is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 80% floor reduction rule is a non-trivial contract that should be documented with @param and @returns.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number `0.8` in ConservativeStrategy. Project conventions show named constants for domain values (e.g. `const BONUS_THRESHOLD = 3`). Extracting this to a named constant improves readability and makes the multiplier configurable without touching implementation logic. [L15] |

### Suggestions

- Extract the 0.8 payout ratio to a named constant consistent with project conventions (cf. BONUS_THRESHOLD pattern)
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  // After
  const CONSERVATIVE_PAYOUT_RATIO = 0.8;
  
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_RATIO),
      };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
