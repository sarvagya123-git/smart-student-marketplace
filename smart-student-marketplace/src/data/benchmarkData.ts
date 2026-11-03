/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Listing } from '../types/marketplace';

export const INITIAL_BENCHMARK_LISTINGS: Listing[] = [
  // --- Benchmark Laptops from Problem Statement (P01 - P05) ---
  {
    id: 'P01',
    item: 'Laptop A (Dell Inspiron i5)',
    category: 'Laptops',
    price: 22000,
    age: 2,
    condition: 'Good',
    originalPrice: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    description: 'Core i5 10th gen, 8GB RAM, 512GB SSD. Reliable campus laptop with minor scratches on lid.',
    sellerNotes: 'Clean battery health (82%), genuine charger included.'
  },
  {
    id: 'P02',
    item: 'Laptop B (HP Pavilion 15)',
    category: 'Laptops',
    price: 18000,
    age: 3,
    condition: 'Average',
    originalPrice: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600&auto=format&fit=crop&q=80',
    description: 'Ryzen 5 3500U, 8GB RAM, 256GB SSD + 1TB HDD. Solid for coding and web development.',
    sellerNotes: 'Fan gets warm under heavy IDE compilation, touchpad works smoothly.'
  },
  {
    id: 'P03',
    item: 'Laptop C (Lenovo IdeaPad Slim 3)',
    category: 'Laptops',
    price: 25000,
    age: 1,
    condition: 'Excellent',
    originalPrice: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    description: 'Core i5 11th Gen, 16GB RAM, 512GB NVMe. Barely used during first year hostel stay.',
    sellerNotes: 'Near mint condition, original box and bill available.'
  },
  {
    id: 'P04',
    item: 'Laptop D (Acer Aspire 5)',
    category: 'Laptops',
    price: 20000,
    age: 2,
    condition: 'Good',
    originalPrice: 40000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'Intel Core i3 11th Gen, 8GB RAM, 512GB SSD. Lightweight, crisp 1080p display.',
    sellerNotes: 'All ports functional, battery lasts 4+ hours on doc editing.'
  },
  {
    id: 'P05',
    item: 'Laptop E (Asus VivoBook 14)',
    category: 'Laptops',
    price: 15000,
    age: 4,
    condition: 'Average',
    originalPrice: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    description: 'Core i3 8th Gen, 8GB RAM, 1TB HDD. Great budget machine for first-year coursework.',
    sellerNotes: 'Hard drive upgraded to SATA SSD for responsive boot.'
  },
  // --- Edge Case & Additional Laptops ---
  {
    id: 'P06',
    item: 'Laptop F (ThinkPad E14 - Distress Sale)',
    category: 'Laptops',
    price: 7500, // Severe underpricing anomaly (Median ~20000)
    age: 2,
    condition: 'Good',
    originalPrice: 46000,
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80',
    description: 'ThinkPad rugged build, Core i5, 16GB RAM. Student graduating today, needs luggage space.',
    sellerNotes: 'Underpriced flag triggered: seller leaving town in 4 hours. No internal defects reported.'
  },
  {
    id: 'P07',
    item: 'Laptop G (MacBook Air 2017)',
    category: 'Laptops',
    price: 36000, // Overpriced anomaly
    age: 6,
    condition: 'Average',
    originalPrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
    description: 'Dual core i5, 8GB RAM. Older Intel model.',
    sellerNotes: 'Overpriced relative to 6-year age and current market value.'
  },
  {
    id: 'P08',
    item: 'Laptop H (Custom Campus Build)',
    category: 'Laptops',
    price: 19500,
    age: 2,
    condition: 'Good',
    originalPrice: null, // Edge case: missing original price
    imageUrl: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop&q=80',
    description: 'Refurbished corporate laptop with 16GB RAM and new 512GB SSD.',
    sellerNotes: 'Missing original invoice price; system will impute baseline category original price.'
  },

  // --- Bicycles (Student Daily Commute) ---
  {
    id: 'P09',
    item: 'Hero Sprint Pro 21-Speed Gear Cycle',
    category: 'Bicycles',
    price: 6500,
    age: 1.5,
    condition: 'Excellent',
    originalPrice: 13500,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    description: 'Dual disc brakes, Shimano Tourney gears, front suspension. Used strictly within campus.',
    sellerNotes: 'Freshly oiled chain and brand new water bottle cage.'
  },
  {
    id: 'P10',
    item: 'Btwin Rockrider 340 MTB',
    category: 'Bicycles',
    price: 8000,
    age: 2,
    condition: 'Good',
    originalPrice: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&auto=format&fit=crop&q=80',
    description: 'Sturdy alloy frame, 26-inch wheels, smooth gear shifts across inclines.',
    sellerNotes: 'Minor brake pad squeak on steep descent; easily adjusted.'
  },
  {
    id: 'P11',
    item: 'Firefox Target 29T Mountain Bike',
    category: 'Bicycles',
    price: 9500,
    age: 1,
    condition: 'Excellent',
    originalPrice: 19000,
    imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&auto=format&fit=crop&q=80',
    description: '29-inch wheels, lightweight alloy frame, zoom suspension fork.',
    sellerNotes: 'Ridden less than 200km, includes helmet and cable lock.'
  },
  {
    id: 'P12',
    item: 'Montra Trance Pro Hybrid Cycle',
    category: 'Bicycles',
    price: 11000,
    age: 3,
    condition: 'Good',
    originalPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop&q=80',
    description: 'Fast hybrid bike for campus commutes and weekend long rides. 700C wheels.',
    sellerNotes: 'Both tires recently replaced with puncture-resistant tubes.'
  },
  {
    id: 'P13',
    item: 'Atlas Campus Single-Speed Cruiser',
    category: 'Bicycles',
    price: 2400,
    age: 4,
    condition: 'Average',
    originalPrice: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    description: 'Simple single-speed cycle with front wire basket. Zero gear maintenance required.',
    sellerNotes: 'Chain is solid; minor frame paint chips from hostel bike rack.'
  },
  {
    id: 'P14',
    item: 'Hercules Roadeo A50 Hardtail',
    category: 'Bicycles',
    price: 1200, // Anomaly / Edge case: very cheap and missing age
    age: null, // Edge case: missing age
    condition: 'Fair',
    originalPrice: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=600&auto=format&fit=crop&q=80',
    description: 'Campus beater bicycle, shifts through gears with some effort.',
    sellerNotes: 'Missing age record. Imputation and uncertainty penalty will apply.'
  },
  {
    id: 'P15',
    item: 'Mach City iBike 7-Speed',
    category: 'Bicycles',
    price: 5800,
    age: 2,
    condition: 'Good',
    originalPrice: 11500,
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    description: 'City commuter bicycle, lightweight steel frame with Shimano 7-speed cassette.',
    sellerNotes: 'Smooth rider for hostel to academic block commutes.'
  },

  // --- Textbooks & Course Materials ---
  {
    id: 'P16',
    item: 'Introduction to Algorithms (CLRS 3rd Edition)',
    category: 'Books',
    price: 850,
    age: 2,
    condition: 'Excellent',
    originalPrice: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Standard computer science reference book for Data Structures and Algorithms.',
    sellerNotes: 'Zero pen markings or torn pages, binding intact.'
  },
  {
    id: 'P17',
    item: 'Higher Engineering Mathematics (B.S. Grewal 44th Ed)',
    category: 'Books',
    price: 450,
    age: 3,
    condition: 'Good',
    originalPrice: 950,
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
    description: 'Essential textbook for 1st and 2nd year engineering mathematics.',
    sellerNotes: 'Includes formula sheet notes in pencil on inside cover.'
  },
  {
    id: 'P18',
    item: 'Operating System Concepts (Silberschatz Dinosaur Book)',
    category: 'Books',
    price: 600,
    age: 1,
    condition: 'Excellent',
    originalPrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Covers process scheduling, virtualization, file systems, and concurrency.',
    sellerNotes: 'Looks brand new, stored on hostel bookshelf.'
  },
  {
    id: 'P19',
    item: 'Computer Networking: A Top-Down Approach (Kurose)',
    category: 'Books',
    price: 700,
    age: 2,
    condition: 'Good',
    originalPrice: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'Standard 6th edition international paperback covering HTTP, TCP, BGP, SDN.',
    sellerNotes: 'Clean copy, crisp pages.'
  },
  {
    id: 'P20',
    item: 'Official GRE Super Power Pack (3 Book Set)',
    category: 'Books',
    price: 500,
    age: 1,
    condition: 'Excellent',
    originalPrice: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    description: 'ETS Official Guide + Quantitative Reasoning + Verbal Reasoning workbooks.',
    sellerNotes: 'Practice questions unsolved, no ink markings.'
  },
  {
    id: 'P21',
    item: 'Principles of Physics (Resnick, Halliday, Walker 10th Ed)',
    category: 'Books',
    price: 950,
    age: 4,
    condition: 'Average',
    originalPrice: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive physics volume covering mechanics, optics, thermodynamics.',
    sellerNotes: 'Spine has minor tape reinforcement; all text legible.'
  },
  {
    id: 'P22',
    item: 'Organic Chemistry (Clayden, Greeves, Warren)',
    category: 'Books',
    price: 2100, // Edge case: Overpriced anomaly (price > original price)
    age: 3,
    condition: 'Average',
    originalPrice: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    description: 'Hardcover international edition with colored mechanism diagrams.',
    sellerNotes: 'Seller set price above original retail due to out-of-print import status.'
  },

  // --- Audio & Student Tech Accessories ---
  {
    id: 'P23',
    item: 'Sony WH-CH720N Noise Cancelling Headphones',
    category: 'Gadgets',
    price: 4500,
    age: 1,
    condition: 'Excellent',
    originalPrice: 9990,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Active Noise Cancellation, 35-hour battery life, lightweight multipoint Bluetooth.',
    sellerNotes: 'Used for library study sessions, comes with 3.5mm audio cable and USB-C wire.'
  },
  {
    id: 'P24',
    item: 'Casio FX-991CW ClassWiz Scientific Calculator',
    category: 'Gadgets',
    price: 850,
    age: 1,
    condition: 'Excellent',
    originalPrice: 1495,
    imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80',
    description: '540+ functions, matrix calculation, vector math, approved for university exams.',
    sellerNotes: 'Protective hard case included, fresh solar battery.'
  },
  {
    id: 'P25',
    item: 'Apple iPad 9th Gen (64GB Wi-Fi Silver)',
    category: 'Gadgets',
    price: 17500,
    age: 2,
    condition: 'Good',
    originalPrice: 30900,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    description: '10.2-inch Retina display, A13 Bionic chip, supports Apple Pencil 1st Gen.',
    sellerNotes: 'Tempered glass applied from day one, minor corner scuff on rear aluminum.'
  },
  {
    id: 'P26',
    item: 'Keychron K2 Wireless Mechanical Keyboard',
    category: 'Gadgets',
    price: 3800,
    age: 1.5,
    condition: 'Good',
    originalPrice: 7499,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: '75% layout, Gateron Brown tactile switches, RGB backlighting, Mac/Windows keys.',
    sellerNotes: 'Clean keycaps, Bluetooth connects reliably to laptop and iPad.'
  },

  // --- Musical Instruments (Category with Too Few Items: N=2 < 3) ---
  {
    id: 'P27',
    item: 'Yamaha F280 Acoustic Guitar',
    category: 'Musical Instruments',
    price: 4800,
    age: 2,
    condition: 'Good',
    originalPrice: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    description: 'Dreadnought acoustic guitar, rosewood fretboard. Good action for beginners.',
    sellerNotes: 'Includes padded gig bag and 3 picks. Small sample category test item.'
  },
  {
    id: 'P28',
    item: 'Casio CT-S200 Casiotone Portable Keyboard',
    category: 'Musical Instruments',
    price: 5200,
    age: 1,
    condition: 'Excellent',
    originalPrice: 9500,
    imageUrl: 'https://images.unsplash.com/photo-1520523839898-50712509e37b?w=600&auto=format&fit=crop&q=80',
    description: '61 keys, 400 tones, 77 rhythms, dance music mode with handle grip.',
    sellerNotes: 'Power adapter and sheet music stand included. Category count N=2 (<3).'
  }
];
