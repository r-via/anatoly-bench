[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 5.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcrngts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 6.5/10 | [details](#srcfreespints) |

## 🔍 Details

### `src/engine.ts` — 2/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Type the bet and throw an Error subclass
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`Invalid bet ${bet}: expected integer in 1..100`);
  }`
- Make paylines immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly (readonly number[])[] = [`
- Remove unused container lookups and the no-op listener
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
...
emitter.on(SPIN_DONE, () => {});`
  - After: `// drop unused resolves; inject emitter/strategy/factory via a deps parameter`

### `src/reels.ts` — 5.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace the hand-written config type with Record<Symbol, number> and derive the weights from SYMBOLS so the order cannot drift.
  - Before: `interface ReelWeightConfig { CHERRY: number; LEMON: number; ... }
function weightsToArray(cfg: ReelWeightConfig): number[] { return [cfg.CHERRY, ...]; }`
  - After: `type ReelWeightConfig = Readonly<Record<Symbol, number>>;
const weightsToArray = (cfg: ReelWeightConfig): readonly number[] => SYMBOLS.map((s) => cfg[s]);`
- Inject the RNG and avoid exposing mutable internals.
  - Before: `const r = Math.random() * total;
...
export function getReelSymbols(): Symbol[] { return SYMBOLS; }`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol { const r = rng() * total; ... }
export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }`
- Validate reelIndex and build the reel weights with Array.from.
  - Before: `const weights = REEL_WEIGHTS[reelIndex];`
  - After: `const weights = REEL_WEIGHTS[reelIndex];
if (!weights) throw new RangeError(`Invalid reel index: ${reelIndex}`);`

### `src/rng.ts` — 3.5/10

**Failed rules:**

- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)

- Use a CSPRNG, validate inputs, make the function pure and testable with an injectable RNG, and mark the inputs readonly
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `import { randomInt } from 'node:crypto';

const defaultRandom = (): number => randomInt(0, 2 ** 48) / 2 ** 48;

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = defaultRandom,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error('items and weights must be non-empty and of equal length');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (!Number.isFinite(totalWeight) || totalWeight <= 0 || weights.some((w) => w < 0)) {
    throw new Error('weights must be non-negative with a positive finite sum');
  }
  const roll = random() * totalWeight;`

### `src/strategy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc and extract the magic number into a named, configurable constant
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
  }
}`
  - After: `const CONSERVATIVE_PAYOUT_FACTOR = 0.8 as const;

/** Reduces the total payout to 80% (floored). */
export class ConservativeStrategy extends SpinStrategy {
  constructor(private readonly factor: number = CONSERVATIVE_PAYOUT_FACTOR) {
    super();
  }
  adjustPayout(result: Readonly<SpinResult>): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * this.factor) };
  }
}`

### `src/freespin.ts` — 6.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract named constants and add JSDoc
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.remaining = 10;`
  - After: `const SCATTER_TRIGGER = 3 as const;
const FREE_SPINS_AWARD = 10 as const;

/** Updates free-spin state: triggers, retriggers, or consumes a spin. */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.remaining = FREE_SPINS_AWARD;`
- Return a new immutable state instead of mutating
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`
