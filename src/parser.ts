import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Axis, AxisStats, Finding, RunMeta, Verdict } from "./types.js";

// Directory name under axes/ → our canonical Axis.
// Anatoly's layout uses hyphenated names that already match our Axis union
// (except "best_practices" in some internal configs, which we tolerate).
const AXIS_DIR_TO_AXIS: Record<string, Axis> = {
  correction: "correction",
  utility: "utility",
  duplication: "duplication",
  overengineering: "overengineering",
  tests: "tests",
  "best-practices": "best-practices",
  best_practices: "best-practices",
  documentation: "documentation",
};

// Anatoly verdict keywords → our canonical Verdict.
// "CLEAN"/"USED"/"LEAN"/"GOOD"/"DOCUMENTED" are positive verdicts we drop
// from the Finding list (no defect to match against).
const VERDICT_MAP: Record<string, Verdict> = {
  NEEDS_FIX: "NEEDS_FIX",
  NEEDS_REFACTOR: "NEEDS_FIX",
  ERROR: "NEEDS_FIX",
  DEAD: "DEAD",
  DUPLICATE: "DUPLICATE",
  OVER: "OVER",
  NONE: "UNCOVERED",
  WEAK: "UNCOVERED",
  UNCOVERED: "UNCOVERED",
  PARTIAL: "UNDOCUMENTED",
  UNDOCUMENTED: "UNDOCUMENTED",
  OK: "OK",
  CLEAN: "OK",
  USED: "OK",
  LEAN: "OK",
  ACCEPTABLE: "OK",
  GOOD: "OK",
  DOCUMENTED: "OK",
  UNIQUE: "OK",
};

async function readJsonSilent(path: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(path, "utf-8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

// Anatoly's axisStats keys mirror the axis directory names but use snake_case
// for best-practices ("best_practices"). Normalise to our canonical Axis type.
const AXIS_STATS_KEY_TO_AXIS: Record<string, Axis> = {
  correction: "correction",
  utility: "utility",
  duplication: "duplication",
  overengineering: "overengineering",
  tests: "tests",
  best_practices: "best-practices",
  "best-practices": "best-practices",
  documentation: "documentation",
};

function parseAxisStatsEntry(raw: unknown): AxisStats | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  return {
    calls: Number(o["calls"] ?? 0),
    durationMs: Number(o["totalDurationMs"] ?? 0),
    costUsd: Number(o["totalCostUsd"] ?? 0),
    inputTokens: Number(o["totalInputTokens"] ?? 0),
    outputTokens: Number(o["totalOutputTokens"] ?? 0),
    cacheReadTokens: Number(o["totalCacheReadTokens"] ?? 0),
    cacheCreationTokens: Number(o["totalCacheCreationTokens"] ?? 0),
  };
}

export async function parseRunMeta(reportDir: string): Promise<RunMeta> {
  const runDir = await resolveRunDir(reportDir);
  const [cfg, status, metrics] = await Promise.all([
    readJsonSilent(join(runDir, "run-config.json")),
    readJsonSilent(join(runDir, "run-status.json")),
    readJsonSilent(join(runDir, "run-metrics.json")),
  ]);
  const conversations = metrics["conversations"] as Record<string, unknown> | undefined;

  // Per-axis execution metrics. Anatoly emits these under axisStats with one
  // entry per axis the run actually exercised (axes filtered out via config
  // or --axes are absent rather than zero-filled).
  const axisStatsRaw = metrics["axisStats"] as Record<string, unknown> | undefined;
  const axisStats: Partial<Record<Axis, AxisStats>> = {};
  if (axisStatsRaw) {
    for (const [k, v] of Object.entries(axisStatsRaw)) {
      const axis = AXIS_STATS_KEY_TO_AXIS[k];
      if (!axis) continue;
      const parsed = parseAxisStatsEntry(v);
      if (parsed) axisStats[axis] = parsed;
    }
  }

  // Refinement (tier 3) phase stats live under phaseStats.refinement and
  // are cross-axis. Surfaced separately so consumers can sum them in if
  // they want a true total, or display them on their own row.
  const phaseStats = metrics["phaseStats"] as Record<string, unknown> | undefined;
  const refinementStats = parseAxisStatsEntry(phaseStats?.["refinement"]);

  return {
    runId: (cfg["runId"] ?? status["runId"] ?? metrics["runId"] ?? "") as string,
    anatolyVersion: cfg["anatolyVersion"] as string | undefined,
    anatolyCommit: cfg["anatolyCommit"] as string | undefined,
    projectBranch: status["branch"] as string | undefined,
    projectCommit: status["commit"] as string | undefined,
    durationMs: metrics["durationMs"] as number | undefined,
    costUsd: metrics["costUsd"] as number | undefined,
    totalInputTokens: conversations?.["totalInputTokens"] as number | undefined,
    totalOutputTokens: conversations?.["totalOutputTokens"] as number | undefined,
    ...(Object.keys(axisStats).length > 0 ? { axisStats } : {}),
    ...(refinementStats ? { refinementStats } : {}),
  };
}

async function resolveRunDir(reportDir: string): Promise<string> {
  // If reportDir contains axes/, it's already a run dir. If reportDir IS
  // the axes/ dir, go up one level.
  const axesCandidate = join(reportDir, "axes");
  const s = await stat(axesCandidate).catch(() => null);
  if (s?.isDirectory()) return reportDir;
  // Assume reportDir is axes/ itself — parent is the run dir.
  return join(reportDir, "..");
}

export async function parseReport(reportDir: string): Promise<Finding[]> {
  // Tolerate being given either the run directory (contains axes/) or the
  // axes/ directory itself. The "latest" symlink under .anatoly/runs/ is the
  // expected entry point.
  const resolvedAxesDir = await resolveAxesDir(reportDir);
  const axisDirs = await readdir(resolvedAxesDir);
  const findings: Finding[] = [];
  for (const dirName of axisDirs) {
    const axis = AXIS_DIR_TO_AXIS[dirName];
    if (!axis) continue;
    const axisPath = join(resolvedAxesDir, dirName);
    const s = await stat(axisPath);
    if (!s.isDirectory()) continue;
    const files = await readdir(axisPath);
    const shards = files
      .filter((f) => /^shard\.\d+\.md$/.test(f))
      .sort();
    for (const shard of shards) {
      const raw = await readFile(join(axisPath, shard), "utf-8");
      findings.push(...parseShard(raw, axis));
    }
  }
  return findings;
}

async function resolveAxesDir(reportDir: string): Promise<string> {
  const candidate = join(reportDir, "axes");
  const s = await stat(candidate).catch(() => null);
  if (s && s.isDirectory()) return candidate;
  const self = await stat(reportDir).catch(() => null);
  if (!self || !self.isDirectory()) {
    throw new Error(`parseReport: ${reportDir} is not a directory`);
  }
  // Assume reportDir IS the axes/ directory.
  return reportDir;
}

function parseShard(md: string, axis: Axis): Finding[] {
  // Per-file sections are delimited by "### `path/to/file.ext`" headers,
  // optionally followed by a score suffix (" — 4.25/10" for best-practices).
  const fileHeaderRe = /^### `([^`]+)`/gm;
  const headers = [...md.matchAll(fileHeaderRe)];
  const findings: Finding[] = [];
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (!h || h.index === undefined) continue;
    const file = h[1];
    if (!file) continue;
    const start = h.index + h[0].length;
    const next = headers[i + 1];
    const end = next && next.index !== undefined ? next.index : md.length;
    const body = md.slice(start, end);
    if (axis === "best-practices") {
      findings.push(...parseBestPracticesSection(body, file, axis));
    } else {
      findings.push(...parseSymbolTable(body, file, axis));
    }
  }
  return findings;
}

