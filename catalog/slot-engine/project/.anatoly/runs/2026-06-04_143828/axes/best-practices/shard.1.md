[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 6/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the already-exported `Bet` type in both public signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix house-edge direction to target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object (preserves stack trace) and enforce the 100-coin ceiling
  - Before: `if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw new Error("invalid bet: must be an integer between 1 and 100");
}
if (bet > 100) throw new Error("bet exceeds maximum: must be ≤ 100");`
- Make PAYLINES immutable and use `satisfies` for type-checked `as const`
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Remove the two dead container resolutions (`rng`, `reelsModule`) that are resolved but never consumed
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Carry `wildCount` out of `evaluateLine` in `LineWin` to avoid re-scanning symbols in `spin()`
  - Before: `return {
  lineIndex,
  symbol: result.sym,
  count: result.run,
  payout: basePayout,
};`
  - After: `return {
  lineIndex,
  symbol: result.sym,
  count: result.run,
  wildCount,
  payout: basePayout,
};`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to stay DRY and in sync with the Symbol union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Replace `Math.random()` with the project's `src/rng.ts` module and inject the RNG function for testability and regulatory compliance.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js";

function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = nextFloat): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add `readonly` modifiers and use `as const` to prevent external mutation of internal state.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS = { ... } as const satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];

export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Guard `spinReel` against out-of-bounds `reelIndex` to prevent silent undefined errors.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/factories.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Return ReadonlyArray to match the arbitrated SpinResult contract and prevent callers from mutating reel state.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];

buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;

buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Accept the reel-spin function as a constructor dependency so tests can inject a deterministic stub without module mocking.
  - Before: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(spinReel(i));
    }
    return reels;
  }
}`
  - After: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  constructor(private readonly spin: (index: number) => Symbol[] = spinReel) {
    super();
  }

  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(this.spin(i));
    }
    return reels;
  }
}`
- Add JSDoc to both exported classes.
  - Before: `export abstract class AbstractReelBuilderFactory {`
  - After: `/**
 * Base factory for constructing reel grids.
 * Extend to supply alternate spin strategies (e.g. weighted, seeded).
 */
export abstract class AbstractReelBuilderFactory {`

### `src/rng.ts` — 6/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use readonly array parameters to express non-mutation intent and satisfy immutability rule.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with a CSPRNG and accept an injectable random function for both compliance and testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
}

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = cryptoRandom,
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = random() * totalWeight;`
