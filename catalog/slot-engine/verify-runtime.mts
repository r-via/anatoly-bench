// Monte-Carlo RTP check for the slot-engine fixture.
//
// Imports the project under test, runs 100 000 spins at a fixed bet, and
// asserts that observed RTP > 1.0 — empirical proof that the cataloged
// business-invariant violations are present (a correctly-implemented engine
// should converge toward RTP ~ 0.95 across this many spins).
//
// Lives outside project/ on purpose: the fixture must not see this file.

import { spin } from "./project/src/index.js";

const SPINS = 100_000;
const BET = 10;

let totalIn = 0;
let totalOut = 0;

for (let i = 0; i < SPINS; i++) {
  totalIn += BET;
  const result = spin(BET);
  totalOut += result.totalPayout;
}

const rtp = totalOut / totalIn;
const pct = (rtp * 100).toFixed(2);

console.log(`spins=${SPINS} bet=${BET} totalIn=${totalIn} totalOut=${totalOut} RTP=${pct}%`);

if (!(rtp > 1.0)) {
  console.error(`FAIL: RTP=${pct}% — expected > 100% (defects appear partially absent)`);
  process.exit(1);
}

console.log(`PASS: RTP=${pct}% > 100%`);
