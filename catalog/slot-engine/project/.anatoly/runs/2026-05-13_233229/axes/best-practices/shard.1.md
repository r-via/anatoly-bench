[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.75/10 | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.25/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Use the `Bet` type instead of `any` on both public function signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object to preserve stack traces and support instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);`
- Enforce the upper-bound constraint from the arbitrated intent (1..100 coins)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`Bet ${bet} exceeds maximum of 100.`);`
- Fix inverted house-edge formula to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 — increases payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 — applies 5% house edge`
- Make PAYLINES immutable with as const satisfies
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Register the SPIN_DONE listener once at module level, not inside spin()
  - Before: `// inside spin():
emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// module level:
const emitter = new SpinEventEmitter();
// inside spin():
emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's rng.ts module and inject it for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> to derive ReelWeightConfig from the Symbol union automatically
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark SYMBOLS and REEL_WEIGHTS as readonly to prevent accidental mutation
  - Before: `const SYMBOLS: Symbol[] = [ ... ];
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS: readonly Symbol[] = [ ... ] as const;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Return a readonly copy from getReelWeights to prevent external corruption of weight tables
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length)
    throw new RangeError(`reelIndex ${reelIndex} out of range`);
  return REEL_WEIGHTS[reelIndex];
}`
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types while enforcing the config shape
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, ...}`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, ...} satisfies ReelWeightConfig;`

### `src/freespin.ts` — 8.75/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts the total number of SCATTER symbols across all reels.
 * @param reels - The visible reel window after a spin.
 * @returns Total scatter count.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Extract regulated-gaming magic numbers to named constants for auditability
  - Before: `if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const SCATTER_TRIGGER_COUNT = 3;
const FREE_SPINS_INITIAL = 10;
const FREE_SPINS_RETRIGGER = 10;

// …
if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    state.active = true;
    state.remaining = FREE_SPINS_INITIAL;
  } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    state.remaining += FREE_SPINS_RETRIGGER;`
- Make handleFreeSpins a pure function to improve testability and immutability
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // mutates state in-place
}`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    return { ...state, active: true, remaining: FREE_SPINS_INITIAL };
  } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    return { ...state, remaining: state.remaining + FREE_SPINS_RETRIGGER };
  } else if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/jackpot.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to isJackpotHit documenting the 4-diamond scatter rule, parameter, and return value
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns true when at least {@link JACKPOT_THRESHOLD} DIAMOND symbols appear
 * anywhere across all reels (scatter jackpot condition).
 * @param reels - Resolved reel grid after a spin.
 * @returns true if the jackpot condition is met.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
- Extract gambling-critical magic literals as named readonly constants for auditability and traceability to the math spec
  - Before: `  if (sym === "DIAMOND") diamondCount++;
    }
  }
  return diamondCount >= 4;`
  - After: `const JACKPOT_SYMBOL = "DIAMOND" as const;
const JACKPOT_THRESHOLD = 4 as const;

// inside the loop:
  if (sym === JACKPOT_SYMBOL) diamondCount++;
    }
  }
  return diamondCount >= JACKPOT_THRESHOLD;`

### `src/legacy.ts` — 7.25/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark `lineSymbols` as readonly to enforce immutability at call sites.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace float division with integer arithmetic. Compute in coins, divide only when producing the final display value or keep as integer coins throughout.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const LINE_COUNT = 10;
// arithmetic in integer coins; caller converts to display units
const lineBetCoins = Math.floor(bet / LINE_COUNT);
return multiplier * lineBetCoins;`
- Name magic constants for auditability in regulated gambling code.
  - Before: `if (matchCount < 3) return 0;`
  - After: `const MIN_MATCH = 3;
if (matchCount < MIN_MATCH) return 0;`
- Add JSDoc with @deprecated and parameter contracts.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes a single payline payout using the v1 matching algorithm.
 * @deprecated Use `engine.ts` payout resolution instead.
 * @param lineSymbols Symbols on one payline (left-to-right).
 * @param bet Total bet in coins (1–100, integer). Assumes 10 active lines.
 * @returns Payout in coins (integer).
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace Math.random() with an injectable RNG parameter to enable deterministic tests and allow substituting a certified PRNG.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add input validation guards for mismatched lengths, empty arrays, and non-positive weights.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  if (weights.some(w => w <= 0)) throw new RangeError('weightedPick: all weights must be positive');`
- Use a certified PRNG (e.g. a seeded AES-CTR or WELL512 implementation auditable under GLI-11) instead of Math.random() for regulated gaming compliance.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `// inject a certifiable RNG: e.g. CertifiedRng.nextFloat() from your compliance library
const roll = rng() * totalWeight;`
