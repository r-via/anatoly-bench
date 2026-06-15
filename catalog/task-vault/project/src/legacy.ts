import type { Vault } from "./types.js";

export function computeBacklog(vault: Vault): number {
  let count = 0;
  for (const task of vault.tasks.values()) {
    if (task.status === "open") count++;
  }
  return count;
}

export type LegacyVault = {
  tasks: Record<string, { id: string; title: string; status: string }>;
  projects: Record<string, { id: string; name: string }>;
  log: string[];
};
