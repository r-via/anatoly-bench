# Review: `src/paytable.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| ANCIENT_RTP | constant | yes | OK | LEAN | DEAD | UNIQUE | - | 95% |
| PAY_TABLE | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 60% |
| getPayMultiplier | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| lineWins | function | yes | OK | LEAN | DEAD | DUPLICATE | - | 90% |

### Details

#### `ANCIENT_RTP` (L3–L3)

- **Utility [DEAD]**: Exported constant with 0 runtime importers and 0 type-only importers per exhaustive import analysis
- **Duplication [UNIQUE]**: Constant RTP value. No similar constants found in RAG results.
- **Correction [OK]**: Constant correctly set to 0.95, matching the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 'ANCIENT' qualifier is unexplained, and the 0.95 value (return-to-player percentage) has no comment clarifying its meaning or usage context.

#### `PAY_TABLE` (L5–L12)

- **Utility [USED]**: Non-exported constant referenced locally in getPayMultiplier at line 15
- **Duplication [UNIQUE]**: Payout lookup table mapping symbols to multiplier arrays. No similar tables found.
- **Correction [NEEDS_FIX]**: DIAMOND 5-of-a-kind multiplier (1000×) combined with documented DIAMOND reel weight (30/120 = 25%) contributes ~97.7% RTP from that single combination alone, exceeding the entire 95% budget before any other winning combination is counted; total implied RTP far exceeds 100%.
- **Overengineering [LEAN]**: Flat record mapping symbol names to fixed 3-tuple multipliers. Minimal data structure for a fixed paytable.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported (internal), but the tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit — nothing documents what each index represents.

#### `getPayMultiplier` (L14–L21)

- **Utility [USED]**: Exported function with runtime importers in src/engine.ts and src/legacy.ts
- **Duplication [UNIQUE]**: Retrieves multiplier from PAY_TABLE based on symbol and count. No similar functions found.
- **Correction [OK]**: Index mapping row[0]→3-of-a-kind, row[1]→4-of-a-kind, row[2]→5-of-a-kind is correct; returns 0 for unknown symbols and for counts outside {3,4,5}.
- **Overengineering [LEAN]**: Straightforward index lookup via three explicit if-checks. The explicit guards (count===3/4/5) are readable and safe; collapsing to row[count-3] would be a style choice, not a simplification.
- **Tests [NONE]**: No test file. Used by engine.ts and legacy.ts — critical payout logic with count branching (3/4/5) and unknown-symbol fallback is completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on this exported function. Missing: description of purpose, @param for symbol and count, @returns explaining the multiplier semantics, and the notable edge case that WILD/SCATTER return 0.

#### `lineWins` (L23–L40)

- **Utility [DEAD]**: Exported function with 0 runtime importers and 0 type-only importers per exhaustive import analysis
- **Duplication [DUPLICATE]**: Identical logic to checkLine: finds lead symbol, counts consecutive matches including WILDs, returns symbol+count if >= 3. Only cosmetic differences in return field names.
- **Correction [OK]**: WILD substitution and consecutive-run counting are correct; all-WILD line yields null via the ?? fallback; SCATTER as first non-WILD yields null; run breaks correctly on first non-matching, non-WILD symbol.
- **Overengineering [LEAN]**: Handles WILD-skip and consecutive-run logic in one pass. Complexity is proportional to the domain requirement.
- **Tests [NONE]**: No test file. WILD substitution logic, SCATTER early-exit, consecutive-break logic, and count>=3 threshold are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on this exported function. Non-trivial WILD substitution logic (first non-WILD symbol anchors the run) is undocumented. Missing @param, @returns, and explanation of null vs. winning result.

> **Duplicate of** `src/engine.ts:checkLine` — Identical logic for counting consecutive matching symbols including WILDs. Only difference is return object field names (symbol/count vs sym/run).

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- **[utility · high · trivial]** Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

### Refactors

- **[correction · high · large]** Recalibrate PAY_TABLE DIAMOND multipliers (50/250/1000) downward, or reduce DIAMOND reel weight from 30/120 in src/reels.ts, so the total theoretical RTP across all symbols and run lengths converges to ≤95%. DIAMOND 5-of-a-kind alone currently contributes ~97.7% RTP, exhausting the full 95% target before any other winning combination is counted. [L11]
- **[duplication · high · small]** Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
