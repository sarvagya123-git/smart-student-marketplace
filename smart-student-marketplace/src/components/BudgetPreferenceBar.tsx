/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, IndianRupee, SlidersHorizontal, ArrowDownUp, Check } from 'lucide-react';
import { PreferenceWeights, PriorityPreset } from '../types/marketplace';

interface BudgetPreferenceBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  budget: number;
  setBudget: (budget: number) => void;
  priorityPreset: PriorityPreset;
  setPriorityPreset: (preset: PriorityPreset) => void;
  weights: PreferenceWeights;
  setWeights: (weights: PreferenceWeights) => void;
  onResetBenchmarkBudget: () => void;
}

export const BudgetPreferenceBar: React.FC<BudgetPreferenceBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  budget,
  setBudget,
  priorityPreset,
  setPriorityPreset,
  weights,
  setWeights,
  onResetBenchmarkBudget,
}) => {
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  const handlePresetSelect = (preset: PriorityPreset) => {
    setPriorityPreset(preset);
    if (preset === 'balanced') {
      setWeights({ affordability: 0.40, condition: 0.35, age: 0.25 });
    } else if (preset === 'affordability') {
      setWeights({ affordability: 0.70, condition: 0.15, age: 0.15 });
    } else if (preset === 'condition') {
      setWeights({ affordability: 0.15, condition: 0.65, age: 0.20 });
    } else if (preset === 'longevity') {
      setWeights({ affordability: 0.20, condition: 0.25, age: 0.55 });
    }
  };

  const handleCustomWeightChange = (key: keyof PreferenceWeights, val: number) => {
    setPriorityPreset('custom');
    const updated = { ...weights, [key]: val };
    const sum = updated.affordability + updated.condition + updated.age;
    if (sum > 0) {
      setWeights({
        affordability: Number((updated.affordability / sum).toFixed(2)),
        condition: Number((updated.condition / sum).toFixed(2)),
        age: Number((updated.age / sum).toFixed(2)),
      });
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Control Line: Search + Budget Slider + Budget Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search by Name */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, specs, or model..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Budget Filter (Problem benchmark: ₹23,000) */}
          <div className="md:col-span-7 flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-slate-700">
              <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
              <span>Max Budget:</span>
            </div>

            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">₹</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  className="w-24 pl-6 pr-2 py-1 text-sm font-semibold font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {budget !== 23000 && (
                <button
                  onClick={onResetBenchmarkBudget}
                  className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors whitespace-nowrap cursor-pointer"
                  title="Reset to problem statement benchmark budget (₹23,000)"
                >
                  Reset ₹23k
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Segmented Control Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority Presets (Mandatory Analytical Challenge: Affordability vs Condition) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 hidden lg:inline">Priority Weighting:</span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => handlePresetSelect('balanced')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  priorityPreset === 'balanced'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Balanced (40% Price, 35% Condition, 25% Age)"
              >
                Balanced
              </button>
              <button
                onClick={() => handlePresetSelect('affordability')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  priorityPreset === 'affordability'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Affordability First (70% Price, 15% Condition, 15% Age)"
              >
                Affordability (Price)
              </button>
              <button
                onClick={() => handlePresetSelect('condition')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  priorityPreset === 'condition'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Quality First (15% Price, 65% Condition, 20% Age)"
              >
                Condition (Quality)
              </button>
              <button
                onClick={() => handlePresetSelect('longevity')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  priorityPreset === 'longevity'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Longevity First (20% Price, 25% Condition, 55% Low Age)"
              >
                Low Age
              </button>
            </div>

            <button
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                showWeightSliders
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle Custom Formula Weights"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Collapsible Custom Weight Sliders */}
        {showWeightSliders && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Custom Ranking Algorithm Weights</span>
              <span className="text-slate-500">
                Formula: Score = 100 × (w₁·Affordability + w₂·Condition + w₃·Age) − Penalty
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Affordability Weight (w₁):</span>
                  <span className="font-mono font-semibold">{Math.round(weights.affordability * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.85"
                  step="0.05"
                  value={weights.affordability}
                  onChange={(e) => handleCustomWeightChange('affordability', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Condition Weight (w₂):</span>
                  <span className="font-mono font-semibold">{Math.round(weights.condition * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.85"
                  step="0.05"
                  value={weights.condition}
                  onChange={(e) => handleCustomWeightChange('condition', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Age & Longevity Weight (w₃):</span>
                  <span className="font-mono font-semibold">{Math.round(weights.age * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.85"
                  step="0.05"
                  value={weights.age}
                  onChange={(e) => handleCustomWeightChange('age', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
