/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RankedListing } from '../types/marketplace';
import { Calculator, Edit2, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ProductImage } from './ProductImage';

interface ListingTableProps {
  items: RankedListing[];
  onInspect: (item: RankedListing) => void;
  onEdit: (item: RankedListing) => void;
  onDelete: (id: string) => void;
  onExplainAnomaly: (item: RankedListing) => void;
}

export const ListingTable: React.FC<ListingTableProps> = ({
  items,
  onInspect,
  onEdit,
  onDelete,
  onExplainAnomaly,
}) => {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-3 px-3">Rank / ID</th>
            <th className="py-3 px-3">Item & Category</th>
            <th className="py-3 px-3 text-right">Price ₹</th>
            <th className="py-3 px-3 text-right">Original ₹</th>
            <th className="py-3 px-3 text-center">Ratio / Disc.</th>
            <th className="py-3 px-3 text-center">Age</th>
            <th className="py-3 px-3 text-center">Condition</th>
            <th className="py-3 px-3 text-right">Score</th>
            <th className="py-3 px-3 text-center">Price Status</th>
            <th className="py-3 px-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {items.map((item) => {
            const { listing, priceIndicators, anomalyReport, imputationReport, scores, isEligible, rank } = item;

            return (
              <tr
                key={listing.id}
                className={`hover:bg-slate-50/80 transition-colors ${
                  !isEligible ? 'bg-slate-50/40 text-slate-400' : ''
                }`}
              >
                {/* Rank & ID */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {isEligible ? (
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        #{rank}
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-500 font-medium px-1 py-0.5 bg-rose-50 rounded">
                        Over
                      </span>
                    )}
                    <span className="font-mono text-slate-600 font-medium">{listing.id}</span>
                  </div>
                </td>

                {/* Title & Category with mini thumbnail */}
                <td className="py-2.5 px-3 max-w-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 border border-slate-200">
                      <ProductImage
                        category={listing.category}
                        itemTitle={listing.item}
                        imageUrl={listing.imageUrl}
                        condition={listing.condition}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{listing.item}</div>
                      <div className="text-[11px] text-slate-400">{listing.category}</div>
                    </div>
                  </div>
                </td>

                {/* Price ₹ */}
                <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900 whitespace-nowrap">
                  ₹{listing.price.toLocaleString('en-IN')}
                </td>

                {/* Original ₹ */}
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                  {listing.originalPrice !== null ? (
                    `₹${listing.originalPrice.toLocaleString('en-IN')}`
                  ) : (
                    <span className="italic text-slate-400">Imputed</span>
                  )}
                </td>

                {/* Price Ratio / Discount */}
                <td className="py-3 px-3 text-center font-mono tabular-nums whitespace-nowrap">
                  {priceIndicators.priceToOriginalRatio !== null ? (
                    <div>
                      <span className="font-semibold text-slate-800">
                        {priceIndicators.priceToOriginalRatio}
                      </span>
                      <span className="text-[10px] text-emerald-700 block">
                        ({priceIndicators.discountPercentage}% off)
                      </span>
                    </div>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Age */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {listing.age !== null ? (
                    `${listing.age} yr`
                  ) : (
                    <span className="italic text-amber-600" title="Missing age imputed as 2.0 yrs">
                      2.0*
                    </span>
                  )}
                </td>

                {/* Condition */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className="font-medium text-slate-700">{listing.condition || 'Average*'}</span>
                </td>

                {/* Score */}
                <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-indigo-700 whitespace-nowrap">
                  {isEligible ? scores.compositeScore.toFixed(1) : '—'}
                </td>

                {/* Anomaly / Price Status */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {anomalyReport.isAnomaly ? (
                    <button
                      onClick={() => onExplainAnomaly(item)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer ${
                        anomalyReport.type === 'underpriced'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                      title={anomalyReport.message}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{anomalyReport.type === 'underpriced' ? 'Underpriced' : 'Overpriced'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Normal</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onInspect(item)}
                      className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                      title="Inspect Scoring Math"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(listing.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
