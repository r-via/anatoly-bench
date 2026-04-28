# Design Decisions

> Architecture Decision Records (ADRs) documenting the rationale behind slot-engine's structural and algorithmic choices.

## Overview

This page records the key design decisions made during the development of `slot-engine`. Each ADR follows a concise Context → Decision → Rationale → Consequences format. Decisions are tied to specific source modules so the rationale can be verified against the implementation.

For a component-level view of how these decisions manifest, see [System Overview](01-System-Overview.md). For domain concept definitions referenced below, see [Core Concepts](02-Core-Concepts.md).

---

## ADR-001: Dependency Injection via `EngineContainer`

**Module:** `src/engine.ts` — `EngineContainer`

### Context

`spin()` coordinates five independent sub-systems (RNG, paytable, reels, factory, strategy). Hard-coding references to each module makes the pipeline difficult to test in isolation and prevents integrators from substituting alternate implementations.

### Decision

A minimal service-locator registry (`EngineContainer`) is instantiated at module load time. Core services are registered by string key and resolved by `spin()` at call time:

```typescript
const container = new EngineContainer();
container.register("rng",      weightedPick);
container.register("paytable", getPayMultiplier);
container.register("reels",    { getReelSymbols, getReelWeights });
```

### Rationale

- A full IoC framework would add an external runtime dependency to what is deliberately a zero-dependency library.
- The string-key registry is sufficient to allow test harnesses to replace the RNG with a deterministic function without modifying `engine.ts`.
- `register` / `resolve<T>` is the complete public surface — no configuration files, no decorators.

### Consequences

- **Positive:** Sub-systems are swappable at runtime without touching the orchestrator.
- **Negative:** Keys are untyped strings; a misspelled key silently resolves to `undefined`. No compile-time enforcement of registration completeness.

---

## ADR-002: Factory Pattern for Reel Construction

**Module:** `src/factories.ts` — `AbstractReelBuilderFactory`, `StandardReelBuilderFactory`

### Context

The five-reel grid must be generated before any payline evaluation. The generation logic (call `spinReel` for each reel index) is straightforward today, but may need to produce deterministic or seeded grids for replay, certification, or testing.

### Decision

Reel construction is placed behind an abstract factory. `StandardReelBuilderFactory` delegates to `spinReel(i)` from `src/reels.ts`:

```typescript
export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}

export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(spinReel(i));
    }
    return reels;
  }
}
```

### Rationale

- Separating construction from evaluation means `evaluateLine()` never needs to know how symbols were generated.
- A test double factory can return a hand-crafted grid to exercise specific payline and bonus scenarios without relying on RNG.
- The abstract base class documents the expected contract for any alternative implementation.

### Consequences

- **Positive:** Grid generation is replaceable without modifying `engine.ts` or `reels.ts`.
- **Negative:** Adds one layer of indirection for what is currently a trivial loop. The `rowCount` parameter is unused by `StandardReelBuilderFactory` (the reel height is implicitly fixed at 3 by `spinReel`).

---

## ADR-003: Strategy Pattern for Payout Adjustment

**Module:** `src/strategy.ts` — `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`

### Context

The final payout may need to be adjusted for different operating contexts (e.g., a lower-volatility mode for certain markets). Embedding conditional logic directly in `computePayout()` would couple business rules to the calculation core.

### Decision

Post-calculation adjustment is encapsulated in a `SpinStrategy` subclass. `engine.ts` applies the active strategy as the last step before returning `SpinResult`:

```typescript
const finalResult = strategy.adjustPayout(result);
```

Two concrete strategies ship with the library:

| Strategy | Behaviour |
|---|---|
| `DefaultStrategy` | Pass-through — returns the result unchanged |
| `ConservativeStrategy` | Applies a `0.8×` factor: `Math.floor(result.totalPayout * 0.8)` |

### Rationale

- New adjustment rules (e.g., capped maximum payouts, progressive scaling) are added by subclassing `SpinStrategy` rather than branching inside `engine.ts`.
- `DefaultStrategy` makes the no-adjustment case explicit rather than relying on a missing-strategy check.

### Consequences

