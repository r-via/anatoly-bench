[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcstrategyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (HIGH)

- Replace any with the Bet alias already defined in this file
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object to preserve stack trace and allow instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix house-edge direction to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Enforce the upper-bound Bet invariant with a hard throw instead of a warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Mark PAYLINES as a readonly nested array to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`
- Remove unused container.resolve calls for rng and reelsModule
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Remove the no-op listener that accumulates on every spin
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace manual ReelWeightConfig with Record utility type
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<SlotSymbol, number>;`
- Mark SYMBOLS and DEFAULT_WEIGHTS as readonly/const-asserted
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };`
  - After: `const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const;
const DEFAULT_WEIGHTS = { CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10, SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5 } satisfies ReelWeightConfig;`
- Inject RNG into pickFromWeighted instead of calling Math.random() directly
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextRandom } from "./rng.js";

function pickFromWeighted(items: SlotSymbol[], wts: number[], rng: () => number = nextRandom): SlotSymbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Return readonly views from getReelWeights and getReelSymbols
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}
export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}`);
  return REEL_WEIGHTS[reelIndex];
}
export function getReelSymbols(): ReadonlyArray<SlotSymbol> {
  return SYMBOLS;
}`
- Add JSDoc to exported functions
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel and returns a column of 3 symbols.
 * @param reelIndex - Reel index in range [0, 4].
 * @returns Array of 3 symbols drawn from the weighted distribution.
 */
export function spinReel(reelIndex: number): SlotSymbol[] {`

### `src/strategy.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark `result` parameters as `Readonly<SpinResult>` to enforce the immutability contract at the method boundary.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Add JSDoc to all three exported symbols, documenting RTP impact — critical in a regulated gaming context.
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {`
  - After: `/**
 * Reduces total payout to 80 % of the computed value.
 * NOTE: applying this strategy lowers the effective RTP below the engine's
 * stated 95 % target. Use only in contexts where a reduced RTP is intentional.
 */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: Readonly<SpinResult>): SpinResult {`
- Clamp returned payout to non-negative to guard against upstream malformed results in the casino domain.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.max(0, Math.floor(result.totalPayout * 0.8)),`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() to satisfy regulated gaming RNG requirements and fix the critical security violation.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const array = new Uint32Array(1);
crypto.getRandomValues(array);
const roll = (array[0] / 0x100000000) * totalWeight;`
- Inject the RNG as a parameter to make the function deterministically testable.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: ReadonlyArray<T>,
  weights: ReadonlyArray<number>,
  rng: () => number = defaultCryptoRng,
): T {`
- Add input guards to prevent silent failures on empty or mismatched arrays.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {
  if (items.length === 0) throw new RangeError('weightedPick: items array must not be empty');
  if (items.length !== weights.length) throw new RangeError(`weightedPick: items (${items.length}) and weights (${weights.length}) length mismatch`);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
- Add @param and @returns JSDoc tags to the exported function.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate values to pick from.
 * @param weights - Non-negative weights parallel to `items`; higher weight increases probability.
 * @returns A randomly selected item proportional to its weight.
 * @throws {RangeError} If arrays are empty or have mismatched lengths.
 */`
