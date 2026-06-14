[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Apply the existing `Bet` type alias to both public exports instead of `any`
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw Error instances to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house-edge formula to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES immutable with as const satisfies
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Guard EngineContainer.resolve against missing keys
  - Before: `resolve<T>(key: string): T {
  return this.registry.get(key) as T;
}`
  - After: `resolve<T>(key: string): T {
  const value = this.registry.get(key);
  if (value === undefined) throw new Error(`Service '${key}' not registered`);
  return value as T;
}`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's dedicated RNG module and inject it for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js";

function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = nextFloat): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add bounds validation in spinReel/getReelWeights to prevent undefined-access TypeError
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use Record<Symbol, number> and readonly to tighten types and prevent mutation
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}

const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `type ReelWeightConfig = Record<Symbol, number>;

const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies ReelWeightConfig;

const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Return ReadonlyArray<number> from getReelWeights to enforce the read-only contract documented in the reference docs
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to document the mutation contract and retrigger semantics.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts all SCATTER symbols across the entire reel grid (not confined to paylines).
 * @param reels - 5×3 reel grid to inspect.
 * @returns Total number of SCATTER symbols found.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc to `handleFreeSpins` documenting mutation-in-place behaviour and retrigger rule.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates `state` in place according to scatter count:
 * - Not active + ≥3 scatters → activates, sets `remaining = 10`.
 * - Active + ≥3 scatters → adds 10 to `remaining` (retrigger).
 * - Active + <3 scatters → decrements `remaining`; deactivates at 0.
 * @param state - Persistent free-spin state object shared across spins.
 * @param scatters - Scatter count from the current spin (`SpinResult.scatterCount`).
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/rng.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() for certifiable regulated-gaming RNG
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x100000000) * totalWeight;`
- Inject the RNG function to enable deterministic testing
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRandom,
): T {`
- Guard against empty or mismatched inputs and use readonly params
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError(`weightedPick: items.length (${items.length}) must equal weights.length (${weights.length}) and be > 0`);
  }`
- Add @param and @returns JSDoc tags
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Array of items to select from.
 * @param weights - Parallel non-negative weights; must be the same length as items.
 * @returns A single item sampled proportionally to its weight.
 * @throws {RangeError} When arrays are empty or have mismatched lengths.
 */`
