[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the proper `Bet` alias on both exported functions.
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a bare string so callers can use instanceof and get stack traces.
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix the house-edge direction in computePayout to achieve 95% RTP.
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES deeply readonly to prevent accidental mutation.
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly (readonly number[])[] = [`
- Remove the no-op listener (or use it) and drop the unused container resolutions.
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<...>("reels");
// ... (never called)
emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// Remove rng / reelsModule resolves until they are actually wired into buildReels.
// Remove the no-op listener; emit only:
emitter.emit(SPIN_DONE, finalResult);`
- Inject factory, strategy, and emitter so spin() can be unit-tested without side effects.
  - Before: `export function spin(bet: Bet): SpinResult {
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export function spin(
  bet: Bet,
  factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
  strategy: Strategy = new DefaultStrategy(),
  emitter: SpinEventEmitter = new SpinEventEmitter(),
): SpinResult {`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's certified RNG module
  - Before: `const r = Math.random() * total;`
  - After: `import { nextFloat } from './rng.js';
const r = nextFloat() * total;`
- Use Record<Symbol, number> to derive ReelWeightConfig from the Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as readonly and freeze return values
  - Before: `const SYMBOLS: Symbol[] = [...];
export function getReelSymbols(): Symbol[] { return SYMBOLS; }`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }`
- Add bounds guard to spinReel
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/freespin.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports documenting parameters and the side-effect contract.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the full reel grid.
 * @param reels - 2-D array of visible symbols (columns × rows)
 * @returns total visible SCATTER count
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Return a new FreeSpinState instead of mutating the argument to improve testability and support immutable state transitions in a regulated gaming context.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) {
      state.active = false;
    }
  }
}`
  - After: `export function handleFreeSpins(
  state: Readonly<FreeSpinState>,
  scatters: number,
): FreeSpinState {
  if (!state.active && scatters >= 3) {
    return { ...state, active: true, remaining: 10 };
  }
  if (state.active && scatters >= 3) {
    // Retrigger: add 10 spins; current spin is not consumed (per design)
    return { ...state, remaining: state.remaining + 10 };
  }
  if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/jackpot.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to document the jackpot trigger condition, parameter contract, and informational-only semantics (the engine does not auto-apply a prize).
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns `true` when four or more `DIAMOND` symbols appear anywhere across
 * the 5 × 3 reel grid in a single spin.
 *
 * **Note:** this flag is informational only. The engine does not add a
 * separate jackpot payout to `totalPayout`; callers must apply the
 * progressive prize when `jackpotHit` is `true`.
 *
 * @param reels - Column-major reel grid (5 reels × 3 rows).
 * @returns `true` if the jackpot condition is met, `false` otherwise.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x100000000) * totalWeight;`
- Inject the PRNG as a parameter for testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = cryptoRng): T {`
- Add readonly to parameters and guard against empty input
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0 || items.length !== weights.length) throw new Error('items and weights must be non-empty arrays of equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
- Add @param and @returns to JSDoc
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Array of candidates to pick from.
 * @param weights - Parallel array of non-negative weights.
 * @returns The selected item.
 */`
