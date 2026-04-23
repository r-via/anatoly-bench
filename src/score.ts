import type { Finding, ScoreReport, SpecCatalog } from "./types.js";

export function score(_spec: SpecCatalog, _findings: Finding[]): ScoreReport {
  throw new Error(
    "score: not implemented. Will perform per-axis bipartite matching between findings and expected violations.",
  );
}
