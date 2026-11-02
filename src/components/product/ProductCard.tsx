import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Maximize2, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useShowroom } from '../../context/ShowroomContext';
import { SafeImage } from '../common/SafeImage';

interface ProductCardProps {
  product: Product;
  onCompareAlert?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavourite, toggleFavourite } = useShowroom();

  const fav = isFavourite(product.id);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(product.id);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-xs furniture-card flex flex-col overflow-hidden font-sans cursor-pointer text-left select-none"
    >
      {/* 1. Isolated Product Image Container with Clean Studio Background */}
      <div className="relative w-full aspect-[4/3] bg-[#f8f6f3] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <SafeImage
          src={product.primaryImage}
          alt={product.name}
          categoryHint={product.category}
          aspectRatioClass="w-full h-full"
          className="w-full h-full flex items-center justify-center"
          imgClassName="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges / Floating Elements */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none z-10">
          {/* Badge on Top-Left (e.g. "New") */}
          <div>
            {product.badge ? (
              <span className="inline-flex items-center gap-1 bg-[#132322] text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{product.badge}</span>
              </span>
            ) : null}
          </div>

          {/* Floating White Circular Wishlist Button on Top-Right */}
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={handleFavClick}
              title={fav ? 'Remove from wishlist' : 'Save to wishlist'}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  fav
                    ? 'fill-slate-900 text-slate-900'
                    : 'text-slate-700 stroke-[1.8] group-hover:text-slate-900'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Card Content Area (Minimalist: Name + Swatches, Price, Product Dimensions) */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-grow bg-white">
        {/* Row 1: Product Name & Color Swatches */}
        <div className="flex items-center justify-between gap-1">
          <h3 className="font-bold text-[13px] sm:text-[15px] text-slate-900 line-clamp-1 group-hover:text-walnut-700 transition-colors">
            {product.name}
          </h3>

          {/* Color Swatch Dots */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {product.colors.slice(0, 2).map((col, idx) => (
                <span
                  key={idx}
                  title={col.name}
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-white ring-1 ring-slate-200/90 shadow-2xs"
                  style={{ backgroundColor: col.hex }}
                />
              ))}
              {product.colors.length > 2 && (
                <span className="text-[9px] sm:text-[10px] font-medium text-slate-400">
                  +{product.colors.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Row 2: Price in Bold */}
        <div className="mt-1 font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          {formatCurrency(product.price)}
        </div>

        {/* Row 3: Product Dimensions (Replacing rating as requested) */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight">
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {product.dimensions.width}"W × {product.dimensions.depth}"D × {product.dimensions.height}"H
          </span>
          {product.dimensions.seatingCapacity ? (
            <span className="text-slate-400 hidden xs:inline shrink-0">
              · {product.dimensions.seatingCapacity}S
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};
