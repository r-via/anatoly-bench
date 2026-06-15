# Review: `src/factories.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| StandardReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract class correctly defines the contract; no logic, only a type-level declaration.
- **Overengineering [ACCEPTABLE]**: ADR-002 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) explicitly documents this abstract base as a deliberate design choice: it enables test-double factories for deterministic grid generation and documents the construction contract. However, the pre-computed usage analysis shows 0 importers for the abstract class itself, meaning nothing currently type-checks against the abstraction — only the concrete subclass is consumed. The ADR itself acknowledges the downside ('adds one layer of indirection for what is currently a trivial loop'), keeping this at ACCEPTABLE rather than LEAN.
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Loop correctly iterates 0…reelCount-1 calling spinReel(i); unused _rowCount is a documented design decision per ADR-002 (reel height implicitly fixed by spinReel). No logic or type errors present.
- **Overengineering [LEAN]**: The concrete implementation is a straightforward loop over spinReel(i) — minimal, does one thing well. Its single consumer is consistent with the project being a focused slot engine. The unused _rowCount parameter is an acknowledged consequence of spinReel fixing reel height implicitly (documented in ADR-002), not gratuitous complexity.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The abstract method signature returns `Symbol[][]` (mutable array of mutable arrays). In a regulated casino/gambling domain (inferred from reels, jackpot, paytable, freespin vocabulary and the ADR mentioning certification), returning a mutable grid from the factory contract risks accidental downstream mutation that could affect game integrity. The return type should be `readonly (readonly Symbol[])[]` to enforce immutability at the contract level. [L4-L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported symbols — `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` — lack JSDoc comments. The abstract `buildReels` method, which is the public contract for all factory implementations, has no documentation explaining the parameter semantics (especially the currently-unused `rowCount`, which the ADR notes is implicitly fixed at 3 by spinReel). This is particularly important for a class intended to be extended by test doubles and alternative implementations. [L4-L16] |

### Suggestions

- Make the factory contract return immutable grids to prevent accidental mutation of the symbol grid downstream — especially important in a regulated gaming context where grid state integrity must be guaranteed.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  
  buildReels(reelCount: number, _rowCount: number): readonly (readonly Symbol[])[] {
  ```
- Add JSDoc to both public exports, documenting the contract and the known rowCount caveat (currently unused, implicitly fixed at 3 by spinReel).
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Abstract factory for constructing the symbol grid before payline evaluation.
   * Implementations may produce random, seeded, or deterministic grids.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Build a 2-D grid of symbols.
     * @param reelCount - Number of reels (columns) to generate.
     * @param rowCount  - Intended row height per reel. Note: StandardReelBuilderFactory
     *                    ignores this value; row height is implicitly fixed at 3 by spinReel.
     */
    abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```
