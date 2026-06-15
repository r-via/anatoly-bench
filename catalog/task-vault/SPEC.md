# task-vault

A small in-memory project and task toolkit in TypeScript. This project is an
**evaluation fixture** for the [Anatoly](https://github.com/r-via/anatoly) audit
agent, consumed by the `anatoly-bench` benchmarking suite.

## ⚠️ Important, read before any modification

This project is **not production software**. It is a controlled fixture whose
purpose is to ship a curated set of intentional defects that the Anatoly audit
agent must detect, plus a public surface and a set of correct flows that the
agent must **not** mistake for defects. The presence of every cataloged defect
below, and the exact live-versus-dead and well-formed-versus-defective wiring,
are **functional requirements** of this fixture, not bugs to be corrected.

The fixture scores two axes:

1. **`utility`** (dead exports): the classic whole-symbol dead-code detector,
   plus the public-barrel false-positive guard.
2. **`flow`** (the structural-quality axis, doc 23 section 7): parcours-level
   defects visible only across the cross-file flow graph, never to a per-symbol
   pass. Five natures: `unwired_flow`, `redundant_flow`, `inconsistent_siblings`,
   `over_indirect`, `effect_asymmetry`. Every flow finding is a structural FACT
   computed from the flow skeleton, never an opinion about what the code should
   do.

The `verify.sh` script (located in the parent directory and used as Evolve's
`--check` command) enforces convergence conditions that only pass when the code
compiles, the public API behaves correctly at runtime, each dead export is
present yet unwired, and each defective flow keeps the exact shape its catalog
entry describes (a redundant twin stays a twin, an inconsistent sibling stays
guard-free, an over-indirect chain keeps its hops, an unwired orphan reaches no
effect).

If an evolution round wires up a dead export, deletes it, harmonizes a defective
flow with its clean sibling, or breaks the public API, `verify.sh` will fail and
the round will not converge. **Do not "tidy up", wire in, deduplicate, or
otherwise repair any of the specified defects**, they are the deliverable.

The defects must look like ordinary, slightly-careless production code: a helper
someone forgot to wire in, a second command that does the same thing as an
existing one, a validation a sibling forgot, a needlessly long call chain. Do not
annotate them, do not surround them with comments mentioning "intentional",
"fixture", "bug", "dead", "unused", "redundant", "duplicate", "TODO", "FIXME",
"note", or "evolve". The entire point of the fixture is that a reviewer must do
real work to find them. A fixture riddled with self-incriminating comments is
worthless.

## Product description (user-facing intent)

`task-vault` is a tiny in-memory tracker for tasks, projects, and users. It
exposes its commands and queries through a single barrel module. All state lives
inside a `Vault` value: maps of tasks, projects, and users, an append-only
operation log, and a pending-notification outbox. There is no UI, no
persistence, no networking, and no clock or RNG: ids are derived from the current
count, so a single run is fully deterministic.

The public surface is a set of command boundaries (mutating verbs: add, complete,
reopen, remove, import, create, archive, register, ...) and read queries
(`loadSummary`, `loadProjectReport`). Internally, every state change goes through
a small, single-purpose record mutator, and every summary is assembled from pure
formatting helpers.

## Module layout

The project must be organized exactly as follows. Do not add, remove, or rename
files.

```
project/
├── package.json          (seeded, do not modify)
├── tsconfig.json         (seeded)
├── README.md             (seeded, the neutral user-facing README, do not modify)
└── src/
    ├── index.ts          single barrel re-export of the public surface
    ├── types.ts          Task, Project, User, TaskStatus, Vault, VaultSummary, ProjectReport
    ├── ids.ts            nextId() (pure)
    ├── store.ts          createVault() + the single-purpose record mutators + pure reads
    ├── audit.ts          appendLog() (the operation-log effect)
    ├── notify.ts         enqueueNotice() (the outbox effect)
    ├── format.ts         formatTask(), formatProject(), summarizeCounts(), renderLine(), isBlank(), and the dead LEGACY_TEMPLATE
    ├── tasks.ts          the task command boundaries (live, defective, and dead)
    ├── projects.ts       the project command boundaries (live, defective, and dead)
    ├── users.ts          the user command boundaries (live, defective, and dead)
    ├── query.ts          loadSummary(), loadProjectReport() (async reads) and the dead async queries
    └── legacy.ts         the dead computeBacklog() and the dead LegacyVault type
```

The project ships **no test suite** and **no JSDoc**. This is intentional: the
`tests` and `documentation` axes are excluded from this fixture's scored axes
(see `scored_axes` in the defect catalog). Do not add a test directory, a test
runner, a test framework, or JSDoc blocks.

## Types (`src/types.ts`)

```ts
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
```

## The effects (state mutators and side-effect leaves)

These live in `store.ts`, `audit.ts`, and `notify.ts`. Each is a single-purpose
effect. The flow walk treats them as the terminal effects of a parcours. They
must each be reachable (referenced by at least one command module), so a correct
`utility` audit never flags them dead.

Store mutators (`store.ts`, each a `stateful` effect; each calls `appendLog`):

- `createVault(): Vault` returns a fresh `{ tasks, projects, users, log, outbox }`
  with empty containers. No external effect.
- `insertTask(vault, task): void` sets the task in `vault.tasks` and logs
  `insert task <id>`.
- `markTaskDone(vault, id): void` sets the task's status to `"done"` and logs
  `update task <id>`. A no-op if the id is unknown.
- `markTaskOpen(vault, id): void` sets the task's status to `"open"` and logs
  `update task <id>`. A no-op if the id is unknown.
- `removeTask(vault, id): void` deletes the task and logs `remove task <id>`.
- `setTaskNote(vault, id, note): void` writes the task's `note` and logs
  `update task <id>`. A no-op if the id is unknown.
- `setTaskAssignee(vault, id, assignee): void` writes the task's `assignee` and
  logs `update task <id>`. A no-op if the id is unknown.
- `insertProject(vault, project): void` sets the project and logs
  `insert project <id>`.
- `archiveProjectRecord(vault, id): void` sets the project's status to
  `"archived"` and logs `update project <id>`. A no-op if the id is unknown.
- `setProjectName(vault, id, name): void` writes the project's `name` and logs
  `update project <id>`. A no-op if the id is unknown.
- `insertUser(vault, user): void` sets the user and logs `insert user <id>`.
- `readTask(vault, id): Task | undefined` returns `vault.tasks.get(id)`. Pure.
  It is the existence guard `completeTask` / `reopenTask` / `removeTaskCmd`
  perform before mutating.
- `readProject(vault, id): Project | undefined` returns `vault.projects.get(id)`.
  Pure. The existence guard `archiveProject` performs.
- `readUser(vault, id): User | undefined` returns `vault.users.get(id)`. Pure.
  The uniqueness guard `registerUser` performs before inserting a user.

Operation-log effect (`audit.ts`, `stateful`):

- `appendLog(vault, line): void` pushes `line` onto `vault.log`. Called by every
  store mutator above.

Outbox effect (`notify.ts`, `sideEffectful`):

- `enqueueNotice(vault, line): void` pushes `line` onto `vault.outbox`.

Pure helpers (`ids.ts`, `format.ts`):

- `nextId(prefix, count): string` returns `` `${prefix}${count + 1}` ``. Pure.
- `formatTask(task): string` returns a status-boxed line such as `[x] t2: review`
  for a done task or `[ ] t1: write` for an open one. Pure.
- `formatProject(project): string` returns a one-line project label. Pure.
- `summarizeCounts(total, open, done, lines): VaultSummary` assembles the summary
  record. Pure.
- `renderLine(label, value): string` returns `` `${label}: ${value}` ``. Pure.
- `isBlank(text): boolean` returns `true` for an empty or whitespace-only string.
  Pure. It is the title validation `addTask` and the name validation
  `createProject` perform; the inconsistent siblings (`importTask`) omit it.

## Live wiring (the false-positive guard, scored on no axis)

The following command boundaries are **correct flows**. They are the negative
control: a correct `utility` audit reports none of them dead, and a correct
`flow` audit reports none of them on any of the five natures. Each must keep the
exact shape below.

Task commands (`tasks.ts`, `sideEffectful`), each barrel-exported:

- `addTask(vault, title)`: validates the title with `isBlank` (returns early on a
  blank title), builds a `Task` (`status: "open"`, id via `nextId("t", count)`),
  and reaches the `insertTask` effect. The canonical task inserter.
- `completeTask(vault, id)`: guards existence with `readTask`, then reaches
  `markTaskDone`. The canonical task completer.
- `reopenTask(vault, id)`: guards existence with `readTask`, then reaches
  `markTaskOpen`. The teardown counterpart of completion.
- `removeTaskCmd(vault, id)`: guards existence with `readTask`, then reaches
  `removeTask`. This makes the task store **symmetric** (it has both an insert
  flow and a remove flow), so the task store carries no `effect_asymmetry`.

Project commands (`projects.ts`, `sideEffectful`), each barrel-exported:

- `createProject(vault, name)`: validates the name with `isBlank`, builds a
  `Project` (`status: "active"`, id via `nextId("p", count)`), and reaches
  `insertProject`. The canonical project creator.
- `archiveProject(vault, id)`: guards existence with `readProject`, then reaches
  `archiveProjectRecord`. This is the project store's teardown flow, so the
  project store is **symmetric** and carries no `effect_asymmetry`.

Read queries (`query.ts`, `async`), each barrel-exported:

- `loadSummary(vault, ids)`: for each id, reads via `readTask`, skips unknown
  ids, counts open versus done, formats each found task with `formatTask`, and
  returns `summarizeCounts(...)`. It must not mutate. **It reaches no effect and
  is therefore structurally unwired, yet it is a legitimate public query and must
  NOT be flagged `unwired_flow`.** It is the false-positive guard for unwired
  detection: a public, barrel-exported read is not dead intent.
- `loadProjectReport(vault, projectId)`: reads the project via `readProject` and
  its tasks via `readTask`, builds the `project` label with `formatProject`,
  renders each task line with `formatTask`, and returns a `ProjectReport`. This
  is the **live consumer** that keeps `formatProject` off the dead list (its only
  other reference is the dead `summarizeArchive`). Read-only, public, also a
  structural unwired query and also a must-not-flag guard.

Because every store mutator, every pure helper, and every command above is
referenced by a live module (or is part of the public barrel surface), none of
them may be reported dead on `utility`, and none of the correct commands may be
reported on `flow`.

## Public API (`src/index.ts`)

The barrel re-exports **exactly** the public surface: the correct commands, the
defective-but-live commands (they are public commands whose defect is in their
flow shape, not in their reachability), and the read queries, plus the types. It
must **not** re-export any dead export (the unwired orphans, `assignTask`,
`computeBacklog`, `LEGACY_TEMPLATE`, `LegacyVault`) and must not re-export the
internal mutators or helpers.

```ts
export { createVault } from "./store.js";
export {
  addTask, completeTask, reopenTask, removeTaskCmd,
  importTask, forceComplete, noteTask, annotateTask,
  completeViaPipeline, assignViaRouter,
} from "./tasks.js";
export {
  createProject, archiveProject, rushArchive,
  renameProject, retitleProject, announceProject,
} from "./projects.js";
export { registerUser, seedUser, notifyAssignee } from "./users.js";
export { loadSummary, loadProjectReport } from "./query.js";
export type {
  Task, TaskStatus, Project, User, Vault, VaultSummary, ProjectReport,
} from "./types.js";
```

## Command signatures (exact, the runtime oracle depends on them)

`verify-runtime.mts` drives the public barrel and depends on these exact
signatures and behaviours. Generate them verbatim.

Task commands (`tasks.ts`):

```ts
function addTask(vault: Vault, title: string): Task | undefined;   // blank title -> returns undefined, no insert
function completeTask(vault: Vault, id: string): void;             // guarded by readTask
function reopenTask(vault: Vault, id: string): void;               // guarded by readTask
function removeTaskCmd(vault: Vault, id: string): void;            // guarded by readTask
function importTask(vault: Vault, title: string): Task;            // NO isBlank guard, always inserts
function forceComplete(vault: Vault, id: string): void;            // NO readTask guard
function noteTask(vault: Vault, id: string, note: string): void;       // -> setTaskNote
function annotateTask(vault: Vault, id: string, note: string): void;   // twin of noteTask -> setTaskNote
function completeViaPipeline(vault: Vault, id: string): void;      // -> stageResolve -> stageApply -> stageCommit -> markTaskDone
function assignViaRouter(vault: Vault, id: string, assignee: string): void; // -> routeAssign -> dispatchAssign -> setTaskAssignee
```

Project commands (`projects.ts`):

```ts
function createProject(vault: Vault, name: string): Project | undefined; // blank name -> returns undefined
function archiveProject(vault: Vault, id: string): void;          // guarded by readProject
function rushArchive(vault: Vault, id: string): void;             // NO readProject guard
function renameProject(vault: Vault, id: string, name: string): void;    // -> setProjectName
function retitleProject(vault: Vault, id: string, name: string): void;   // twin of renameProject -> setProjectName
function announceProject(vault: Vault, id: string): void;         // -> buildPayload -> wrapPayload -> routePayload -> enqueueNotice
```

User commands (`users.ts`):

```ts
function registerUser(vault: Vault, id: string, name: string): void;  // guarded by readUser (skip if id already present)
function seedUser(vault: Vault, id: string, name: string): void;      // NO readUser guard, always inserts/overwrites
function notifyAssignee(vault: Vault, id: string): void;              // readTask, builds the line with renderLine, -> enqueueNotice (live consumer of renderLine)
```

Read queries (`query.ts`):

```ts
function loadSummary(vault: Vault, ids: string[]): Promise<VaultSummary>;
function loadProjectReport(vault: Vault, projectId: string): Promise<ProjectReport>;
```

The dead exports keep these shapes (present in source, called by nobody):

```ts
// tasks.ts
function assignTask(vault: Vault, id: string, assignee: string): void; // no out-edge
async function previewTask(vault: Vault, id: string): Promise<string>; // readTask + formatTask, no effect
async function touchTask(vault: Vault, id: string): Promise<string>;   // readTask + renderLine, no effect
// projects.ts
async function summarizeArchive(vault: Vault, id: string): Promise<string>; // readProject + formatProject
// users.ts
async function pingUser(vault: Vault, id: string): Promise<string>;   // renderLine, never enqueueNotice
// query.ts
async function buildDigest(vault: Vault, ids: string[]): Promise<VaultSummary>; // reads + summarizeCounts
async function recountOpen(vault: Vault, ids: string[]): Promise<number>;       // reads + counts
// legacy.ts
function computeBacklog(vault: Vault): number;  // reads the Map directly, no out-edge
type LegacyVault = { /* older record-shaped vault */ };
```

## Intentional defects, axis `utility` (dead exports)

Each is present in source and referenced by no other module. `verify.sh` enforces
the orphan status.

- **DEAD-ASSIGN** (`tasks.ts::assignTask`): an exported
  `assignTask(vault, id, assignee)` that re-titles a task by writing the `Map`
  directly (it references no other project function, so it has **no resolvable
  out-edge**). Not barrel-exported, imported nowhere. Because it has no out-edge,
  the flow walk emits no flow for it: it surfaces only on `utility`, never on
  `flow`. A wide-span orphaned handler.
- **DEAD-BACKLOG** (`legacy.ts::computeBacklog`): an exported
  `computeBacklog(vault)` that counts open tasks by reading the `Map` directly
  (no out-edge). Imported nowhere. The whole `legacy.ts` module is dead weight.
- **DEAD-TEMPLATE** (`format.ts::LEGACY_TEMPLATE`): an exported constant (a
  leftover format string) read nowhere.
- **DEAD-LEGACY-TYPE** (`legacy.ts::LegacyVault`): an exported `type LegacyVault`
  (an older record-shaped vault) referenced nowhere else.

The next six are **dead orphans that are ALSO unwired flows**. Each is an
`async`, not-barrel-exported, imported-nowhere function that calls at least one
pure project helper (so the walk emits a flow for it) but reaches no effect (so
the flow is `unwired: true`). Being a dead orphan is what makes the unwired flow
a defect rather than a legitimate query (contrast `loadSummary`). Each therefore
carries two findings at the same anchor: one on `utility` (DEAD) and one on
`flow` (`unwired_flow`).

- **DEAD-PREVIEW** (`tasks.ts::previewTask`): `async`, reads a task via `readTask`
  and returns its `formatTask` rendering. No write.
- **DEAD-TOUCH** (`tasks.ts::touchTask`): `async`, the name implies an update but
  the body only reads via `readTask` and builds a `renderLine` string. No write.
- **DEAD-ARCHIVE-SUMMARY** (`projects.ts::summarizeArchive`): `async`, reads a
  project via `readProject` and formats it. No write.
- **DEAD-PING** (`users.ts::pingUser`): `async`, builds a notice line via
  `renderLine` but never calls `enqueueNotice`: the intent to emit is in the
  code, the wiring is missing. No effect reached.
- **DEAD-DIGEST** (`query.ts::buildDigest`): `async`, reads several tasks and
  assembles a summary via `summarizeCounts`. No write.
- **DEAD-RECOUNT** (`query.ts::recountOpen`): `async`, counts open tasks via
  `readTask` over a list. No write.

## Intentional defects, axis `flow` (parcours-level, code-truth only)

Every flow finding is a structural fact about the flow graph. The verdict is
`NEEDS_FIX`; the `nature` field carries which of the five kinds it is.

### Nature `unwired_flow` (6)

The six dead orphans listed above (DEAD-PREVIEW, DEAD-TOUCH,
DEAD-ARCHIVE-SUMMARY, DEAD-PING, DEAD-DIGEST, DEAD-RECOUNT). The structural fact:
an entry that resolves (has out-edges) but whose path reaches no terminal effect,
and whose entry is a dead orphan (not public surface). The clean `loadSummary` /
`loadProjectReport` queries share the no-effect shape but are public, so they are
the false-positive guard, never flagged.

### Nature `redundant_flow` (4)

Two entries reach the same effect by a **structurally identical** path (same
terminal effect, same step shape). The shared effects here are touched only by
their redundant pair, so no correct command is structurally twinned with them.

- **FLOW-REDUNDANT-NOTE** (`tasks.ts::noteTask`): reaches `setTaskNote` by the
  same path as `annotateTask`.
- **FLOW-REDUNDANT-ANNOTATE** (`tasks.ts::annotateTask`): the structural twin of
  `noteTask`, same effect, same steps. (Both members of the pair are cataloged:
  the redundancy implicates both flows.)
- **FLOW-REDUNDANT-RENAME** (`projects.ts::renameProject`): reaches
  `setProjectName` by the same path as `retitleProject`.
- **FLOW-REDUNDANT-RETITLE** (`projects.ts::retitleProject`): the structural twin
  of `renameProject`.

`setTaskNote` and `setProjectName` are reached by no correct command, so no
control is ever a redundant twin.

### Nature `inconsistent_siblings` (4)

One flow reaches an effect that a sibling flow also reaches, but it omits a guard
or validation the sibling performs. The finding is asymmetric: only the deficient
sibling is anchored; the well-formed sibling is the reference and is not flagged.

- **FLOW-INCONSISTENT-IMPORT** (`tasks.ts::importTask`): reaches `insertTask` like
  `addTask`, but omits the title validation `addTask` performs.
- **FLOW-INCONSISTENT-FORCE** (`tasks.ts::forceComplete`): reaches `markTaskDone`
  like `completeTask`, but omits the existence guard (`readTask`) `completeTask`
  performs.
- **FLOW-INCONSISTENT-RUSH** (`projects.ts::rushArchive`): reaches
  `archiveProjectRecord` like `archiveProject`, but omits the existence guard
  `archiveProject` performs.
- **FLOW-INCONSISTENT-SEED** (`users.ts::seedUser`): reaches `insertUser` like
  `registerUser`, but omits the uniqueness guard `registerUser` performs.

### Nature `over_indirect` (3)

An entry reaches a single trivial effect through a long chain of pure
pass-through hops, where a sibling reaches the same kind of effect in one hop.
The intermediate hop helpers are private and used only by their chain (so they
are not dead). The structural fact: path length from entry to terminal effect at
or above the indirection cap.

- **FLOW-OVERINDIRECT-PIPELINE** (`tasks.ts::completeViaPipeline`): reaches
  `markTaskDone` through three private pass-through hops (`stageResolve` ->
  `stageApply` -> `stageCommit`), where `completeTask` reaches it directly.
- **FLOW-OVERINDIRECT-ROUTER** (`tasks.ts::assignViaRouter`): reaches
  `setTaskAssignee` through `routeAssign` -> `dispatchAssign`.
- **FLOW-OVERINDIRECT-ANNOUNCE** (`projects.ts::announceProject`): reaches
  `enqueueNotice` through `buildPayload` -> `wrapPayload` -> `routePayload`.

### Nature `effect_asymmetry` (2)

A create-shaped flow whose store or sink has no corresponding teardown flow.
Anchored on the create entry.

- **FLOW-ASYMMETRY-USER** (`users.ts::registerUser`): reaches `insertUser`, but no
  flow reaches any user teardown effect (there is no user removal or archival
  mutator anywhere). The user store has a create flow and no inverse. (The task
  and project stores are symmetric via `removeTaskCmd` and `archiveProject`, so
  they carry no asymmetry: this is what keeps the asymmetry detector from firing
  on the correct stores.)
- **FLOW-ASYMMETRY-OUTBOX** (`users.ts::notifyAssignee`): reaches `enqueueNotice`,
  but no flow ever drains, clears, or reads the outbox. The outbox is push-only:
  an enqueue with no corresponding consume flow.

## Flow-phase structural expectations (inspected via flows.json)

The deterministic, LLM-free `flows` phase (doc 23, Stage 1) writes
`.anatoly/state/internal-flows/flows.json`. The `flow` axis (doc 23 section 7)
consumes that artifact. For the converged tree, expect the walk to root entry
flows at every barrel-exported command and at each `async` dead orphan, and:

- `addTask`, `completeTask`, `reopenTask`, `removeTaskCmd`, `createProject`,
  `archiveProject`, and every defective-but-live command reach a state-mutation
  effect, so they are `unwired: false`.
- the six dead orphans (`previewTask`, `touchTask`, `summarizeArchive`,
  `pingUser`, `buildDigest`, `recountOpen`) resolve out-edges but reach no
  effect, so they are `unwired: true`.
- `loadSummary` and `loadProjectReport` are `unwired: true` (read-only) but are
  public surface: the `flow` axis must treat them as legitimate queries, not as
  dead intent.
- no entry flow for the internal mutators (`insertTask`, `markTaskDone`, ...) or
  the pure helpers: each has a real internal consumer, so the graph root check
  excludes them.
- no entry flow for `assignTask` or `computeBacklog`: each references no project
  function, so it has no resolvable out-edge and the walk emits nothing; they
  surface only on `utility`.

These expectations depend on the rag-index NLP summariser assigning the intended
`behavioralProfile`: the mutating commands and `notifyAssignee` /
`announceProject` as `sideEffectful`, the store mutators as `stateful`, the read
queries and the dead orphans as `async`, and the pure helpers as pure. Keep each
body unambiguous so classification is stable.

## Notes for the evolution agent

- The files `package.json`, `tsconfig.json`, and `README.md` in `project/` are
  **seeded** and must not be modified. Generate everything else (the `src/` tree)
  to match this spec.
- Generate exactly the modules and symbols enumerated above. Do not add helper
  modules, abstraction layers, config loaders, plugin systems, validation
  libraries, logging frameworks, or CLI entry points beyond those listed.
- Do **not** add a test directory, any test files, or any test framework (no
  Jest, Vitest, or runner in `package.json`). Do **not** add ESLint, Prettier,
  Husky, or any tooling not already seeded.
- Do **not** add comments anywhere that hint at any defect (no `// unused`, no
  `// dead`, no `// redundant`, no `// duplicate`, no `// TODO`, no `// FIXME`,
  no `// note`, no `// intentional`, no `// fixture`, no `// evolve`).
- Do **not** introduce any defect or dead symbol beyond those cataloged. A
  spurious dead export or an accidentally redundant or unguarded flow corrupts
  the precision of the benchmark.
- Do **not** "repair" a defect to make the code feel complete: do not wire in a
  dead orphan, do not deduplicate a redundant pair, do not add the missing guard
  to an inconsistent sibling, do not shorten an over-indirect chain, do not add
  the missing teardown flow for an asymmetric store. Their defective shape is the
  requirement.
- Write every command, every store mutator, and every private hop helper as a
  `function` declaration (not an arrow const), with its closing brace at column
  zero. This keeps each parcours boundary unambiguous (the verifier extracts a
  function body from its signature to its closing brace to confirm which guards
  and effects it reaches). Only the dead constant and the types are `const` /
  `type`.
- The guard a sibling omits is a named call, not an inline expression:
  `completeTask` / `reopenTask` / `removeTaskCmd` call `readTask`, `archiveProject`
  calls `readProject`, `registerUser` calls `readUser`, `addTask` / `createProject`
  call `isBlank`. The inconsistent siblings (`forceComplete`, `rushArchive`,
  `seedUser`, `importTask`) reach the same effect but must NOT call that guard.
- Variable and parameter names should be ordinary and plausible.
- The hard convergence signals are: the public API behaves correctly when driven
  by `verify-runtime.mts`, each dead export is present yet imported by no other
  module, and each defective flow keeps the exact structural shape its catalog
  entry describes.

## Defect catalog

The block below is parsed by the `anatoly-bench` scorer to compare Anatoly's
findings against the expected ground truth. Do not modify, reformat, or remove
the block, its markers, or the YAML keys.

<!-- BUGS-CATALOG-START -->
```yaml
fixture: task-vault
language: typescript
project_path: ./project

# Axes this fixture scores. `utility` exercises dead-export detection and the
# public-barrel false-positive guard. `flow` (doc 23 section 7) exercises the
# parcours-level structural-quality axis: defects visible only across the
# cross-file flow graph, anchored on a (file, symbol) so the existing scorer
# matches them with no new anchor machinery. Findings on any other axis are a
# precision error; those axes are disabled in .anatoly.yml. global_f1 is the
# bipartite-matched F1 across the two scored axes; per_axis.utility.f1 and
# per_axis.flow.f1 are reported separately.
scored_axes:
  - utility
  - flow

violations:
  # --- axis: utility (dead exports) ---------------------------------------
  - id: DEAD-ASSIGN
    axis: utility
    file: src/tasks.ts
    symbol: assignTask
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-exported-handler
    description: |
      assignTask is exported from tasks.ts, neither re-exported by the barrel nor
      imported anywhere. It references no project function (no out-edge), so the
      flow walk emits nothing for it: utility-only. Its live siblings addTask /
      completeTask keep the module alive, so only this export is dead.

  - id: DEAD-BACKLOG
    axis: utility
    file: src/legacy.ts
    symbol: computeBacklog
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-module-function
    description: |
      computeBacklog is exported from legacy.ts but imported nowhere. The whole
      legacy.ts module is dead weight.

  - id: DEAD-TEMPLATE
    axis: utility
    file: src/format.ts
    symbol: LEGACY_TEMPLATE
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-export-constant
    description: |
      Exported constant LEGACY_TEMPLATE (a leftover format string) is read
      nowhere in the project.

  - id: DEAD-LEGACY-TYPE
    axis: utility
    file: src/legacy.ts
    symbol: LegacyVault
    expected_verdict: DEAD
    difficulty: trivial
    nature: dead-type-export
    description: |
      Exported type alias LegacyVault (an older vault shape) is referenced
      nowhere else in the project.

  - id: DEAD-PREVIEW
    axis: utility
    file: src/tasks.ts
    symbol: previewTask
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-unwired-entry
    description: |
      previewTask is an async, not-barrel-exported, imported-nowhere function
      that reads a task and returns its formatTask rendering. Dead on utility AND
      the unwired entry of a flow (see FLOW-UNWIRED-PREVIEW): a rich orphan.

  - id: DEAD-TOUCH
    axis: utility
    file: src/tasks.ts
    symbol: touchTask
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-unwired-entry
    description: |
      touchTask is async, not barrel-exported, imported nowhere; the name implies
      an update but the body only reads and renders a line. Dead on utility AND
      unwired on flow (FLOW-UNWIRED-TOUCH).

  - id: DEAD-ARCHIVE-SUMMARY
    axis: utility
    file: src/projects.ts
    symbol: summarizeArchive
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-unwired-entry
    description: |
      summarizeArchive is async, not barrel-exported, imported nowhere; reads a
      project and formats it, no write. Dead on utility AND unwired on flow
      (FLOW-UNWIRED-ARCHIVE).

  - id: DEAD-PING
    axis: utility
    file: src/users.ts
    symbol: pingUser
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-unwired-entry
    description: |
      pingUser is async, not barrel-exported, imported nowhere; builds a notice
      line but never calls enqueueNotice (the emit is unwired). Dead on utility
      AND unwired on flow (FLOW-UNWIRED-PING).

  - id: DEAD-DIGEST
    axis: utility
    file: src/query.ts
    symbol: buildDigest
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-unwired-entry
    description: |
      buildDigest is async, not barrel-exported, imported nowhere; reads several
      tasks and assembles a summary, no write. Dead on utility AND unwired on
      flow (FLOW-UNWIRED-DIGEST).

  - id: DEAD-RECOUNT
    axis: utility
    file: src/query.ts
    symbol: recountOpen
    expected_verdict: DEAD
    difficulty: medium
    nature: orphaned-unwired-entry
    description: |
      recountOpen is async, not barrel-exported, imported nowhere; counts open
      tasks over a list, no write. Dead on utility AND unwired on flow
      (FLOW-UNWIRED-RECOUNT).

  # --- axis: flow, nature unwired_flow ------------------------------------
  - id: FLOW-UNWIRED-PREVIEW
    axis: flow
    file: src/tasks.ts
    symbol: previewTask
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: unwired_flow
    description: |
      Dead-orphan entry that resolves out-edges (readTask, formatTask) but reaches
      no terminal effect: candidate dead intent. Not loadSummary (public), so it
      is a defect, not a legitimate query.

  - id: FLOW-UNWIRED-TOUCH
    axis: flow
    file: src/tasks.ts
    symbol: touchTask
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: unwired_flow
    description: |
      Dead-orphan entry, out-edges to pure reads/format only, no effect reached.

  - id: FLOW-UNWIRED-ARCHIVE
    axis: flow
    file: src/projects.ts
    symbol: summarizeArchive
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: unwired_flow
    description: |
      Dead-orphan entry, reads and formats a project, no effect reached.

  - id: FLOW-UNWIRED-PING
    axis: flow
    file: src/users.ts
    symbol: pingUser
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: unwired_flow
    description: |
      Dead-orphan entry that builds a notice line but never reaches enqueueNotice:
      the emit effect is unwired. The clearest dead-intent shape.

  - id: FLOW-UNWIRED-DIGEST
    axis: flow
    file: src/query.ts
    symbol: buildDigest
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: unwired_flow
    description: |
      Dead-orphan entry, reads several tasks and summarizes, no effect reached.

  - id: FLOW-UNWIRED-RECOUNT
    axis: flow
    file: src/query.ts
    symbol: recountOpen
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: unwired_flow
    description: |
      Dead-orphan entry, counts open tasks, no effect reached.

  # --- axis: flow, nature redundant_flow ----------------------------------
  - id: FLOW-REDUNDANT-NOTE
    axis: flow
    file: src/tasks.ts
    symbol: noteTask
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: redundant_flow
    description: |
      noteTask reaches setTaskNote by a structurally identical path to
      annotateTask. The two are redundant parcours; setTaskNote is reached by no
      correct command, so no control is twinned.

  - id: FLOW-REDUNDANT-ANNOTATE
    axis: flow
    file: src/tasks.ts
    symbol: annotateTask
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: redundant_flow
    description: |
      The structural twin of noteTask: same terminal effect (setTaskNote), same
      step shape. Both members of the redundant pair are cataloged.

  - id: FLOW-REDUNDANT-RENAME
    axis: flow
    file: src/projects.ts
    symbol: renameProject
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: redundant_flow
    description: |
      renameProject reaches setProjectName by a structurally identical path to
      retitleProject.

  - id: FLOW-REDUNDANT-RETITLE
    axis: flow
    file: src/projects.ts
    symbol: retitleProject
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: redundant_flow
    description: |
      The structural twin of renameProject: same effect (setProjectName), same
      step shape.

  # --- axis: flow, nature inconsistent_siblings ---------------------------
  - id: FLOW-INCONSISTENT-IMPORT
    axis: flow
    file: src/tasks.ts
    symbol: importTask
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: inconsistent_siblings
    description: |
      importTask reaches insertTask like addTask but omits the title validation
      addTask performs. Only the deficient sibling is anchored; addTask is the
      reference and is not flagged.

  - id: FLOW-INCONSISTENT-FORCE
    axis: flow
    file: src/tasks.ts
    symbol: forceComplete
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: inconsistent_siblings
    description: |
      forceComplete reaches markTaskDone like completeTask but omits the existence
      guard (readTask) completeTask performs.

  - id: FLOW-INCONSISTENT-RUSH
    axis: flow
    file: src/projects.ts
    symbol: rushArchive
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: inconsistent_siblings
    description: |
      rushArchive reaches archiveProjectRecord like archiveProject but omits the
      existence guard archiveProject performs.

  - id: FLOW-INCONSISTENT-SEED
    axis: flow
    file: src/users.ts
    symbol: seedUser
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: inconsistent_siblings
    description: |
      seedUser reaches insertUser like registerUser but omits the uniqueness guard
      registerUser performs.

  # --- axis: flow, nature over_indirect -----------------------------------
  - id: FLOW-OVERINDIRECT-PIPELINE
    axis: flow
    file: src/tasks.ts
    symbol: completeViaPipeline
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: over_indirect
    description: |
      completeViaPipeline reaches markTaskDone through three private pass-through
      hops (stageResolve, stageApply, stageCommit), where completeTask reaches it
      directly. A long chain for a one-field write.

  - id: FLOW-OVERINDIRECT-ROUTER
    axis: flow
    file: src/tasks.ts
    symbol: assignViaRouter
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: over_indirect
    description: |
      assignViaRouter reaches setTaskAssignee through routeAssign and
      dispatchAssign: pass-through indirection for one field.

  - id: FLOW-OVERINDIRECT-ANNOUNCE
    axis: flow
    file: src/projects.ts
    symbol: announceProject
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: over_indirect
    description: |
      announceProject reaches enqueueNotice through buildPayload, wrapPayload, and
      routePayload: three pass-through hops for one enqueue.

  # --- axis: flow, nature effect_asymmetry --------------------------------
  - id: FLOW-ASYMMETRY-USER
    axis: flow
    file: src/users.ts
    symbol: registerUser
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: effect_asymmetry
    description: |
      registerUser reaches insertUser, but no flow reaches any user teardown
      effect: the user store has a create flow and no inverse. The task and
      project stores are symmetric (removeTaskCmd, archiveProject), so they are
      not flagged: that is the asymmetry false-positive guard.

  - id: FLOW-ASYMMETRY-OUTBOX
    axis: flow
    file: src/users.ts
    symbol: notifyAssignee
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: effect_asymmetry
    description: |
      notifyAssignee reaches enqueueNotice, but no flow ever drains or consumes
      the outbox: a push-only sink with no consume flow.

# Files with no expected finding on any scored axis. index.ts, types.ts, ids.ts,
# store.ts, audit.ts, and notify.ts hold only the barrel, the types, and the live
# helpers and effects, which are the false-positive guard: a correct audit reports
# none of them on utility or flow, even though the public surface is reachable
# only through the re-export barrel.
clean_files:
  - src/index.ts
  - src/types.ts
  - src/ids.ts
  - src/store.ts
  - src/audit.ts
  - src/notify.ts
```
<!-- BUGS-CATALOG-END -->
