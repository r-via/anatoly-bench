import type { Symbol } from "./types.js";
import { getPayMultiplier } from "./paytable.js";

export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  const first = lineSymbols[0] === "WILD"
    ? lineSymbols.find(s => s !== "WILD") ?? "WILD"
    : lineSymbols[0];
  if (first === "WILD" || first === "SCATTER") return 0;

  let matchCount = 0;
  for (let i = 0; i < lineSymbols.length; i++) {
    if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
      matchCount++;
    } else {
      break;
    }
  }

  if (matchCount < 3) return 0;

  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
}
