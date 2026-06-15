# train-dispatch

A small deterministic train dispatcher for a fixed rail network. Pure
scheduling logic: no UI, no persistence, no networking, no clock. One call
runs the whole timetable to completion and returns the movement trace.

## Install

```bash
npm install
```

## Usage

```ts
import { runSchedule } from "train-dispatch";

const report = runSchedule(); // runs the bundled network + timetable
console.log(report.reportedOnTimeRate);
```

`runSchedule()` advances a discrete-event simulation over integer ticks. At
each tick it decides, for every train that is ready to move, whether it may
enter the next block on its route, then commits the moves. It is fully
deterministic: the same network and timetable always produce the same trace.
There is no random number generator anywhere in the engine.

## API

```ts
type TrainId = string;
type BlockId = string;
type PriorityClass = "express" | "local" | "freight";

interface TrainArrival {
  train: TrainId;
  scheduledArrival: number; // tick the timetable promises
  actualArrival: number | null; // tick the train reached its destination, or null
}

interface OccupancyRecord {
  tick: number;
  block: BlockId;
  train: TrainId; // the train occupying `block` at `tick`
}

interface SimulationReport {
  ticks: number; // total ticks simulated
  arrivals: TrainArrival[]; // one record per arrival event
  occupancy: OccupancyRecord[]; // per-tick block occupancy trace
  reportedOnTimeRate: number; // share of trains that met their schedule
}

function runSchedule(): SimulationReport;
```

## Operating guarantees

The dispatcher is built around four guarantees. They are the product
contract: the timetable is feasible, and a correct dispatcher honours all of
them on every run.

- **Punctuality.** Every train arrives within `ON_TIME_SLACK` ticks of its
  scheduled arrival. The target on-time rate is **100%**: the published
  timetable has enough slack that no train ever needs to be late.
- **Exclusivity.** A track block holds at most one train at any tick. The
  interlocking never grants a block that is already occupied.
- **Liveness.** Every dispatched train eventually reaches its destination.
  The single-track sections between passing loops are reserved so that two
  trains approaching from opposite ends can never each hold what the other
  needs.
- **Conservation.** Every dispatched train arrives exactly once. A train is
  removed from the ready queue when, and only when, it is dispatched onto its
  route.

## Network

The bundled network is a fixed five-station layout (`ALPHA`, `BRAVO`,
`CHARLIE`, `DELTA`, `ECHO`) with a junction where the `BRAVO` branch merges
onto the mainline, a double-track mainline segment, and a single-track
section guarded by passing loops. Trains carry a priority class; at a
contended junction the highest-priority ready train is dispatched first.

## Timing

Block traversal and station dwell are measured in ticks. A station dwell is
**2 ticks**. The minimum headway between two trains entering the same block
is **3 ticks**. These constants and the per-block traversal times are fixed
in the timetable module.

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
