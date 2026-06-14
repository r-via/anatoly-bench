[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 4.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 15: Testability (MEDIUM)
- Rule 17: Context-adapted rules (HIGH)

- Replace any with the already-defined Bet type on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house-edge formula to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object so callers get instanceof checks and stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES immutable with as const + satisfies
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies readonly (readonly number[])[];`
- Remove no-op listener registered every spin; emit directly
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Either remove unused container.resolve('rng'/'reels') calls or thread them into factory so the injectable RNG is actually exercised
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<...>("reels");
// both are never referenced below`
  - After: `// Pass rng to factory constructor so the DI path is actually used:
const rng = container.resolve<typeof weightedPick>("rng");
const factory = new StandardReelBuilderFactory(rng);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable CSPRNG for certified gaming RNG compliance
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(
  items: Symbol[],
  wts: number[],
  rng: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> and as const to eliminate manual enumeration and improve immutability
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}

const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies Record<Symbol, number>;`
- Return ReadonlyArray to enforce the documented read-only-at-runtime contract
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  return REEL_WEIGHTS[reelIndex];
}`
- Add bounds guard to spinReel to prevent silent TypeError on invalid reelIndex
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Use `as const` on PAY_TABLE to get literal tuple types and prevent mutation
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  // ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<string, [number, number, number]>;`
- Name the anonymous return type of lineWins and move it to types.ts
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `// in types.ts
export interface LineWin { symbol: Symbol; count: number; }

// in paytable.ts
export function lineWins(symbols: Symbol[]): LineWin | null {`
- Add JSDoc to all public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {
export function lineWins(symbols: Symbol[]): ...`
  - After: `/** Theoretical Return-to-Player target (95%). Used by the engine for RTP validation. */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the base payout multiplier for a (symbol, run-length) pair.
 * Returns 0 for WILD, SCATTER, or runs shorter than 3.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/**
 * Evaluates a 5-symbol payline left-to-right, respecting WILD substitution.
 * Returns the matching symbol and run count, or null if no win (< 3 matches).
 */
export function lineWins(symbols: Symbol[]): LineWin | null {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Inject the random source for testability and lay groundwork for a certifiable RNG swap
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Add readonly to parameters to document non-mutation and catch accidental writes
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Guard empty-array and length-mismatch invariants
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');`
- Replace Math.random() with a certifiable PRNG (e.g., a CSPRNG wrapper) for regulated gaming compliance
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `// Use a GLI-11-certified RNG adapter instead of Math.random()
const roll = certifiedRng.nextFloat() * totalWeight;`

### `src/legacy.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark the parameter readonly to signal non-mutation intent
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Add JSDoc for the exported function
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the legacy line payout for a given symbol run and total bet.
 * @param lineSymbols - Left-to-right symbols on one pay line.
 * @param bet - Total bet in coins (1–100 integer).
 * @returns Coin payout for this line; 0 if no qualifying run of 3+.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace magic number 10 with a named constant and use integer-cent arithmetic to avoid float drift in regulated gambling payouts
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const LINE_COUNT = 10;
const lineBetCents = Math.round((bet / LINE_COUNT) * 100); // integer cents
return Math.round(multiplier * lineBetCents) / 100;`
