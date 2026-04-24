export type Symbol =
  | "CHERRY"
  | "LEMON"
  | "BELL"
  | "BAR"
  | "SEVEN"
  | "DIAMOND"
  | "WILD"
  | "SCATTER";

export interface LineWin {
  lineIndex: number;
  symbol: Symbol;
  count: number;
  payout: number;
}

export interface FreeSpinState {
  active: boolean;
  remaining: number;
  totalWon: number;
}

export type LegacySpinResult = {
  reels: Symbol[][];
  payout: number;
  jackpot: boolean;
};

export interface SpinResult {
  reels: ReadonlyArray<ReadonlyArray<Symbol>>;
  lineWins: ReadonlyArray<LineWin>;
  wildMultiplier: number;
  scatterCount: number;
  freeSpinsAwarded: number;
  jackpotHit: boolean;
  totalPayout: number;
}
