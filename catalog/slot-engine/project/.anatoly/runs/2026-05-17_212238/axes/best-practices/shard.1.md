[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7/10 | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3/10

**Failed rules:**

- Rule 2: No any (CRITICAL)

- Replace explicit `any` on public params with the local `Bet` type alias
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw Error objects to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce upper bound per arbitrated contract (Bet = 1..100, doc-wins)
  - Before: `if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (typeof bet !== "number" || bet < 1 || bet > 100 || !Number.isInteger(bet)) {
  throw new Error("invalid bet");
}`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  // ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly (readonly number[])[];`
- Remove unused resolved variables `rng` and `reelsModule` from spin()
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Remove no-op event listener
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Eliminate redundant wild-count pass by carrying wildCount in LineWin
  - Before: `// In evaluateLine — wildCount is computed but not returned
return { lineIndex, symbol: result.sym, count: result.run, payout: basePayout };

// In spin() — recomputed from scratch
for (const w of wins) {
  const lineSymbols = PAYLINES[w.lineIndex].map((row, col) => reels[col][row]);
  let wc = 0;
  for (let k = 0; k < w.count; k++) { if (lineSymbols[k] === "WILD") wc++; }
  if (wc > 0) wildMultiplier = Math.max(wildMultiplier, (1 + wc) * 2 ** wc);
}`
  - After: `// In evaluateLine — include wildCount in return
return { lineIndex, symbol: result.sym, count: result.run, payout: basePayout, wildCount };

// In spin() — derive directly
const wildMultiplier = wins.reduce((max, w) =>
  w.wildCount > 0 ? Math.max(max, (1 + w.wildCount) * 2 ** w.wildCount) : max, 1);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with src/rng.ts to satisfy regulated-gaming RNG requirements
  - Before: `const r = Math.random() * total;`
  - After: `const r = rng.next() * total; // rng injected via parameter: pickFromWeighted(items, wts, rng: RNG)`
- Add bounds guard in spinReel and getReelWeights to prevent silent undefined access
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Mark module-level constants as readonly to prevent accidental mutation
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]`
- Use Record<Symbol, number> instead of a manually enumerated interface for ReelWeightConfig
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Use satisfies to validate DEFAULT_WEIGHTS at compile time while preserving literal types
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, ...`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, ...} satisfies ReelWeightConfig;`
- Return ReadonlyArray<number> from getReelWeights to prevent external mutation of internal state
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}`

### `src/paytable.ts` — 7/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Use `Symbol` as key type and `readonly` tuples for PAY_TABLE, optionally with `satisfies`
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Make `symbols` parameter readonly in `lineWins`
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: ReadonlyArray<Symbol>): ...`
- Extract anonymous return type to a named alias
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null`
  - After: `type LineMatchResult = { readonly symbol: Symbol; readonly count: number };
export function lineWins(symbols: ReadonlyArray<Symbol>): LineMatchResult | null`
- Add JSDoc to all public exports; clarify ANCIENT_RTP name
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `/** Theoretical Return-to-Player for this paytable: 95% (house edge 5%). */
export const ANCIENT_RTP = 0.95;`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use readonly parameters to signal non-mutation and enable callers to pass const arrays safely.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T`
- Inject the RNG source so tests can use a deterministic seed and production can supply a certified CSPRNG.
  - Before: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Replace Math.random() with a certified CSPRNG (e.g. crypto.getRandomValues()) to meet gaming regulatory requirements. The current implementation is not auditable and will fail GLI/eCOGRA certification.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `// Use a certified uniform draw in [0, 1)
const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x100000000) * totalWeight;`
- Add @param and @returns JSDoc tags to the exported function.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 *
 * @param items - Non-empty array of candidates.
 * @param weights - Parallel non-negative weights; must satisfy items.length === weights.length.
 * @param rng - Optional uniform random source in [0, 1); defaults to Math.random.
 * @returns The selected item.
 */`
