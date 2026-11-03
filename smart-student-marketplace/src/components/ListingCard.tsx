/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Edit2, Trash2, Calculator, AlertTriangle, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { RankedListing } from '../types/marketplace';
import { ProductImage } from './ProductImage';

interface ListingCardProps {
  item: RankedListing;
  onInspect: (item: RankedListing) => void;
  onEdit: (item: RankedListing) => void;
  onDelete: (id: string) => void;
  onExplainAnomaly: (item: RankedListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  item,
  onInspect,
  onEdit,
  onDelete,
  onExplainAnomaly,
}) => {
  const { listing, priceIndicators, anomalyReport, imputationReport, scores, isEligible, rank } = item;

  const getAnomalyBadge = () => {
    if (!anomalyReport.isAnomaly) {
      return (
        <button
          onClick={() => onExplainAnomaly(item)}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Price aligns with category median"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Fair Market</span>
        </button>
      );
    }

    if (anomalyReport.type === 'underpriced') {
      return (
        <button
          onClick={() => onExplainAnomaly(item)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
          title="Click to see why this flag is NOT proof of fraud"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Underpriced ({anomalyReport.deviationPercent}%)</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => onExplainAnomaly(item)}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
        title="Click to inspect price deviation rationale"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        <span>Overpriced (+{anomalyReport.deviationPercent}%)</span>
      </button>
    );
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border bg-white overflow-hidden shadow-xs transition-all duration-200 hover:shadow-md ${
        isEligible ? 'border-slate-200' : 'border-slate-200 bg-slate-50/50 opacity-80'
      }`}
    >
      {/* Product Image Cover */}
      <ProductImage
        category={listing.category}
        itemTitle={listing.item}
        imageUrl={listing.imageUrl}
        condition={listing.condition}
        className="w-full h-44 border-b border-slate-100"
      />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: ID, Category & Anomaly Tag */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-slate-700">{listing.id}</span>
              <span aria-hidden="true">·</span>
              <span>{listing.category}</span>
            </div>
            {getAnomalyBadge()}
          </div>

          {/* Item Title */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
            {listing.item}
          </h3>

        {/* Unboxed Metadata Line */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
          <span>{listing.age !== null ? `${listing.age} yrs old` : 'Age: Imputed (2.0y)'}</span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-slate-800">{listing.condition || 'Average (Imputed)'}</span>
          {isEligible ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In Budget
              </span>
            </>
          ) : (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Over Budget
              </span>
            </>
          )}
        </div>

        {/* Price & Indicators Box */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 mb-3 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                ₹{listing.price.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {listing.originalPrice ? (
                  <span>
                    Orig: <span className="line-through font-mono">₹{listing.originalPrice.toLocaleString('en-IN')}</span>
                  </span>
                ) : (
                  <span className="italic text-slate-400">Orig: ₹{priceIndicators.categoryMedianPrice * 2} (Imputed)</span>
                )}
              </div>
            </div>

            <div className="text-right">
              {priceIndicators.priceToOriginalRatio !== null && (
                <div className="text-xs font-mono font-semibold text-slate-700">
                  {Math.round(priceIndicators.priceToOriginalRatio * 100)}% of original
                </div>
              )}
              {priceIndicators.discountPercentage !== null && (
                <div className="text-xs font-semibold text-emerald-700 font-mono">
                  {priceIndicators.discountPercentage}% discount
                </div>
              )}
            </div>
          </div>

          {/* Category median comparison */}
          <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-200">
            <span>Cat. Median: ₹{priceIndicators.categoryMedianPrice.toLocaleString('en-IN')}</span>
            <span
              className={`font-mono font-medium ${
                priceIndicators.deviationFromMedianPercent < 0
                  ? 'text-emerald-700'
                  : priceIndicators.deviationFromMedianPercent > 30
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {priceIndicators.deviationFromMedianPercent >= 0 ? '+' : ''}
              {priceIndicators.deviationFromMedianPercent}% vs median
            </span>
          </div>
        </div>

        {/* Score & Rank Line */}
        {isEligible && (
          <div className="flex items-center justify-between text-xs py-1 px-2 bg-indigo-50/60 border border-indigo-100 rounded-md mb-3">
            <span className="font-semibold text-indigo-900">
              Rank #{rank}
            </span>
            <span className="font-mono font-bold text-indigo-700">
              Score: {scores.compositeScore.toFixed(1)}/100
            </span>
          </div>
        )}

        {/* Imputation / Edge-case Warning if applicable */}
        {imputationReport.isImputed && (
          <div className="text-[11px] text-amber-700 bg-amber-50/80 border border-amber-200 rounded p-1.5 mb-3">
            <span>Missing data imputed: {imputationReport.hasMissingAge ? 'Age' : ''} {imputationReport.hasMissingOriginalPrice ? 'Orig. Price' : ''} (-{scores.penaltyDeduction} pts)</span>
          </div>
        )}

        {listing.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
            {listing.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
        <button
          onClick={() => onInspect(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          title="Inspect Formula Math & Category Distribution"
        >
          <Calculator className="w-3.5 h-3.5 text-slate-500" />
          <span>Inspect Math</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Edit Listing"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(listing.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete Listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};
