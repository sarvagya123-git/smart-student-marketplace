/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Listing,
  CategoryStats,
  PreferenceWeights,
  RankedListing,
  ScoreFactors,
  ConditionGrade
} from '../types/marketplace';
import {
  calculateCategoryStats,
  handleMissingValues,
  calculatePriceIndicators,
  detectPriceAnomaly,
  CONDITION_WEIGHTS
} from './pricingEngine';

/**
 * Normalizes scores and computes composite ranking for all listings.
 */
export function rankListings(
  listings: Listing[],
  buyerBudget: number,
  weights: PreferenceWeights,
  selectedCategory: string = 'All'
): {
  rankedListings: RankedListing[];
  categoryStatsMap: Map<string, CategoryStats>;
} {
  const categoryStatsMap = calculateCategoryStats(listings);

  // Filter by category if not 'All'
  const targetListings = selectedCategory === 'All'
    ? listings
    : listings.filter((l) => l.category === selectedCategory);

  const evaluated: RankedListing[] = targetListings.map((listing) => {
    const stats = categoryStatsMap.get(listing.category) || {
      category: listing.category,
      count: 1,
      medianPrice: listing.price,
      meanPrice: listing.price,
      minPrice: listing.price,
      maxPrice: listing.price,
      medianOriginalPrice: listing.price * 1.8,
      isLowSampleSize: true,
    };

    const {
      effectiveOriginalPrice,
      effectiveAge,
      effectiveCondition,
      imputationReport
    } = handleMissingValues(listing, stats);

    const priceIndicators = calculatePriceIndicators(
      listing,
      effectiveOriginalPrice,
      effectiveAge,
      effectiveCondition,
      stats
    );

    const anomalyReport = detectPriceAnomaly(listing, indicatorsFromValues(listing, effectiveOriginalPrice, effectiveAge, effectiveCondition, stats), stats);

    // Budget eligibility
    const isEligible = listing.price <= buyerBudget;
    const budgetDelta = buyerBudget - listing.price;

    // Calculate sub-scores
    const scores = computeSubScores(
      listing.price,
      effectiveAge,
      effectiveCondition,
      buyerBudget,
      stats,
      weights,
      imputationReport.uncertaintyPenaltyApplied
    );

    return {
      listing,
      isEligible,
      budgetDelta,
      priceIndicators,
      anomalyReport,
      imputationReport,
      scores,
      rank: 0,
      recommendationReason: '',
    };
  });

  // Split eligible vs ineligible
  const eligible = evaluated.filter((item) => item.isEligible);
  const ineligible = evaluated.filter((item) => !item.isEligible);

  // Sort eligible items using deterministic tie-breaking
  eligible.sort((a, b) => {
    // 1. Primary: Composite Score (descending)
    const scoreDiff = b.scores.compositeScore - a.scores.compositeScore;
    if (Math.abs(scoreDiff) >= 0.05) {
      return scoreDiff;
    }

    // --- Deterministic Tie-Breaking Logic ---
    // 2. Lower absolute price (more budget friendly)
    if (a.listing.price !== b.listing.price) {
      a.tieBreakerApplied = 'Tie-breaker: Lower price preferred';
      b.tieBreakerApplied = 'Tie-breaker: Lower price preferred';
      return a.listing.price - b.listing.price;
    }

    // 3. Lower age in years (newer device)
    const ageA = a.listing.age ?? 2;
    const ageB = b.listing.age ?? 2;
    if (ageA !== ageB) {
      a.tieBreakerApplied = 'Tie-breaker: Younger age preferred';
      b.tieBreakerApplied = 'Tie-breaker: Younger age preferred';
      return ageA - ageB;
    }

    // 4. Higher condition grade
    const condScoreA = CONDITION_WEIGHTS[a.listing.condition || 'Average'] || 0.5;
    const condScoreB = CONDITION_WEIGHTS[b.listing.condition || 'Average'] || 0.5;
    if (condScoreA !== condScoreB) {
      a.tieBreakerApplied = 'Tie-breaker: Better condition grade';
      b.tieBreakerApplied = 'Tie-breaker: Better condition grade';
      return condScoreB - condScoreA;
    }

    // 5. Higher discount percentage
    const discA = a.priceIndicators.discountPercentage ?? 0;
    const discB = b.priceIndicators.discountPercentage ?? 0;
    if (discA !== discB) {
      return discB - discA;
    }

    // 6. Final deterministic anchor: Alphanumeric ID
    return a.listing.id.localeCompare(b.listing.id);
  });

  // Assign ranks & generate human-readable recommendation reasons
  eligible.forEach((item, index) => {
    item.rank = index + 1;
    item.recommendationReason = generateRecommendationReason(item, index + 1, weights, buyerBudget);
  });

  // Ineligible items: sort by lowest price difference to budget
  ineligible.sort((a, b) => a.listing.price - b.listing.price);
  ineligible.forEach((item) => {
    item.rank = 0;
    const overBudget = item.listing.price - buyerBudget;
    item.recommendationReason = `Exceeds budget by ₹${overBudget.toLocaleString('en-IN')}. Increase budget to evaluate this option.`;
  });

  return {
    rankedListings: [...eligible, ...ineligible],
    categoryStatsMap,
  };
}

