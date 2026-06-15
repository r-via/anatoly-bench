[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 4.5/10 | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to avoid manually mirroring the union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark all module-level constants as deeply readonly and return readonly views from exported getters.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...];
export function getReelWeights(reelIndex: number): number[] { return REEL_WEIGHTS[reelIndex]; }`
  - After: `const SYMBOLS: readonly Symbol[] = Object.freeze([...]);
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = Object.freeze({...});
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = Object.freeze([...]);
export function getReelWeights(reelIndex: number): readonly number[] { return REEL_WEIGHTS[reelIndex]; }`
- Inject RNG from `src/rng.ts` instead of calling `Math.random()` directly, enabling deterministic tests and compliance with regulated-gaming RNG requirements.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const r = rng() * total;`
- Add bounds guard in `spinReel` and `getReelWeights` to prevent silent undefined crashes on out-of-range reelIndex.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Add JSDoc to all three exported functions, including the valid reelIndex range.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel and returns 3 symbols.
 * @param reelIndex - Reel column index in [0, 4].
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the already-defined Bet type on both exported functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house-edge multiplier to achieve 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 — raises payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 — applies 5% house edge`
- Mark PAYLINES as deeply readonly
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`
- Remove unused container resolves or wire them through the factory
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<...>("reels");
// ... factory.buildReels(5, 3) used instead`
  - After: `// Either remove rng/reelsModule resolves, or pass rng to factory:
const rng = container.resolve<typeof weightedPick>("rng");
const reels = factory.buildReels(5, 3, rng);`
- Add JSDoc to the primary public export
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given bet amount.
 * @param bet - Integer coin bet in range [1, 100].
 * @returns SpinResult containing reels, line wins, scatter/jackpot state, and total payout.
 * @throws {Error} When bet is non-integer, < 1, or not a number.
 */
export function spin(bet: Bet): SpinResult {`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Freeze PAY_TABLE with as const + satisfies to prevent runtime mutation and narrow the key type
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  // ...
};`
  - After: `type PaySymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;

const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<PaySymbol, readonly [number, number, number]>;`
- Add JSDoc to all three public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/** Certified theoretical return-to-player ratio (95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Maps a (pay symbol, run length) pair to a base multiplier.
 * Returns 0 for WILD, SCATTER, or count outside [3, 5].
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`
- Rename lineWins to checkPayline to avoid collision with SpinResult.lineWins and match architecture docs (engine.ts owns line checking)
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function checkPayline(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to satisfy rule 9 and aid regulated-gaming audit trails.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire 5×3 grid.
 * @param reels - Full reel window (columns × rows).
 * @returns Total number of SCATTER symbols visible.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Return a transition descriptor from `handleFreeSpins` to improve auditability in a regulated gambling context (rule 17).
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `export type FreeSpinTransition = { triggered: boolean; retriggered: boolean; decremented: boolean; deactivated: boolean };

export function handleFreeSpins(state: FreeSpinState, scatters: number): FreeSpinTransition {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with `crypto.getRandomValues()` for a certifiable, uniform random draw.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const arr = new Uint32Array(1);
crypto.getRandomValues(arr);
const roll = (arr[0] / 0x1_0000_0000) * totalWeight;`
- Inject the RNG function for testability and to decouple the PRNG strategy.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 0x1_0000_0000; }
): T {`
- Add a guard for empty or mismatched inputs.
  - Before: `const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `if (items.length === 0 || items.length !== weights.length) {
  throw new RangeError(`weightedPick: items.length (${items.length}) must equal weights.length (${weights.length}) and be > 0`);
}
const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
- Add @param and @returns JSDoc tags.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate items to pick from.
 * @param weights - Non-negative weight for each item; must be the same length as `items`.
 * @param rng - Optional uniform random source in [0, 1). Defaults to `crypto.getRandomValues`.
 * @returns The selected item.
 * @throws {RangeError} If `items` is empty or lengths differ.
 */`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark the input array readonly to prevent accidental mutation and signal intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Use integer-safe arithmetic for regulated-gaming payout to avoid IEEE 754 drift. `bet` is guaranteed an integer (1..100); multiply first, divide last, then round.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Integer-first: avoids floating-point on monetary values
return Math.round(multiplier * bet) / 10;`
- Use the `Bet` type alias defined in the project contract instead of raw `number`.
  - Before: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number`
