[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.75/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Use the exported Bet type instead of any in both public signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the 100-coin ceiling per the arbitrated contract
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet must not exceed 100");`
- Make PAYLINES deeply readonly using as const
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  // ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const;`
- Remove or wire the unused container resolutions into the factory/strategy
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");

const factory = new StandardReelBuilderFactory();`
  - After: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
// Pass rng to factory so the certified RNG drives reel generation
const factory = container.resolve<StandardReelBuilderFactory>("factory");`
- Add JSDoc to spin() and the Bet type alias
  - Before: `export type Bet = number;

export function spin(bet: any): SpinResult {`
  - After: `/** Integer coin bet in range [1, 100]. */
export type Bet = number;

/**
 * Executes one full spin across 5 reels, evaluates 10 paylines,
 * applies wild multipliers, detects scatters and jackpot.
 * @param bet - Integer coin bet in [1, 100].
 * @throws {Error} When bet is not a positive integer or exceeds 100.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3.75/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 13: Security (CRITICAL)

- Inject an RNG function into pickFromWeighted (and by extension spinReel) to use src/rng.ts and enable deterministic tests.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], random: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = random() * total;`
- Guard against out-of-bounds reelIndex in spinReel and getReelWeights.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Annotate module-level constants as readonly and return readonly types from getters.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];
export function getReelSymbols(): Symbol[] { return SYMBOLS; }
export function getReelWeights(reelIndex: number): number[] { return REEL_WEIGHTS[reelIndex]; }`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
export function getReelWeights(reelIndex: number): readonly number[] { return REEL_WEIGHTS[reelIndex]; }`
- Replace manual interface with Record utility type so adding a new Symbol automatically requires a weight entry.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types while still validating shape.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)

- Replace loose Record<string,> annotation with satisfies for key-safety and tuple immutability
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25] as const,
  LEMON:   [2,   5,   25] as const,
  BELL:    [5,   20,  100] as const,
  BAR:     [10,  40,  200] as const,
  SEVEN:   [25,  100, 500] as const,
  DIAMOND: [50,  250, 1000] as const,
} satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Rename ANCIENT_RTP to remove ambiguity about it being legacy
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `/** Theoretical return-to-player ratio for this pay table (95%). */
export const TARGET_RTP = 0.95;`
- Add JSDoc to all three public exports
  - Before: `export function getPayMultiplier(symbol: Symbol, count: number): number {
export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `/**
 * Returns the pay multiplier for `symbol` matched `count` consecutive times.
 * Returns 0 for runs shorter than 3 or symbols absent from the pay table.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/**
 * Evaluates a single payline left-to-right and returns the leading symbol
 * and consecutive match count, or null if no qualifying run (≥ 3) is found.
 */
export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`

### `src/freespin.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts all SCATTER symbols across the entire reel grid.
 * @param reels - 2D array of reel columns, each containing row symbols
 * @returns total SCATTER count
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Return new FreeSpinState instead of mutating to satisfy immutability and improve testability
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) {
      state.active = false;
    }
  }
}`
  - After: `export function handleFreeSpins(state: FreeSpinState, scatters: number): FreeSpinState {
  if (!state.active && scatters >= 3) {
    return { ...state, active: true, remaining: 10 };
  } else if (state.active && scatters >= 3) {
    return { ...state, remaining: state.remaining + 10 };
  } else if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable RNG for compliance and testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random
): T {
  const roll = rng() * totalWeight;`
- Add readonly to parameters and input-validation guards
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError(`weightedPick: items(${items.length}) and weights(${weights.length}) must be non-empty and equal length`);
  }`
- Add @param and @returns to JSDoc
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Non-empty array of candidate values.
 * @param weights - Positive weights parallel to items.
 * @param rng - Optional uniform random source in [0, 1); defaults to Math.random.
 * @returns The selected item.
 */`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Accept readonly array to match engine output type and signal non-mutation intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer-safe arithmetic to avoid floating-point payout errors in the regulated gambling domain.
  - Before: `const multiplier = getPayMultiplier(first, matchCount);
const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const multiplier = getPayMultiplier(first, matchCount);
// Compute in integer units (×10) to avoid IEEE 754 drift
return Math.round(multiplier * bet) / 10;`
- Add JSDoc documenting legacy behavior (wild multiplier absent) and parameter contract.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Legacy payline payout — no wild multiplier bonus applied.
 * @param lineSymbols Symbols for one evaluated payline, left-to-right.
 * @param bet Total bet in credits (integer 1–100); line bet is bet/10.
 * @returns Payout in credits, or 0 for fewer than 3 consecutive matches.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
