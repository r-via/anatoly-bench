[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.75/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `any` with the existing `Bet` type alias on both public exports.
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string literal to preserve stack traces and support `instanceof` guards.
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES deeply readonly to prevent accidental mutation.
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Register factory, strategy, and emitter in the DI container instead of hard-coding `new` inside `spin()`.
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `const factory = container.resolve<StandardReelBuilderFactory>("factory");
const strategy = container.resolve<DefaultStrategy>("strategy");
const emitter = container.resolve<SpinEventEmitter>("emitter");`
- Remove the no-op listener or replace with a meaningful handler; at minimum, clean up the listener after each emit.
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Add JSDoc to the primary public export `spin`.
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Executes one complete slot spin.
 * @param bet - Integer coin wager (1–100).
 * @returns Fully-populated SpinResult.
 * @throws {Error} When bet is not a positive integer.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 2/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace Math.random() with the project's rng.ts abstraction and inject it for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> instead of hand-enumerating all keys in ReelWeightConfig
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as readonly to prevent external mutation
  - Before: `const REEL_WEIGHTS: number[][] = [...]`
  - After: `const REEL_WEIGHTS: readonly (readonly number[])[] = [...]`
- Add bounds guard to spinReel and getReelWeights to prevent silent undefined access
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Add JSDoc to all three exported functions
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel and returns 3 symbols for display.
 * @param reelIndex - Zero-based reel index (0–4).
 * @returns Array of 3 symbols drawn from the reel's weight distribution.
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/freespin.ts` — 8.75/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports so API consumers and tooling get inline documentation.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts the total number of SCATTER symbols visible across all reels.
 * @param reels - 5×3 grid of symbols (column-major).
 * @returns Total SCATTER count.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Replace magic literals with named constants to make threshold and award count self-documenting and centrally configurable.
  - Before: `state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const FREE_SPIN_TRIGGER = 3;
const FREE_SPIN_AWARD = 10;

// inside handleFreeSpins:
state.remaining = FREE_SPIN_AWARD;
  } else if (state.active && scatters >= FREE_SPIN_TRIGGER) {
    state.remaining += FREE_SPIN_AWARD;`
- Return a new FreeSpinState instead of mutating the parameter for better testability and composability.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } ...
}`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= 3) {
    return { ...state, active: true, remaining: 10 };
  } else if (state.active && scatters >= 3) {
    return { ...state, remaining: state.remaining + 10 };
  } else if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable, CSPRNG-backed draw to satisfy both regulatory compliance and testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  },
): T {
  const roll = rng() * totalWeight;`
- Add input guards to prevent silent undefined returns on empty or mismatched arrays.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items and weights must have equal length');`
- Complete the JSDoc with @param and @returns tags.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Non-empty array of candidate items.
 * @param weights - Positive weights parallel to `items`.
 * @param rng - Optional CSPRNG source; defaults to `crypto.getRandomValues`-backed draw.
 * @returns The selected item.
 * @throws {Error} If `items` is empty or lengths differ.
 */`
- Mark array parameters readonly to prevent accidental mutation.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

### `src/legacy.ts` — 7/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols readonly to signal immutability and prevent accidental mutation
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point payout arithmetic with integer math to satisfy regulated gambling precision requirements
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Operate in integer credit-units; caller divides by 10 only at display layer
return Math.round((multiplier * bet) / 10);`
- Add JSDoc covering parameters, return value, WILD substitution logic, and SCATTER short-circuit
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the legacy line payout for a resolved payline symbol sequence.
 *
 * @param lineSymbols - Left-to-right ordered symbols on the evaluated payline.
 * @param bet - Total bet in whole credits; must be a multiple of 10.
 * @returns Payout in credits. Returns 0 for fewer than 3 matches, SCATTER-led lines,
 *          or a WILD-only line. Does NOT apply the wild escalation formula
 *          (see evaluateLine in src/engine.ts for current logic).
 * @deprecated Use evaluateLine from src/engine.ts for compliant payout computation.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
