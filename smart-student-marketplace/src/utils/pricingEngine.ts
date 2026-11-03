/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Listing,
  CategoryStats,
  AnomalyReport,
  PriceIndicators,
  ImputationReport,
  ConditionGrade
} from '../types/marketplace';

/**
 * Condition grade multipliers for fair value estimation and ranking
 */
export const CONDITION_WEIGHTS: Record<ConditionGrade, number> = {
  Excellent: 1.0,
  Good: 0.8,
  Average: 0.6,
  Fair: 0.4,
  Poor: 0.2,
};

/**
 * Condition multipliers for fair market price adjustments
 */
export const CONDITION_PRICE_MULTIPLIERS: Record<ConditionGrade, number> = {
  Excellent: 1.15,
  Good: 1.0,
  Average: 0.85,
  Fair: 0.70,
  Poor: 0.52,
};

/**
 * Computes category-level statistics strictly comparing items within similar categories.
 */
export function calculateCategoryStats(listings: Listing[]): Map<string, CategoryStats> {
  const categoryMap = new Map<string, Listing[]>();

  for (const item of listings) {
    const list = categoryMap.get(item.category) || [];
    list.push(item);
    categoryMap.set(item.category, list);
  }

  const statsMap = new Map<string, CategoryStats>();

  categoryMap.forEach((items, category) => {
    const prices = items.map((i) => i.price).sort((a, b) => a - b);
    const originalPrices = items
      .map((i) => i.originalPrice)
      .filter((p): p is number => p !== null && p > 0)
      .sort((a, b) => a - b);

    const medianPrice = computeMedian(prices);
    const meanPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    const medianOriginalPrice = originalPrices.length > 0
      ? computeMedian(originalPrices)
      : medianPrice * 1.85;

    statsMap.set(category, {
      category,
      count: items.length,
      medianPrice,
      meanPrice,
      minPrice,
      maxPrice,
      medianOriginalPrice,
      isLowSampleSize: items.length < 3,
    });
  });

  return statsMap;
}

/**
 * Calculates the median of a sorted numerical array.
 */
export function computeMedian(sortedArr: number[]): number {
  if (sortedArr.length === 0) return 0;
  const mid = Math.floor(sortedArr.length / 2);
  return sortedArr.length % 2 !== 0
    ? sortedArr[mid]
    : Math.round((sortedArr[mid - 1] + sortedArr[mid]) / 2);
}

/**
 * Handles missing values by imputing baseline metrics and tracking uncertainty penalties.
 */
export function handleMissingValues(
  listing: Listing,
  categoryStats: CategoryStats
): {
  effectiveOriginalPrice: number;
  effectiveAge: number;
  effectiveCondition: ConditionGrade;
  imputationReport: ImputationReport;
} {
  const hasMissingOriginalPrice = listing.originalPrice === null || listing.originalPrice <= 0;
  const hasMissingAge = listing.age === null || listing.age < 0;
  const hasMissingCondition = !listing.condition;

  let uncertaintyPenalty = 0;

  // Impute Original Price if missing
  const effectiveOriginalPrice = hasMissingOriginalPrice
    ? Math.round(categoryStats.medianOriginalPrice || listing.price * 1.8)
    : listing.originalPrice!;
  if (hasMissingOriginalPrice) uncertaintyPenalty += 0.04;

  // Impute Age if missing
  const effectiveAge = hasMissingAge ? 2.0 : listing.age!;
  if (hasMissingAge) uncertaintyPenalty += 0.05;

  // Impute Condition if missing
  const effectiveCondition: ConditionGrade = hasMissingCondition ? 'Average' : listing.condition!;
  if (hasMissingCondition) uncertaintyPenalty += 0.04;

  return {
    effectiveOriginalPrice,
    effectiveAge,
    effectiveCondition,
    imputationReport: {
      hasMissingOriginalPrice,
      imputedOriginalPrice: effectiveOriginalPrice,
      hasMissingAge,
      imputedAge: effectiveAge,
      hasMissingCondition,
      imputedCondition: effectiveCondition,
      isImputed: hasMissingOriginalPrice || hasMissingAge || hasMissingCondition,
      uncertaintyPenaltyApplied: uncertaintyPenalty,
    },
  };
}

/**
 * Computes price indicators (price/original ratio, discount %, depreciation, fair estimate).
 */
export function calculatePriceIndicators(
  listing: Listing,
  effectiveOriginalPrice: number,
  effectiveAge: number,
  effectiveCondition: ConditionGrade,
  stats: CategoryStats
): PriceIndicators {
  const priceToOriginalRatio = effectiveOriginalPrice > 0
    ? Number((listing.price / effectiveOriginalPrice).toFixed(3))
    : null;

  const discountPercentage = priceToOriginalRatio !== null
    ? Math.round((1 - priceToOriginalRatio) * 100)
    : null;

  const savingsAmount = effectiveOriginalPrice > listing.price
    ? effectiveOriginalPrice - listing.price
    : 0;

  const safeAge = Math.max(0.5, effectiveAge);
  const annualDepreciationRate = discountPercentage !== null
    ? Number((discountPercentage / safeAge).toFixed(1))
    : null;

  const deviationFromMedianPercent = stats.medianPrice > 0
    ? Math.round(((listing.price - stats.medianPrice) / stats.medianPrice) * 100)
    : 0;

  // Fair market price heuristic:
  // Baseline = Category Median * Condition Multiplier * Age Decay
  const conditionMult = CONDITION_PRICE_MULTIPLIERS[effectiveCondition] || 1.0;
  // Age decay: ~10% per year relative to a 2-year norm
  const ageFactor = Math.max(0.45, 1 - (effectiveAge - 2.0) * 0.10);
  const fairPriceEstimate = Math.round(stats.medianPrice * conditionMult * ageFactor);

  const fairPriceRange: [number, number] = [
    Math.round(fairPriceEstimate * 0.88),
    Math.round(fairPriceEstimate * 1.14),
  ];

  return {
    priceToOriginalRatio,
    discountPercentage,
    savingsAmount,
    annualDepreciationRate,
    categoryMedianPrice: stats.medianPrice,
    deviationFromMedianPercent,
    fairPriceEstimate,
    fairPriceRange,
  };
}

