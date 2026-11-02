import React, { useState } from 'react';
import { Armchair, Bed, Home, Package } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  categoryHint?: string;
  className?: string;
  aspectRatioClass?: string;
  imgClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  categoryHint,
  className = '',
  aspectRatioClass = 'aspect-[4/3]',
  imgClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Geometric fallback icon based on category hint
  const renderFallbackIcon = () => {
    const hint = (categoryHint || alt || '').toLowerCase();
    if (hint.includes('sofa') || hint.includes('seat') || hint.includes('chair')) {
      return <Armchair className="w-6 h-6 sm:w-8 sm:h-8 text-walnut-500/70 mb-1 stroke-[1.2]" />;
    }
    if (hint.includes('bed') || hint.includes('mattress')) {
      return <Bed className="w-6 h-6 sm:w-8 sm:h-8 text-walnut-500/70 mb-1 stroke-[1.2]" />;
    }
    if (hint.includes('wardrobe') || hint.includes('storage') || hint.includes('cabinet')) {
      return <Package className="w-6 h-6 sm:w-8 sm:h-8 text-walnut-500/70 mb-1 stroke-[1.2]" />;
    }
    return <Home className="w-6 h-6 sm:w-8 sm:h-8 text-walnut-500/70 mb-1 stroke-[1.2]" />;
  };

  if (!src || hasError) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-gradient-to-br from-sand-100 via-sand-200 to-walnut-100 flex flex-col items-center justify-center p-2 sm:p-4 text-center select-none relative overflow-hidden border border-sand-200/60 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4A3324_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 flex flex-col items-center">
          {renderFallbackIcon()}
          <span className="text-[10px] uppercase tracking-widest text-walnut-800 font-medium">
            ALISHAN
          </span>
          <span className="text-[9px] text-walnut-600 line-clamp-1 mt-0.5 max-w-[140px]">
            {alt || 'Handcrafted Furniture'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full ${aspectRatioClass} bg-sand-100 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-sand-200/70 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-walnut-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName || className}`}
        {...rest}
      />
    </div>
  );
};
