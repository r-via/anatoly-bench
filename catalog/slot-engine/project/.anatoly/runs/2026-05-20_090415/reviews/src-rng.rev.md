# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted in src/reels.ts. Both implement weighted random selection via cumulative-weight approach: sum weights, draw uniform random value, iterate with accumulation, return when threshold crossed. Variable naming differs (totalWeight vs total, roll vs r, cumulative vs acc) but semantics are identical. Only distinction is weightedPick uses generic <T> while pickFromWeighted specializes to Symbol type.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; inferred slot-machine domain from reel/payline/jackpot vocabulary in reference docs.
- **Overengineering [LEAN]**: Minimal cumulative-weight scan with a single pass and no abstractions. Generic type parameter T is appropriate since the function is a general utility. Implementation matches the standard O(n) weighted-pick algorithm exactly.
- **Tests [NONE]**: No test file found. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, and boundary roll values (roll === cumulative).
- **PARTIAL [PARTIAL]**: JSDoc describes the algorithm and general purpose, but omits @param descriptions (no explanation of what happens when weights.length !== items.length, or when weights contain negative/zero values), no @returns tag, and no @throws annotation for edge cases like empty arrays. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. rng.ts:5-16 is a correct generic weighted random selection implementation. The 'USED' claim is inaccurate: while imported at engine.ts:2, registered at engine.ts:30, and resolved at engine.ts:120, the resolved `rng` variable is never called — reels are built via factory.buildReels() → spinReel() → pickFromWeighted() (factories.ts:12, reels.ts:47). weightedPick is effectively dead code in the current call graph. The duplication with pickFromWeighted is real but is a refactoring/duplication concern, not a correction issue. No behavioral defect exists in the function itself.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical implementation of weighted random selection algorithm

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items: T[]` and `weights: number[]` are mutable. Both should be `readonly T[]` and `readonly number[]` since the function never mutates them. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by internal docs (reels, paytable, jackpot, CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND symbols, 95% RTP target in README). `Math.random()` is a pseudo-random, non-cryptographic PRNG seeded by the runtime — it is not certifiable for regulated gaming RNG. Any jurisdiction requiring certified RNG (GLI, BMM, iTech Labs) would reject this implementation. Must be replaced with a cryptographically secure source (e.g. `crypto.getRandomValues`) or a certified PRNG library. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making `weightedPick` non-deterministic and non-testable without monkey-patching. The RNG source should be injectable: `weightedPick<T>(items: readonly T[], weights: readonly number[], random: () => number = Math.random): T`. [L5] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Gaming RNG context (inferred from slot-machine domain in internal docs and file header `suitable for gaming RNG applications`): `Math.random()` does not produce statistically auditable, seed-reproducible, or certifiable output. Gaming-specific best practice requires a seeded, auditable PRNG (e.g. AES-CTR DRBG) or delegation to a platform-certified RNG API. [L7] |

### Suggestions

- Replace `Math.random()` with an injectable RNG parameter (defaults to `crypto.getRandomValues`-backed source) for both certification compliance and testability.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = cryptoRandom,
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = random() * totalWeight;
  ```
- Add `readonly` to both parameters to signal immutability at the call site.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a certifiable CSPRNG (e.g. crypto.getRandomValues or a seeded auditable library) to meet regulated gaming RNG requirements. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
