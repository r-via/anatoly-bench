import type {
  Axis,
  AxisScore,
  Finding,
  ScoreReport,
  SpecCatalog,
  Verdict,
  Violation,
} from "./types.js";
import { ALL_AXES } from "./types.js";

// Expected verdict (from the spec catalog) → set of Finding.verdict values
// that count as a match. UNCOVERED on the expected side accepts both NONE
// and WEAK verdicts from Anatoly; UNDOCUMENTED accepts PARTIAL as well.
const VERDICT_COMPAT: Record<Verdict, Verdict[]> = {
  NEEDS_FIX: ["NEEDS_FIX"],
  DEAD: ["DEAD"],
  DUPLICATE: ["DUPLICATE"],
  OVER: ["OVER"],
  UNCOVERED: ["UNCOVERED"],
  UNDOCUMENTED: ["UNDOCUMENTED"],
  OK: ["OK"],
  NONE: ["OK"],
};

const DEFAULT_LINE_TOLERANCE = 5;

function verdictsMatch(expected: Verdict, actual: Verdict): boolean {
  return (VERDICT_COMPAT[expected] ?? [expected]).includes(actual);
}

function filesMatch(v: Violation, f: Finding): boolean {
  if (v.scope === "project-wide") return true;
  if (!v.file) return true;
  return v.file === f.file;
}

function linesMatch(v: Violation, f: Finding): boolean {
  if (v.line_hint === undefined) return true;
  if (f.line === undefined) return true;
  const tol = v.line_tolerance ?? DEFAULT_LINE_TOLERANCE;
  return Math.abs(f.line - v.line_hint) <= tol;
}

function symbolsMatch(v: Violation, f: Finding): boolean {
  const expected = new Set<string>();
  if (v.symbol) expected.add(v.symbol);
  if (v.symbols) for (const s of v.symbols) expected.add(s);
  if (expected.size === 0) return true;
  if (!f.symbol) return true;
  return expected.has(f.symbol);
}

function canMatch(v: Violation, f: Finding): boolean {
  return (
    v.axis === f.axis &&
    verdictsMatch(v.expected_verdict, f.verdict) &&
    filesMatch(v, f) &&
    linesMatch(v, f) &&
    symbolsMatch(v, f)
  );
}

function difficultyRank(d: string | undefined): number {
  return d === "hard" ? 3 : d === "medium" ? 2 : 1;
}

function f1(tp: number, fp: number, fn: number): {
  precision: number;
  recall: number;
  f1: number;
} {
  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
  const f1Val =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return { precision, recall, f1: f1Val };
}

// Resolve the list of axes that contribute to the global F1. If the spec
// declares scored_axes, use it verbatim. Otherwise fall back to the union
// of axes that either have expectations in the catalog or have findings
// in Anatoly's report — avoids penalising fixtures that don't exercise
// every axis but also don't declare a scope.
function resolveScoredAxes(spec: SpecCatalog, findings: Finding[]): Axis[] {
  if (spec.scored_axes && spec.scored_axes.length > 0) {
    return spec.scored_axes;
  }
  const axesWithExpectations = new Set(spec.violations.map((v) => v.axis));
  const axesWithFindings = new Set(findings.map((f) => f.axis));
  return ALL_AXES.filter(
    (a) => axesWithExpectations.has(a) || axesWithFindings.has(a),
  );
}

export function score(spec: SpecCatalog, findings: Finding[]): ScoreReport {
  const scoredAxes = resolveScoredAxes(spec, findings);
  const scoredSet = new Set(scoredAxes);

  const byAxis: Partial<Record<Axis, AxisScore>> = {};
  const misses: Violation[] = [];
  const falsePositives: Finding[] = [];
  const unscoredFindings: Finding[] = [];

  for (const axis of ALL_AXES) {
    const axisViolations = spec.violations.filter((v) => v.axis === axis);
    const axisFindings = findings.filter((f) => f.axis === axis);

    if (!scoredSet.has(axis)) {
      // Axis is out of scope — findings are preserved for visibility but
      // not matched, not counted toward global F1.
      unscoredFindings.push(...axisFindings);
      continue;
    }

    if (axisViolations.length === 0 && axisFindings.length === 0) continue;

    // Greedy bipartite matching: hardest violations match first, so they
    // get their preferred finding when multiple could satisfy them.
    const matchedFindings = new Set<Finding>();
    const matchedViolations = new Set<Violation>();
    const sortedViolations = [...axisViolations].sort(
      (a, b) => difficultyRank(b.difficulty) - difficultyRank(a.difficulty),
    );
    for (const v of sortedViolations) {
      for (const f of axisFindings) {
        if (matchedFindings.has(f)) continue;
        if (!canMatch(v, f)) continue;
        matchedFindings.add(f);
        matchedViolations.add(v);
        break;
      }
    }

    const tp = matchedViolations.size;
    const fn = axisViolations.length - tp;
    const fp = axisFindings.length - matchedFindings.size;
    const { precision, recall, f1: f1Val } = f1(tp, fp, fn);
    byAxis[axis] = { tp, fp, fn, precision, recall, f1: f1Val };

    for (const v of axisViolations) if (!matchedViolations.has(v)) misses.push(v);
    for (const f of axisFindings) if (!matchedFindings.has(f)) falsePositives.push(f);
  }

  const axisScores = Object.values(byAxis) as AxisScore[];
  const globalF1 =
    axisScores.length === 0
      ? 0
      : axisScores.reduce((a, s) => a + s.f1, 0) / axisScores.length;

  return {
    fixture: spec.fixture,
    global_f1: globalF1,
    scored_axes: scoredAxes,
    per_axis: byAxis,
    misses,
    false_positives: falsePositives,
    unscored_findings: unscoredFindings,
  };
}

