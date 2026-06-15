# Bench procedure — shared infrastructure

Fixture-agnostic workflow for producing a scored baseline from an Anatoly run.
This doc covers everything common to every fixture: the run/score machine
split, SSH/GPU access, version selection, launching/monitoring a run, copying
artifacts back, and generic gotchas.

Per-fixture specifics (paths, scored axes, scoring command, baseline naming,
timing) live next to the fixture:

- slot-engine → [catalog/slot-engine/BENCH_PROCEDURE.md](../catalog/slot-engine/BENCH_PROCEDURE.md)
- martian-pr-review → [catalog/martian-pr-review/BENCH_PROCEDURE.md](../catalog/martian-pr-review/BENCH_PROCEDURE.md) (blocked, see that file)

Throughout this doc, `<fixture>` is a placeholder for the fixture directory
under `catalog/` (e.g. `slot-engine`).

## Architecture

- **Run machine**: WSL distro `temp` (Ubuntu 24.04) with a CUDA GPU (RTX
  3090 Ti, 23 GB VRAM) accessible via Docker. Anatoly runs there in
  `advanced-gguf` mode (GGUF containers nomic-embed-code + Qwen3-8B on ports
  11437/11438, sequential swap to save VRAM).
- **Score machine**: the primary WSL (where `anatoly-bench` lives). Reads the
  run directory produced by Anatoly and compares it against the fixture's
  ground truth.
- **VM SSH access**: `ssh -i .ssh/anatoly-vm-key -p 2222 rviau@localhost`.
  NVIDIA GPU passthrough over SSH requires `export PATH=/usr/lib/wsl/lib:$PATH`
  + `sudo ldconfig` once per session.

## VM prerequisites

```bash
# once, to expose the GPU to the SSH session
export PATH=/usr/lib/wsl/lib:$PATH
sudo ldconfig

# verify the advanced-gguf backend is available
anatoly local-embeddings status
# expected: "Backend: advanced-gguf (configured)" + GPU detected
```

The GGUF Docker stack starts lazily on the first embed call. No need to
pre-launch it.

### VM clone and GitHub auth (one-time, verify each session)

The VM has two anatoly clones. **Only `~/project/anatoly-enterprise` is
canonical** (its `origin` is the private upstream). A legacy
`~/project/anatoly` clone may also exist (historically pointed at the OSS
mirror): ignore it, do not `make update` there.

The VM has **no GitHub SSH key**. Auth to the private repo is via the `gh`
CLI credential helper over HTTPS (the `gh` account is already logged in):

```bash
# one-time on the VM (idempotent): wire gh as git's github credential helper
gh auth setup-git
cd ~/project/anatoly-enterprise
git remote -v   # must be https://github.com/r-via/anatoly-enterprise.git
# if it is not, repoint it (never the OSS mirror):
git remote set-url origin https://github.com/r-via/anatoly-enterprise.git
```

`git@github.com:...` (SSH) will fail with `Permission denied (publickey)`;
use the HTTPS URL.

After any `make update`, **verify the global `anatoly` bin resolves to the
enterprise clone** (see the two-clone gotcha at the end):

```bash
readlink -f "$(which anatoly)"
# expected: /home/rviau/project/anatoly-enterprise/dist/index.js
```

Anatoly refuses to run from `$HOME` (HOME-guard): run `anatoly --version`
and all commands from a project directory, not `~`.

## Choosing the Anatoly version to bench

### Source repository (OSS vs upstream)

Anatoly lives in two repos:

- **`r-via/anatoly`** — public OSS mirror. **Never touched by the bench** (no
  fetch, no push, no checkout).
