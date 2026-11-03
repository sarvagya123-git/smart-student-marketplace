/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, BookOpen, Database, Sparkles } from 'lucide-react';

interface TopNavProps {
  activeTab: 'browse' | 'recommendations' | 'anomalies' | 'edgecases';
  setActiveTab: (tab: 'browse' | 'recommendations' | 'anomalies' | 'edgecases') => void;
  onOpenAddModal: () => void;
  onOpenDocsModal: () => void;
  onOpenDataModal: () => void;
  totalListingsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenDocsModal,
  onOpenDataModal,
  totalListingsCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-tighter">
            CC
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('browse');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors"
          >
            Smart Student Marketplace
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'browse'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 py-4.5'
                : 'hover:text-slate-900 py-4.5'
            }`}
          >
            All Listings ({totalListingsCount})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'recommendations'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 py-4.5'
                : 'hover:text-slate-900 py-4.5'
            }`}
          >
            Top 3 Recommendations
          </button>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'anomalies'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 py-4.5'
                : 'hover:text-slate-900 py-4.5'
            }`}
          >
            Price Anomalies
          </button>
          <button
            onClick={() => setActiveTab('edgecases')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'edgecases'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 py-4.5'
                : 'hover:text-slate-900 py-4.5'
            }`}
          >
            Edge-Case Audit
          </button>
        </nav>

        {/* Zone 3: Actions - Algorithm Docs, Data Import/Export, and Add Listing */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenDocsModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Algorithm & Mathematical Formulation"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Algorithm Docs</span>
          </button>

          <button
            onClick={onOpenDataModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="CSV/JSON Import, Export, & Benchmark Reset"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">CSV / Data</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Listing</span>
          </button>
        </div>
      </div>
    </header>
  );
};
