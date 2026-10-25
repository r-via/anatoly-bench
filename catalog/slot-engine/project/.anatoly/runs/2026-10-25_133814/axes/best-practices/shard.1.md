[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcrngts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcstrategyts) |

## 🔍 Details

### `src/engine.ts` — 2/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Type the bet parameter and throw an Error
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }`
  - After: `export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`invalid bet: ${bet}`);
  }`
- Type computePayout's bet parameter
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number`
  - After: `export function computePayout(lineWins: readonly LineWin[], bet: Bet): number`
- Inject the collaborators with defaults and drop the unused container
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
  const { factory, strategy, emitter } = deps;`
- Make PAYLINES readonly
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly (readonly number[])[] = [`

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Use a CSPRNG instead of Math.random and inject it for testability
  - Before: `const r = Math.random() * total;`
  - After: `import { randomInt } from "node:crypto";
const r = randomInt(0, total * 1000) / 1000;`
- Derive the config type from the Symbol union and freeze shared data
  - Before: `interface ReelWeightConfig { CHERRY: number; ... }
const SYMBOLS: Symbol[] = [...];`
  - After: `type ReelWeightConfig = Readonly<Record<Symbol, number>>;
const SYMBOLS: readonly Symbol[] = [...] as const;`
- Return readonly views of shared state
  - Before: `export function getReelSymbols(): Symbol[] { return SYMBOLS; }`
  - After: `export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }`
- Build REEL_WEIGHTS without repetition
  - Before: `const REEL_WEIGHTS: number[][] = [weightsToArray(DEFAULT_WEIGHTS), ...];`
  - After: `const REEL_WEIGHTS: readonly (readonly number[])[] = Array.from({ length: 5 }, () => weightsToArray(DEFAULT_WEIGHTS));`

### `src/freespin.ts` — 7.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)

- Name the magic numbers and document handleFreeSpins
  - Before: `if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
}`
  - After: `const SCATTER_TRIGGER = 3;
const FREE_SPINS_AWARD = 10;

/** Mutates `state`: starts, retriggers, or consumes a free spin based on scatter count. */
if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.active = true;
    state.remaining = FREE_SPINS_AWARD;
}`
- Return a new state instead of mutating the parameter
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`

### `src/rng.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use a cryptographically secure, injectable RNG source and validate inputs
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError('items and weights must be non-empty and of equal length');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (!(totalWeight > 0)) throw new RangeError('total weight must be positive');
  const roll = random() * totalWeight;`
- Correct the JSDoc to document the contract and drop the misleading claim
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 */`
  - After: `/**
 * Picks one item with probability proportional to its weight.
 * @param items Non-empty list of candidates.
 * @param weights Non-negative finite weights, same length as `items`, with a positive sum.
 * @param random Uniform source in [0, 1); injectable for deterministic tests.
 * @returns The selected item.
 */`

### `src/strategy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc and extract the magic number, using integer math to avoid float drift
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
  }
}`
  - After: `/** Reduces the payout to 80% of its value, rounded down to a whole unit. */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: Readonly<SpinResult>): SpinResult {
    return { ...result, totalPayout: Math.floor((result.totalPayout * 4) / 5) };
  }
}`
