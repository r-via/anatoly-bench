[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Type bet as Bet and throw an Error
  - Before: `export function spin(bet: any): SpinResult {
  if (...) { throw "invalid bet"; }`
  - After: `export function spin(bet: Bet): SpinResult {
  if (...) { throw new RangeError("invalid bet"); }`
- Use integer minor units for money and inject dependencies
  - Before: `const lineBet = bet / 10;`
  - After: `const lineBet = Math.floor(bet * 100 / 10); // integer cents, or use a Decimal library`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Type the pay table with satisfies and readonly tuples keyed by Symbol.
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {`
  - After: `const PAY_TABLE = {
  CHERRY: [2, 5, 25],
  // ...
} as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Make the input readonly and rename the imported type to avoid shadowing the global Symbol.
  - Before: `export function lineWins(symbols: Symbol[])`
  - After: `export function lineWins(symbols: readonly SlotSymbol[])`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Use a CSPRNG instead of Math.random for gaming RNG
  - Before: `const r = Math.random() * total;`
  - After: `const r = (randomInt(0, 2**32) / 2**32) * total; // import { randomInt } from 'node:crypto'`
- Derive weights from Record<Symbol, number> and freeze the exports
  - Before: `interface ReelWeightConfig { CHERRY: number; ... }
export function getReelSymbols(): Symbol[] { return SYMBOLS; }`
  - After: `const DEFAULT_WEIGHTS: Readonly<Record<Symbol, number>> = { ... };
export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }`
- Validate reelIndex
  - Before: `const weights = REEL_WEIGHTS[reelIndex];`
  - After: `const weights = REEL_WEIGHTS[reelIndex];
if (!weights) throw new RangeError(`Invalid reel index: ${reelIndex}`);`

### `src/rng.ts` — 2.5/10

**Failed rules:**

- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)

- Use a cryptographically secure, injectable RNG; validate inputs; use readonly params.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rand: () => number = secureRandom,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error('items and weights must be non-empty and equal length');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (!(totalWeight > 0)) throw new Error('total weight must be positive');
  const roll = rand() * totalWeight;`
