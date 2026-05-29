// Shared pricing utility — safe to import in both client and server components

export function calculateTokenCost({
  material,
  scaleCm,
  infillPercent,
  quantity,
}: {
  material: 'pla' | 'resin' | 'metal';
  scaleCm: number;
  infillPercent: number;
  quantity: number;
}): number {
  const materialMultiplier = { pla: 1, resin: 2.5, metal: 6 }[material];
  const baseTokens = Math.round((scaleCm / 10) * 8 * materialMultiplier * (infillPercent / 40));
  return Math.max(5, baseTokens) * quantity;
}
