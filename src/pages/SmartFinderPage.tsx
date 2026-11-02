import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle,
  HelpCircle,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { ProductCard } from '../components/product/ProductCard';
import { FurnitureCategory, RoomCollection } from '../types';

export const SmartFinderPage: React.FC = () => {
  const { products, recordEvent } = useShowroom();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Finder criteria state
  const [selectedRoom, setSelectedRoom] = useState<string>('any');
  const [selectedCategory, setSelectedCategory] = useState<string>('any');
  const [maxBudget, setMaxBudget] = useState<number>(100000);
  const [selectedStyle, setSelectedStyle] = useState<string>('any');
  const [preferredMaterial, setPreferredMaterial] = useState<string>('any');
  const [maxWidth, setMaxWidth] = useState<number>(120);

  // Track analytics event when criteria changes
  useEffect(() => {
    recordEvent('finder_use', {
      metadata: {
        room: selectedRoom,
        category: selectedCategory,
        maxBudget,
        style: selectedStyle,
      },
    });
  }, [selectedRoom, selectedCategory, maxBudget, selectedStyle, recordEvent]);

  // Options
  const rooms: { label: string; value: string }[] = [
    { label: 'Any Room', value: 'any' },
    { label: 'Living Room', value: 'living' },
    { label: 'Bedroom Suite', value: 'bedroom' },
    { label: 'Dining Space', value: 'dining' },
    { label: 'Home Office', value: 'office' },
    { label: 'Storage & Closets', value: 'storage' },
  ];

  const categories: { label: string; value: string }[] = [
    { label: 'Any Category', value: 'any' },
    { label: 'Sofas & Seating', value: 'Sofas & Seating' },
    { label: 'Beds & Bedroom Furniture', value: 'Beds & Bedroom Furniture' },
    { label: 'Dining Tables & Chairs', value: 'Dining Tables & Chairs' },
    { label: 'Wardrobes & Storage', value: 'Wardrobes & Storage' },
    { label: 'TV Units & Entertainment', value: 'TV Units & Entertainment' },
    { label: 'Office Furniture', value: 'Office Furniture' },
  ];

  const styles = [
    { label: 'Any Style', value: 'any' },
    { label: 'Modern Minimalist', value: 'Modern Minimalist' },
    { label: 'Contemporary Warm', value: 'Contemporary Warm' },
    { label: 'Mid-Century Nordic', value: 'Mid-Century Nordic' },
    { label: 'Classic Architectural', value: 'Classic Architectural' },
  ];

  const materials = [
    { label: 'Any Material', value: 'any' },
    { label: 'Solid Teak & Sheesham Wood', value: 'wood' },
    { label: 'Textured Linen & Boucle Fabric', value: 'fabric' },
    { label: 'Natural Stone / Travertine', value: 'stone' },
  ];

  // Matching Logic based strictly on actual catalog data
  const matchingProducts = useMemo(() => {
    return products.filter((p) => {
      // Room match
      if (selectedRoom !== 'any' && p.room !== selectedRoom) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'any' && p.category !== selectedCategory) {
        return false;
      }

      // Budget match
      if (p.price > maxBudget) {
        return false;
      }

      // Style match
      if (selectedStyle !== 'any' && p.style !== selectedStyle) {
        return false;
      }

      // Width constraint
      if (p.dimensions.width > maxWidth) {
        return false;
      }

      // Material preference
      if (preferredMaterial !== 'any') {
        const matStr = p.materials.join(' ').toLowerCase();
        if (preferredMaterial === 'wood' && !matStr.includes('wood') && !matStr.includes('teak') && !matStr.includes('sheesham') && !matStr.includes('walnut') && !matStr.includes('oak')) {
          return false;
        }
        if (preferredMaterial === 'fabric' && !matStr.includes('fabric') && !matStr.includes('linen') && !matStr.includes('boucle') && !matStr.includes('velvet')) {
          return false;
        }
        if (preferredMaterial === 'stone' && !matStr.includes('travertine') && !matStr.includes('stone') && !matStr.includes('marble')) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedRoom, selectedCategory, maxBudget, selectedStyle, maxWidth, preferredMaterial]);

  const handleReset = () => {
    setSelectedRoom('any');
    setSelectedCategory('any');
    setMaxBudget(100000);
    setSelectedStyle('any');
    setPreferredMaterial('any');
    setMaxWidth(120);
  };

  const handleBroaden = () => {
    setMaxBudget(100000);
    setSelectedRoom('any');
    setSelectedStyle('any');
    setPreferredMaterial('any');
    setMaxWidth(120);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-sand-100 rounded-2xl p-6 sm:p-10 border border-sand-300 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 text-walnut-900 text-xs font-medium border border-sand-300">
            <Compass className="w-3.5 h-3.5 text-walnut-700" />
            <span>Interactive Guided Discovery</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-950">
            Smart Furniture Finder
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            Answer a few quick questions about your room, spatial measurements, and budget to view
            matching furniture from our showroom catalogue. No guesswork — matches are computed
            directly from catalog attributes.
          </p>
        </div>
      </div>

      {/* Guided Selection Panel */}
      <div className="bg-white rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex items-center justify-between border-b border-sand-200 pb-4">
          <div className="flex items-center gap-2 text-walnut-950 font-serif font-bold text-lg">
            <Sliders className="w-5 h-5 text-walnut-700" />
            <span>Define Your Preferences</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-walnut-700 hover:text-walnut-950 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>

        {/* 1. Room Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
            1. Which room are you furnishing? (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {rooms.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRoom(r.value)}
                className={`py-3 px-3 rounded-lg border text-xs font-medium transition-all text-center ${
                  selectedRoom === r.value
                    ? 'border-walnut-900 bg-walnut-900 text-white shadow-xs'
                    : 'border-sand-300 bg-sand-50 text-charcoal-700 hover:bg-sand-100 hover:border-walnut-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Furniture Category */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
            2. What furniture type do you need? (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all text-left truncate ${
                  selectedCategory === c.value
                    ? 'border-walnut-900 bg-walnut-900 text-white shadow-xs'
                    : 'border-sand-300 bg-sand-50 text-charcoal-700 hover:bg-sand-100 hover:border-walnut-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Budget Range Slider */}
        <div className="space-y-3 pt-2 border-t border-sand-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider">
              3. Maximum Budget Ceiling
            </label>
            <span className="font-sans font-bold text-sm text-walnut-900 bg-sand-100 px-3 py-1 rounded border border-sand-200">
              Up to ₹{maxBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <input
            type="range"
            min={15000}
            max={100000}
            step={5000}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-walnut-800 cursor-pointer h-2 bg-sand-200 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-charcoal-400">
            <span>₹15,000</span>
            <span>₹35,000</span>
            <span>₹60,000</span>
            <span>₹80,000</span>
            <span>₹1,00,000+</span>
          </div>
        </div>

        {/* 4. Style & Material & Width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-sand-200">
          {/* Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
              4. Preferred Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-800 focus:outline-hidden focus:border-walnut-700"
            >
              {styles.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
              5. Preferred Material
            </label>
            <select
              value={preferredMaterial}
              onChange={(e) => setPreferredMaterial(e.target.value)}
              className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-800 focus:outline-hidden focus:border-walnut-700"
            >
              {materials.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Width Limit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
              6. Max Furniture Width (Inches)
            </label>
            <select
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-800 focus:outline-hidden focus:border-walnut-700"
            >
              <option value={120}>No Limit (Any Size)</option>
              <option value={48}>Compact (Up to 48" W)</option>
              <option value={72}>Medium (Up to 72" W)</option>
              <option value={90}>Large (Up to 90" W)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between border-b border-sand-200 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-walnut-700" />
          <h2 className="font-serif text-2xl font-bold text-walnut-950">
            Matched Showroom Products
          </h2>
        </div>
        <span className="text-xs font-semibold text-walnut-900 bg-sand-100 px-3 py-1 rounded-full border border-sand-300">
          {matchingProducts.length} Match{matchingProducts.length === 1 ? '' : 'es'} Found
        </span>
      </div>

      {/* Results Grid or Empty State */}
      {matchingProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCompareAlert={showToast}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-sand-200 p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-walnut-950">
            No exact matches for this combined criteria
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Your current budget ceiling or spatial width limit excluded the remaining catalogue
            pieces. We suggest broadening the search to view all suitable possibilities.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBroaden}
              className="bg-walnut-900 hover:bg-walnut-800 text-white px-5 py-2.5 rounded-md text-xs font-semibold shadow-xs"
            >
              Broaden Search Criteria
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
