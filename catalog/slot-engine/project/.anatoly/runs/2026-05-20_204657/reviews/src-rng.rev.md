# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight selection algorithm. Both sum weights, generate uniform random draw, and accumulate to threshold. Only differences: variable naming (totalWeight/roll/cumulative vs. total/r/acc) and type specificity (generic T vs. Symbol).
- **Correction [NEEDS_FIX]**: Two independent defects: Math.random() is not certifiable for regulated gaming RNG; no guard against weights being shorter than items.
- **Overengineering [LEAN]**: Standard cumulative-weight linear scan. Generic T parameter is appropriate for reuse across symbol types. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. No tests for happy path, edge cases (empty arrays, mismatched lengths, zero weights, single item), or statistical distribution correctness.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what happens when items/weights arrays have mismatched lengths, or when weights array is empty) and no @returns tag documenting the return value. (deliberated: reclassified: correction: NEEDS_FIX → OK — src/rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted. The NEEDS_FIX was driven by the duplication finding, which belongs on the duplication axis. On the correction axis specifically, the function has no bugs: it correctly computes cumulative weights (L6-7), iterates with proper comparison (L9-13), and has a floating-point fallback (L15). It IS used at runtime — imported at engine.ts:2, registered in DI container at engine.ts:30, resolved at engine.ts:120 — though notably the resolved value is never actually called (the reel path bypasses it via pickFromWeighted). That's an architectural concern, not a correctness bug in weightedPick itself.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical logic — both implement same weighted random picker algorithm with cosmetic variable name differences

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are mutated by nothing but should be `readonly` to express the pure-read contract and enable stricter callers. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block is present but omits `@param` and `@returns` tags. For a public RNG utility used by the engine, full parameter documentation is expected. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated gaming domain inferred from: reel weight tables (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), jackpot/free-spin triggers, SpinResult contract, and RTP target of 95% in reference docs. `Math.random()` is a non-cryptographic PRNG that is not certifiable under any major gaming testing laboratory standard (GLI-11, BMM, eCOGRA). All regulated gaming jurisdictions require a certified, statistically independent, and auditable RNG — `Math.random()` does not qualify. Replace with `crypto.getRandomValues()` or a seeded, auditable CSRNG. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function. This makes unit tests non-deterministic — callers cannot inject a seeded or mocked RNG. Refactor to accept a `rng: () => number` parameter with a default of `Math.random` to enable deterministic tests. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG context: no guard against empty `items`/`weights` arrays or mismatched lengths. An empty array causes `items[items.length - 1]` to return `undefined` at runtime while TypeScript reports type `T`. At minimum, a runtime invariant check (`if (items.length === 0 \|\| items.length !== weights.length) throw new RangeError(...)`) is required for a production gaming engine. [L5-L15] |

### Suggestions

- Replace `Math.random()` with `crypto.getRandomValues()` for a certifiable, uniform random draw.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const roll = (arr[0] / 0x1_0000_0000) * totalWeight;
  ```
- Inject the RNG function for testability and to decouple the PRNG strategy.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 0x1_0000_0000; }
  ): T {
  ```
- Add a guard for empty or mismatched inputs.
  ```typescript
  // Before
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError(`weightedPick: items.length (${items.length}) must equal weights.length (${weights.length}) and be > 0`);
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```
- Add @param and @returns JSDoc tags.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   * @param items - Candidate items to pick from.
   * @param weights - Non-negative weight for each item; must be the same length as `items`.
   * @param rng - Optional uniform random source in [0, 1). Defaults to `crypto.getRandomValues`.
   * @returns The selected item.
   * @throws {RangeError} If `items` is empty or lengths differ.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a precondition guard at function entry that throws when items.length !== weights.length or items.length === 0, preventing silent NaN-corruption of the distribution on mismatched arrays. [L6]

### Refactors

- **[correction · high · large]** Replace Math.random() with a crypto.getRandomValues()-backed uniform draw (e.g. generate a random uint32 and divide by 2^32) to produce certifiable, cryptographically-secure randomness required for regulated gaming RNG. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
