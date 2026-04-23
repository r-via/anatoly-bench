import type { Finding } from "./types.js";

export async function parseReport(_reportDir: string): Promise<Finding[]> {
  throw new Error(
    "parseReport: not implemented. Will read Anatoly's sharded report layout under .anatoly/report/*.",
  );
}
