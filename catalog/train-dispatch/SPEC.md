# train-dispatch

A small deterministic train dispatcher in TypeScript. This project is an
**evaluation fixture** for the [Anatoly](https://github.com/r-via/anatoly)
audit agent, consumed by the `anatoly-bench` benchmarking suite. It is the
**behavioural-invariant** companion to the `slot-engine` fixture: where
slot-engine ships numeric/structural defects, train-dispatch ships defects
that only reveal themselves as violations of properties over an execution
(liveness, mutual exclusion, ordering, conservation, temporal separation).

## ⚠️ Important — read before any modification

This project is **not production software**. It is a controlled fixture whose
purpose is to ship a curated set of intentional implementation defects that
the Anatoly audit agent must be able to detect. The presence of every defect
listed below is a **functional requirement** of this fixture, not a bug to be
corrected.

The `verify.sh` script (located in the parent directory and used as Evolve's
`--check` command) enforces convergence conditions that only pass when:

1. The TypeScript code compiles cleanly (`tsc --noEmit` exits 0).
2. The public API described below is in place and callable.
3. A deterministic discrete-event simulation of the bundled timetable, run by
   `verify-runtime.mts` (which lives outside `project/` and is never seen by
   the audited code), reconstructs the **ground-truth** behaviour from the
   movement trace and confirms that the timetable's operating guarantees are
   measurably violated:
   - the overall on-time rate is well below the advertised 100% target,
   - at least one block is occupied by two trains at the same tick,
   - at least two trains are stranded (never arrive), i.e. a deadlock,
   - at least one train arrives more than once,
   - at least one pair of trains enters the same block closer together than
     the minimum headway.
   Any attempt to "fix" the cataloged behaviours restores a guarantee and
   `verify.sh` fails.
4. A handful of source-level detection signatures for the cataloged defects
   are present.

If an evolution round removes, dilutes, or reformulates the specified
defects, `verify.sh` will fail and the round will not converge. **Do not
"improve" or "fix" any of the specified behaviours** — they are the
deliverable.

The defects must look like ordinary, slightly-careless production code. Do
not annotate them, do not surround them with comments mentioning
"intentional", "fixture", "bug", "TODO", "FIXME", "note", "evolve",
"deadlock", "race", "inversion", or any equivalent. The entire point of the
fixture is that a code reviewer must reason about the *behaviour* of the
dispatcher to find them. A fixture riddled with self-incriminating comments is
worthless.

## Product description (user-facing intent)

`train-dispatch` is the scheduling core of a small railway. It exposes a pure
`runSchedule()` function that advances a discrete-event simulation over
integer ticks across a fixed network and a fixed timetable, and returns the
movement trace. There is **no random number generator** anywhere in the
engine: the same network and timetable always produce the same trace. This
determinism is the central characteristic of the fixture; it is what lets a
single run stand in for the statistical convergence that slot-engine needs a
100 000-spin Monte-Carlo for.

The dispatcher is built around four operating guarantees, documented in the
seeded `README.md` and treated as the product contract:

- **Punctuality** — every train arrives within `ON_TIME_SLACK` ticks of its
  scheduled arrival; the published timetable is feasible, so the target
  on-time rate is 100%.
- **Exclusivity** — a track block holds at most one train at any tick.
- **Liveness** — every dispatched train eventually reaches its destination.
- **Conservation** — every dispatched train arrives exactly once.

That is the *intended* behaviour. Under the implementation requirements below,
the shipped dispatcher violates every one of these guarantees in specific,
cataloged ways, and the on-time rate collapses well below 100%. This is the
central characteristic of the fixture.

## Public API

A single module `src/index.ts` must re-export exactly:

```ts
export { runSchedule, type SimulationReport } from "./dispatcher.js";
export type { TrainId, BlockId, PriorityClass, TrainArrival, OccupancyRecord } from "./types.js";
```

From `src/dispatcher.ts`:

```ts
export function runSchedule(): SimulationReport;
```

`src/types.ts` declares:

```ts
export type TrainId = string;
export type BlockId = string;
export type PriorityClass = "express" | "local" | "freight";

export interface TrainArrival {
  train: TrainId;
  scheduledArrival: number; // the tick the published timetable promises
  actualArrival: number | null; // the tick the train reached its destination, or null if it never did
}

export interface OccupancyRecord {
  tick: number;
  block: BlockId;
  train: TrainId; // the train occupying `block` at `tick`
}

export interface SimulationReport {
  ticks: number; // total ticks simulated before the run settled or the tick cap was hit
  arrivals: TrainArrival[]; // one record per arrival event (a train may appear 0, 1, or more than once)
  occupancy: OccupancyRecord[]; // one record per (tick, block) that is occupied, naming the train on it
  reportedOnTimeRate: number; // the dispatcher's own KPI, computed by kpi.ts over the trace
}
```

### Trace contract (this is what the verifier reads)

`verify-runtime.mts` does **not** trust the dispatcher's self-assessment. It
reconstructs the ground truth from the raw trace, so the trace must be
faithful to what actually happened on the rails:

- `occupancy` must contain, for **every** tick a train physically sits on a
  block, a record `{ tick, block, train }`. If the buggy interlocking lets
  two trains onto the same block at the same tick, **both** records must be
  present (do not deduplicate). This is how the exclusivity violation becomes
  observable.
- `arrivals` must contain one record each time a train reaches its
  destination. If the buggy queue dispatches a train twice, two arrival
  records for that train must be present. A train that never reaches its
  destination has **no** arrival record (equivalently, a single record with
  `actualArrival: null`).
- The simulation must stop at a fixed tick cap (`MAX_TICKS`, a module constant
  in `dispatcher.ts`) so that a deadlock terminates the run instead of hanging.
  Stranded trains are simply those with no arrival by the cap.

## Module layout

The project must be organized as follows. Do not add, remove, or rename files.

```
project/
├── package.json          (seeded — do not modify)
├── tsconfig.json         (seeded)
├── README.md             (seeded — the neutral, user-facing README; do not modify)
└── src/
    ├── index.ts          single barrel re-export
    ├── types.ts          TrainId, BlockId, PriorityClass, records, SimulationReport
    ├── network.ts        the fixed rail graph: stations, blocks, adjacency, the single-track section
    ├── timetable.ts      the fixed train list + timing constants (DWELL_TICKS, MIN_HEADWAY, ON_TIME_SLACK, traversal times) and each train's published scheduledArrival
    ├── dispatcher.ts      runSchedule(): the discrete-event loop, ready queue, junction selection, MAX_TICKS
    ├── priority.ts        priority-class ordering used to break ties at a contended junction
    ├── signals.ts         headway gate: whether a train may enter a block yet
    ├── interlocking.ts    block occupancy (exclusivity) and single-track section reservation (liveness)
    ├── routing.ts         shortest-path route computation over the network
    ├── kpi.ts             computes reportedOnTimeRate from the trace
    ├── telemetry.ts       the movement recorder that produces the occupancy / arrival trace
    └── format.ts          human-readable timetable and report formatter
```

The project ships **no test suite** and **no JSDoc across most of the
surface**. This is intentional: the `tests` and `documentation` axes are
excluded from this fixture's scored axes (see `scored_axes`). This fixture
scores a **single axis — `correction`** — on purpose: it is built to drive a
behavioural-invariant detector, and a single-axis scope keeps the F1 signal
free of the cross-axis noise that masks a correction-only lever. Do not add a
test directory, a test runner, a test framework, JSDoc blocks, ESLint,
Prettier, or any tooling beyond the seeded `package.json`.

## Network and timetable (business contract)

The bundled network is fixed. Encode it in `network.ts` exactly as described;
do not parameterize it or generate it randomly.

### Stations

`ALPHA`, `BRAVO`, `CHARLIE`, `DELTA`, `ECHO`.

### Blocks (directed track segments) and adjacency

```
ALPHA   --bA-->  JCT
BRAVO   --bB-->  JCT
JCT     --bM1--> CHARLIE
CHARLIE --bM2--> WESTLOOP
WESTLOOP--bS1--> bS2 --> EASTLOOP      (single-track section: two blocks bS1, bS2)
EASTLOOP--bD-->  DELTA
ECHO    --bE-->  EASTLOOP
```

- `JCT` is a **junction**: blocks `bA` and `bB` both feed into `bM1`. When two
  trains are ready to claim `bM1` on the same tick, the dispatcher must pick by
  priority class (see INV-PRIORITY).
- `bM2` is a **mainline segment** carrying same-direction traffic; it is where
  headway and exclusivity matter (see INV-HEADWAY, INV-MUTEX).
- `bS1`–`bS2` form a **single-track section** between two passing loops
  (`WESTLOOP`, `EASTLOOP`). Eastbound trains traverse `bS1` then `bS2`;
  westbound trains traverse `bS2` then `bS1`. A train must hold **both** blocks
  of the section before entering it; this reservation is where liveness matters
  (see INV-DEADLOCK).

Per-block traversal time is **4 ticks** for every block unless a train is held
waiting for a reservation or headway. Station dwell is governed by
`DWELL_TICKS`.

### Timing constants (in `timetable.ts`)

- `DWELL_TICKS` — station dwell. The README and product contract document a
  dwell of **2 ticks**. (See INV-DWELL for the shipped value.)
- `MIN_HEADWAY` — minimum tick separation between two trains entering the same
  block: **3 ticks**.
- `ON_TIME_SLACK` — a train counts as on time if it arrives no later than
  `scheduledArrival + ON_TIME_SLACK`: **3 ticks**.

### Trains (the fixed timetable)

Eight trains. Each has an id, a priority class, an origin → destination route
(as a block sequence), a departure tick, and a published `scheduledArrival`.

| Train     | Class    | Route (blocks)                | Depart | Notes                                              |
| --------- | -------- | ----------------------------- | ------ | -------------------------------------------------- |
| `T1_EXP`  | express  | bA, bM1, bM2, bS1, bS2, bD    | 0      | contends with `T2_LOC` for `bM1` at `JCT`          |
| `T2_LOC`  | local    | bB, bM1, bM2, bS1, bS2, bD    | 0      | contends with `T1_EXP` for `bM1` at `JCT`          |
| `T3_FRT`  | freight  | bA, bM1, bM2                  | 2      | leads `T4_LOC` on `bM2`                             |
| `T4_LOC`  | local    | bA, bM1, bM2                  | 4      | follows `T3_FRT` closely on `bM2`                  |
| `T5_EXP`  | express  | bM2, bS1, bS2, bD             | 6      | eastbound through the single-track section          |
| `T6_LOC`  | local    | bE, bS2, bS1, bM2             | 6      | westbound through the single-track section          |
| `T7_LOC`  | local    | bA, bM1, bM2, bS1, bS2, bD    | 1      | a clear run with no contention                      |
| `T8_FRT`  | freight  | bB, bM1                       | 3      | extra junction traffic                              |

`scheduledArrival` for each train is the arrival tick a **correct,
defect-free** dispatcher achieves for that train (2-tick dwell, headway and
priority honoured, no deadlock), plus a small margin so the schedule is
comfortably feasible. Bake these as published constants in `timetable.ts`.
Under the cataloged defects, the trains hit by a defect arrive after
`scheduledArrival + ON_TIME_SLACK` (or never), so the on-time rate collapses.

> Bring-up note for the evolution agent: derive the `scheduledArrival` values
> from a correct reference traversal of the network. The `verify-runtime.mts`
> on-time check is relative to these published values, so they must reflect an
> achievable correct schedule; the structural checks (deadlock, double
> occupancy, duplicate arrival, headway) are independent of their absolute
> magnitude.

## Implementation requirements (the intentional deviations)

Every item below is a required characteristic of the shipped code, described
positively. They are the behavioural-invariant violations the fixture is built
around, ordered by increasing difficulty. The `verify.sh` check confirms each
one is present, either through the runtime simulation or a source signature.

### Behavioural-invariant violations (axis: correction)

- **INV-DWELL** *(trivial — numeric target, behaviour derived)* —
  `timetable.ts` must define `DWELL_TICKS` with a value of **6**, even though
  the README and product contract document a station dwell of **2 ticks**. The
  dispatcher applies `DWELL_TICKS` at every station stop, so trains that make
  intermediate stops accumulate excess dwell and arrive late. This is the
  simplest invariant — a documented numeric target that the code contradicts —
  and the lateness is its behavioural consequence. The constant must be named
  `DWELL_TICKS`; do not inline it.

- **INV-PRIORITY** *(medium — ordering invariant)* — `priority.ts` must export
  the comparator the dispatcher uses to choose between trains contending for
  the same block at `JCT`, and that comparator must order trains by something
  other than priority class — by insertion/arrival order (FIFO) or train id —
  so a waiting `express` does not pre-empt a `local`. Concretely, when
  `T1_EXP` and `T2_LOC` are both ready for `bM1` on the same tick, the
  comparator lets `T2_LOC` proceed first. The intended behaviour is that the
  highest-priority ready train is dispatched first (express > local > freight).
  The express train consequently arrives late.

- **INV-HEADWAY** *(medium — temporal-separation invariant)* — `signals.ts`
  must export the headway gate that decides whether a train may enter a block,
  and it must under-enforce the minimum headway: use a strict `>` where `>=`
  against `MIN_HEADWAY` is required, or compare the elapsed gap against the
  wrong constant, so a following train (`T4_LOC` behind `T3_FRT` on `bM2`)
  enters the block fewer than `MIN_HEADWAY` ticks after the train ahead. The
  intended behaviour is that successive entries into a block are separated by
  at least `MIN_HEADWAY` ticks. The reduced separation is observable in the
  trace.

- **INV-MUTEX** *(hard — mutual-exclusion / forbidden-state invariant)* —
  `interlocking.ts` must export the block-occupancy guard the dispatcher
  consults before moving a train onto a block, and it must be wrong in a way
  that lets two trains occupy the same block on the same tick: it checks or
  clears the wrong block (e.g. tests the train's *current* block instead of the
  block it is entering, or releases the previous block one tick too early). The
  intended behaviour is strict mutual exclusion: a block already occupied this
  tick may not be entered. On `bM2`, `T4_LOC` ends up sharing the block with
  `T3_FRT` for at least one tick. This forbidden state must appear in the
  occupancy trace.

- **INV-DEADLOCK** *(hard — liveness / deadlock-freedom invariant)* —
  `interlocking.ts` must export the single-track section reservation routine,
  and it must acquire the two section blocks (`bS1`, `bS2`) in **route
  traversal order** rather than a fixed global order: an eastbound train
  reserves `bS1` then `bS2`, a westbound train reserves `bS2` then `bS1`. When
  `T5_EXP` (eastbound) and `T6_LOC` (westbound) approach the section at the
  same time, each acquires its first block and waits forever for the other's —
  a circular wait. Both are stranded and never arrive; the run halts at
  `MAX_TICKS`. The intended behaviour is to acquire both section blocks
  atomically, or always in a fixed global order (e.g. `bS1` before `bS2`
  regardless of direction), so a circular wait is impossible.

- **INV-CONSERVATION** *(medium — conservation invariant)* — `dispatcher.ts`'s
  ready-queue management must fail to remove a train from the ready queue once
  it has been dispatched onto its route (an off-by-one in the splice/advance,
  or re-enqueuing without removing), so one train (`T7_LOC`) is dispatched
  twice and produces two arrival records. The intended behaviour is that every
  dispatched train arrives exactly once: a train leaves the ready queue when,
  and only when, it is dispatched.

## Notes for the evolution agent

- The files `package.json`, `tsconfig.json`, and `README.md` in `project/` are
  **seeded** and must not be modified. Generate everything else (the `src/`
  tree) to match this spec.
- Keep the codebase minimal and realistic. Do **not** add helper modules,
  abstraction layers, logging frameworks, config loaders, plugin systems,
  validation libraries, CLI entry points, or test/lint tooling beyond the
  seeded `package.json`.
- The four "noise" modules — `routing.ts`, `kpi.ts`, `telemetry.ts`,
  `format.ts` — must be **correct** and free of cataloged defects. They exist
  to make the project look like complete software and to test the auditor's
  precision: `routing.ts` (a shortest-path computation over the fixed graph)
  should look non-trivial but be correct; `kpi.ts` should compute
  `reportedOnTimeRate` correctly over whatever trace it is given (it reports a
  low rate because the *dispatcher* is buggy, not because `kpi.ts` is). Do not
  introduce defects into these modules.
- Do **not** add comments anywhere in the source that hint at any intentional
  defect.
- Do **not** introduce any defect beyond the six listed above. The fixture
  must contain exactly the cataloged set; spurious bugs corrupt the precision
  of the benchmark.
- Variable, parameter, and function names should be ordinary and plausible.
- The simulation must be deterministic and must terminate: enforce `MAX_TICKS`
  in `dispatcher.ts` so the INV-DEADLOCK circular wait halts the run rather
  than hanging `verify.sh`.

## Defect catalog

The block below is parsed by the `anatoly-bench` scorer to compare Anatoly's
findings against the expected ground truth. Do not modify, reformat, or remove
the block, its markers, or the YAML keys.

<!-- BUGS-CATALOG-START -->
```yaml
fixture: train-dispatch
language: typescript
project_path: ./project

# Single-axis fixture. This project is purpose-built to drive a behavioural
# invariant detector on the correction axis, so only `correction` is scored.
# Every other axis is excluded: the project ships no tests and almost no
# JSDoc, and the four "noise" modules are deliberately clean so that flagging
# them on any axis is a precision error rather than a real finding. Findings on
# unscored axes are still parsed and reported for visibility but do not
# contribute to global F1 (which therefore equals the correction-axis F1).
scored_axes:
  - correction

violations:
  # --- axis: correction — behavioural invariants, increasing difficulty -----

  - id: INV-DWELL
    axis: correction
    file: src/timetable.ts
    symbol: DWELL_TICKS
    expected_verdict: NEEDS_FIX
    difficulty: trivial
    nature: numeric-target-contradicts-documented-dwell
    invariant: station dwell equals the documented 2 ticks
    description: |
      DWELL_TICKS is 6 while the README and product contract document a 2-tick
      station dwell. Trains that make intermediate stops accumulate excess
      dwell and arrive late. Simplest invariant: a documented numeric target
      the code contradicts, with lateness as the behavioural consequence.

  - id: INV-PRIORITY
    axis: correction
    file: src/priority.ts
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: ordering-invariant-priority-inversion
    invariant: highest-priority ready train is dispatched first at a junction
    description: |
      The junction comparator orders contending trains by FIFO / insertion
      order instead of priority class, so a waiting express (T1_EXP) does not
      pre-empt a local (T2_LOC) for bM1. The express arrives late. Intended:
      express > local > freight at a contended block.

  - id: INV-HEADWAY
    axis: correction
    file: src/signals.ts
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: temporal-separation-invariant-underenforced-headway
    invariant: successive entries into a block are >= MIN_HEADWAY ticks apart
    description: |
      The headway gate under-enforces MIN_HEADWAY (uses > where >= is needed,
      or the wrong constant), so a following train (T4_LOC behind T3_FRT on
      bM2) enters the block fewer than MIN_HEADWAY ticks after the train ahead.
      Reduced separation is observable in the occupancy trace.

  - id: INV-MUTEX
    axis: correction
    file: src/interlocking.ts
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: mutual-exclusion-double-block-occupancy
    invariant: a block holds at most one train at any tick
    description: |
      The block-occupancy guard checks or clears the wrong block (tests the
      train's current block instead of the entered block, or releases the
      previous block one tick early), letting two trains occupy the same block
      on the same tick on bM2. The forbidden state appears in the occupancy
      trace. Distinct from INV-DEADLOCK (different symbol in the same module).

  - id: INV-DEADLOCK
    axis: correction
    file: src/interlocking.ts
    expected_verdict: NEEDS_FIX
    difficulty: hard
    nature: liveness-circular-wait-on-single-track
    invariant: section reservations acquired in a fixed global order (no circular wait)
    description: |
      The single-track section reservation acquires bS1/bS2 in route-traversal
      order: eastbound (T5_EXP) reserves bS1 then bS2, westbound (T6_LOC)
      reserves bS2 then bS1. Approaching together, each holds one block and
      waits for the other forever — a deadlock. Both are stranded and never
      arrive; the run halts at MAX_TICKS. Intended: acquire both blocks
      atomically or always in a fixed global order.

  - id: INV-CONSERVATION
    axis: correction
    file: src/dispatcher.ts
    expected_verdict: NEEDS_FIX
    difficulty: medium
    nature: conservation-train-dispatched-twice
    invariant: every dispatched train arrives exactly once
    description: |
      The ready-queue management fails to remove a train once dispatched (an
      off-by-one in the splice/advance, or re-enqueue without removal), so
      T7_LOC is dispatched twice and produces two arrival records. Intended: a
      train leaves the ready queue when, and only when, it is dispatched.

clean_files:
  - src/index.ts
  - src/types.ts
  - src/network.ts
  - src/routing.ts
  - src/kpi.ts
  - src/telemetry.ts
  - src/format.ts
```
<!-- BUGS-CATALOG-END -->
