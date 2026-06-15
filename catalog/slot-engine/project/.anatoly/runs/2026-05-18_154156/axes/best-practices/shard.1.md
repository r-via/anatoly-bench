[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srceventsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Apply the declared `Bet` type alias to both exported function signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw Error objects instead of string literals (fixes no-throw-literal)
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the arbitrated upper bound (1..100) by rejecting bets > 100 rather than warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Add JSDoc to spin()
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Runs one full spin across five reels and ten paylines.
 * Applies wild multipliers, detects scatter free-spin bonuses, and checks the jackpot.
 * @param bet - Integer coin bet in the range 1..100
 * @returns Structured outcome including `totalPayout`, `lineWins`, and `jackpotHit`
 * @throws {Error} when `bet` is not a positive integer ≤ 100
 */
export function spin(bet: Bet): SpinResult {`
- Remove the no-op listener that leaks on every spin call
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Keep credit arithmetic integer — multiply bet by a base unit, divide only at the display layer
  - Before: `const lineBet = bet / 10;`
  - After: `// Store as deci-coins: 1 coin = 10 units; adjust paytable multipliers accordingly
const lineBetUnits = bet; // integer, no float division`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project RNG from src/rng.ts and inject it as a parameter for testability and regulatory compliance.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add a bounds guard to spinReel to produce a clear error on bad reelIndex.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Mark all module-level constants readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]`
- Return readonly number[] from getReelWeights to prevent callers from mutating reel probability tables.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Use Record<Symbol, number> to enforce exhaustiveness over the Symbol union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Use satisfies for DEFAULT_WEIGHTS to get literal-type inference while keeping conformance checking.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Replace widening type annotation on PAY_TABLE with satisfies for exhaustiveness and readonly tuple inference
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  // ...
};`
  - After: `type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;

const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  // ...
} as const satisfies Record<PaySymbol, readonly [number, number, number]>;`
- Mark symbols parameter as ReadonlyArray to signal non-mutation intent and prevent accidental writes
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: ReadonlyArray<Symbol>): { symbol: Symbol; count: number } | null {`
- Extract named interface for the lineWins return type to match project interface convention
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `interface LineMatch { readonly symbol: Symbol; readonly count: number; }

export function lineWins(symbols: ReadonlyArray<Symbol>): LineMatch | null {`
- Add JSDoc to all three public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {
export function lineWins(symbols: Symbol[]): ... {`
  - After: `/** Theoretical RTP for the classic pay table variant (95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the pay multiplier for a symbol at a given match count (3–5).
 * Returns 0 for unknown symbols or out-of-range counts.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/**
 * Evaluates a 5-position payline left-to-right and returns the leading
 * win match (symbol + run length ≥ 3), or null if no win.
 */
export function lineWins(symbols: ReadonlyArray<Symbol>): LineMatch | null {`

### `src/events.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark `listeners` readonly to enforce the Map reference is never reassigned.
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners: Map<string, EventHandler[]> = new Map();`
- Add JSDoc to the exported class and constant.
  - Before: `export class SpinEventEmitter {
export const SPIN_DONE = "spin:done";`
  - After: `/** Lightweight synchronous event bus used by the spin engine. */
export class SpinEventEmitter {

/** Event name emitted after each spin, carrying the completed `SpinResult`. */
export const SPIN_DONE = "spin:done";`
- Isolate handler errors in `emit` so one throwing handler does not abort subsequent listeners.
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
- Type the emitter generically to enforce event/payload contracts at call sites.
  - Before: `type EventHandler = (...args: unknown[]) => void;

export class SpinEventEmitter {
  private listeners: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): void {
  off(event: string, handler: EventHandler): void {
  emit(event: string, ...args: unknown[]): void {`
  - After: `type EventMap = Record<string, unknown[]>;
type EventHandler<T extends unknown[]> = (...args: T) => void;

export class SpinEventEmitter<TEvents extends EventMap = Record<string, unknown[]>> {
  private readonly listeners = new Map<keyof TEvents, EventHandler<unknown[]>[]>();

  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable, certifiable RNG source for regulated gaming compliance
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
): T {
  const roll = rng() * totalWeight;`
- Add input guards for empty and mismatched arrays, and zero total weight
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {
  if (items.length === 0) throw new RangeError('weightedPick: items array is empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new RangeError('weightedPick: totalWeight must be > 0');`
- Mark parameters as readonly and add @param/@returns JSDoc tags
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `/**
 * @param items - Candidate values to pick from.
 * @param weights - Non-negative weight for each item; must have the same length as items.
 * @param rng - Optional RNG source; defaults to crypto.getRandomValues-based uniform draw.
 * @returns A single item sampled proportionally to its weight.
 */
export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {`
