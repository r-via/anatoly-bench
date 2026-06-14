# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: Applying a 0.8 multiplier to totalPayout reduces RTP by ~20 pp, violating the arbitrated 95% RTP invariant (README.md).
- **Overengineering [OVER]**: 0 importers — pure dead code. Additionally, its 0.8× payout multiplier contradicts the README-arbitrated 95% RTP target: if wired in, it would suppress payouts an additional 20% beyond the documented house edge.
- **Tests [NONE]**: No test file found. The 0.8 multiplier and Math.floor truncation are untested — rounding edge cases and spread correctness are not verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor rounding behavior are non-obvious implementation details that warrant documentation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinStrategy, DefaultStrategy, and ConservativeStrategy are all exported without JSDoc. SpinStrategy needs documentation of its adjustPayout contract; ConservativeStrategy must document its deliberate RTP reduction. [L3-L20] |
| 13 | Security | WARN | HIGH | Gambling/casino domain inferred from SpinResult, reels, jackpot, freeSpins vocabulary and the README's arbitrated 95% RTP target. ConservativeStrategy applies a blanket 0.8 multiplier to totalPayout, reducing effective RTP to approximately 76% — contradicting the arbitrated intent ('The engine targets a theoretical Return-to-Player of 95%'). In regulated gambling, certified RTP must match declared RTP; a strategy that silently cuts all payouts by 20% is a compliance risk if deployed in a certified context. The violation requires explicit instantiation of ConservativeStrategy (not the default path), which limits severity to HIGH rather than CRITICAL. [L12-L19] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated casino context (README arbitrated: 95% RTP). ConservativeStrategy must be restricted to non-certified/demo game modes or document that it operates outside the declared RTP envelope. No guard, type tag, or runtime assertion prevents it from being used in production certified play. [L12-L19] |

### Suggestions

- Add JSDoc to all three exports; ConservativeStrategy especially needs to document its RTP impact and restrict to non-certified modes.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-spin payout adjustment.
   * Implementations must not silently reduce effective RTP below the certified floor.
   */
  export abstract class SpinStrategy {
    /** Returns an adjusted SpinResult. Must preserve RTP invariants for certified game modes. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Document and guard the RTP deviation in ConservativeStrategy to prevent misuse in regulated contexts.
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
  /**
   * Demo/non-certified strategy only. Applies a 0.8 payout multiplier,
   * reducing effective RTP to ~76% — NOT compliant with the declared 95% RTP.
   * Must not be used in regulated or certified game sessions.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** ConservativeStrategy's 0.8 multiplier drops effective RTP from the documented 95% to ≈76%. If a lower-RTP mode is intentional it must be explicitly reconciled with the arbitrated 95% RTP invariant; otherwise remove or adjust the multiplier so payout reduction stays within the documented 5% house edge. [L17]
- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
