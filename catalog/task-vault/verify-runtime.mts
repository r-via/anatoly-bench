// Deterministic runtime check for the task-vault fixture.
//
// Unlike slot-engine (Monte-Carlo RTP) and train-dispatch (a behavioural-
// invariant trace), task-vault ships its defects as DEAD EXPORTS and DEFECTIVE
// FLOW SHAPES, not as a behaviour the engine performs wrongly. So this runtime
// oracle does the opposite of train-dispatch's: it drives the LIVE public API
// and asserts it behaves CORRECTLY. That is Evolve's convergence target, the
// package must work end to end. The dead exports and defective flow shapes are
// enforced structurally by verify.sh (presence, orphan status, guard omission,
// chain hops), never here.
//
// The check imports ONLY the public barrel, the same surface a consumer sees,
// so it also proves the barrel re-exports the right names. It hardcodes the
// documented contract (README.md / SPEC.md), not whatever the source happens to
// do. The defective-but-live commands (importTask, forceComplete, rushArchive,
// seedUser, the redundant twins, the over-indirect commands) are exercised here
// too: their defect is in their flow SHAPE, not in their externally observable
// result, so they must still produce the correct end state.
//
// Lives outside project/ on purpose: the fixture must not see this file. No RNG,
// no clock dependence: a single run is the ground truth.

import {
  createVault,
  addTask,
  completeTask,
  reopenTask,
  removeTaskCmd,
  importTask,
  forceComplete,
  noteTask,
  annotateTask,
  completeViaPipeline,
  assignViaRouter,
  createProject,
  archiveProject,
  rushArchive,
  renameProject,
  retitleProject,
  announceProject,
  registerUser,
  seedUser,
  notifyAssignee,
  loadSummary,
  loadProjectReport,
} from "./project/src/index.js";

const failures: string[] = [];
function check(cond: unknown, msg: string): void {
  if (!cond) failures.push(msg);
}

// --- 1. createVault returns a fresh, empty, isolated store -----------------
const vault = createVault();
check(vault?.tasks instanceof Map && vault.tasks.size === 0, "createVault must return an empty tasks Map");
check(vault?.projects instanceof Map && vault.projects.size === 0, "createVault must return an empty projects Map");
check(vault?.users instanceof Map && vault.users.size === 0, "createVault must return an empty users Map");
check(Array.isArray(vault?.log) && vault.log.length === 0, "createVault must return an empty log");
check(Array.isArray(vault?.outbox) && vault.outbox.length === 0, "createVault must return an empty outbox");

const other = createVault();
check(
  other !== vault && other.tasks !== vault.tasks && other.log !== vault.log && other.outbox !== vault.outbox,
  "isolation: two createVault() calls must not share state",
);

// --- 2. addTask inserts an open task and logs the insert; blank is rejected -
const a = addTask(vault, "write the spec");
const b = addTask(vault, "review the code");
check(a && typeof a.id === "string" && a.id.length > 0, "addTask must return a task with a non-empty id");
check(b && b.id !== a.id, "addTask must assign distinct ids");
check(a?.status === "open", "a new task must have status \"open\"");
check(a?.title === "write the spec", "addTask must keep the given title");
check(typeof a?.createdAt === "number", "a task must carry a numeric createdAt");
check(vault.tasks.size === 2, "addTask must insert the task into the vault");
check(vault.log.filter((l) => l.includes("insert")).length === 2, "each addTask must append one insert line");

const blankBefore = vault.tasks.size;
const blank = addTask(vault, "   ");
check(blank === undefined, "addTask must return undefined on a blank title");
check(vault.tasks.size === blankBefore, "addTask must not insert a task for a blank title");

// --- 3. completeTask / reopenTask round-trip, no-op on unknown id ----------
completeTask(vault, b.id);
check(vault.tasks.get(b.id)?.status === "done", "completeTask must set status \"done\"");
check(vault.tasks.get(a.id)?.status === "open", "completeTask must not touch other tasks");
reopenTask(vault, b.id);
check(vault.tasks.get(b.id)?.status === "open", "reopenTask must set status back to \"open\"");
completeTask(vault, b.id);

const logLenBefore = vault.log.length;
let threw = false;
try {
  completeTask(vault, "does-not-exist");
} catch {
  threw = true;
}
check(!threw, "completeTask on an unknown id must not throw");
check(vault.tasks.size === 2 && vault.log.length === logLenBefore, "completeTask on an unknown id must be a no-op");

// --- 4. note / annotate (redundant twins) both write the note --------------
noteTask(vault, a.id, "first note");
check(vault.tasks.get(a.id)?.note === "first note", "noteTask must write the task note");
annotateTask(vault, a.id, "second note");
check(vault.tasks.get(a.id)?.note === "second note", "annotateTask must write the task note (twin of noteTask)");

// --- 5. assignViaRouter (over-indirect) sets the assignee ------------------
assignViaRouter(vault, a.id, "alice");
check(vault.tasks.get(a.id)?.assignee === "alice", "assignViaRouter must set the task assignee");

// --- 6. completeViaPipeline (over-indirect) completes the task -------------
const c = addTask(vault, "ship it");
completeViaPipeline(vault, c.id);
check(vault.tasks.get(c.id)?.status === "done", "completeViaPipeline must complete the task through its chain");

// --- 7. importTask (inconsistent: no isBlank guard) always inserts ---------
const importedBefore = vault.tasks.size;
const imported = importTask(vault, "");
check(imported && typeof imported.id === "string", "importTask must always return a task, even for a blank title");
check(vault.tasks.size === importedBefore + 1, "importTask must insert even a blank-titled task (no validation)");

