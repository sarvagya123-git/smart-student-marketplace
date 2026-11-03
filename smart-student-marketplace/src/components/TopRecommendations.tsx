/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, ArrowRight, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import { RankedListing, PriorityPreset } from '../types/marketplace';
import { ProductImage } from './ProductImage';

interface TopRecommendationsProps {
  topItems: RankedListing[];
  budget: number;
  priorityPreset: PriorityPreset;
  onInspect: (item: RankedListing) => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

export const TopRecommendations: React.FC<TopRecommendationsProps> = ({
  topItems,
  budget,
  priorityPreset,
  onInspect,
  onSelectCategory,
  selectedCategory,
}) => {
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 2:
        return 'bg-slate-200 text-slate-800 border-slate-300';
      case 3:
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header and explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Top 3 Eligible Recommendations
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Budget ceiling: <span className="font-mono font-semibold text-slate-800">₹{budget.toLocaleString('en-IN')}</span>
            {' '}· Ranked strictly by multi-factor score (Affordability + Condition + Age/Longevity)
          </p>
        </div>

        {/* Priority State Indicator */}
        <div className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 flex items-center gap-2">
          <span className="font-semibold text-slate-800 capitalize">{priorityPreset} Weighting Active</span>
          <span className="text-slate-400">·</span>
          <span>{selectedCategory === 'All' ? 'Cross-Category' : `${selectedCategory} Only`}</span>
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      {topItems.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-lg">
          <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No Eligible Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            No products in {selectedCategory === 'All' ? 'the marketplace' : `"${selectedCategory}"`} fit within your ₹{budget.toLocaleString('en-IN')} budget limit. Try increasing your budget slider above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topItems.map((item) => {
            const { listing, scores, priceIndicators, anomalyReport, rank } = item;
            const savings = budget - listing.price;
            const discount = priceIndicators.discountPercentage;

            return (
              <div
                key={listing.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                {/* Product Cover Image with Rank & Score Overlays */}
                <div className="relative">
                  <ProductImage
                    category={listing.category}
                    itemTitle={listing.item}
                    imageUrl={listing.imageUrl}
                    condition={listing.condition}
                    className="w-full h-44 border-b border-slate-100"
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 z-20 inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-md shadow-xs border ${getRankBadgeStyle(
                      rank
                    )}`}
                  >
                    Rank #{rank}
                  </span>
                  <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200 text-right shadow-xs">
                    <span className="text-sm font-bold font-mono tabular-nums text-indigo-700">
                      {scores.compositeScore.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title & Category */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {listing.item}
                    </h3>

                    {/* Clean unboxed metadata with subtle dots */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <span>{listing.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{listing.age !== null ? `${listing.age} yr` : 'Age: Imputed'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{listing.condition || 'Average'}</span>
                  </div>

                  {/* Price Block */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                        ₹{listing.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {listing.originalPrice ? (
                          <>
                            Orig: <span className="line-through font-mono">₹{listing.originalPrice.toLocaleString('en-IN')}</span>
                            {discount !== null && (
                              <span className="ml-1.5 text-emerald-700 font-semibold font-mono">({discount}% off)</span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Original: Baseline Imputed</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-700 font-mono">
                        +₹{savings.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[10px] text-slate-400">under budget</div>
                    </div>
                  </div>

                  {/* Score Breakdown Mini Bars */}
                  <div className="mt-4 space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200/70 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Affordability Index:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {Math.round(scores.affordabilityScore * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round(scores.affordabilityScore * 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-slate-600 pt-1">
                      <span>Condition Rating:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {Math.round(scores.conditionScore * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round(scores.conditionScore * 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-slate-600 pt-1">
                      <span>Hardware Longevity:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {Math.round(scores.ageScore * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round(scores.ageScore * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="mt-3 p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-100 text-xs text-indigo-950">
                    <span className="font-semibold block mb-0.5">Why Recommended:</span>
                    <p className="leading-relaxed">{item.recommendationReason}</p>
                    {item.tieBreakerApplied && (
                      <span className="block mt-1 text-[11px] text-indigo-700 italic">
                        {item.tieBreakerApplied}
                      </span>
                    )}
                  </div>

                  {/* Anomaly Notice if flagged */}
                  {anomalyReport.isAnomaly && (
                    <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>{anomalyReport.message} (Informational flag only)</span>
                    </div>
                  )}
                </div>

                {/* Inspect Score Button */}
                <button
                  onClick={() => onInspect(item)}
                  className="mt-4 w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Inspect Calculation Math</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
