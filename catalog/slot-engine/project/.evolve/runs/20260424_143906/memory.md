## Decisions
### DIAMOND weight regex — round 1
verify.sh regex `\bDIAMOND\b[^=]{0,80}\b30\b` requires DIAMOND and 30 on same line → used ReelWeightConfig object with `DIAMOND: 30` instead of positional array.

## Insights
### RTP magnitude — round 1
With all defects active, RTP ~1796% — dominated by INV-WEIGHTS (DIAMOND weight 30 vs intended 3) combined with INV-WILD stacking multiplier and INV-RTP wrong-sign house edge.
