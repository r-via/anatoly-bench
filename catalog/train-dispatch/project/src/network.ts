import type { BlockId } from "./types.js";

export const STATIONS = ["ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO"] as const;
export type StationId = (typeof STATIONS)[number];

export const BLOCKS: BlockId[] = [
  "bA", "bB", "bM1", "bM2", "bS1", "bS2", "bD", "bE",
];

export const SINGLE_TRACK_BLOCKS: BlockId[] = ["bS1", "bS2"];

export interface BlockInfo {
  id: BlockId;
  from: string;
  to: string;
  traversalTime: number;
}

const T = 4;

export const BLOCK_INFO: BlockInfo[] = [
  { id: "bA",  from: "ALPHA",    to: "JCT",      traversalTime: T },
  { id: "bB",  from: "BRAVO",    to: "JCT",      traversalTime: T },
  { id: "bM1", from: "JCT",      to: "CHARLIE",  traversalTime: T },
  { id: "bM2", from: "CHARLIE",  to: "WESTLOOP", traversalTime: T },
  { id: "bS1", from: "WESTLOOP", to: "bS1_end",  traversalTime: T },
  { id: "bS2", from: "bS2_start",to: "EASTLOOP", traversalTime: T },
  { id: "bD",  from: "EASTLOOP", to: "DELTA",    traversalTime: T },
  { id: "bE",  from: "ECHO",     to: "EASTLOOP", traversalTime: T },
];

export function getTraversalTime(_block: BlockId): number {
  return T;
}

export function getBlockInfo(blockId: BlockId): BlockInfo | undefined {
  return BLOCK_INFO.find((b) => b.id === blockId);
}

export interface AdjacencyEntry {
  from: BlockId;
  to: BlockId;
}

export const ADJACENCY: AdjacencyEntry[] = [
  { from: "bA",  to: "bM1" },
  { from: "bB",  to: "bM1" },
  { from: "bM1", to: "bM2" },
  { from: "bM2", to: "bS1" },
  { from: "bS1", to: "bS2" },
  { from: "bS2", to: "bD"  },
  { from: "bE",  to: "bS2" },
  { from: "bS2", to: "bS1" },
  { from: "bS1", to: "bM2" },
];

export function getNextBlocks(block: BlockId): BlockId[] {
  return ADJACENCY.filter((a) => a.from === block).map((a) => a.to);
}
