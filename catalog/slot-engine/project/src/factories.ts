import type { Symbol } from "./types.js";
import { spinReel } from "./reels.js";

export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}

export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(spinReel(i));
    }
    return reels;
  }
}
