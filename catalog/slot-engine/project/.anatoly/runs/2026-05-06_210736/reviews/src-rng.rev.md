# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted in src/reels.ts. Both implement cumulative weight method for random selection: reduce weights, generate random value, iterate accumulating weights, return on threshold match, fallback to last item. Completely interchangeable semantically.
- **Correction [NEEDS_FIX]**: Two independent defects: non-certifiable RNG for regulated gaming domain; unguarded empty-array path returns undefined as T.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter that's genuinely needed for reuse across symbol types. No unnecessary abstractions; the loop is the standard O(n) approach appropriate for a small fixed-size weight array (8 symbols).
- **Tests [NONE]**: No test file found. Critical edge cases untested: empty arrays, single item, zero weights, negative weights, weights summing to zero, boundary rolls at exact cumulative thresholds, and statistical distribution correctness. Used by src/engine.ts, making this a production risk.
- **PARTIAL [PARTIAL]**: JSDoc describes the function's purpose and algorithm but omits @param descriptions for `items` and `weights`, and no @returns tag documenting the return value or edge-case behavior (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — Duplication with pickFromWeighted (src/reels.ts:30-41) confirmed — identical algorithm. However, weightedPick (src/rng.ts:5-16) is never actually invoked at runtime: engine.ts imports it (line 2), registers it in the container (line 30), resolves it (line 120), but the resolved 'rng' variable is never called (grep 'rng\(' in engine.ts: 0 matches). All reel generation flows through StandardReelBuilderFactory.buildReels → spinReel → pickFromWeighted. So weightedPick is dead code in practice, and the duplication is moot from a correctness standpoint. The code is not incorrect — it's unused and duplicated. Reclassified to OK on correction axis: either remove weightedPick and its import, or refactor spinReel to use it and delete pickFromWeighted.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — cumulative weight random selection with matching control flow

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both parameters are read-only by design but not declared as such. `items: T[]` and `weights: number[]` should be `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by .anatoly/docs/ (reels, WILD, SCATTER, jackpot, RTP, free-spin vocabulary throughout the project). `Math.random()` is a non-cryptographic PRNG seeded from a non-auditable source and is not certifiable for regulated gaming RNG under any major jurisdiction (Nevada, Malta GRA, UKGC, etc.). Using it for outcome determination in a wagering product is a compliance and security FAIL. A CSPRNG (`crypto.getRandomValues()` in Node ≥ 15 / Web Crypto API) must be used instead. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function, making deterministic unit tests impossible without monkey-patching globals. Injecting a `randomFn: () => number` parameter (defaulting to `Math.random`) enables both CSPRNG injection in production and seeded-random injection in tests. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard against empty `items` / `weights` arrays or mismatched lengths. An empty `items` array causes `items[items.length - 1]` to return `undefined` while the return type promises `T`. A mismatched `weights` length silently reads `undefined` array slots as `NaN`, corrupting cumulative arithmetic and biasing the final slot. Both are runtime crashes/silent bugs in a gaming engine. [L5-L16] |

### Suggestions

- Replace `Math.random()` with an injectable CSPRNG function. Fixes both the security/compliance violation (rule 13) and the testability issue (rule 15).
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    randomFn: () => number = () => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 0x1_0000_0000;
    },
  ): T {
    const roll = randomFn() * totalWeight;
  ```
- Add input guards to prevent silent undefined returns and NaN-corrupted distributions.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
  ```
- Mark array parameters readonly to enforce caller immutability contracts.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Quick Wins

- **[correction · medium · small]** Add a guard at function entry: throw (or return a typed sentinel) when items.length === 0 or items.length !== weights.length to prevent undefined-as-T and silent distribution bias. [L5]

### Refactors

- **[correction · high · large]** Replace Math.random() with a cryptographically-secure or independently-auditable RNG (e.g. crypto.getRandomValues) to meet regulated gaming certification requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