- **[`r-via/anatoly-enterprise`](https://github.com/r-via/anatoly-enterprise)**
  — **private upstream**, source of truth for development and benching. Every
  feature branch and the `main` the bench validates live here. (Formerly named
  `anatoly-entreprise`; the canonical name is now `anatoly-enterprise`.)

The canonical VM clone `~/project/anatoly-enterprise` tracks this private repo
(`origin = https://github.com/r-via/anatoly-enterprise.git`, auth via the `gh`
credential helper, see "VM clone and GitHub auth" above). A bench run is never
driven by the OSS mirror.

### Checkout modes

The `Makefile` in `~/project/anatoly-enterprise` on the VM supports three
checkout modes (`origin` = private `r-via/anatoly-enterprise`):

| Command | Effect | When to use |
|---|---|---|
| `make update` | Pull `origin/main` (default `BRANCH=main`) | Bench a version already merged to the private `main` |
| `make update BRANCH=feature/xyz` | Checkout + pull `origin/feature/xyz`, then reinstall | **Bench an in-progress feature** (recommended; keeps `main` clean of un-bench-validated commits) |
| `make update COMMIT=abc1234` | Detached checkout on SHA `abc1234` | Bench a precise commit, branch-agnostic |

`make update` reinstalls (deps + build + global bin) only when the checked-out
commit changed. If it prints "nothing to reinstall" but you need a guaranteed
fresh global bin (e.g. switching clones, or the bin resolves elsewhere), force
it with `make install` (see the two-clone gotcha at the end).

**Canonical workflow for benching an in-progress branch (the common case):**

1. Dev side (laptop): commit on a branch and push it to the **private**
   `origin` (`r-via/anatoly-enterprise`), **not main, never the OSS mirror**.
   ```bash
   git push origin my-branch          # origin = r-via/anatoly-enterprise (private)
   ```
2. VM side, in the canonical clone:
   ```bash
   cd ~/project/anatoly-enterprise
   make update BRANCH=my-branch
   make install                       # if global bin must be (re)pointed here
   readlink -f "$(which anatoly)"     # == ~/project/anatoly-enterprise/dist/index.js
   ```
3. Bench. If OK, merge the branch to the private `main`; if KO, fix on the
   branch and re-bench.

This avoids benching on `main` a version not yet validated: a regression found
after merging main is more costly to roll back than a branch switch.

```bash
# probe the current version on the VM
ssh ... 'anatoly --version'
# 0.9.6 (195fbeb-dirty)   ← SHA of the VM HEAD
```

## Launching a run

Script `/tmp/launch-run.sh` to push to the VM (substitute the fixture path):

```bash
#!/bin/bash
export PATH=/usr/lib/wsl/lib:$PATH
export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh; nvm use 20.19 >/dev/null
pkill -f "anatoly run" 2>/dev/null
sleep 1
cd ~/project/anatoly-bench/catalog/<fixture>/project
anatoly run --plain --no-cache >> /tmp/anatoly-run.log 2>&1
echo "RUN_DONE" >> /tmp/anatoly-run.log
```

Then non-blocking execution:

```bash
ssh ... '
  cd ~/project/anatoly-bench/catalog/<fixture>/project/.anatoly
  # Clean transient artifacts (post-Epic 52 layout)
  rm -rf runs cache/llm tasks runtime/*.lock state/deliberation-memory.json state/calibration.json
  rm -f /tmp/anatoly-run.log
  nohup bash /tmp/launch-run.sh > /tmp/launch-run.log 2>&1 &
'
```

### Artifact layout (post-Epic 52)

Since Epic 52 (cache layout overhaul), `.anatoly/` is structured as:

```
project/.anatoly/
├── cache/                    # LLM call caches + RAG vector store + doc-build
│   ├── rag/lancedb/         # ← preserve (RAG index, code+nlp embeddings)
│   ├── doc-build/           # ← preserve (internal-doc generation manifest)
│   └── llm/                 # ← clean if --no-cache (otherwise preserved)
├── state/                    # persistent state
│   ├── internal-docs/       # ← preserve (equivalent of old .anatoly/docs/)
│   ├── deliberation-memory.json  # ← clean (transient between runs)
│   ├── calibration.json     # ← clean (recomputed each run)
│   └── doc-conflicts.yaml   # ← preserve (human arbitrations)
├── runs/                     # ← clean (previous run output)
├── runtime/                  # ← clean (lock files, PID)
├── setup/                    # ← preserve (wizard state)
├── shared -> ~/.anatoly/shared
└── user -> ~/.anatoly/user
```

### What to preserve between runs

Because the bench scores axis performance on a fixture whose source code does
not change, some Anatoly-generated artifacts are **deterministic** with
respect to code + embeddings, and therefore reusable without bias:

- `state/internal-docs/` — internal doc (`bootstrap-doc`). Costs ~$1 and
  several minutes to regenerate via LLM. Versioned in the bench repo.
- `cache/rag/lancedb/` — RAG index (chunks + code + nlp embeddings).
  Reference for the `duplication` and `correction` axes. Free with local
  GGUF but 30-60 s to rebuild.
- `cache/doc-build/manifest.json` — doc-pipeline incrementality state.
- `state/doc-conflicts.yaml` — human arbitrations (epic 55).

Only clean run-specific artifacts:

- `runs/` (last run output)
- `cache/llm/` (LLM call cache — neutralized by `--no-cache` but cleaned)
- `tasks/`, `runtime/*.lock` (transient state)
- `state/deliberation-memory.json`, `state/calibration.json` (recomputed)

No `anatoly reset`: that command deletes `state/internal-docs/` and
`cache/rag/`, forcing costly regenerations with no added value for the bench.

### Why `--no-cache`?

To invalidate the LLM call cache (`cache/llm/`). Without it, two successive
runs on the same code would replay the same cached responses, masking
inter-run variance. We want to benchmark Anatoly's real behavior, not its
caching ability.

## Monitoring the run

The `RUN_DONE` marker at the end of the log signals completion:

```bash
until ssh ... 'grep -q "^RUN_DONE" /tmp/anatoly-run.log'; do sleep 30; done
```

Per-fixture timing tables (phase durations and cost) live in the fixture's
own BENCH_PROCEDURE.md, since they depend on file count and scored-axis count.

## Copying the run to the local machine

```bash
RUN_ID=$(ssh ... 'cat ~/project/anatoly-bench/catalog/<fixture>/project/.anatoly/runs/latest/run-status.json | grep runId | cut -d\" -f4')
scp -r -i .ssh/anatoly-vm-key -P 2222 \
  rviau@localhost:~/project/anatoly-bench/catalog/<fixture>/project/.anatoly/runs/$RUN_ID \
  ~/projects/anatoly-bench/catalog/<fixture>/project/.anatoly/runs/
```

Scoring is fixture-specific — see the fixture's BENCH_PROCEDURE.md.

## Known gotchas (generic)

- **GPU not visible over SSH** → `export PATH=/usr/lib/wsl/lib:$PATH && sudo
  ldconfig`. Otherwise Anatoly falls back to `lite` (ONNX), incompatible with
  an `advanced-gguf` baseline.
- **`local-embeddings status` shows the backend**: `advanced-gguf
  (configured)` = config OK, `lite (recommended)` = GPU not seen.
- **`--no-cache` does not invalidate the internal doc**: it persists in
  `state/internal-docs/` independently of the LLM cache.
- **Killing a running run**: `pkill -9 -f "anatoly run"` on the VM. The GGUF
  Docker containers stay up — that's normal, they are swapped by
  `ensureModel()` on the next run.
- **The `.anatoly/runs/latest` symlink** points to the last completed run.
  Handy for `--report .anatoly/runs/latest` but in bench we prefer the
  explicit runId for traceability.
- **Benching on a feature branch**: use `make update BRANCH=feature/xyz` on
  the VM **after pushing the branch**. Avoids pushing to `main` before the
  bench has validated the version. If the VM is on a branch other than
  `main`, verify with `git rev-parse --abbrev-ref HEAD` before benching.
- **`cannot resolve commit` on `make update`**: the branch was not pushed to
  the private `anatoly-enterprise` upstream. `git push origin <branch>`
  (origin = `r-via/anatoly-enterprise`) on the dev side first. Pushing only to
  the OSS `anatoly` mirror will not make the branch resolvable on the VM (and
  the bench never uses the OSS mirror).
- **Two clones / wrong global bin**: the VM has `~/project/anatoly-enterprise`
  (canonical) and a legacy `~/project/anatoly`. The global `anatoly` is a
  symlink to whichever clone last ran `install-global`. After `make update`,
  always check `readlink -f "$(which anatoly)"` resolves to
  `~/project/anatoly-enterprise/dist/index.js`. If not (or `make update` said
  "nothing to reinstall"), run `make install` in the enterprise clone to
  rebuild deps + dist and relink the bin. Benching with the bin pointed at the
  stale clone silently measures the wrong commit.
- **`refusing to run from your HOME directory`**: every `anatoly` invocation
  (including `--version`) is HOME-guarded. Always `cd` into a project dir
  first; in non-interactive SSH, beware `set -e` aborting on this.
- **Private repo auth on the VM is `gh`, not SSH**: `git@github.com:...` fails
  (`Permission denied (publickey)`, no SSH key on the VM). Use the HTTPS remote
  with `gh auth setup-git` configured once.
