/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConditionGrade = 'Excellent' | 'Good' | 'Average' | 'Fair' | 'Poor';

export interface Listing {
  id: string;
  item: string;
  category: string;
  price: number;
  originalPrice: number | null; // Can be missing for edge-case simulation
  age: number | null; // Age in years, can be missing
  condition: ConditionGrade | null; // Can be missing
  imageUrl?: string; // Product photo URL or fallback illustration
  description?: string;
  sellerNotes?: string;
}

export interface CategoryStats {
  category: string;
  count: number;
  medianPrice: number;
  meanPrice: number;
  minPrice: number;
  maxPrice: number;
  medianOriginalPrice: number;
  isLowSampleSize: boolean; // count < 3
}

export type AnomalyType = 'underpriced' | 'overpriced' | 'normal';

export interface AnomalyReport {
  isAnomaly: boolean;
  type: AnomalyType;
  deviationPercent: number; // Deviation from category median
  message: string;
  detailedReason: string;
  notProofOfFraudExplanation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PriceIndicators {
  priceToOriginalRatio: number | null; // e.g. 0.488 (Price / Original Price)
  discountPercentage: number | null; // e.g. 51.2%
  savingsAmount: number | null; // e.g. Original - Price
  annualDepreciationRate: number | null; // % per year
  categoryMedianPrice: number;
  deviationFromMedianPercent: number;
  fairPriceEstimate: number;
  fairPriceRange: [number, number];
}

export interface ImputationReport {
  hasMissingOriginalPrice: boolean;
  imputedOriginalPrice: number;
  hasMissingAge: boolean;
  imputedAge: number;
  hasMissingCondition: boolean;
  imputedCondition: ConditionGrade;
  isImputed: boolean;
  uncertaintyPenaltyApplied: number; // Penalty to final score (0.00 to 0.10)
}

export interface PreferenceWeights {
  affordability: number; // e.g. 0.40
  condition: number; // e.g. 0.35
  age: number; // e.g. 0.25
}

export type PriorityPreset = 'balanced' | 'affordability' | 'condition' | 'longevity' | 'custom';

export interface ScoreFactors {
  affordabilityScore: number; // 0 to 1
  conditionScore: number; // 0 to 1
  ageScore: number; // 0 to 1
  compositeScore: number; // 0 to 100
  effectiveAffordabilityScore: number;
  effectiveConditionScore: number;
  effectiveAgeScore: number;
  penaltyDeduction: number;
}

export interface RankedListing {
  listing: Listing;
  isEligible: boolean; // Within buyer budget
  budgetDelta: number; // budget - price (positive = within, negative = over)
  priceIndicators: PriceIndicators;
  anomalyReport: AnomalyReport;
  imputationReport: ImputationReport;
  scores: ScoreFactors;
  rank: number; // 1-indexed among eligible, or 0 if ineligible
  recommendationReason: string;
  tieBreakerApplied?: string;
}
