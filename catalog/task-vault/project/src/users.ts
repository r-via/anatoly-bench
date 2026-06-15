import type { Vault } from "./types.js";
import { insertUser, readTask, readUser } from "./store.js";
import { enqueueNotice } from "./notify.js";
import { renderLine } from "./format.js";

export function registerUser(vault: Vault, id: string, name: string): void {
  const existing = readUser(vault, id);
  if (existing) return;
  insertUser(vault, { id, name });
}

export function seedUser(vault: Vault, id: string, name: string): void {
  insertUser(vault, { id, name });
}

export function notifyAssignee(vault: Vault, id: string): void {
  const task = readTask(vault, id);
  if (!task) return;
  const line = renderLine("assigned", task.assignee ?? "none");
  enqueueNotice(vault, line);
}

export async function pingUser(vault: Vault, id: string): Promise<string> {
  const line = renderLine("ping", id);
  return line;
}
