# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm: both compute total weight, generate random roll, accumulate weights in loop, return first item where accumulated ≥ roll, fallback to last item. Variable names differ (totalWeight/roll/cumulative vs total/r/acc) but logic is byte-for-byte equivalent.
- **Correction [NEEDS_FIX]**: `Math.random()` is not certifiable for regulated gaming RNG; the domain is clearly a slot machine (five reels, paylines, jackpot, 95% RTP target).
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single pass. Generic T parameter is justified — the function is reusable across any weighted item type. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item arrays, negative weights, and boundary roll == cumulative. Called by src/engine.ts, making this a production code path with zero test coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns, and no mention of edge cases (empty arrays, mismatched lengths, negative weights). (deliberated: confirmed — Confirmed. src/rng.ts:5-16 is the canonical RNG function, imported by engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 — but the resolved `rng` variable is never called in spin(). Actual reel generation flows through factory.buildReels(5,3) → spinReel(i) (factories.ts:12) → pickFromWeighted (reels.ts:47), which is the duplicate copy. weightedPick itself is algorithmically correct, but it's effectively dead code at runtime despite being the architecturally intended RNG entry point. The fix is to eliminate pickFromWeighted in reels.ts and have spinReel use weightedPick (either directly or via the container).)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 92% identical algorithm — both implement the same weighted random selection via cumulative distribution. Difference: weightedPick is generic <T>; pickFromWeighted specialized for Symbol type.

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters items and weights are not marked readonly. The function never mutates them; readonly T[] and readonly number[] should be used to express that contract. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Module-level JSDoc exists but is missing @param and @returns tags on the exported function weightedPick. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No guard for empty arrays: when items.length === 0, items[items.length - 1] evaluates to undefined, silently violating the declared return type T. Similarly, mismatched items/weights lengths produce a silent wrong draw. Adding a guard or assertion would prevent runtime type unsafety. [L6-L15] |
| 13 | Security | FAIL | CRITICAL | Math.random() is a non-cryptographic PRNG seeded by the JS engine and is not certifiable for regulated gaming RNG. Domain inferred from: (1) file comment 'suitable for gaming RNG applications', (2) reference docs describing a slot machine with CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND symbols, jackpot detection, free spins, and an arbitrated 95% RTP target. All major gaming jurisdictions (GLI-19, BMM, eCOGRA) require a certified, auditable RNG source. Math.random() fails that requirement. Replace with a cryptographically secure source (e.g. crypto.getRandomValues) or an auditable seeded PRNG with provable statistical properties. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, making deterministic unit testing impossible without patching the global. Injecting a rng parameter (e.g. rng: () => number = Math.random) would allow tests to pass a seeded stub without mocking globals. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Beyond the CRITICAL RNG issue (rule 13), the gaming context warrants: (1) a total-weight > 0 guard (division by zero if weights are all 0 produces NaN roll and falls through to the last item silently), (2) a check that items.length === weights.length. Neither is enforced at the type or runtime level. [L6-L15] |

### Suggestions

- Replace Math.random() with an injectable, certifiable RNG source for regulated gaming compliance
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 0x1_0000_0000;
    }
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add input guards for empty and mismatched arrays, and zero total weight
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {
    if (items.length === 0) throw new RangeError('weightedPick: items array is empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new RangeError('weightedPick: totalWeight must be > 0');
  ```
- Mark parameters as readonly and add @param/@returns JSDoc tags
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * @param items - Candidate values to pick from.
   * @param weights - Non-negative weight for each item; must have the same length as items.
   * @param rng - Optional RNG source; defaults to crypto.getRandomValues-based uniform draw.
   * @returns A single item sampled proportionally to its weight.
   */
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace `Math.random()` with a CSPRNG draw (e.g. `crypto.getRandomValues` filling a Uint32Array, then normalising to [0, 1)) to meet regulated gaming RNG auditability requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
