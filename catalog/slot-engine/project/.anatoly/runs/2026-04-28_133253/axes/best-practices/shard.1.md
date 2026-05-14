[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srclegacyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcjackpotts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace explicit `any` on `bet` with a proper type or branded type for compile-time safety
  - Before: `export function spin(bet: any): SpinResult {
export function computePayout(lineWins: LineWin[], bet: any): number {`
  - After: `export type Bet = number & { readonly __brand: 'Bet' };
export function spin(bet: Bet): SpinResult {
export function computePayout(lineWins: LineWin[], bet: Bet): number {`
- Throw an Error instance instead of a string primitive to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error(`Invalid bet: expected a positive integer, received ${bet}`);`
- Mark PAYLINES as deeply readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Make EngineContainer.resolve type-safe using a typed registry map instead of casting from unknown
  - Before: `resolve<T>(key: string): T {
  return this.registry.get(key) as T;
}`
  - After: `// Use a typed map or a discriminated key registry so no cast is needed:
type RegistryKey = 'rng' | 'paytable' | 'reels';
type RegistryMap = { rng: typeof weightedPick; paytable: typeof getPayMultiplier; reels: { getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }; };
resolve<K extends RegistryKey>(key: K): RegistryMap[K] {
  return this.registry.get(key) as RegistryMap[K];
}`
- Lift factory/strategy/emitter out of the hot-path spin() function and add JSDoc
  - Before: `export function spin(bet: any): SpinResult {
  // ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // ...
  emitter.on(SPIN_DONE, () => {});`
  - After: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();

/**
 * Executes a single spin of the slot engine.
 * @param bet - Total bet amount in coins; must be a positive integer in [1, 100].
 * @returns A fully-evaluated SpinResult including line wins, scatter count, free spins, and jackpot flag.
 * @throws {Error} If bet is not a valid positive integer.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace manual `ReelWeightConfig` interface with `Record<Symbol, number>` to stay DRY and in sync with the Symbol union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `// No separate interface needed — derive from the Symbol union:
type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as deeply readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
const REEL_WEIGHTS: number[][] = [...];`
  - After: `const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
const DEFAULT_WEIGHTS = { CHERRY: 25, ... } as const satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];`
- Inject the RNG function instead of calling Math.random() directly — fixes testability and prepares for the certified RNG required by Rule 13.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add a bounds guard to `spinReel` to prevent silent undefined-weights crash.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Add JSDoc to all three exported functions, documenting parameter constraints and return shapes.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spin a single reel and return 3 visible symbols.
 * @param reelIndex - Zero-based reel index (0–4).
 * @returns Array of 3 symbols from top to bottom.
 * @throws {RangeError} if reelIndex is out of bounds.
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable CSPRNG for both regulatory compliance and testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `function defaultCsprng(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
}

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = defaultCsprng,
): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new Error('weightedPick: total weight must be positive');
  const roll = random() * totalWeight;`
- Add @param, @returns, and @throws JSDoc tags to fully document the exported function contract
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Picks one item from `items` proportionally to its corresponding weight.
 * Uses a cumulative-weight approach with a single uniform random draw.
 *
 * @param items - Candidate items to pick from (non-empty).
 * @param weights - Relative non-negative weights; must parallel `items` and sum to > 0.
 * @param random - RNG function returning a value in [0, 1). Defaults to a CSPRNG wrapper.
 * @returns The randomly selected item.
 * @throws {Error} If `items` is empty, lengths differ, or the total weight is ≤ 0.
 */`
- Mark array parameters as readonly to communicate non-mutation intent at the type level
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

### `src/legacy.ts` — 4/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark the input array as readonly to express the non-mutation contract at the type level.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to the sole public export describing WILD substitution, payline divisor assumption, and 3-match minimum.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using legacy matching rules.
 *
 * WILDs substitute for any non-SCATTER symbol when leading. SCATTER never pays.
 * Requires at least 3 consecutive matching symbols from the left.
 * The line bet is derived by dividing `bet` across {@link PAYLINE_COUNT} lines.
 *
 * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
 * @param bet - Total bet staked across all paylines.
 * @returns Payout amount for this line, or 0 if no qualifying match.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace the magic number 10 with a named constant to make payline count explicit and refactor-safe.
  - Before: `const lineBet = bet / 10;`
  - After: `const PAYLINE_COUNT = 10 as const;
const lineBet = bet / PAYLINE_COUNT;`
- Use integer arithmetic to avoid IEEE 754 precision loss on monetary payout values (regulated gambling compliance).
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Work in integer cents: bet is assumed to be in cents
const lineBetCents = Math.trunc(bet / 10);
return multiplier * lineBetCents; // return in cents; caller converts to display units`
- Accept the multiplier lookup as an optional parameter to decouple the function from the live paytable and improve testability.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(
  lineSymbols: readonly Symbol[],
  bet: number,
  multiplierFn: (symbol: Symbol, count: number) => number = getPayMultiplier,
): number {`

### `src/factories.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported classes to document the contract, especially the semantics of the unused `rowCount` parameter which is non-obvious to consumers.
  - Before: `export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}`
  - After: `/**
 * Abstract factory for constructing the reel grid prior to payline evaluation.
 * Implement this class to provide alternative generation strategies (e.g. seeded/deterministic grids for replay or certification).
 */
export abstract class AbstractReelBuilderFactory {
  /**
   * Build the reel grid.
   * @param reelCount - Number of reels (columns) to generate.
   * @param rowCount - Number of visible rows per reel. Implementations may ignore this if reel height is fixed internally.
   * @returns A 2-D array of symbols indexed by [reelIndex][rowIndex].
   */
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}`
- Return a readonly type from `buildReels` to prevent callers from accidentally mutating the generated reel grid, which is important for grid integrity in the gambling engine.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
// ...
buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
// ...
buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`

### `src/jackpot.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to the exported `isJackpotHit` function so callers understand the threshold, grid scope, and informational-only semantics without reading internal docs.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Determines whether the current spin qualifies for a progressive jackpot.
 *
 * Scans all cells in the 5 × 3 reel grid and counts `DIAMOND` symbols.
 * Returns `true` when four or more are found anywhere on the grid.
 *
 * @param reels - The fully resolved reel grid (5 reels × 3 rows) after a spin.
 * @returns `true` if ≥ 4 DIAMOND symbols are present; `false` otherwise.
 * @remarks The engine does **not** apply a jackpot payout — callers must
 *          inspect `SpinResult.jackpotHit` and add the prize themselves.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
