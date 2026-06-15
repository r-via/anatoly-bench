# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | - | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is virtually identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by that total, accumulate in a loop, and fall back to the last item. The only differences are variable names and that weightedPick is generic (<T>) while pickFromWeighted is typed to Symbol[]. Same algorithm, same semantics, same fallback behavior.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a regulated slot-machine gaming context; Math.random() is not a certifiable RNG source under any major gaming jurisdiction.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm. Generic type parameter is justified since the same function serves any symbol type. Single responsibility, no unnecessary abstractions. (deliberated: confirmed — Confirmed — mirror of pickFromWeighted finding. src/rng.ts:5-16 is the canonical generic version, already exported and consumed by src/engine.ts:2. The duplicate in src/reels.ts:30-41 should be removed in favor of importing this function. weightedPick itself is correct code; the NEEDS_FIX applies to the duplication situation requiring consolidation.)
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight loop, same Math.random() draw, same last-item fallback; differs only in variable names and type parameter

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` parameters are not mutated but are typed as mutable arrays. Both should be `readonly`. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No guard for empty `items` array: when `items.length === 0`, `items[items.length - 1]` evaluates to `undefined`, violating the declared return type `T` at runtime. Similarly, if all weights are 0, the loop never returns early and the fallback silently fires. [L13] |
| 13 | Security | FAIL | CRITICAL | Casino/slot-machine domain inferred from reference docs (pay table, reels, jackpot, free spins, 95% RTP target). `Math.random()` is a non-cryptographic PRNG seeded by the JS engine and is not certifiable for regulated gaming RNG. Regulated jurisdictions (GLI, BMM, iTech Labs) require a certified CSPRNG (e.g., `crypto.getRandomValues`). This file's own JSDoc acknowledges it is 'suitable for gaming RNG applications', making the violation explicit. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded. Unit tests must mock the global `Math.random` to produce deterministic results. Injecting a `rng: () => number` parameter would make the function a pure, easily-testable utility. [L5-L7] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() to satisfy regulated gaming RNG requirements
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x100000000) * totalWeight;
  ```
- Inject rng function for deterministic unit testing
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRng,
  ): T {
  ```
- Add readonly to parameter types and guard against empty arrays
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = cryptoRng): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) throw new RangeError('weightedPick: total weight must be > 0');
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable RNG (e.g., crypto.getRandomValues() to draw a uint32, then divide by 2^32) so the slot engine's outcome distribution is auditable and reproducible from a logged seed, as required by regulated gaming standards (GLI-11 / equivalent). [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
