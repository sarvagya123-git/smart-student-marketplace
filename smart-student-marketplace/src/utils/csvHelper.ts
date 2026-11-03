/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Listing, ConditionGrade } from '../types/marketplace';

export function exportListingsToCSV(listings: Listing[]): string {
  const headers = ['ID', 'Item', 'Category', 'Price', 'Age', 'Condition', 'OriginalPrice', 'ImageUrl', 'Description'];
  const rows = listings.map((item) => [
    item.id,
    `"${(item.item || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    item.price,
    item.age !== null ? item.age : '',
    item.condition || '',
    item.originalPrice !== null ? item.originalPrice : '',
    `"${(item.imageUrl || '').replace(/"/g, '""')}"`,
    `"${(item.description || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function parseCSVToListings(csvContent: string): Listing[] {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
  const listings: Listing[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Simple regex CSV parser handling quotes
    const cells: string[] = [];
    let cur = '';
    let insideQuotes = false;
    for (let charIndex = 0; charIndex < rawLine.length; charIndex++) {
      const char = rawLine[charIndex];
      if (char === '"') {
        if (insideQuotes && rawLine[charIndex + 1] === '"') {
          cur += '"';
          charIndex++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    cells.push(cur.trim());

    const id = cells[0] || `P${String(i).padStart(2, '0')}`;
    const item = cells[1] || `Item ${i}`;
    const category = cells[2] || 'General';
    const price = parseFloat(cells[3]) || 0;
    const ageRaw = cells[4];
    const age = ageRaw !== '' && !isNaN(parseFloat(ageRaw)) ? parseFloat(ageRaw) : null;
    const condRaw = cells[5] as ConditionGrade;
    const condition: ConditionGrade | null = ['Excellent', 'Good', 'Average', 'Fair', 'Poor'].includes(condRaw)
      ? condRaw
      : null;
    const origRaw = cells[6];
    const originalPrice = origRaw !== '' && !isNaN(parseFloat(origRaw)) ? parseFloat(origRaw) : null;
    
    // Check if column 7 is imageUrl or description
    let imageUrl: string | undefined = undefined;
    let description = '';
    if (cells.length >= 9) {
      imageUrl = cells[7] || undefined;
      description = cells[8] || '';
    } else {
      description = cells[7] || '';
    }

    listings.push({
      id,
      item,
      category,
      price,
      age,
      condition,
      originalPrice,
      imageUrl,
      description,
    });
  }

  return listings;
}
