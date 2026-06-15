export type TrainId = string;
export type BlockId = string;
export type PriorityClass = "express" | "local" | "freight";

export interface TrainArrival {
  train: TrainId;
  scheduledArrival: number;
  actualArrival: number | null;
}

export interface OccupancyRecord {
  tick: number;
  block: BlockId;
  train: TrainId;
}

export interface SimulationReport {
  ticks: number;
  arrivals: TrainArrival[];
  occupancy: OccupancyRecord[];
  reportedOnTimeRate: number;
}
