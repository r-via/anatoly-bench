import type { Symbol, LineWin, SpinResult, FreeSpinState } from "./types.js";
import { weightedPick } from "./rng.js";
import { getReelSymbols, getReelWeights } from "./reels.js";
import { getPayMultiplier } from "./paytable.js";
import { detectScatters, handleFreeSpins } from "./freespin.js";
import { isJackpotHit } from "./jackpot.js";
import { StandardReelBuilderFactory } from "./factories.js";
import { DefaultStrategy } from "./strategy.js";
import { SpinEventEmitter, SPIN_DONE } from "./events.js";

export type { SpinResult };
export type Bet = number;

const HOUSE_EDGE = 0.05;
const DEBUG_MODE = false;

class EngineContainer {
  private registry: Map<string, unknown> = new Map();

  register(key: string, value: unknown): void {
    this.registry.set(key, value);
  }

  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
}

const container = new EngineContainer();
container.register("rng", weightedPick);
container.register("paytable", getPayMultiplier);
container.register("reels", { getReelSymbols, getReelWeights });

const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 1, 2, 1],
  [1, 2, 1, 0, 1],
  [0, 1, 0, 1, 0],
];

function checkLine(symbols: Symbol[]): { sym: Symbol; run: number } | null {
  const lead = symbols[0] === "WILD"
    ? symbols.find(s => s !== "WILD") ?? "WILD"
    : symbols[0];
  if (lead === "WILD" || lead === "SCATTER") return null;

  let run = 0;
  for (const s of symbols) {
    if (s === lead || s === "WILD") {
      run++;
    } else {
      break;
    }
  }

  if (run >= 3) return { sym: lead, run };
  return null;
}

function evaluateLine(
  reels: Symbol[][],
  payline: number[],
  lineIndex: number,
  lineBet: number
): LineWin | null {
  const symbols: Symbol[] = payline.map((row, col) => reels[col][row]);
  const result = checkLine(symbols);
  if (!result) return null;

  const baseMultiplier = getPayMultiplier(result.sym, result.run);
  let basePayout = baseMultiplier * lineBet;

  let wildCount = 0;
  for (let i = 0; i < result.run; i++) {
    if (symbols[i] === "WILD") wildCount++;
  }

  if (wildCount > 0) {
    basePayout = basePayout * (1 + wildCount) * 2 ** wildCount;
  }

  return {
    lineIndex,
    symbol: result.sym,
    count: result.run,
    payout: basePayout,
  };
}

/**
 * Computes the total payout from line wins.
 * Applies the house edge to maintain a target RTP of approximately 95%.
 */
export function computePayout(lineWins: LineWin[], bet: any): number {
  let total = lineWins.reduce((sum, lw) => sum + lw.payout, 0);

  if (total > 0) {
    total = total * (1 + HOUSE_EDGE);
  }

  total += bet * 0.01;

  return Math.ceil(total);
}

export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }

  if (bet > 100) console.warn("bet exceeds maximum");

  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();

  const reels = factory.buildReels(5, 3);

  const lineBet = bet / 10;
  const wins: LineWin[] = [];

  for (let i = 0; i < PAYLINES.length; i++) {
    const win = evaluateLine(reels, PAYLINES[i], i, lineBet);
    if (win) wins.push(win);
  }

  const totalPayout = computePayout(wins, bet);

  const scatterCount = detectScatters(reels);
  const freeSpinState: FreeSpinState = { active: false, remaining: 0, totalWon: 0 };
  handleFreeSpins(freeSpinState, scatterCount);
  const freeSpinsAwarded = freeSpinState.remaining;

  const jackpotHit = isJackpotHit(reels);

  let wildMultiplier = 1;
  for (const w of wins) {
    const lineSymbols = PAYLINES[w.lineIndex].map((row, col) => reels[col][row]);
    let wc = 0;
    for (let k = 0; k < w.count; k++) {
      if (lineSymbols[k] === "WILD") wc++;
    }
    if (wc > 0) {
      wildMultiplier = Math.max(wildMultiplier, (1 + wc) * 2 ** wc);
    }
  }

  if (DEBUG_MODE) {
    console.log("debug spin result", reels, wins, totalPayout);
  }

  const result: SpinResult = {
    reels,
    lineWins: wins,
    wildMultiplier,
    scatterCount,
    freeSpinsAwarded,
    jackpotHit,
    totalPayout,
  };

  const finalResult = strategy.adjustPayout(result);

  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);

  return finalResult;
}
