[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7/10 | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `bet: any` with the exported `Bet` type on both public functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Reject bets over 100 to satisfy the arbitrated 1..100 contract
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum (1–100 coins)");`
- Fix inverted house-edge: multiply by 0.95 not 1.05
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Mark PAYLINES as const to prevent mutation and narrow types
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [`
- Remove unused container resolutions or actually use them
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<...>("reels");`
  - After: `// Remove or wire rng / reelsModule into reel generation instead of factory.buildReels()`
- Remove the no-op SPIN_DONE listener (dead code)
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace the manual ReelWeightConfig interface with Record<Symbol, number>
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Inject an RNG function to replace Math.random(), enabling certified RNG and deterministic tests
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += wts[i];
    if (r < acc) return items[i];
  }
  return items[items.length - 1];
}

export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  if (total <= 0) throw new RangeError('Weight total must be positive');
  const r = rng() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += wts[i]!;
    if (r < acc) return items[i]!;
  }
  return items[items.length - 1]!;
}

export function spinReel(reelIndex: number, rng: () => number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex]!;`
- Mark module-level arrays readonly and return readonly arrays from getters to enforce the documented read-only contract
  - Before: `const SYMBOLS: Symbol[] = [ ... ];
const REEL_WEIGHTS: number[][] = [ ... ];

export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [ ... ] as const;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];

export function getReelSymbols(): readonly Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}`);
  }
  return REEL_WEIGHTS[reelIndex]!;
}`
- Use satisfies for compile-time shape validation while retaining literal types
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/paytable.ts` — 7/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Lock PAY_TABLE to precise literal types and prevent mutation
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  // ...
};`
  - After: `type PaySymbol = "CHERRY" | "LEMON" | "BELL" | "BAR" | "SEVEN" | "DIAMOND";

const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<PaySymbol, readonly [number, number, number]>;`
- Add JSDoc to all public exports
  - Before: `export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/**
 * Returns the base payout multiplier for a pay symbol and run length.
 * @param symbol - Matched pay symbol. WILD/SCATTER always return 0.
 * @param count - Consecutive run length (3, 4, or 5); any other value returns 0.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`
- Guard against empty symbols array to satisfy noUncheckedIndexedAccess
  - Before: `const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];`
  - After: `if (symbols.length === 0) return null;
const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];`
- Use the project's LineWin named type as the return type of lineWins
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: Symbol[]): LineWin | null {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace Math.random() with an injectable CSPRNG to satisfy both gaming compliance (rule 13) and testability (rule 15).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x100000000;
  }
): T {
  const roll = rng() * totalWeight;`
- Guard against empty input to prevent undefined silently escaping the T return type (rule 8).
  - Before: `return items[items.length - 1];`
  - After: `const last = items[items.length - 1];
if (last === undefined) throw new RangeError('weightedPick: items array must not be empty');
return last;`
- Use readonly parameter types and add @param / @returns JSDoc tags (rules 5 and 9).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `/**
 * Picks one item from `items` proportionally to its corresponding `weights` entry.
 * @param items - Non-empty array of candidates.
 * @param weights - Positive weights parallel to `items`.
 * @param rng - Optional uniform [0,1) random source; defaults to crypto CSPRNG.
 * @returns The selected item.
 */
export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng?: () => number,
): T {`

### `src/legacy.ts` — 7.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark the input array `readonly` to communicate immutability and satisfy linters.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace the floating-point division with integer arithmetic to avoid payout rounding errors in regulated gaming context.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const LINE_COUNT = 10;
// Keep everything in integer coins; divide only at display boundary
return Math.round(multiplier * bet) / LINE_COUNT;`
- Extract the payline divisor as a named constant and add JSDoc.
  - Before: `const lineBet = bet / 10;`
  - After: `/** Number of active paylines — divides the total bet into a per-line stake. */
const PAYLINE_COUNT = 10;
const lineBet = bet / PAYLINE_COUNT;`
- Add JSDoc to the exported function.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single evaluated payline using legacy matching rules.
 * @param lineSymbols - Ordered symbols on the evaluated line (left-to-right).
 * @param bet - Total bet in coins (integer, 1–100). Per-line stake = bet / 10.
 * @returns Payout in coins (0 when fewer than 3 consecutive matches).
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
