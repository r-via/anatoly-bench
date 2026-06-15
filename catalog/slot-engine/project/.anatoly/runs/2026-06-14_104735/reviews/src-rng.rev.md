# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Implements identical algorithm to `pickFromWeighted` in src/reels.ts: same reduce-total → random-roll → cumulative-accumulation → last-item-fallback pattern. Sole differences are generic type parameter vs concrete `Symbol[]` and exported vs private scope. Logic is interchangeable; `pickFromWeighted` could be replaced by calling this function directly.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a regulated gaming context — not certifiable for casino/slot RNG, and the JSDoc falsely claims it is 'suitable for gaming RNG applications'.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm: single pass, no unnecessary abstractions, generic T param justified by reuse across symbol types. Standard O(n) weighted sampling.
- **Tests [NONE]**: No test file exists. Critical RNG utility used by slot machine spin logic with no coverage of edge cases: empty arrays, mismatched lengths, zero-weight items, single-item arrays, or boundary behavior when roll equals cumulative weight boundary.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, no mention of edge cases (empty arrays, mismatched lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/rng.ts:5-16 correctly implements the same cumulative-weight sampling algorithm. Imported by src/engine.ts:2 and registered in the IoC container at L30. The finding claims NEEDS_FIX on the correction axis citing duplication with pickFromWeighted — duplication is factually true (~95% identical logic) but is not a correctness defect. The function itself is algorithmically correct. Additionally, the resolved `rng` variable in engine.ts:120 is never called within `spin()` (reels are built via factory.buildReels at L128), but that's a dead-code issue in engine.ts, not a correctness bug in weightedPick.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight loop, same fallback to last element, same Math.random() scaling; only variable names and type annotations differ

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are only read, not mutated. They should be typed as `readonly T[]` and `readonly number[]` to communicate the contract and prevent accidental mutation. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by project vocabulary (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbols, pay tables, jackpot, free spins, 95% RTP target). `Math.random()` is a non-cryptographic PRNG with deterministic, predictable output given knowledge of V8's internal PRNG state. Regulated gaming jurisdictions (GLI, BMM, eCOGRA) mandate certifiable RNG implementations (e.g., CSPRNG seeded from OS entropy, or an audited library). Using `Math.random()` here is a compliance and security FAIL for a regulated gaming RNG context. The JSDoc even self-identifies this as a 'gaming RNG' utility, making the violation unambiguous. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making the function non-deterministic and untestable without patching the global. Accepting an optional `rng: () => number` parameter (defaulting to `Math.random`) would allow seeded, deterministic tests. [L5-L15] |

### Suggestions

- Replace `Math.random()` with an injected RNG function, satisfying both testability (Rule 15) and allowing callers to supply a CSPRNG for regulated gaming compliance (Rule 13).
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- For regulated gaming, supply a CSPRNG via the Node.js `crypto` module instead of relying on `Math.random` as the default.
  ```typescript
  // Before
  // caller:
  const symbol = weightedPick(symbols, weights);
  // After
  import { randomBytes } from 'node:crypto';
  
  function cryptoRng(): number {
    const buf = randomBytes(4);
    return buf.readUInt32BE(0) / 0x1_0000_0000;
  }
  
  // caller:
  const symbol = weightedPick(symbols, weights, cryptoRng);
  ```
- Mark array parameters as readonly to communicate the non-mutating contract (Rule 5).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable PRNG (e.g. a seeded MT19937 or crypto.getRandomValues()-based uniform draw) and update the JSDoc to accurately describe the RNG guarantee provided, since Math.random() is not auditable or certifiable for regulated gaming. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
