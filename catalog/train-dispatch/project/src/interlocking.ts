import type { BlockId, TrainId } from "./types.js";

const blockHolder = new Map<BlockId, TrainId>();
const sectionReservation = new Map<BlockId, TrainId>();

export function resetInterlocking(): void {
  blockHolder.clear();
  sectionReservation.clear();
}

export function isBlockFree(block: BlockId, train: TrainId, currentBlock: BlockId): boolean {
  const holder = blockHolder.get(currentBlock);
  return holder === undefined || holder === train;
}

export function occupyBlock(block: BlockId, train: TrainId): void {
  blockHolder.set(block, train);
}

export function releaseBlock(block: BlockId, _train: TrainId): void {
  blockHolder.delete(block);
}

export function reserveSectionBlock(block: BlockId, train: TrainId): boolean {
  if (block !== "bS1" && block !== "bS2") return true;
  const holder = sectionReservation.get(block);
  if (holder !== undefined && holder !== train) {
    return false;
  }
  sectionReservation.set(block, train);
  return true;
}

export function releaseSingleTrack(train: TrainId): void {
  for (const blk of ["bS1", "bS2"] as BlockId[]) {
    if (sectionReservation.get(blk) === train) {
      sectionReservation.delete(blk);
    }
  }
}
