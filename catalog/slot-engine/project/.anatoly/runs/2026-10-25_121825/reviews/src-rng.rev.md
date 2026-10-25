# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, draw Math.random() * total, accumulate weights in a loop, and fall back to the last item. Only differences are variable names and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol — the algorithm and semantic contract are interchangeable.
- **Correction [OK]**: Standard cumulative-weight algorithm is correct: roll is in [0, totalWeight), the strict-less-than comparison correctly assigns probability proportional to each weight, and the fallback on L15 correctly handles floating-point edge cases. Empty-array or mismatched-length inputs would return undefined typed as T, but no concrete call site in engine.ts is shown passing such inputs, so this is hypothetical caller misuse, not a defect here.
- **Overengineering [LEAN]**: Minimal O(n) cumulative-weight algorithm with a single generic type parameter that is fully justified for a reusable RNG utility. No unnecessary abstractions, no config objects, no factory indirection.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight algorithm, same fallback, only variable names and type parameter differ

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` parameters are not mutated but are typed as mutable arrays. They should be `readonly T[]` and `readonly number[]`. [L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `weightedPick` has a module-level description comment but is missing `@param items`, `@param weights`, `@returns`, and `@throws` (for the empty-array edge case) tags. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from project name (slot-engine) and sibling files (jackpot.ts, reels.ts, paytable.ts, freespin.ts, wild.ts) and confirmed by the JSDoc ('suitable for gaming RNG applications') and the consumer (engine.ts `spin()`). `Math.random()` is a non-cryptographic PRNG (typically xorshift128+ or similar in V8) whose seed and state are observable. Regulated gaming jurisdictions (GLI, BMM, iTech Labs) require certified RNG implementations using a cryptographically secure source such as `crypto.getRandomValues()`. Using `Math.random()` here makes the RNG uncertifiable and violates gaming-compliance requirements. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function with no way to inject a seeded or deterministic source. Tests cannot reproduce specific rolls without monkey-patching the global. Accepting a `rng: () => number` parameter (defaulting to `Math.random`) would make the function deterministically testable and composable with a CSPRNG. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming-utility rule: `items.length` and `weights.length` are not validated to match. A mismatch silently causes out-of-bounds reads (`weights[i]` returns `undefined`, making `cumulative` NaN) and the fallback always fires — distorting the distribution with no error surfaced. A guard at the top (`if (items.length !== weights.length) throw new Error(...)`) is standard for weighted-pick implementations in gaming engines. [L6-L16] |

### Suggestions

- Use readonly parameters to signal non-mutation and enable stricter call-site checking
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with an injectable rng parameter; supply a CSPRNG as default for regulated gaming
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x100000000;
  }
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRandom,
  ): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items and weights must have equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add full JSDoc with @param, @returns, @throws tags
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Selects one item from `items` with probability proportional to the corresponding `weights` entry.
   * Uses a cumulative-weight scan with a single uniform random draw.
   *
   * @param items   Non-empty array of candidates.
   * @param weights Parallel array of non-negative weights; must match `items` length.
   * @param rng     Optional uniform-[0,1) source; defaults to a CSPRNG draw.
   * @returns       The selected item.
   * @throws {Error} If `items` is empty or `items.length !== weights.length`.
   */
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