// Render a ScoreReport as a human-readable Markdown document.
export function renderMarkdown(report: ScoreReport): string {
  const lines: string[] = [];
  lines.push(`# Anatoly Bench Score — ${report.fixture}`);
  lines.push("");
  lines.push(`**Global F1:** ${(report.global_f1 * 100).toFixed(1)}%`);
  lines.push("");
  lines.push(`**Scored axes:** ${report.scored_axes.join(", ")}`);
  lines.push("");
  lines.push("## Per-axis scores");
  lines.push("");
  lines.push("| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |");
  lines.push("|------|:------:|---:|------:|----------:|---:|---:|---:|");
  const scoredSet = new Set(report.scored_axes);
  for (const axis of ALL_AXES) {
    const s = report.per_axis[axis];
    const inScope = scoredSet.has(axis);
    if (!s) {
      lines.push(`| ${axis} | ${inScope ? "✓" : "—"} | — | — | — | 0 | 0 | 0 |`);
      continue;
    }
    lines.push(
      `| ${axis} | ✓ | ${(s.f1 * 100).toFixed(1)}% | ${(s.recall * 100).toFixed(1)}% | ${(s.precision * 100).toFixed(1)}% | ${s.tp} | ${s.fp} | ${s.fn} |`,
    );
  }
  lines.push("");
  if (report.misses.length > 0) {
    lines.push(`## Misses (${report.misses.length})`);
    lines.push("");
    lines.push("Cataloged violations that Anatoly did not flag.");
    lines.push("");
    for (const v of report.misses) {
      const where =
        v.scope === "project-wide"
          ? "project-wide"
          : `${v.file ?? "?"}${v.line_hint ? `:${v.line_hint}` : ""}${v.symbol ? ` (${v.symbol})` : ""}`;
      lines.push(
        `- **[${v.axis} · ${v.difficulty}] ${v.id}** — ${where} — expected verdict \`${v.expected_verdict}\` (${v.nature})`,
      );
    }
    lines.push("");
  }
  if (report.false_positives.length > 0) {
    lines.push(`## False positives (${report.false_positives.length})`);
    lines.push("");
    lines.push("Findings Anatoly emitted on scored axes without a matching cataloged violation.");
    lines.push("");
    for (const f of report.false_positives) {
      lines.push(renderFindingBullet(f));
    }
    lines.push("");
  }
  if (report.unscored_findings.length > 0) {
    lines.push(`## Unscored findings (${report.unscored_findings.length})`);
    lines.push("");
    lines.push(
      "Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.",
    );
    lines.push("");
    const byAxisMap = new Map<Axis, Finding[]>();
    for (const f of report.unscored_findings) {
      const list = byAxisMap.get(f.axis) ?? [];
      list.push(f);
      byAxisMap.set(f.axis, list);
    }
    for (const [axis, list] of byAxisMap) {
      lines.push(`### ${axis} (${list.length})`);
      lines.push("");
      for (const f of list) {
        lines.push(renderFindingBullet(f));
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

function renderFindingBullet(f: Finding): string {
  const where = `${f.file}${f.line ? `:${f.line}` : ""}${f.symbol ? ` (${f.symbol})` : ""}`;
  const reasonSnippet = f.reason
    ? ` — _${f.reason.slice(0, 200).replace(/\n/g, " ")}${f.reason.length > 200 ? "…" : ""}_`
    : "";
  return `- **[${f.axis}] \`${f.verdict}\`** — ${where}${reasonSnippet}`;
}
