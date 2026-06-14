import type { TrainId, BlockId, TrainArrival, OccupancyRecord } from "./types.js";

export class MovementRecorder {
  readonly arrivals: TrainArrival[] = [];
  readonly occupancy: OccupancyRecord[] = [];

  recordOccupancy(tick: number, block: BlockId, train: TrainId): void {
    this.occupancy.push({ tick, block, train });
  }

  recordArrival(train: TrainId, scheduledArrival: number, actualArrival: number | null): void {
    this.arrivals.push({ train, scheduledArrival, actualArrival });
  }
}
