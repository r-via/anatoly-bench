[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 6.5/10 | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 5: Immutability (MEDIUM)
- Rule 8: ESLint compliance (HIGH)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (Casino/Gaming) (CRITICAL)

- Replace `any` on `bet` with `number` and throw a proper Error
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== 'number' || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }`
  - After: `export function spin(bet: number): SpinResult {
  if (bet < 1 || !Number.isInteger(bet)) {
    throw new Error(`invalid bet: ${bet}`);
  }`
- Fix house-edge direction — house edge must reduce payout, not inflate it
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE);
}`
  - After: `if (total > 0) {
  total = total * (1 - HOUSE_EDGE);
}`
- Make PAYLINES immutable with `as const satisfies`
  - Before: `const PAYLINES: number[][] = [...]`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly (readonly number[])[];`
- Type-safe EngineContainer to eliminate unsafe `as T` cast
  - Before: `resolve<T>(key: string): T {
  return this.registry.get(key) as T;
}`
  - After: `resolve<T>(key: string): T {
  const value = this.registry.get(key);
  if (value === undefined) throw new Error(`No binding for key: ${key}`);
  return value as T; // narrowed: at least confirmed present
}`
- Hoist per-spin allocations out of `spin()` to avoid per-call construction
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `// module-level singletons
const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
- Remove the no-op listener registration that leaks on every spin
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace ReelWeightConfig interface with Record<Symbol, number> — DRY and auto-syncs with Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Add readonly to all module-level constants to prevent mutation
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]`
- Inject an RNG function to enable the certified PRNG from rng.ts and allow deterministic testing
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;
}
export function spinReel(reelIndex: number): Symbol[] { ... }`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const r = rng() * total;
}
export function spinReel(reelIndex: number, rng: () => number = Math.random): Symbol[] { ... }`
- Add bounds guards to spinReel and getReelWeights; return a copy to prevent state leakage
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];
  ...
}
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];
  ...
}
export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds`);
  }
  return [...REEL_WEIGHTS[reelIndex]];
}`
- Use satisfies for DEFAULT_WEIGHTS to catch typos at definition site without widening types
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/strategy.ts` — 6.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Use integer arithmetic for monetary payout calculations to avoid floating-point rounding errors in regulated gaming RTP.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 8) / 10),`
- Add JSDoc to all public exports, especially the abstract method contract.
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/**
 * Base strategy for post-spin payout adjustment.
 * Implementations must be deterministic and auditable.
 */
export abstract class SpinStrategy {
  /**
   * Adjusts the payout of a completed spin result.
   * @param result - The raw spin result from the engine.
   * @returns A (possibly modified) spin result with adjusted payout.
   */
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
- Use `satisfies` to validate concrete strategies conform to the abstract shape without losing type narrowing.
  - Before: `export class DefaultStrategy extends SpinStrategy {`
  - After: `export class DefaultStrategy extends SpinStrategy satisfies SpinStrategy {`
- Add a strategy identity/name field for auditability in regulated gaming contexts.
  - Before: `export class ConservativeStrategy extends SpinStrategy {`
  - After: `export class ConservativeStrategy extends SpinStrategy {
  readonly strategyId = 'conservative-v1' as const;`

### `src/events.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark `listeners` as `readonly` — its reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Guard `emit` so a throwing handler does not abort remaining handlers.
  - Before: `for (const handler of handlers) {
  handler(...args);
}`
  - After: `for (const handler of handlers) {
  try {
    handler(...args);
  } catch (err) {
    console.error(`SpinEventEmitter: handler for "${event}" threw`, err);
  }
}`
- Add JSDoc to all public exports.
  - Before: `export class SpinEventEmitter {
  on(event: string, handler: EventHandler): void {`
  - After: `/**
 * Lightweight synchronous event emitter for spin-lifecycle events.
 */
export class SpinEventEmitter {
  /**
   * Registers `handler` for the given `event`. Multiple handlers per event are supported.
   */
  on(event: string, handler: EventHandler): void {`
- Use a generic event map to enforce payload types per event name.
  - Before: `type EventHandler = (...args: unknown[]) => void;

export class SpinEventEmitter {
  private readonly listeners: Map<string, EventHandler[]> = new Map();`
  - After: `type EventMap = Record<string, unknown[]>;
type Handler<T extends unknown[]> = (...args: T) => void;

export class SpinEventEmitter<T extends EventMap> {
  private readonly listeners: Map<keyof T & string, Handler<T[keyof T & string]>[]> = new Map();

  on<K extends keyof T & string>(event: K, handler: Handler<T[K]>): void { /* … */ }
  off<K extends keyof T & string>(event: K, handler: Handler<T[K]>): void { /* … */ }
  emit<K extends keyof T & string>(event: K, ...args: T[K]): void { /* … */ }
}`

### `src/freespin.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across all reel windows.
 * @param reels - 2D grid of visible symbols (columns × rows).
 * @returns Total number of SCATTER symbols visible.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Externalize magic game-math numbers as named constants (required in regulated gambling code)
  - Before: `state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const FREE_SPINS_AWARDED = 10 as const;
const SCATTER_TRIGGER_COUNT = 3 as const;

// ...
    state.remaining = FREE_SPINS_AWARDED;
  } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    state.remaining += FREE_SPINS_AWARDED;`
- Return new state instead of mutating to improve immutability and testability
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  }`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    return { ...state, active: true, remaining: FREE_SPINS_AWARDED };
  }`

### `src/jackpot.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Add JSDoc documenting jackpot condition, parameter, and return value.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns true when the reel grid contains at least JACKPOT_DIAMOND_THRESHOLD DIAMOND symbols.
 * @param reels - Immutable 2-D grid of symbols (columns × rows).
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
- Extract the magic threshold into a named constant for compliance auditability.
  - Before: `return diamondCount >= 4;`
  - After: `const JACKPOT_DIAMOND_THRESHOLD = 4;
// ...
return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;`
- Early-exit once threshold is reached to avoid scanning remaining symbols.
  - Before: `for (const col of reels) {
    for (const sym of col) {
      if (sym === "DIAMOND") diamondCount++;
    }
  }
  return diamondCount >= 4;`
  - After: `const JACKPOT_DIAMOND_THRESHOLD = 4;
for (const col of reels) {
  for (const sym of col) {
    if (sym === "DIAMOND" && ++diamondCount >= JACKPOT_DIAMOND_THRESHOLD) return true;
  }
}
return false;`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const arr = new Uint32Array(1);
crypto.getRandomValues(arr);
const roll = (arr[0] / 0x100000000) * totalWeight;`
- Add readonly to parameters to enforce immutability at the call site
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject the RNG function for testability and decoupling
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 0x100000000; }
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = random() * totalWeight;`
- Guard against empty/mismatched inputs to prevent silent undefined returns
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new Error('weightedPick: items must be non-empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
  if (weights.some(w => w < 0)) throw new Error('weightedPick: weights must be non-negative');`
