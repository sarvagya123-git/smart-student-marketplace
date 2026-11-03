/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calculator, ShieldAlert, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { RankedListing, PreferenceWeights } from '../types/marketplace';
import { ProductImage } from './ProductImage';

interface InspectionModalProps {
  item: RankedListing | null;
  onClose: () => void;
  budget: number;
  weights: PreferenceWeights;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  item,
  onClose,
  budget,
  weights,
}) => {
  if (!item) return null;

  const { listing, priceIndicators, anomalyReport, imputationReport, scores, isEligible, rank } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Scoring & Price Inspection: {listing.item}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-sm text-slate-700">
          {/* Product Photo Banner & Spec Lockup */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 border border-slate-200">
              <ProductImage
                category={listing.category}
                itemTitle={listing.item}
                imageUrl={listing.imageUrl}
                condition={listing.condition}
                className="w-full h-full"
              />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 text-xs self-center">
              <div>
                <span className="text-slate-500 block mb-0.5">Item ID & Category</span>
                <span className="font-semibold text-slate-900">{listing.id} · {listing.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Price / Original</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{listing.price.toLocaleString('en-IN')}
                  {listing.originalPrice && (
                    <span className="text-slate-400 font-normal"> / ₹{listing.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Eligibility</span>
                <span className={`font-semibold ${isEligible ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isEligible ? `Eligible (Rank #${rank})` : `Over Budget (+₹${listing.price - budget})`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Composite Score</span>
                <span className="font-mono font-bold text-base text-indigo-700">
                  {scores.compositeScore.toFixed(2)}
                  <span className="text-xs text-slate-400 font-normal"> / 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Step-by-Step Mathematical Formulation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
              1. Mathematical Score Formulation
            </h3>
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 font-mono text-xs space-y-2 text-indigo-950">
              <div className="font-semibold text-indigo-900">
                Score Formula: 100 × (w₁·S_afford + w₂·S_cond + w₃·S_age) − Penalty
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between border-b border-indigo-100/60 pb-1">
                  <span>Affordability Sub-score (S_afford):</span>
                  <span className="font-bold">{scores.affordabilityScore.toFixed(4)} × {weights.affordability} = +{(scores.affordabilityScore * weights.affordability * 100).toFixed(2)} pts</span>
                </div>
                <div className="flex justify-between border-b border-indigo-100/60 pb-1">
                  <span>Condition Sub-score (S_cond):</span>
                  <span className="font-bold">{scores.conditionScore.toFixed(4)} ({listing.condition || 'Average*'}) × {weights.condition} = +{(scores.conditionScore * weights.condition * 100).toFixed(2)} pts</span>
                </div>
                <div className="flex justify-between border-b border-indigo-100/60 pb-1">
                  <span>Age / Longevity Sub-score (S_age):</span>
                  <span className="font-bold">{scores.ageScore.toFixed(4)} ({listing.age !== null ? `${listing.age}y` : '2.0y*'}) × {weights.age} = +{(scores.ageScore * weights.age * 100).toFixed(2)} pts</span>
                </div>
                {scores.penaltyDeduction > 0 && (
                  <div className="flex justify-between text-amber-700 border-b border-indigo-100/60 pb-1">
                    <span>Imputation Uncertainty Penalty:</span>
                    <span className="font-bold">−{scores.penaltyDeduction.toFixed(2)} pts</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-indigo-900 pt-1 text-xs">
                  <span>Final Calculated Composite Score:</span>
                  <span>{scores.compositeScore.toFixed(2)} / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Within-Category Price Indicators & Benchmark Distribution */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
              2. Within-Category Price Indicators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block mb-1">Price / Original Ratio</span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {priceIndicators.priceToOriginalRatio !== null ? priceIndicators.priceToOriginalRatio : 'N/A'}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Discount: {priceIndicators.discountPercentage}% off retail
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block mb-1">Category Median Price</span>
                <span className="font-mono text-base font-bold text-slate-900">
                  ₹{priceIndicators.categoryMedianPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Item deviation: {priceIndicators.deviationFromMedianPercent >= 0 ? '+' : ''}
                  {priceIndicators.deviationFromMedianPercent}%
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block mb-1">Estimated Fair Market Value</span>
                <span className="font-mono text-base font-bold text-slate-900">
                  ₹{priceIndicators.fairPriceEstimate.toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Fair band: ₹{priceIndicators.fairPriceRange[0].toLocaleString('en-IN')} – ₹{priceIndicators.fairPriceRange[1].toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Anomaly Report & Why Flags Are Not Proof of Fraud */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
              3. Price Anomaly Analysis & Fraud Disclaimer
            </h3>

            <div
              className={`p-4 rounded-xl border ${
                anomalyReport.isAnomaly
                  ? anomalyReport.type === 'underpriced'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-rose-50/70 border-rose-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-xs">
                {anomalyReport.isAnomaly ? (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                )}
                <span className="text-slate-900">Status: {anomalyReport.message}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {anomalyReport.detailedReason}
              </p>

              {/* Crucial Analytical Requirement from Problem Statement */}
              <div className="bg-white/90 p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Why this anomaly flag is NOT proof of fraud:</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {anomalyReport.notProofOfFraudExplanation}
                </p>
                <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5 mt-2">
                  <li><strong>Distress liquidity:</strong> Students relocating or finishing semesters frequently offer 50%+ discounts for immediate cash.</li>
                  <li><strong>Unspecified component upgrades:</strong> Higher prices often reflect upgraded RAM, SSDs, or accessories not listed in titles.</li>
                  <li><strong>Asymmetric cosmetic wear:</strong> Non-functional scratches or weak batteries cause steep fair price drops without fraudulent intent.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Edge Case Audit */}
          {imputationReport.isImputed && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Edge Case Handling: Imputed Missing Values
              </span>
              <p className="text-amber-800 leading-relaxed">
                This listing had missing fields that were handled deterministically:
                {imputationReport.hasMissingOriginalPrice && ` Original price was missing (imputed as category median original of ₹${imputationReport.imputedOriginalPrice.toLocaleString('en-IN')}).`}
                {imputationReport.hasMissingAge && ` Age was missing (imputed as baseline ${imputationReport.imputedAge} years).`}
                {imputationReport.hasMissingCondition && ` Condition was missing (imputed as ${imputationReport.imputedCondition}).`}
                {' '}An uncertainty penalty of {scores.penaltyDeduction} points was deducted from the final composite score to preserve ranking integrity.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
