# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Both accumulate weights via reduce, draw uniform random, iterate to find where random falls below cumulative threshold, and return last item as fallback. Only differences are generic type parameter (T vs Symbol-specific) and variable naming (totalWeight/roll/cumulative vs total/r/acc). Semantically interchangeable.
- **Correction [OK]**: Standard cumulative-weight algorithm is correct for all valid inputs; fallback at L15 correctly handles floating-point edge cases. Previously deliberated and confirmed OK (KFP: weightedPick NEEDS_FIX → OK).
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter that is genuinely needed. No unnecessary abstraction; the generic <T> avoids duplicate implementations for symbols vs numbers. Standard O(n) approach appropriate for small reel item counts.
- **Tests [NONE]**: No test file exists. Critical gaming RNG logic with zero coverage: uniform distribution correctness, boundary roll (roll === cumulative), single-item arrays, mismatched weights/items lengths, zero-weight items, and the fallback return on L15 are all untested. Called by src/engine.ts, making this a high-risk gap.
- **PARTIAL [PARTIAL]**: File-level JSDoc describes purpose and algorithm, but the function itself lacks parameter descriptions (@param for `items` and `weights`), a @returns tag, and documents no edge cases (e.g., mismatched array lengths, zero/negative weights, empty arrays).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical cumulative-weight algorithm — same reduce sum, same random scaling, same loop accumulation pattern

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are never mutated but lack `readonly` modifiers, allowing callers to pass mutable arrays with no type-level protection. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Module-level block comment exists but `weightedPick` has no function-level JSDoc with @param, @returns, or @throws tags. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Three unguarded edge cases: (1) empty `items` returns `undefined` typed as `T`; (2) `items.length !== weights.length` causes out-of-bounds access; (3) `totalWeight === 0` makes `roll` NaN, skipping all branches and silently returning the last item. [L6-L15] |
| 13 | Security | FAIL | CRITICAL | Regulated slot-machine domain inferred from project structure (engine.ts, jackpot.ts, reels.ts, paytable.ts, freespin.ts) and README invariants (RTP 95%, scatter bonuses, progressive jackpot, SpinResult). `Math.random()` is V8's Xorshift128+ PRNG — not cryptographically secure and not certifiable by gaming test labs (GLI, BMM, eCOGRA). All regulated-gaming RNG must come from a certifiable source such as `crypto.getRandomValues`. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded with no injection point, making deterministic unit tests impossible without monkey-patching global state. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG context (same domain inference as rule 13): no runtime assertion that `weights.length === items.length`; no guard on negative weights; no seed/replay capability for regulatory audit trails. [L5-L15] |

### Suggestions

- Replace hardcoded `Math.random()` with an injected PRNG defaulting to `crypto.getRandomValues`, enabling both certifiable production use and deterministic tests.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
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
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add input validation guards for empty arrays, mismatched lengths, and zero/negative weights.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('items must not be empty');
    if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
    if (weights.some(w => w < 0)) throw new RangeError('weights must be non-negative');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) throw new RangeError('total weight must be > 0');
  ```
- Add function-level JSDoc with @param, @returns, and @throws.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * Selects one item from `items` proportionally to its weight.
   * @param items - Non-empty candidate array.
   * @param weights - Non-negative weights parallel to `items`; must sum > 0.
   * @param rng - Uniform [0, 1) random source; defaults to crypto.getRandomValues.
   * @returns The selected item.
   * @throws {RangeError} On empty array, length mismatch, negative weights, or zero total.
   */
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
