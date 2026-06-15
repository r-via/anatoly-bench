[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 15: Testability (MEDIUM)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` on `bet` with the `Bet` type alias already defined in this file
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix computePayout house-edge direction — current code inflates payout by 5% (RTP > 100%); arbitrated intent requires 95% RTP
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE);
}`
  - After: `if (total > 0) {
  total = total * (1 - HOUSE_EDGE); // 0.95 → ~95% RTP
}`
- Throw an Error instance to preserve stack traces and enable instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the accumulating no-op listener; emit directly or let callers register their own handlers
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Make PAYLINES readonly to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Accept factory and strategy as defaulted parameters to enable unit-test injection
  - Before: `export function spin(bet: any): SpinResult {
  // ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export function spin(
  bet: Bet,
  factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
  strategy: SpinStrategy = new DefaultStrategy(),
): SpinResult {`
- Remove dead container registration and resolution of reelsModule — it is resolved (L105) but never consumed; reels are built via factory.buildReels instead
  - Before: `container.register("reels", { getReelSymbols, getReelWeights });
// ...
const reelsModule = container.resolve<...>("reels");`
  - After: `// delete both lines — reelsModule is unused`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Enforce immutability on all module-level constants and return a readonly type from getReelWeights
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}`
- Replace Math.random() with the project's dedicated RNG module for certifiable, auditable randomness
  - Before: `const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js";
const r = nextFloat() * total;`
- Add bounds-check to spinReel and JSDoc to all exports
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `/**
 * Spins a single reel and returns 3 random symbols.
 * @param reelIndex - Reel column index, 0–4
 * @throws {RangeError} if reelIndex is out of bounds
 */
export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG and inject the RNG for testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRandom,
): T {
  if (items.length === 0) throw new RangeError('items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new RangeError('totalWeight must be positive');
  const roll = rng() * totalWeight;`
- Add @param and @returns tags to JSDoc
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate items to select from.
 * @param weights - Parallel non-negative weights; must match `items` length.
 * @param rng - Optional RNG source; defaults to `crypto.getRandomValues`-based draw.
 * @returns The selected item.
 * @throws {RangeError} When arrays are empty, lengths differ, or total weight is non-positive.
 */`
