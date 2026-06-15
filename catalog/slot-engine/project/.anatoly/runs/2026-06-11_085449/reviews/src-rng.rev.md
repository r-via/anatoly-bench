# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by that total, accumulate in a loop, and fall back to the last item. The only differences are variable names (totalWeight/roll/cumulative vs total/r/acc) and type parameter (generic <T> vs concrete Symbol). The generic version is a superset and the two are fully interchangeable for the Symbol[] call-site in reels.ts.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated gaming — violates industry convention for casino/slot-machine applications.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm for the task. Generic type parameter is justified — callers use it with typed symbol arrays. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Zero coverage of happy path, edge cases (empty arrays, single item, zero weights, negative weights, mismatched array lengths), or the off-by-one boundary where roll equals cumulative weight. Called by src/engine.ts, making this an untested critical path.
- **PARTIAL [PARTIAL]**: Block-level JSDoc describes purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array lengths).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight algorithm, same loop structure, same fallback; differs only in variable names and type specificity

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are mutated only via read; they should be `readonly T[]` and `readonly number[]` to prevent accidental mutation by callers and signal intent. [L6] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No guard for empty `items`/`weights`. When `items.length === 0`, the loop body never executes and `items[items.length - 1]` returns `undefined`, violating the `T` return type at runtime. Also: mismatched array lengths (weights.length !== items.length) are silently swallowed. [L7-L14] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/regulated-gaming domain inferred from project context (reels, CHERRY/LEMON/BELL/SEVEN/DIAMOND vocabulary, pay tables, jackpot, free spins in sibling files). `Math.random()` is a non-deterministic, non-seedable, non-auditable PRNG that is not certifiable for regulated gaming RNG. Gaming regulators (GLI, BMM, iTech Labs) require provably fair or hardware-certified RNG sources. Replace with `crypto.getRandomValues()` or an injectable certified RNG interface. [L8] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly with no injection point, making deterministic unit testing impossible without global mocking. Accepting an optional `rng: () => number` parameter would make the function purely deterministic under test. [L8] |

### Suggestions

- Use `crypto.getRandomValues()` via a certifiable RNG abstraction instead of `Math.random()` for regulated gaming compliance.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const roll = (crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000) * totalWeight;`
- Make parameters readonly and accept an injectable RNG for testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = secureRandom): T {`
- Guard against empty input arrays to avoid returning `undefined` typed as `T`.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = secureRandom): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new RangeError(`weightedPick: items (${items.length}) and weights (${weights.length}) must be non-empty and equal length`);
    }
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues()-based draw (e.g. read a Uint32 from crypto.getRandomValues, divide by 2^32) so the RNG is cryptographically unpredictable and can satisfy gaming-regulator certification requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
