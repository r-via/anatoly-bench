import type { BlockId, TrainId } from "./types.js";
import { MIN_HEADWAY } from "./timetable.js";

const lastEntryTick = new Map<BlockId, number>();

export function resetSignals(): void {
  lastEntryTick.clear();
}

export function canEnterBlock(block: BlockId, _train: TrainId, currentTick: number): boolean {
  const last = lastEntryTick.get(block);
  if (last === undefined) return true;
  const elapsed = currentTick - last;
  return elapsed >= MIN_HEADWAY - 1;
}

export function recordEntry(block: BlockId, tick: number): void {
  lastEntryTick.set(block, tick);
}
