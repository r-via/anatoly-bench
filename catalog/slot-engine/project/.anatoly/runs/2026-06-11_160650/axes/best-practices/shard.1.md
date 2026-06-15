[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Apply Bet type to public function signatures instead of any
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object, not a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house edge — reduce payout, not inflate it
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Enforce bet upper-bound with a throw instead of a silent warn
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Make PAYLINES immutable with as const
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [`
- Remove unused container-resolved variables
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to auto-enforce completeness when the Symbol union changes.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants and interface fields readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];

export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Route all RNG calls through `src/rng.ts` to satisfy regulated gaming RNG requirements and enable testability via injection.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js";

function pickFromWeighted(items: Symbol[], wts: readonly number[], rng: () => number = nextFloat): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add reelIndex bounds guard in `spinReel` to avoid silent NaN bias.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use `satisfies` for `DEFAULT_WEIGHTS` to get exhaustiveness checking at declaration site.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, ...
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies ReelWeightConfig;`

### `src/rng.ts` — 5.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG-backed draw to satisfy regulated gaming RNG requirements, and inject the RNG for testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRandom,
): T {
  if (items.length === 0) throw new RangeError('items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;

/** Returns a uniform random float in [0, 1) using the Web Crypto API. */
function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
}`
- Mark array parameters readonly to express non-mutation intent.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Use integer arithmetic to avoid floating-point payout imprecision in regulated gambling context
  - Before: `const multiplier = getPayMultiplier(first, matchCount);
const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const multiplier = getPayMultiplier(first, matchCount);
// Keep integer coins throughout; divide once at the end
return Math.round(multiplier * bet) / LINES_COUNT;`
- Mark the input array readonly and name the magic divisor
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `const LINES_COUNT = 10;

/** Compute legacy line payout. `bet` must be a 1–100 integer (coins). Returns coins won. */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
