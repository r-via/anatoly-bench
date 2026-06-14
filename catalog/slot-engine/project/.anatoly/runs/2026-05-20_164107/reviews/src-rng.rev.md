# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 93% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight random selection algorithm. Both reduce weights to total, generate uniform random value, iterate with accumulator comparing roll < cumulative, return item or fallback. Only differences are variable names and generic vs specific type.
- **Correction [NEEDS_FIX]**: Uses Math.random() as the RNG source in a regulated slot-machine engine — not certifiable for regulated gaming.
- **Overengineering [LEAN]**: Standard cumulative-weight linear scan. Generic type parameter T is appropriate and minimal. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: mismatched array lengths, zero-weight items, single-item input, floating-point boundary where roll equals cumulative weight, and empty arrays. Called by src/engine.ts, meaning untested RNG behavior affects core game logic.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns tag, and no mention of edge cases (e.g. mismatched array lengths, zero total weight, empty arrays). (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified rng.ts:5-16 — the function is algorithmically correct. It is imported by engine.ts:2, registered at engine.ts:30, and resolved at engine.ts:120, but the resolved `rng` variable is never referenced after that line — making weightedPick effectively dead code at runtime (the actual weighted selection runs through pickFromWeighted in reels.ts via the spinReel call chain). The duplication with pickFromWeighted is real (95% structural match), but duplication is a refactoring concern, not a correctness defect. No bug exists in either implementation. The correction axis is misapplied here.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — cumulative-weight selection with matching control flow and fallback behavior

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are never mutated inside weightedPick but are not declared readonly. Callers get no compile-time guarantee the function won't mutate the arrays. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain inferred from pay table, reel symbols (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), jackpot, and free-spin machinery in the reference docs, plus the JSDoc's own phrase 'suitable for gaming RNG applications.' Math.random() is a non-cryptographic, browser-seeded PRNG. Regulated gaming jurisdictions (GLI-11, BMM, iTech) require certified RNG algorithms. Math.random() cannot pass RNG certification, making any game outcome derived from it non-compliant. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly, making weightedPick non-deterministic. An injected random source (e.g., a rng: () => number parameter defaulting to Math.random) would allow deterministic unit tests without global mocking. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Utility function has no input validation: empty items/weights arrays produce undefined (items[items.length - 1] returns undefined when length is 0) without throwing; mismatched array lengths silently produce biased results. A gaming utility should guard these invariants explicitly. [L5-L15] |

### Suggestions

- Inject the random source for testability and lay groundwork for a certifiable RNG swap
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
- Add readonly to parameters to document non-mutation and catch accidental writes
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Guard empty-array and length-mismatch invariants
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  ```
- Replace Math.random() with a certifiable PRNG (e.g., a CSPRNG wrapper) for regulated gaming compliance
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  // Use a GLI-11-certified RNG adapter instead of Math.random()
  const roll = certifiedRng.nextFloat() * totalWeight;
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a certified CSPRNG (e.g. crypto.getRandomValues / webcrypto) to meet regulated gaming RNG certification requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
