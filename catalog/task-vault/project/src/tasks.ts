import type { Task, Vault } from "./types.js";
import { nextId } from "./ids.js";
import { isBlank, formatTask, renderLine } from "./format.js";
import {
  insertTask,
  markTaskDone,
  markTaskOpen,
  removeTask,
  setTaskNote,
  setTaskAssignee,
  readTask,
} from "./store.js";

export function addTask(vault: Vault, title: string): Task | undefined {
  if (isBlank(title)) return undefined;
  const id = nextId("t", vault.tasks.size);
  const task: Task = { id, title, status: "open", createdAt: Date.now() };
  insertTask(vault, task);
  return task;
}

export function completeTask(vault: Vault, id: string): void {
  const task = readTask(vault, id);
  if (!task) return;
  markTaskDone(vault, id);
}

export function reopenTask(vault: Vault, id: string): void {
  const task = readTask(vault, id);
  if (!task) return;
  markTaskOpen(vault, id);
}

export function removeTaskCmd(vault: Vault, id: string): void {
  const task = readTask(vault, id);
  if (!task) return;
  removeTask(vault, id);
}

export function importTask(vault: Vault, title: string): Task {
  const id = nextId("t", vault.tasks.size);
  const task: Task = { id, title, status: "open", createdAt: Date.now() };
  insertTask(vault, task);
  return task;
}

export function forceComplete(vault: Vault, id: string): void {
  markTaskDone(vault, id);
}

export function noteTask(vault: Vault, id: string, note: string): void {
  setTaskNote(vault, id, note);
}

export function annotateTask(vault: Vault, id: string, note: string): void {
  setTaskNote(vault, id, note);
}

function stageResolve(vault: Vault, id: string): void {
  stageApply(vault, id);
}

function stageApply(vault: Vault, id: string): void {
  stageCommit(vault, id);
}

function stageCommit(vault: Vault, id: string): void {
  markTaskDone(vault, id);
}

export function completeViaPipeline(vault: Vault, id: string): void {
  stageResolve(vault, id);
}

function routeAssign(vault: Vault, id: string, assignee: string): void {
  dispatchAssign(vault, id, assignee);
}

function dispatchAssign(vault: Vault, id: string, assignee: string): void {
  setTaskAssignee(vault, id, assignee);
}

export function assignViaRouter(vault: Vault, id: string, assignee: string): void {
  routeAssign(vault, id, assignee);
}

export function assignTask(vault: Vault, id: string, assignee: string): void {
  const task = vault.tasks.get(id);
  if (task) {
    task.title = assignee;
  }
}

export async function previewTask(vault: Vault, id: string): Promise<string> {
  const task = readTask(vault, id);
  if (!task) return "";
  return formatTask(task);
}

export async function touchTask(vault: Vault, id: string): Promise<string> {
  const task = readTask(vault, id);
  if (!task) return "";
  return renderLine(task.id, task.title);
}