- **Positive:** Payout policy is independently testable and replaceable via `EngineContainer`.
- **Negative:** `ConservativeStrategy` reduces the effective RTP below the 95% target; callers must be aware of which strategy is active.

---

## ADR-004: Pub-Sub Event Emitter for Spin Lifecycle

**Module:** `src/events.ts` — `SpinEventEmitter`, `SPIN_DONE`

### Context

Downstream concerns such as logging, analytics, and free-spin chaining need to observe the outcome of each spin without coupling their logic to `engine.ts`.

### Decision

A lightweight pub-sub emitter (`SpinEventEmitter`) is used. `engine.ts` emits `SPIN_DONE` with the completed `SpinResult` after every spin:

```typescript
const emitter = new SpinEventEmitter();
emitter.on(SPIN_DONE, (result) => { /* logging, analytics, etc. */ });
emitter.emit(SPIN_DONE, finalResult);
```

### Rationale

- Observers can be attached and removed without modifying `spin()`.
- The emitter is a zero-dependency implementation rather than Node.js `EventEmitter`, keeping the library environment-agnostic (works in browsers, Deno, edge runtimes).
- `SPIN_DONE` is exported as a named constant to prevent string-literal typos in consumer code.

### Consequences

- **Positive:** Spin lifecycle hooks are decoupled from the core pipeline.
- **Negative:** The emitter is currently instantiated per `spin()` call, so listeners registered on one emitter instance are not visible to the next call. Persistent cross-spin subscriptions require the caller to manage emitter lifetime externally.

---

## ADR-005: Pure, Zero-Dependency Public API

**Module:** `src/index.ts`

### Context

The library's stated scope is "pure game logic — no UI, no persistence, no networking" (README). A clean, synchronous function surface makes the engine composable with any host environment.

### Decision

The public entry point re-exports a single function and two types:

```typescript
export { spin, type Bet, type SpinResult } from "./engine.js";
```

`spin()` is synchronous, takes one integer argument, and returns a value — no callbacks, no promises, no global state mutations visible to callers.

### Rationale

- Synchronous execution eliminates the need for `await` boilerplate in simulation loops.
- No runtime dependencies means `npm install` for consumers adds zero additional packages to their dependency tree.
- A minimal exported surface makes semver maintenance predictable: only `spin`, `Bet`, and `SpinResult` constitute the public API contract.

### Consequences

- **Positive:** Easy to embed in any JS/TS environment; simple to wrap with async if needed.
- **Negative:** CPU-intensive batch simulations (e.g., 1 000 000 spins) block the event loop. Callers requiring parallelism must use worker threads or process-level concurrency.

---

## ADR-006: Exponential Wild Multiplier Formula

**Module:** `src/wild.ts` — `applyWildBonus`

### Context

`WILD` symbols substitute for regular symbols in payline runs. A linear multiplier would produce modest boosts; the design goal is to make multiple wilds feel dramatically rewarding.

### Decision

The multiplier applied to the base line payout is:

```
boostedPayout = basePayout × (1 + wildCount) × 2^wildCount
```

| WILDs | Multiplier |
|---|---|
| 1 | `2 × 2¹ = 4×` |
| 2 | `3 × 2² = 12×` |
| 3 | `4 × 2³ = 32×` |

The formula is isolated in `applyWildBonus(basePayout, wildCount)` in `src/wild.ts`.

### Rationale

- The exponential component `2^wildCount` creates supralinear growth that rewards rarer multi-wild combinations disproportionately.
- Isolating the formula in its own module makes it easy to test in isolation and to tune independently of the payline evaluation logic in `engine.ts`.

### Consequences

- **Positive:** High excitement ceiling for multi-wild hits; formula is independently verifiable.
- **Negative:** Three wilds on a high-multiplier symbol (e.g., `DIAMOND` at 1000× line bet) can produce very large payouts that the `HOUSE_EDGE` adjustment in `computePayout` does not cap. Callers may wish to apply an external maximum payout ceiling.

---

## ADR-007: Retained `legacy.ts` Module

**Module:** `src/legacy.ts` — `computeLegacyPayout`

### Context

An earlier version of the payout pipeline used a different calculation path. Removing it immediately would break any consumers who had imported `computeLegacyPayout` directly.

