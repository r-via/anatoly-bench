# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 93% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted: both perform weighted random selection via cumulative weight accumulation. Score 0.823 (>0.82) with matching logic confirmed in source. Only differences are generic typing (<T> vs Symbol) and variable naming (totalWeight/roll/cumulative vs total/r/acc).
- **Correction [NEEDS_FIX]**: Uses Math.random() — not certifiable for regulated gaming RNG; empty-items fallback returns undefined typed as T.
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm for weighted random selection. Generic type parameter T is appropriate and not gratuitous. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, weight boundary (roll == cumulative), and distribution uniformity. Called by src/engine.ts, making this a gap in core logic coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no mention of the requirement that weights.length === items.length), no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug in the function itself. weightedPick (rng.ts:5-16) is a correct generic weighted random selection implementation with identical logic to pickFromWeighted. Duplication is real but belongs on the duplication axis. Critical finding: engine.ts:120 resolves weightedPick from the container as `rng`, but grep confirms `rng` is never called in the spin() body — the actual spin path goes through factory.buildReels → spinReel → pickFromWeighted (reels.ts:47). The resolved-but-unused variable is an architectural smell (dead registration), not a correctness defect in weightedPick itself.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — both implement weighted random selection using cumulative weight sums and uniform random draw. Semantic contracts are equivalent; the generic variant is a superset of the specific one.

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are not mutated but typed as mutable arrays. ReadonlyArray<T> and ReadonlyArray<number> would prevent callers from passing mutable references expecting mutation. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from paytable symbols (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), jackpot mechanics, free-spin triggers, and this file's own JSDoc label 'gaming RNG applications'. Math.random() uses V8's xorshift128+ PRNG, which is non-cryptographic, predictable under observation, and not certifiable under GLI-11, BMM, or eCOGRA RNG standards. Every reel outcome in the engine flows through this function. Regulated gaming requires a CSPRNG source (e.g. crypto.getRandomValues()). [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly, requiring a global mock for deterministic distribution testing. An injected rng: () => number parameter would allow seedable, pure unit tests without side-channel mocking. [L5-L7] |
| 17 | Context-adapted rules (gaming RNG) | WARN | MEDIUM | No guard on items.length === weights.length; a mismatch silently produces wrong probabilities. The fallback return items[items.length - 1] returns undefined for an empty array but is typed as T — a latent type unsoundness that strict noUncheckedIndexedAccess would expose. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for regulated gaming compliance
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Inject RNG function to decouple from global state and enable deterministic testing
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: ReadonlyArray<T>,
    weights: ReadonlyArray<number>,
    rng: () => number = defaultRng,
  ): T {
  ```
- Use ReadonlyArray for parameters that are not mutated
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {`
- Guard against empty or mismatched inputs to surface bugs early
  ```typescript
  // Before
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  if (items.length === 0 || weights.length !== items.length) {
    throw new Error(`weightedPick: expected ${items.length} weights, got ${weights.length}`);
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard against empty items array at function entry (throw or return a typed sentinel) to prevent undefined-typed-as-T from escaping. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues()-based uniform draw to satisfy regulated gaming RNG requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
