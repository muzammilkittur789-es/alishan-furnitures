import React from 'react';
import { Link } from 'react-router-dom';
import { useShowroom } from '../../context/ShowroomContext';
import { SafeImage } from '../common/SafeImage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export interface CategoryCircleItem {
  id: string;
  name: string;
  query: string;
  image: string;
}

export const CATEGORIES: CategoryCircleItem[] = [
  {
    id: 'all',
    name: 'All',
    query: 'All',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
  {
    id: 'sofas',
    name: 'Sofas & Seating',
    query: 'Sofas & Seating',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
  {
    id: 'beds',
    name: 'Beds',
    query: 'Beds & Bedroom Furniture',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
  {
    id: 'dining',
    name: 'Dining',
    query: 'Dining Tables & Chairs',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
  {
    id: 'wardrobes',
    name: 'Wardrobes',
    query: 'Wardrobes & Storage',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
  {
    id: 'tv',
    name: 'TV Units',
    query: 'TV Units & Entertainment',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
  {
    id: 'office',
    name: 'Office Furniture',
    query: 'Office Furniture',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&crop=center&w=240&h=240&q=80',
  },
];

interface CircularCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CircularCategories: React.FC<CircularCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { recordEvent } = useShowroom();
  const { ref, isRevealed } = useScrollReveal(0.08);

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    cat: CategoryCircleItem
  ) => {
    onSelectCategory(cat.id);
    recordEvent('category_filter', {
      category: cat.query,
      metadata: { context: 'circular_category_icons', label: cat.name, selectedId: cat.id },
    });

    // Smoothly scroll the tapped button into view horizontally on mobile
    if (e.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-sans">
      <div className={`flex items-center justify-between mb-4 reveal-fade-up ${isRevealed ? 'is-revealed' : ''}`}>
        <div>
          <span className="text-[11px] font-bold text-walnut-600 uppercase tracking-widest block mb-0.5">
            Quick Discovery
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
            Explore Furniture Categories
          </h2>
        </div>
        <Link
          to="/catalogue"
          className="text-xs font-semibold text-walnut-800 hover:text-walnut-950 transition-colors hidden sm:inline-block"
        >
          View All Categories →
        </Link>
      </div>

      {/* Horizontally scrollable row on mobile with smooth scrolling; responsive grid on desktop */}
      <div
        role="tablist"
        aria-label="Furniture category filters"
        className="flex sm:grid sm:grid-cols-4 md:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1.5 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={(e) => handleCategoryClick(e, cat)}
              className={`group flex flex-col items-center text-center shrink-0 w-[74px] xs:w-20 sm:w-auto transition-transform active:scale-95 duration-200 cursor-pointer focus:outline-hidden reveal-scale-in ${
                isRevealed ? 'is-revealed' : ''
              }`}
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              {/* Consistent Circular Image Container - Strict 1:1 circle with active highlight */}
              <div
                className={`w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 aspect-square rounded-full overflow-hidden transition-all duration-300 p-0.5 shrink-0 flex items-center justify-center mx-auto ${
                  isSelected
                    ? 'border-[3px] border-walnut-950 ring-4 ring-walnut-900/20 shadow-md scale-105 bg-walnut-950/5'
                    : 'border-2 border-sand-300 group-hover:border-walnut-700 bg-sand-100 shadow-xs group-hover:shadow-md group-hover:scale-105'
                }`}
              >
                <div className="w-full h-full aspect-square rounded-full overflow-hidden relative">
                  <SafeImage
                    src={cat.image}
                    alt={cat.name}
                    categoryHint={cat.name}
                    aspectRatioClass="aspect-square"
                    className="w-full h-full rounded-full"
                    imgClassName={`w-full h-full object-cover rounded-full transition-transform duration-500 ease-out ${
                      isSelected ? 'scale-105' : 'group-hover:scale-110'
                    }`}
                  />
                </div>
              </div>

              {/* Category Label beneath icon with active indicator */}
              <div className="flex flex-col items-center mt-2 w-full">
                <span
                  className={`text-xs transition-colors duration-200 text-center line-clamp-1 leading-tight w-full truncate ${
                    isSelected
                      ? 'font-bold text-walnut-950'
                      : 'font-medium text-charcoal-700 group-hover:text-walnut-900'
                  }`}
                >
                  {cat.name}
                </span>

                {/* Visible active state indicator */}
                {isSelected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-walnut-950 mt-1 transition-all duration-200 animate-in fade-in zoom-in" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
