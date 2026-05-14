# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm with same control flow. RAG score 0.839 (>0.82 threshold) and source code comparison confirms matching logic: both reduce weights to total, generate random roll, iterate with cumulative sum, return matching item or fallback.
- **Correction [OK]**: Algorithm is correct; prior NEEDS_FIX overturned per deliberation review (KFP). No new evidence of a changed situation.
- **Overengineering [LEAN]**: Single-purpose weighted random selection using cumulative sum. Generic type parameter is appropriate for reuse. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, all-zero weights, single-item input, boundary roll exactly at cumulative threshold, and distribution correctness. Used by src/engine.ts, making test absence a meaningful gap.
- **PARTIAL [PARTIAL]**: File-level JSDoc describes purpose and algorithm, but the function itself lacks parameter descriptions (@param for items/weights), return type explanation (@returns), edge case behavior (empty arrays, negative weights, mismatched array lengths), and the fallback on L15 is undocumented.

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical logic. Both implement weighted random selection via cumulative sum; only differences are type genericity (T vs Symbol), parameter naming, and export status—not semantic contract.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both array parameters are mutated-read-only inputs; they should be declared `readonly T[]` and `readonly number[]` to prevent accidental mutation at call sites. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block exists but omits `@param items`, `@param weights`, and `@returns` tags. Callers cannot see parameter contracts in IDE tooltips. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from project structure (`jackpot.ts`, `reels.ts`, `paytable.ts`, `freespin.ts`, `wild.ts`) and confirmed by the JSDoc: "suitable for gaming RNG applications". `Math.random()` is a non-cryptographic, non-seeded PRNG that is not certifiable under any regulated gaming standard (GLI-11, BMM, eCOGRA). Using it as the draw source in a slot/gaming engine exposes the operator to compliance failure and makes outcomes statistically predictable once the PRNG state is observed. A CSPRNG (`crypto.getRandomValues`) or a certified RNG service must be used. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making `weightedPick` non-deterministic and untestable without monkey-patching globals. An injectable `rng: () => number` parameter with a default of `Math.random` would allow deterministic unit tests. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility lacks input guards: empty `items` array returns `undefined` (cast to `T`), and mismatched `items`/`weights` lengths produce silent incorrect behavior. Both are common call-site mistakes that should be caught with a precondition check or thrown `Error`. [L5-L15] |

### Suggestions

- Replace Math.random() with an injectable, CSPRNG-backed draw to satisfy both regulatory compliance and testability.
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
      return buf[0] / 0x1_0000_0000;
    },
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add input guards to prevent silent undefined returns on empty or mismatched arrays.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items and weights must have equal length');
  ```
- Complete the JSDoc with @param and @returns tags.
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
   * @param items - Non-empty array of candidate items.
   * @param weights - Positive weights parallel to `items`.
   * @param rng - Optional CSPRNG source; defaults to `crypto.getRandomValues`-backed draw.
   * @returns The selected item.
   * @throws {Error} If `items` is empty or lengths differ.
   */
  ```
- Mark array parameters readonly to prevent accidental mutation.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
