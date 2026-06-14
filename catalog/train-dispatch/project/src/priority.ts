import type { TrainId } from "./types.js";

export interface QueueEntry {
  trainId: TrainId;
  insertionOrder: number;
}

export function compareTrains(a: QueueEntry, b: QueueEntry): number {
  if (a.trainId < b.trainId) return 1;
  if (a.trainId > b.trainId) return -1;
  return 0;
}