### Decision

`legacy.ts` is retained in the source tree and exports `computeLegacyPayout`. It is **not called** by the current `spin()` pipeline in `engine.ts`. Its logic (identical match-counting from `paytable.getPayMultiplier`, without wild bonuses or house-edge adjustment) differs from `evaluateLine()`.

### Rationale

- Keeping the module allows a controlled deprecation period without a major-version bump.
- The divergence between `computeLegacyPayout` and `evaluateLine` is intentional and documented here to prevent confusion about which path is authoritative.

### Consequences

- **Positive:** No immediate breaking change for direct importers.
- **Negative:** Two parallel payout code paths risk drift if `PAY_TABLE` in `paytable.ts` is updated without also updating `legacy.ts`. The module should be removed in the next major version.

---

## ADR-008: TypeScript `noEmit` Build

**Configuration:** `tsconfig.json`, `package.json` `build` script

### Context

The package ships TypeScript source directly (the `main` field in `package.json` points to `src/index.ts`). A runtime like `tsx` is used by consumers to execute the source without a compilation step.

### Decision

The build script is:

```bash
npx tsc --noEmit
```

No JavaScript artefacts are emitted to disk. TypeScript is used solely as a type-checker.

### Rationale

- Eliminates a separate `dist/` directory and the associated sync problems between source and compiled output during development.
- `tsx` handles on-the-fly transpilation, so consumers and tests run directly against the TypeScript source.
- Strict-mode type checking (`"strict": true` in `tsconfig.json`) is preserved — `noEmit` does not weaken type safety.

### Consequences

- **Positive:** No build artefacts to manage; the `build` script serves purely as a CI type-check gate.
- **Negative:** Consumers who cannot use `tsx` or a bundler with TypeScript support must compile the source themselves. Publishing to npm as-is would require downstream build steps.

---

## Examples

The following snippet demonstrates substituting a deterministic reel factory via `EngineContainer` to reproduce ADR-002's testability benefit:

```typescript
import {
  spin,
  type SpinResult,
} from "slot-engine";
import { AbstractReelBuilderFactory } from "./src/factories.js";
import type { Symbol } from "./src/types.js";

// Deterministic factory: always returns a jackpot grid
class JackpotFactory extends AbstractReelBuilderFactory {
  buildReels(_reelCount: number, _rowCount: number): Symbol[][] {
    return [
      ["DIAMOND", "DIAMOND", "DIAMOND"],
      ["DIAMOND", "DIAMOND", "DIAMOND"],
      ["SEVEN",   "SEVEN",   "SEVEN"],
      ["SEVEN",   "SEVEN",   "SEVEN"],
      ["BELL",    "BELL",    "BELL"],
    ];
  }
}

// Register the override before calling spin()
// (requires direct access to the container — advanced usage)
const result: SpinResult = spin(50);
console.log("Jackpot hit:", result.jackpotHit);
console.log("Total payout:", result.totalPayout);
```

To verify the wild multiplier formula from ADR-006 in isolation:

```typescript
import { applyWildBonus } from "./src/wild.js";

const base = 100; // 100-coin base line payout

const oneWild   = applyWildBonus(base, 1); // 100 × (1+1) × 2^1 = 400
const twoWilds  = applyWildBonus(base, 2); // 100 × (1+2) × 2^2 = 1 200
const threeWilds = applyWildBonus(base, 3); // 100 × (1+3) × 2^3 = 3 200

console.log({ oneWild, twoWilds, threeWilds });
// { oneWild: 400, twoWilds: 1200, threeWilds: 3200 }
```

## See Also

- [System Overview](01-System-Overview.md) — component diagram showing how each ADR's pattern maps to a source module
- [Core Concepts](02-Core-Concepts.md) — definitions for Wild, Scatter, Payline, and RTP referenced above
- [Data Flow](03-Data-Flow.md) — step-by-step trace of how these design decisions interact during a single `spin()` call
- [Public API](../04-API-Reference/01-Public-API.md) — `spin()` and `computePayout()` signatures
- [Source Tree](../05-Development/01-Source-Tree.md) — annotated file listing showing where each module lives