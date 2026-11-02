import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { ProductCard } from '../components/product/ProductCard';
import { FurnitureCategory, RoomCollection, AvailabilityStatus } from '../types';

export const CataloguePage: React.FC = () => {
  const { products, recordEvent } = useShowroom();
  const [searchParams, setSearchParams] = useSearchParams();

  // Toast for comparison / actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State from URL or defaults
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    searchParams.get('room') || 'all'
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string>(
    searchParams.get('availability') || 'all'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(
    searchParams.get('style') || 'all'
  );
  const [priceRange, setPriceRange] = useState<string>(
    searchParams.get('priceRange') || 'all'
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'featured'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const rm = searchParams.get('room');
    if (rm) setSelectedRoom(rm);
    const q = searchParams.get('q');
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  // Debounce search event analytics
  useEffect(() => {
    if (!searchTerm.trim()) return;
    const timer = setTimeout(() => {
      recordEvent('search', {
        metadata: { query: searchTerm.trim() },
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [searchTerm, recordEvent]);

  // Filter Categories
  const categories: { label: string; value: FurnitureCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Sofas & Seating', value: 'Sofas & Seating' },
    { label: 'Beds & Bedroom Furniture', value: 'Beds & Bedroom Furniture' },
    { label: 'Dining Tables & Chairs', value: 'Dining Tables & Chairs' },
    { label: 'Wardrobes & Storage', value: 'Wardrobes & Storage' },
    { label: 'TV Units & Entertainment', value: 'TV Units & Entertainment' },
    { label: 'Office Furniture', value: 'Office Furniture' },
    { label: 'Coffee & Accent Tables', value: 'Coffee & Accent Tables' },
  ];

  const rooms: { label: string; value: RoomCollection | 'all' }[] = [
    { label: 'All Rooms', value: 'all' },
    { label: 'Living Room', value: 'living' },
    { label: 'Bedroom', value: 'bedroom' },
    { label: 'Dining Room', value: 'dining' },
    { label: 'Home Office', value: 'office' },
    { label: 'Storage Solutions', value: 'storage' },
  ];

  const styles = [
    'All Styles',
    'Modern Minimalist',
    'Contemporary Warm',
    'Mid-Century Nordic',
    'Classic Architectural',
  ];

  const priceOptions = [
    { label: 'Any Budget', value: 'all' },
    { label: 'Under ₹25,000', value: 'under-25k', min: 0, max: 25000 },
    { label: '₹25,000 – ₹50,000', value: '25k-50k', min: 25000, max: 50000 },
    { label: '₹50,000 – ₹75,000', value: '50k-75k', min: 50000, max: 75000 },
    { label: 'Above ₹75,000', value: 'above-75k', min: 75000, max: Infinity },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search term (matches name, SKU, category, materials, description, tags)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchMaterials = p.materials.some((m) => m.toLowerCase().includes(q));
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchCategory && !matchTags && !matchMaterials && !matchDesc) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // 3. Room
      if (selectedRoom !== 'all' && p.room !== selectedRoom) {
        return false;
      }

      // 4. Availability
      if (selectedAvailability !== 'all' && p.availability !== selectedAvailability) {
        return false;
      }

      // 5. Style
      if (selectedStyle !== 'all' && p.style !== selectedStyle) {
        return false;
      }

      // 6. Price Range
      if (priceRange !== 'all') {
        const opt = priceOptions.find((o) => o.value === priceRange);
        if (opt && opt.min !== undefined && opt.max !== undefined && (p.price < opt.min || p.price > opt.max)) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedRoom, selectedAvailability, selectedStyle, priceRange]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'featured':
      default:
        // Featured items first, then newest
        return list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
  }, [filteredProducts, sortBy]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedRoom('all');
    setSelectedAvailability('all');
    setSelectedStyle('all');
    setPriceRange('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedRoom !== 'all' ||
    selectedAvailability !== 'all' ||
    selectedStyle !== 'all' ||
    priceRange !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-sand-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-walnut-600 block mb-1">
              Digital Showroom Floor
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-950">
              Furniture Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-xl">
              Browse authentic handcrafted sofas, dining ensembles, beds, and modular wardrobes.
              Confirm current showroom floor pieces or order bespoke configurations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-charcoal-500 bg-sand-100 px-3 py-1.5 rounded-md border border-sand-200 self-start md:self-auto">
            <span className="font-semibold text-walnut-900">{filteredProducts.length}</span>
            <span>piece{filteredProducts.length === 1 ? '' : 's'} available to browse</span>
          </div>
        </div>
      </div>

      {/* Search & Quick Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by furniture name, teak, sheesham, velvet, storage, SKU..."
              className="w-full pl-10 pr-10 py-2.5 bg-sand-50 border border-sand-300 rounded-md text-xs sm:text-sm placeholder:text-charcoal-400 focus:outline-hidden focus:ring-2 focus:ring-walnut-700/20 focus:border-walnut-700 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="text-xs text-charcoal-600 whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-sand-50 border border-sand-300 rounded-md py-2.5 px-3 text-xs sm:text-sm text-charcoal-800 focus:outline-hidden focus:border-walnut-700"
            >
              <option value="featured">Featured & Highlights</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="newest">Recently Added</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 bg-sand-200 text-walnut-950 px-3 py-2.5 rounded-md text-xs font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-walnut-700" />
              )}
            </button>
          </div>
        </div>

        {/* Room Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-charcoal-400 text-[11px] uppercase tracking-wider font-semibold mr-1 shrink-0">
            Room:
          </span>
          {rooms.map((rm) => (
            <button
              key={rm.value}
              type="button"
              onClick={() => setSelectedRoom(rm.value)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedRoom === rm.value
                  ? 'bg-walnut-900 text-white font-medium shadow-xs'
                  : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
              }`}
            >
              {rm.label}
            </button>
          ))}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-sand-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-charcoal-500 font-medium text-[11px]">Active Filters:</span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-sand-200 text-walnut-900 px-2.5 py-0.5 rounded-full text-xs">
                Keyword: "{searchTerm}"
                <button type="button" onClick={() => setSearchTerm('')}>
                  <X className="w-3 h-3 hover:text-walnut-950" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-sand-200 text-walnut-900 px-2.5 py-0.5 rounded-full text-xs">
                Category: {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory('all')}>
                  <X className="w-3 h-3 hover:text-walnut-950" />
                </button>
              </span>
            )}

            {selectedRoom !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-sand-200 text-walnut-900 px-2.5 py-0.5 rounded-full text-xs">
                Room: {rooms.find((r) => r.value === selectedRoom)?.label}
                <button type="button" onClick={() => setSelectedRoom('all')}>
                  <X className="w-3 h-3 hover:text-walnut-950" />
                </button>
              </span>
            )}

            {selectedAvailability !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-sand-200 text-walnut-900 px-2.5 py-0.5 rounded-full text-xs">
                Availability: {selectedAvailability.replace(/_/g, ' ')}
                <button type="button" onClick={() => setSelectedAvailability('all')}>
                  <X className="w-3 h-3 hover:text-walnut-950" />
                </button>
              </span>
            )}

            {selectedStyle !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-sand-200 text-walnut-900 px-2.5 py-0.5 rounded-full text-xs">
                Style: {selectedStyle}
                <button type="button" onClick={() => setSelectedStyle('all')}>
                  <X className="w-3 h-3 hover:text-walnut-950" />
                </button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-sand-200 text-walnut-900 px-2.5 py-0.5 rounded-full text-xs">
                Budget: {priceOptions.find((p) => p.value === priceRange)?.label}
                <button type="button" onClick={() => setPriceRange('all')}>
                  <X className="w-3 h-3 hover:text-walnut-950" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-walnut-800 hover:text-walnut-950 font-semibold underline text-xs ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white rounded-xl border border-sand-200 p-5 space-y-6 sticky top-28 shadow-xs">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-charcoal-900">
              <Filter className="w-4 h-4 text-walnut-700" />
              <span>Filter Showroom</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-walnut-700 hover:text-walnut-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-walnut-700 uppercase tracking-wider block">
              Furniture Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.value
                      ? 'bg-sand-200 text-walnut-950 font-semibold'
                      : 'text-charcoal-700 hover:bg-sand-100'
                  }`}
                >
                  <span className="line-clamp-1">{cat.label}</span>
                  {selectedCategory === cat.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-walnut-800 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div className="space-y-2 pt-2 border-t border-sand-200">
            <label className="text-xs font-bold text-walnut-700 uppercase tracking-wider block">
              Budget Range
            </label>
            <div className="space-y-1">
              {priceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriceRange(opt.value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    priceRange === opt.value
                      ? 'bg-sand-200 text-walnut-950 font-semibold'
                      : 'text-charcoal-700 hover:bg-sand-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {priceRange === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-walnut-800 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Status Filter */}
          <div className="space-y-2 pt-2 border-t border-sand-200">
            <label className="text-xs font-bold text-walnut-700 uppercase tracking-wider block">
              Showroom Availability
            </label>
            <div className="space-y-1">
              {[
                { label: 'All Statuses', value: 'all' },
                { label: 'Available to View on Floor', value: 'available_to_view' },
                { label: 'Made to Order (14-21 days)', value: 'made_to_order' },
                { label: 'Confirm with Showroom', value: 'confirm_availability' },
              ].map((av) => (
                <button
                  key={av.value}
                  type="button"
                  onClick={() => setSelectedAvailability(av.value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    selectedAvailability === av.value
                      ? 'bg-sand-200 text-walnut-950 font-semibold'
                      : 'text-charcoal-700 hover:bg-sand-100'
                  }`}
                >
                  <span>{av.label}</span>
                  {selectedAvailability === av.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-walnut-800 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Design Style Filter */}
          <div className="space-y-2 pt-2 border-t border-sand-200">
            <label className="text-xs font-bold text-walnut-700 uppercase tracking-wider block">
              Design Style
            </label>
            <div className="space-y-1">
              {styles.map((st) => {
                const val = st === 'All Styles' ? 'all' : st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStyle(val)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedStyle === val
                        ? 'bg-sand-200 text-walnut-950 font-semibold'
                        : 'text-charcoal-700 hover:bg-sand-100'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedStyle === val && (
                      <span className="w-1.5 h-1.5 rounded-full bg-walnut-800 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex">
            <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-left">
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <span className="font-serif font-bold text-lg text-walnut-900">Catalogue Filters</span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded text-charcoal-500 hover:bg-sand-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-walnut-700 uppercase tracking-wider">
                  Category
                </label>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs ${
                      selectedCategory === cat.value
                        ? 'bg-walnut-900 text-white font-medium'
                        : 'text-charcoal-700 hover:bg-sand-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="space-y-1 pt-2 border-t border-sand-200">
                <label className="text-xs font-bold text-walnut-700 uppercase tracking-wider">
                  Budget
                </label>
                {priceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPriceRange(opt.value);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs ${
                      priceRange === opt.value
                        ? 'bg-walnut-900 text-white font-medium'
                        : 'text-charcoal-700 hover:bg-sand-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => {
                    resetAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-semibold bg-sand-200 text-walnut-950 rounded-md"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCompareAlert={showToast}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl border border-sand-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center text-walnut-700 mx-auto">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-xl font-bold text-walnut-950">
                  No furniture pieces match your current filters
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Try adjusting your budget range, clearing specific style filters, or broadening
                  your search keyword.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-2 bg-walnut-900 hover:bg-walnut-800 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters & View All Products</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
