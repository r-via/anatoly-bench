export type Axis =
  | "correction"
  | "utility"
  | "duplication"
  | "overengineering"
  | "tests"
  | "best-practices"
  | "documentation";

export const ALL_AXES: readonly Axis[] = [
  "correction",
  "utility",
  "duplication",
  "overengineering",
  "tests",
  "best-practices",
  "documentation",
] as const;

export type Verdict =
  | "NEEDS_FIX"
  | "OK"
  | "DEAD"
  | "DUPLICATE"
  | "OVER"
  | "UNDOCUMENTED"
  | "UNCOVERED"
  | "NONE";

export type Difficulty = "trivial" | "medium" | "hard";

export interface Violation {
  id: string;
  axis: Axis;
  expected_verdict: Verdict;
  difficulty: Difficulty;
  nature: string;
  file?: string;
  // Accept either a single expected symbol or a list. Use a list when the
  // defect can manifest on several related symbols (e.g. an abstract
  // factory + its concrete subclass within the same file). A finding
  // matches if its symbol is equal to `symbol` or appears in `symbols`.
  symbol?: string;
  symbols?: string[];
  // Multi-location defects: a defect whose surface spans several
  // (file, symbol) pairs — typically a duplication pair where Anatoly
  // may flag either or both sides. A finding on ANY listed member
  // counts as the single TP for this violation; additional findings
  // that match other members are attributed to the same violation
  // (neither double-counted as TP nor charged as FP).
  members?: Array<{ file: string; symbol: string }>;
  scope?: "project-wide";
  line_hint?: number;
  line_tolerance?: number;
  invariant?: string;
  description?: string;
}

export interface SpecCatalog {
  fixture: string;
  language: string;
  project_path: string;
  target_rtp_lower_bound?: number;
  // Axes this fixture is designed to evaluate. Axes outside this list are
  // still parsed from Anatoly's report (for visibility) but do not
  // contribute to the global F1 score. If omitted, all axes are scored.
  scored_axes?: Axis[];
  violations: Violation[];
  clean_files?: string[];
}

export interface Finding {
  axis: Axis;
  file: string;
  line?: number;
  verdict: Verdict;
  symbol?: string;
  reason?: string;
}

export interface AxisScore {
  tp: number;
  fp: number;
  fn: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface ScoreReport {
  fixture: string;
  global_f1: number;
  scored_axes: Axis[];
  per_axis: Partial<Record<Axis, AxisScore>>;
  misses: Violation[];
  false_positives: Finding[];
  // Findings on axes not in scored_axes — kept for visibility, not scored.
  unscored_findings: Finding[];
}
