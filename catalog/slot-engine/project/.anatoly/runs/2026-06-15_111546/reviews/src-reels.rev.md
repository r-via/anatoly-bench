# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 88% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | - | 95% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 90% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 85% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | - | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by getReelSymbols and pickFromWeighted (called via spinReel), both exported and consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: 8-element array in correct order; indices align with weightsToArray and ReelWeightConfig.
- **Overengineering [LEAN]**: Simple static array of symbol names. Appropriate.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as the parameter type for weightsToArray and the type annotation for DEFAULT_WEIGHTS.
- **Duplication [UNIQUE]**: No similar type found in RAG results.
- **Correction [OK]**: 8 named properties match SYMBOLS order exactly.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when building REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (p=0.25) produces per-payline EV ≈ 2.30× line-bet from DIAMOND combinations alone, violating the arbitrated 95% RTP target by a factor > 2.
- **Overengineering [LEAN]**: Straightforward config literal. Complexity belongs to the type it's declared against, not this constant. (deliberated: confirmed — Confirmed. src/reels.ts:14 sets DIAMOND weight to 30, making it the most common symbol (30/120 = 25% per cell). But src/paytable.ts:11 shows DIAMOND has the highest payouts: [50, 250, 1000] — far exceeding CHERRY [2, 5, 25] which has weight 25. A high-value symbol being MORE common than low-value symbols is economically inverted. Furthermore, src/jackpot.ts:10 triggers jackpot when diamondCount >= 4 across 15 cells. With P(DIAMOND)=0.25 per cell, P(X≥4 | X~Bin(15,0.25)) ≈ 0.69 — jackpot fires ~69% of spins, clearly unintended for a rare event. DIAMOND weight should likely be 3 or similar to align with its premium payout tier.)
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in the REEL_WEIGHTS initializer to populate per-reel weight arrays.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Returns weights in the same order as SYMBOLS; all 8 properties covered with matching indices.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed by spinReel and getReelWeights, both consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: 5 reels initialized from DEFAULT_WEIGHTS; count and construction are correct.
- **Overengineering [LEAN]**: Five explicit entries keep per-reel customization possible and are trivially readable. The repetition is minor boilerplate, not abstraction.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel per row to produce weighted random symbol selection.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumulate weights in a loop, and return the last item as fallback. The only differences are variable names (r vs roll, acc vs cumulative) and that pickFromWeighted is Symbol-typed while weightedPick is generic — the functions are interchangeable for Symbol arrays.
- **Correction [NEEDS_FIX]**: Uses Math.random() which is not a certifiable RNG for regulated gaming.
- **Overengineering [LEAN]**: Textbook O(n) weighted random selection. No unnecessary abstraction. (deliberated: confirmed — Confirmed duplication. src/reels.ts:30-41 pickFromWeighted and src/rng.ts:5-16 weightedPick implement identical cumulative-weight random selection: both reduce weights to total, multiply Math.random() by total, accumulate in a loop, and fall back to last item. Only variable names differ (total/totalWeight, r/roll, acc/cumulative) and type narrowing (Symbol vs generic <T>). weightedPick is already imported in engine.ts:2 and registered in the container at L30, but factories.ts:12 calls spinReel() which uses the duplicate pickFromWeighted. Fix: import weightedPick in reels.ts, delete pickFromWeighted.)
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted random selection algorithm, same fallback, only variable names and type parameter differ

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly samples 3 independent rows per reel; weight array lookup and index alignment are consistent.
- **Overengineering [LEAN]**: Simple three-row column builder. Direct and minimal.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed inside the spin function.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG results.
- **Correction [OK]**: Returns the module-level SYMBOLS array without transformation errors.
- **Overengineering [LEAN]**: One-liner accessor exposing the module-level constant.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed inside the spin function.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG results.
- **Correction [OK]**: Returns the weight array for the requested reel index per documented API contract.
- **Overengineering [LEAN]**: One-liner accessor aligned with the documented API contract.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 Symbol keys. Record<Symbol, number> is more maintainable and automatically stays in sync with the Symbol union. [L6-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutably typed. getReelWeights() returns a direct mutable reference to REEL_WEIGHTS[reelIndex], letting callers silently corrupt internal reel state. getReelSymbols() exposes the live SYMBOLS array the same way. [L3,L12,L22,L55] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all undocumented. At minimum spinReel should document the valid reelIndex range (0–4) and the 3-row return contract. [L44,L51,L55] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel does not validate reelIndex bounds. REEL_WEIGHTS[reelIndex] is undefined for values outside 0–4, causing pickFromWeighted to compute NaN totals and return items[items.length-1] silently every time. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain inferred from reel/symbol/paytable/jackpot/freespin vocabulary across the codebase. Math.random() (L35) is a non-cryptographic, non-auditable PRNG that is explicitly disallowed by major gaming certification bodies (GLI-11, BMM, UKGC). The project already ships src/rng.ts — a dedicated RNG module — which should be the sole RNG source. Using Math.random() here makes the engine uncertifiable under any regulated jurisdiction. [L35] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hard-codes Math.random(), making deterministic unit tests impossible without global mocking. Accepting an RNG function parameter (compatible with src/rng.ts) would enable pure, reproducible tests. [L33-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig to retain literal types while enforcing the interface. SYMBOLS and REEL_WEIGHTS could use as const for readonly literal-type inference. [L3,L12,L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | In a regulated gaming engine, reel weights are a certified configuration value. getReelWeights returning a live mutable array reference allows callers to alter certified weights in place without going through any controlled path. Returning ReadonlyArray<number> closes this gap with zero runtime cost. [L55-L57] |

### Suggestions

- Replace Math.random() with the project's src/rng.ts module to satisfy gaming certification requirements.
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { random } from './rng.js';
  // ...
  const r = random() * total;
  ```
- Use Record<Symbol, number> instead of manually listing every key in ReelWeightConfig.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark all module-level constants as readonly to prevent accidental in-place mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: ReadonlyArray<Symbol> = [...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  ```
- Return ReadonlyArray<number> from getReelWeights to prevent callers from mutating certified reel state.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add bounds validation to spinReel to surface invalid indices immediately rather than silently returning wrong symbols.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues() (or a certified RNG wrapper) to satisfy GLI/BMM gaming-regulator certification requirements for the slot-machine domain. [L32]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to ≈ 8–12 and re-derive total per-payline EV across all symbols to confirm the 95% RTP target. At weight 30 (p=0.25), DIAMOND 3/4/5-of-a-kind outcomes alone contribute ~229% EV per line-bet, exceeding the arbitrated 95% RTP target by more than a factor of 2. [L14]
- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
