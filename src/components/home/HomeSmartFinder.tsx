import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, RotateCcw, Filter, CheckCircle2 } from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { ProductCard } from '../product/ProductCard';
import { RoomCollection } from '../../types';

export const HomeSmartFinder: React.FC = () => {
  const { products, recordEvent } = useShowroom();

  const [selectedRoom, setSelectedRoom] = useState<string>('any');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const rooms: { label: string; value: string }[] = [
    { label: 'All Rooms', value: 'any' },
    { label: 'Living Room', value: 'living' },
    { label: 'Bedroom Suite', value: 'bedroom' },
    { label: 'Dining Space', value: 'dining' },
    { label: 'Home Office', value: 'office' },
    { label: 'Storage & Closets', value: 'storage' },
  ];

  const budgetTiers = [
    { label: 'All Budgets', value: 'all', max: Infinity },
    { label: 'Under ₹25,000', value: 'under-25k', max: 25000 },
    { label: 'Under ₹50,000', value: 'under-50k', max: 50000 },
    { label: 'Under ₹75,000', value: 'under-75k', max: 75000 },
    { label: 'Luxury (₹1,00,000+)', value: 'luxury', min: 75000, max: Infinity },
  ];

  const styles = [
    { label: 'All Styles', value: 'all' },
    { label: 'Modern Minimalist', value: 'Modern Minimalist' },
    { label: 'Contemporary Warm', value: 'Contemporary Warm' },
    { label: 'Mid-Century Nordic', value: 'Mid-Century Nordic' },
    { label: 'Classic Architectural', value: 'Classic Architectural' },
  ];

  const handleFilterChange = (type: 'room' | 'budget' | 'style', value: string) => {
    if (type === 'room') setSelectedRoom(value);
    if (type === 'budget') setSelectedBudget(value);
    if (type === 'style') setSelectedStyle(value);

    recordEvent('finder_use', {
      metadata: {
        context: 'home_embedded_finder',
        filterChanged: type,
        value,
      },
    });
  };

  const handleReset = () => {
    setSelectedRoom('any');
    setSelectedBudget('all');
    setSelectedStyle('all');
  };

  const matchedProducts = useMemo(() => {
    return products.filter((p) => {
      // Room match
      if (selectedRoom !== 'any' && p.room !== selectedRoom) {
        return false;
      }

      // Budget match
      const activeTier = budgetTiers.find((b) => b.value === selectedBudget);
      if (activeTier) {
        if (activeTier.max !== undefined && p.price > activeTier.max) return false;
        if (activeTier.min !== undefined && p.price < activeTier.min) return false;
      }

      // Style match
      if (selectedStyle !== 'all' && p.style !== selectedStyle) {
        return false;
      }

      return true;
    });
  }, [products, selectedRoom, selectedBudget, selectedStyle]);

  const displayedMatches = matchedProducts.slice(0, 3);

  return (
    <section className="bg-sand-100/70 py-16 sm:py-20 border-y border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-200 text-walnut-800 text-[11px] font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Smart Furniture Finder</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-950">
              Find Furniture Tailored to Your Home
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
              Select your room type, budget tier, and aesthetic style to instantly discover matched pieces from our showroom floor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(selectedRoom !== 'any' || selectedBudget !== 'all' || selectedStyle !== 'all') && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-600 hover:text-walnut-900 bg-white border border-sand-300 px-3 py-2 rounded-md shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <Link
              to="/find-furniture"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-900 hover:text-walnut-950 bg-sand-200 hover:bg-sand-300 border border-sand-300 px-3.5 py-2 rounded-md transition-colors shadow-xs"
            >
              <span>Advanced Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Selection Panel */}
        <div className="bg-white rounded-xl border border-sand-200 p-5 sm:p-6 shadow-xs mb-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Room Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
                1. Select Room Space
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => handleFilterChange('room', e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-lg px-3.5 py-2.5 text-xs text-charcoal-800 font-medium focus:outline-none focus:ring-2 focus:ring-walnut-800 focus:border-transparent transition-all"
              >
                {rooms.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Budget Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
                2. Target Budget Tier
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => handleFilterChange('budget', e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-lg px-3.5 py-2.5 text-xs text-charcoal-800 font-medium focus:outline-none focus:ring-2 focus:ring-walnut-800 focus:border-transparent transition-all"
              >
                {budgetTiers.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Style Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
                3. Preferred Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => handleFilterChange('style', e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-lg px-3.5 py-2.5 text-xs text-charcoal-800 font-medium focus:outline-none focus:ring-2 focus:ring-walnut-800 focus:border-transparent transition-all"
              >
                {styles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active criteria pills & count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sand-100 text-xs">
            <div className="flex items-center gap-2 text-charcoal-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Found <strong className="text-walnut-950 font-bold">{matchedProducts.length}</strong> matching showroom piece{matchedProducts.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-charcoal-400">Filtering by:</span>
              <span className="bg-sand-100 text-walnut-900 px-2 py-0.5 rounded text-[11px] font-medium border border-sand-200">
                {rooms.find((r) => r.value === selectedRoom)?.label}
              </span>
              <span className="bg-sand-100 text-walnut-900 px-2 py-0.5 rounded text-[11px] font-medium border border-sand-200">
                {budgetTiers.find((b) => b.value === selectedBudget)?.label}
              </span>
              <span className="bg-sand-100 text-walnut-900 px-2 py-0.5 rounded text-[11px] font-medium border border-sand-200">
                {styles.find((s) => s.value === selectedStyle)?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Live Matching Results Grid */}
        {matchedProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMatches.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {matchedProducts.length > 3 && (
              <div className="text-center pt-4">
                <Link
                  to={`/catalogue?room=${selectedRoom !== 'any' ? selectedRoom : ''}&style=${selectedStyle !== 'all' ? encodeURIComponent(selectedStyle) : ''}`}
                  className="inline-flex items-center gap-2 bg-walnut-900 hover:bg-walnut-800 text-white px-6 py-3 rounded-md text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>View All {matchedProducts.length} Matching Products in Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-sand-200 p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-charcoal-800">
              No furniture pieces match all selected criteria.
            </p>
            <p className="text-xs text-charcoal-500 max-w-md mx-auto">
              Try broadening your budget tier or switching room selection to view our handcrafted items.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-900 bg-sand-100 hover:bg-sand-200 px-4 py-2 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
