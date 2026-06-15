import type { TrainArrival } from "./types.js";
import { ON_TIME_SLACK, TIMETABLE } from "./timetable.js";

export function computeOnTimeRate(arrivals: TrainArrival[]): number {
  const trainIds = TIMETABLE.map((t) => t.id);
  let onTime = 0;

  for (const id of trainIds) {
    const records = arrivals.filter((a) => a.train === id);
    const isOnTime = records.some(
      (r) =>
        r.actualArrival !== null &&
        r.actualArrival <= r.scheduledArrival + ON_TIME_SLACK,
    );
    if (isOnTime) onTime++;
  }

  return trainIds.length === 0 ? 1 : onTime / trainIds.length;
}