// Parses tables of the form:
//   | `symbol` | L17–L27 | 🟡 NEEDS_FIX | 55% | detail text |
// The dash between line numbers is the en-dash "–" (U+2013) in Anatoly's
// output. Some rows use a single line "L14–L14" or "L14".
function parseSymbolTable(body: string, file: string, axis: Axis): Finding[] {
  const findings: Finding[] = [];
  const lines = body.split("\n");
  for (const line of lines) {
    const parsed = parseSymbolRow(line);
    if (!parsed) continue;
    const verdict = VERDICT_MAP[parsed.verdictRaw];
    if (!verdict) continue;
    if (verdict === "OK") continue;
    findings.push({
      axis,
      file,
      line: parsed.line,
      verdict,
      symbol: parsed.symbol,
      reason: parsed.reason,
    });
  }
  return findings;
}

function parseSymbolRow(line: string): {
  symbol: string;
  line: number | undefined;
  verdictRaw: string;
  reason: string;
} | null {
  if (!line.startsWith("|") || !line.endsWith("|")) return null;
  const cells = splitTableRow(line);
  if (cells.length < 5) return null;
  // Expected columns: Symbol | Lines | Verdict | Conf | Detail
  const symCell = cells[0];
  const linesCell = cells[1];
  const verdictCell = cells[2];
  const detailCell = cells[cells.length - 1];
  if (!symCell || !linesCell || !verdictCell || !detailCell) return null;
  const symMatch = symCell.match(/^`([^`]+)`$/);
  if (!symMatch || !symMatch[1]) return null;
  const lineMatch = linesCell.match(/^L(\d+)/);
  const verdictMatch = verdictCell.match(/([A-Z][A-Z_]+)/);
  if (!verdictMatch || !verdictMatch[1]) return null;
  return {
    symbol: symMatch[1],
    line: lineMatch && lineMatch[1] ? parseInt(lineMatch[1], 10) : undefined,
    verdictRaw: verdictMatch[1],
    reason: detailCell.trim(),
  };
}

function splitTableRow(row: string): string[] {
  // Strip leading and trailing pipe, then split on unescaped pipe.
  const inner = row.slice(1, -1);
  return inner.split("|").map((c) => c.trim());
}

// Best-practices shards use per-file "Failed rules:" bulleted lists instead
// of a symbol table. Each "- Rule N: ..." bullet is treated as one finding
// at file level (no symbol, no line).
function parseBestPracticesSection(body: string, file: string, axis: Axis): Finding[] {
  const findings: Finding[] = [];
  const ruleBulletRe = /^-\s+Rule\s+\d+:\s*([^\n(]+?)\s*\(([A-Z]+)\)/gm;
  for (const m of body.matchAll(ruleBulletRe)) {
    const ruleDesc = m[1];
    if (!ruleDesc) continue;
    findings.push({
      axis,
      file,
      verdict: "NEEDS_FIX",
      reason: ruleDesc.trim(),
    });
  }
  return findings;
}
