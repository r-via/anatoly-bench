# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is virtually identical to pickFromWeighted in src/reels.ts: both compute a total via reduce, draw Math.random() * total, iterate accumulating per-item weights, and fall back to the last element. Only differences are variable names (totalWeight/roll/cumulative vs total/r/acc), the generic <T> vs concrete Symbol type, and export visibility — none of these alter the algorithm or its invariants.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; inferred slot-machine domain from reel/payline/jackpot/RTP vocabulary throughout the project docs and paytable.
- **Overengineering [LEAN]**: Minimal cumulative-weight sampling algorithm. Generic type parameter T is justified — the function is used for both symbol arrays and potentially other weighted picks. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical gaming RNG utility used by src/engine.ts with no coverage of weighted distribution correctness, edge cases (empty arrays, mismatched lengths, zero weights, single item, all-zero weights), or the fallback return on L15.
- **PARTIAL [PARTIAL]**: Block comment describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted, both producing valid results. The evaluator conflated duplication with a correctness defect. Additionally, while weightedPick is imported in engine.ts:2 and registered in the container (engine.ts:30), the resolved variable `rng` (engine.ts:120) is never actually called within spin() — reel generation goes through StandardReelBuilderFactory.buildReels → spinReel → pickFromWeighted (the reels.ts local copy). This makes weightedPick effectively dead code via the container path, but that's a utility/dead-code issue, not a correctness bug. The function itself has no defect.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight selection algorithm, same fallback, same structure; weightedPick is a generic-typed export of the same function

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not marked `readonly`. The function never mutates them; readonly arrays should be declared. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block is present but missing @param and @returns tags. The description is clear but parameters and return type are undocumented. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed from reference docs (pay tables, reel weights, jackpot, scatter, 95% RTP). Math.random() is a non-seeded, non-auditable PRNG sourced from the V8 xorshift128+ implementation — it is not certifiable for regulated gaming RNG under any major jurisdiction (GLI, BMM, iTech Labs). Every reel spin outcome flows through this function, meaning the entire game's RNG certification fails at this call site. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, making deterministic unit tests impossible without monkey-patching. An injected rng parameter (e.g. `rng: () => number = Math.random`) would allow seeded testing with no runtime cost. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming context requires: (1) injectable RNG abstraction (see rule 15); (2) input guards — if items is empty, items[items.length - 1] returns undefined, silently corrupting spin results. A reel engine passing empty arrays due to a config bug would produce undefined symbols with no runtime error. [L14] |

### Suggestions

- Replace hardcoded Math.random() with an injectable rng parameter to enable certifiable PRNG substitution and deterministic tests.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add input guards to prevent silent undefined returns on empty arrays.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
    if (items.length === 0) throw new RangeError('weightedPick: items array must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  ```
- Expand JSDoc with @param and @returns tags.
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
   * @param weights - Parallel non-negative weights; must match items.length.
   * @param rng - Optional RNG source; defaults to Math.random. Inject a seeded PRNG for certified gaming use.
   * @returns The selected item.
   * @throws {RangeError} If items is empty or arrays differ in length.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a cryptographically secure source (e.g., crypto.getRandomValues() producing a uniform float in [0,1)) to satisfy regulated gaming RNG certification requirements. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
