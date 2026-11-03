/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RankedListing, PriorityPreset, PreferenceWeights } from '../types/marketplace';
import { AlertCircle, CheckCircle, ArrowRightLeft, Layers, Sparkles, Scale, Info } from 'lucide-react';

interface EdgeCaseAuditViewProps {
  rankedListings: RankedListing[];
  budget: number;
  priorityPreset: PriorityPreset;
  onSetPriority: (preset: PriorityPreset) => void;
  onInspect: (item: RankedListing) => void;
  onExplainAnomaly: (item: RankedListing) => void;
}

export const EdgeCaseAuditView: React.FC<EdgeCaseAuditViewProps> = ({
  rankedListings,
  budget,
  priorityPreset,
  onSetPriority,
  onInspect,
  onExplainAnomaly,
}) => {
  // Find key test items from benchmark
  const distressItem = rankedListings.find((r) => r.listing.id === 'P06');
  const overpricedItem = rankedListings.find((r) => r.listing.id === 'P22');
  const missingOrigPriceItem = rankedListings.find((r) => r.listing.id === 'P08');
  const missingAgeItem = rankedListings.find((r) => r.listing.id === 'P14');
  const musicalInstruments = rankedListings.filter((r) => r.listing.category === 'Musical Instruments');

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Analytical Challenges & Edge-Case Evaluation Suite (15 Points)
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          This testbed verifies the analytical robustness mandated in the Code Crack 3.0 problem statement:
          handling missing values, categories with few comparable items, unusually priced outliers, and live demonstration of buyer priority shifts.
        </p>
      </div>

      {/* Grid of 4 Core Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Case 1: Missing Values Imputation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Case 1 · Missing Values Handling
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                Imputation + Penalty
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Deterministic Imputation & Uncertainty Penalty
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Listings often arrive with missing fields (e.g., student forgot original invoice price or purchase year). The engine avoids crashing by imputing category medians and penalizing composite scores.
            </p>

            <div className="space-y-2 text-xs">
              {missingOrigPriceItem && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">{missingOrigPriceItem.listing.item}</span>
                    <span className="font-mono text-slate-500">{missingOrigPriceItem.listing.id}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Original Price was missing. Imputed as category median original: <strong>₹{missingOrigPriceItem.imputationReport.imputedOriginalPrice.toLocaleString('en-IN')}</strong>.
                    Uncertainty penalty: <strong className="text-amber-700">−{missingOrigPriceItem.scores.penaltyDeduction} pts</strong>.
                  </p>
                </div>
              )}

              {missingAgeItem && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">{missingAgeItem.listing.item}</span>
                    <span className="font-mono text-slate-500">{missingAgeItem.listing.id}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Age was missing. Imputed as baseline <strong>{missingAgeItem.imputationReport.imputedAge} years</strong>.
                    Uncertainty penalty applied to final ranking.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Result: Unbroken ranking with transparent confidence tag</span>
            {missingOrigPriceItem && (
              <button
                onClick={() => onInspect(missingOrigPriceItem)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Inspect Imputation Math &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Test Case 2: Categories with Too Few Comparable Items */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Case 2 · Small Sample Categories (N &lt; 3)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
                Sample Size Warning
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Sample-Size Guardrails & Anomaly Suppression
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              When a category has fewer than 3 listings (such as <em>Musical Instruments</em> with only 2 guitars/keyboards), sample variance is too high to calculate a reliable median or IQR.
            </p>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Musical Instruments (N = {musicalInstruments.length})</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Rather than generating spurious false-positive anomaly warnings, the system detects low sample size (N &lt; 3), informs the user, and applies cautious confidence weighting.
              </p>
              <div className="pt-1 border-t border-amber-200/60 font-mono text-[11px] text-amber-950">
                Items: P27 Yamaha F280 (₹4,800) · P28 Casio CT-S200 (₹5,200)
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Result: Prevents false fraud accusations in small batches</span>
            {musicalInstruments[0] && (
              <button
                onClick={() => onInspect(musicalInstruments[0])}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Inspect Sample Guardrail &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Test Case 3: Price Outliers & Fraud Caveats */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Case 3 · Price Anomalies & Fraud Caveats
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-medium">
                Within-Category Median Rule
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Severe Underpriced & Overpriced Outlier Rules
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Detects listings that deviate &ge;45% from category median or exceed original retail, while explicitly explaining why a flag is NOT proof of fraud.
            </p>

            <div className="space-y-2 text-xs">
              {distressItem && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">{distressItem.listing.item}</span>
                    <span className="text-amber-700 font-semibold text-[11px]">
                      {distressItem.anomalyReport.deviationPercent}% from median
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Listed at ₹7,500 vs Laptop median ₹20,000. Flagged as Underpriced anomaly.
                  </p>
                  <button
                    onClick={() => onExplainAnomaly(distressItem)}
                    className="mt-1 text-indigo-600 hover:text-indigo-800 font-medium text-[11px] cursor-pointer"
                  >
                    View why this distress sale is NOT fraud &rarr;
                  </button>
                </div>
              )}

              {overpricedItem && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">{overpricedItem.listing.item}</span>
                    <span className="text-rose-700 font-semibold text-[11px]">Price &gt; Original Retail</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Listed at ₹2,100 vs original ₹1,600. Out-of-print textbook import justified by seller.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Result: Objective statistical flags without subjective bias</span>
          </div>
        </div>

        {/* Test Case 4: Buyer Preference Shift Live Demonstration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Case 4 · Affordability vs Condition Demonstration
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-medium">
                Live Re-ranking
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              How Recommendations Shift with Buyer Priority
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Directly demonstrates the problem statement requirement: "Demonstrate how recommendations change when a buyer prioritizes affordability versus condition."
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
              <span className="font-semibold text-slate-800 block">Switch Priority Now:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSetPriority('affordability')}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    priorityPreset === 'affordability'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Affordability First</div>
                  <div className={`text-[10px] ${priorityPreset === 'affordability' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    w₁=70% price, w₂=15% cond
                  </div>
                </button>

                <button
                  onClick={() => onSetPriority('condition')}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    priorityPreset === 'condition'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Condition First</div>
                  <div className={`text-[10px] ${priorityPreset === 'condition' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    w₁=15% price, w₂=65% cond
                  </div>
                </button>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                {priorityPreset === 'affordability' ? (
                  <p>
                    <strong>Observed Shift:</strong> Budget-conscious items like Laptop B (₹18,000) or Laptop E (₹15,000) surge ahead because their massive cash surplus (₹5k–₹8k savings) dominates the 70% affordability weight.
                  </p>
                ) : priorityPreset === 'condition' ? (
                  <p>
                    <strong>Observed Shift:</strong> Mint and Excellent condition items like Laptop C or premium Bicycles climb to the top rank, despite costing more, because physical quality carries 65% of the total score.
                  </p>
                ) : (
                  <p>
                    <strong>Balanced State:</strong> Equalized trade-off between price headroom, hardware condition, and age decay.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Result: Transparent, student-driven algorithmic control</span>
          </div>
        </div>
      </div>
    </div>
  );
};
