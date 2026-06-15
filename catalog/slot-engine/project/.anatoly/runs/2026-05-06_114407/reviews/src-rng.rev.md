# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm as pickFromWeighted. Both compute total via reduce, generate random roll, iterate accumulating weights, and return on match or fallback to last item. Only differences are variable names (totalWeight→total, roll→r, cumulative→acc) and type specificity (generic T vs Symbol). RAG score 0.865 confirms semantic equivalence.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; gaming domain is explicit in the JSDoc and project context.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm. Generic T is justified — the function is genuinely type-agnostic. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical RNG utility used by src/engine.ts has zero coverage — no tests for uniform distribution, boundary rolls (roll === 0, roll approaches totalWeight), single-item arrays, mismatched weights/items lengths, or zero/negative weights.
- **PARTIAL [PARTIAL]**: File-level JSDoc describes purpose and algorithm but is attached to the file, not the function. The function itself has no JSDoc — missing @param descriptions for `items` and `weights`, no @returns, no @throws for edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. src/rng.ts:5-16 implements correct weighted random selection: total computation (line 6), uniform roll (line 7), cumulative threshold (lines 9-12), fallback (line 15). The NEEDS_FIX was based on duplication with pickFromWeighted — valid as a duplication finding but not a correction bug. Additionally, weightedPick is imported (engine.ts:2), registered in container (line 30), and resolved (line 120), but the resolved `rng` variable is never invoked — grep for `rng(` in engine.ts returns no matches. Actual reel generation uses pickFromWeighted via spinReel, bypassing the container entirely. This is a dead-resolution / DI design issue, not a bug in weightedPick itself.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — both implement cumulative-weight uniform random selection

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig.json is present in the project root but its content was not provided. Cannot confirm strict: true is set. [L1-L16] |
| 5 | Immutability | WARN | MEDIUM | Function parameters `items` and `weights` are mutated by neither caller nor callee, but are not marked readonly. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | weightedPick has a description comment but lacks @param and @returns tags. [L1-L5] |
| 13 | Security | FAIL | CRITICAL | Domain inferred as regulated slot-machine/casino gaming from project vocabulary: jackpot.ts, reels.ts, freespin.ts, paytable.ts, wild.ts, plus the JSDoc explicitly stating 'gaming RNG applications'. Math.random() is a non-cryptographic PRNG seeded by the runtime — it is not certifiable for regulated gaming jurisdictions (GLI, BMM, eCOGRA, etc.) and fails statistical unpredictability requirements. Must be replaced with a certified, auditable RNG source (e.g., crypto.getRandomValues()). [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, making deterministic unit testing impossible without monkey-patching. Accepting a PRNG function as a parameter would allow injection of a seeded RNG in tests. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Utility function lacks input guards: empty items[] causes items[items.length - 1] to return undefined typed as T (silent type lie). weights.length !== items.length also produces incorrect results with no error. Both cases should throw or be validated. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x100000000) * totalWeight;
  ```
- Inject the PRNG as a parameter for testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = cryptoRng): T {`
- Add readonly to parameters and guard against empty input
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0 || items.length !== weights.length) throw new Error('items and weights must be non-empty arrays of equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```
- Add @param and @returns to JSDoc
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
   * @param items - Array of candidates to pick from.
   * @param weights - Parallel array of non-negative weights.
   * @returns The selected item.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues() (or an equivalent CSPRNG wrapper) so the RNG is auditable and meets regulated gaming certification requirements. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
