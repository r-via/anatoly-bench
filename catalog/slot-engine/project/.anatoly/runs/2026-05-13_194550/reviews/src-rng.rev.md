# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 45% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Both compute total weight via reduce, generate random roll, accumulate weights in loop, and return matching item or fallback. Variable names differ (totalWeight/total, roll/r, cumulative/acc) but logic is identical.
- **Correction [NEEDS_FIX]**: Two independent defects: Math.random() is not certifiable for regulated gaming RNG; empty-array call returns undefined typed as T.
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm with a single pass. Generic type parameter is appropriate — the caller needs to pick from symbol arrays, weight arrays, etc. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical paths untested: zero total weight (division by zero), mismatched array lengths, single-item input, boundary where roll equals exact cumulative boundary, and distribution accuracy. Used by src/engine.ts, making this a production risk.
- **PARTIAL [PARTIAL]**: File-level JSDoc describes purpose and algorithm, but the function itself lacks parameter descriptions (@param items, @param weights), a @returns tag, and edge-case behavior (e.g., mismatched array lengths, zero/negative weights, empty arrays). (deliberated: confirmed — The function at rng.ts:5-16 is algorithmically correct. Verified: cumulative-weight selection with proper generics and fallback. The NEEDS_FIX claim is about duplication with reels.ts:pickFromWeighted — confirmed identical algorithm, differing only in generics (T vs Symbol) and variable names. However, correction axis is wrong for this: weightedPick has no bug. The real issue: engine.ts:2 imports it, engine.ts:30 registers it in container, engine.ts:120 resolves it into `rng` — but `rng` is never called (ESLint no-unused-vars, per engine review L122). The actual reel RNG goes through factory→spinReel→pickFromWeighted, completely bypassing weightedPick. This is dead-code-in-practice + duplication, not a correction issue. Lowering confidence to 45 — below reclassification threshold because function is correct and the concern belongs on duplication axis.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 96% identical — same cumulative-weight algorithm, control flow, and fallback; only differ in generics (T vs Symbol) and parameter naming

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are never mutated but lack readonly annotations, weakening call-site contracts. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block present but missing @param and @returns tags on the sole public export. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Regulated casino/slot-machine domain inferred from co-located files (engine.ts, jackpot.ts, freespin.ts, paytable.ts, reels.ts, wild.ts) and README arbitrated intents (RTP 95%, jackpotHit, freeSpinsAwarded, scatterCount). Math.random() is a non-cryptographic PRNG whose seed is implementation-defined — it is not certifiable for regulated gaming RNG under GLI-11, BMM, or eCOGRA standards. Compliance frameworks require a CSPRNG (e.g. crypto.getRandomValues) or hardware RNG. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, forcing global mocking for deterministic tests. Injecting an rng parameter with a default makes the function a pure, mockable unit. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guards for degenerate inputs: empty items returns items[-1] (undefined at runtime despite the T return type); mismatched items/weights lengths makes weights[i] undefined mid-loop corrupting cumulative; negative or NaN weights corrupt totalWeight silently. In a regulated gaming context these must throw explicitly rather than silently misbehave. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for regulated gaming compliance (rule 13). Extract the CSPRNG draw so it can also be injected for testing (rule 15).
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  const cryptoRng = (): number => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  };
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRng,
  ): T {
    if (items.length === 0) throw new RangeError('items must not be empty');
    if (items.length !== weights.length) throw new RangeError('items and weights length mismatch');
    if (weights.some(w => !(w > 0) || !isFinite(w))) throw new RangeError('all weights must be finite and positive');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add @param and @returns JSDoc tags to the public export (rule 9).
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
   * @param items - Candidate items to select from (non-empty).
   * @param weights - Parallel positive finite weights; must match items.length.
   * @param rng - Optional PRNG returning [0, 1). Defaults to a CSPRNG wrapper.
   * @returns The selected item.
   * @throws {RangeError} On empty array, length mismatch, or non-positive weights.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a precondition guard at function entry: if items.length === 0 or items.length !== weights.length, throw a descriptive error rather than silently returning undefined typed as T. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable, auditable PRNG (e.g. a seeded xoshiro256** or a CSPRNG wrapper) to satisfy regulated gaming RNG requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
