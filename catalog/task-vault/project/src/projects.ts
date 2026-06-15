import type { Project, Vault } from "./types.js";
import { nextId } from "./ids.js";
import { isBlank, formatProject } from "./format.js";
import {
  insertProject,
  archiveProjectRecord,
  setProjectName,
  readProject,
} from "./store.js";
import { enqueueNotice } from "./notify.js";

export function createProject(vault: Vault, name: string): Project | undefined {
  if (isBlank(name)) return undefined;
  const id = nextId("p", vault.projects.size);
  const project: Project = { id, name, status: "active" };
  insertProject(vault, project);
  return project;
}

export function archiveProject(vault: Vault, id: string): void {
  const project = readProject(vault, id);
  if (!project) return;
  archiveProjectRecord(vault, id);
}

export function rushArchive(vault: Vault, id: string): void {
  archiveProjectRecord(vault, id);
}

export function renameProject(vault: Vault, id: string, name: string): void {
  setProjectName(vault, id, name);
}

export function retitleProject(vault: Vault, id: string, name: string): void {
  setProjectName(vault, id, name);
}

function buildPayload(vault: Vault, id: string): string {
  return wrapPayload(vault, id);
}

function wrapPayload(vault: Vault, id: string): string {
  return routePayload(vault, id);
}

function routePayload(vault: Vault, id: string): string {
  const project = vault.projects.get(id);
  const label = project ? project.name : id;
  enqueueNotice(vault, `announce ${label}`);
  return label;
}

export function announceProject(vault: Vault, id: string): void {
  buildPayload(vault, id);
}

export async function summarizeArchive(vault: Vault, id: string): Promise<string> {
  const project = readProject(vault, id);
  if (!project) return "";
  return formatProject(project);
}
