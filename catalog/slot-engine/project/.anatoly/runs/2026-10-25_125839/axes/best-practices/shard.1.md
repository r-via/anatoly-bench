[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcstrategyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srceventsts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Type the bet parameter and throw a proper Error
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`Invalid bet: ${bet}; expected an integer in 1..100`);
  }`
- Make PAYLINES immutable and checked
  - Before: `const PAYLINES: number[][] = [[1,1,1,1,1], ...];`
  - After: `const PAYLINES = [[1,1,1,1,1], ...] as const satisfies ReadonlyArray<readonly number[]>;`
- Inject dependencies instead of using a service locator
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult { const { rng, paytable } = deps; /* ... */ }`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random with a CSPRNG-backed, injectable RNG
  - Before: `const r = Math.random() * total;`
  - After: `import { randomInt } from "node:crypto";
const r = randomInt(0, total); // integer weights; or inject rng: (max: number) => number`
- Use Record and readonly for weights and symbols, and avoid shadowing global Symbol
  - Before: `interface ReelWeightConfig { CHERRY: number; /* ... */ }
const SYMBOLS: Symbol[] = [...];`
  - After: `type ReelWeightConfig = Readonly<Record<SlotSymbol, number>>;
const SYMBOLS = ["CHERRY", /* ... */] as const satisfies readonly SlotSymbol[];`
- Validate reelIndex
  - Before: `const weights = REEL_WEIGHTS[reelIndex];`
  - After: `const weights = REEL_WEIGHTS[reelIndex];
if (!weights) throw new RangeError(`Invalid reel index: ${reelIndex}`);`

### `src/strategy.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to the exported strategy classes and document the payout factor
  - Before: `export class ConservativeStrategy extends SpinStrategy {`
  - After: `/** Reduces each spin's total payout to 80%, rounded down to an integer. */
export class ConservativeStrategy extends SpinStrategy {`
- Use integer arithmetic for the payout factor and take a readonly input
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 4) / 5),`

### `src/rng.ts` — 3.5/10

**Failed rules:**

- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)

- Use a cryptographically secure RNG, injectable for tests and certification, and validate inputs
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = secureRandom,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error('items and weights must be non-empty and equal in length');
  }
  if (weights.some((w) => !Number.isFinite(w) || w < 0)) {
    throw new Error('weights must be finite and non-negative');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new Error('total weight must be positive');
  const roll = rng() * totalWeight;`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Avoid fractional coin payouts from float division. Multiply first and round per policy, or keep integer units.
  - Before: `const lineBet = bet / 10;
  return multiplier * lineBet;`
  - After: `return Math.floor((multiplier * bet) / 10);`
- Accept a readonly array and document the exported function.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/** Computes the legacy payout for one payline; WILD substitutes, 3+ leading matches pay. */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`

### `src/events.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Type the event map so handlers get typed payloads
  - Before: `type EventHandler = (...args: unknown[]) => void;
emit(event: string, ...args: unknown[]): void`
  - After: `interface SpinEvents { 'spin:done': [result: SpinResult] }
class SpinEventEmitter {
  emit<K extends keyof SpinEvents>(event: K, ...args: SpinEvents[K]): void
}`
- Mark the listeners field readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Isolate handler failures in emit so one throwing handler does not stop the rest
  - Before: `for (const handler of handlers) {
  handler(...args);
}`
  - After: `for (const handler of handlers) {
  try {
    handler(...args);
  } catch (err) {
    console.error(`Handler for "${event}" failed`, err);
  }
}`
