# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: Canonical generic utility function; pickFromWeighted in src/reels.ts reimplements identical cumulative-weight algorithm with Symbol-specific typing. weightedPick is the exportable utility form.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; also no guard against empty inputs or negative/zero total weight.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic parameter. The generic T is necessary to preserve type information for callers. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical gaming RNG logic with no coverage: unequal weight distribution, single-item arrays, boundary roll (roll === 0, roll === totalWeight - epsilon), and the fallback return on L15 are all untested. Called by src/engine.ts, making this a high-risk gap.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at rng.ts:5-16 implements a standard cumulative-weight algorithm that is correct for all valid inputs. The fallback at rng.ts:15 (`return items[items.length - 1]`) correctly handles floating-point edge cases. The original finding conflates duplication (pickFromWeighted in reels.ts:30-41 reimplements identical logic) with a correction defect in weightedPick itself — but there is no bug in the function. Additionally, engine.ts:120 resolves `rng` from the container but never invokes it; the actual reel generation flows through factories.ts:12 → reels.ts:43-49 → pickFromWeighted. The unused-resolved-variable and duplication are real issues but belong on the utility and duplication axes, not correction. No behavioral fix is needed in the function itself.)

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are mutated-safe by value but not typed as `readonly`. Callers could pass mutable arrays that get aliased. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code. However, no guard against empty `items` array — returns `items[items.length - 1]` which is `undefined` when array is empty, silently producing a type-unsafe result. [L13] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/gaming RNG domain inferred from filename `rng.ts`, sibling files `reels.ts`, `jackpot.ts`, `paytable.ts`, `freespin.ts`, and JSDoc comment 'suitable for gaming RNG applications'. `Math.random()` is a non-cryptographic PRNG seeded by the JS engine — not certifiable for regulated gaming. Regulated gaming jurisdictions (GLI, BMM, eCOGRA) require a certifiable, auditable RNG. Replace with `crypto.getRandomValues()` or a certified PRNG library. [L8] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function with no injection point, making deterministic unit testing impossible without monkey-patching. [L8] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Gaming RNG context: `weightedPick` does not validate that `items.length === weights.length`, that all weights are positive, or that the array is non-empty. These invariants are critical for correct prize distribution and should throw or return a typed error rather than silently falling through. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const roll = (arr[0] / 0x100000000) * totalWeight;
  ```
- Add readonly to parameters to enforce immutability at the call site
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject the RNG function for testability and decoupling
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 0x100000000; }
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = random() * totalWeight;
  ```
- Guard against empty/mismatched inputs to prevent silent undefined returns
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new Error('weightedPick: items must be non-empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
    if (weights.some(w => w < 0)) throw new Error('weightedPick: weights must be non-negative');
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a guard at function entry: throw if items is empty or if items.length !== weights.length, preventing undefined returns and silent distribution skew. [L6]

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues()-based uniform draw to satisfy regulated gaming RNG certification requirements. [L7]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
