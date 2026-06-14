import type { BlockId } from "./types.js";
import { ADJACENCY } from "./network.js";

export function shortestPath(from: BlockId, to: BlockId): BlockId[] | null {
  if (from === to) return [from];

  const visited = new Set<BlockId>();
  const parent = new Map<BlockId, BlockId>();
  const queue: BlockId[] = [from];
  visited.add(from);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = ADJACENCY.filter((a) => a.from === current).map((a) => a.to);

    for (const next of neighbors) {
      if (visited.has(next)) continue;
      visited.add(next);
      parent.set(next, current);

      if (next === to) {
        const path: BlockId[] = [];
        let node: BlockId | undefined = to;
        while (node !== undefined) {
          path.unshift(node);
          node = parent.get(node);
        }
        return path;
      }

      queue.push(next);
    }
  }

  return null;
}
