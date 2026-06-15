import type { Vault, VaultSummary, ProjectReport } from "./types.js";
import { readTask, readProject } from "./store.js";
import { formatTask, formatProject, summarizeCounts } from "./format.js";

export async function loadSummary(vault: Vault, ids: string[]): Promise<VaultSummary> {
  const lines: string[] = [];
  let open = 0;
  let done = 0;
  for (const id of ids) {
    const task = readTask(vault, id);
    if (!task) continue;
    if (task.status === "open") open++;
    if (task.status === "done") done++;
    lines.push(formatTask(task));
  }
  return summarizeCounts(ids.length, open, done, lines);
}

export async function loadProjectReport(vault: Vault, projectId: string): Promise<ProjectReport> {
  const project = readProject(vault, projectId);
  const label = project ? formatProject(project) : projectId;
  const lines: string[] = [];
  let openCount = 0;
  for (const task of vault.tasks.values()) {
    lines.push(formatTask(task));
    if (task.status === "open") openCount++;
  }
  return {
    project: label,
    taskCount: vault.tasks.size,
    openCount,
    lines,
  };
}

export async function buildDigest(vault: Vault, ids: string[]): Promise<VaultSummary> {
  const lines: string[] = [];
  let open = 0;
  let done = 0;
  for (const id of ids) {
    const task = readTask(vault, id);
    if (!task) continue;
    if (task.status === "open") open++;
    if (task.status === "done") done++;
    lines.push(formatTask(task));
  }
  return summarizeCounts(ids.length, open, done, lines);
}

export async function recountOpen(vault: Vault, ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const task = readTask(vault, id);
    if (task && task.status === "open") count++;
  }
  return count;
}
