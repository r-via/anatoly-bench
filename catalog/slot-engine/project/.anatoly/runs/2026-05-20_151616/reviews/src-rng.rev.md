# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 91% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical logic to pickFromWeighted in src/reels.ts — both compute cumulative weight and pick via random draw. RAG score 0.823 confirms. Only differences: generic vs Symbol-specific, variable names (totalWeight/roll/cumulative vs total/r/acc), and export status. Interchangeable functions.
- **Correction [NEEDS_FIX]**: Two independent defects: Math.random() is uncertifiable for regulated gaming RNG (contradicts JSDoc's own claim); empty-array fallback silently returns undefined cast as T.
- **Overengineering [LEAN]**: Standard cumulative-weight alias sampling. Generic type parameter is appropriate for reuse across symbols/items. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight distribution uniformity. Called by src/engine.ts, suggesting it is on a critical path.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Algorithm at src/rng.ts:5-16 is identical to pickFromWeighted and equally correct. Duplication belongs on the duplication axis. Additionally, weightedPick is effectively dead at runtime: imported at engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 as `rng`, but `rng` is never invoked — grep of engine.ts shows zero calls to the resolved variable. Reels are generated via factory.buildReels(5,3) → spinReel → pickFromWeighted path (factories.ts:12 → reels.ts:47). The empty-input edge case (items[-1]=undefined) is theoretical hardening, not correction of an existing defect — no caller passes empty arrays.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 99% identical implementation — both perform weighted random selection via cumulative distribution with same algorithm and control flow

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are only read, never mutated. Parameters should be readonly T[] and readonly number[]. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block exists but lacks @param and @returns tags on the only public export weightedPick. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by reference docs (pay tables, reels, jackpot, RTP 95%). Math.random() is a non-seeded PRNG unsuitable for regulated gaming. It is non-certifiable under any gaming authority (GLI, BMM, iTech Labs). Regulatory compliance requires a certified CSPRNG (crypto.getRandomValues() or equivalent). The JSDoc itself labels this 'suitable for gaming RNG applications', compounding the risk by advertising a non-compliant primitive as fit-for-purpose. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardwired; deterministic testing requires global mock (jest.spyOn or vi.spyOn). Accepting a random: () => number parameter would enable pure-function testing without patching globals. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility missing defensive guards: (1) no check that items.length === weights.length — mismatch silently produces wrong probabilities; (2) no guard against empty items (returns undefined cast to T); (3) no guard against negative or zero-sum weights (totalWeight ≤ 0 → NaN roll → always falls through to last item). [L5-L16] |

### Suggestions

- Accept a CSPRNG provider instead of calling Math.random() directly — required for regulated gaming compliance.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000
  ): T {
    const roll = random() * totalWeight;
  ```
- Add parameter readonly and defensive input guards.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
    if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');
  ```
- Add @param and @returns JSDoc tags to the public export.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Selects one item from `items` using weighted random sampling.
   * @param items - Candidate items to pick from (non-empty).
   * @param weights - Non-negative weight per item; higher weight = higher probability.
   * @returns The selected item.
   * @throws {RangeError} If arrays are empty, mismatched, or contain negative weights.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues() (or a certified PRNG wrapper) to produce a certifiable, auditable random draw required by gaming regulations. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[correction · low · trivial]** Add a pre-condition guard: if items.length === 0 (or items.length !== weights.length), throw a RangeError instead of silently returning undefined. [L15]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
