[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Apply the declared Bet alias instead of any on both exported functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house-edge: multiply by (1 - HOUSE_EDGE) to reduce payout to 95% RTP, not increase it
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object so callers can instanceof-check and capture stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable and use satisfies for row-index type safety
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  // ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly (readonly (0 | 1 | 2)[])[];`
- Remove unused container resolutions (rng, reelsModule) or wire them into the spin logic
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");
// rng and reelsModule removed — unused`
- Accept factory, strategy, and emitter as optional parameters to enable test injection
  - Before: `export function spin(bet: Bet): SpinResult {
  // ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export function spin(
  bet: Bet,
  factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
  strategy: SpinStrategy = new DefaultStrategy(),
  emitter: SpinEventEmitter = new SpinEventEmitter(),
): SpinResult {`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's rng.ts module and make RNG injectable for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add readonly annotations to all module-level constants and the interface
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}

const SYMBOLS: Symbol[] = [ ... ];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `interface ReelWeightConfig {
  readonly CHERRY: number; readonly LEMON: number; readonly BELL: number; readonly BAR: number;
  readonly SEVEN: number; readonly DIAMOND: number; readonly WILD: number; readonly SCATTER: number;
}

const SYMBOLS: readonly Symbol[] = [ ... ];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Return a copy (or readonly type) from getReelWeights to prevent external mutation of internal state
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  return REEL_WEIGHTS[reelIndex];
}`
- Add bounds guard to spinReel to prevent undefined-dereference crash
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to document parameters, return values, and side effects.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire reel grid.
 * @param reels - 5×3 reel grid (column-major)
 * @returns Total number of SCATTER symbols visible
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc to handleFreeSpins documenting the state mutation contract.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates FreeSpinState in place based on scatter count.
 * Activates free spins on ≥3 scatters, adds 10 on retrigger,
 * or decrements remaining and deactivates when exhausted.
 * @param state - Persistent free spin state object (mutated in place)
 * @param scatters - Number of SCATTER symbols from the current spin
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
- Rename the Symbol import to avoid shadowing the built-in Symbol global.
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, Symbol as SlotSymbol } from "./types.js";`
- Extract the magic number 10 into a named constant to avoid duplication and improve readability.
  - Before: `state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const FREE_SPINS_AWARD = 10 as const;
// ...
state.remaining = FREE_SPINS_AWARD;
  } else if (state.active && scatters >= 3) {
    state.remaining += FREE_SPINS_AWARD;`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with an injectable CSPRNG to satisfy both gaming compliance and testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = secureDraw,
): T {
  const roll = random() * totalWeight;
}

/** Compliant draw: uniform float in [0, 1) via crypto.getRandomValues */
function secureDraw(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
}`
- Add `readonly` to both parameters to enforce immutability at the call-site
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Expand JSDoc with @param and @returns tags for machine-readable API documentation
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Uses a cumulative-weight approach with a single random draw.
 *
 * @param items - Candidate values; must be non-empty.
 * @param weights - Non-negative weights parallel to `items`; must sum > 0.
 * @param random - Optional entropy source; defaults to `secureDraw` (CSPRNG).
 * @returns The selected item.
 */`
