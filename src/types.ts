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
  per_axis: Partial<Record<Axis, AxisScore>>;
  misses: Violation[];
  false_positives: Finding[];
}
