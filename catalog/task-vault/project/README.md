# task-vault

A small in-memory toolkit for tracking tasks, projects, and users. Pure data
logic: no UI, no persistence, no networking, no clock. You create a vault, add
tasks and projects to it, register users, and read formatted summaries. The whole
surface is a set of commands and queries exposed through a single barrel module.

## Install

```bash
npm install
```

## Usage

```ts
import {
  createVault,
  addTask,
  completeTask,
  createProject,
  loadSummary,
} from "task-vault";

const vault = createVault();
const a = addTask(vault, "write the spec");
const b = addTask(vault, "review the code");
completeTask(vault, b!.id);
createProject(vault, "Anatoly");

const summary = await loadSummary(vault, [a!.id, b!.id]);
console.log(summary.open, summary.done); // 1 1
```

Every public function takes the `Vault` as its first argument. The vault holds the
task, project, and user records, an append-only operation log, and a pending
notification outbox. Nothing is stored outside it, so two vaults never share
state.

## API

State is shaped as follows:

```ts
type TaskStatus = "open" | "done";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
  note?: string;
  assignee?: string;
}

interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
}

interface User {
  id: string;
  name: string;
}

interface Vault {
  tasks: Map<string, Task>;
  projects: Map<string, Project>;
  users: Map<string, User>;
  log: string[];
  outbox: string[];
}

interface VaultSummary {
  total: number;
  open: number;
  done: number;
  lines: string[];
}

interface ProjectReport {
  project: string;
  taskCount: number;
  openCount: number;
  lines: string[];
}
```

### Constructor

- `createVault(): Vault` returns a fresh, empty, independent store.

### Task commands

- `addTask(vault, title): Task | undefined` adds a new open task and returns it; a
  blank title is rejected and returns `undefined`.
- `completeTask(vault, id): void` marks a task done.
- `reopenTask(vault, id): void` returns a task to the open state.
- `removeTaskCmd(vault, id): void` deletes a task.
- `importTask(vault, title): Task` inserts a task from a trusted source and returns
  it.
- `forceComplete(vault, id): void` marks a task done directly.
- `noteTask(vault, id, note): void` and `annotateTask(vault, id, note): void`
  attach a note to a task.
- `completeViaPipeline(vault, id): void` completes a task through the staged apply
  pipeline.
- `assignViaRouter(vault, id, assignee): void` assigns a task through the routing
  layer.

### Project commands

- `createProject(vault, name): Project | undefined` creates a new active project; a
  blank name is rejected and returns `undefined`.
- `archiveProject(vault, id): void` and `rushArchive(vault, id): void` archive a
  project.
- `renameProject(vault, id, name): void` and `retitleProject(vault, id, name): void`
  change a project's name.
- `announceProject(vault, id): void` posts a project announcement to the outbox.

### User commands

- `registerUser(vault, id, name): void` registers a user.
- `seedUser(vault, id, name): void` seeds a user record.
- `notifyAssignee(vault, id): void` posts a task notification to the outbox.

### Queries

- `loadSummary(vault, ids): Promise<VaultSummary>` reads the given task ids and
  returns a counted, line-formatted summary.
- `loadProjectReport(vault, projectId): Promise<ProjectReport>` returns a counted,
  line-formatted report for a project.

## Operating guarantees

- **Isolation.** All state lives inside the `Vault` value. `createVault()` returns
  a fresh, independent store every time.
- **Append-only log.** Every mutating call records one line in `vault.log`, in call
  order, so the sequence of operations is fully reconstructable.
- **Stable ids.** A record id is assigned once at insertion and never changes.
- **Read-only queries.** `loadSummary` and `loadProjectReport` read and format; they
  never mutate the vault.

## Build

```bash
npm install
npx tsc --noEmit
```

## License

AGPL-3.0-only.

<!-- checked-by-anatoly -->
[![Checked by Anatoly](https://img.shields.io/badge/checked%20by-Anatoly-blue)](https://github.com/r-via/anatoly)
<!-- /checked-by-anatoly -->
