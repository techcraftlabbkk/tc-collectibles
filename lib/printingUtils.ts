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

// ─── Filament + time estimator ──────────────────────────────────────────────
// Estimates filament weight (grams) and print time (hours) for a model.
// `baseGrams` is the weight at the 15 cm / 20 % infill reference point — either
// a per-model value from the catalogue, or a category default. Numbers are
// estimates for a Bambu Lab P-series printer in PLA and are refined by the
// slicer at print time.
export function estimateFilament({
  scaleCm,
  infillPercent,
  baseGrams = 45,
  quantity = 1,
}: {
  scaleCm: number;
  infillPercent: number;
  baseGrams?: number;
  quantity?: number;
}): { grams: number; hours: number } {
  // Volume scales with the cube of the longest dimension (15 cm reference).
  const volumeFactor = Math.pow(scaleCm / 15, 3);
  // Shell is fixed cost; infill adds on top. Normalised so 20 % == baseGrams.
  const infillFactor = (0.35 + 0.65 * (infillPercent / 100)) / 0.48;
  const gramsEach = baseGrams * volumeFactor * infillFactor;
  const grams = Math.max(2, Math.round(gramsEach)) * quantity;
  // Bambu P-series averages ~13 g/h including travel/seams, plus warm-up.
  const hours = Math.round((grams / 13 + 0.4) * 10) / 10;
  return { grams, hours };
}
