[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Use the existing `Bet` type alias instead of `any` on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix house-edge formula: `1 + HOUSE_EDGE` increases payout; use `1 - HOUSE_EDGE` to achieve 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove unused container resolutions for `rng` and `reelsModule` (reels come from factory, not the container)
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Make PAYLINES deeply immutable for safety and literal-type narrowing
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... values unchanged
] as const satisfies readonly (readonly number[])[];`
- Remove the no-op emitter listener registered on every spin call to prevent listener accumulation
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Make module-level constants readonly and return safe copies from accessors
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const REEL_WEIGHTS: number[][] = [...];
export function getReelSymbols(): Symbol[] { return SYMBOLS; }
export function getReelWeights(reelIndex: number): number[] { return REEL_WEIGHTS[reelIndex]; }`
  - After: `const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
const REEL_WEIGHTS: readonly (readonly number[])[] = [...];
export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
export function getReelWeights(reelIndex: number): readonly number[] {
  const w = REEL_WEIGHTS[reelIndex];
  if (!w) throw new RangeError(`reelIndex ${reelIndex} out of range`);
  return w;
}`
- Inject the RNG function to enable deterministic testing and use certifiable PRNG in production
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number = Math.random   // replace with weightedPick from src/rng.ts in production
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use satisfies for DEFAULT_WEIGHTS to retain literal types
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies ReelWeightConfig;`
- Add JSDoc to all public exports
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel column and returns 3 symbols drawn from the weighted distribution.
 * @param reelIndex – column index in [0, 4]
 * @returns Array of 3 Symbol values (top → bottom rows)
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE structurally immutable and key it by the `Symbol` union to catch invalid lookups at compile time
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  ...`
  - After: `type PayableSymbol = Exclude<Symbol, 'WILD' | 'SCATTER'>;

const PAY_TABLE: Readonly<Record<PayableSymbol, readonly [number, number, number]>> = {
  CHERRY: [2, 5, 25],
  ...
} satisfies Record<PayableSymbol, readonly [number, number, number]>;`
- Add JSDoc to all public exports, explaining ANCIENT_RTP naming
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/** Theoretical RTP for the classic ("ancient") reel configuration. Must equal 0.95 per spec. */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the payout multiplier for `symbol` appearing `count` times in a row.
 * Returns 0 for counts below 3 or unknown symbols.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (HIGH)

- Declare `lineSymbols` as readonly to express immutability and prevent accidental mutation.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer arithmetic for payout calculation to avoid floating-point drift in a regulated casino context. Work entirely in coins; avoid fractional lineBet values.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Return value is in coins (integer). Caller divides by 10 if line-stake display is needed.
return Math.round(multiplier * bet) / 10;`
- Add JSDoc with `@deprecated` tag and param/return documentation to the public export.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * @deprecated Use `computePayout` with `LineWin[]` instead.
 * Computes a single payline payout for a left-to-right symbol run.
 * @param lineSymbols - Ordered symbols on one payline (length must be ≥ 1).
 * @param bet - Total bet in coins (1–100 integer, spread across 10 lines).
 * @returns Payout in coins for this line, or 0 if no qualifying run.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
