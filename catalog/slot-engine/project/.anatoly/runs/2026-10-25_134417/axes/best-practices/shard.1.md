[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 6/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 5.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 6/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 6/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 12: Async/Promises/Error handling (HIGH)

- Replace `any` on both exported functions with the already-exported `Bet` type alias
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the bet ceiling rather than warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Make PAYLINES deeply readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... same values
] as const satisfies readonly (readonly number[])[];`
- Use satisfies on the result construction to catch shape mismatches early
  - Before: `const result: SpinResult = {`
  - After: `const result = {
  // ... same fields
} satisfies SpinResult;`

### `src/reels.ts` — 5.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Accept an injectable RNG to fix both certifiability (rule 13) and testability (rule 15)
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record utility type for ReelWeightConfig (rule 4)
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Return a copy from getReelWeights to prevent mutation of internal state (rule 17)
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  return [...REEL_WEIGHTS[reelIndex]];
}`
- Use satisfies for DEFAULT_WEIGHTS (rule 16)
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/rng.ts` — 6/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Inject the RNG source so the function is testable and so the production path can swap in a certified PRNG
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Use `crypto.getRandomValues` as the certified RNG source for regulated gaming instead of `Math.random`
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Add input guards and attach JSDoc to the function itself
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `/**
 * Selects one item from `items` proportionally to its entry in `weights`.
 * @param items   Non-empty array of candidates.
 * @param weights Parallel positive weights; must satisfy `items.length === weights.length`.
 * @param rng     Uniform [0, 1) source; defaults to `Math.random`.
 * @throws {RangeError} When arrays are empty or lengths differ.
 */
export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError(`weightedPick: items (${items.length}) and weights (${weights.length}) must be non-empty and equal length`);
  }`
