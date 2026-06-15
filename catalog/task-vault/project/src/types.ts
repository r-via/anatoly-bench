export type TaskStatus = "open" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
  note?: string;
  assignee?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
}

export interface User {
  id: string;
  name: string;
}

export interface Vault {
  tasks: Map<string, Task>;
  projects: Map<string, Project>;
  users: Map<string, User>;
  log: string[];
  outbox: string[];
}

export interface VaultSummary {
  total: number;
  open: number;
  done: number;
  lines: string[];
}

export interface ProjectReport {
  project: string;
  taskCount: number;
  openCount: number;
  lines: string[];
}
