// Deterministic behavioural-invariant check for the train-dispatch fixture.
//
// Imports the project under test, runs the full timetable to completion ONCE
// (the engine has no RNG, so a single run is the ground truth — this replaces
// slot-engine's 100 000-spin Monte-Carlo), then reconstructs the ground-truth
// behaviour from the raw movement trace and asserts that the timetable's four
// operating guarantees are measurably VIOLATED. If a guarantee is restored
// (i.e. someone "fixed" a cataloged defect) the corresponding assertion fails
// and verify.sh does not converge.
//
// This file deliberately does NOT trust report.reportedOnTimeRate: it derives
// every quantity from the raw `arrivals` / `occupancy` trace, so it is an
// independent oracle. It also hardcodes the DOCUMENTED contract constants
// (the README/SPEC values), not whatever the buggy project source defines, so
// that an altered in-code constant cannot move the goalposts.
//
// Lives outside project/ on purpose: the fixture must not see this file.

import { runSchedule } from "./project/src/index.js";

// --- documented contract constants (from README.md / SPEC.md) --------------
// These are the *product contract* values, independent of the shipped source.
const ON_TIME_SLACK = 3; // a train is on time if actual <= scheduled + 3
const MIN_HEADWAY = 3; // successive entries into a block must be >= 3 ticks apart
const ON_TIME_TARGET = 0.85; // a correct dispatcher hits 100%; defects must drop it well below

// The full fixed roster. A train absent from `arrivals` is stranded.
const ALL_TRAINS = [
  "T1_EXP",
  "T2_LOC",
  "T3_FRT",
  "T4_LOC",
  "T5_EXP",
  "T6_LOC",
  "T7_LOC",
  "T8_FRT",
];

const report = runSchedule();

// --- basic shape ------------------------------------------------------------
if (!report || !Array.isArray(report.arrivals) || !Array.isArray(report.occupancy)) {
  console.error("FAIL: runSchedule() did not return a SimulationReport with arrivals[] and occupancy[]");
  process.exit(1);
}

// --- reconstruct ground truth from the raw trace ---------------------------

// 1. Punctuality — count trains that actually met their schedule.
//    A train counts as on time iff it has an arrival with a non-null
//    actualArrival <= scheduledArrival + ON_TIME_SLACK. Stranded / duplicated
//    trains do not count as on time.
const arrivalsByTrain = new Map<string, { scheduled: number; actual: number | null }[]>();
for (const a of report.arrivals) {
  if (!arrivalsByTrain.has(a.train)) arrivalsByTrain.set(a.train, []);
  arrivalsByTrain.get(a.train)!.push({ scheduled: a.scheduledArrival, actual: a.actualArrival });
}

let onTimeCount = 0;
for (const train of ALL_TRAINS) {
  const recs = arrivalsByTrain.get(train) ?? [];
  const onTime = recs.some(
    (r) => r.actual !== null && r.actual <= r.scheduled + ON_TIME_SLACK,
  );
  if (onTime) onTimeCount++;
}
const onTimeRate = onTimeCount / ALL_TRAINS.length;

// 2. Liveness — trains that never arrived (no record, or a null-arrival record).
const strandedTrains = ALL_TRAINS.filter((train) => {
  const recs = arrivalsByTrain.get(train) ?? [];
  return recs.length === 0 || recs.every((r) => r.actual === null);
});

// 3. Conservation — trains that produced more than one real arrival.
const duplicateArrivals = ALL_TRAINS.filter((train) => {
  const recs = arrivalsByTrain.get(train) ?? [];
  return recs.filter((r) => r.actual !== null).length > 1;
});

// 4. Exclusivity — (tick, block) pairs held by more than one distinct train.
const occByTickBlock = new Map<string, Set<string>>();
for (const o of report.occupancy) {
  const key = `${o.tick}|${o.block}`;
  if (!occByTickBlock.has(key)) occByTickBlock.set(key, new Set());
  occByTickBlock.get(key)!.add(o.train);
}
const doubleOccupancy = [...occByTickBlock.entries()].filter(([, trains]) => trains.size > 1);

// 5. Temporal separation — successive first-entries into the same block that
//    are closer together than MIN_HEADWAY. "First entry" of a train into a
//    block is the earliest tick it occupies that block.
const firstEntry = new Map<string, Map<string, number>>(); // block -> train -> minTick
for (const o of report.occupancy) {
  if (!firstEntry.has(o.block)) firstEntry.set(o.block, new Map());
  const perTrain = firstEntry.get(o.block)!;
  const cur = perTrain.get(o.train);
  if (cur === undefined || o.tick < cur) perTrain.set(o.train, o.tick);
}
let headwayViolations = 0;
const headwayDetail: string[] = [];
for (const [block, perTrain] of firstEntry) {
  const entries = [...perTrain.values()].sort((a, b) => a - b);
  for (let i = 1; i < entries.length; i++) {
    const gap = entries[i] - entries[i - 1];
    if (gap < MIN_HEADWAY) {
      headwayViolations++;
      headwayDetail.push(`${block}: entries ${entries[i - 1]} -> ${entries[i]} (gap ${gap} < ${MIN_HEADWAY})`);
    }
  }
}

// --- report -----------------------------------------------------------------
console.log(`ticks=${report.ticks}`);
console.log(`onTimeRate=${(onTimeRate * 100).toFixed(1)}% (${onTimeCount}/${ALL_TRAINS.length})`);
console.log(`reportedOnTimeRate=${(report.reportedOnTimeRate * 100).toFixed(1)}% (dispatcher self-assessment)`);
console.log(`strandedTrains=${strandedTrains.length} [${strandedTrains.join(", ")}]`);
console.log(`duplicateArrivals=${duplicateArrivals.length} [${duplicateArrivals.join(", ")}]`);
console.log(`doubleOccupancyTicks=${doubleOccupancy.length}`);
console.log(`headwayViolations=${headwayViolations}`);
for (const d of headwayDetail) console.log(`  headway: ${d}`);

// --- assert every guarantee is VIOLATED ------------------------------------
const failures: string[] = [];

if (!(onTimeRate < ON_TIME_TARGET)) {
  failures.push(
    `punctuality NOT violated: onTimeRate=${(onTimeRate * 100).toFixed(1)}% is not below the ${(ON_TIME_TARGET * 100).toFixed(0)}% floor (defects partially absent — INV-DWELL / INV-PRIORITY / INV-HEADWAY?)`,
  );
}
if (!(doubleOccupancy.length >= 1)) {
  failures.push("exclusivity NOT violated: no (tick, block) held by two trains (INV-MUTEX absent?)");
}
if (!(strandedTrains.length >= 2)) {
  failures.push(
    `liveness NOT violated: ${strandedTrains.length} stranded trains, expected >= 2 from the single-track deadlock (INV-DEADLOCK absent?)`,
  );
}
if (!(duplicateArrivals.length >= 1)) {
  failures.push("conservation NOT violated: no train arrived more than once (INV-CONSERVATION absent?)");
}
if (!(headwayViolations >= 1)) {
  failures.push("temporal separation NOT violated: every block respects MIN_HEADWAY (INV-HEADWAY absent?)");
}

if (failures.length > 0) {
  console.error("FAIL: one or more operating guarantees were restored:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("PASS: all four operating guarantees are measurably violated (the cataloged defects are present)");
