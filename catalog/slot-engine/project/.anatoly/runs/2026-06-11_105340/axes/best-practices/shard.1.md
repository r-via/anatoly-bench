[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace bet: any with the already-exported Bet type in both public signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix the RTP formula — (1 + HOUSE_EDGE) boosts payouts; (1 - HOUSE_EDGE) applies the house edge as documented
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw a proper Error object to allow instanceof guards in catch blocks
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError(`Invalid bet: expected integer 1–100, received ${String(bet)}`);`
- Remove the no-op listener that accumulates on every spin() call
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Remove unused DI resolutions or wire them into the actual spin logic
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `// Pass rng into factory so the injected RNG is actually used:
const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
// Remove reelsModule or thread it through factory.buildReels`
- Lock PAYLINES with as const satisfies for literal types and compile-time immutability
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // payline arrays
] as const satisfies readonly (readonly number[])[];`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's dedicated RNG module to satisfy regulated gaming requirements
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> for ReelWeightConfig to eliminate manual field repetition
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Add readonly modifiers to all module-level constants and return copies from getters
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];

export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  return REEL_WEIGHTS[reelIndex];
}`
- Add bounds guard to spinReel
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/factories.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Return readonly reel array to match the arbitrated SpinResult contract and enforce immutability at the boundary.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the reel-spin function to decouple the factory from the RNG module and enable deterministic testing.
  - Before: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    ...
    reels.push(spinReel(i));
  }
}`
  - After: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) {}

  buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    return Array.from({ length: reelCount }, (_, i) => this.spinFn(i));
  }
}`
- Add JSDoc to both exported classes documenting the factory contract.
  - Before: `export abstract class AbstractReelBuilderFactory {`
  - After: `/**
 * Base factory for constructing reel grids.
 * Implementations must produce a grid of `reelCount` reels each with `rowCount` visible symbols.
 */
export abstract class AbstractReelBuilderFactory {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() for regulated-gaming compliance
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x100000000) * totalWeight;`
- Inject the RNG function for testability and game replay
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = secureRandom,
): T {`
- Add readonly parameters and guard degenerate inputs
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`

### `src/legacy.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (HIGH)

- Mark parameter as readonly — function never mutates the array
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Replace index-based loop with for...of to satisfy prefer-for-of (break still works)
  - Before: `for (let i = 0; i < lineSymbols.length; i++) {
    if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
      matchCount++;
    } else {
      break;
    }
  }`
  - After: `for (const sym of lineSymbols) {
    if (sym === first || sym === "WILD") matchCount++;
    else break;
  }`
- Eliminate floating-point payout drift for regulated gaming RTP accuracy
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Multiply in integer domain; divide once at the output boundary
return (multiplier * bet) / 10;  // still float, but a single rounding vs two
// Ideal: assert bet % 10 === 0 upstream, or accumulate in integer coins`
- Add JSDoc to document parameter units and return semantics
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using legacy left-to-right matching.
 * @param lineSymbols - Ordered symbols on the payline, left to right.
 * @param bet - Total bet in coins (1–100 integer). Per-line bet is bet / 10.
 * @returns Payout in coins (0 if no winning run of ≥ 3).
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
