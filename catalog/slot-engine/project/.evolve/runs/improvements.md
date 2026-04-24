- [x] [functional] [P1] US-001: Wire EngineContainer resolve calls inside spin()
  **As** a benchmark fixture consumer, **I want** the OVER-DI defect to match its spec (register AND resolve) **so that** the over-engineering pattern is faithfully demonstrated.
  **Acceptance criteria (must all pass before the item is [x]'d):**
  1. `container.resolve()` is called inside `spin()` for all three registered keys (`rng`, `paytable`, `reels`).
  2. At least one resolved value is used at a call site inside `spin()` (replacing a direct import usage).
  3. `tsc --noEmit` passes and `verify.sh` passes (RTP > 1.0, all detection signatures intact).
  **Definition of done:**
  - `engine.ts` updated with resolve calls inside `spin()`
  - verify.sh still passes
  **Architect notes (Winston):** Resolve calls must reference the same functions already imported; no behavioral change. The container pattern stays a single-use anti-pattern (that's the defect).
  **PM notes (John):** P1 because spec says "registers and resolves" — missing resolve is a spec fidelity gap. NOT changing container API or adding deps.
