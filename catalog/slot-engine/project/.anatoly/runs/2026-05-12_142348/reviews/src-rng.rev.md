# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 80% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Both functions compute total weight via reduce, generate a uniform random value, iterate through items accumulating weights, and return on first match where random falls below cumulative threshold. Variable names differ (totalWeight/total, roll/r, cumulative/acc) but logic is identical. RAG score 0.837 confirms semantic equivalence. The generic <T> type parameter in weightedPick vs specific Symbol[] in pickFromWeighted is stylistic generalization, not semantic contract difference.
- **Correction [NEEDS_FIX]**: Math.random() is non-certifiable for regulated gaming RNG; all other logic is correct.
- **Overengineering [LEAN]**: Minimal cumulative-weight linear scan. Generic T parameter is justified — callers pass typed symbol arrays. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll at exact cumulative threshold, and negative weights. Used by src/engine.ts, making coverage gaps a production risk.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: confirmed — Confirmed duplicate of pickFromWeighted (see pickFromWeighted analysis above — identical algorithm). Additional finding: weightedPick is imported at src/engine.ts:2, registered in container at line 30, and resolved at line 120 (`const rng = container.resolve(...)`), but the resolved `rng` variable is NEVER called in the spin() function body (grep confirms only 3 occurrences of 'rng' in engine.ts: import, register, resolve — no invocation). The actual RNG work flows through factory.buildReels → spinReel → pickFromWeighted, bypassing weightedPick entirely. So weightedPick is effectively dead code in the spin path despite being imported. Slight confidence decrease to 80 because the finding is about duplication but the bigger issue (dead code in spin path) is a separate axis not in the original finding.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% code overlap — both implement cumulative-weight algorithm for weighted random selection with identical control flow

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are mutable array types. A pure utility function that never mutates its inputs should declare them `readonly`. [L5] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain confirmed by JSDoc ('suitable for gaming RNG applications'), slot-machine vocabulary throughout internal docs (reels, RTP, SCATTER, WILD, jackpot), and the file's own role as the RNG core. `Math.random()` (V8 Xorshift128+) is a non-certifiable PRNG and is rejected by all major regulated-gaming certification bodies (GLI, BMM, iTech Labs). Regulated RNG must use a CSPRNG seeded from a hardware entropy source. This is a compliance-critical defect, not merely a code-quality concern. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making the function non-deterministic and untestable without monkey-patching. Injecting a `randomSource: () => number` parameter enables seeded deterministic tests and also cleanly accommodates a future CSPRNG swap. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming utility is missing defensive input guards: (1) empty `items` array causes `items[items.length - 1]` to return `undefined` typed as `T`; (2) `items.length !== weights.length` silently produces wrong distributions. Both are common failure modes in reel-spin engines where callers build weight arrays dynamically. [L5-L14] |

### Suggestions

- Inject the random source so the function is deterministic in tests and can accept a CSPRNG in production.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random   // swap for CSPRNG in production
  ): T {
    const roll = rng() * totalWeight;
  ```
- Mark array parameters readonly to communicate the pure-function contract.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Guard against empty input and length mismatch to avoid silent undefined returns.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues() (or an equivalent certifiable PRNG) to satisfy regulated gaming RNG requirements. Example: use a Uint32Array with crypto.getRandomValues and normalise to [0, 1) before multiplying by totalWeight. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
