import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";
import type { SpecCatalog } from "./types.js";

const START_MARKER = "<!-- BUGS-CATALOG-START -->";
const END_MARKER = "<!-- BUGS-CATALOG-END -->";

export async function parseSpec(path: string): Promise<SpecCatalog> {
  const raw = await readFile(path, "utf-8");
  const startIdx = raw.indexOf(START_MARKER);
  const endIdx = raw.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error(
      `SPEC ${path}: BUGS-CATALOG markers not found or in wrong order`,
    );
  }
  const block = raw.slice(startIdx + START_MARKER.length, endIdx);
  const fence = block.match(/```ya?ml\s*\n([\s\S]*?)```/);
  if (!fence || !fence[1]) {
    throw new Error(
      `SPEC ${path}: BUGS-CATALOG block contains no fenced YAML`,
    );
  }
  const parsed = parseYaml(fence[1]) as SpecCatalog;
  if (!parsed.violations || !Array.isArray(parsed.violations)) {
    throw new Error(
      `SPEC ${path}: parsed catalog has no 'violations' array`,
    );
  }
  return parsed;
}
