import type { BlockId, SimulationReport } from "./types.js";
export type { SimulationReport } from "./types.js";
import { TIMETABLE, DWELL_TICKS, type TrainSpec } from "./timetable.js";
import { getTraversalTime, SINGLE_TRACK_BLOCKS } from "./network.js";
import { compareTrains, type QueueEntry } from "./priority.js";
import { canEnterBlock, recordEntry, resetSignals } from "./signals.js";
import {
  isBlockFree,
  occupyBlock,
  releaseBlock,
  reserveSectionBlock,
  releaseSingleTrack,
  resetInterlocking,
} from "./interlocking.js";
import { MovementRecorder } from "./telemetry.js";
import { computeOnTimeRate } from "./kpi.js";

const MAX_TICKS = 200;

interface ActiveTrain {
  spec: TrainSpec;
  routeIndex: number;
  ticksOnBlock: number;
  dwellRemaining: number;
  arrived: boolean;
}

export function runSchedule(): SimulationReport {
  resetSignals();
  resetInterlocking();

  const recorder = new MovementRecorder();
  const readyQueue: QueueEntry[] = [];
  const activeTrains = new Map<string, ActiveTrain>();
  let insertionCounter = 0;

  let tick = 0;
  while (tick < MAX_TICKS) {
    for (const spec of TIMETABLE) {
      if (spec.depart === tick) {
        readyQueue.push({ trainId: spec.id, insertionOrder: insertionCounter++ });
      }
    }

    readyQueue.sort(compareTrains);

    const dispatched: number[] = [];
    for (let ri = 0; ri < readyQueue.length; ri++) {
      const entry = readyQueue[ri];
      if (activeTrains.has(entry.trainId)) continue;

      const spec = TIMETABLE.find((t) => t.id === entry.trainId)!;
      const firstBlock = spec.route[0];

      if (!isBlockFree(firstBlock, spec.id, firstBlock)) continue;
      if (!canEnterBlock(firstBlock, spec.id, tick)) continue;

      if (SINGLE_TRACK_BLOCKS.includes(firstBlock)) {
        if (!reserveSectionBlock(firstBlock, spec.id)) continue;
      }

      occupyBlock(firstBlock, spec.id);
      recordEntry(firstBlock, tick);

      activeTrains.set(spec.id, {
        spec,
        routeIndex: 0,
        ticksOnBlock: 0,
        dwellRemaining: 0,
        arrived: false,
      });

      dispatched.push(ri);
    }

    for (let d = dispatched.length - 1; d > 0; d--) {
      readyQueue.splice(dispatched[d], 1);
    }

    const toRemove: string[] = [];
    for (const [trainId, state] of activeTrains) {
      if (state.arrived) continue;

      const currentBlock = state.spec.route[state.routeIndex];
      recorder.recordOccupancy(tick, currentBlock, trainId);

      if (state.dwellRemaining > 0) {
        state.dwellRemaining--;
        continue;
      }

      state.ticksOnBlock++;

      const traversal = getTraversalTime(currentBlock);
      if (state.ticksOnBlock < traversal) continue;

      if (state.routeIndex >= state.spec.route.length - 1) {
        state.arrived = true;
        recorder.recordArrival(trainId, state.spec.scheduledArrival, tick);
        releaseBlock(currentBlock, trainId);
        releaseSingleTrack(trainId);
        toRemove.push(trainId);
        continue;
      }

      const nextBlock = state.spec.route[state.routeIndex + 1];

      if (SINGLE_TRACK_BLOCKS.includes(nextBlock)) {
        if (!reserveSectionBlock(nextBlock, trainId)) continue;
      }

      if (!isBlockFree(nextBlock, trainId, currentBlock)) continue;
      if (!canEnterBlock(nextBlock, trainId, tick)) continue;

      releaseBlock(currentBlock, trainId);
      occupyBlock(nextBlock, trainId);
      recordEntry(nextBlock, tick);

      state.routeIndex++;
      state.ticksOnBlock = 0;
      state.dwellRemaining = DWELL_TICKS;
    }

    for (const id of toRemove) {
      activeTrains.delete(id);
    }

    if (activeTrains.size === 0 && readyQueue.length === 0 && tick > 0) {
      break;
    }

    tick++;
  }

  for (const spec of TIMETABLE) {
    const arrived = recorder.arrivals.some((a) => a.train === spec.id && a.actualArrival !== null);
    if (!arrived) {
      recorder.recordArrival(spec.id, spec.scheduledArrival, null);
    }
  }

  return {
    ticks: tick,
    arrivals: recorder.arrivals,
    occupancy: recorder.occupancy,
    reportedOnTimeRate: computeOnTimeRate(recorder.arrivals),
  };
}