/**
 * Computes individual sub-scores (0 to 1) and weighted composite score (0 to 100).
 */
function computeSubScores(
  price: number,
  age: number,
  condition: ConditionGrade,
  budget: number,
  stats: CategoryStats,
  weights: PreferenceWeights,
  uncertaintyPenalty: number
): ScoreFactors {
  // 1. Affordability Score (0 to 1)
  // Combines budget headroom (how much budget is left over) and category price position
  const budgetHeadroomRatio = budget > 0 ? Math.max(0, (budget - price) / budget) : 0;
  const categoryPriceSpan = Math.max(1, stats.maxPrice - stats.minPrice);
  const categoryAffordability = Math.max(0, Math.min(1, 1 - (price - stats.minPrice) / categoryPriceSpan));
  const affordabilityScore = Number((0.6 * budgetHeadroomRatio + 0.4 * categoryAffordability).toFixed(4));

  // 2. Condition Score (0 to 1)
  const conditionScore = CONDITION_WEIGHTS[condition] || 0.6;

  // 3. Age & Longevity Score (0 to 1)
  // Max baseline lifespan considered is 6 years
  const ageScore = Number(Math.max(0, Math.min(1, 1 - age / 6.0)).toFixed(4));

  // Effective contributions
  const effectiveAffordability = affordabilityScore * weights.affordability;
  const effectiveCondition = conditionScore * weights.condition;
  const effectiveAge = ageScore * weights.age;

  // Sum of normalized weights
  const totalWeight = weights.affordability + weights.condition + weights.age || 1;
  const rawWeightedSum = (effectiveAffordability + effectiveCondition + effectiveAge) / totalWeight;

  // Deduct uncertainty penalty (if data was missing and imputed)
  const penaltyDeduction = Number((uncertaintyPenalty * 10).toFixed(2));
  const compositeScore = Number(Math.max(0, Math.min(100, rawWeightedSum * 100 - penaltyDeduction)).toFixed(2));

  return {
    affordabilityScore,
    conditionScore,
    ageScore,
    compositeScore,
    effectiveAffordabilityScore: Number((effectiveAffordability * 100).toFixed(1)),
    effectiveConditionScore: Number((effectiveCondition * 100).toFixed(1)),
    effectiveAgeScore: Number((effectiveAge * 100).toFixed(1)),
    penaltyDeduction,
  };
}

/**
 * Generates clear natural-language rationale for why a product was recommended.
 */
function generateRecommendationReason(
  item: RankedListing,
  rank: number,
  weights: PreferenceWeights,
  budget: number
): string {
  const { listing, priceIndicators, scores } = item;
  const savings = budget - listing.price;
  const condText = listing.condition || 'Average';
  const ageText = listing.age !== null ? `${listing.age} yr` : 'est. 2 yr';

  // Highlight based on dominant preference weight
  if (weights.affordability >= 0.55) {
    return rank === 1
      ? `Top Affordability Choice: Leaves ₹${savings.toLocaleString('en-IN')} in student reserve (${Math.round(scores.affordabilityScore * 100)}% affordability index) with ${condText} condition.`
      : `High Budget Efficiency: ₹${listing.price.toLocaleString('en-IN')} is well under budget, scoring ${scores.compositeScore.toFixed(1)} under price-first priority.`;
  }

  if (weights.condition >= 0.50) {
    return rank === 1
      ? `Top Quality Choice: ${condText} condition with ${ageText} age, maximizing hardware reliability within your ₹${budget.toLocaleString('en-IN')} budget.`
      : `Solid Condition Match: ${condText} grade with strong component preservation, scoring ${scores.compositeScore.toFixed(1)}.`;
  }

  if (weights.age >= 0.45) {
    return rank === 1
      ? `Top Longevity Choice: Youngest hardware (${ageText}) with ${condText} condition, promising longest remaining campus utility.`
      : `Modern Lifecycle: Low wear at ${ageText} old, ranking #${rank} under longevity-first weighting.`;
  }

  // Balanced default
  if (rank === 1) {
    return `Best Overall Balance: Scores ${scores.compositeScore.toFixed(1)}/100 by harmonizing ₹${listing.price.toLocaleString('en-IN')} price (₹${savings.toLocaleString('en-IN')} below budget), ${ageText} age, and ${condText} condition.`;
  }
  if (rank === 2) {
    return `Runner-Up Value: Outstanding ${priceIndicators.discountPercentage ?? 50}% discount off original with dependable ${condText} condition.`;
  }
  if (rank === 3) {
    return `Strong Value Alternative: Highly competitive score (${scores.compositeScore.toFixed(1)}) fitting comfortably within budget.`;
  }

  return `Eligible alternative: ₹${listing.price.toLocaleString('en-IN')} with ${condText} condition.`;
}

function indicatorsFromValues(
  listing: Listing,
  effectiveOriginalPrice: number,
  effectiveAge: number,
  effectiveCondition: ConditionGrade,
  stats: CategoryStats
) {
  return calculatePriceIndicators(listing, effectiveOriginalPrice, effectiveAge, effectiveCondition, stats);
}
