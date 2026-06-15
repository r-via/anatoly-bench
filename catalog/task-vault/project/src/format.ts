import type { Task, Project, VaultSummary } from "./types.js";

export function formatTask(task: Task): string {
  const box = task.status === "done" ? "[x]" : "[ ]";
  return `${box} ${task.id}: ${task.title}`;
}

export function formatProject(project: Project): string {
  return `${project.id}: ${project.name} (${project.status})`;
}

export function summarizeCounts(
  total: number,
  open: number,
  done: number,
  lines: string[],
): VaultSummary {
  return { total, open, done, lines };
}

export function renderLine(label: string, value: string): string {
  return `${label}: ${value}`;
}

export function isBlank(text: string): boolean {
  return text.trim().length === 0;
}

export const LEGACY_TEMPLATE = "Task: %s — Status: %s";
