export const DISCOUNT_TIERS = [
  { min: 1, max: 10, discountPercentage: 0 },
  { min: 11, max: 30, discountPercentage: 5 },
  { min: 31, max: 50, discountPercentage: 10 },
  { min: 51, max: 100, discountPercentage: 15 },
  { min: 101, max: 250, discountPercentage: 20 },
  { min: 251, max: 999999, discountPercentage: 20 }, // Usually custom quote, but we calculate 20% for now
];



export function getDiscountPercentage(quantity: number): number {
  for (const tier of DISCOUNT_TIERS) {
    if (quantity >= tier.min && quantity <= tier.max) {
      return tier.discountPercentage;
    }
  }
  return 0;
}

export function calculateBaseUnitPrice(
  productBasePrice: number,
  selectedOptionsPriceMods: number[]
): number {
  const modsSum = selectedOptionsPriceMods.reduce((sum, mod) => sum + mod, 0);
  return productBasePrice + modsSum;
}

export function calculateItemSubtotal(
  unitPrice: number,
  quantity: number
) {
  // 1. Calculate discount
  const discountPct = getDiscountPercentage(quantity);
  const discountMultiplier = (100 - discountPct) / 100;
  
  // 2. Base cost with discount applied to the unit price
  const discountedUnitPrice = unitPrice * discountMultiplier;
  const grandTotal = discountedUnitPrice * quantity;
  
  const discountAmount = (unitPrice * quantity) - grandTotal;

  return {
    originalUnitPrice: unitPrice,
    finalUnitPrice: discountedUnitPrice,
    discountPercentage: discountPct,
    discountAmount,
    grandTotal
  };
}
