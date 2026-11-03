/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Save, AlertTriangle } from 'lucide-react';
import { Listing, ConditionGrade } from '../types/marketplace';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listing: Listing) => void;
  editingListing: Listing | null;
  categories: string[];
}

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingListing,
  categories,
}) => {
  const [formData, setFormData] = useState<Partial<Listing>>({
    id: '',
    item: '',
    category: 'Laptops',
    price: 20000,
    originalPrice: 40000,
    age: 2,
    condition: 'Good',
    imageUrl: '',
    description: '',
    sellerNotes: '',
  });

  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (editingListing) {
      setFormData(editingListing);
      if (!categories.includes(editingListing.category)) {
        setIsCustomCategory(true);
        setCustomCategory(editingListing.category);
      } else {
        setIsCustomCategory(false);
      }
    } else {
      setFormData({
        id: `P${Math.floor(10 + Math.random() * 90)}`,
        item: '',
        category: categories.find((c) => c !== 'All') || 'Laptops',
        price: 15000,
        originalPrice: 35000,
        age: 2,
        condition: 'Good',
        imageUrl: '',
        description: '',
        sellerNotes: '',
      });
      setIsCustomCategory(false);
    }
  }, [editingListing, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item || !formData.price) return;

    const finalCategory = isCustomCategory && customCategory.trim()
      ? customCategory.trim()
      : (formData.category || 'Laptops');

    onSave({
      id: formData.id || `P${Math.floor(10 + Math.random() * 90)}`,
      item: formData.item.trim(),
      category: finalCategory,
      price: Number(formData.price),
      originalPrice: formData.originalPrice !== null && formData.originalPrice !== undefined && formData.originalPrice !== ('' as any)
        ? Number(formData.originalPrice)
        : null,
      age: formData.age !== null && formData.age !== undefined && formData.age !== ('' as any)
        ? Number(formData.age)
        : null,
      condition: formData.condition || null,
      imageUrl: formData.imageUrl?.trim() || undefined,
      description: formData.description?.trim(),
      sellerNotes: formData.sellerNotes?.trim(),
    });

    onClose();
  };

  const previewRatio = formData.price && formData.originalPrice
    ? (Number(formData.price) / Number(formData.originalPrice)).toFixed(2)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">
            {editingListing ? 'Edit Marketplace Listing' : 'Add New Student Listing'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Listing ID</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              {!isCustomCategory ? (
                <div className="flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setIsCustomCategory(true);
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    <option value="__new__">+ New Category</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. Lab Equipment"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Item Title / Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Laptop C (Lenovo IdeaPad Slim 3)"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Listing Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="50"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Original Retail Price (₹)
                <span className="text-[10px] text-slate-400 font-normal ml-1">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="Leave blank for missing value test"
                value={formData.originalPrice ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Age (years)
                <span className="text-[10px] text-slate-400 font-normal ml-1">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                placeholder="Leave blank for missing value test"
                value={formData.age ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    age: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Condition</label>
              <select
                value={formData.condition || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: (e.target.value as ConditionGrade) || null,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Excellent">Excellent (Like New)</option>
                <option value="Good">Good (Minor wear)</option>
                <option value="Average">Average (Noticeable wear, fully functional)</option>
                <option value="Fair">Fair (Needs tune-up / visible scratches)</option>
                <option value="Poor">Poor (Heavily degraded)</option>
                <option value="">Missing / Unspecified (Edge-case test)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product Image URL
              <span className="text-[10px] text-slate-400 font-normal ml-1">(Optional web photo link)</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="url"
                placeholder="https://example.com/item-photo.jpg"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {formData.imageUrl && (
                <div className="w-9 h-9 rounded-md border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Leave blank to automatically use our high-fidelity category illustration.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hardware Specs & Description</label>
            <textarea
              rows={2}
              placeholder="e.g. 16GB RAM, 512GB SSD, original charger included."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Real-time Indicator Preview */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">Live Price Indicator Preview:</span>
            <div className="flex gap-4">
              <span>Price/Original: <strong className="font-mono text-slate-900">{previewRatio ?? 'N/A'}</strong></span>
              {formData.originalPrice && formData.price && (
                <span>Discount: <strong className="font-mono text-emerald-700">{Math.round((1 - Number(previewRatio)) * 100)}% off</strong></span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingListing ? 'Save Changes' : 'Create Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
