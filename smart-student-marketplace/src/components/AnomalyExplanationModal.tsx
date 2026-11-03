/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { RankedListing } from '../types/marketplace';

interface AnomalyExplanationModalProps {
  item: RankedListing | null;
  onClose: () => void;
}

export const AnomalyExplanationModal: React.FC<AnomalyExplanationModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  const { listing, anomalyReport, priceIndicators } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Price Anomaly Assessment: {listing.item}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border ${
              anomalyReport.isAnomaly
                ? anomalyReport.type === 'underpriced'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm">
                Statistical Verdict: {anomalyReport.message}
              </span>
              <span className="font-mono text-xs font-semibold">
                {priceIndicators.deviationFromMedianPercent >= 0 ? '+' : ''}
                {priceIndicators.deviationFromMedianPercent}% from Median
              </span>
            </div>
            <p className="text-xs opacity-90 mt-1">
              {anomalyReport.detailedReason}
            </p>
          </div>

          {/* Metric Comparison */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">Listing Price</span>
              <span className="font-mono font-bold text-sm text-slate-900">
                ₹{listing.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Category Median</span>
              <span className="font-mono font-bold text-sm text-slate-900">
                ₹{priceIndicators.categoryMedianPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Fair Model Estimate</span>
              <span className="font-mono font-bold text-sm text-slate-900">
                ₹{priceIndicators.fairPriceEstimate.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Core Problem Statement Deliverable: Why a flag is NOT proof of fraud */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Why this statistical flag is NOT proof of fraud
              </h3>
            </div>
            <p className="text-slate-600">
              In peer-to-peer student marketplaces, statistical outliers occur regularly for valid practical reasons. An algorithmic anomaly flag serves as an invitation for buyer inquiry, never an accusation of deceit:
            </p>

            <div className="space-y-2 text-slate-700">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">1. Distress & Relocation Liquidity</span>
                <p className="text-[11px] text-slate-600">
                  Students graduating or clearing hostel rooms often prioritize converting heavy items into cash within hours over maximizing market valuation.
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">2. Unlisted Upgrades or Accessories</span>
                <p className="text-[11px] text-slate-600">
                  Laptops often have upgraded aftermarket RAM (e.g. 16GB instead of 8GB) or fresh SSDs; bicycles may include ₹2,000 worth of lights, helmet, and new tires.
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">3. Non-Functional Cosmetic or Battery Depreciation</span>
                <p className="text-[11px] text-slate-600">
                  A laptop with an 8-year-old battery needing continuous wall power or a cycle with chipped paint is genuinely discounted without fraudulent intent.
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">4. Seller Valuation Inexperience & Typos</span>
                <p className="text-[11px] text-slate-600">
                  Students often guess prices without conducting research or make simple typographical errors (e.g. typing ₹1,800 instead of ₹18,000).
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Student Inspection Checklist */}
          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1.5">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Recommended Campus Safety Protocol:
            </span>
            <p className="text-indigo-900 text-[11px]">
              Meet on campus in a public library or canteen; inspect the physical hardware, test battery life, verify textbook ISBN editions, and inspect receipt/bill before transferring payment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
