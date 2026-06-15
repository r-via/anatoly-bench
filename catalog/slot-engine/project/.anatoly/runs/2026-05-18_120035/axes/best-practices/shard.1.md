[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `any` with typed `Bet` on both exported functions to satisfy the arbitrated contract
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number {
export function spin(bet: any): SpinResult {`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number {
export function spin(bet: Bet): SpinResult {`
- Throw Error instances instead of string literals to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES deeply readonly with as const
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Remove the unused reelsModule resolution or wire it into the factory
  - Before: `const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `// Remove entirely if factory.buildReels() is the sole reel source;
// or pass reelsModule into factory constructor to actually use the DI registration.`
- Remove the no-op event listener or provide a real handler
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// Register a meaningful listener externally, or remove the on() call:
emitter.emit(SPIN_DONE, finalResult);`
- Add JSDoc to spin()
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Runs one full spin: builds five reels, evaluates ten paylines, applies wild
 * multipliers, detects scatter free-spins, and checks the progressive jackpot.
 * @param bet - Integer coin bet in range 1–100.
 * @throws {Error} When bet is non-integer or < 1.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Mark all module-level constants readonly and use `as const` + `satisfies` to catch weight-key drift at compile time.
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
const REEL_WEIGHTS: number[][] = [...];`
  - After: `const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const satisfies readonly Symbol[];
const DEFAULT_WEIGHTS = { CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10, SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5 } as const satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];`
- Inject an RNG function so `spinReel` is testable and certifiable, using `src/rng.ts` instead of `Math.random()`.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `type RngFn = () => number;

function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: RngFn): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Guard out-of-bounds `reelIndex` in `spinReel` and return a readonly copy from `getReelWeights`.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number, rng: RngFn = Math.random): readonly Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];
  if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);`
- Use `Record<Symbol, number>` for `ReelWeightConfig` so it stays in sync with the `Symbol` union automatically.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Pre-compute total weight to avoid redundant `reduce` on every draw.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);`
  - After: `const TOTAL_WEIGHT = weightsToArray(DEFAULT_WEIGHTS).reduce((s, w) => s + w, 0);

function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], total: number, rng: RngFn): Symbol {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use a CSPRNG instead of Math.random() for regulated gaming RNG
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Inject random source for testability and replace direct Math.random() call
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: ReadonlyArray<T>,
  weights: ReadonlyArray<number>,
  random: () => number = () => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] / 0x1_0000_0000; }
): T {`
- Add guard clauses for empty or mismatched inputs
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
- Add @param and @returns JSDoc tags to the exported function
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate items to pick from.
 * @param weights - Positive weights parallel to items; higher weight = more frequent.
 * @returns The selected item.
 * @throws {RangeError} If items is empty or lengths mismatch.
 */`
