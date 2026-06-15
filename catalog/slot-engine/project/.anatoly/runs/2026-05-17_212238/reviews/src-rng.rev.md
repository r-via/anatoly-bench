# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Both reduce weights to total, generate uniform random in [0, total), accumulate weights, and return item at first index where cumulative > random. Variable names differ (totalWeight/total, roll/r, cumulative/acc, weights/wts) but logic is identical.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a gaming/slot-machine domain where a certifiable RNG is required by industry convention.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a generic type parameter that is genuinely useful (callers can pass any typed item array). No unnecessary abstractions, no premature generalization — exactly the right complexity for a weighted random draw.
- **Tests [NONE]**: No test file exists. No coverage for happy path, edge cases (empty arrays, single item, zero weights, negative weights, boundary roll == cumulative), or the fallback return on L15.
- **DOCUMENTED [DOCUMENTED]**: JSDoc describes purpose, algorithm (cumulative-weight + uniform draw), and use case. Generic type parameter T is inferrable from signature. No @param/@returns tags, but the function signature and comment together make behavior unambiguous. (deliberated: confirmed — Confirmed as architectural defect. rng.ts:5-16 (weightedPick<T>) and reels.ts:30-41 (pickFromWeighted) implement identical cumulative-weight algorithms. engine.ts:30 registers weightedPick in the container; engine.ts:120 resolves it to rng — but rng is never called anywhere in the spin function. Actual reel generation flows through factory.buildReels -> spinReel -> pickFromWeighted, completely bypassing the container. The swappable-RNG architecture is broken because the code path ignores the container-resolved function. Both functions produce correct output independently, so there is no wrong-result bug — the defect is that the DI/swappability architecture is non-functional.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 98% identical implementation — same algorithm with generic type vs concrete Symbol type

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not marked readonly. The function never mutates them. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block present but missing @param tags for `items` and `weights`, @returns, and @throws for the empty-array edge case. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by pay table (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), reel weights, jackpot, free spins, and 95% RTP target in reference docs. Math.random() is not cryptographically secure, not auditable, and does not meet regulatory certification requirements (GLI, eCOGRA, BMM) for gaming RNG. All monetary outcomes in this project flow through weightedPick, making this a direct compliance and integrity risk. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, making deterministic unit testing impossible without module-level mocking. An injected rng parameter with a default would decouple the function. [L5-L7] |

### Suggestions

- Use readonly parameters to signal non-mutation and enable callers to pass const arrays safely.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T`
- Inject the RNG source so tests can use a deterministic seed and production can supply a certified CSPRNG.
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Replace Math.random() with a certified CSPRNG (e.g. crypto.getRandomValues()) to meet gaming regulatory requirements. The current implementation is not auditable and will fail GLI/eCOGRA certification.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  // Use a certified uniform draw in [0, 1)
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x100000000) * totalWeight;
  ```
- Add @param and @returns JSDoc tags to the exported function.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   *
   * @param items - Non-empty array of candidates.
   * @param weights - Parallel non-negative weights; must satisfy items.length === weights.length.
   * @param rng - Optional uniform random source in [0, 1); defaults to Math.random.
   * @returns The selected item.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a cryptographically secure uniform draw (e.g., crypto.getRandomValues on a Uint32Array, normalised to [0,1)) so the RNG is auditable and certifiable for regulated gaming use. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
