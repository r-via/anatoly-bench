import type { TrainId, BlockId, PriorityClass } from "./types.js";

export const DWELL_TICKS = 6;
export const MIN_HEADWAY = 3;
export const ON_TIME_SLACK = 3;

export interface TrainSpec {
  id: TrainId;
  priority: PriorityClass;
  route: BlockId[];
  depart: number;
  scheduledArrival: number;
}

export const TIMETABLE: TrainSpec[] = [
  {
    id: "T1_EXP",
    priority: "express",
    route: ["bA", "bM1", "bM2", "bS1", "bS2", "bD"],
    depart: 0,
    scheduledArrival: 30,
  },
  {
    id: "T2_LOC",
    priority: "local",
    route: ["bB", "bM1", "bM2", "bS1", "bS2", "bD"],
    depart: 0,
    scheduledArrival: 30,
  },
  {
    id: "T3_FRT",
    priority: "freight",
    route: ["bA", "bM1", "bM2"],
    depart: 2,
    scheduledArrival: 18,
  },
  {
    id: "T4_LOC",
    priority: "local",
    route: ["bA", "bM1", "bM2"],
    depart: 4,
    scheduledArrival: 20,
  },
  {
    id: "T5_EXP",
    priority: "express",
    route: ["bM2", "bS1", "bS2", "bD"],
    depart: 6,
    scheduledArrival: 24,
  },
  {
    id: "T6_LOC",
    priority: "local",
    route: ["bE", "bS2", "bS1", "bM2"],
    depart: 6,
    scheduledArrival: 24,
  },
  {
    id: "T7_LOC",
    priority: "local",
    route: ["bA", "bM1", "bM2", "bS1", "bS2", "bD"],
    depart: 1,
    scheduledArrival: 31,
  },
  {
    id: "T8_FRT",
    priority: "freight",
    route: ["bB", "bM1"],
    depart: 3,
    scheduledArrival: 13,
  },
];
