import type { SpinResult } from "./types.js";

export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}

export class DefaultStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return result;
  }
}

export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * 0.8),
    };
  }
}