/**
 * Evaluates within-category price anomalies and provides transparent explanations
 * of why statistical flags are not proof of fraud.
 */
export function detectPriceAnomaly(
  listing: Listing,
  indicators: PriceIndicators,
  stats: CategoryStats
): AnomalyReport {
  // If sample size < 3, flag low sample confidence
  if (stats.isLowSampleSize) {
    return {
      isAnomaly: false,
      type: 'normal',
      deviationPercent: indicators.deviationFromMedianPercent,
      message: `Low category sample (N=${stats.count} < 3). Anomaly baseline cautious.`,
      detailedReason: `Only ${stats.count} items exist in "${stats.category}". Statistical median cannot reliably determine true market variance with sample size below 3.`,
      notProofOfFraudExplanation: 'Small categories lack sufficient comparative data. Flags in low-volume categories should be treated as informational indicators rather than certainty.',
      severity: 'low',
    };
  }

  const dev = indicators.deviationFromMedianPercent;
  const ratio = indicators.priceToOriginalRatio ?? 0.5;

  // Severe Underpriced: Price < 52% of category median OR ratio < 0.22 with age <= 2
  if (dev <= -48 || (ratio <= 0.22 && (listing.age || 2) <= 2.5)) {
    return {
      isAnomaly: true,
      type: 'underpriced',
      deviationPercent: dev,
      message: `Heavily Underpriced (${Math.abs(dev)}% below category median)`,
      detailedReason: `Listed at ₹${listing.price.toLocaleString('en-IN')}, which is ${Math.abs(dev)}% lower than the category median (₹${stats.medianPrice.toLocaleString('en-IN')}). Retains only ${Math.round(ratio * 100)}% of original cost.`,
      notProofOfFraudExplanation:
        'A flag indicates statistical deviation, NOT fraud. Legitimate reasons include: (1) Urgent distress sale where a graduating student must vacate hostel today, (2) Hidden unlisted defect such as degraded battery or cosmetic scuffs, (3) Seller ignorance of secondary market value, or (4) Typing error in listing price.',
      severity: 'high',
    };
  }

  // Moderate Underpriced
  if (dev <= -30) {
    return {
      isAnomaly: true,
      type: 'underpriced',
      deviationPercent: dev,
      message: `Substantially Below Median (-${Math.abs(dev)}%)`,
      detailedReason: `Priced at ₹${listing.price.toLocaleString('en-IN')} vs category median ₹${stats.medianPrice.toLocaleString('en-IN')}. Good value opportunity but warrants physical inspection.`,
      notProofOfFraudExplanation:
        'Sellers frequently price lower for rapid liquidity before semester breaks. Does not imply illegitimacy, but test functionality in person before payment.',
      severity: 'medium',
    };
  }

  // Severe Overpriced: Price > Original OR Dev > +50%
  if (listing.originalPrice && listing.price > listing.originalPrice) {
    return {
      isAnomaly: true,
      type: 'overpriced',
      deviationPercent: dev,
      message: `Price Exceeds Original Retail (+${Math.round(((listing.price - listing.originalPrice) / listing.originalPrice) * 100)}%)`,
      detailedReason: `Listed at ₹${listing.price.toLocaleString('en-IN')}, higher than the original price of ₹${listing.originalPrice.toLocaleString('en-IN')}.`,
      notProofOfFraudExplanation:
        'Could be an out-of-print textbook, rare imported edition, bundled accessories, or seller mistake. Verify edition and specs before paying above retail.',
      severity: 'high',
    };
  }

  if (dev >= 45) {
    return {
      isAnomaly: true,
      type: 'overpriced',
      deviationPercent: dev,
      message: `Heavily Overpriced (+${dev}% above category median)`,
      detailedReason: `Listed at ₹${listing.price.toLocaleString('en-IN')} compared to category median of ₹${stats.medianPrice.toLocaleString('en-IN')}.`,
      notProofOfFraudExplanation:
        'Higher prices can be justified by high-tier custom specs (e.g., 32GB RAM upgrade, high-end Shimano gears, mint unboxed condition). The seller may also be anchoring high for bargaining.',
      severity: 'medium',
    };
  }

  // Normal range
  return {
    isAnomaly: false,
    type: 'normal',
    deviationPercent: dev,
    message: dev >= 0 ? `Fair Market (+${dev}% from median)` : `Fair Market (${dev}% from median)`,
    detailedReason: `Price aligns well with comparable ${stats.category} listings (median ₹${stats.medianPrice.toLocaleString('en-IN')}).`,
    notProofOfFraudExplanation: 'Within normal expected price distribution for second-hand student items.',
    severity: 'low',
  };
}
