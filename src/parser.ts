import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Axis, Finding, Verdict } from "./types.js";

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