// --- 8. forceComplete (inconsistent: no readTask guard) ---------------------
forceComplete(vault, a.id);
check(vault.tasks.get(a.id)?.status === "done", "forceComplete must complete an existing task");
let threw2 = false;
try {
  forceComplete(vault, "nope");
} catch {
  threw2 = true;
}
check(!threw2, "forceComplete on an unknown id must not throw (the mutator no-ops)");

// --- 9. removeTaskCmd deletes a task ---------------------------------------
const sizeBeforeRemove = vault.tasks.size;
removeTaskCmd(vault, c.id);
check(vault.tasks.size === sizeBeforeRemove - 1 && !vault.tasks.has(c.id), "removeTaskCmd must delete the task");

// --- 10. projects: create / rename / retitle / archive / rush -------------
const p = createProject(vault, "Anatoly");
check(p && p.status === "active" && p.name === "Anatoly", "createProject must create an active project");
check(vault.projects.size === 1, "createProject must insert the project");
const blankP = createProject(vault, "");
check(blankP === undefined, "createProject must return undefined on a blank name");
check(vault.projects.size === 1, "createProject must not insert a blank-named project");

renameProject(vault, p!.id, "Anatoly-Core");
check(vault.projects.get(p!.id)?.name === "Anatoly-Core", "renameProject must update the name");
retitleProject(vault, p!.id, "Anatoly-Engine");
check(vault.projects.get(p!.id)?.name === "Anatoly-Engine", "retitleProject must update the name (twin of renameProject)");

archiveProject(vault, p!.id);
check(vault.projects.get(p!.id)?.status === "archived", "archiveProject must archive the project");
const q = createProject(vault, "Scratch");
rushArchive(vault, q!.id);
check(vault.projects.get(q!.id)?.status === "archived", "rushArchive must archive the project (no guard, same end state)");

// --- 11. announceProject enqueues one notice ------------------------------
const outboxBeforeAnnounce = vault.outbox.length;
announceProject(vault, p!.id);
check(vault.outbox.length === outboxBeforeAnnounce + 1, "announceProject must enqueue exactly one outbox notice");

// --- 12. users: register (guarded) vs seed (unconditional) ----------------
registerUser(vault, "u1", "alice");
check(vault.users.get("u1")?.name === "alice", "registerUser must insert a new user");
registerUser(vault, "u1", "bob");
check(vault.users.get("u1")?.name === "alice", "registerUser must NOT overwrite an existing user (uniqueness guard)");
seedUser(vault, "u1", "carol");
check(vault.users.get("u1")?.name === "carol", "seedUser must overwrite unconditionally (no guard)");

// --- 13. notifyAssignee enqueues one notice -------------------------------
const outboxBeforeNotify = vault.outbox.length;
notifyAssignee(vault, a.id);
check(vault.outbox.length === outboxBeforeNotify + 1, "notifyAssignee must enqueue exactly one outbox notice");

// --- 14. loadSummary reads and counts, read-only ---------------------------
const sumVault = createVault();
const s1 = addTask(sumVault, "write the spec")!;
const s2 = addTask(sumVault, "review the code")!;
completeTask(sumVault, s2.id);
const logLenBeforeSummary = sumVault.log.length;
const summary = await loadSummary(sumVault, [s1.id, s2.id]);
check(summary?.total === 2, "loadSummary total must equal the number of ids requested");
check(summary?.open === 1, "loadSummary must count one open task");
check(summary?.done === 1, "loadSummary must count one done task");
check(Array.isArray(summary?.lines) && summary.lines.length === 2, "loadSummary must format one line per found task");
check(summary?.lines.every((l) => /^\[[ x]\] /.test(l)), "each summary line must start with a [ ] or [x] status box");
check(
  summary?.lines.some((l) => l.includes("write the spec")) && summary?.lines.some((l) => l.includes("review the code")),
  "summary lines must include each task title",
);
check(
  sumVault.tasks.size === 2 && sumVault.log.length === logLenBeforeSummary,
  "loadSummary must be read-only (no mutation, no log line)",
);

const partial = await loadSummary(sumVault, [s1.id, "missing-id"]);
check(partial?.total === 2 && partial?.open === 1 && partial?.done === 0, "loadSummary must skip unknown ids in open/done");
check(Array.isArray(partial?.lines) && partial.lines.length === 1, "loadSummary must emit a line only for found tasks");

// --- 15. loadProjectReport reports over the vault, read-only ---------------
const repProject = createProject(sumVault, "Report")!;
const logLenBeforeReport = sumVault.log.length;
const outboxBeforeReport = sumVault.outbox.length;
const report = await loadProjectReport(sumVault, repProject.id);
check(typeof report?.project === "string" && report.project.length > 0, "loadProjectReport must return a non-empty project label");
check(report?.taskCount === sumVault.tasks.size, "loadProjectReport taskCount must count the vault's tasks");
check(report?.openCount === 1, "loadProjectReport must count the open tasks");
check(Array.isArray(report?.lines) && report.lines.length === report!.taskCount, "loadProjectReport must format one line per task");
check(
  sumVault.log.length === logLenBeforeReport && sumVault.outbox.length === outboxBeforeReport,
  "loadProjectReport must be read-only (no log line, no outbox notice)",
);

// --- report -----------------------------------------------------------------
if (failures.length > 0) {
  console.error("FAIL: the public API does not meet its contract:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("PASS: the task-vault public API behaves correctly end to end");
