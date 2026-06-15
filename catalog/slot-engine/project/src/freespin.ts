import type { FreeSpinState, Symbol } from "./types.js";

export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  let count = 0;
  for (const col of reels) {
    for (const sym of col) {
      if (sym === "SCATTER") count++;
    }
  }
  return count;
}

export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) {
      state.active = false;
    }
  }
}
