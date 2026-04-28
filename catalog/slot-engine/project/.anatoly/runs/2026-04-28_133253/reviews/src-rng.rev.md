# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | - | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm: both use cumulative weight approach with uniform random draw, same loop structure, same fallback return. Differences are cosmetic (generic vs specific typing, variable naming). RAG score 0.852 confirms high semantic similarity.
- **Correction [NEEDS_FIX]**: Math.random() is used as the RNG source in a function explicitly labeled 'suitable for gaming RNG applications' in a slot-machine project — not certifiable for regulated gaming.
- **Overengineering [LEAN]**: Textbook cumulative-weight O(n) algorithm with no unnecessary abstractions. The single generic type parameter <T> is justified — the project uses it for typed slot symbols per the documented reel configuration in src/reels.ts, and generic reuse adds no complexity. No factory, no configuration object, no inheritance; the fallback return on L15 is a correct edge-case guard, not padding. (deliberated: confirmed — Duplication confirmed. rng.ts:5-16 (weightedPick) and reels.ts:30-41 (pickFromWeighted) implement identical cumulative-weight random selection: both reduce weights to total, draw Math.random()*total, iterate accumulating weights with `< cumulative` check, and fall back to the last item. Only differences are variable names and generic vs. concrete typing. Furthermore, weightedPick is imported in engine.ts:2, registered in the DI container at engine.ts:30, and resolved at engine.ts:120 — but the resolved `rng` variable is never invoked anywhere in the spin function. The runtime uses pickFromWeighted via spinReel (reels.ts:47) called from StandardReelBuilderFactory.buildReels (factories.ts:12). This represents both dead duplication and a broken DI integration. Raising confidence from 85 to 90.)
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 99% identical logic — both implement weighted random selection via cumulative weight with Math.random(), only differences are generics and variable names

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not marked readonly. The function never mutates either array; marking them readonly would better express intent and prevent accidental mutation by future editors. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | A JSDoc block is present but lacks @param and @returns tags, reducing discoverability for consumers. The contract (lengths must match, weights must sum to > 0) is also undocumented. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code, so no unhandled rejection risk. However, there are no guards against invalid inputs: (1) if items is empty, the fallback `items[items.length - 1]` returns undefined at runtime while the declared return type is T, silently violating type safety; (2) if weights and items have mismatched lengths or totalWeight is 0, behavior is silently incorrect. [L5-L14] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), RTP targets, freespin/jackpot/paytable modules documented across .anatoly/docs/01-Getting-Started/03-Configuration.md, .anatoly/docs/04-API-Reference/02-Configuration-Schema.md, and .anatoly/docs/03-Guides/02-Advanced-Configuration.md. Math.random() is not a cryptographically secure PRNG (CSPRNG) and is not certifiable for regulated gaming under any major testing laboratory standard (GLI-11, eCOGRA, BMM, iTech Labs). Its internal state is observable and its distribution is not auditable to regulatory standards. A CSPRNG such as crypto.getRandomValues() must be used instead, or outcomes must be generated server-side using a certified RNG. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly inside the function body with no injection point, making deterministic unit tests impossible without monkey-patching the global. Accepting an optional `random: () => number` parameter (defaulting to the CSPRNG wrapper) would decouple the function from the global RNG and make distribution tests trivial. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | For a gaming-domain RNG utility, input contracts must be enforced explicitly: mismatched items/weights lengths and a zero or negative totalWeight are silent failures that can corrupt game outcome distributions. A well-defined gaming RNG helper should throw descriptive errors on invalid inputs rather than silently returning the last element. [L5-L6] |

### Suggestions

- Replace Math.random() with an injectable CSPRNG for both regulatory compliance and testability
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  function defaultCsprng(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = defaultCsprng,
  ): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new Error('weightedPick: total weight must be positive');
    const roll = random() * totalWeight;
  ```
- Add @param, @returns, and @throws JSDoc tags to fully document the exported function contract
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Picks one item from `items` proportionally to its corresponding weight.
   * Uses a cumulative-weight approach with a single uniform random draw.
   *
   * @param items - Candidate items to pick from (non-empty).
   * @param weights - Relative non-negative weights; must parallel `items` and sum to > 0.
   * @param random - RNG function returning a value in [0, 1). Defaults to a CSPRNG wrapper.
   * @returns The randomly selected item.
   * @throws {Error} If `items` is empty, lengths differ, or the total weight is ≤ 0.
   */
  ```
- Mark array parameters as readonly to communicate non-mutation intent at the type level
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a CSPRNG source (e.g., crypto.getRandomValues() scaled to [0, totalWeight)) so the RNG is certifiable for regulated gaming use, as required by industry convention for slot-machine applications. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
