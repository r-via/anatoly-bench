# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 82% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Algorithm is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, draw Math.random() * total, accumulate in a loop, return items[i] when roll < cumulative, and fall back to the last item. Only differences are variable names and that weightedPick is generic <T> while pickFromWeighted is typed to Symbol[]. The generic form could directly replace the private helper.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a certified-gaming context; algorithm is otherwise correct.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm for weighted random selection. Generic type parameter is appropriate and not speculative. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical gaming RNG logic — uniform distribution, boundary roll (roll === cumulative), zero weights, single-item arrays, mismatched array lengths, and negative weights are all untested. Called by src/engine.ts, making this a high-risk gap.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no mention of the requirement that lengths must match), no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array lengths).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical algorithm — same cumulative-weight loop, same fallback, same Math.random() draw; differs only in type parameter (generic T vs Symbol) and variable names

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are never mutated inside the function; parameters should be `readonly T[]` and `readonly number[]` to prevent accidental mutation at the call site and communicate intent. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Module-level JSDoc exists but lacks `@param` and `@returns` tags for `weightedPick`. Consumers cannot see parameter semantics from IDE hover without them. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No guard for edge cases: (1) empty `items` returns `items[-1]` → `undefined` cast as `T`, violating the return type contract; (2) `totalWeight === 0` makes the roll comparison always false, silently falling through to the last element. Neither condition throws or narrows. [L6-L15] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain confirmed: JSDoc states 'suitable for gaming RNG applications'; project contains `src/reels.ts`, `src/freespin.ts`, `src/jackpot.ts`, `src/paytable.ts`, `src/wild.ts` — a regulated slot-machine engine. `Math.random()` (V8 xorshift128+) is a non-deterministic PRNG with no seed-control, no auditability, and no certification path. It fails GLI-11, BMM, and ONJN regulatory RNG requirements. Must be replaced with `crypto.getRandomValues()` for a uniform draw, or a certifiable seeded PRNG (e.g., ISAAC, AES-CTR DRBG from the Web Crypto API). [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly with no injection point. Deterministic unit tests require `jest.spyOn(Math,'random')` hacks. An injectable `rng: () => number = Math.random` parameter enables pure, reproducible tests without global side-effects. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility provides no validation that `weights.length === items.length`, no guard for negative weights, and no rejection of a zero-sum weight array. These invariant violations are silent: wrong weights produce silently wrong probability distributions, which is a compliance risk in a certified gaming context. [L6-L15] |

### Suggestions

- Replace Math.random() with a crypto-based draw to meet regulated gaming RNG requirements
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Use readonly array parameters and add an injectable rng parameter for testability
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 0x1_0000_0000;
    },
  ): T {
  ```
- Guard against empty items and zero total weight
  ```typescript
  // Before
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;
  // After
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (weights.length !== items.length) throw new RangeError('weightedPick: weights.length must equal items.length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new RangeError('weightedPick: total weight must be positive');
  const roll = rng() * totalWeight;
  ```
- Add @param and @returns JSDoc tags to the exported function
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   *
   * @param items - Array of items to pick from.
   * @param weights - Parallel array of non-negative weights (must sum > 0).
   * @param rng - Optional uniform [0,1) random source; defaults to crypto.getRandomValues.
   * @returns The selected item.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable PRNG (seeded, auditable — e.g. PCG32/xoshiro128** with recorded seed, or a crypto.getRandomValues()-based uniform draw). Math.random() cannot satisfy regulatory RNG certification requirements for a licensed slot engine. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
