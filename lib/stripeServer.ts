import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Credit packs: { id, label, tokens, priceThb (satang), stripePriceId }
export const CREDIT_PACKS = [
  { id: 'pack_50',  label: 'Starter',    tokens: 50,  priceTHB: 150,  description: '~3 small prints' },
  { id: 'pack_150', label: 'Popular',    tokens: 150, priceTHB: 400,  description: '~8–10 prints', popular: true },
  { id: 'pack_350', label: 'Pro',        tokens: 350, priceTHB: 850,  description: '~20+ prints, best value' },
] as const;

export type CreditPack = typeof CREDIT_PACKS[number];

// Pricing engine: returns token cost for a print job
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
