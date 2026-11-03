/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Listing, PreferenceWeights, PriorityPreset, RankedListing } from './types/marketplace';
import { INITIAL_BENCHMARK_LISTINGS } from './data/benchmarkData';
import { rankListings } from './utils/rankingEngine';

import { TopNav } from './components/TopNav';
import { BudgetPreferenceBar } from './components/BudgetPreferenceBar';
import { TopRecommendations } from './components/TopRecommendations';
import { ListingCard } from './components/ListingCard';
import { ListingTable } from './components/ListingTable';
import { ListingModal } from './components/ListingModal';
import { InspectionModal } from './components/InspectionModal';
import { AlgorithmDocumentationModal } from './components/AlgorithmDocumentationModal';
import { DataManagementModal } from './components/DataManagementModal';
import { AnomalyExplanationModal } from './components/AnomalyExplanationModal';
import { EdgeCaseAuditView } from './components/EdgeCaseAuditView';

import { LayoutGrid, List, AlertTriangle, ArrowUpDown, Filter, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'smart_student_marketplace_listings_v2';

export default function App() {
  // 1. Core State
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Backfill images from benchmark if missing
          const benchmarkMap = new Map(INITIAL_BENCHMARK_LISTINGS.map((i) => [i.id, i.imageUrl]));
          return parsed.map((item: Listing) => ({
            ...item,
            imageUrl: item.imageUrl || benchmarkMap.get(item.id),
          }));
        }
      }
    } catch (e) {
      console.warn('Failed reading from local storage:', e);
    }
    return INITIAL_BENCHMARK_LISTINGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [budget, setBudget] = useState(23000); // Benchmark default from problem statement
  const [priorityPreset, setPriorityPreset] = useState<PriorityPreset>('balanced');
  const [weights, setWeights] = useState<PreferenceWeights>({
    affordability: 0.40,
    condition: 0.35,
    age: 0.25,
  });

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [activeTab, setActiveTab] = useState<'browse' | 'recommendations' | 'anomalies' | 'edgecases'>('browse');

  // 2. Modals State
  const [inspectingItem, setInspectingItem] = useState<RankedListing | null>(null);
  const [anomalyItem, setAnomalyItem] = useState<RankedListing | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed saving to local storage:', e);
    }
  }, [listings]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [listings]);

  // Filter listings by search query
  const searchedListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase().trim();
    return listings.filter(
      (item) =>
        item.item.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [listings, searchQuery]);

  // Run Ranking Engine
  const { rankedListings, categoryStatsMap } = useMemo(() => {
    return rankListings(searchedListings, budget, weights, selectedCategory);
  }, [searchedListings, budget, weights, selectedCategory]);

  // Eligible & Top 3 Recommendations
  const eligibleListings = useMemo(() => {
    return rankedListings.filter((item) => item.isEligible);
  }, [rankedListings]);

  const topThreeEligible = useMemo(() => {
    return eligibleListings.slice(0, 3);
  }, [eligibleListings]);

  // Anomalies list
  const anomaliesList = useMemo(() => {
    return rankedListings.filter((item) => item.anomalyReport.isAnomaly);
  }, [rankedListings]);

  // Handlers for Add / Edit / Delete
  const handleSaveListing = (savedListing: Listing) => {
    setListings((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === savedListing.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedListing;
        return updated;
      }
      return [savedListing, ...prev];
    });
    setEditingListing(null);
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm(`Delete listing ${id}?`)) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditListing = (item: RankedListing) => {
    setEditingListing(item.listing);
    setIsListingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingListing(null);
          setIsListingModalOpen(true);
        }}
        onOpenDocsModal={() => setIsDocsModalOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        totalListingsCount={listings.length}
      />

      {/* Global Filter & Budget Preference Bar */}
      <BudgetPreferenceBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        budget={budget}
        setBudget={setBudget}
        priorityPreset={priorityPreset}
        setPriorityPreset={setPriorityPreset}
        weights={weights}
        setWeights={setWeights}
        onResetBenchmarkBudget={() => setBudget(23000)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: BROWSE ALL LISTINGS */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Top 3 Spotlight Callout */}
            <TopRecommendations
              topItems={topThreeEligible}
              budget={budget}
              priorityPreset={priorityPreset}
              onInspect={(item) => setInspectingItem(item)}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              selectedCategory={selectedCategory}
            />

            {/* Section Header: All Listings with View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedCategory === 'All' ? 'Marketplace Inventory' : `${selectedCategory} Listings`}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Showing {rankedListings.length} items
                  {' '}· {eligibleListings.length} within ₹{budget.toLocaleString('en-IN')} budget
                  {' '}· {anomaliesList.length} flagged price anomalies
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Dense Benchmark Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Listings Grid or Table */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rankedListings.map((item) => (
                  <ListingCard
                    key={item.listing.id}
                    item={item}
                    onInspect={(i) => setInspectingItem(i)}
                    onEdit={(i) => handleEditListing(i)}
                    onDelete={(id) => handleDeleteListing(id)}
                    onExplainAnomaly={(i) => setAnomalyItem(i)}
                  />
                ))}
              </div>
            ) : (
              <ListingTable
                items={rankedListings}
                onInspect={(i) => setInspectingItem(i)}
                onEdit={(i) => handleEditListing(i)}
                onDelete={(id) => handleDeleteListing(id)}
                onExplainAnomaly={(i) => setAnomalyItem(i)}
              />
            )}
          </div>
        )}

        {/* TAB 2: TOP 3 RECOMMENDATIONS DEDICATED VIEW */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <TopRecommendations
              topItems={topThreeEligible}
              budget={budget}
              priorityPreset={priorityPreset}
              onInspect={(item) => setInspectingItem(item)}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              selectedCategory={selectedCategory}
            />

            {/* Other Eligible Runners Up */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Other Eligible Contenders Within Budget (Ranks #4+)
              </h3>
              {eligibleListings.length > 3 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {eligibleListings.slice(3).map((item) => (
                    <ListingCard
                      key={item.listing.id}
                      item={item}
                      onInspect={(i) => setInspectingItem(i)}
                      onEdit={(i) => handleEditListing(i)}
                      onDelete={(id) => handleDeleteListing(id)}
                      onExplainAnomaly={(i) => setAnomalyItem(i)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No additional contenders within current budget filter.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRICE ANOMALIES INSPECTOR */}
        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Within-Category Price Anomaly Inspector (25 Points)
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Listings are compared exclusively within their product category against the category median price.
                Flags identify significant price deviations (&ge;45% deviation, severe discount ratios, or prices exceeding original retail).
                <strong> Note: Statistical anomaly flags are NOT proof of fraud.</strong>
              </p>
            </div>

            {anomaliesList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">
                  No price anomalies detected in current filter selection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {anomaliesList.map((item) => (
                  <ListingCard
                    key={item.listing.id}
                    item={item}
                    onInspect={(i) => setInspectingItem(i)}
                    onEdit={(i) => handleEditListing(i)}
                    onDelete={(id) => handleDeleteListing(id)}
                    onExplainAnomaly={(i) => setAnomalyItem(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EDGE-CASE AUDIT & DEMONSTRATION SUITE */}
        {activeTab === 'edgecases' && (
          <EdgeCaseAuditView
            rankedListings={rankedListings}
            budget={budget}
            priorityPreset={priorityPreset}
            onSetPriority={(preset) => {
              setPriorityPreset(preset);
              if (preset === 'affordability') {
                setWeights({ affordability: 0.70, condition: 0.15, age: 0.15 });
              } else if (preset === 'condition') {
                setWeights({ affordability: 0.15, condition: 0.65, age: 0.20 });
              } else {
                setWeights({ affordability: 0.40, condition: 0.35, age: 0.25 });
              }
            }}
            onInspect={(item) => setInspectingItem(item)}
            onExplainAnomaly={(item) => setAnomalyItem(item)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Smart Student Marketplace · Code Crack 3.0 Official Problem Statement Prototype
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Formula Documentation
            </button>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Import / Export CSV
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InspectionModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        budget={budget}
        weights={weights}
      />

      <AnomalyExplanationModal
        item={anomalyItem}
        onClose={() => setAnomalyItem(null)}
      />

      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setEditingListing(null);
        }}
        onSave={handleSaveListing}
        editingListing={editingListing}
        categories={categories}
      />

      <AlgorithmDocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        listings={listings}
        onUpdateListings={(newListings) => setListings(newListings)}
      />
    </div>
  );
}
