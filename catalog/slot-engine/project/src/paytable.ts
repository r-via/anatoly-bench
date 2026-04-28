import type { Symbol } from "./types.js";

export const ANCIENT_RTP = 0.95;

const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
};

export function getPayMultiplier(symbol: Symbol, count: number): number {
  const row = PAY_TABLE[symbol];
  if (!row) return 0;
  if (count === 3) return row[0];
  if (count === 4) return row[1];
  if (count === 5) return row[2];
  return 0;
}

export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];
  if (first === "WILD" || first === "SCATTER") return null;

  let count = 0;
  for (const s of symbols) {
    if (s === first || s === "WILD") {
      count++;
    } else {
      break;
    }
  }

  if (count >= 3) {
    return { symbol: first, count };
  }
  return null;
}
