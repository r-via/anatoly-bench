import type { Symbol } from "./types.js";

const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];

interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}

const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};

function weightsToArray(cfg: ReelWeightConfig): number[] {
  return [cfg.CHERRY, cfg.LEMON, cfg.BELL, cfg.BAR,
          cfg.SEVEN, cfg.DIAMOND, cfg.WILD, cfg.SCATTER];
}

const REEL_WEIGHTS: number[][] = [
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
];

function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += wts[i];
    if (r < acc) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];
  const column: Symbol[] = [];
  for (let row = 0; row < 3; row++) {
    column.push(pickFromWeighted(SYMBOLS, weights));
  }
  return column;
}

export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}
