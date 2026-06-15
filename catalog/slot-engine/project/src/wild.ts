export function applyWildBonus(basePayout: number, wildCount: number): number {
  if (wildCount <= 0) return basePayout;
  return basePayout * (1 + wildCount) * 2 ** wildCount;
}
