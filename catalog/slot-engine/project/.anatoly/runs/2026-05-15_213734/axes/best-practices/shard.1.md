[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `bet: any` with the declared `Bet` alias on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the arbitrated maximum bet of 100 (README arbitrated intent)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Make PAYLINES deeply immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // same content
] as const satisfies readonly (readonly number[])[];`
- Remove unused container resolves and the no-op listener
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
...
const reelsModule = container.resolve<...>("reels");
...
emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// remove rng and reelsModule resolves if unused
emitter.emit(SPIN_DONE, finalResult);`
- Add JSDoc to `spin` and use `satisfies` on the result object
  - Before: `export function spin(bet: any): SpinResult {
  ...
  const result: SpinResult = {`
  - After: `/**
 * Runs one full spin: five reels, ten paylines, wild multipliers,
 * scatter/free-spin detection, and jackpot check.
 * @param bet Integer bet (1–100 coins).
 */
export function spin(bet: Bet): SpinResult {
  ...
  const result = {
    ...
  } satisfies SpinResult;`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Derive ReelWeightConfig from the Symbol union via Record to stay in sync with future symbol additions
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark all module-level constants readonly and return copies/readonly views from accessors
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies readonly Symbol[];

const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;

const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];

export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}`
- Replace Math.random() with the project RNG abstraction and inject it for deterministic testing
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from './rng.js';

type RngFn = () => number;

function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: RngFn = nextFloat,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Guard spinReel against out-of-bounds reelIndex
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(
      `reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`
    );
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Mark array params readonly — they are never mutated
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject the RNG source for testability and to decouple from Math.random()
  - Before: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Replace Math.random() with crypto.getRandomValues() for gaming-certifiable RNG
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Add defensive guards for empty array and length mismatch
  - Before: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have the same length');`
