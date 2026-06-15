# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, draw Math.random()*total, accumulate weights in a loop, return items[i] on first threshold cross, and fall back to items[items.length-1]. The only differences are generic type parameter T vs concrete Symbol type and variable names (roll/cumulative vs r/acc). Semantically interchangeable for the weighted-pick operation.
- **Correction [OK]**: Cumulative-weight sampling algorithm is correct; previously overturned NEEDS_FIX finding stands per deliberation record — no new evidence of changed conditions.
- **Overengineering [LEAN]**: Minimal cumulative-weight alias-free selection: one reduce, one linear scan. Generic T parameter is justified since the function is consumed with symbol arrays and could be reused. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical RNG utility used by slot machine spin logic — missing tests for empty arrays, mismatched array lengths, zero weights, negative weights, single-item arrays, and statistical distribution of picks across many draws.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, or zero total weight).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight algorithm, same fallback, same structure; differs only in generic vs concrete type and variable names

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are mutated only by read; they should be `readonly T[]` and `readonly number[]` to prevent callers from passing mutable arrays and to signal intent. [L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Block comment exists but omits `@param items`, `@param weights`, and `@returns` tags. Public API consumers get no machine-readable param/return documentation. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain confirmed by reference docs (reels, paytable, scatter, wild, jackpot, RTP 95%, free spins) and by this file's own JSDoc ('suitable for gaming RNG applications'). `Math.random()` is V8's xorshift128+, a non-cryptographic, non-seedable PRNG that is not certifiable under GLI-11, BMM, or any regulated-gaming RNG standard. Using it as the sole entropy source for symbol selection violates gaming-compliance requirements. A certifiable solution requires a CSPRNG (e.g. `crypto.getRandomValues`) or an audited, seedable RNG passed in as a dependency. [L8] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded, making deterministic unit tests impossible without monkey-patching. The random source should be injectable (parameter default or module-level dependency) so tests can pass a seeded or mock draw. [L6-L8] |

### Suggestions

- Replace `Math.random()` with an injectable CSPRNG to satisfy both gaming compliance and testability
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = secureDraw,
  ): T {
    const roll = random() * totalWeight;
  }
  
  /** Compliant draw: uniform float in [0, 1) via crypto.getRandomValues */
  function secureDraw(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
  ```
- Add `readonly` to both parameters to enforce immutability at the call-site
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Expand JSDoc with @param and @returns tags for machine-readable API documentation
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility for gaming RNG applications.
   * Uses a cumulative-weight approach with a single random draw.
   *
   * @param items - Candidate values; must be non-empty.
   * @param weights - Non-negative weights parallel to `items`; must sum > 0.
   * @param random - Optional entropy source; defaults to `secureDraw` (CSPRNG).
   * @returns The selected item.
   */
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
