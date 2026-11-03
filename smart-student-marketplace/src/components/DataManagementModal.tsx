/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, FileText, Check } from 'lucide-react';
import { Listing } from '../types/marketplace';
import { exportListingsToCSV, parseCSVToListings } from '../utils/csvHelper';
import { INITIAL_BENCHMARK_LISTINGS } from '../data/benchmarkData';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onUpdateListings: (listings: Listing[]) => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  listings,
  onUpdateListings,
}) => {
  const [csvText, setCsvText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const csv = exportListingsToCSV(listings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_marketplace_listings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('CSV exported successfully.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(listings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_marketplace_listings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('JSON exported successfully.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportCSVText = () => {
    if (!csvText.trim()) return;
    try {
      const parsed = parseCSVToListings(csvText);
      if (parsed.length > 0) {
        onUpdateListings(parsed);
        setStatusMessage(`Successfully imported ${parsed.length} listings from CSV.`);
        setCsvText('');
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage('Error: No valid listing rows found in CSV data.');
      }
    } catch (err) {
      setStatusMessage('Error parsing CSV. Please check formatting.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdateListings(parsed);
            setStatusMessage(`Successfully loaded ${parsed.length} items from JSON.`);
          }
        } catch (e) {
          setStatusMessage('Failed to parse JSON file.');
        }
      } else {
        const parsed = parseCSVToListings(content);
        if (parsed.length > 0) {
          onUpdateListings(parsed);
          setStatusMessage(`Successfully loaded ${parsed.length} items from CSV.`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetToBenchmark = () => {
    onUpdateListings(INITIAL_BENCHMARK_LISTINGS);
    setStatusMessage('Reset to official 28 benchmark listings (including P01–P05 laptops).');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Dataset Management (CSV / JSON)
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
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleExportCSV}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-slate-800">Export as CSV</span>
              <span className="text-[10px] text-slate-400">Standard spreadsheet format</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-slate-800">Export as JSON</span>
              <span className="text-[10px] text-slate-400">Structured raw data</span>
            </button>

            <button
              onClick={handleResetToBenchmark}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-slate-800">Reset Benchmark</span>
              <span className="text-[10px] text-slate-400">Restores default 28 listings</span>
            </button>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-800 block">
              Upload Organizers File (CSV or JSON):
            </label>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Accepts CSV with columns: ID, Item, Category, Price, Age, Condition, OriginalPrice
            </p>
          </div>

          {/* Paste CSV raw text */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-800 block">
              Or Paste CSV Data Directly:
            </label>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="ID,Item,Category,Price,Age,Condition,OriginalPrice&#10;P30,Sample Item,Laptops,21000,2,Good,42000"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleImportCSVText}
                disabled={!csvText.trim()}
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                Import Pasted CSV
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
