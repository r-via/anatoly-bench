import type { SimulationReport } from "./types.js";
import { TIMETABLE } from "./timetable.js";

export function formatTimetable(): string {
  const lines: string[] = ["Train      | Class    | Route                           | Depart"];
  lines.push("-".repeat(70));
  for (const t of TIMETABLE) {
    const route = t.route.join(" -> ");
    lines.push(
      `${t.id.padEnd(10)} | ${t.priority.padEnd(8)} | ${route.padEnd(31)} | ${t.depart}`,
    );
  }
  return lines.join("\n");
}

export function formatReport(report: SimulationReport): string {
  const lines: string[] = [];
  lines.push(`Simulation completed: ${report.ticks} ticks`);
  lines.push(`On-time rate: ${(report.reportedOnTimeRate * 100).toFixed(1)}%`);
  lines.push(`Arrivals: ${report.arrivals.length}`);
  lines.push(`Occupancy records: ${report.occupancy.length}`);

  for (const a of report.arrivals) {
    const status = a.actualArrival !== null
      ? `arrived at tick ${a.actualArrival} (scheduled: ${a.scheduledArrival})`
      : `stranded (scheduled: ${a.scheduledArrival})`;
    lines.push(`  ${a.train}: ${status}`);
  }

  return lines.join("\n");
}
