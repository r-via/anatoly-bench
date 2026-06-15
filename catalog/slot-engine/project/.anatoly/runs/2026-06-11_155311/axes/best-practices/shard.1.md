[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace explicit any with the already-exported Bet alias
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house-edge multiplier to achieve documented 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 — increases payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 — correct 95% RTP`
- Throw an Error instance instead of a bare string
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the two unused container resolutions (rng, reelsModule)
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `// deleted — weightedPick and reel helpers are consumed via direct imports; container holds dead registrations`
- Remove the permanent no-op listener registered on every spin
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Strengthen PAYLINES immutability
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to guarantee exhaustiveness and eliminate manual field listing.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Apply `as const` and `readonly` to module-level constants and return types to prevent external mutation.
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];

export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length)
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  return REEL_WEIGHTS[reelIndex];
}`
- Inject the certified RNG from `src/rng.ts` instead of `Math.random()` to meet gaming-compliance requirements and enable deterministic testing.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js"; // certified PRNG

function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number = nextFloat,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add JSDoc to public exports to document the valid `reelIndex` range and return shapes.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spin a single reel and return the 3 visible symbols (top→bottom).
 * @param reelIndex - Reel column index, must be in [0, 4].
 */
export function spinReel(reelIndex: number): readonly Symbol[] {`

### `src/paytable.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE fully immutable and narrow the key type using satisfies + as const
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25] as const,
  LEMON:   [2,   5,   25] as const,
  BELL:    [5,   20,  100] as const,
  BAR:     [10,  40,  200] as const,
  SEVEN:   [25,  100, 500] as const,
  DIAMOND: [50,  250, 1000] as const,
} satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Add JSDoc to all public exports
  - Before: `export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/**
 * Returns the base pay multiplier for a given symbol and run length.
 * Returns 0 for run lengths below 3, and for WILD/SCATTER symbols.
 * @param symbol - The resolved pay symbol (not WILD/SCATTER).
 * @param count  - Consecutive matching symbols in the run (3–5).
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`
- Remove or rename ANCIENT_RTP — it is dead code with no codebase consumers; the canonical RTP target should be a single named constant consumed by engine/rng modules
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `// Remove if unused, or rename to TARGET_RTP and wire into engine.ts RTP validation`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG to satisfy regulated gaming compliance requirements
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `import { randomBytes } from 'node:crypto';
// Generate a uniform float in [0, 1) from 4 cryptographically random bytes
const buf = randomBytes(4);
const roll = (buf.readUInt32BE(0) / 0x1_0000_0000) * totalWeight;`
- Inject the RNG function for testability and make parameters readonly
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {`
- Add input-contract guards to prevent silent misbehavior
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have the same length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
