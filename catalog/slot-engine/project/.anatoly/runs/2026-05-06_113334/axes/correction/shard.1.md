[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srcrngts) |
| `package.json` | 🟢 CLEAN | 0 | 0% | [details](#packagejson) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | Forward: total*(1+0.05)=total*1.05 → engine pays out 105% of line-win value → implied RTP>100%. Backward: target RTP=95% requires total*(1−0.05)=total*0.95. Sanity: (1−0.05)→95% ✓ formula consistent. Operator '+ HOUSE_EDGE' must be '− HOUSE_EDGE'. Violates documented ~95% RTP target [.anatoly/docs/04-API-Reference/01-Public-API.md]. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 85% | total+=bet*0.01 adds 1% of bet on every spin unconditionally, including on top of winning payouts and on zero-win spins. This is undocumented, further inflates RTP above the 95% target, and causes a losing spin on the minimum bet (bet=1) to return Math.ceil(0.01)=1 coin, making it impossible to receive 0 payout — contradicting standard slot-machine losing-spin behaviour. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44–L47 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] is undefined for any reelIndex outside [0, 4]. undefined is then passed to pickFromWeighted where wts.reduce(...) immediately throws TypeError: Cannot read properties of undefined. No guard or range assertion is present. |
| `getReelSymbols` | L53 | 🟡 NEEDS_FIX | 72% | Should return [...SYMBOLS] (a shallow copy) to prevent external mutation of the internal symbol roster that pickFromWeighted depends on for correct positional indexing. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] is undefined for out-of-range indices; the return type is declared number[], so callers receive undefined with no type error, producing silent downstream NaN arithmetic. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 85% | Returns a direct reference to the live REEL_WEIGHTS[reelIndex] sub-array. A caller doing getReelWeights(0)[5] = 9999 permanently raises DIAMOND weight for reel 0, biasing all future spins without any sanitisation. |

### `src/events.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `SpinEventEmitter` | L19–L23 | 🟡 NEEDS_FIX | 80% | Array.prototype[Symbol.iterator] tracks the current index against the live array length. If any handler calls on() for the same event, handlers.push() extends the array in-place and the for-of loop will visit the new entry. Fix: snapshot before iterating — `const snapshot = handlers.slice(); for (const handler of snapshot) { ... }`. |

## ⚡ Quick Wins

- [ ] <!-- ACT-7ae45a-1 --> **[correction · medium · small]** `package.json`: Remove `--noEmit` from the `build` script (or rename it `typecheck`) and add an `outDir` (e.g. `dist`) in tsconfig so compilation actually produces runnable JavaScript. [L9]
- [ ] <!-- ACT-7ae45a-2 --> **[correction · medium · small]** `package.json`: Update `main` to reference the compiled entry point (e.g. `"dist/index.js"`) once `tsc` is configured to emit output. [L8]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or formally document the `total += bet * 0.01` statement on line 108. As written it adds 1% of the bet to every spin result (wins and losses), inflates RTP beyond the 95% target on winning spins, and makes it impossible for a minimum-bet losing spin to return 0 coins. [L108]
- [ ] <!-- ACT-7dd2fe-1 --> **[correction · medium · small]** `src/events.ts`: In SpinEventEmitter.emit, replace `for (const handler of handlers)` with a snapshotted iteration: `const snapshot = handlers.slice(); for (const handler of snapshot) { handler(...args); }`. This prevents handlers added via on() during emission from being invoked in the same cycle and eliminates the risk of infinite loops. [L19]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel (e.g., if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)) before accessing REEL_WEIGHTS[reelIndex] to prevent a TypeError crash on invalid input. [L44]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in getReelWeights and return a shallow copy of the weights array to prevent out-of-range undefined returns and external mutation of live reel weights. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add a guard at function entry: throw (or return a typed sentinel) when items.length === 0 to prevent the undefined-typed-as-T return. [L15]
- [ ] <!-- ACT-4db700-3 --> **[correction · medium · small]** `src/rng.ts`: Validate that items.length === weights.length at function entry and throw if they differ, preventing NaN propagation that silently biases all picks toward the last item. [L9]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `(1 + HOUSE_EDGE)` with `(1 - HOUSE_EDGE)` on line 105 so the house edge deducts 5% from line-win totals, achieving the documented ~95% RTP instead of paying out >105% of wins. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with crypto.getRandomValues (or an equivalent certified PRNG) to satisfy regulated gaming RNG requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a cryptographically secure or certified RNG source (e.g., crypto.getRandomValues()) to meet regulated gaming RNG requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Return a copy of SYMBOLS in getReelSymbols (return [...SYMBOLS]) to prevent external callers from corrupting the internal symbol list. [L53]
