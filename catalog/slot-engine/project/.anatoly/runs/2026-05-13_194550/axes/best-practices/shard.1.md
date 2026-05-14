[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.75/10 | [details](#srcreelsts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (HIGH)

- Remove `any` from public API — use the already-exported `Bet` type
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance, not a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house-edge formula to achieve 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Enforce the 100-coin maximum as a hard error (arbitrated intent: Bet is 1..100)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Mark PAYLINES immutable to prevent accidental row mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Pass the injectable rng to the factory so the RNG is auditable
  - Before: `const reels = factory.buildReels(5, 3);`
  - After: `const reels = factory.buildReels(5, 3, rng);`
- Remove the no-op listener registered on every spin to prevent listener leak
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 2.75/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace Math.random() with the project's rng.ts module to satisfy regulated gaming RNG certification (GLI-11/BMM).
  - Before: `const r = Math.random() * total;`
  - After: `const r = certifiedRng() * total; // inject rng function from rng.ts`
- Inject the RNG function into pickFromWeighted for testability and certified-RNG compliance.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rand: () => number): Symbol {
  const r = rand() * total;`
- Add a bounds guard in spinReel to prevent silent undefined access.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use Record<Symbol, number> for ReelWeightConfig to eliminate the manually mirrored key list.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark SYMBOLS and REEL_WEIGHTS as readonly and return ReadonlyArray from public accessors to prevent external mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
export function getReelSymbols(): Symbol[] { return SYMBOLS; }`
  - After: `const SYMBOLS: ReadonlyArray<Symbol> = [...] as const;
export function getReelSymbols(): ReadonlyArray<Symbol> { return SYMBOLS; }`
- Use satisfies to validate DEFAULT_WEIGHTS shape while preserving numeric literal types.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, ...
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, ...
} satisfies ReelWeightConfig;`

### `src/legacy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (HIGH)

- Use ReadonlyArray<Symbol> to signal the function does not mutate its input
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point line-bet division with integer coin arithmetic to prevent RTP drift in regulated gambling context
  - Before: `const multiplier = getPayMultiplier(first, matchCount);
const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const LINE_COUNT = 10 as const;
// Work in integer coins; multiplier is scaled x100 to avoid fractions
const lineBetCoins = Math.floor(bet / LINE_COUNT); // bet is guaranteed integer 1..100
return multiplier * lineBetCoins;`
- Name the payline divisor and guard the bet range per the README invariant
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `const LINE_COUNT = 10 as const;

/**
 * Computes the payout for a single payline using the legacy consecutive-match algorithm.
 * WILD substitutes for any symbol; SCATTER lines always return 0.
 * Requires bet to be an integer in [1, 100] (coins).
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`bet must be an integer 1..100, received ${bet}`);
  }`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() for regulated gaming compliance (rule 13). Extract the CSPRNG draw so it can also be injected for testing (rule 15).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `const cryptoRng = (): number => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
};

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRng,
): T {
  if (items.length === 0) throw new RangeError('items must not be empty');
  if (items.length !== weights.length) throw new RangeError('items and weights length mismatch');
  if (weights.some(w => !(w > 0) || !isFinite(w))) throw new RangeError('all weights must be finite and positive');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add @param and @returns JSDoc tags to the public export (rule 9).
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate items to select from (non-empty).
 * @param weights - Parallel positive finite weights; must match items.length.
 * @param rng - Optional PRNG returning [0, 1). Defaults to a CSPRNG wrapper.
 * @returns The selected item.
 * @throws {RangeError} On empty array, length mismatch, or non-positive weights.
 */`
