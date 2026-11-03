/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Laptop, Bike, Book, Headphones, Music, Package } from 'lucide-react';
import { ConditionGrade } from '../types/marketplace';

interface ProductImageProps {
  category: string;
  itemTitle: string;
  imageUrl?: string;
  condition?: ConditionGrade | null;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  category,
  itemTitle,
  imageUrl,
  condition,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Return real image if available and not errored
  if (imageUrl && !imageError) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={imageUrl}
          alt={itemTitle}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium px-2 py-0.5 bg-black/40 backdrop-blur-xs rounded">
          {category}
        </span>
      </div>
    );
  }

  // High-fidelity domain-crafted visual graphic fallback
  const getCategoryTheme = () => {
    switch (category) {
      case 'Laptops':
        return {
          bgGradient: 'from-slate-800 via-slate-900 to-indigo-950',
          textColor: 'text-indigo-200',
          accentColor: 'text-indigo-400',
          icon: <Laptop className="w-10 h-10 text-indigo-300 stroke-[1.5]" />,
          tag: 'CAMPUS TECH',
          pattern: (
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-laptop" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-laptop)" />
            </svg>
          ),
        };

      case 'Bicycles':
        return {
          bgGradient: 'from-emerald-900 via-teal-950 to-slate-900',
          textColor: 'text-emerald-200',
          accentColor: 'text-emerald-400',
          icon: <Bike className="w-10 h-10 text-emerald-300 stroke-[1.5]" />,
          tag: 'DAILY COMMUTE',
          pattern: (
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20%" cy="50%" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="80%" cy="50%" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
          ),
        };

      case 'Books':
        return {
          bgGradient: 'from-amber-950 via-stone-900 to-stone-950',
          textColor: 'text-amber-200',
          accentColor: 'text-amber-400',
          icon: <Book className="w-10 h-10 text-amber-300 stroke-[1.5]" />,
          tag: 'COURSE MATERIAL',
          pattern: (
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="20" x2="100%" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
              <line x1="0" y1="40" x2="100%" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
              <line x1="0" y1="60" x2="100%" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
            </svg>
          ),
        };

      case 'Gadgets':
        return {
          bgGradient: 'from-violet-950 via-purple-950 to-slate-900',
          textColor: 'text-violet-200',
          accentColor: 'text-violet-400',
          icon: <Headphones className="w-10 h-10 text-violet-300 stroke-[1.5]" />,
          tag: 'STUDENT ACCESSORY',
          pattern: (
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <path d="M 10 50 Q 50 10 90 50 T 170 50 T 250 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ),
        };

      case 'Musical Instruments':
        return {
          bgGradient: 'from-orange-950 via-amber-950 to-slate-900',
          textColor: 'text-orange-200',
          accentColor: 'text-orange-400',
          icon: <Music className="w-10 h-10 text-orange-300 stroke-[1.5]" />,
          tag: 'INSTRUMENT',
          pattern: (
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50%" cy="50%" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          ),
        };

      default:
        return {
          bgGradient: 'from-slate-800 to-slate-950',
          textColor: 'text-slate-200',
          accentColor: 'text-slate-400',
          icon: <Package className="w-10 h-10 text-slate-300 stroke-[1.5]" />,
          tag: 'MARKETPLACE ITEM',
          pattern: null,
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${theme.bgGradient} flex flex-col justify-between p-4 ${className}`}
    >
      {theme.pattern}

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider font-semibold text-white/70 uppercase">
          {theme.tag}
        </span>
        {condition && (
          <span className="text-[10px] font-medium text-white/90 bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs">
            {condition}
          </span>
        )}
      </div>

      {/* Center Iconography */}
      <div className="relative z-10 flex items-center justify-center my-3 transition-transform duration-300 group-hover:scale-110">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
          {theme.icon}
        </div>
      </div>

      {/* Bottom Category Label */}
      <div className="relative z-10 flex items-end justify-between">
        <span className="text-xs font-semibold text-white/90 truncate max-w-[80%]">
          {itemTitle}
        </span>
        <span className={`text-[10px] font-mono ${theme.accentColor}`}>
          {category}
        </span>
      </div>
    </div>
  );
};
