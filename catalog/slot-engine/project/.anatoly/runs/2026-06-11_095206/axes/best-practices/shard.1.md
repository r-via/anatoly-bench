[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Replace `any` with the exported `Bet` type on both public function signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance to preserve stack trace and support instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError("invalid bet: must be an integer between 1 and 100");`
- Enforce the upper bet bound instead of warning past it
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new RangeError("bet exceeds maximum: must be <= 100");`
- Fix house-edge direction to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05, increasing payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95, applying 5% house cut`
- Mark PAYLINES as readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly number[][] = [`
- Register and resolve factory, strategy, and emitter via EngineContainer for testability
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `const factory = container.resolve<StandardReelBuilderFactory>("factory");
const strategy = container.resolve<DefaultStrategy>("strategy");
const emitter = container.resolve<SpinEventEmitter>("emitter");`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's src/rng.ts and accept it as an injectable parameter for testability and compliance
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> instead of manually mirroring the Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Return ReadonlyArray from getReelWeights and mark module-level constants as readonly to honour the documented read-only contract
  - Before: `const SYMBOLS: Symbol[] = [...];
const REEL_WEIGHTS: number[][] = [...];
export function getReelWeights(reelIndex: number): number[] { ... }`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
export function getReelWeights(reelIndex: number): ReadonlyArray<number> { ... }`
- Add reelIndex bounds guard to spinReel and getReelWeights
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use satisfies for DEFAULT_WEIGHTS to get compile-time shape validation
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues for regulated gaming compliance
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Accept an injectable RNG function to enable deterministic testing and swappable CSPRNG
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  },
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add input guards to prevent type-unsound returns on empty or mismatched arrays
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');`

### `src/legacy.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Use readonly for the lineSymbols parameter to signal immutability and allow callers to pass ReadonlyArray values without a cast.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use the canonical Bet type alias and keep arithmetic in integer coins to avoid IEEE 754 imprecision in payout results.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Work in integer coins; divide only at the callsite for display
const payoutCoins = multiplier * bet;
return payoutCoins / LINES_COUNT; // LINES_COUNT = 10, exported from config`
- Replace magic numbers with named constants.
  - Before: `if (matchCount < 3) return 0;
...
const lineBet = bet / 10;`
  - After: `const MIN_MATCH = 3;
const LINE_COUNT = 10;
if (matchCount < MIN_MATCH) return 0;
...
const lineBet = bet / LINE_COUNT;`
- Add JSDoc to document intent, parameters, and the legacy-vs-current distinction.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single pay-line using the pre-v2 rule set.
 * WILDs substitute for the first non-WILD symbol; SCATTERs and all-WILD lines return 0.
 * @param lineSymbols - Ordered symbols on the evaluated pay-line (left to right).
 * @param bet - Total bet in coins (1–100 integer, per {@link Bet}).
 * @returns Payout in coins, or 0 if no qualifying run is found.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number {`
