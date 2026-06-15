import type { Task, Project, User, Vault } from "./types.js";
import { appendLog } from "./audit.js";

export function createVault(): Vault {
  return {
    tasks: new Map(),
    projects: new Map(),
    users: new Map(),
    log: [],
    outbox: [],
  };
}

export function insertTask(vault: Vault, task: Task): void {
  vault.tasks.set(task.id, task);
  appendLog(vault, `insert task ${task.id}`);
}

export function markTaskDone(vault: Vault, id: string): void {
  const task = vault.tasks.get(id);
  if (!task) return;
  task.status = "done";
  appendLog(vault, `update task ${id}`);
}

export function markTaskOpen(vault: Vault, id: string): void {
  const task = vault.tasks.get(id);
  if (!task) return;
  task.status = "open";
  appendLog(vault, `update task ${id}`);
}

export function removeTask(vault: Vault, id: string): void {
  vault.tasks.delete(id);
  appendLog(vault, `remove task ${id}`);
}

export function setTaskNote(vault: Vault, id: string, note: string): void {
  const task = vault.tasks.get(id);
  if (!task) return;
  task.note = note;
  appendLog(vault, `update task ${id}`);
}

export function setTaskAssignee(vault: Vault, id: string, assignee: string): void {
  const task = vault.tasks.get(id);
  if (!task) return;
  task.assignee = assignee;
  appendLog(vault, `update task ${id}`);
}

export function insertProject(vault: Vault, project: Project): void {
  vault.projects.set(project.id, project);
  appendLog(vault, `insert project ${project.id}`);
}

export function archiveProjectRecord(vault: Vault, id: string): void {
  const project = vault.projects.get(id);
  if (!project) return;
  project.status = "archived";
  appendLog(vault, `update project ${id}`);
}

export function setProjectName(vault: Vault, id: string, name: string): void {
  const project = vault.projects.get(id);
  if (!project) return;
  project.name = name;
  appendLog(vault, `update project ${id}`);
}

export function insertUser(vault: Vault, user: User): void {
  vault.users.set(user.id, user);
  appendLog(vault, `insert user ${user.id}`);
}

export function readTask(vault: Vault, id: string): Task | undefined {
  return vault.tasks.get(id);
}

export function readProject(vault: Vault, id: string): Project | undefined {
  return vault.projects.get(id);
}

export function readUser(vault: Vault, id: string): User | undefined {
  return vault.users.get(id);
}
