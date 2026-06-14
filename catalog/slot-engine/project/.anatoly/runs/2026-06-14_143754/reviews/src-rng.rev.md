# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm: reduce total, random roll scaled by total, accumulate in loop, return on threshold, fall back to last item. Only differences are generic type parameter vs. hardcoded Symbol type, variable names (totalWeight/roll/cumulative vs. total/r/acc), and export visibility. Logic is fully interchangeable.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable PRNG for regulated gaming. The JSDoc advertises this function as 'suitable for gaming RNG applications', but Math.random() does not meet gaming regulatory requirements (GLI, BMM) because it is not cryptographically uniform, not auditable, and not seedable for reproducibility testing.
- **Overengineering [LEAN]**: Standard cumulative-weight sampling in O(n). Generic type parameter is appropriate given the single consumer passes typed Symbol arrays. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical RNG utility consumed by core spin logic with no coverage of edge cases: zero-weight items, single-item arrays, negative weights, weights summing to zero, or distribution correctness under repeated draws.
- **PARTIAL [PARTIAL]**: JSDoc describes the algorithm and use case, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. rng.ts:5-16 is a correct generic weighted-random selection function. The duplication with reels.ts:pickFromWeighted is real but is not a bug — both implementations are correct. Furthermore, weightedPick is imported at engine.ts:2, registered in the container at engine.ts:30, and resolved at engine.ts:120, but the resolved `rng` variable is never invoked — the spin flow uses factory.buildReels → spinReel → pickFromWeighted instead. This makes weightedPick effectively dead code in the current execution path, but that's a utility concern, not a correction concern. The function itself has no defects.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — same cumulative-weight loop, same fallback, same Math.random() scaling pattern; differs only in generic vs. concrete typing

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are never mutated inside the function but are typed as mutable arrays. Prefer `readonly T[]` and `readonly number[]`. [L5] |
| 8 | ESLint compliance | WARN | HIGH | Fallback `return items[items.length - 1]` on L15 is unsafe when `items` is empty (`length-1 = -1` → `undefined`), which violates the declared return type `T`. With `noUncheckedIndexedAccess` enabled (implied by strict mode), TypeScript would flag this; ESLint `@typescript-eslint/no-non-null-assertion` and similar rules would surface the gap. [L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | The block comment describes the function at a high level but lacks `@param` and `@returns` tags. Public API consumers cannot see parameter semantics in IDE hover. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Casino/slot-machine domain confirmed by: file comment ('gaming RNG applications'), consumer `spin()` in src/engine.ts operating on reels, pay tables, jackpots, and free spins documented in the project reference docs. `Math.random()` is a non-seeded, non-auditable PRNG that is not certifiable under any regulated gaming jurisdiction (GLI, BMM, AGCC, etc.). Certified RNG for regulated gambling must be a CSPRNG (e.g. `crypto.getRandomValues`) and subject to third-party audit. Using `Math.random()` here renders the entire RNG surface non-compliant. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly with no injection point, making deterministic unit testing impossible without monkey-patching. Accepting a `rng: () => number` parameter (defaulting to `Math.random`) would allow tests to supply a seeded generator. [L5-L15] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Gaming-domain best practice: slot-machine RNG must use a certifiable random source. The JSDoc explicitly advertises this as 'suitable for gaming RNG applications', yet the implementation delegates to `Math.random()`. Even in non-regulated contexts, the claim in the comment creates a false safety guarantee for downstream integrators. [L2-L7] |

### Suggestions

- Replace Math.random() with an injectable CSPRNG to satisfy both gaming compliance (rule 13) and testability (rule 15).
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
      return buf[0] / 0x100000000;
    }
  ): T {
    const roll = rng() * totalWeight;
  ```
- Guard against empty input to prevent undefined silently escaping the T return type (rule 8).
  ```typescript
  // Before
  return items[items.length - 1];
  // After
  const last = items[items.length - 1];
  if (last === undefined) throw new RangeError('weightedPick: items array must not be empty');
  return last;
  ```
- Use readonly parameter types and add @param / @returns JSDoc tags (rules 5 and 9).
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * Picks one item from `items` proportionally to its corresponding `weights` entry.
   * @param items - Non-empty array of candidates.
   * @param weights - Positive weights parallel to `items`.
   * @param rng - Optional uniform [0,1) random source; defaults to crypto CSPRNG.
   * @returns The selected item.
   */
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng?: () => number,
  ): T {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues() (or a certified PRNG seeded from it) to meet regulated gaming RNG requirements. Update the JSDoc accordingly. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
