export const DISCOUNT_TIERS = [
  { min: 1,   max: 10,     discountPercentage: 0  },
  { min: 11,  max: 30,     discountPercentage: 5  },
  { min: 31,  max: 50,     discountPercentage: 10 },
  { min: 51,  max: 100,    discountPercentage: 15 },
  { min: 101, max: 999999, discountPercentage: 20 },
];

export function getDiscountPercentage(qty: number): number {
  return DISCOUNT_TIERS.find(t => qty >= t.min && qty <= t.max)?.discountPercentage ?? 0;
}

export function calculateBaseUnitPrice(base: number, mods: number[]): number {
  return base + mods.reduce((s, m) => s + m, 0);
}

export function calculateItemSubtotal(unitPrice: number, quantity: number) {
  const discountPercentage = getDiscountPercentage(quantity);
  const finalUnitPrice = unitPrice * ((100 - discountPercentage) / 100);
  const grandTotal = finalUnitPrice * quantity;
  return { originalUnitPrice: unitPrice, finalUnitPrice, discountPercentage, grandTotal };
}
