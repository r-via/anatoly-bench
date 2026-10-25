[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 6.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Type bet as Bet and throw a real Error
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`invalid bet: ${bet} (expected integer 1..100)`);
  }`
- Type computePayout's bet parameter
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number`
  - After: `export function computePayout(lineWins: readonly LineWin[], bet: Bet): number`
- Remove unused container resolutions and make PAYLINES readonly
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Inject collaborators instead of constructing them in spin
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult { const { factory, strategy, emitter } = deps; ... }`

### `src/reels.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use the project's injectable RNG instead of Math.random (regulated gaming).
  - Before: `const r = Math.random() * total;`
  - After: `const r = rng.nextFloat() * total; // injected from ./rng.js, certified/CSPRNG-backed`
- Derive the weights type from the symbol union and make the data readonly.
  - Before: `interface ReelWeightConfig { CHERRY: number; ... }
const SYMBOLS: Symbol[] = [...]`
  - After: `type ReelWeightConfig = Readonly<Record<ReelSymbol, number>>;
const SYMBOLS = [...] as const satisfies readonly ReelSymbol[];`
- Return read-only views and validate reelIndex.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  const w = REEL_WEIGHTS[reelIndex];
  if (!w) throw new RangeError(`Invalid reel index: ${reelIndex}`);
  return w;
}`

### `src/freespin.ts` — 6.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)

- Name the magic numbers and document the mutation contract
  - Before: `if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
}`
  - After: `const SCATTERS_TO_TRIGGER = 3;
const FREE_SPINS_AWARD = 10;

/** Mutates `state` in place: triggers or retriggers free spins at >= 3 scatters, else consumes one active spin. */
if (!state.active && scatters >= SCATTERS_TO_TRIGGER) {
    state.active = true;
    state.remaining = FREE_SPINS_AWARD;
}`
- Return a new state instead of mutating the parameter
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use a secure, injectable RNG, validate inputs, and mark parameters readonly
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `import { randomInt } from 'node:crypto';

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: (maxExclusive: number) => number = randomInt,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError('items and weights must be non-empty and of equal length');
  }
  // weights must be non-negative integers
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = random(totalWeight);`
