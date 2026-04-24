import { getReelSymbols } from "../reels.js";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const symbols = getReelSymbols();
assert(symbols.length === 8, "expected 8 symbols");
assert(symbols.includes("CHERRY"), "expected CHERRY symbol");
console.log("basic test passed");
