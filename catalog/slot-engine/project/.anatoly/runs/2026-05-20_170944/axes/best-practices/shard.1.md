[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `bet: any` with the already-defined `Bet` alias on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house edge to achieve 95% RTP as documented
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error instance so callers can use e.message and instanceof
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES deeply immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Remove the two unused container resolutions
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace ReelWeightConfig interface with Record<Symbol, number> to avoid manual sync with the Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark all module-level constants as readonly and use satisfies for DEFAULT_WEIGHTS
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]`
- Inject the RNG to satisfy testability and regulated-gaming compliance
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Return ReadonlyArray from public accessors and add bounds-check to prevent silent undefined
  - Before: `export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelSymbols(): readonly Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  return REEL_WEIGHTS[reelIndex];
}`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG and accept an injectable rng parameter for testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: ReadonlyArray<T>,
  weights: ReadonlyArray<number>,
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
): T {
  const roll = rng() * totalWeight;`
- Guard against mismatched or empty arrays to prevent silent undefined returns.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');`
- Use ReadonlyArray for both parameters to signal non-mutation at the call site.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark the input array as readonly to communicate non-mutation intent and allow callers to pass ReadonlyArray without a cast.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point per-line bet with integer arithmetic to avoid IEEE 754 rounding in payout results.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Work in integer coins: multiply first, divide last to avoid fractional imprecision
return Math.round(multiplier * bet) / 10;`
- Add JSDoc to document parameters, the WILD substitution rule, and the minimum-3-match requirement.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the line payout using legacy sequential-match rules.
 * WILDs at index 0 are substituted by the first non-WILD symbol;
 * a WILD-only or SCATTER-leading line returns 0.
 * Requires ≥ 3 consecutive matches (WILDs included) from the left.
 *
 * @param lineSymbols - Ordered symbols on a pay line (left to right).
 * @param bet - Total bet in coins (1–100 integer).
 * @returns Payout in coins, or 0 for no win.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
