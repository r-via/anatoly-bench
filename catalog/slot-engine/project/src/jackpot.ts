import type { Symbol } from "./types.js";

export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  let diamondCount = 0;
  for (const col of reels) {
    for (const sym of col) {
      if (sym === "DIAMOND") diamondCount++;
    }
  }
  return diamondCount >= 4;
}
