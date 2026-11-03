/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface AlgorithmDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmDocumentationModal: React.FC<AlgorithmDocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Smart Student Marketplace — Algorithm & Methodology Documentation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1.5">
            <h3 className="font-bold text-indigo-950 text-sm">
              Code Crack 3.0 • Official Problem Statement Compliance Overview
            </h3>
            <p className="text-indigo-900">
              This system solves the student marketplace dilemma where peers struggle to evaluate fair prices across second-hand laptops, bicycles, textbooks, and gadgets. It operates strictly within categories, enforces a documented budget-aware ranking algorithm, detects price anomalies, and handles real-world edge cases.
            </p>
          </div>

          {/* 1. Ranking Formula */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Documented Ranking Formula (25 Points)
            </h4>
            <p>
              Rankings are computed dynamically using three normalized factors (scale 0.0 to 1.0) and user-configurable preference weights:
            </p>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] space-y-1">
              <div className="text-amber-300 font-semibold">
                Composite Score = 100 × (w₁ · S_afford + w₂ · S_cond + w₃ · S_age) − Penalty
              </div>
              <div className="text-slate-400">Where w₁ + w₂ + w₃ = 1.00</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-1">Affordability Score (S_afford)</span>
                <p className="text-[11px] text-slate-600">
                  Combines budget headroom and category relative price:
                  <br />
                  <code className="text-indigo-700 font-mono">0.6 × (Budget − P)/Budget + 0.4 × (1 − (P − Min)/(Max − Min))</code>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-1">Condition Score (S_cond)</span>
                <p className="text-[11px] text-slate-600">
                  Discrete mapping based on physical degradation:
                  <br />
                  <code className="text-indigo-700 font-mono">Excellent: 1.0 | Good: 0.8 | Average: 0.6 | Fair: 0.4 | Poor: 0.2</code>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-1">Age & Longevity Score (S_age)</span>
                <p className="text-[11px] text-slate-600">
                  Bounded decay against expected campus product lifespan (6 years):
                  <br />
                  <code className="text-indigo-700 font-mono">max(0, 1 − Age / 6.0)</code>
                </p>
              </div>
            </div>
          </div>

          {/* 2. Affordability vs Condition Demonstration */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Affordability vs. Condition Trade-Offs (Analytical Challenge 2)
            </h4>
            <p>
              The system enables buyers to instantly pivot between budget preservation and condition quality:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Balanced Preset (Default):</strong> w₁=40% Affordability, w₂=35% Condition, w₃=25% Age. Ideal for standard students seeking solid reliability with good savings.
              </li>
              <li>
                <strong>Affordability First:</strong> w₁=70% Affordability, w₂=15% Condition, w₃=15% Age. Elevates lower-priced machines (e.g. Laptop B at ₹18,000 or Laptop E at ₹15,000) that leave massive budget cash reserves.
              </li>
              <li>
                <strong>Condition / Quality First:</strong> w₁=15% Affordability, w₂=65% Condition, w₃=20% Age. Promotes mint or like-new hardware (e.g. Laptop C in Excellent condition), even when priced close to budget limit.
              </li>
            </ul>
          </div>

          {/* 3. Price Anomaly Rule & Why Flag is NOT Proof of Fraud */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
              3. Within-Category Price Anomaly Rule (25 Points)
            </h4>
            <p>
              Comparisons are strictly conducted <em>within similar product categories</em> (never comparing bicycle prices against laptops).
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
              <span className="font-bold text-amber-950 block">Within-Category Detection Criteria:</span>
              <ul className="list-disc pl-5 space-y-1 text-amber-900 text-[11px]">
                <li>
                  <strong>Category Median (M):</strong> Middle value of sorted category prices, robust against extreme outliers.
                </li>
                <li>
                  <strong>Underpriced Flag:</strong> Deviation &le; -45% from median, OR Price/Original &le; 0.22 for items under 2.5 years old.
                </li>
                <li>
                  <strong>Overpriced Flag:</strong> Deviation &ge; +45% from median, OR Price &gt; Original Retail Price.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Why an Anomaly Flag is NOT Proof of Fraud:</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Statistical deviation identifies unusual listings for buyer inspection, not misconduct. Critical real-world justifications include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
                <div className="p-2.5 bg-white border border-slate-200 rounded">
                  <span className="font-semibold text-slate-800 block mb-0.5">Legitimate Underpricing:</span>
                  Students urgently moving hostels or graduating that day require immediate cash liquidity. Unlisted cosmetic scuffs or degraded battery capacity may also explain low price legitimately.
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded">
                  <span className="font-semibold text-slate-800 block mb-0.5">Legitimate Overpricing:</span>
                  Sellers often install aftermarket upgrades (16GB/32GB RAM, 1TB NVMe, upgraded Shimano gears) or sell rare out-of-print textbooks. High anchor prices also allow room for friendly campus negotiation.
                </div>
              </div>
            </div>
          </div>

          {/* 4. Edge Cases Handling */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
              4. Edge-Case Handling & Assumptions (15 Points)
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Missing Values Imputation:</span>
                <p className="text-[11px] text-slate-600">
                  Missing original prices are imputed via category median original price. Missing age defaults to baseline 2.0 years. Missing condition defaults to Average. A transparent <strong>Uncertainty Penalty (0.04 to 0.09)</strong> is deducted from the composite score to reward complete listings.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Deterministic Tie-Breaking Hierarchy:</span>
                <p className="text-[11px] text-slate-600">
                  When two products tie in composite score (within &plusmn;0.05), ties are broken deterministically in priority order:
                  (1) Lower absolute price &rarr; (2) Younger age in years &rarr; (3) Superior condition grade &rarr; (4) Higher discount percentage &rarr; (5) Alphanumeric ID.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Categories with Too Few Comparable Items (N &lt; 3):</span>
                <p className="text-[11px] text-slate-600">
                  When a category has fewer than 3 listings (e.g. Musical Instruments with N=2), sample variance is too high for median-based anomaly certainty. The UI displays an explicit <em>Low Sample Caution</em> banner and suppresses false positive flags.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Assumptions Documented:</span>
                <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                  <li>Products within a category share reasonably comparable baseline utility (e.g., student laptops).</li>
                  <li>No machine learning or external API dependencies are assumed.</li>
                  <li>All prices are in Indian Rupees (₹).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
