[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Use the `Bet` type, enforce the upper bound per the arbitrated contract, and throw an Error instead of a string.
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== 'number' || bet < 1 || !Number.isInteger(bet)) {
    throw 'invalid bet';
  }
  if (bet > 100) console.warn('bet exceeds maximum');`
  - After: `export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new Error(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);
  }`
- Make PAYLINES deeply readonly to prevent accidental mutation.
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly [number, number, number, number, number]> = [`
- Inject factory, strategy, and emitter through the container so spin() is unit-testable without module mocking.
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `const factory = container.resolve<StandardReelBuilderFactory>('factory');
const strategy = container.resolve<DefaultStrategy>('strategy');
const emitter = container.resolve<SpinEventEmitter>('emitter');`
- Remove unused `rng` and `reelsModule` container resolutions, or thread `rng` into the factory so the DI registration has effect.
  - Before: `const rng = container.resolve<typeof weightedPick>('rng');
// ...
const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>('reels');
// ...
const reels = factory.buildReels(5, 3);`
  - After: `const rng = container.resolve<typeof weightedPick>('rng');
// ...
const reels = factory.buildReels(5, 3, rng);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay in sync with Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Inject RNG from src/rng.ts instead of calling Math.random() directly — required for certified gaming compliance
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
- Guard spinReel against out-of-bounds reelIndex
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Add readonly annotations to module-level constants and return readonly views from getReelWeights
  - Before: `const SYMBOLS: Symbol[] = [...];
const REEL_WEIGHTS: number[][] = [...];
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Use satisfies for DEFAULT_WEIGHTS to retain literal types while enforcing shape
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/freespin.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make handleFreeSpins pure and surface the awarded count, eliminating the void/mutation pattern and making SpinResult.freeSpinsAwarded trivially derivable.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) state.active = false;
  }
}`
  - After: `export function handleFreeSpins(
  state: Readonly<FreeSpinState>,
  scatters: number
): { next: FreeSpinState; spinsAwarded: number } {
  if (!state.active && scatters >= 3) {
    return { next: { ...state, active: true, remaining: 10 }, spinsAwarded: 10 };
  }
  if (state.active && scatters >= 3) {
    return { next: { ...state, remaining: state.remaining + 10 }, spinsAwarded: 10 };
  }
  if (state.active) {
    const remaining = state.remaining - 1;
    return { next: { ...state, remaining, active: remaining > 0 }, spinsAwarded: 0 };
  }
  return { next: state, spinsAwarded: 0 };
}`
- Add JSDoc to both public exports documenting parameters, side-effects, and return values.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire reel grid.
 * @param reels - Full reel window (e.g. 5 columns × 3 rows).
 * @returns Total SCATTER count regardless of position.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with `crypto.getRandomValues` for certifiable gaming RNG, and inject the random source for testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
}

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRandom,
): T {
  if (items.length === 0) throw new RangeError('items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('items and weights length mismatch');
  const roll = rng() * totalWeight;`
- Mark array parameters readonly to enforce immutability at the call site.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Add @param and @returns JSDoc tags to the public export.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Selects one item from `items` proportionally to its corresponding `weights` entry.
 * @param items - Candidate items to pick from (must be non-empty).
 * @param weights - Positive numeric weights parallel to `items`.
 * @param rng - Optional random source; defaults to a CSPRNG wrapper.
 * @returns The selected item.
 * @throws {RangeError} If `items` is empty or lengths differ.
 */`
