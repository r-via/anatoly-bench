# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, scale Math.random() by total, iterate accumulating weights, return item when roll < cumulative, and fall back to last item. The only differences are variable names and that weightedPick is generic while pickFromWeighted is typed to Symbol[]. Same algorithm, same contract, interchangeable behavior.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; the weighted-selection algorithm itself is correct.
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm with a single generic type parameter justified by reuse. No unnecessary abstraction — minimal loop, clear fallback return, correct for the gaming RNG use case.
- **Tests [NONE]**: No test file exists. Critical gaming RNG utility consumed by spin() — missing tests for uniform distribution, zero-weight items, single-item arrays, last-element fallback, and statistical weight proportionality.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, zero-weight items). (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at src/rng.ts:5-16 is correct: same cumulative-weight algorithm as pickFromWeighted, generic typed. Imported by src/engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 — but the resolved `rng` variable is never actually called in spin(). Reel generation flows through StandardReelBuilderFactory.buildReels (src/factories.ts:9-15) → spinReel → pickFromWeighted. The unused resolution is a utility/dead-code concern, not a correction defect. The function itself has no bugs. Duplication with pickFromWeighted is real but belongs on the duplication axis, not correction.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — same cumulative-weight loop, same fallback, only variable names and type parameter differ

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not mutated inside the function but are not marked `readonly`. Caller arrays could be mutated by a different call path with no type-level protection. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from pay table, reels, jackpot, scatter, and RTP vocabulary in reference docs. `Math.random()` is a non-cryptographic PRNG (V8 uses xorshift128+, which is deterministic and not seeded from a hardware entropy source). Regulated gaming jurisdictions (GLI-11, BMM, eCOGRA, UKGC RTS) require a certifiable CSPRNG — typically `crypto.getRandomValues()` or `node:crypto` `randomInt`/`randomBytes`. The JSDoc itself advertises this function as 'suitable for gaming RNG applications', making the violation unambiguous. `Math.random()` must be replaced before this engine can pass any compliance audit. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making the function non-deterministic and requiring global mock patching in tests. Injecting a `rng: () => number` parameter (defaulting to `Math.random`) would allow deterministic unit tests without any mocking infrastructure. [L5-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | RNG utility missing input-contract guards: (1) no check that `items.length === weights.length` — a mismatch silently produces wrong distributions; (2) empty `items` array returns `undefined` typed as `T` (index -1), which TypeScript will not catch without `noUncheckedIndexedAccess`. Both are easy precondition throws. [L5-L15] |

### Suggestions

- Replace Math.random() with a CSPRNG to satisfy regulated gaming compliance requirements
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  import { randomBytes } from 'node:crypto';
  // Generate a uniform float in [0, 1) from 4 cryptographically random bytes
  const buf = randomBytes(4);
  const roll = (buf.readUInt32BE(0) / 0x1_0000_0000) * totalWeight;
  ```
- Inject the RNG function for testability and make parameters readonly
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
  ```
- Add input-contract guards to prevent silent misbehavior
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have the same length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a CSPRNG draw (e.g. crypto.getRandomValues() scaled to [0, totalWeight)) to satisfy regulated gaming RNG certification requirements. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
