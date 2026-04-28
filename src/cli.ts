#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { parseSpec } from "./spec-parser.js";
import { parseReport } from "./parser.js";
import { score, renderMarkdown } from "./score.js";

const USAGE = `anatoly-bench <command> [options]

Commands:
  parse-spec <path>
      Parse a SPEC.md and print the extracted catalog as JSON.

  score --spec <path> --report <dir> [--json <path>] [--md <path>]
      Score an Anatoly report against a SPEC. <dir> should point at an
      Anatoly run directory (contains an axes/ subdirectory) — typically
      .anatoly/runs/latest or .anatoly/runs/<runId>. Prints a Markdown
      summary to stdout; optional --json and --md write the report to
      those paths as well.

  run --fixture <dir>
      Run Anatoly on a fixture then score it (not implemented yet).
`;

function getOpt(args: readonly string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  return args[i + 1];
}

async function main(): Promise<number> {
  const [, , cmd, ...rest] = process.argv;

  switch (cmd) {
    case undefined:
    case "-h":
    case "--help":
      process.stdout.write(USAGE);
      return 0;

    case "parse-spec": {
      const specPath = rest[0];
      if (!specPath) {
        process.stderr.write("parse-spec: missing <path>\n");
        return 1;
      }
      const catalog = await parseSpec(specPath);
      process.stdout.write(JSON.stringify(catalog, null, 2) + "\n");
      return 0;
    }

    case "score": {
      const specPath = getOpt(rest, "--spec");
      const reportDir = getOpt(rest, "--report");
      const jsonOut = getOpt(rest, "--json");
      const mdOut = getOpt(rest, "--md");
      if (!specPath || !reportDir) {
        process.stderr.write("score: --spec and --report are required\n");
        return 1;
      }
      const [spec, findings] = await Promise.all([
        parseSpec(specPath),
        parseReport(reportDir),
      ]);
      const report = score(spec, findings);
      const md = renderMarkdown(report);
      process.stdout.write(md + "\n");
      if (mdOut) await writeFile(mdOut, md + "\n", "utf-8");
      if (jsonOut) await writeFile(jsonOut, JSON.stringify(report, null, 2) + "\n", "utf-8");
      return 0;
    }

    case "run": {
      process.stderr.write("run: not implemented yet\n");
      return 2;
    }

    default:
      process.stderr.write(`unknown command: ${cmd}\n${USAGE}`);
      return 1;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(String(err?.stack ?? err) + "\n");
    process.exit(1);
  },
);
